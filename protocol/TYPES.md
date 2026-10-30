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
| `deleted` | — | `true` while it is deleted; empty otherwise ([SPEC §6.5](SPEC.md)) |
| `description` | `content` | the project's text ([SPEC §6.10](SPEC.md)) |

**Its statuses are each company's own**, starting from its tracker's defaults
([each-company-defines-its-own-statuses](https://github.com/estiva-app/estiva-docs/blob/main/decisions/each-company-defines-its-own-statuses.md),
Miky, 2026-10-30). What every app shares is what a status means: one of the
four stages of [SPEC §7.4](SPEC.md). Ship's defaults:

| status | label | stage |
| --- | --- | --- |
| `planned` | Planned | `open` |
| `in_progress` | In Progress | `started` |
| `completed` | Completed | `done` |
| `cancelled` | Cancelled | `dropped` |

A project is placed by `buzz-channel` and listed in a Folder by that Folder's
`kind:30890`; one in no other Folder names the workspace's Company Folder
([SPEC §3.4](SPEC.md)), as does a new one made with no Folder. Its changes carry
that Folder as their `h`.

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
  a Folder, and the Folder's members are who reads them
  ([SPEC §3.1](SPEC.md)); most work a company tracks has no repository.
- **A NIP-MP project is replaced whole, by its author.** A `kind:30621` is
  addressable, so only the person who wrote it can change it, and every change
  carries the whole project. That is the shape [SPEC §6.1](SPEC.md) rules out
  for anything several people change, and the whole-file shape turned down on
  30 Oct.

Git itself, as the store for a file, splits the file across a second store with
its own access, beside the relay's. A project or an issue is its fields on the
relay, like every other file.
