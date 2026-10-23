# An archived file is read-only in every app: no new comment, reply or reaction, and no edit or delete, until it is unarchived

- Date: 2026-10-20
- Status: Accepted
- Decided by: Miky, in three sessions. On 2026-10-17, in the kickoff of the shared box's prototype ticket (Ship issue 851c0c1e): no comments on an archived file, in every app, and a line in the box's place saying why, not a greyed box. On 2026-10-20, in COMM-7's /land session: the words of that line. On 2026-10-20, in the shaping session of "Peek moves onto the shared box": your own messages are frozen too, and a Leaf page archived in Peek is fully read-only
- Area: Messages

> Superseded in part, 2026-10-23: the part "or when every Folder listing it
> is", and which file the parent line names, are replaced by
> [a-file-is-archived-with-the-closest-archived-file-above-it](a-file-is-archived-with-the-closest-archived-file-above-it.md).
> The rest of this record stands.

## Who it affects

Miky or Katerina opens a file that is archived, in Peek, Ship or Leaf. Every
app shows it the same way: you can read it, but you cannot add to it or change
it. Where the comment box would be, a line says why and what to do:
"Archived. Unarchive it to comment." To change something, you unarchive it
first.

## Context

- SPEC §6.5 says "Comments stay open" on an archived file, and SHI-36 built
  that in Ship ([SPEC §6.5](../protocol/SPEC.md)). Miky reversed it on 17
  October: "Comments on an archived file → none, in every app, reversing
  SHI-36's 'comments stay open'". He also asked for "a read-only box → a line
  in its place saying why, no greyed box".
- A file can be archived itself, through a file up its parent chain, or by
  every Folder that lists it. SPEC §6.5 computes this when reading.
- Leaf has no Unarchive of its own. A Leaf page can be archived in Peek.
- Today the apps differ: Ship already does this (`ThreadList.tsx:299`), Peek
  hides the box with no line, and Leaf and the agent CLI do not do it yet.

## Decision

- **While a file is archived, no app offers a change to its conversation.**
  That covers a new comment, reply or reaction, and an edit or delete of what
  is already there, your own messages included. You cannot take back a
  reaction either.
- **A file counts as archived** when it is archived itself, when any file up
  its parent chain is, or when every Folder listing it is.
- **The box's place shows a line instead of the box:**
  - "Archived. Unarchive it to comment." for a file archived itself.
  - "Unarchive the project to comment." or "Unarchive the Folder to comment."
    for a file archived with its parent.
  - A Leaf page archived in Peek goes fully read-only, its text and its
    comments, with "Archived. Unarchive it in Peek to comment.", since Leaf
    has no Unarchive.
- **It is a client rule, not a lock on the relay.** Archive is a view folded
  at read time, not an access boundary. A reader still shows any such event
  whatever its `created_at`, because an older app, an outside client or the
  agent can still write one.
- Carried out by the project "Peek moves onto the shared box". SPEC §6.5
  changes in that project's issue for the archived rule, not here.

## Rejected alternatives

- **Closed to new, your own stays yours.** No new message or reaction, but each
  author can still edit or delete their own and take back a reaction. SPEC's
  one other closed thread, under a deleted comment, works this way. Miky turned
  it down on 20 October. What it costs: to fix a typo or pull a pasted secret
  on an archived file, you must unarchive it first, and for a file archived by
  its Folder only a Folder owner or admin can.
- **Delete only.** No edits, but you may delete your own. It is a third rule to
  learn.
- **Comments stay open.** What SPEC §6.5 and SHI-36 said before 17 October.

## Consequences

- One rule for an archived file in every app, so a person learns it once.
- Peek, Leaf and the agent CLI have work to do. Ship already does it.
- To change anything on an archived file, someone who may unarchive it has to
  do so first.
- Two-way: nothing on the relay changes, and undoing it means offering the box
  again.
