# File types: the Osnova directory

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
it. Kept as an artifact since ALO-2 (2026-10-30); until Ship moves its
projects, a project is still the `30850` of [SPEC §6.1](SPEC.md).

| field | tag | value |
| --- | --- | --- |
| title | `title` | the project's name; absent on a delete save |
| status | `status` | `planned`, `in_progress`, `completed` or `cancelled`, as Ship writes a project's status today |
| lead | `p` | the lead's pubkey, 64 lowercase hex; absent when there is none |
| key | `key` | 3–6 letters `A`–`Z`, the prefix of its issues' refs ([SPEC §6.1](SPEC.md)) |
| summary | `summary` | one or two sentences of plain text, about 240 characters ([SPEC §6.12](SPEC.md)) |
| archived | `archived` | `true` while it is archived; absent otherwise ([SPEC §6.5](SPEC.md)) |
| text | `content` | the project's description |

Its home (`h`) is the Folder that lists it; a project listed in none lives in
the Company Folder, Estiva HQ, as does a new one made with no Folder.

How a project's text is encoded in `content`, and which apps open it, are
settled when Ship moves its projects (the next milestone of the project "A load
stays the same size as edits pile up: projects").
