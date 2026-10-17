# Where a link sits decides how it draws, and one file's card is added under a message: a part counts, a person or a Folder alone on its line stays a chip

- Date: 2026-10-16
- Status: Superseded by a-link-on-words-counts-toward-the-card.md
- Decided by: Miky, in the shaping session of *Widgets 2: build 1 — messages* (15 Oct), the kickoff and `/land` sessions of "Links follow one rule" (16 Oct), and his merge of this record (estiva-app/estiva-docs#291)
- Supersedes: where-a-link-sits-decides-how-it-draws.md
- Area: Links & widgets

## Who it affects

When Miky or Katerina write a message, a link inside a sentence is a chip, and
a line that is only a link to a file or a message draws that file's row in
place, in a bullet or a numbered line too. A person or a Folder alone on its
line stays a chip. If the message links exactly one file, that file's card is
added under the message box before sending, and ✕ removes it, before or after
sending. A block link counts as that file: linking an issue and a block of a
page shows the block, and adds no card. On an issue's own conversation, the
issue doesn't count, so linking it beside one other file gives the other its
card. An edit that adds a message's first link adds its card, as sending does.

In a Ship description, Peek's panel or a Leaf page the documents rule is
unchanged from where-a-link-sits-decides-how-it-draws.md.

An outside company's app adds one reading rule (a line that is only a link to
a file or a message draws as a row) and writes nothing new; messages from any
client draw the same way.

The calls were made on 2026-10-15 and 2026-10-16, while shaping and building
*Widgets 2: build 1 — messages*: the shaping session (what counts toward one
file, an edit's first link, bullets, messages first), the kickoff of "Links
follow one rule" (a lone person or Folder) and its `/land` session (the
conversation's own file, and a link put back after ✕).

## Context

where-a-link-sits-decides-how-it-draws.md (Accepted 2026-10-15) set the model:
chip in a sentence, row alone on its line, one file's card by default. Building
it raised questions it did not answer, and two of Miky's answers differ from
its text:

- It says the default card is for one value "not a Folder, not a kind whose
  detailed card adds nothing, not a `part`". On 16 Oct Miky said a block link
  (its live `part`) counts toward "one file", and that what doesn't count is a
  Folder, a person and a quoted message, not a list of kinds.
- It says a line that is only a reference draws a row, any reference. On 16 Oct
  he said a person or a Folder alone on its line stays a chip.

A decided record is never rewritten, only superseded (`README.md`), so this
record carries the whole call as it now stands. SPEC §13.2 and §13.6.2 and
conformance C21, C25, C26 and C27 carry it out (estiva-app/estiva-docs#287,
#289, #290), with `@estiva-app/protocol` 0.38.0 and 0.39.0
(estiva-app/estiva-foundation#146, #147).

## Decision

Everything in where-a-link-sits-decides-how-it-draws.md holds, with these
calls (Miky, 15–16 Oct):

- **A lone link draws a row only for a file or a message.** A line in a
  paragraph, a bullet or a numbered item that is only a `nostr:` reference or
  an app URL (§7.7) to a file or a message draws its row in place. A person or
  a Folder alone on its line draws its chip, as in a sentence. A quote's or a
  heading's line stays a sentence.
- **What counts toward "one file"** is what would draw under the message: a
  file named by a reference or an app URL, and a block link's file (its
  `part`). A Folder, a person and a quoted message don't count. A `part` counts
  but never gets an `embed`: the part draws, and a writer never writes both.
- **The conversation's own file doesn't count.** On a file's conversation,
  that file takes no default and is left out before counting.
- **An edit that adds a message's first link adds its card**, as sending does,
  and carries the whole folded set. A card removed with ✕ stays removed: ✕
  before sending wrote no tag, and an edit that fixes a word does not bring it
  back, nor does an edit after ✕ after sending. A link taken out and put back
  in a later edit counts as linked afresh and gets its card again, whichever
  ✕ removed it, so ✕ means one thing: no card on this message as it stands.
- **Writers stop writing `compact`** for a value they add; an edit carries an
  old `compact` as it was, and readers still draw one as a row under the
  message.
- **Messages first.** The documents half of the SPEC (§13.3, C22, C24) ships
  with stage 2 of Widgets 2; the documents rule itself is unchanged.

## Rejected alternatives

- **Keep the old record's text as the rule** ("not a `part`", any lone
  reference draws a row). A block link beside a file would then give the file
  a card under the live block, two things under one message; and a lone
  person would draw as a row, a block for someone the message only mentions.
- **Count the conversation's own file.** Linking the issue you are on beside
  one other file would then add no card, though the other file is the one the
  reader does not already have open (the Widgets 2 prototype did this).
- **Exclude "a kind whose detailed card adds nothing"** (the old record's
  wording). It named no kinds, so each writer would pick its own; Miky
  replaced it on 16 Oct with "only what would draw something under the
  message", which an outside writer can apply from the SPEC alone.
- **A card removed with ✕ after sending stays off for good**, even when its
  link is taken out and put back. ✕ before sending writes no tag, so the same
  gesture would then act two ways for a reason nobody can see, and every
  writer would need one more rule (asked in the `/land` session, 16 Oct).
- **Each app decides what a re-added link does.** Peek and Ship could differ,
  and an outside company gets no answer from the protocol.
- Everything where-a-link-sits-decides-how-it-draws.md rejected stays
  rejected: a mark in the message recording each row, and the author choosing
  chip, row or card per link.

## Consequences

- Peek and Ship draw a message's lines through one helper, `lineDrawOf`, and
  choose the default card with `defaultCardOf`, so they cannot drift.
- Undoing any of these is a SPEC change and each app's drawing code; no event
  is rewritten, since all of it is a reading rule or the writer's choice of
  today's `embed` tag.
- Once Accepted, the `why:` pointers in `@estiva-app/protocol`, Peek and Ship
  that name where-a-link-sits-decides-how-it-draws.md move to this record.
