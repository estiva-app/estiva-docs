# Every link draws as a chip, and its author chooses a card with an `embed` tag they can change after sending

- Date: 2026-10-13
- Status: Accepted
- Decided by: Miky, agreeing to Katerina's proposal in PEE-2's thread (1–5 Oct), when shaping the Widgets project on 2026-10-13; editable after sending is Miky's own call, over the recommendation
- Area: Links & widgets

## Who it affects

When Miky or Katerina mention an issue in a message, it draws as a small chip
in the text, alone on its line included. If they want the issue shown as a row
or a card under the message, they choose it in the message box, and they can
change or remove that card after sending. A link written on words offers the
same choice. Everyone reading the message sees what its author chose, in Peek
and in Ship.

An outside company's app that does not know the tag draws the reference as it
always has; one that does gets the author's choice as one tag beside the
reference.

## Context

Before, whether a reference drew a card under a message came from the object's
app manifest (`widget`) and from where the reference sat: a reference alone on
its line drew a card. PEE-2's 1–5 Oct thread had explored a switch for the
reader to change the layout. Katerina proposed instead that every reference is
a chip and the author chooses a card; Miky agreed when the Widgets project was
shaped on 13 Oct (OPT-16, OPT-17).

## Decision

- Every reference in a message body draws as a chip, alone on its line
  included. There is no legacy rule for old messages.
- A card under the message comes only from
  `["embed", <a-or-q value>, "compact" | "detailed" | "none"]` beside the `a` or
  `q`: `compact` draws a row, `detailed` a card. The manifest's `widget` no
  longer decides cards under messages (SPEC §13.6.2).
- The choice is editable after sending: `embed` folds through edits like
  `imeta` (SPEC §6.8), and `none` removes a card.
- A link written on text offers its card too, in this project.
- A pasted link to one block (`#block-…`) still inserts that block live
  (a `part`), with no card offered.

## Rejected alternatives

- **Freeze the choice at send, as a `part` is.** This was the recommendation;
  Miky overrode it and made the card editable. The reason is not on record.
- **The reader switches the layout** (PEE-2's reader layout switch). Replaced
  because the author chooses what a message shows.

## Consequences

- One tag decides a card, for any reference a body names, in any app; the
  manifest's `widget` no longer does.
- Because a card can change after sending, readers fold `embed` from a
  message's edits, the same as attachments.
- The switch from "alone on its line draws a card" to "always a chip" ships
  together with the control to choose a card, so nobody loses a card before
  they can choose one.
- Ship draws `embed`; choosing a card in Ship's comment box is a later step.
