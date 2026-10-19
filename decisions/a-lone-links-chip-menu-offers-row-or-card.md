# While editing a document, a link alone on its line opens a menu with Open and Show as Row or Card; a chip in a sentence offers Open only

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the shaping session of the project *Widgets 2: build 2 — documents* (2026-10-19), matching the prototype he approved, and his merge of this record
- Supersedes: clicking-a-chip-while-editing-opens-a-menu.md
- Area: Links & widgets

## Who it affects

Miky or Katerina, editing a Leaf page, a Ship description or a file's text in
Peek's panel, clicks the chip of a link that is alone on its line and gets a
small menu: Open, then Show as: Row or Card. Card puts the file's card in the
row's place; Row puts the row back. A chip inside a sentence, and a person or
a Folder alone on its line, offers Open only. Right after they paste a link or
pick a file with `[` on a line of its own, the menu opens by itself without
taking focus, so the card can be chosen at once; if they keep typing, it
closes and the link stays a row.

## Context

- [clicking-a-chip-while-editing-opens-a-menu](clicking-a-chip-while-editing-opens-a-menu.md)
  (Accepted 2026-10-14) gave every chip the menu Open, then Card: None,
  Compact or Detailed.
- Since then, the rule for documents became that where a link sits decides how
  it draws: a chip in a sentence, a row alone on its line, and a card only when
  its author chooses one
  ([a-link-on-words-counts-toward-the-card](a-link-on-words-counts-toward-the-card.md)).
  A lone link is a row already, so "None" no longer meant anything, and a card
  in a sentence never draws.
- The prototype Miky approved for documents (estiva-ui `concept/widgets-2`,
  `src/widgets-2/places.tsx`, `ChipMenu`) offers Open, and on a lone line
  Show as Row or Card.

A decided record is never rewritten, only superseded (`README.md`), so this
record carries the whole call as it now stands.

## Decision

- **While editing a document, a click on the chip of a link alone on its line
  opens a menu:** Open, then Show as: Row / Card.
- **A chip in a sentence, and a person or a Folder alone on its line, offers
  Open only.**
- **Right after a paste or a `[` pick on a lone line, the menu opens by
  itself**, without taking focus. Typing on dismisses it.
- **What it writes:** Row removes the link's `embed` attribute; Card writes
  `detailed`. No writer writes `compact`, and old marks are kept as written.
- **One component** in `@estiva-app/ui/editor` serves Leaf, Ship and Peek.
- How it looks is Katerina's.

## Rejected alternatives

- **Keep Card: None / Compact / Detailed.** The prototype Miky approved has
  only Row and Card, and the Accepted documents rule already makes a lone link
  a row.
- **The same menu, without opening by itself after a paste or a pick.** Miky
  kept it opening by itself, as the earlier record had it; no reason beyond
  the choice is on record.
- Everything [clicking-a-chip-while-editing-opens-a-menu](clicking-a-chip-while-editing-opens-a-menu.md)
  rejected stays rejected: the card choice on the selection toolbar, and a
  click while editing following the chip.

## Consequences

- One menu for a link in every app's document editor, Leaf's included.
- Opening a link while editing still takes a second click, on Open.
- A saved `compact` keeps drawing as the row; a card chosen for a link that
  moves into a sentence stays on it and draws again when the line is only the
  link once more.
- Two-way: the menu only writes or removes an attribute readers already know.
  Undoing it is a ui release.
