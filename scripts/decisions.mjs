// The rules of decisions/ (see decisions/README.md), as a check that returns
// every problem it finds. scripts/decisions.test.mjs runs it in CI.
//
// No dependencies: the records are plain markdown, and the shape it checks is
// line-based on purpose, so a record that fails reads as wrong on GitHub too.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'

export const HEADINGS = [
  'Who it affects',
  'Context',
  'Decision',
  'Rejected alternatives',
  'Consequences',
]

export const AREAS = ['Protocol', 'Architecture', 'Product', 'Design', 'Process']

// Written before the template and never rewritten, only superseded: they keep
// their numbered names and their own section headings. Their metadata lines
// follow the format like every other record's.
export const GRANDFATHERED = new Set([
  '0001-relay-canonical-by-default.md',
  '0002-foundation-packages.md',
])

// Files in decisions/ that are not records.
const NOT_RECORDS = new Set(['README.md', 'template.md'])

const NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.md$/
const STATUS = /^(Proposed|Accepted|Rejected|Superseded by (\S+\.md))$/
const DECIDER = /^(Miky|Katerina)\b[^,]*, \S/

/** Markdown without fenced blocks, inline code and HTML comments, so a link or field inside an example is not one. */
function prose(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, '')
    .replace(/`[^`\n]*`/g, '')
}

/** Relative link targets in a markdown file (no scheme, no bare anchor). */
export function links(text) {
  const out = []
  for (const m of prose(text).matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    const href = m[1]
    if (/^([a-z][a-z0-9+.-]*:|#)/i.test(href)) continue
    out.push(href.split('#')[0])
  }
  return out
}

/** Title, `- Key: value` fields before the first `##`, and the `##` headings. */
export function parse(text) {
  const lines = text.split('\n')
  const title = lines.find((l) => l.trim())?.match(/^# (.+)$/)?.[1] ?? null
  const fields = {}
  const headings = []
  const bodies = []
  let inHead = true
  for (const line of prose(text).split('\n')) {
    const h = line.match(/^## (.+?)\s*$/)
    if (h) {
      inHead = false
      headings.push(h[1])
      bodies.push('')
      continue
    }
    if (inHead) {
      const f = line.match(/^- (Date|Status|Decided by|Area|Supersedes): (.+?)\s*$/)
      if (f) fields[f[1]] = f[2]
    } else if (bodies.length) {
      bodies[bodies.length - 1] += line.trim()
    }
  }
  return { title, fields, headings, bodies }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (name === 'node_modules' || name.startsWith('.')) return []
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.md') ? [path] : []
  })
}

