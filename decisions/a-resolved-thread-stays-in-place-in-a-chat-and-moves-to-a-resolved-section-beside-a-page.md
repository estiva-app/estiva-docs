# A resolved thread stays where it was said in Peek, and moves to a closed "Resolved" section at the end of the comments in Ship and Leaf

- Date: 2026-11-09
- Status: Accepted
- Decided by: Miky, in the close-out session of "One conversation in every app" (2026-11-09), choosing to record what shipped; the look is Katerina's call of 1 November, made on the project's prototype and built in estiva-ui 0.96.0 ([estiva-ui#221](https://github.com/estiva-app/estiva-ui/pull/221))
- Area: Messages

> Supersedes in part
> [anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts](anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts.md):
> its clause "a resolved thread collapses in place", and its rejected
> alternative "a resolved thread moves to a Resolved section", which is now
> what Ship and Leaf do. Who may resolve or reopen, that the newest counts,
> that every app offers Resolve and shows who resolved and the note, and no
> Highlights in that stage all stand.

## Who it affects

Miky and Katerina resolve threads on Ship issues and Leaf pages, and talk in
Peek. In Ship and Leaf, where the comments sit in one column beside the page, a
resolved thread stops taking room among the open ones: the comments still
asking for something stay in view, and what is settled waits, closed, under
"Resolved" with how many. In Peek, where the conversation is the screen,
nothing moves: a resolved message stays where it was said, so the conversation
keeps its order. The same thread can therefore sit in place in Peek and under
"Resolved" in Ship. Our three apps follow this through the shared kit. Another
company's app reads the same resolve event and places a resolved thread as it
likes: nothing on the wire says where.

## Context

- The earlier record said a resolved thread collapses in place, and left how it
  looks to Katerina, on the prototype. It listed "a resolved thread moves to a
  Resolved section" as rejected, because in Peek messages would vanish from
  where they were said.
- On 1 November, judging the prototype, Katerina kept Leaf's "Resolved"
  section for every app whose comments sit in one column beside a page. The
  shared kit draws it that way since ui 0.96.0 (`ConversationLayout.tsx`): in
  one column (Ship, Leaf) the resolved threads wait closed at the end under
  "Resolved", with a count, and the section opens by itself for a thread opened
  from a link. In two columns (Peek: its topics, team chats and any file's
  comments it opens) every thread stays in place. That meets the earlier
  objection: Peek's messages do not move.
- Nothing collapses in place in any app. The mismatch was found when the
  project closed (2026-11-09) and brought to Miky.

## Decision

- **In Ship and Leaf** (one column beside a page): resolved threads move to a
  closed **"Resolved"** section at the end of the comments, with how many.
  Opened, it shows each thread on the same card as anywhere else. Reopened, a
  thread goes back among the open ones.
- **In Peek** (two columns): a resolved thread stays where it was said, in
  full, marked "✓ Resolved".
- In every app the card shows a resolution the same way: "✓ Resolved" beside
  the time, who resolved it and the note on hover, and a note also on the card.
- The rule follows the layout in the shared kit, not the kind of conversation:
  a Ship issue's thread sits under "Resolved" in Ship and in place in Peek.

## Rejected alternatives

- **Collapse in place everywhere** (the earlier record): one line where it was
  said in every app. Beside a page, settled threads would still sit among open
  ones and push them down; Katerina chose the section on the prototype.
- **Open in place everywhere**, as Peek does: nothing moves, but a page's
  column fills with settled threads, and it reverses Katerina's call.

## Consequences

- No wire change: the resolve event and who may write it are unchanged, so this
  is two-way and cheap to undo in the kit.
- A reader moving between Peek and Ship finds the same thread, resolved, in a
  different place, by design.
