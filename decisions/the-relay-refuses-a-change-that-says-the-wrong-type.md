# The relay refuses a change that says the wrong type for its file, and a change to a team itself says no type

- Date: 2026-11-20
- Status: Accepted
- Decided by: Miky, in the kickoff session for "Every change says the type of file it changes, so Leaf's Home reads no page saves" (2026-11-20), on the questions "When a change says the wrong type for its file, does that change still count?" and "What type should a change to a team itself say?": the recommended option on both
- Area: Files

> Supersedes in part
> [a-change-says-the-type-of-its-file](a-change-says-the-type-of-its-file.md):
> "A reader ignores a change whose `K` is not the type of the file its `a`
> names." The rest of it stands.

## Who it affects

Miky or Katerina edits an issue, and every app shows the same new value. An
outside company asks its relay for "my recent changes to invoices" and expects
the answer to hold every such change and nothing else. Someone who archives a
team, joins its chat or sets their level on it changes the team, not a file.

## Context

- Since earlier the same day every change carries `["K", <type>]`, the type of
  the file it changes
  ([a-change-says-the-type-of-its-file](a-change-says-the-type-of-its-file.md)).
  That record told readers to ignore a change whose `K` disagrees with its
  `a`, and gave the relay no part in it.
- The relay keeps each field's changes in order
  ([a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)).
  A change it accepts becomes the field's current one: its list read returns
  it, and the next change must name it as the one it follows. If readers
  ignored a change the relay counted, the relay and the apps would disagree on
  a field's current value.
- SPEC §6.2 already settles the same case for a change whose `a` and `O`
  disagree: the relay refuses it.
- A change may name a team's own address: archiving or restoring a team,
  joining its chat, a person's level on it (SPEC §3.3, §11.8). A team is not
  one of the file kinds, and the public directory of types names no type for
  it. Whether a team is a file at all is an open question, parked until the
  navigation work.

## Decision

- **The relay refuses a change whose `K` is not the type of the file its `a`
  names**, with the reason code `type-mismatch`, as it refuses one whose `a`
  and `O` disagree. For a project, issue, document or topic the type is the
  kind's name; for any other type it is the `k` of the file's first record.
- **A change that carries no `K` still lands.** A tab or an agent loaded
  before this writes none, and a reader finds such a change by its file, never
  by its type.
- **A reader does not drop a change for its `K`.** What the relay accepted
  counts in every app.
- **A change to a team itself carries no `K`.** "Every change says its type"
  is a rule for a change to a file. A change on a team's address is found by
  that address, as before.

## Rejected alternatives

- **The type is only an index.** Every change would count whatever its `K`,
  and a wrong one would only show in the wrong answers to a read by type. The
  relay would need no rule, but an outside company's "my recent invoices"
  could miss edits or include others, and nothing would tell the writer.
- **Keep "a reader ignores it".** The relay would store and order a change
  that every app refuses to show, so the two would disagree on the file's
  current value, and the next edit would have to follow a change the apps
  ignored.
- **A team type, `osnova.team`.** Every change would carry a type without
  exception. But it would declare a team a typed file like an issue or a
  page, which nothing has decided: who may create one, and who owns its
  properties.

## Consequences

- The relay gains one rule, and SPEC §6.2 and its conformance table say so. A
  refused change is never stored, so the rule can be loosened later without
  leaving anything behind on the relay.
- Every writer must hand a change the right type. For a type other than the
  four base ones the address does not say it, so the writer takes it from the
  file's first record, which it already reads for the team.
- A type can be given to team changes later if a team becomes a file. Those
  written before would carry none, as changes written before today carry none.