function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(s + 'T00:00:00Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

/**
 * Every problem in `<root>/decisions`, as "file: what is wrong" strings.
 * `root` is the repository root; links into decisions/ from anywhere in it are checked too.
 */
export function check(root) {
  const dir = join(root, 'decisions')
  const problems = []
  const say = (file, msg) => problems.push(`${relative(root, file)}: ${msg}`)

  const names = readdirSync(dir).filter((n) => n.endsWith('.md') && !NOT_RECORDS.has(n))
  const records = new Map()
  for (const name of names) {
    const file = join(dir, name)
    records.set(name, { file, ...parse(readFileSync(file, 'utf8')) })
  }

  // The template carries the same headings the check asks for, so the two cannot drift.
  const template = parse(readFileSync(join(dir, 'template.md'), 'utf8'))
  if (template.headings.join('|') !== HEADINGS.join('|')) {
    say(join(dir, 'template.md'), `headings must be exactly: ${HEADINGS.join(', ')}`)
  }

  for (const [name, r] of records) {
    const grand = GRANDFATHERED.has(name)
    if (!grand && !NAME.test(name)) say(r.file, 'name must be kebab-case words, not a number (e.g. relay-is-canonical.md)')
    if (!r.title) say(r.file, 'must open with "# <the decision as a sentence>"')

    if (!grand) {
      let at = -1
      for (const h of HEADINGS) {
        const i = r.headings.indexOf(h)
        if (i < 0) say(r.file, `missing heading "## ${h}"`)
        else if (i < at) say(r.file, `heading "## ${h}" is out of order`)
        else if (!r.bodies[i]) say(r.file, `heading "## ${h}" is empty`)
        if (i >= 0) at = Math.max(at, i)
      }
    }

    const { Date: date, Status: status, Area: area } = r.fields
    if (!date) say(r.file, 'missing "- Date: YYYY-MM-DD"')
    else if (!validDate(date)) say(r.file, `Date "${date}" is not a YYYY-MM-DD date`)

    if (!area) say(r.file, `missing "- Area:" (one of ${AREAS.join(', ')})`)
    else if (!AREAS.includes(area)) say(r.file, `Area "${area}" is not one of ${AREAS.join(', ')}`)

    const s = status?.match(STATUS)
    if (!status) say(r.file, 'missing "- Status:"')
    else if (!s) say(r.file, `Status "${status}" must be Proposed, Accepted, Rejected or "Superseded by <name>.md"`)

    const decider = r.fields['Decided by']
    if (s && s[1] === 'Proposed') {
      if (decider) say(r.file, 'a Proposed record has no "Decided by" — nobody has decided it yet')
    } else if (s) {
      if (!decider) say(r.file, `a ${s[1].split(' ')[0]} record needs "- Decided by: Miky (or Katerina), <where>"`)
      else if (!DECIDER.test(decider)) say(r.file, `"Decided by" must name Miky or Katerina and where, not "${decider}"`)
    }
  }

  // Supersession, both directions. A record is only replaced by an Accepted one,
  // and the two records say so of each other.
  const statusOf = (name) => records.get(name)?.fields.Status?.match(STATUS)
  for (const [name, r] of records) {
    const by = statusOf(name)?.[2]
    if (by) {
      const next = records.get(by)
      if (!next) say(r.file, `Superseded by ${by}, which does not exist`)
      else {
        if (statusOf(by)?.[1] !== 'Accepted') say(r.file, `Superseded by ${by}, which is not Accepted`)
        if (next.fields.Supersedes !== name) say(next.file, `must say "- Supersedes: ${name}", which it replaces`)
      }
    }
    const old = r.fields.Supersedes
    if (old) {
      if (!records.has(old)) say(r.file, `Supersedes ${old}, which does not exist`)
      else if (statusOf(name)?.[1] === 'Accepted' && statusOf(old)?.[2] !== name) {
        say(records.get(old).file, `must say "- Status: Superseded by ${name}"`)
      } else if (statusOf(name)?.[1] !== 'Accepted' && statusOf(old)?.[2] === name) {
        say(records.get(old).file, `is Superseded by ${name}, which is not Accepted`)
      }
    }
  }

  // The README lists every record under the heading of its area.
  const readmeFile = join(dir, 'README.md')
  const readme = readFileSync(readmeFile, 'utf8')
  const sections = new Map()
  let current = null
  for (const line of prose(readme).split('\n')) {
    const h = line.match(/^## (.+?)\s*$/)
    if (h) current = h[1]
    else if (current) sections.set(current, (sections.get(current) ?? '') + line + '\n')
  }
  for (const [name, r] of records) {
    const area = r.fields.Area
    if (!AREAS.includes(area)) continue
    if (!links(sections.get(area) ?? '').includes(name)) say(readmeFile, `does not list ${name} under "## ${area}"`)
  }

  // Relative links resolve: every link inside decisions/, and every link from
  // elsewhere in the repo that points into it.
  for (const file of walk(root)) {
    const inside = file.startsWith(dir + '/')
    for (const href of links(readFileSync(file, 'utf8'))) {
      if (!href) continue
      const target = resolve(dirname(file), decodeURIComponent(href))
      if (!inside && !target.startsWith(dir + '/') && target !== dir) continue
      if (!existsSync(target)) say(file, `links to ${href}, which does not exist`)
    }
  }

  return problems
}
