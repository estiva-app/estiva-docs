# Where a link sits decides how it draws: a chip in a sentence, a row alone on its line, and one file's card under the message by default

- Date: 2026-10-15
- Status: Superseded by where-a-link-sits-and-which-file-gets-the-card.md
- Decided by: Miky, in the WID-3 session (Widgets 2), on the brief "Where a Link Sits" — "agree with all recommendation"
- Supersedes: the-author-chooses-a-links-card.md
- Area: Links & widgets

## Who it affects

When Miky or Katerina write a message, a link inside a sentence is a chip and
a link alone on its line is a row, a block inside the message. If the message
links exactly one file, that file's card is added under the message box before
sending, and ✕ removes it, before or after sending. Nobody picks a layout for
a link in a message.

In a Ship description, Peek's panel or a Leaf page there is no area under the
document, so no card is added for you: a link in a sentence is a chip, a link
alone on its line is a row, and that row can be switched to its card from the
chip's menu, which takes the line's place.

An outside company's app adds one reading rule (a line that is only a link
draws as a row) and writes nothing new; messages from any client draw the same
way.

Miky proposed it on 2026-10-15 in Widgets 2's project conversation, after the
widget prototype: "instead of user choosing different layouts … chip … inline
inside a sentence, compact … as a single row … as a block (similar to heading)
inside the conversation, … detailed only as attachment … always add the
attachment, but the user would have option to remove similarly like in Slack".
In the WID-2 session he narrowed the card to messages that link exactly one
file, and said old messages drawing differently under the new rule is fine.

The brief Miky decided on:
[briefs/where-a-link-sits.html](briefs/where-a-link-sits.html). Katerina,
whose model this replaces, was asked in WID-3's conversation the same day.

## Context

Since 2026-10-13 every link draws as a chip, alone on its line included, and
the author chooses a row or a card under the message from the chip's menu,
editable after sending (`the-author-chooses-a-links-card.md`, Katerina's
proposal in PEE-2's thread, agreed by Miky). SPEC §13.6.2 says nothing but an
`embed` tag gives a card, "not a reference alone on its line". Peek's message
box writes `embed` and its edits carry the whole set; Ship draws `embed` but
its comment box can't choose one; Leaf has no cards. A block document stores a
card as `attrs.embed` on the link's mark and draws it after the block (SPEC
§13.3, "A reference's card").

## Decision

Option A of the brief, with the card replacing the row for a single lone link,
and the documents rule below — every recommendation the brief made:

- **Messages** (`kind:9`, `kind:1111` and their `40003` edits). A reference in
  a sentence draws as its chip. A line that is only a reference (`nostr:` or an
  app URL resolved by §7.7) draws the object's closed `row` in place, as a block
  in the message. This is a reading rule: no tag.
- **The default card** is today's `["embed", V, "detailed"]`, which the message
  box writes at send when the body names exactly one value that has a card (not
  a Folder, not a kind whose detailed card adds nothing, not a `part`). ✕ before
  sending writes no tag; ✕ after sending is an edit carrying
  `["embed", V, "none"]`. A writer MAY add the default; an outside writer that
  doesn't is still correct.
- **A file with a card under the message draws no row in it.** A chip inside a
  sentence still draws.
- **Old `compact` tags** keep drawing as a row under their message; writers stop
  writing `compact` in messages.
- **Documents.** A paragraph that is only a reference draws its row; with
  `attrs.embed: "detailed"`, chosen from the chip's menu, the card replaces it
  in place. No card is added by default. `attrs.embed` on a reference inside a
  sentence draws nothing. No new block type.
- Old messages and descriptions draw under the new rule, oddly or not (Miky,
  2026-10-15).

The SPEC change (§13.6.2, §13.3 "A reference's card", conformance C21, C22,
C24) ships with *Widgets 2: build*.

## Rejected alternatives

- **B. The place sets the default, and a mark in the message records each
  row** (a new `embed` value written at send). Old messages stay as sent and a
  row can go back to a chip, but every message carries a look forever, every
  reader must learn the value, and messages from other clients draw chips
  everywhere. One-way.
- **C. Keep today: the author chooses chip, row or card for each link**
  (`the-author-chooses-a-links-card.md`). No change, and the three-way choice
  Miky found harder stays on every link.
- **For a message that is only one link:** drawing both the row and the card
  (the same file twice), or adding no card to a lone link (a pasted lone link
  could then never show its card, since nothing adds one by hand).

## Consequences

- How a link looks becomes a reader's rule; the only author choice on the wire
  is whether the one card is there, which is today's tag. Undoing it is a SPEC
  change and each app's drawing code; no event is rewritten.
- A link alone on its line can't stay a chip; a word beside it keeps it one.
- Old messages whose lone link drew as a chip now draw a row.
- Ship's comment box gains the default card and its ✕ rather than a layout
  menu; Peek's composer card choice goes.
- Documents need no new kind of block for Leaf's card-as-a-block.
