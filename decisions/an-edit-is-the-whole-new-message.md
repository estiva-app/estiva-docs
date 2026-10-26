# An edit is the whole new message, its words and its files, so an edit with no files takes every file off

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the kickoff session of "Editing can take every file off a message" on 26 October, on the brief "What an edit says about a message's files" ([page](briefs/an-edit-and-its-files.html)): option B, after asking whether A was recommended only because of 4 messages
- Area: Messages

## Who it affects

Miky, 26 October, deciding PEEKM-4's review: editing a comment, he could take
its files off one by one, but Save refused to take off the last one ("the last
file cannot be taken off a message yet") in Peek, Ship and Leaf. "Why would
edit not allow to remove all?" Under this record you can, in every app. Every
app, the agent and any outside company read an edit the same way: as the
message's words and files from then on.

## Context

- Until now an edit said nothing about files unless they changed, and an edit
  with none meant "unchanged", so emptying was not expressible
  ([SPEC §6.8](../protocol/SPEC.md); RFC 0.4 open question 11).
- Buzz's desktop app, our relay's upstream, already reads an edit's file list
  as the whole set: an edit with none means no files
  (`desktop/src/features/messages/lib/applyEditTagOverlay.mjs`). It showed a
  Peek or Ship typo fix with no files. Matrix edits also carry the whole new
  content.
- On production on 26 October, in the Folders the agent can read, there were
  177 edits on 153 messages, and 4 messages would read differently under this
  rule: 3 of Katerina's comments and 1 QA-1 test comment. The relay lets only a
  message's author (or an agent's owner) edit it.
- The brief recommended A, a "complete" mark on every edit. Miky asked whether B
  lost only because of those 4 messages. It had: that mark exists only to tell
  new edits from old ones, which is the compatibility shape
  [early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)
  turns down.

## Decision

- **An edit is the whole new message.** A message's files are the `imeta` tags
  of its latest edit, and an edit with none means no files (SPEC §6.8).
- **Every writer carries every file the message keeps on every edit**, a
  words-only edit included.
- **It is built in stages, so nothing is lost on the way.** First every app and
  the agent write the full list on every edit, which changes nothing under the
  old rule. Then every message that would read differently is re-saved with its
  files by its author. Only then do readers switch.
- Taking a file off only hides it. Anyone in the Folder can still read the file
  and the earlier edits. Deleting a file for good is a separate question.

## Rejected alternatives

- **A · Every edit is a whole version, marked "complete"**: every edit lists
  its files and carries a mark, and an unmarked edit keeps the old "unchanged"
  meaning. It was recommended because an edit that forgets the list then
  changes nothing. But the mark exists only for edits already on the relay, and
  every reader would keep two rules for good.
- **C · Do less**: the mark only on the edit that empties the list. It is
  smaller, but it keeps both rules too, and our typo fixes would go on dropping
  files in Buzz desktop.

## Consequences

- One rule, the same as upstream Buzz: an edit is the message from then on,
  and each edit can be opened on its own as a version
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)).
- A writer that forgets the list takes every file off. It sees that in its own
  app, as it would for forgotten words. The files stay stored and can be put
  back.
- Katerina re-saves her 3 comments before readers switch. Folders the agent
  cannot read were not counted.
- A tab still open from before the writers' update that edits after readers
  switch takes that message's files off.
- Cards keep their own rule: an edit with no `embed` leaves them, because an
  absent card has a meaning of its own, the default card (SPEC §13.6.2).
- Every edit re-lists its files, so the relay checks each one is still stored.
  If deleting a file is ever built, a message that pointed to a deleted file
  can only be edited once that file is taken off it.
