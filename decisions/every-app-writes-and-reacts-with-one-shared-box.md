# Every app writes comments and chat with one shared comment box and reacts with one shared reaction row, and the cards stay each app's own

- Date: 2026-10-16
- Status: Accepted
- Decided by: Miky, in the shaping session of "Comments work the same in Peek, Ship and Leaf" (2026-10-16)
- Area: Messages

> Superseded in part, 2026-10-20: the part "The cards stay each app's own" is
> replaced by
> [a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md).
> The rest of this record stands.

## Who it affects

On 16 October, right after comments on a selection landed in Leaf, Miky tried
them: "it doesn't have the same feature parity as Peek and Ship comments: no
emoji reaction; / and [ doesn't work". With this call, Miky and Katerina
write, react, edit and delete a comment the same way in Leaf, Ship and Peek,
and a chat message too: the same keys, the same `@ !@ [ /`, and the same
reaction pills and picker. What differs between apps is the card a comment sits in:
Leaf's column beside the blocks, Peek's thread, Ship's Activity. An outside
company's app gets comments by supplying its people, its `[` lists, its own
`/` Insert rows and how it sends, rather than assembling a box of its own.

## Context

- The triggers are shared already: they live in `@estiva-app/ui/editor`, and what a pick writes lives in
  `@estiva-app/conversation`
  ([composer-triggers-are-one-shared-kit](composer-triggers-are-one-shared-kit.md)).
  The reaction pill and picker are in `@estiva-app/ui`. But each app assembled
  the box itself: Peek's box is 543 lines with about a thousand more around it,
  Ship's about 1,100 lines, and Leaf's about 150. Leaf's has none of the triggers and no
  reactions, and it sends plain text (`origin/main` of each repo,
  2026-10-16).
- Two assemblies had already drifted. On 15 October Miky found mentions in
  Ship not working, and editing a Ship comment showing `naddr…` text, "In
  Peek it works fine". Ctrl/Cmd+Enter sends only in Ship.
- In Peek and in Ship, one box already writes both chat messages and
  comments.
- Katerina chose on 30 September to track moving the writing box into
  estiva-ui once Ship had copied Peek's (UIG-46). On 22 September she ruled to
  record the cards Ship and Peek both draw, and to promote none of them yet
  (estiva-ui `docs/GATES.md`, UIG-18).

## Decision

- One **comment box** in `@estiva-app/ui/editor`. It holds the editor with `@`, `!@`, `[` and `/`, and the keys: Enter and Ctrl/Cmd+Enter send, Shift+Enter makes a new line, and Escape cancels an edit. It also holds drafts, attachments, the edit mode, and a refused send putting the text back ([a-refused-action-is-undone-and-your-text-comes-back](a-refused-action-is-undone-and-your-text-comes-back.md)).
- One **reaction row** in `@estiva-app/ui`: the pills, the picker, and who reacted. What a reaction writes, and how reactions are counted, stays in `@estiva-app/conversation` and `@estiva-app/protocol` (SPEC §6.6).
- **An app supplies only what is its own:** its people, its `[` sections, its `/` Insert rows, and a send that says whether the relay accepted the message.
- **The same box writes chat messages** (`kind:9`) as well as comments (`kind:1111`). The wire stays two kinds.
- **The cards stay each app's own.** (Superseded on 2026-10-20 by [a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md).)
- Carried out by "Comments work the same in Peek, Ship and Leaf": Leaf first, then Ship. Peek moves in a second stage, the project "Peek moves onto the shared box". (Corrected 2026-10-20: this line said the stage needed Peek's ui bump from 0.69; peek#530 moved Peek to ui 0.75 on 16 October, and it is on ^0.79.0 now.)

This extends [composer-triggers-are-one-shared-kit](composer-triggers-are-one-shared-kit.md) from the triggers to the whole box and to reactions.

## Rejected alternatives

- **Each app wires the shared parts itself, as Ship and Peek did.** Leaf would reach parity soonest. But the drift above stays, and a third box adds its own differences. A new app, an outside company's included, writes about a thousand lines before it can comment. Miky chose "the same comment everywhere" over "Leaf parity, soon".
- **One drop-in conversation:** cards, replies, box, reactions, edit and resolve as one component. An outside app would get comments in one line. But the cards' look would leave each app, against Katerina's 22 September ruling. Leaf's column beside the blocks is not a generic thread, and it is several projects of work.
- **The shared box writes comments only, and chat keeps each app's own box.** Peek and Ship would each keep two boxes, which is the drift this call removes.
- **Leaf wires the parts now, and the shared box comes later.** Leaf's glue would be written and then thrown away.

## Consequences

- A fix or a change to writing or reacting is one release that every app takes, so the apps cannot drift apart on keys, triggers or reactions.
- A new app, an outside company's too, gets the whole writing and reacting experience without building it.
- The box has to serve Peek's needs as well as Leaf's (drafts, attachments, Peek's own `/` rows), so it is prototyped in all three places before it is built.
- Two-way: nothing on the relay changes. Undoing it means moving each app back onto a box of its own.
