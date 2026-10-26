# A file's type is a shared meaning with its own number, which any app extends with its own properties; what no other app shares yet is a record; and the relay keeps each file's current state, so its changes become its history

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the brief session of 26 October, on the brief "Files, Types, History" ([page](briefs/files-properties-schemas.html)): "Go: E"
- Area: Files

> Supersedes in part three Accepted records; the rest of each stands:
> - [a-files-text-is-a-readable-snapshot](a-files-text-is-a-readable-snapshot.md):
>   only "written as a change to the file's `description` field (`kind:1851`)".
>   A save moves to an event of its own; a full readable copy, "the last save
>   wins" and the live layer on top stay.
> - [0001-relay-canonical-by-default](0001-relay-canonical-by-default.md): "share
>   the wire format, never the interpretation. How an app folds events into
>   current truth is where apps are *supposed* to differ" (§8), as far as it
>   covers the fold. The generic fold, "the newest change per field wins", moves
>   into the relay; what a field means stays each app's.
> - [another-apps-new-file-is-made-by-that-app](another-apps-new-file-is-made-by-that-app.md):
>   only "the app that owns that kind makes the file", and each app's allowed
>   kinds in Estiva ID as a hand-kept list. No app owns making a file of a
>   shared type: any app the workspace has added whose listing declares the
>   type may make its files.

## Who it affects

Miky and Katerina open any list with one small read per file, however long
each file's history. Today a list of statuses downloads every text save ever
made, which is why Weekly Plans took 30–35 s to open on 25 October. A row can
say "Katerina set Stage to Offer, 2 h ago".

A partner company's project manager (the brief's example) opens a project
shared with them in their own tracker, and Ship's issues are issues there:
"done" means done.

