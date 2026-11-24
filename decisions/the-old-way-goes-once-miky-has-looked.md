# The old way of reading and writing files goes once Miky has looked, without waiting for Katerina's look

- Date: 2026-11-24
- Status: Accepted
- Decided by: Miky, in the kickoff session of the issue "The relay, the apps and the agent drop the old way of reading and writing files" (2026-11-24), answering "while Katerina's look is still open, how far should the removal go?" with "everything now"
- Area: Files

> Supersedes in part:
>
> - [every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file](every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file.md):
>   its decision 1, "Until Miky and Katerina have each looked … a switch can
>   be turned back. Then the relay's per-type switches go", in its part "and
>   Katerina". The rest of that record stands.

## Who it affects

- **Miky and Katerina**: nothing they see changes. Pages and topics already
  load as they are and are written in order for everyone since 23 Nov,
  19:30 Prague time. What goes is the setting that could turn that back, and
  each app's second way of reading and writing files.
- **Katerina**: her look at her pages and topics still happens, in Peek's
  Performance topic, but after the close rather than before it. Anything she
  finds missing is fixed in the one way every app now has, or by reverting
  the change that removed the old way.
- **Someone building on the protocol**: the SPEC's "Before the close"
  paragraph goes now, and every "from the close" carries 24 Nov 2026.

## Context

- The record this one supersedes in part held the relay's per-type switches
  and every app's old paths until Miky and Katerina had each looked at their
  files after both the issues switch (19 Nov) and the documents-and-topics
  switch (23 Nov).
- Miky looked on 23 Nov and found nothing missing; his pages in Leaf and his
  topics in Peek and Ship read the same the old way and the new way. The
  counts before and after the switch were the same on his workspace for
  every page's and topic's title, place, team, members, files, conversation,
  unread state, cards and links.
- Katerina was asked in Peek's Performance topic on 23 Nov and had not
  replied by 24 Nov.

## Decision

The relay's per-type switches go, and Leaf, Peek, Ship, the shared code and
the agent drop the path that reads every change and writes without order,
now, without waiting for Katerina's look. Her look follows the close: what
she finds is fixed forward, or the removal is reverted in code.

## Rejected alternatives

- **The apps now, the relay's switch held until Katerina has looked.** The
  apps would keep working if the switch were turned back, so the hold would
  stay in force where it matters. Turned down: the close was the point of the
  stage, and a revert in code is enough of a way back.
- **Build everything and merge nothing until she has looked**, as the
  superseded part said. Nothing would change on production until an answer
  with no date.

## Consequences

- No setting can turn a type back to the old way; undoing it is reverting
  the pull requests, apps and relay together.
- A gap Katerina finds after the close has no old read to compare against in
  the apps; the counts of 23 Nov on Miky's workspace are the reference.
- The project "Documents and topics stop downloading every edit" closes once
  her look is in, as before; her look no longer gates the code.
