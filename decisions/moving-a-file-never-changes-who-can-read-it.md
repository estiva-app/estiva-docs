# Moving a file to another Folder never changes who can read it, and its sub-files move with it

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, in the MAN-3 kickoff session (2026-10-02), and in the MAN-3 /land session (2026-10-03) for sub-files
- Area: Folders

## Who it affects

When Miky or Katerina moves a file to another Folder, it shows up there with
everything listed beneath it: a project moves with its issues, a page with its
sub-pages. Who can read the file does not change with the move. An app
refuses a move that would make a file look private when it is not, so nobody
is misled about who can read it. An outside company's app moves files the
same way.

## Context

A move only changes listings: a `kind:1852` add in the target Folder and a
`kind:1852` remove in the source (SPEC §3.3). The file's `h`, the channel that
decides who can read it today, never changes, because an event cannot change
its own `h` (SPEC §3, §3.1). So a file moved into a private Folder from
another would be drawn there while staying readable by its old channel's
members. Before MAN-3 the planner moved a single address and left a file's
sub-files behind.

## Decision

- A listing never grants, widens or narrows access; a move changes only where
  a file is listed (SPEC §3.1).
- An app does not plan a move into a private Folder of a file whose `h` names
  any other channel.
- A file's sub-files move with it: one add-and-remove pair for the file and
  one for each file listed beneath it, so a subtree moves whole. The add comes
  before the remove (SPEC §3.3).

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- An app's move never makes a file look private, and a moved project never
  leaves its issues behind.
- The move is about the file. Where its new comments are filed is the separate
  call [a conversation belongs to the file it is about](a-thread-belongs-to-what-it-is-about.md).
- A failure between the add and the remove leaves the file listed in both
  Folders, visible and fixed by moving again.
- Whether access should follow a file rather than its Folder is the open
  question of the Proposed
  [Who can read a file is decided on the file, and Folders are labels](folders-are-labels.md);
  this record decides only what a move does today.
