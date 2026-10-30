# File types: the Osnova directory

> **Being rewritten (2026-10-30).** Files will not be artifacts: a file is its
> fields, each kept in order by the relay
> ([a-file-is-its-fields-each-kept-in-order-by-the-relay](https://github.com/estiva-app/estiva-docs/blob/main/decisions/a-file-is-its-fields-each-kept-in-order-by-the-relay.md)).
> The type names and the fields below stand; where each is kept changes.

A file kept as an artifact ([SPEC §6.13](SPEC.md)) says what it is in its
`type` tag. This page is the public directory of the shared types, the ones
every Osnova app reads the same way. It names each type's fields and where each
is kept in a save.

- **Shared types carry the protocol's name**: `osnova.<noun>`, singular. The
  name is final before the first file of that type is written.
- **An app names its own types** `<company>.<noun>` (`estiva.*`, `acme.*`) and
  launches with them, asking nobody. A type several apps use can become a
  shared one.
- **Every field a list shows is a tag**, so a list read without the text
  (SPEC §6.13) draws a row. The text is the save's `content`.
- The relay accepts any type. Estiva ID limits which types each of Estiva's
  apps and agents may sign ([KINDS.md §5](KINDS.md)).

Record:
[every-file-is-an-artifact-the-relay-keeps-in-order](https://github.com/estiva-app/estiva-docs/blob/main/decisions/every-file-is-an-artifact-the-relay-keeps-in-order.md)
(Miky, 2026-10-29).

## `osnova.project`

A project: what a team is working toward, the issues under it, and who leads
it. Defined 2026-10-30; until Ship moves its projects, a project is still the
`30850` of [SPEC §6.1](SPEC.md).

| field | tag | value |
| --- | --- | --- |
| title | `title` | the project's name; absent on a delete save |
| status | `status` | the company's own status; Ship's defaults are `planned`, `in_progress`, `completed` and `cancelled`, below |
| lead | `p` | the lead's pubkey, 64 lowercase hex; absent when there is none |
| key | `key` | 3–6 letters `A`–`Z`, the prefix of its issues' refs ([SPEC §6.1](SPEC.md)) |
| summary | `summary` | one or two sentences of plain text, about 240 characters ([SPEC §6.12](SPEC.md)) |
| archived | `archived` | `true` while it is archived; absent otherwise ([SPEC §6.5](SPEC.md)) |
| text | `content` | the project's description |

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

Where a company keeps its list, and how a list read without the text counts a
status by its stage, are settled when Ship moves its projects.

Its home (`h`) is the Folder that lists it; a project listed in none lives in
the workspace's Company Folder (Estiva's is Estiva HQ), as does a new one made
with no Folder.

How a project's text is encoded in `content`, and which apps open it, are
settled when Ship moves its projects (the next milestone of the project "A load
stays the same size as edits pile up: projects").
