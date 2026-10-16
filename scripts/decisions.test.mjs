// node --test scripts/decisions.test.mjs
//
// The first test is the one CI exists for: the real decisions/ folder keeps its
// rules. The rest plant one broken record each in a copy of a small folder, so a
// rule that stops firing fails here rather than letting a bad record through.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { check } from './decisions.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

test('decisions/ follows its rules', () => {
  const problems = check(ROOT)
  assert.deepEqual(problems, [], '\n' + problems.join('\n'))
})

function record({ title = 'Records live in one folder', fields = {}, headings } = {}) {
  const f = { Date: '2026-10-15', Status: 'Accepted', 'Decided by': 'Miky, in the shaping session', Area: 'Process', ...fields }
  const head = Object.entries(f)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')
  const body = (headings ?? ['Who it affects', 'Context', 'Decision', 'Rejected alternatives', 'Consequences'])
    .map((h) => `## ${h}\n\nSomething true.\n`)
    .join('\n')
  return `# ${title}\n\n${head}\n\n${body}`
}

/** A repo with decisions/ holding `files`, and a README listing each under its area. */
function fixture(files, { readme } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'decisions-'))
  mkdirSync(join(root, 'decisions'))
  copyFileSync(join(ROOT, 'decisions/template.md'), join(root, 'decisions/template.md'))
  for (const [name, text] of Object.entries(files)) writeFileSync(join(root, 'decisions', name), text)
  const list = Object.keys(files).map((n) => `- [${n}](${n})`).join('\n')
  writeFileSync(join(root, 'decisions/README.md'), readme ?? `# Records by area\n\n## Process\n\n${list}\n`)
  return root
}

function problemsOf(files, opts) {
  const root = fixture(files, opts)
  try {
    return check(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function assertFlags(problems, pattern) {
  assert.ok(problems.some((p) => pattern.test(p)), `expected a problem matching ${pattern}, got:\n${problems.join('\n') || '(none)'}`)
}

test('a well-formed record passes', () => {
  assert.deepEqual(problemsOf({ 'one-folder.md': record() }), [])
})

test('a missing heading fails', () => {
  const headings = ['Who it affects', 'Context', 'Decision', 'Consequences']
  assertFlags(problemsOf({ 'one-folder.md': record({ headings }) }), /missing heading "## Rejected alternatives"/)
})

test('headings out of order fail', () => {
  const headings = ['Context', 'Who it affects', 'Decision', 'Rejected alternatives', 'Consequences']
  assertFlags(problemsOf({ 'one-folder.md': record({ headings }) }), /out of order/)
})

test('an unknown Status fails', () => {
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { Status: 'accepted' } }) }), /Status "accepted"/)
})

test('a bad Date fails', () => {
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { Date: '2026-02-30' } }) }), /not a YYYY-MM-DD date/)
})

test('an Accepted record needs a person to have decided it', () => {
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { 'Decided by': undefined } }) }), /needs "- Decided by/)
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { 'Decided by': 'Claude, in a PR' } }) }), /must name Miky or Katerina/)
})

test('a Proposed record has nobody who decided it', () => {
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { Status: 'Proposed' } }) }), /Proposed record has no "Decided by"/)
})

test('a numbered or non-kebab name fails', () => {
  assertFlags(problemsOf({ '0003-one-folder.md': record() }), /kebab-case/)
  assertFlags(problemsOf({ 'One_Folder.md': record() }), /kebab-case/)
})

test('a link to a record that does not exist fails', () => {
  const text = record().replace('Something true.', 'See [the old one](gone.md).')
  assertFlags(problemsOf({ 'one-folder.md': text }), /links to gone\.md, which does not exist/)
})

test('a record replaced by one that is not Accepted fails', () => {
  const old = record({ title: 'Old', fields: { Status: 'Superseded by new-way.md' } })
  const next = record({ title: 'New', fields: { Status: 'Proposed', 'Decided by': undefined, Supersedes: 'old-way.md' } })
  assertFlags(problemsOf({ 'old-way.md': old, 'new-way.md': next }), /Superseded by new-way\.md, which is not Accepted/)
})

