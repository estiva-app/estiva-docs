# One change may set several fields of a file, and the relay takes it whole or refuses it whole

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the reshaping session for "A load stays the same size as edits pile up: projects" (2026-10-30), on the brief "Types and Changes" ([page](briefs/types-and-changes-under-c.html)), call 2: one change, as recommended
- Area: Files

## Who it affects

When Claude sets an issue's title, status and text in one command while
Katerina has just changed its status, nobody sees Claude's title beside
Katerina's status before Claude has seen hers: the whole edit is refused, and
the agent merges and sends it again. History shows "Claude changed title,
status and text" as one line.

An outside company's app learns one rule: a change sets one or more fields,
each naming the change it follows.

It came up on 30 Oct, as one of three things the fields shape left open.

## Context

- SPEC §6.2: a change sets exactly one field, "because two fields in one event
  would require a conflict rule for partial application". The agent writes one
  change per field (`estiva-agent` `lib/agent/apps/ship.ts:2295`).
- [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md):
  each change names the change it follows for its field, and several fields
  changed together are refused together; how they are written was left open.
- It happens in the agent's edit with several flags, a status with its stage
  ([each-company-defines-its-own-statuses](each-company-defines-its-own-statuses.md),
  rule 2), restoring older values, and a type change with its new fields.

## Decision

- **One change may set several fields of one file**, each naming the change it
  follows for that field. The relay accepts it only if every one follows its
  field's current change, and otherwise refuses all of it.
- A change of one field is still one change, as today; old one-field changes
  stay valid.
- It is signed by whoever made it, like every change.
- SPEC §6.2 and §6.13 say so, in the project "A load stays the same size as
  edits pile up: projects".

## Rejected alternatives

- **A bundle of one-field changes the relay takes or refuses together.** Keeps
  "one field per change" for readers. Turned down: a second shape for every
  reader; Nostr has no bundle, so someone watching the file sees the parts
  arrive one by one anyway; the relay would store events it did not sign as
  separate events.
- **Each field alone (do less).** Nothing new to learn. Turned down: a mix
  nobody chose shows when one field is refused, and every app cleans up a
  half-done change itself.

## Consequences

- Every reader of changes learns "one or more fields" before any app writes
  one; the shared code first.
- A wide change refused because one field moved costs its writer a re-read of
  all of them.
- Restoring an old version changes text and fields one at a time
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md),
  confirmed on the same brief, call 3), so a restore never needs a wide change.
