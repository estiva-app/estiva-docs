# A conversation belongs to the file it is about, not to the Folder it was filed in

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, on MAN-5
- Area: Folders

## Who it affects

When Miky or Katerina opens a project, in Ship or in Peek, they see every
thread and issue about it, whichever Folder each was filed in, and the unread
signal comes from the same place in both apps. Nobody is shown which Folder a
thread came from. An outside company's app finds a file's conversation by
what each thread is anchored at, with no Folder lookup.

## Context

Ship once re-pointed a project at another Folder with a `folder` change
(`kind:1851`) and the `link-project` command. By 2 Oct that had re-pointed 24
projects, so Ship and Peek read one project's talk from two channels and
people were confused about where a conversation was (PRO-21). Miky ruled
`link-project` dead on 2026-09-29, and MAN-5 removed the field. On 2 Oct he
settled where a conversation belongs: "Nobody cares what Folder it comes
from. Folder is just a label."

## Decision

- **Reads go by anchor.** A file's conversation is every thread anchored at it
  (its `a`/`A` tag), whatever Folder it was filed in, in every app (SPEC §3.1,
  §6.4).
- **New writes go to the Folder that lists the file.** A new issue or comment
  for a project is filed in the Folder whose listing (`kind:30890`) names the
  project, not the one its record names. A change to the record itself
  (`kind:1851`) still goes to the record's own Folder.
- A thread is never labelled with the Folder it came from, and reads are never
  bounded by Folder.

## Rejected alternatives

- **Re-point a project at another Folder** (the `folder` field and
  `link-project`). Ruled dead by Miky on 2026-09-29: one project read from two
  channels split its conversation and confused people (PRO-21).
- **Show each thread's source Folder, or read a project's conversation only
  from one Folder.** "Nobody cares what Folder it comes from."

## Consequences

- Older projects keep threads in two Folders on the relay, and every app still
  shows them as one conversation.
- Which Folder a thread was filed in stays on each event (its `h` cannot
  change). Who can read it is a separate question, open in the Proposed
  [Who can read a file is decided on the file, and Folders are labels](folders-are-labels.md),
  which this record does not decide.
