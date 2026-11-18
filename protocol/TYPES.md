# File types: the Osnova directory

This page is the public directory of the shared types, the ones every Osnova app
reads the same way. It names each type and its fields. A file is its fields
([SPEC §6](SPEC.md)): a first record written once, and for each field one line
of `kind:1851` changes the relay keeps in order.

- **Osnova's four base types keep their own first records**, and each kind is
  read as its type's name:

  | type | first record |
  | --- | --- |
  | `osnova.project` | `30850` |
  | `osnova.issue` | `30851` |
  | `osnova.document` | `30842` |
  | `osnova.topic` | `30840` |

- **Every other type starts with one named first record**, a `kind:30852`
  whose `k` tag names its type ([SPEC §6.1](SPEC.md)). A type joins the base
  when the relay builds it in and this page lists it; no file moves.
- **Shared types carry the protocol's name**: `osnova.<noun>`, singular. The
  name is final before the first file of that type is written.
- **An app names its own types** `<company>.<noun>` (`estiva.*`, `acme.*`) and
  launches with them, asking nobody. A type several apps use can become a
  shared one.
- **A field is a name**, set by a change's `field` or `set` ([SPEC §6.2](SPEC.md)).
  A list reads each field's newest change but the text's
  ([SPEC §6.13](SPEC.md)), so every field a list shows is drawn without the
  text. The text is the `description` field, saved whole.
- The relay accepts any named type but the four base names. Estiva ID limits
  which types each of Estiva's apps and agents may make
  ([KINDS.md §5](KINDS.md)).

