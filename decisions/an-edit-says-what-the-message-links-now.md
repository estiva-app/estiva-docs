# An edit says what the message links now, so a file lists a comment while its latest words link it

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the kickoff session of "A link in a comment reads the same in every app" (PEEKM-7) on 27 October, on the brief "Where an edited comment is listed" ([page](briefs/where-an-edited-comment-is-listed.html)): option B
- Area: Messages

## Who it affects

Anyone who fixes a link in a comment by editing it: you paste the wrong issue,
edit it to the right one. Under this record the right issue lists your comment
under Mentioned in and the wrong one stops, in Peek and Ship, and for the
agent's comments too. An outside company writes the same pointers on an edit as
on a send, and reads edits when it lists mentions.

## Context

- Until now an edit carried no pointer: the indexes a message's words earn
  stayed as first sent ([SPEC §6.8](../protocol/SPEC.md), 2 Oct, CON-25). A link
  added by an edit was never listed under the file it names.
- The apps disagreed on a link removed by an edit: Peek dropped the row, for
  chips only (`peek-app src/nostr/fileMentions.ts`, PEE-48, Katerina, 8 Oct);
  Ship read the first version only and kept it (`estiva-ship src/nostr/fold.ts`).
- On 26 October Miky decided an edit is the whole new message, its words and its
  files ([an-edit-is-the-whole-new-message](an-edit-is-the-whole-new-message.md)).
- The relay has no rule on pointers in an edit and lets only people who can read
  a comment read its edits, so an edit's pointers reveal nothing new. Buzz's
  desktop app, the relay's upstream, already reads pointers off edits
  (`applyEditTagOverlay.mjs`).

## Decision

- **An edit carries the whole set of files and messages its new words link**,
  as it carries the whole set of its attachments: an `a` per address and a `q`
  per message, from the same rule a send uses, minus the comment's own file and
  the message it replies to.
- **A file lists a comment while the comment's latest words link it.** A reader
  finds candidates by pointer on messages, comments and edits, maps an edit to
  its message, and confirms against the folded words. A link removed by an edit
  unlists the comment; one added by an edit lists it.
- **People are unchanged.** An edit still carries no person or urgent tag and
  never notifies anyone
  ([an-urgent-mention-is-a-tag-beside-the-mention](an-urgent-mention-is-a-tag-beside-the-mention.md)).
- Carried out by PEEKM-7, with SPEC §6.8, §6.4, §13.1 and §13.6.2 and KINDS.md's
  edit row.

## Rejected alternatives

- **A · Do less: listed by what the comment first linked, while its words still
  link it.** Nothing new on the wire, and a removed link unlists in both apps. But
  a link added by an edit is never listed, and every edit written meanwhile can
  never be listed later, because nothing on the relay points from it.

## Consequences

- The list under a file says what anyone reading the comment sees, in every app,
  as backlinks do in Slack, Linear and Notion.
- A reader that does not know the rule ignores edits and lists what was first
  sent, as before.
- A deleted comment leaves its edits behind: a reader lists nothing for an edit
  whose comment it cannot read.
- Edits written before this carry no pointer, so a link an old edit added stays
  unlisted.
- Undoing it is cheap: readers stop reading edits' pointers.
