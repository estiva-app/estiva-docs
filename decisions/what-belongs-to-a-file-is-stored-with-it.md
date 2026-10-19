# A comment, or a file created under another file, is stored with it, so only that file's readers can read it

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the LTX-4 /land session, on the brief "Who can read a comment on a private file" ([page](briefs/where-a-comment-is-filed.html)), and on the follow-up question there that the same holds for a new file created under another file
- Area: Folders
- Supersedes: a-thread-belongs-to-what-it-is-about.md

## Who it affects

Miky, Katerina and a customer comment on files, and add issues or sub-pages
under them, while looking at a Folder that shows a file another Folder owns.
Whatever an app writes for them about or under that file is stored with the
file, so it has the file's readers. They still see a file's whole
conversation wherever they open it, and are never shown which Folder a thread
came from, and the unread signal comes from the same place in every app. An
outside company follows one sentence: what belongs to a file is stored with it.

## Context

- It came up in /land's review of estiva-docs#310 (LTX-4), 2026-10-19.
- A comment (`kind:1111`) and a file are each stored in a Folder (`h`), and
  that Folder decides who reads them (SPEC §3.1).
- [A conversation belongs to the file it is about](a-thread-belongs-to-what-it-is-about.md)
  (Accepted, 2026-10-02, MAN-5) read a file's conversation by anchor and filed
  a project's new issues and comments in the Folder whose listing names it.
  SPEC §6.4 (estiva-docs#310) and §6.7 applied that to every kind.
- While every Folder is open the two Folders have the same readers; once a
  Folder can be private, they do not. On the relay on 19 Oct: 49 Folders, none
  private; 33 of 112 listed files sit in a Folder other than their own, all
  between open Folders.
- [Moving a file never changes who can read it](moving-a-file-never-changes-who-can-read-it.md)
  (Accepted). Under the 2 Oct write line, a move did change who could read a
  file's new comments and issues.

## Decision

- **Writes go to the file's own Folder.** A new comment on a file, and a new
  file created under it (an issue in a project, a sub-page), takes as `h` the
  file's own Folder: its root's `h`, or `buzz-channel` on a record placed that
  way. Never the Folder whose listing it was opened or offered from. A reply
  copies its comment's `h`. SPEC §6.4, §6.7, §7.8.
- **Reads go by anchor**, as decided on 2 Oct: a file's conversation is every
  thread anchored at it, whatever Folder each was filed in, in every app. A
  thread is never labelled with the Folder it came from, and reads are never
  bounded by Folder.
- A change to the file itself (`kind:1851`) goes to its own Folder, as before.

## Rejected alternatives

- **The Folder the file was opened from, and a private file is never shown in
  another Folder.** Two rules instead of one; making an open Folder private
  later strands its files' earlier comments in other Folders.
- **The Folder it was opened from when the file's Folder is open, the file's
  own when it is private.** Correct only at the moment of writing: a Folder
  that turns private leaves earlier comments where they were, and every
  app must read Folder settings before each comment.
- **A sub-file goes where it was created** (today's §6.7 for non-bare
  parents). Its readers would be those of the Folder it was created from,
  not its parent's.
- From the 2 Oct record, still rejected: **re-pointing a project at another
  Folder** (the `folder` field and `link-project`; ruled dead 2026-09-29), and
  **showing each thread's source Folder or reading a conversation from one
  Folder only** ("Nobody cares what Folder it comes from").

## Consequences

- Leaf, Peek and Ship file new comments and sub-files in the file's own
  Folder; a live view also listens to that Folder, not only the one on screen.
  Ship's project work Folder (MAN-5) changes with it.
- A move within a listing offers as parents only files stored in the same
  Folder as the file being moved. This follows from
  [moving a file never changes who can read it](moving-a-file-never-changes-who-can-read-it.md)
  (a move never changes where a file is stored): under any other parent, a
  sub-file's readers would differ from its parent's.
- Comments and issues already filed in a listing Folder stay there and are
  still read by anchor; all are in open Folders today.
- This decides where an app writes. What a reply follows, and how apps or the
  relay treat a comment or sub-file stored somewhere other than its file's
  Folder, are decided when private Folders are built (Miky, 2026-10-19: "a
  better question when we actually implement private Folders").
- Who can read a file at all is still the open question of the Proposed
  [Folders are labels](folders-are-labels.md); this record holds under either
  answer, because a comment follows its file.
