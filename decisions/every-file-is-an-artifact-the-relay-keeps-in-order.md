# A file's own state is an upstream Buzz artifact the relay keeps in order; everything else names the file by one reference

- Date: 2026-10-29
- Status: Accepted
- Decided by: Miky, in the shaping session of "A load stays the same size as edits pile up" (2026-10-29), on the brief "What a file is" v3 ([page](briefs/what-a-file-is.html)): D1 a and D2 a first; then A as a hybrid, after asking for the trade-offs side by side; then D3–D6 as recommended
- Area: Files

> Superseded in part, 2026-10-29: the part "in one single-letter tag that
> every comment, mention, listing, unread state, card and chip uses" is
> replaced by
> [a-file-is-named-by-its-id-in-a-capital-and-small-tag](a-file-is-named-by-its-id-in-a-capital-and-small-tag.md):
> one letter in two cases, and a chip in text is the file's link. The rest of
> this record stands.

> Supersedes in part
> [a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)
> (a number per type, the relay-signed summary, text in an event of its own),
> [a-files-text-is-a-readable-snapshot](a-files-text-is-a-readable-snapshot.md)
> ("the last save wins"),
> [estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md)
> (numbers and the kind registry),
> [a-card-changes-what-a-files-app-shares](a-card-changes-what-a-files-app-shares.md)
> ("none converts into another"; "the owner keeps a field to itself by not
> sharing it" becomes per type),
> [a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)
> ("deleting a file is to remove every save") and
> [a-shared-folder-lives-on-both-relays-and-its-host-runs-it](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md)
> ("every relay folds the same events into the same result"; the host may
> remove a partner's save only within limits the exchange sets). The rest of
> each stands. SPEC §6.5 ("nobody may delete another person's work") changes
> with D3 when the SPEC describes artifacts.

## Who it affects

Miky and Katerina: a list (a Ship project, a Leaf Folder) loads each file as it
is now, and stays that size however many edits pile up. Leaf and Ship already
say "Katerina saved a newer version. Load it (replaces your changes)", which
offers only to lose one person's words; with the relay refusing a save made on
an out-of-date copy in every app and agent, the app keeps both, and asks only
about a block both people changed. History shows whole versions. Anyone who may
edit a file can delete it and anyone can bring it back. Who is on a file,
comments, listings and unread state behave as today.

An outside company holds a file's own state on upstream Buzz as it ships, and
needs our listings, membership and unread state beside it. A builder invents
`acme.candidate` with filterable properties as tags and asks nobody for a
number; when it is standardised, its files convert in place.

It came up on 29 October, shaping "A load stays the same size as edits pile
up" (initiative "Peek, Ship and Leaf are fast", step 3), on the brief "What a
file is" (version 3, after a product and protocol review of version 2).

## Context

- A file today is a root event (`30840`, `30842`, `30850`, `30851`) plus
  `kind:1851` changes, one field each, folded newest per field by `ts`, then
  `created_at`, then id (SPEC §6.1–§6.3, §6.10). Membership is a `1851` per
  person, `member:<P>` (§11.8). Comments, mentions, listings, read state,
  cards and parts name a file by `kind:pubkey:d` (§6.4, §3, §11.1, §13.6).
- Production, 29 Oct: 2,732 text saves, 42.0 MB, and 3,649 other changes,
  2.2 MB, across 1,171 files, growing 8–17 MB a week; a cold Ship load is
  53 MB, 43.8 MB of it `1851`. The newest value of every field is 1.5 MB, every
  file's newest text 5.1 MB.
- Two saves crossing, 29 Oct: Miky's and Katerina's keys never changed one file
  within a minute of each other. Of 17 text saves within 60 s of another
  person's, 16 were QA-1, QA-2 or Claude; text was lost twice, both in QA
  probes. Leaf's and Ship's shared editor shows the notice above while the
  cursor is in the page; a save names no version it was made on; the agent's
  `edit-issue` does not check between its read and its write.
- Upstream Buzz merged NIP-AR "Channel Artifacts" on 28 Sep (#7919):
  `kind:45010` saves, each a whole snapshot naming the save it was made on
  (`prev`); identity `(community, d)`; read and write follow the home `h`; a
  stale save is refused. Delete and restore are saves anyone who may post in
  the home may make; `9005` redaction by the author, a channel admin or the
  agent's owner; redacting the current save retires the artifact. `d` and
  `type` are immutable, which NIP-AP relies on. `/query` answers current state
  and history with exact tag matches, always with `content`; a live REQ
  refuses multi-letter tags on artifacts; a save sends no push. Upstream has no
  artifact search.
- Our relay gates artifacts behind an `artifacts` build feature, off. Search
  indexes messages, comments, profiles and file titles (`1851` `title`/`ref`),
  not file text. Event content is capped at 256 KB.
- Today 24 of 34 projects are readable by everyone in the workspace; their
  issues only by their Folder.
- The four Files records of 26 Oct chose a relay-signed summary per file, text
  in an event of its own and a number per shared type; none is built and the
  SPEC does not describe them yet. On 29 Oct Miky decided that shared types
  carry the protocol's name, builders name their own types and launch,
  standardised types convert, Leaf tabs are sections of one document, old
  chips and references are migrated or dropped with no compatibility layer,
  and search must work before any type moves.

## Decision

- **A file's own state is a NIP-AR artifact**: its fields and its text, whole
  in each save. The relay keeps saves in order and refuses a stale one. Every
  save is signed by a person.
- **A refused save merges (D4)**: different fields and different blocks merge
  without asking; only a block both people changed asks. Katerina designs how
  it looks, from a Storybook prototype, before it is built.
- **One reference names a file everywhere (D1)**: its workspace-unique `d`, in
  one single-letter tag that every comment, mention, listing, unread state,
  card and chip uses, in the SPEC and proposed upstream beside NIP-AR. Old
  references are rewritten by the migration or left dead
  ([early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)).
- **Who is on a file stays beside it (D2)**: one small event per join, add or
  leave, naming the file by that reference; the three membership records stand.
- **Shared types carry the protocol's name** (Miky, 29 Oct): `osnova.issue`,
  `osnova.project`, `osnova.document`, `osnova.topic`, singular, in the Osnova
  directory Estiva curates in public; `estiva.*` and `acme.*` for an app's own
  types and extensions. Builders name their own types and launch. The
  protocol's name is final before the first file is written.
- **A standardised type converts in place (D6)**: one "convert" save changes
  the type and keeps the id, links, conversation and history; it is allowed
  only for types whose directory entry names the target, so agent settings are
  never touched.
- **A list reads current saves without their text**, a query option our relay
  adds. Estiva ID limits which types an app or agent signs; a move changes only
  where a file is listed until the navigation rework's access call.
- **Upstream**: the reference, lists without text and convert are proposed to
  Block during the first stage; any they refuse we carry as our rule.
- **Search covers each file's current version only**: title, text-valued
  properties and text, every word as a word start, under the home's read
  access; a Done-when leg of the first stage.
- **Delete is restorable, by anyone who may edit the file, and shows who did it
  (D3)**; removing a save for good, for a pasted password, is an admin's
  separate action.
- **A project's home is its Folder or team, Company by default (D5)**; its
  readers are the home's members.
- **In a shared Folder the host's relay orders each file's saves**; the
  exchange carries the order and limits what the host may remove of a
  partner's words.
- **Migration**: each file's current state becomes its first save; older
  changes stay readable as they are, never re-signed as versions nobody saved.
- Built in stages, one type end to end with search first, by the project "A
  load stays the same size as edits pile up".

## Rejected alternatives

- **The 26 Oct shape (Accepted, not built).** The relay adds up field changes
  and signs a summary; text in its own event; a number per type. Flat lists,
  but two saves crossing stay each app's problem, the relay repeats every
  app's fold, and Miky's 29 Oct naming call changes its numbers anyway.
- **C · Field changes ordered by the relay.** Each change names the one it
  follows for its field; the relay refuses a stale one and answers the newest
  of each. Linear's shape: per-field authority kept, different fields never
  collide, close to two-way. New relay code of our own (a head per file and
  field, a backfill, a bulk read), our own standard that an outside company
  gets only by running our relay, and an index of current values built by us.
- **Ask Block first, then A or C.** Holds the call until Block answers on the
  three proposals. Turned down: A is taken, and what Block refuses we carry.
- **B · A with a number per type.** The same for people; our own variant of
  NIP-AR for good, refused by upstream relays, against Miky's naming call.
- **The reference (D1):** today's `kind:pubkey:d` rules out artifacts and
  converting; naming the first save (version 2) loses the file when that save
  is redacted.
- **Membership (D2):** inside the file's saves, adding a person becomes editing
  the file, and a leave is a save by the leaver.
- **Delete (D3):** author only, restorable, means our relay refusing deletes
  upstream allows; today's author-only hide keeps two records but diverges
  from upstream.
- **A refused save (D4):** keeping theirs and offering "Your version" to copy
  back loses nothing but leaves the merge to the person; building live
  co-editing first is much larger and delays the project.
- **Who reads a project (D5):** always Company leaks a private team's project
  names; the same Folder as its issues makes today's workspace-wide projects
  private.
- **Convert (D6):** a new file naming the one it replaces fits upstream's
  "id and type never change", but every link and conversation takes an extra
  hop.

## Consequences

- One-way: every file moves; old chips in signed messages are republished or
  left dead.
- Lists stop growing with edits; history weighs about a fifth more and only the
  History panel reads it.
- A status change from a list must fetch the whole save; conformance tests
  guard against an app saving an empty text from a row.
- A live feed narrows by Folder, not by type; an assignment needs its own
  notification, since a save sends no push.
- A Folder delete must count artifacts, or it hides them.
- We follow a month-old draft, propose three changes upstream, and may carry
  them as our own.
- Under navigation: an artifact is read by its home's readers, which leans the
  access brief's open call ("Who leads, who reads") toward a team or space
  deciding who reads, and makes it more urgent (D5).
