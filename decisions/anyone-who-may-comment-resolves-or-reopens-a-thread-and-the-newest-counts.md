# A thread is resolved the same way in Peek, Ship and Leaf: anyone who may comment on the file resolves or reopens it, the newest counts, and a resolved thread collapses in place

- Date: 2026-10-28
- Status: Accepted
- Decided by: Miky, in the shaping session of "One conversation in every app" (2026-10-28), answering three questions: Resolve in every app, whose resolve counts, and what a resolved thread does
- Area: Messages

> Supersedes in part
> [a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md):
> only its open question "whether Resolve and the Highlights are offered in
> every app", which this record answers. The rest of that record stands.

## Who it affects

Miky and Katerina comment on each other's Ship issues, Leaf pages and Peek
topics. With this call either of them can resolve a thread from whichever app
they are in, and the other sees it resolved, with who did it and the note, in
every app. An outside company's app resolves and reads a thread by the same
rule, and needs no lookup of roles to show it.

## Context

- The record
  [a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md)
  left open, for stage 2, whether Resolve and the Highlights are offered in
  every app.
- Peek and Leaf resolve and reopen a thread today; Ship neither offers Resolve
  nor shows one. Peek shows who resolved a thread and the note; Leaf shows only
  that it is resolved, and moves it to a "Resolved" section at the end.
- SPEC did not say whose resolve counts, and the shared conversation package
  said each app decides.
- The resolve event already exists, and Peek and Leaf write it. Every resolve
  on production fits each of the options below.

## Decision

- **One Resolve, in every app.** Any thread can be resolved and reopened in
  Peek, Ship and Leaf, with an optional note. Every app shows who resolved it
  and the note.
- **Anyone who may comment on the file** can resolve or reopen any thread on
  it, and **the newest resolve or reopen counts**, in every app and in SPEC.
- **A resolved thread collapses in place**: the comment's first line, who
  resolved it and the note stay where they were said, and one click opens it
  again. The conversation keeps its order. How it looks is Katerina's call, on
  the prototype.
- **No Highlights in this stage.** No app offers them. Their shape on the relay
  is decided together with what reads them, in *Highlights on the relay*.
- SPEC gets the rule in its section on resolving a thread, written with the
  Ship issue "One shape for a message and a thread".

## Rejected alternatives

- **Whose resolve counts: only the comment's author and the file's owners.**
  Every reader would have to look up roles before it could show whether a
  thread is resolved, an outside company would have to build that lookup, and
  apps would disagree wherever roles differ.
- **Whose resolve counts: each app keeps its own rule** (the wording until
  now). It goes against one shared conversation, and an outside company has
  nothing to rely on.
- **Shown everywhere, offered only by Peek and Leaf.** Ship would show "X
  resolved" but offer no Resolve, because an issue already has its own status.
  People would still meet two models.
- **Resolve stays as it is.** Ship keeps showing nothing.
- **A resolved thread moves to a Resolved section**, as Leaf does: a long page
  stays tidy, but in Peek messages vanish from where they were said. **Or it
  stays open with a resolved line**: nothing hides, and nothing is tidied.
- **Highlights now**, with their shape decided in this stage (it needs a
  protocol brief and splits the project), **or retired for good.**

## Consequences

- Ship learns to write and read the resolve event, and its signing list gains
  it.
- A resolve made in one app reads the same in the others, from the shared
  conversation.
- Two-way: the event and its tags do not change, and every resolve already on
  the relay fits the rule. Undoing it means writing a narrower rule into SPEC
  and every reader.