test('a replacement and the record it replaces must name each other', () => {
  const old = record({ title: 'Old' })
  const next = record({ title: 'New', fields: { Supersedes: 'old-way.md' } })
  assertFlags(problemsOf({ 'old-way.md': old, 'new-way.md': next }), /must say "- Status: Superseded by new-way\.md"/)
})

test('a proper supersession passes', () => {
  const old = record({ title: 'Old', fields: { Status: 'Superseded by new-way.md' } })
  const next = record({ title: 'New', fields: { Supersedes: 'old-way.md' } })
  assert.deepEqual(problemsOf({ 'old-way.md': old, 'new-way.md': next }), [])
})

test('a reference-style link to a record that does not exist fails', () => {
  const text = record().replace('Something true.', 'See [the old one][old].\n\n[old]: gone.md')
  assertFlags(problemsOf({ 'one-folder.md': text }), /links to gone\.md, which does not exist/)
})

test('a section holding only a subheading is empty', () => {
  const text = record().replace('## Rejected alternatives\n\nSomething true.', '## Rejected alternatives\n\n### None')
  assertFlags(problemsOf({ 'one-folder.md': text }), /"## Rejected alternatives" is empty/)
})

test('a chain of supersessions passes when it ends at an Accepted record, and fails when it ends at a Proposed one', () => {
  const first = record({ title: 'First', fields: { Status: 'Superseded by second-way.md' } })
  const second = record({ title: 'Second', fields: { Status: 'Superseded by third-way.md', Supersedes: 'first-way.md' } })
  const third = record({ title: 'Third', fields: { Supersedes: 'second-way.md' } })
  assert.deepEqual(problemsOf({ 'first-way.md': first, 'second-way.md': second, 'third-way.md': third }), [])
  const proposed = record({ title: 'Third', fields: { Status: 'Proposed', 'Decided by': undefined, Supersedes: 'second-way.md' } })
  assertFlags(problemsOf({ 'first-way.md': first, 'second-way.md': second, 'third-way.md': proposed }), /Superseded by third-way\.md, which is not Accepted/)
})

test('a backticked Supersedes is still read', () => {
  const old = record({ title: 'Old', fields: { Status: 'Superseded by new-way.md' } })
  const next = record({ title: 'New', fields: { Supersedes: '`old-way.md`' } })
  assert.deepEqual(problemsOf({ 'old-way.md': old, 'new-way.md': next }), [])
})

test('a record in a subfolder fails', () => {
  const root = fixture({ 'one-folder.md': record() })
  try {
    mkdirSync(join(root, 'decisions/product'))
    writeFileSync(join(root, 'decisions/product/hidden.md'), '# Not checked otherwise\n')
    assertFlags(check(root), /decisions\/product\/hidden\.md: a record goes directly in decisions\//)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('an Area that is not a README heading under "Records by area" fails', () => {
  assertFlags(problemsOf({ 'one-folder.md': record({ fields: { Area: 'Folders' } }) }), /Area "Folders" is not one of Process/)
  const readme = '# Decisions\n\n## Process\n\n- [x](one-folder.md)\n'
  assertFlags(problemsOf({ 'one-folder.md': record() }, { readme }), /needs a "# Records by area" heading/)
})

test('a README listing with ./ counts', () => {
  const files = { 'one-folder.md': record() }
  assert.deepEqual(problemsOf(files, { readme: '# Records by area\n\n## Process\n\n- [x](./one-folder.md)\n' }), [])
})

test('a record missing from the README, or under the wrong area, fails', () => {
  const files = { 'one-folder.md': record() }
  assertFlags(problemsOf(files, { readme: '# Records by area\n\n## Process\n\nNone yet.\n' }), /does not list one-folder\.md under "## Process"/)
  assertFlags(problemsOf(files, { readme: '# Records by area\n\n## Process\n\nNone yet.\n\n## Product\n\n- [x](one-folder.md)\n' }), /does not list one-folder\.md under "## Process"/)
})
