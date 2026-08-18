/**
 * Local preview of the built site, with the same Basic Auth gate production
 * uses — so "it works locally" and "it works behind the password" are the same
 * statement rather than two hopes.
 *
 *   npm run serve                        no auth, plain preview
 *   DOCS_PASSWORD=hunter2 npm run serve  gated, exactly like the box
 */
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { timingSafeEqual } from 'node:crypto'

const PORT = Number(process.env.PORT ?? 5195)
const ROOT = resolve(import.meta.dirname, '..', 'dist')
const USER = process.env.DOCS_USER ?? 'estiva'
const PASSWORD = process.env.DOCS_PASSWORD ?? ''

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
}

/** Constant-time compare, so a wrong password cannot be found byte by byte. */
function matches(given, expected) {
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function authorised(req) {
  if (!PASSWORD) return true
  const header = req.headers.authorization ?? ''
  if (!header.startsWith('Basic ')) return false
  const [user, ...rest] = Buffer.from(header.slice(6), 'base64').toString().split(':')
  return matches(user, USER) && matches(rest.join(':'), PASSWORD)
}

createServer((req, res) => {
  if (!authorised(req)) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Estiva docs"' })
    return res.end('Unauthorized')
  }

  // `normalize` before joining, so `..` in a URL cannot escape dist/.
  const url = decodeURIComponent((req.url ?? '/').split('?')[0])
  let path = join(ROOT, normalize(url))
  if (!path.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden') }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html')

  if (!existsSync(path)) { res.writeHead(404); return res.end('Not found') }

  res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' })
  res.end(readFileSync(path))
}).listen(PORT, () => {
  console.log(`\n  →  http://localhost:${PORT}/`)
  console.log(PASSWORD ? `     gated: ${USER} / (DOCS_PASSWORD)\n` : '     no password set — set DOCS_PASSWORD to preview the gate\n')
})
