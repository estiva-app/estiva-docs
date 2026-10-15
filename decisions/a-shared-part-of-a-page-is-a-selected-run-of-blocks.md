# A shared part of a page is a selected run of whole blocks, and it stays live as the page changes

- Date: 2026-10-09
- Status: Accepted
- Decided by: Miky, at the /wrap of COM-2 and in the session shaping the project "Composition 2: share a run of blocks"
- Area: Links & widgets

## Who it affects

Miky wants to share a heading, its paragraph and its bullet points from a page
or an issue into a conversation, as one thing. Sharing one block of it "doesn't
make sense". He selects the blocks he wants, by dragging with the mouse button
held or with Shift+arrows ("that's how Notion works"), and Copy link copies
them all. Pasted into a message, the run shows live: if the page is updated
during the discussion, the shared part shows the update, blocks added in the
middle included. In his words: "you shared the block, then have discussion and
you update it and then it should be updated".

## Context

The project Composition shipped one block per `part` (SPEC §13.6.1) and left
sections and ranges out of scope until a real moment. On 2026-10-09, at the
/wrap of COM-2, Miky gave that moment: "The problem when you can share just
specific block is that it's not enough. Imagine headline paragraph and bullet
points. You want to share the whole thing." RFC 0.6 §4.2 had set the rule that
an extent is structural (a heading's section), never a from-to range; the
`part` tag reserves index 3 for an extent.

## Decision

- Share a selection of whole blocks, chosen by drag or Shift+arrows; some items
  of one list can be selected.
- The run is first-to-last and dynamic: blocks inserted between the first and
  the last show.
- Only Copy link acts on a selection for now.
- RFC 0.6 §4.2's structural extent is overruled.

Carried out in the project "Composition 2: share a run of blocks" (COM-1 to
COM-3), which sets the wire form.

## Rejected alternatives

- **A heading's section** (the heading and what follows up to the next heading
  of its level, as RFC 0.6 §4.2 had it). Miky: "just one usecase, not covering
  the whole thing, and it might create some weird cases".
- **One block per share** (what Composition shipped). Not enough for the real
  moment above.

## Consequences

- What a shared part names is a span the reader works out from the page as it
  is now, not a fixed copy, so a later edit to the page changes what the
  message shows.
- Deleting or turning a selection into another block type are later steps.
