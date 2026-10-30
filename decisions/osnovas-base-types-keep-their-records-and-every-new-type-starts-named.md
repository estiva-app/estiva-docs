# Today's four types are Osnova's base and keep their own records; every new type starts with one named record, and joining the base moves no file

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the reshaping session for "A load stays the same size as edits pile up: projects" (2026-10-30), on the brief "Types and Changes" ([page](briefs/types-and-changes-under-c.html)), call 1: "The current one is the base of the Osnova protocol. This will expand in time and those will always be at relay. The new and non-existing can be defined by new apps"; then, asked how a type joins the base and what "at relay" means, "Relay learns it" and "built into the relay", both as recommended
- Area: Files

## Who it affects

Miky and Katerina see nothing change: projects, issues, documents and topics
stay as they are written today.

A builder launches its own type, a candidate in an HR app, without asking
anyone: its files start with the one named first record every new type uses.
If several companies' apps adopt it, it joins Osnova's base: the relay builds
it in and the public directory lists it, and none of its files moves. Two
relays always agree on what a base type's core fields are, because the relay
has them built in rather than taking them from whichever app declared them.

It came up on 30 Oct, when the fields shape left "how a builder's type's
starting record carries its name" open.

## Context

- Today each of the four types has its own first record with its own number:
  project, issue, topic and document (SPEC §6.1). No builder type exists on
  production, and KINDS.md has no generic first record.
- Types carry names, `osnova.*` for shared ones and `<company>.*` for an app's
  own, launched without asking (Miky, 29 Oct, the standing part of
  [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md)).
  The name rode on the whole-file save, which
  [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
  dropped, so it needs a new home.
- What the relay knows about a type changes only how files are found and
  ranked, never whether a save is accepted
  ([a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md)).
- Moving the four onto a new record would re-sign at least 922 first records
  (94 projects, 828 issues; documents and topics not counted), possible only
  while Estiva ID holds every author's key.

## Decision

- **Today's four types are Osnova's base** and keep their own first records.
  Each is read as its name: a project's record means `osnova.project`, and
  likewise `osnova.issue`, `osnova.document` and `osnova.topic`.
- **Every new type starts with one named first record**, whether it is a new
  base type or an app's own: one kind for all of them, whose first record names
  its type. Every later change names the file by its id, as for the four.
- **The base grows.** A type joins it when the relay builds it in and the
  public directory lists it; no file moves and nothing is re-signed. Over time
  most types should live in the base.
- **The relay has the base built in**: each base type's core fields, from the
  public directory. An app's declaration adds its own types and its own fields
  on a base type, and never redefines a base type's core. Both feed search and
  ranking only (the record above).
- SPEC §6.1 and §6.13 and TYPES.md say so, in the project "A load stays the
  same size as edits pile up: projects".

## Rejected alternatives

- **Everything on the named first record, the four moved to it.** One shape
  for every reader and no four-line table. Turned down: a one-way move
  re-signing at least 922 first records, needing every author's key, the move
  the fields shape was chosen to avoid.
- **A base type joins with a record of its own, as the four have.** Base and
  app types never look alike. Turned down: every type that joins the base moves
  its files once, re-signed, so promotion is costly and the base grows slowly,
  against "most things will already live there".
- **No builder type until a builder asks.** Turned down: a builder cannot
  launch a type, which the directory promises, and declarations have no file of
  a declared type to point at.
- **Apps declare a base type's core fields too, and the relay combines them.**
  Turned down: the base is the protocol's, and two relays could disagree on it.

## Consequences

- Two shapes for a file's first record, for good: four by their own kinds, every
  other type by name. Every reader carries the fixed four-line table, and a new
  project, issue, document or topic is still written on its own record.
- A type joining the base is a relay release and a directory line; a convert
  is not needed for it (the convert of
  [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md),
  D6, stays for changing a file into another type).
- "Apps declare their types to the relay" is shaped inside this: the base is
  built in; apps declare only their own types and their additions.
