# A comment is filed with the file it is about, so only the file's readers can read it

- Date: 2026-10-19
- Status: Proposed
- Area: Folders

## Who it affects

Miky, Katerina and a customer comment on files that one Folder owns and
another Folder shows. This decides whose members can read such a comment: the
owning Folder's, so a comment's readers are always the file's readers, or the
showing Folder's. The two groups are the same people while every Folder is
open; they differ once a Folder can be private. An outside company adopting
Nostr-for-Business expects a comment on a private document to be as private as
the document. It came up in /land's review of estiva-docs#310 (LTX-4),
2026-10-19.

## Context

- A comment (`kind:1111`) is stored in a Folder (`h`), and that Folder decides
  who reads it (SPEC §3.1, §6.4).
- [A conversation belongs to the file it is about](a-thread-belongs-to-what-it-is-about.md)
  (Accepted, 2026-10-02) reads a file's conversation by anchor and files new
  writes in the Folder whose listing names the file. SPEC §6.4 applies that to
  every kind and app (estiva-docs#310).
- [Moving a file never changes who can read it](moving-a-file-never-changes-who-can-read-it.md)
  (Accepted): a listing grants nothing. Under the 2 Oct write line, a move does
  change who reads the file's *new comments*.
- On the relay, 19 Oct: 49 Folders, none private; 33 of 112 listed files sit in
  a Folder other than their own, all between open Folders. So no comment is
  readable today by anyone who cannot read its file. Private Folders wait on
  hiding their listing (SPEC §3.1, FOL-10).

## Decision

Proposed (the brief's recommendation, not Miky's): a new comment on a file
takes as `h` the file's own Folder (its root's `h`, or `buzz-channel` on a
record placed that way), whichever Folder it was opened from. A reply copies
its comment's `h`. Reading stays by anchor, as the 2 Oct record decided.
Brief: "Who can read a comment on a private file".

## Rejected alternatives

None rejected yet; these are the other options in the brief.

- **Keep the showing Folder, and never show a private file in another Folder.**
  One rule on comments plus a move rule; making an open Folder private later
  strands its files' old comments in other Folders.
- **The showing Folder when the file's Folder is open, the file's own when it
  is private.** Same as the recommendation for private files, but correct only
  at write time: a Folder that turns private leaves earlier comments readable
  by everyone.

## Consequences

- If accepted, it supersedes the 2 Oct record's line on where new writes go
  (its reading rule stays), and gains `Supersedes:` then. SPEC §6.4's "Which Folder a new comment goes into" changes,
  Leaf, Peek and Ship file comments in the file's own Folder, and a live view
  listens to the file's own Folder as well as the one on screen.
- Comments already filed in a showing Folder stay there; all are in open
  Folders today.
- Two-way until private Folders ship; one-way after, because a comment's `h`
  cannot change.
