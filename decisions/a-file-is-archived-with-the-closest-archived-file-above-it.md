# A file is archived with the closest archived file above it, at any depth, and its line names that file by its kind; whether a Folder's archive freezes the files it lists waits for Folders as labels

- Date: 2026-10-23
- Status: Accepted
- Decided by: Miky, in the kickoff session of Ship issue f5035aca (PEEKM-2, "One rule for when a file is archived, written in SPEC and read the same by every app"), 23 October
- Area: Messages

> Supersedes in part
> [an-archived-file-is-read-only-in-every-app](an-archived-file-is-read-only-in-every-app.md):
> only "or when every Folder listing it is" and which file its parent line
> names. The rest of that record stands.

## Who it affects

Miky or Katerina opens a file whose project, page or topic above it is
archived, in Peek, Ship or Leaf. Every app now agrees that it is archived too,
however far up the archived file is, and the line in the comment box's place
says what to unarchive: "Unarchive the page to comment." for a Leaf page under
an archived page, "Unarchive the project to comment." for an issue. When two
things above it are archived, the line names the closer one; once that one is
unarchived, it names the next.

It came up in the protocol pre-review of 20 October: Peek read only a file's
own archive, interop looked one level up, and Ship had its own rule, so one
app could close a file's box while another kept it open.

## Context

- [an-archived-file-is-read-only-in-every-app](an-archived-file-is-read-only-in-every-app.md)
  (Accepted 2026-10-20) says a file counts as archived when it is archived
  itself, when any file up its parent chain is, "or when every Folder listing
  it is".
- That Folder part has a hole. Anyone in a live Folder can list the file there
  and so reopen it, while only a Folder's owners and admins can unarchive the
  Folder ([only-owners-and-admins-rename-or-archive-a-folder](only-owners-and-admins-rename-or-archive-a-folder.md)).
  Knowing every Folder that lists a file also costs a read a link does not
  make today. Whether a Folder is a place or a label is open until the
  Folders-as-labels rework ([folders-are-labels](folders-are-labels.md)).
- The old record names only "the project" and "the Folder" for a parent. A
  Leaf page under a page, or a topic under an issue, had no words.

## Decision

- **A file is archived with the closest archived file above it**, at any depth
  up its parent chain. Each level's parent is read by that file's own kind
  (SPEC §6.5). The archive of each level counts only when it was signed in
  that file's own Folder (§6.2).
- **The line names that closest file by its kind**: "Unarchive the page to
  comment.", "Unarchive the project to comment.", "Unarchive the topic to
  comment.". "Archived. Unarchive it to comment." for a file archived itself
  stays as it was.
- **The Folder part is parked.** Whether a file counts as archived because
  every Folder listing it is archived waits for the Folders-as-labels rework.
  Until then each app keeps what it does today: Ship still closes an issue
  whose every team is archived, and says "Unarchive the Folder to comment.";
  Peek and Leaf do not.
- Everything else in
  [an-archived-file-is-read-only-in-every-app](an-archived-file-is-read-only-in-every-app.md)
  stands: no new comment, reply or reaction, and no edit or delete, while the
  file is archived; a client rule, not a relay lock.

## Rejected alternatives

- **Every Folder listing it, as the old record said.** Anyone can undo it by
  listing the file in a live Folder, and it settles what a Folder is before
  the rework does.
- **The top-most archived file.** The line would name something further away
  than what is actually in the way: unarchiving the closer one would not
  reopen the file.
- **"Archived with its parent", with no kind.** Says nothing a person can act
  on.

## Consequences

- Peek, Ship and Leaf read one answer from interop (0.65.0,
  `archivedAncestorOf`), so a file's box is closed in all three or in none.
- A file under a deeply archived page reads archived in Peek, which it did not
  before.
- The Folder question stays open, and Ship differs from Peek and Leaf on it
  until the rework.
- Two-way: nothing on the relay changes. Undoing it means reading the chain
  differently again.
