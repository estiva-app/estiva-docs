/**
 * Render the published markdown into a static site in `dist/`.
 *
 * No framework and no client-side router, matching the house style: one HTML
 * file per document, a sidebar rendered at build time, and a search index small
 * enough to ship inline. The whole thing is readable in one sitting, which for
 * a docs site that must outlive its author is worth more than features.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { NAV, PAGES, SITE, BY_FILE, INTERNAL } from './nav.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'dist')

const md = new MarkdownIt({ html: false, linkify: true, typographer: false })
  .use(anchor, {
    permalink: anchor.permalink.linkInsideHeader({ symbol: '#', placement: 'after' }),
    level: [2, 3],
  })

/** Collected while rendering, reported by check.mjs. */
export const problems = []

/**
 * Rewrite a link written for the repo into one that works on the site.
 *
 * Three cases, and the third is the one that matters:
 *   - external / anchor-only → untouched
 *   - points at a published doc → its slug
 *   - points at an UNPUBLISHED doc → recorded as a problem
 *
 * The last case is not rewritten to a 404. A published page linking to a page
 * nobody outside can read is a leak of the private set, one dead link at a
 * time, so the build refuses rather than papering over it.
 */
/** Repo-relative path a link points at, with directories resolved to README. */
function linkTarget(href, fromFile) {
  const [path] = href.split('#')
  // Already rewritten to a site path — recover the page by slug instead.
  if (path.startsWith('/')) {
    const slug = path.replace(/^\/|\/$/g, '') || 'index'
    return PAGES.find((p) => p.slug === slug)?.file ?? ''
  }
  let target = relative(ROOT, resolve(dirname(join(ROOT, fromFile)), path)).replace(/\\/g, '/')
  if (!target.endsWith('.md')) target = join(target, 'README.md').replace(/\\/g, '/')
  return target
}

