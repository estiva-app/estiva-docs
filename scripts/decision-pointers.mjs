// node scripts/decision-pointers.mjs <repo> [--no-fetch]
//
// Code points to the record that explains it ("why: https://github.com/
// estiva-app/estiva-docs/blob/main/decisions/<name>.md"). This finds every such
// pointer in a repo's tracked files, and checks that each names a record on
// estiva-docs origin/main that is Accepted: a pointer to a Proposed, Rejected or
// Superseded record means the code follows a call that does not govern it.
//
// The app repos are private, so estiva-docs CI cannot scan them; /land runs this
// on the pull request's repo instead. It reads the records from this checkout's
// origin/main after fetching it, not from the working tree, so a record that is
// only on a branch does not count.

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from './decisions.mjs'

// The GitHub URL form, and the older path form ("estiva-docs/decisions/0001…").
// A path that goes on into a subfolder (research/, briefs/) is not a record.
// What comes before "estiva-docs/" is kept: only this repository counts, as
// github.com/estiva-app/… or the path to the sibling checkout ("../estiva-docs/…").
// A session follows a pointer, so one to a fork or another host with a real
// record's name is a problem, not a pass.
const POINTER = /([^\s'"`(<[]*)estiva-docs\/(?:blob\/([^/\s]+)\/)?decisions\/([A-Za-z0-9._-]+)(\/)?/g
const OURS = /^(?:(?:https?:\/\/)?github\.com\/estiva-app\/|(?:\.\.\/)+|~\/estiva\/)?$/
const GREP = 'estiva-docs/(blob/[^/ ]+/)?decisions/[A-Za-z0-9._-]+'
const NOT_RECORDS = new Set(['README.md', 'template.md'])
// This check's own tests hold bad pointers on purpose, so that each kind is
// seen to fail; scanning estiva-docs itself must not report them.
const NOT_SCANNED = [':(exclude)scripts/decision-pointers.test.mjs']

/** Every pointer in `repo`'s tracked files: { file, line, ref, branch }. */
export function findPointers(repo) {
  let out
  try {
    out = execFileSync('git', ['-C', repo, 'grep', '-nIE', GREP, '--', '.', ...NOT_SCANNED], { encoding: 'utf8', maxBuffer: 64e6, stdio: 'pipe' })
  } catch (e) {
    if (e.status === 1) return [] // git grep found nothing
    throw new Error(`cannot search ${repo}: ${String(e.stderr || e.message).trim()}`)
  }
  const pointers = []
  for (const row of out.split('\n')) {
    const m = row.match(/^(.+?):(\d+):(.*)$/)
    if (!m) continue
    for (const p of m[3].matchAll(POINTER)) {
      // A pointer that ends a sentence keeps its full stop out of the name.
      const ref = p[3].replace(/\.+$/, '')
      if (!p[4] && !NOT_RECORDS.has(ref)) {
        pointers.push({ file: m[1], line: Number(m[2]), ref, branch: p[2] ?? null, ...(OURS.test(p[1]) ? {} : { foreign: p[1] }) })
      }
    }
  }
  return pointers
}

/**
 * The problems with `pointers`, given the record names on origin/main and a way
 * to read one. A bare number (the older "decisions/0001" form) names the record
 * it is the start of; any other name must be whole.
 */
export function judge(pointers, names, read) {
  const problems = []
  const statuses = new Map()
  const statusOf = (name) => {
    if (!statuses.has(name)) statuses.set(name, parse(read(name)).fields.Status ?? '(no Status)')
    return statuses.get(name)
  }
  for (const { file, line, ref, branch, foreign } of pointers) {
    const at = `${file}:${line}`
    if (foreign !== undefined) {
      problems.push(`${at}: points to decisions/${ref} under ${foreign}, not github.com/estiva-app/estiva-docs; a session would read a page we do not control`)
      continue
    }
    if (branch && branch !== 'main') {
      problems.push(`${at}: points to decisions/${ref} on ${branch}, not main; a branch link breaks once it is deleted`)
      continue
    }
    const name = names.includes(ref)
      ? ref
      : names.includes(ref + '.md')
        ? ref + '.md'
        : /^\d{4}$/.test(ref)
          ? names.find((n) => n.startsWith(ref + '-'))
          : null
    if (!name) {
      problems.push(`${at}: points to decisions/${ref}, which is not on estiva-docs origin/main`)
      continue
    }
    const status = statusOf(name)
    if (status !== 'Accepted') {
      const why = status.startsWith('Superseded by')
        ? `is ${status}: point to that record, or change the code to follow it`
        : `is ${status}: only an Accepted record governs code`
      problems.push(`${at}: decisions/${name} ${why}`)
    }
  }
  return problems
}

function main() {
  const args = process.argv.slice(2)
  const repo = args.find((a) => !a.startsWith('--'))
  if (!repo) {
    console.error('usage: node scripts/decision-pointers.mjs <repo> [--no-fetch]')
    process.exit(2)
  }
  const docs = join(dirname(fileURLToPath(import.meta.url)), '..')
  const git = (...a) => execFileSync('git', ['-C', docs, ...a], { encoding: 'utf8', maxBuffer: 64e6 })
  if (!args.includes('--no-fetch')) git('fetch', '-q', 'origin', 'main')
  const names = git('ls-tree', '--name-only', 'origin/main', 'decisions/')
    .split('\n')
    .filter((p) => p.endsWith('.md'))
    .map((p) => p.slice('decisions/'.length))
  let pointers
  try {
    pointers = findPointers(repo)
  } catch (e) {
    console.error(e.message)
    process.exit(2)
  }
  const problems = judge(pointers, names, (name) => git('show', `origin/main:decisions/${name}`))
  for (const p of problems) console.log(p)
  const ok = pointers.length - problems.length
  console.log(`${pointers.length} pointer(s) in ${repo}; ${ok} to an Accepted record, ${problems.length} problem(s).`)
  process.exit(problems.length ? 1 : 0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
