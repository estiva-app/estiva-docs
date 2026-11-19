# Anyone who can read a highlight can delete it; it leaves no trace in the thread or the lists, and the person who marked it and the message's author are told in Activity, where they can still open it

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509: anyone can delete a highlight, after first asking whether a rejected mark could default to deleted
- Area: Messages

> Supersedes in part
> [who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status](who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status.md):
> its "unmarking is a status change, never a delete" and, for a highlight,
> "the relay lets only an event's author delete it". It keeps
> [a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md):
> a deleted highlight stays restorable.

## Who it affects

Miky marks Katerina's message as an Insight; she thinks it is wrong. Today she
can only set it to Rejected, and a Rejected mark stays in the item lists and
in the item's history. With this, she deletes it: the label goes from her
message and the item from every list, and Miky gets one Activity line saying
she deleted it, from which he can open it with her reason.

## Context

- Marks are AI memory, and sorting them is not a chore (Miky, 19 Nov). A
  rejected mark that stays listed is noise an agent keeps reading.
- Miky first asked whether a rejected mark could default to deleted, which
  clashed with the Accepted rule that unmarking is never a delete. He then
  decided: anyone can delete a highlight (19 Nov, prototype session of issue
  009bc509).
- On the fintech walkthrough (brief "Osnova at a fintech", 19 Nov) he set the
  frame: a highlight is memory, not the compliance trail; the raw messages
  are that trail, and a delete is just another event.

## Decision

- Anyone who can read a highlight can delete it, other people's included.
- A deleted highlight leaves no trace in the thread, the page or any list.
- The person who marked it and the author of the marked message each get one
  Activity line; from it they can open the deleted highlight, with who
  deleted it and an explanation, and restore it.
- The delete is an event like any other, kept as every change is kept.

## Rejected alternatives

- **Unmarking stays a status change (today's rule).** Turned down: a Rejected
  item stays in the lists and in what agents read, so memory fills with
  marks people disagreed with.
- **A rejected mark is deleted by default.** Turned down for one explicit
  action: deleting is a choice a person makes and others are told about.
- **Only the marker or the author may delete.** Turned down: the same
  "anyone who can read it" rule that lets anyone mark lets anyone tidy.

## Consequences

- The relay must accept a delete of a highlight from someone other than its
  author, which today it refuses for every event. That is a relay rule
  change, scoped to highlights.
- "Was this considered and turned down?" is no longer answered by a Rejected
  item in the list; it is answered by the Activity line and the restorable
  delete.
- Deciding when a highlight is a Decision a company must keep (a legal hold)
  stays with the app that owns that work, not with memory.
