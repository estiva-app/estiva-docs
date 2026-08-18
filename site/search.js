/**
 * Client-side search over the whole corpus.
 *
 * The index is prepended to this file at build time as `window.__DOCS__`. Eight
 * documents is small enough that a linear scan on every keystroke is instant,
 * so there is no index structure to keep correct and nothing to go stale.
 */
;(() => {
  const docs = window.__DOCS__ || []
  const input = document.getElementById('q')
  const panel = document.getElementById('results')
  if (!input || !panel) return

  let active = -1

  const escapeHtml = (s) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

  /** A window of text around the first hit, so the result shows why it matched. */
  function snippet(body, term) {
    const at = body.toLowerCase().indexOf(term)
    if (at < 0) return ''
    const from = Math.max(0, at - 60)
    const text = (from > 0 ? '…' : '') + body.slice(from, at + term.length + 90) + '…'
    const i = text.toLowerCase().indexOf(term)
    return (
      escapeHtml(text.slice(0, i)) +
      '<mark>' + escapeHtml(text.slice(i, i + term.length)) + '</mark>' +
      escapeHtml(text.slice(i + term.length))
    )
  }

  function search(term) {
    const q = term.trim().toLowerCase()
    if (q.length < 2) return []
    return docs
      .map((d) => {
        const inTitle = d.t.toLowerCase().includes(q)
        const at = d.b.toLowerCase().indexOf(q)
        if (!inTitle && at < 0) return null
        // Title matches first; then earlier matches, which in these documents
        // means the section that introduces the term rather than a later aside.
        return { d, score: (inTitle ? -1e6 : 0) + (at < 0 ? 1e5 : at) }
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map(({ d }) => ({ ...d, snip: snippet(d.b, q) }))
  }

  function render(hits, q) {
    active = -1
    if (!q || q.trim().length < 2) { panel.hidden = true; return }
    panel.hidden = false
    if (!hits.length) {
      panel.innerHTML = `<div class="empty">No matches for “${escapeHtml(q)}”</div>`
      return
    }
    panel.innerHTML = hits
      .map(
        (h) =>
          `<a href="${h.u}"><div class="r-sec">${escapeHtml(h.s)}</div>` +
          `<div class="r-title">${escapeHtml(h.t)}</div>` +
          (h.snip ? `<div class="r-snip">${h.snip}</div>` : '') +
          `</a>`,
      )
      .join('')
  }

  input.addEventListener('input', () => render(search(input.value), input.value))
  input.addEventListener('focus', () => render(search(input.value), input.value))

  input.addEventListener('keydown', (e) => {
    const links = [...panel.querySelectorAll('a')]
    if (e.key === 'Escape') { panel.hidden = true; input.blur(); return }
    if (!links.length) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
      links.forEach((a, i) => a.classList.toggle('active', i === active))
      links[active].scrollIntoView({ block: 'nearest' })
    }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); links[active].click() }
  })

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== input) panel.hidden = true
  })

  // `/` focuses search, the convention every docs site shares.
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus() }
  })

  const menu = document.querySelector('.menu')
  menu?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open')
    menu.setAttribute('aria-expanded', String(open))
  })
})()
