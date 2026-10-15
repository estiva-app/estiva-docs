// node --test scripts/decision-pointers.test.mjs
//
// A throwaway git repo with one pointer per line, judged against made-up
// records, so each kind of bad pointer is seen to fail.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { findPointers, judge } from './decision-pointers.mjs'

const URL = 'https://github.com/estiva-app/estiva-docs/blob/main/decisions/'

const RECORDS = {
  '0001-relay-canonical-by-default.md': 'Accepted',
  'person-links-carry-the-key.md': 'Accepted',
  'person-links-name-the-handle.md': 'Superseded by person-links-carry-the-key.md',
  'folders-are-labels.md': 'Proposed',
}
const names = Object.keys(RECORDS)
const read = (name) => `# A record\n\n- Date: 2026-10-15\n- Status: ${RECORDS[name]}\n- Area: People\n`

function pointersIn(lines, file = 'code.ts', more = {}) {
  const repo = mkdtempSync(join(tmpdir(), 'pointers-'))
  try {
    execFileSync('git', ['init', '-q', repo])
    for (const [path, text] of Object.entries({ [file]: lines.join('\n') + '\n', ...more })) {
      mkdirSync(dirname(join(repo, path)), { recursive: true })
      writeFileSync(join(repo, path), text)
      execFileSync('git', ['-C', repo, 'add', path])
    }
    return findPointers(repo)
  } finally {
    rmSync(repo, { recursive: true, force: true })
  }
}

test('a pointer to an Accepted record passes, in either form', () => {
  const pointers = pointersIn([
    `// why: ${URL}person-links-carry-the-key.md`,
    '// see estiva-docs/decisions/0001-relay-canonical-by-default.md',
    '// see estiva-docs/decisions/0001',
  ])
  assert.equal(pointers.length, 3)
  assert.deepEqual(judge(pointers, names, read), [])
})

test('a pointer to a superseded record fails and names its replacement', () => {
  const problems = judge(pointersIn([`// why: ${URL}person-links-name-the-handle.md`]), names, read)
  assert.equal(problems.length, 1)
  assert.match(problems[0], /^code\.ts:1: .*Superseded by person-links-carry-the-key\.md/)
})

test('a pointer to a Proposed record fails', () => {
  assert.match(judge(pointersIn([`// ${URL}folders-are-labels.md`]), names, read)[0], /is Proposed/)
})

test('a pointer to a record that is not on main fails', () => {
  assert.match(judge(pointersIn([`// ${URL}no-such-call.md`]), names, read)[0], /not on estiva-docs origin\/main/)
})

test('links to the README, the template, research and briefs are not pointers', () => {
  const pointers = pointersIn([
    `// ${URL}README.md`,
    `// ${URL}template.md`,
    `// ${URL}research/SHR-7-screener-and-desk.md`,
    `// ${URL}briefs/person-links.html`,
  ])
  assert.deepEqual(pointers, [])
})

test('a pointer that ends a sentence still names its record', () => {
  const pointers = pointersIn([`// why: ${URL}person-links-carry-the-key.md.`])
  assert.equal(pointers[0].ref, 'person-links-carry-the-key.md')
  assert.deepEqual(judge(pointers, names, read), [])
})

test('a cut-off name is not completed to whichever record starts with it', () => {
  const problems = judge(pointersIn(['// see estiva-docs/decisions/person-links']), names, read)
  assert.match(problems[0], /not on estiva-docs origin\/main/)
})

test('a pointer to a branch other than main fails', () => {
  const link = 'https://github.com/estiva-app/estiva-docs/blob/some-branch/decisions/person-links-carry-the-key.md'
  assert.match(judge(pointersIn([`// ${link}`]), names, read)[0], /on some-branch, not main/)
})

test('a path that is not a repository says so in one line', () => {
  assert.throws(() => findPointers(join(tmpdir(), 'no-such-repo-' + process.pid)), /^Error: cannot search /)
})

test("this repository's own scan skips the bad pointers this file holds on purpose", () => {
  const bad = `// ${URL}no-such-record.md`
  const pointers = pointersIn([bad], 'scripts/decision-pointers.test.mjs', { 'other.ts': bad + '\n' })
  assert.deepEqual(pointers.map((p) => p.file), ['other.ts'])
})

test('two pointers on one line are both checked', () => {
  const pointers = pointersIn([`// ${URL}folders-are-labels.md and ${URL}person-links-carry-the-key.md`])
  assert.equal(pointers.length, 2)
  assert.equal(judge(pointers, names, read).length, 1)
})