An HR expert at an outside company (Miky's example) builds an HR app by writing a listing: "Job
position: the shared type, plus Salary band and Hiring manager. Interview
scorecard: our own record type." They pick no numbers and no tag letters, and
need nothing from Estiva. Their job positions show in any app that knows job
positions.

It came up on 25 October, when the speed work was about to add a kind for a
file's text and Miky asked to review the kinds already added first. He answered
the brief on 26 October, after four notes of his own: a company has one relay;
he did not want to go against the Nostr community, who "probably had good
reason"; two companies should share a Folder as in Slack Connect; and builders
are domain experts, not Nostr experts.

## Context

- **Today a file is one of four types, each with its own number named for what
  it is**: topic `30840`, document `30842`, project `30850`, issue `30851`. A
  new type needs Estiva to change Estiva ID's list of what each app may sign,
  the relay's code, and a relay deploy (`protocol/ADDING-A-KIND.md`, SPEC §8).
  An outside company cannot add one.
- **Everything about a file that changes is a `kind:1851` change**, "set this
  field of this file to this value", named by its word. The newest change per
  field wins, and every app works out a file's current state by reading all of
  its changes, ever (SPEC §6.2, §6.3). The text is one of those fields, so each
  save is a full copy in the change log (SPEC §6.10). Measured on production on
  26 October: 2,286 text saves weigh 33.2 MB and 3,264 other changes 0.95 MB,
  across 937 files of the four types, with no id used by two types.
- **The Nostr community expects one number per meaning, shared by every app
  that handles it**, and a generic app-data container (NIP-78) for data no
  other app needs. A type named inside one kind is turned down for data apps
  share: "a namespace-within-a-namespace. Better to just use kinds, unless you
  have no aspirations for interoperability" (staab, nips#1503); "No. Use a new
  kind number for the thing you want to do" (fiatjaf, nips#2426). One kind with
  one meaning used for many things is accepted: one comment kind for comments
  on anything (NIP-22), one listing kind for products, services and jobs
  (NIP-99). Nobody hands out numbers: 281 are registered by pull request, and
  collisions happen (`30890`/`30891` are also claimed by nips#2354 and #1815).
- **Miky, 26 October: Nostr is for interoperability, less for
  decentralization.** That sorts the community's reasons in two: those about
  many relays and unknown clients weigh less on one company relay, and those
  about apps understanding each other weigh more. Spam does not apply: only a
  company's own people and its connected partners can write.
- **The relay refuses a kind it does not know, filters only one-letter tags,
  and folds no property changes.** It already signs one summary of its own, the
  Folder listing ([a-folder-is-a-group-the-relay-lists](a-folder-is-a-group-the-relay-lists.md)).
  It refuses an event whose time is more than about 15 minutes from its own
  clock (SPEC §5.1).
- On 25 October Miky said an app may add types (for now only an app), and that
  old shapes are translated when read. That became two Proposed records in the
  draft estiva-docs#330, never merged; this record and the three beside it
  replace them.

## Decision

Three layers of types, and under all of them a relay that keeps each file's
current state:

- **Shared types.** A meaning many apps use has its own number, as Nostr asks,
  and a short public definition of its core properties, each with a fixed id
  and a label (an issue's status, and what each status means). Today's four
  types already are shared types: they keep their numbers, their field words
  become their ids, and nobody re-signs anything. New shared types take numbers
  from a block the relay and Estiva ID admit by range, so a new one needs no
  relay release. A shared type changes only compatibly; a breaking change is a
  new number, and old and new live side by side until files move. Who decides
  them: [estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md).
- **Extensions.** Any app adds its own properties to a shared type in its
  listing, with ids under its own app key: the HR app adds "Salary band" to Job
  position. Other apps show them as plain values under the HR app's label, or
  hide them. No new number.
- **Records, for everything not shared yet.** One kind with one meaning: "an
  item whose type is defined by the schema it names". A one-letter tag on its
  root names that schema: an app's own type, or a
  person's database
  ([an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)).
  Other apps show a record plainly, with its properties. We say plainly that
  records are not for sharing, as the community asks of app data. When several
  apps want a record type, it becomes a shared type and its files move once.
- **An existing Nostr kind is reused where its shape fits**, such as Nostr's
  git-issue or listing kinds, or we say why not. Each number is registered in
  Nostr's kind registry (`nostr-protocol/registry-of-kinds`).
- **The relay keeps each file's current state.** When a change arrives, it
  applies the rule every app uses today, "the newest change per field wins",
  and keeps one small relay-signed summary per file: its type, title and
  Folder, each property's newest value with who set it and when, and the
  newest text save. Lists read one summary per file, and the change log
  becomes the file's history
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)).
  It applies the fold every app uses today, including whose changes count (a
  change counts only in its file's Folder, and a Folder's archive only from its
  admins), and knows no other meaning of a field. Its rule stays generic and gives
  the same answer from the same changes, for good, so two relays serving one
  Folder work out the same summaries. It keeps bounding a change's time, so a
  change claiming a far-future time cannot win for ever.
- **A file's text moves out of the change log** into an event of its own: each
  save is a full readable copy, the last save wins, and the summary names the
  newest. How a file's newest old save is read until someone saves again is
  not decided here: Miky's 26 October lean was to read it as the text, so
  nobody re-signs. It is asked when the text moves out, beside
  [early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md).
- **An app signs the types its listing declares**, once the workspace has
  added it ([an-app-counts-only-once-the-workspace-adds-it](an-app-counts-only-once-the-workspace-adds-it.md)).
  Estiva ID's limits follow the listing, not a hand-kept list per app. No app
  owns making a file of a shared type: any added app whose listing declares it
  may make its files. An agent still signs only by an admin's grant, now per kind or
  type ([an-agent-signs-for-an-app-only-by-an-admin-grant](an-agent-signs-for-an-app-only-by-an-admin-grant.md)).

It is built in stages, without changing the shape: text out first; ids and
labels for today's four types, and app gates driven by listings; the relay
summary; records and people's databases with the Notion-like app; Slack Connect
after its own brief. Each stage writes its part of SPEC (§6, §7, §8).

## Rejected alternatives

- **A. Do less: a number per type, each app picks its own, made cheap to add.**
  The smallest build. Every builder picks numbers in the right range (the range
  decides how the event is stored), picks which one-letter tags to use so
  fields can be filtered, avoids numbers others took, and builds a device copy
  and a fold. The numbers still name apps, not meanings: no other app
  understands those types, a partner's relay must admit every app's numbers,
  and a shared file is understood only where both companies run the same app.
  First load on a new phone, for a new colleague or for Claude grows with every
  edit ever made. A Notion-style database still needs a typed row. Collisions
  follow; there is one already, with our Folder listing's number. The numbers
  stay once outside files exist.
- **B. One kind of file whose types each app names ("Ship's issue"), and every
  app folds the history itself.** This was the draft estiva-docs#330. It is C
  without the summary, so history must be cut to stay fast, and each app's fold
  disagrees on odd cases. Today's 937 files move to the one kind, re-signed by
  their authors. A partner's own tracker sees "Ship's issue" as a stranger, not
  as an issue. Its type naming is one-way, and its build medium.
- **C. As B, and the relay keeps each file's current state** (the first
  version of the brief recommended it). Its types are named by each app, so two
  companies' different apps never agree what an issue is, and it is the one
  pattern the community turns down by name. Its naming is one-way and its
  summary two-way; it costs B plus the relay's fold. Its relay summary carries
  over into this record unchanged. Its variant, each field's newest value as its own
  replaceable event (as Kanbanstr and Formstr do), works on any relay but costs
  two writes per edit and many more events per file.
