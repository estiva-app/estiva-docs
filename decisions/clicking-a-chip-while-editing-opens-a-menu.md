# While editing a description, clicking a chip opens a menu, Open and its card, and a fresh link opens it by itself

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, at /land of OPT-20
- Area: Links & widgets

## Who it affects

Miky or Katerina, editing a description in Ship or a file's page in Peek,
clicks a chip and gets a small menu instead of being taken away: Open, then
Card: None, Compact or Detailed. Right after they paste a link or pick a file
with `[`, the same menu opens by itself without taking focus, so the card can
be chosen at once. If they just keep typing, it closes and the link stays a
chip with no card. Reading a description, a click on a chip still opens it.

## Context

[The author chooses a link's card](the-author-chooses-a-links-card.md) needs a
place to choose it. In descriptions the first build put the card buttons on
the selection toolbar, which hides when the editor loses focus, so it could
not hold a menu, and nothing said where else the choice lived. Miky wanted it
reachable at the chip itself.

## Decision

- In a description editor, a click on a chip opens a menu: Open, then Card:
  None / Compact / Detailed. The chosen card is stored on the link
  ([the author chooses a link's card](the-author-chooses-a-links-card.md)).
- After a paste or a `[` pick, the menu opens by itself, without taking focus;
  typing on dismisses it with no card.
- Both in Ship's description editor and in Peek's file page. One component,
  `ReferenceMenu` in `@estiva-app/ui/editor` (0.68.0), serves both.
- How it looks is Katerina's, levelled after the merge (Miky, same /land).

## Rejected alternatives

- **The card choice on the selection toolbar.** It hides on blur, so it cannot
  hold the menu.
- **A click follows the chip, as when reading.** Then a writer has no way to
  reach the card. No other reason is on record.

## Consequences

- One menu for a chip in every description editor, so Leaf's page editor takes
  the same one when it is built.
- The message composer still uses Peek's own card button. Unifying it with this
  menu is not decided.
- Opening a link while editing takes a second click, on Open.