Records:
[a-file-is-its-fields-each-kept-in-order-by-the-relay](https://github.com/estiva-app/estiva-docs/blob/main/decisions/a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
and
[osnovas-base-types-keep-their-records-and-every-new-type-starts-named](https://github.com/estiva-app/estiva-docs/blob/main/decisions/osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md)
(Miky, 2026-10-30); the type names from
[every-file-is-an-artifact-the-relay-keeps-in-order](https://github.com/estiva-app/estiva-docs/blob/main/decisions/every-file-is-an-artifact-the-relay-keeps-in-order.md)
(Miky, 2026-10-29), which stand.

## `osnova.project`

A project: what a team is working toward, the issues under it, and who leads
it. Its first record is a `kind:30850` ([SPEC §6.1](SPEC.md)).

| field | first value, on the `30850` | value |
| --- | --- | --- |
| `title` | `name` (older records: `title`) | the project's name |
| `status` | — | the company's own status; Ship's defaults are `planned`, `in_progress`, `completed` and `cancelled`, below. A change carries its `stage` ([SPEC §6.2](SPEC.md)) |
| `lead` | `lead` | the lead's pubkey, 64 lowercase hex, with `["p", <pubkey>]` beside it; empty when there is none |
| `key` | `key` | 3–6 letters `A`–`Z`, the prefix of its issues' refs ([SPEC §6.1](SPEC.md)) |
| `summary` | `summary` | one or two sentences of plain text, about 240 characters ([SPEC §6.12](SPEC.md)) |
| `archived` | — | `true` while it is archived; empty otherwise ([SPEC §6.5](SPEC.md)) |
| `deleted` | — | `true` while it is deleted; empty otherwise ([SPEC §6.5](SPEC.md)). A deleted project keeps its `key` |
| `description` | — (`description`, else `content`, on projects written before the issues switch only) | the project's text, a new project's as its first change ([SPEC §6.1](SPEC.md)) ([SPEC §6.10](SPEC.md)): a block document labelled `estiva-blocks-1`, or unlabelled marker text ([SPEC §13.4](SPEC.md)) |

**Search** finds a project by the words of its current title, summary, key
and text, title first, through the list read
([SPEC §6.13](SPEC.md); record
[search-finds-a-file-by-the-words-of-its-current-fields](https://github.com/estiva-app/estiva-docs/blob/main/decisions/search-finds-a-file-by-the-words-of-its-current-fields.md)).
Its status, lead and archived state are not words. A type is found this way
only once the relay lists it in NIP-11 `file_search` (SPEC §6.13); until then
an app searches it by title (SPEC §5.2).

**Its statuses are each company's own**, starting from its tracker's defaults
([each-company-defines-its-own-statuses](https://github.com/estiva-app/estiva-docs/blob/main/decisions/each-company-defines-its-own-statuses.md),
Miky, 2026-10-30). What every app shares is what a status means: one of the
four stages of [SPEC §7.4](SPEC.md). A company's own are kept in its
`osnova.schema` file for projects (below); until it saves one, Ship's
defaults:

| status | label | stage |
| --- | --- | --- |
| `planned` | Planned | `open` |
| `in_progress` | In Progress | `started` |
| `completed` | Completed | `done` |
| `cancelled` | Cancelled | `dropped` |

A project is placed by `buzz-channel` and listed in a team by that team's
`kind:30890`; one in no other team names the workspace's Company team
([SPEC §3.4](SPEC.md)), as does a new one made with no team. Its changes carry
that team as their `h`.

## `osnova.issue`

A piece of work: what is to be done, who does it, and how far it has got.
Its first record is a `kind:30851` ([SPEC §6.1](SPEC.md)). An issue sits
under at most one project, and it can move.

| field | first value, on the `30851` | value |
| --- | --- | --- |
| `title` | `title` | the issue's name |
| `status` | — | the company's own status; Ship's defaults are `todo`, `in_progress`, `done` and `cancelled`, below. A change carries its `stage` ([SPEC §6.2](SPEC.md)) |
| `assignee` | — | the assignee's pubkey, 64 lowercase hex, with `["p", <pubkey>]` beside it; empty when there is none |
| `project` | `a` | the address of the project it sits under, `30850:<pubkey>:<d>`; empty when it sits under none. Changing it moves the issue (its `movedBy` field, [SPEC §7.3](SPEC.md)); the issue's team does not change |
| `ref` | `ref` | a display key such as `SHIP-12`, its project's `key` and a number; never an address ([SPEC §6.1](SPEC.md)) |
| `summary` | `summary` | one or two sentences of plain text, about 240 characters ([SPEC §6.12](SPEC.md)) |
| `archived` | — | `true` while it is archived; empty otherwise ([SPEC §6.5](SPEC.md)) |
| `deleted` | — | `true` while it is deleted; empty otherwise ([SPEC §6.5](SPEC.md)). A deleted issue keeps its `ref`. Until issues are kept field by field, Ship deletes an issue with a `kind:5`, which a reader still honours |
| `description` | — (`content`, on issues written before 2026-11-18 only) | the issue's text ([SPEC §6.10](SPEC.md)), as a project's. A new issue's text is its first change, never in its first record ([SPEC §6.1](SPEC.md)) |

**Search** finds an issue by its title and its ref ([SPEC §5.2](SPEC.md))
until the relay lists `osnova.issue` in NIP-11 `file_search`
([SPEC §6.13](SPEC.md)); from then on by the words of its current title,
summary, ref and text, as a project. Its key word field is `ref`: ranked with
the summary and reported as `key` in a match. Its status, assignee and
archived state are not words.

**Its statuses are each company's own**, as a project's, and a status change
carries its stage. Ship's defaults:

| status | label | stage |
| --- | --- | --- |
| `todo` | Todo | `open` |
| `in_progress` | In Progress | `started` |
| `done` | Done | `done` |
| `cancelled` | Cancelled | `dropped` |

An issue is filed in a team by its `h`, which never changes.

## `osnova.schema`

A company's own layer of another type's properties: its statuses for
projects, or for issues, and later its labels, priorities and its own columns
([SPEC §7.4](SPEC.md); record
[a-companys-statuses-are-its-own-layer-of-a-types-properties](https://github.com/estiva-app/estiva-docs/blob/main/decisions/a-companys-statuses-are-its-own-layer-of-a-types-properties.md)).
Its first record is a `kind:30852` with `["k", "osnova.schema"]`, the type it
describes in `["of", <type>]`, the workspace's Company team as its `h`, and
`["writers", "workspace-admins"]`, so only the workspace's owners and admins
write it ([SPEC §6.1](SPEC.md)). There is one per type; if there are several,
the earliest whose mark the relay honours counts ([SPEC §7.4](SPEC.md)).

| field | value |
| --- | --- |
| `title` | its name, such as "Issue statuses" |
| `property:<id>` | one property of the described type, such as `property:status`: JSON `{"label", "type": "choice", "default", "options": [{"value", "label", "colour", "stage"}]}`. Each option's `colour` is a colour name (`neutral`, `blue`, `green`, `muted`), never a hex code, and its `stage` one of the described type's stages ([SPEC §7.4](SPEC.md)) |
| `archived`, `deleted` | as on any file; an archived or deleted one does not count |

Until a company saves its own, every app uses the defaults listed above.

## Why projects and issues are not git's

Nostr already has issues and projects for code: NIP-34's issue (`kind:1621`)
and the NIP-MP project (`kind:30621`). Buzz's own Projects screen uses NIP-34
issues. Osnova does not, for three reasons
([a-file-is-its-fields-each-kept-in-order-by-the-relay](https://github.com/estiva-app/estiva-docs/blob/main/decisions/a-file-is-its-fields-each-kept-in-order-by-the-relay.md),
rejected alternatives):

- **A NIP-34 issue cannot be edited.** A `kind:1621` is a regular event: its
  title and text are fixed when it is written. Osnova's issues are changed by
  everyone working on them, field by field, all their life.
- **A NIP-34 issue needs a repository.** It names the git repository it is
  about, and is read by whoever reads that repository. Osnova's issues live in
  a team, and the team's members are who reads them
  ([SPEC §3.1](SPEC.md)); most work a company tracks has no repository.
- **A NIP-MP project is replaced whole, by its author.** A `kind:30621` is
  addressable, so only the person who wrote it can change it, and every change
  carries the whole project. That is the shape [SPEC §6.1](SPEC.md) rules out
  for anything several people change, and the whole-file shape the record
  above turned down.

Git itself, as the store for a file, splits the file across a second store with
its own access, beside the relay's. A project or an issue is its fields on the
relay, like every other file.
