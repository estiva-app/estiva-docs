# What the relay knows about a type changes how files are found and ranked, never whether a save is accepted

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the shaping session "Re-confirm the file model before projects move" (2026-10-30), on the brief "Whole File or Fields" ([page](briefs/whole-file-or-its-fields.html), "The smaller question"): find and rank only, as recommended, after asking for the trade-offs
- Area: Files

## Who it affects

Miky and Katerina see nothing change. An outside company sharing a Folder with
us can rely on the same file being accepted on both companies' relays, whatever
each knows about its type. A builder launches a new kind of property without
waiting for our relay to learn it. An app that declares a shared type cannot
use that declaration to get another app's saves refused.

It came up on 30 Oct, before the search record of ALO-3 (estiva-docs#354)
merged: it had the relay keep a table per type of which fields are words, and
refuse a project save with text that does not say its format. "Apps declare
their types to the relay" is being shaped next.

## Context

- On 26 Oct option D, "the relay is the workspace's database: it reads every
  type's schema, refuses a write that does not fit", was Rejected
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)):
  every relay in a shared Folder would need every schema at the same version, a
  schema bug would break every app, and a new kind of property would wait for a
  relay release.
- NIP-AR: "The relay matches tag names and values without interpreting their
  meaning; `content` remains opaque text."
- Projects are the only type written the new way, so "a project save" and
  "any save" behave the same today. They part when a second type or the first
  declaration arrives.

## Decision

- **The relay may index, rank and find by what it knows about a type**, from a
  built-in table now and from apps' declarations later. A declaration it lacks
  or gets wrong only makes search worse.
- **The relay never refuses a save because of its type.**
- **Rules that are the same for every type still refuse**: a signature, the
  right to write there, the size cap, and **a save with text says its format**.
  They depend on no declaration, so two relays always agree on them. In
  estiva-docs#354, "a project save with text and no label is refused" becomes
  "any save with text and no label is refused".
- Sorting and counting by a declared field are later calls; refusing by one is
  not offered again without new facts.

## Rejected alternatives

- **Keep #354 as written** (a per-type refusal for projects; whether later
  declarations may refuse is decided when they are shaped). Opens 26 Oct's
  Rejected D one ticket at a time: in a shared Folder one relay refuses what the
  other accepts, one wrong declaration stops every app saving that type, and a
  declaration becomes a way to block a rival app's saves.
- **Never refuse for search's sake** (unlabelled text accepted and not
  searched). An app that forgets the label learns only when search misses.

## Consequences

- A malformed file can be accepted; other apps show their fallback, and each
  app's checks and the conformance cases catch it. Under
  [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
  the damage stays in the one field the bad change wrote.
- "Apps declare their types to the relay" is shaped inside this line: a
  declaration feeds search, never acceptance.
