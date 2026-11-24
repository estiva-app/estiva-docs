# An app makes another app's kind of file in place, by following the action that app's manifest declares, so the person never leaves what they are doing

- Date: 2026-11-24
- Status: Accepted
- Decided by: Miky, 2026-11-24, in the kickoff session of the Ship issue `30851:b38fd2687b17bbde2e8079577cba601936acfe1b731d2d2ba7cdef29a063db46:79dc2a89-d8fd-4477-9908-67a41ca56307`, on the brief "Handing a new file over" ([page](briefs/handing-a-new-file-over.html)), answering with an option the page did not offer: "Why would not Leaf allowed to create issue or project directly in Leaf, the whole point of manifest is that any app can simply follow the manifest and perform the actions in the app so the experience is great for user"
- Supersedes in part: [an-app-declares-a-create-link-for-its-new-action](an-app-declares-a-create-link-for-its-new-action.md), its "Peek's launcher stops making Ship projects itself and opens Ship's link" and "No app's signing limits widen"
- Area: Apps & agents

## Who it affects

Miky, writing a Leaf page on 24 November, types "add an issue: escape should
keep the sentence" into Leaf's ⌘K and picks Create issue. The box's form opens
in Leaf, filled from his sentence, and Save makes the Ship issue while his page
stays where it was. Peek's ⌘K already works this way. An outside company's app
that the workspace has added does the same with Ship's issues, or with any app's
declared actions: it follows the manifest and the person stays in its app.

## Context

- Ship's manifest declares add-issue and add-project, and a launcher builds
  their events from the declaration alone (SPEC §7.3). Peek's ⌘K does, because
  Estiva ID lets Peek sign Ship's project and issue kinds (estiva-id
  `src/db/seed.ts`).
- Leaf may not sign them, so Leaf's ⌘K hid both (leaf
  `src/launcher/LeafLauncher.tsx`, `maySign`).
- The 19 October record had the owning app declare a "create here" link that a
  launcher opens, said Peek would stop making Ship projects itself, and said
  no app's signing limits widen. The 26 October record
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md))
  then said no app owns making a file of a shared type.
- The brief asked whether a launcher makes the file in place when it may, or
  always sends the person to the owner's form, and offered Leaf only the
  hand-over. Miky answered that Leaf should make it too.

## Decision

**An app makes another app's kind of file where the person is, by following
the action that app's manifest declares.** The person stays in the app they
are in; the form is the launcher's, built from the declaration and filled from
what they typed.

- Leaf's ⌘K offers Ship's Create issue and Create project and makes them in
  Leaf. Estiva ID lets Leaf sign Ship's issue and project kinds, as it lets
  Peek (KIN-11).
- Peek keeps making Ship's issues and projects in place.
- The create link of the 19 October record stays the way to offer a "New …"
  that an app may not make itself; it is built when such a case comes.

## Rejected alternatives

- **The owner's form always** (the brief's B): every Create issue, from every
  app, ends on Ship's own form. Rejected: the person leaves what they were
  doing for every new file.
- **Make it in place where allowed, hand Leaf over to Ship's form** (the
  brief's A, recommended there): Leaf would open Ship's New issue form, with the
  sentence carried in the link. Rejected: Miky, "the whole point of manifest is
  that any app can simply follow the manifest and perform the actions in the
  app".

## Consequences

- Estiva ID's list for Leaf widens by Ship's two file kinds; a compromised Leaf
  could make issues and projects, as a compromised Peek already can. The relay's
  membership checks are unchanged.
- No SPEC change and no new manifest field for KIN-11.
- Not settled here: which gate decides that an app may make a type's files, any
  app the workspace has added (Miky's words) or one whose own listing declares
  the type (the 26 October record). It is asked when Estiva ID's limits move
  from a hand-kept list to listings.
- Two-way: a launcher rule and an entry in Estiva ID's list; nothing on the
  relay depends on it.
