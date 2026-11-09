# A resolved thread stays where it was said in a chat, and moves to a closed "Resolved" section at the end of comments beside a page

- Date: 2026-11-09
- Status: Accepted
- Decided by: Miky, in the close-out session of "One conversation in every app" (2026-11-09), choosing to record what shipped; the look is Katerina's call of 1 November, made on the project's prototype and built in estiva-ui 0.96.0 ([estiva-ui#221](https://github.com/estiva-app/estiva-ui/pull/221))
- Area: Messages

> Supersedes in part
> [anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts](anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts.md):
> only its clause "a resolved thread collapses in place". Who may resolve or
> reopen, that the newest counts, that every app offers Resolve and shows who
> resolved and the note, and no Highlights in that stage all stand.

## Who it affects

Miky and Katerina resolve threads on Ship issues and Leaf pages, and talk in
Peek. Beside a page, a resolved thread stops taking room among the open ones:
the comments still asking for something stay in view, and what is settled
waits, closed, under "Resolved" with how many. In a chat, nothing moves: a
resolved message stays where it was said, marked resolved, with who resolved
it and the note, so the conversation keeps its order. An outside company's app
follows the same rule by its layout, from the shared kit.

## Context

- The earlier record said a resolved thread collapses in place, and left how it
  looks to Katerina, on the prototype. It listed "a resolved thread moves to a
  Resolved section" as rejected, because in Peek messages would vanish from
  where they were said.
- On 1 November, judging the prototype, Katerina kept Leaf's "Resolved"
  section for every app whose comments sit in one column beside a page. The
  shared kit draws it that way since ui 0.96.0 (`ConversationLayout.tsx`): in
  one column, the comments on deleted parts and then the resolved ones each
  wait closed under their name at the end, with a count, and a group opens by
  itself for a thread opened from a link. In two columns, Peek's, every thread
  stays in place.
- Nothing collapses in place in any app. The mismatch was found when the
  project closed (2026-11-09) and brought to Miky.

## Decision

- **Beside a page** (one column: Ship, Leaf): resolved threads move to a closed
  **"Resolved"** section at the end of the comments, with how many. Opening it
  shows each thread with who resolved it and the note. A thread opened from a
  link opens its section by itself. Reopened, a thread goes back among the open
  ones.
- **In a chat** (two columns: Peek): a resolved thread stays where it was said,
  open, with "Resolved", who resolved it and the note.
- The rule belongs to the layout in the shared kit, not to an app: an app that
  places its comments beside a page gets the section, and one that is the
  conversation gets them in place.

## Rejected alternatives

- **Collapse in place everywhere** (the earlier record): one line where it was
  said in every app. Beside a page, settled threads would still sit among open
  ones and push them down; Katerina chose the section on the prototype.
- **Open in place everywhere**, as Peek does: nothing moves, but a page's
  column fills with settled threads, and it reverses Katerina's call.

## Consequences

- No wire change: the resolve event and who may write it are unchanged, so this
  is two-way and cheap to undo in the kit.
- The two layouts treat a resolved thread differently by design; a reader
  moving between Peek and Ship sees the same thread, resolved, in a different
  place, which is where the record says each app places it.
