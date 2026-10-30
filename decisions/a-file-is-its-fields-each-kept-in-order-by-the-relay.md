# A file is its fields, and the relay keeps each field's changes in order; the text is one field, saved whole

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the shaping session "Re-confirm the file model before projects move" (2026-10-30), on the brief "Whole File or Fields" ([page](briefs/whole-file-or-its-fields.html)): C, as recommended
- Area: Files

> Supersedes in part
> [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md):
> "a file's own state is a NIP-AR artifact: its fields and its text, whole in
> each save"; a convert being one save; a list reading current saves; proposing
> lists without text and convert to Block; the host ordering each file's saves;
> and the migration writing each file's current state as its first save. Its
> one reference by id (D1), membership beside the file (D2), restorable delete
> (D3), the merge of a block both people changed (D4), homes (D5), a
> standardised type keeping its id, links, conversation and history (D6),
> the protocol's type names, search over the current version and the staged
> build stand.

## Who it affects

Miky and Katerina: lists stay the same size as edits pile up, as decided on 29
Oct. Katerina changing a project's status while Claude edits its text never
collide, because they changed different fields. Two people editing the same
text are handled as decided on 29 Oct: the second save is refused, and the app
merges, asking only about a block both changed. History is who changed what, as
Ship's Activity shows today.

An outside company runs our relay, as it would have under the 29 Oct shape. Its
app writes only the fields it changes, each naming the change it follows, and
reads current values from the relay. It cannot wipe a field another app added,
because it never writes it.

It came up on 30 Oct, when two independent reviews of the 29 Oct record found
the fact that decided it was false.

## Context

- On 29 Oct Miky chose A, "a file's own state is an upstream Buzz artifact",
  over C, "field changes ordered by the relay", on the stated ground that "an
  outside company holds a file's own state on upstream Buzz as it ships" and C
  is "our own standard that an outside company gets only by running our relay".
- Checked 30 Oct: upstream Buzz refuses every kind it does not know
  (`required_scope_for_kind`, "Returns Err for unknown kinds — the relay
  rejects them", `crates/buzz-relay/src/handlers/ingest.rs`, `upstream/main`
  cc04cdca1), and knows none of `1851`, `1852`, `30840`, `30842`, `30850`,
  `30851`, `30890` or `31990`. An outside company runs our relay under A as
  under C. Upstream also already searches current artifact saves only
  (`crates/buzz-search/src/query.rs`), which the 29 Oct record said it did not.
- What A still had: relay code Block writes and maintains (ordering, the
  current and history read, removing a save), one query across every type, one
  event per file. Our copy of that code already differs from upstream in about
  ten places, and upstream is changing its list and live reads now (block/buzz
  #8522, #8523, open).
- What the 29 Oct brief never set beside it, for C: nothing that names a file
  is re-signed (the move would have re-signed about 1,495 events, possible only
  while Estiva ID holds every author's key); a field change stays small (the
  newest non-text value averages 601 B against 8,989 B for the newest text, up
  to 93,635 B; production, 29 Oct); an app cannot wipe a field it does not know
  (NIP-AR: "Editors MUST preserve unfamiliar fields … or decline the edit", a
  rule no relay can check); and who changed a field is signed by that person.
- Block's own proposal to make tasks and projects artifacts (block/buzz#7771)
  closed unmerged on 21 Sep. Buzz's Projects screen uses NIP-34 git issues,
  which cannot be edited and need a repository.
- On production, 30 Oct: the relay accepts artifacts (buzz#38, ALO-2); no app
  writes one; the only ones are the QA probe's.

## Decision

- **A file is its fields.** It has a starting record (its type, id and home)
  and, for each field, one line of changes the relay keeps in order. Each
  change names the change it follows for that field; the relay refuses one that
  does not follow the current change, and answers the newest value of each.
  Different fields never clash.
- **The text is one field, saved whole**, ordered the same way. A refused text
  save merges as D4 decided: different blocks quietly, a block both changed by
  asking.
- **Every change is signed by whoever made it**, so who changed which field is
  a signed fact, and an app writes only the fields it changes.
- **A list reads the newest value of each field without the text**, a read our
  relay adds.
- **Nothing that names a file is re-signed.** Old changes stay valid; the relay
  builds each field's order from what is already there. Ids are unique across
  every kind ([a-files-id-is-unique-across-every-kind](a-files-id-is-unique-across-every-kind.md)),
  so the file's id stays what everything points at.
- **In a shared Folder the host's relay orders each field's changes.**
- **Upstream**: our standard, on our relay. The `O`/`o` reference is offered to
  Block as a client convention; the relay's artifact support stays for Buzz's
  own uses (agent and team settings), not for files.
- SPEC §6.13 is rewritten to this shape, and TYPES.md with it, by the project
  "A load stays the same size as edits pile up: projects", reshaped to it.

## Rejected alternatives

- **A · the 29 Oct shape: each save is the whole file, ordered by Buzz's
  artifact code.** Block maintains the ordering, one event is the file, history
  is whole versions. Turned down: an outside company needs our relay under it
  too, so its stated advantage was false; every field change carries the whole
  text to the relay and to everyone watching the Folder; the largest file
  halves to 256 KiB; an app that drops a field it does not know wipes another
  company's; and the move is one-way, re-signing about 1,495 events. Building it
  meant four more changes before projects moved (a reference naming the file's
  home, aliases instead of convert, never refusing by type, aligning with
  Block's sync work).
- **Do less: today's changes plus a read of current values, nothing refused.**
  Fixes the load and nothing else; two text saves crossing still lose one
  person's words silently, and agents are who cross (16 of 17 crossings within
  60 s were QA-1, QA-2 or Claude, 29 Oct).
- **Git as the file model, or Buzz's git-forge issues and projects** (NIP-34
  `1621`, NIP-MP `30621`). Not offered: a forge issue cannot be edited, needs a
  repository and is readable by the whole community; git splits a file across a
  second store with its own access. See the 30 Oct note on
  [0001-relay-canonical-by-default](0001-relay-canonical-by-default.md) §6.

## Consequences

- Close to two-way: the order is a rule the relay can stop enforcing, and old
  changes stay valid.
- Our relay code and our standard: an order per file and per field, the
  current-values read, search over current values, and a backfill. We maintain
  it, not Block.
- Every writer names the change it follows; a change that names none is
  refused, or it races as today. Several fields changed together are refused
  together.
- Built on the 29 Oct shape and now re-pointed: the relay's artifact support
  for files (buzz#38, ALO-2), Estiva ID's types for `45010`, SPEC §6.13 and
  TYPES.md, and the search being reviewed in buzz#39 and estiva-docs#354
  (ALO-3).
- Open, for the reshaped project: how a builder's own type's starting record
  carries its name, and whether the four shared types' starting records move to
  it; how several fields changed together are written; what "go back to
  Tuesday's version" shows.
