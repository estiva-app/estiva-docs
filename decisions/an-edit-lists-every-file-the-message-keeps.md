# An edit lists every file the message keeps and says its list is complete, so an edit can take every file off

- Date: 2026-10-26
- Status: Proposed
- Area: Messages

## Who it affects

Miky, 26 October, deciding PEEKM-4's review: editing a comment, he could take
its files off one by one, but Save refused to take off the last one ("the last
file cannot be taken off a message yet") in Peek, Ship and Leaf. "Why would
edit not allow to remove all?" He decided that it must be possible. This record
is how an edit says so, and it sets what every edit means for every app, the
agent, the History panel, and a company reading Estiva's edits.

## Context

- An edit says nothing about files unless they change. When it lists files,
  the list replaces the message's. An edit with none means "unchanged", so
  emptying is not expressible ([SPEC §6.8](../protocol/SPEC.md), RFC 0.4 open
  question 11, which named "a marker tag meaning this edit's attachment set is
  authoritative, even if empty").
- Buzz's desktop app, our relay's upstream, reads an edit's file list as the
  whole set, so an edit with none means "no files"
  (`desktop/src/features/messages/lib/applyEditTagOverlay.mjs`). It shows a
  Peek or Ship typo fix with no files. For mentions, where old edits existed,
  it added a mark saying "this list is complete" (`buzz:mention-snapshot`).
- The relay refuses a new field inside a file's `imeta` tag, and an `imeta`
  with no file (`validate_imeta_tags`). A separate tag on an edit passes.
- On production on 26 October, in the Folders the agent can read, there were 177
  edits on 153 messages. If an edit with no list meant "no files", 4 messages
  would lose theirs, 3 of them Katerina's comments, which only she can re-save.
- Brief: `an-edit-and-its-files.html`, asked on 26 October.

## Decision

Proposed (option A of the brief):

- An edit MAY carry a valueless `["imeta-snapshot"]` tag. It means the edit's
  `imeta` tags are the message's complete file set, none included.
- A message's file set is the `imeta` set of its latest edit that carries
  `imeta` or the mark. An edit with neither leaves the set as it was, so every
  edit already on the relay keeps its meaning.
- Every edit an Estiva app or the agent writes carries the mark and every file
  the message keeps. Taking the last file off is an edit with the mark and no
  `imeta`.
- Taking a file off only hides it. Anyone in the Folder can still read the
  file and the earlier edits. Deleting a file for good is a separate question.

## Rejected alternatives

None yet. The brief's other options:

- **B · Buzz's rule as it is**: an edit's list is the files and there is no
  mark. It is the simplest rule and matches upstream, but 4 messages would lose
  their files on switch-over (3 of Katerina's comments), and any writer that
  forgets the list (a stale tab, a new outside builder) takes every file off.
- **C · Do less**: the mark only on the edit that empties the list. It reads
  the same as A, but our typo fixes keep dropping files in Buzz desktop, and an
  edit is not a whole version.

## Consequences

- Every edit is a whole version, which the History panel can open on its own
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)).
- Buzz desktop reads every new edit from our apps correctly. A Buzz desktop
  edit that empties a message is still read as "unchanged" until Buzz writes
  the mark.
- What the mark means is permanent once it is on the relay. How often apps
  write it can change.
- Every edit re-lists its files, so the relay checks each one is still stored.
  If deleting a file is ever built, a message that pointed to a deleted file
  can only be edited once that file is taken off it.