function rewriteLink(href, fromFile) {
  if (/^(https?:|mailto:|#)/.test(href)) return href

  const [path, hash = ''] = href.split('#')
  let target = relative(ROOT, resolve(dirname(join(ROOT, fromFile)), path)).replace(/\\/g, '/')
  // A link to a directory means that directory's README, the way it resolves
  // when the same markdown is read on GitHub.
  if (!target.endsWith('.md')) target = join(target, 'README.md').replace(/\\/g, '/')

  const page = BY_FILE.get(target)
  if (page) return `/${page.slug === 'index' ? '' : page.slug + '/'}${hash ? '#' + hash : ''}`

  if (INTERNAL.has(target)) return { internal: true }

  problems.push({ from: fromFile, href, target })
  return href
}

function renderMarkdown(source, file) {
  const env = {}
  const tokens = md.parse(source, env)
  for (const token of tokens) {
    if (token.type !== 'inline') continue
    const children = token.children ?? []
    for (let n = 0; n < children.length; n++) {
      const child = children[n]
      if (child.type !== 'link_open') continue
      const i = child.attrIndex('href')
      if (i < 0) continue
      const rewritten = rewriteLink(child.attrs[i][1], file)

      if (typeof rewritten === 'string') {
        child.attrs[i][1] = rewritten

        // These documents are written to be read in the repo, so a link's text
        // is often the target's filename — "see RATIONALE.md". On the site that
        // filename is meaningless, and worse, it names a file the reader has no
        // way to open. Swap in the published page's title instead.
        const close = children.findIndex((c, k) => k > n && c.type === 'link_close')
        const text = children[n + 1]
        if (close === n + 2 && text?.type === 'text' && /^[A-Za-z0-9._-]+\.md$/.test(text.content)) {
          const page = BY_FILE.get(linkTarget(child.attrs[i][1], file))
          if (page) text.content = page.title
        }
        continue
      }

      // An internal document: turn the link into a marked span rather than a
      // dead href, so the reader learns the page exists and lives in the repo.
      //
      // Done by retyping the existing open/close tokens instead of building new
      // ones, which keeps the link's own text children exactly as they were.
      const close = children.findIndex((c, k) => k > n && c.type === 'link_close')
      if (close < 0) continue
      child.type = 'html_inline'
      child.attrs = null
      child.content = '<span class="internal-ref">'
      children[close].type = 'html_inline'
      children[close].content = '<em>internal</em></span>'
    }
  }
  return md.renderer.render(tokens, md.options, env)
}

/**
 * Wrap tables so a wide one scrolls inside its own box.
 *
 * Several of these documents have tables that are genuinely wide — the kind
 * registry, the RFC scorecard — and without this the whole page scrolls
 * sideways, which moves the sidebar off screen and reads as a broken layout.
 */
function wrapTables(html) {
  return html.replace(/<table>[\s\S]*?<\/table>/g, (t) => `<div class="table-wrap">${t}</div>`)
}

/** The first `# heading` is the page title; the site chrome shows it once. */
function stripLeadingH1(source) {
  return source.replace(/^#\s+.*\n+/, '')
}

/** Plain text for the search index — no markup, collapsed whitespace. */
function toPlainText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    // Stripping an inline tag leaves a space before the punctuation that
    // followed it, which is visible in the on-page contents.
    .replace(/\s+([,.;:)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .trim()
}

function sidebar(currentSlug) {
  return NAV.map((section) => {
    const items = section.items
      .map((item) => {
        const href = item.slug === 'index' ? '/' : `/${item.slug}/`
        const cls = item.slug === currentSlug ? ' class="current" aria-current="page"' : ''
        return `<li><a href="${href}"${cls}>${escape(item.title)}</a></li>`
      })
      .join('')
    return `<div class="nav-section"><h2>${escape(section.section)}</h2><ul>${items}</ul></div>`
  }).join('')
}

function escape(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

/** On-page contents, built from the h2s the anchor plugin has already slugged. */
function pageToc(html) {
  const headings = [...html.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<a class="header-anchor"/gs)]
  if (headings.length < 3) return ''
  const items = headings
    .map(([, id, inner]) => `<li><a href="#${id}">${toPlainText(inner)}</a></li>`)
    .join('')
  return `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ul>${items}</ul></nav>`
}

function page({ title, section, slug, body, toc, prev, next }) {
  const nextPrev = [
    prev ? `<a class="pn prev" href="${prev.slug === 'index' ? '/' : '/' + prev.slug + '/'}"><span>Previous</span>${escape(prev.title)}</a>` : '<span></span>',
    next ? `<a class="pn next" href="${next.slug === 'index' ? '/' : '/' + next.slug + '/'}"><span>Next</span>${escape(next.title)}</a>` : '<span></span>',
  ].join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} — ${escape(SITE.title)} docs</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="topbar">
  <button class="menu" aria-label="Menu" aria-expanded="false">☰</button>
  <a class="brand" href="/"><strong>${escape(SITE.title)}</strong> <span>${escape(SITE.tagline)}</span></a>
  <div class="search">
    <input type="search" id="q" placeholder="Search" autocomplete="off" aria-label="Search documentation">
    <div id="results" role="listbox" hidden></div>
  </div>
</header>
${SITE.banner ? `<div class="banner">${escape(SITE.banner)}</div>` : ''}
<div class="shell">
  <nav class="sidebar" aria-label="Documentation">${sidebar(slug)}</nav>
  <main id="content">
    <article>
      <p class="eyebrow">${escape(section)}</p>
      <h1>${escape(title)}</h1>
      ${body}
    </article>
    <div class="pagination">${nextPrev}</div>
  </main>
  ${toc}
</div>
<script src="/search.js" defer></script>
</body>
</html>
`
}

// ---------------------------------------------------------------------------

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const index = []

PAGES.forEach((p, i) => {
  const source = readFileSync(join(ROOT, p.file), 'utf8')
  const body = wrapTables(renderMarkdown(stripLeadingH1(source), p.file))
  const html = page({
    ...p,
    body,
    toc: pageToc(body),
    prev: PAGES[i - 1],
    next: PAGES[i + 1],
  })

  const dir = p.slug === 'index' ? OUT : join(OUT, p.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)

  index.push({
    t: p.title,
    s: p.section,
    u: p.slug === 'index' ? '/' : `/${p.slug}/`,
    // Enough to match on without shipping the whole corpus twice.
    b: toPlainText(body).slice(0, 12000),
  })
})

cpSync(join(ROOT, 'site/styles.css'), join(OUT, 'styles.css'))
writeFileSync(
  join(OUT, 'search.js'),
  `window.__DOCS__=${JSON.stringify(index)};\n` + readFileSync(join(ROOT, 'site/search.js'), 'utf8'),
)

if (problems.length) {
  console.error('\n  Links to unpublished documents:\n')
  for (const p of problems) console.error(`    ${p.from} → ${p.href}`)
  console.error(`
  A published page must not link to one that is not published — see the policy
  comment in site/nav.mjs. Either publish the target, or reword the link so it
  does not promise a page the reader cannot open.
`)
  process.exit(1)
}

console.log(`  built ${PAGES.length} pages → dist/`)
