# Search looks in a base type's built-in word fields and in every field an added app marks as words in its listing

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the shaping session for "Apps declare their types to the relay" (2026-10-30), on the brief "Statuses and Declarations", call 2: A, every added app's listing together; then, asked again because the brief had left out the base-types record merged the same afternoon, "A, inside the base", as recommended
- Area: Search

## Who it affects

Miky and Katerina see nothing change: a project is found by its title,
summary, key and text, as today. There is no real moment yet of either needing
a field searched that search misses. For example, when an app adds a field of
its own to projects, that field becomes searchable once the app's listing marks
it as words.

An outside company's tracker, or its own type (for example an HR app's
candidate),
counts on its own relay as soon as the workspace adds the app, without asking
Estiva.

## Context

- [a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md)
  (Accepted 30 Oct): what the relay knows about a type changes how files are
  found and ranked, never whether a save is accepted.
- [osnovas-base-types-keep-their-records-and-every-new-type-starts-named](osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md)
  (Accepted 30 Oct, merged before the brief was written): the relay has each
  base type's core fields built in, from the public directory; an app's
  declaration adds its own types and its own fields on a base type and never
  redefines a base type's core. It turned down "apps declare a base type's core
  fields too, and the relay combines them". The brief drew its option A as
  Ship's listing marking a project's title, summary, key and text, which is
  that turned-down shape, so the question was asked again.
- [an-app-counts-only-once-the-workspace-adds-it](an-app-counts-only-once-the-workspace-adds-it.md)
  (Accepted 3 Oct): an app speaks for a file type only once the workspace has
  added it.
- The issue "Search finds a file by the words in its current fields" (in
  progress; its SPEC in estiva-docs#354) gives search a project's title,
  summary and key, and its text by its format, from a table in the relay's
  code.
- Every app already declares its fields in its listing (SPEC §7); a listing
  does not yet say which are words.
- Upstream Buzz defines no schemas (NIP-AR); what we declare is ours unless
  Block takes it.

## Decision

- **A base type's word fields are built into the relay**, from the public
  directory, like the rest of its core. No app's listing changes them, so a
  project's core is searched alike on every relay with the same base.
- **Every app the workspace added may mark fields as words in its listing**:
  the fields of its own types, and the fields it adds to a base type.
- **Search looks in the union**: the base's word fields and every field any
  added app marks. A listing from an app the workspace has not added counts for
  nothing.
- A mark only steers search and ranking; it never hides or refuses anything.
- SPEC §7 and TYPES.md say so in the project "Apps declare their types to the
  relay".

## Rejected alternatives

- **A as the brief drew it: any added app's listing may mark any field, a
  base type's core included, and the relay combines them.** Every added app
  would count for everything. Turned down when asked again: it supersedes the
  base-types record, and two relays in a shared Folder could search a
  project's core differently, depending on which apps each has added. Undo
  cost low; build cost medium.
- **B · Estiva's directory entry is the one the relay reads.** Turned down: an
  outside company depends on a file Estiva signs and waits on us to change a
  shared type, and the directory becomes an authority, which the 26 Oct record
  ([estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md),
  "helps builders agree but forces no one") steered away from. Undo cost low;
  build cost medium.
- **C · Do less: the base types stay built into the relay; listings count only
  for an app's own new types.** Turned down: a field an app adds to a project
  waits for a relay release, the reason "the relay as the workspace's database"
  was turned down on 26 Oct
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)). Undo cost low; build cost low.

## Consequences

- A builder's type and a builder's extra fields are searchable without asking
  Estiva; a project's core is searched alike on every relay.
- A careless app can mark a long field as words, and search ranks oddly; it
  never hides or refuses anything.
- Changing whose marks count later only re-indexes words, so this door is
  two-way.
- The relay's table of word fields becomes the base's entries plus what added
  apps' listings mark; a type joining the base is a relay release, as the
  base-types record says.