- **D. The relay is the workspace's database**: it reads every type's schema,
  refuses a write that does not fit, answers queries and serves each file in
  today's schema. The fastest views. But every relay in a shared Folder would
  need every company's schemas at the same version, or a write is accepted on
  one side and refused on the other; a schema bug in the relay breaks every app
  at once; a new kind of property waits for our relay release; it overturns the
  heart of [0001-relay-canonical-by-default](0001-relay-canonical-by-default.md),
  "share the wire format, never the interpretation"; and it is the most to
  build and to run.
- **E's layers as names on one kind of file** ("issue", "candidate"). Builders
  would see no difference. It is the pattern the community turns down by name,
  the type leaves the file's address (a turned-down option in
  [a-card-changes-what-a-files-app-shares](a-card-changes-what-a-files-app-shares.md)),
  and names invite the first-come land grab of common words.

## Consequences

- An outside builder writes a listing and never meets a number, a range or a
  tag letter. Their types are read by any app that knows them, and a type they
  need that is not shared yet is a record until it is.
- Curating shared types is a job that never ends. If saying yes or no is slow,
  everything stays a record, and we are back to types named for apps.
- A new colleague, a new phone and Claude read one summary per file. History
  stays complete, because nothing has to be deleted to keep lists fast.
- The relay's rule becomes part of the protocol and must stay generic for good,
  and our relay drifts further from upstream Buzz ("the pipe, not the brain").
- Two companies sharing a Folder: the partner's relay admits the shared block
  and the record kind, the same set on every relay, and each relay works out
  its own summaries. Which relay hosts a shared Folder is the next brief.
  [Estiva hosts the only deployment](estiva-hosts-the-only-deployment.md)
  stands; a company running its own relay would be a new decision.
- Promoting a record type to a shared type re-signs its files under their
  authors; files of an author who has left stay records.
- Which app opens a file of a shared type, and offers its editor, when several
  added apps declare that type is not decided here. Until it is,
  [a-document-is-its-own-type-of-file](a-document-is-its-own-type-of-file.md)
  ("Leaf owns it first") and
  [a-file-is-labelled-by-its-type-not-its-app](a-file-is-labelled-by-its-type-not-its-app.md)
  stand; it is asked when app gates move to listings.
- An extension property is as readable and as writable as the file it is on:
  it is not private to its app, and not owned by it.
- Each stage owes SPEC rules that this record does not settle:
  - what bounds a listing for Estiva ID: file types only, never the other kinds
    an app signs; and whether a wider listing needs the workspace to add the
    app again;
  - for records: whether signing one checks its schema against the signer's
    listing, or a record's type is no access boundary;
  - for the summary: it is readable only where its file's changes are, and
    deleting a version or a file drops it from the summary too.
- The draft's second record, a schema change declared as a translation every
  reader applies, is neither taken nor turned down here: for shared types a
  breaking change is a new number, and how a person reshapes their own
  database is shaped with the Notion-like app.
- Less to build than C now: no file moves. It fits
  [a-document-is-its-own-type-of-file](a-document-is-its-own-type-of-file.md)
  (a document keeps its number), and
  [early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)
  (nothing moves now; a promoted record type moves once). It fits
  [a-card-changes-what-a-files-app-shares](a-card-changes-what-a-files-app-shares.md)
  for shared types; records are a new kind for types no other app shares, and
  no existing file moves into it.
- One-way: a type's number, and a property's fixed id, once other people's
  files use them, as in all of Nostr. Two-way: the relay's summary. While the
  change log stays the truth, it can be added or dropped later; without it,
  apps fold the log themselves, slower but still correct.
