# Who can read a file is decided on the file, and Folders are labels

- Date: 2026-10-14
- Status: Proposed
- Area: Folders

## Who it affects

When Miky, Katerina or a customer opens a file (an issue, a topic, a page),
something decides whether they may read it. Today that is the Folder it was
filed in. This record writes down the option the brief recommended: the file
decides, and a Folder only organises. The recommendation is the agent's, not
Miky's; he has not chosen between the three options. He parked it on 14 Oct until the navigation
across the apps is reworked, because that work is related. **Nothing is built
on it.**

## Context

On the wire a Folder is a group: it is what the relay checks a read or a write
against, and the unit a live connection watches. Miky said on 8 Oct that this
steers the architecture to many odd places and asked whether a Folder should
work more like a label. On 2 Oct he had ruled that "a thread is the project's
by anchor, any Folder", and SPEC separates a listing from access. Only the relay's check still points at
the Folder. A brief with three options was put to him on 14 Oct, and he
parked it.

## Decision

Proposed (the brief's recommendation): access lives on the file, and Folders
are labels. A new file's
default readers, whether readers have levels (view, comment, edit), and where a
conversation about no file lives would each still be Miky's call.

## Rejected alternatives

None rejected yet; these are the options in the brief.

- **The Folder is the wall** (today). Costs nothing now. What a person can read
  is decided by a Folder the file may no longer be shown in, and work across
  Folders (live widgets, mentions, Desk) needs workarounds.
- **The Google Drive shape: the Folder grants, files inherit.** Familiar, but
  moving a file changes who can read it.

## Consequences

- Two-way until the first private Folder or the first outside app is built on
  the Folder as the wall. Shaping "Private folders / topic / files" before this
  is decided makes it one-way.
- Until it is decided, a change that deepens the Folder as the wall says so
  where it is proposed, rather than settling this question quietly.
- If accepted, it is the most relay work of the three options: a rule no
  upstream relay has, moving existing files over, and teams and sharing.
