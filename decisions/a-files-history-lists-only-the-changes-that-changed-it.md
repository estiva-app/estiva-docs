# A file's history lists only the changes that changed it, and only for a file whose record the reader holds

- Date: 2026-11-21
- Status: Accepted
- Decided by: Miky, in the kickoff session of "The shared read gives each field with who set it and when, and the file's history" (Move Ship onto the shared read), 21 Nov 2026; written down 23 Nov
- Area: Files

## Who it affects

Anyone reading a file's History: Miky and Katerina in Ship's History panel,
the agent's `ship show` and `ship activity`, and an outside company calling the
shared read for a file's history. They all get the same list, and the list
never shows a change that did not actually change the file.

It came up on 21 Nov 2026, when Ship, the agent and the new shared history
turned out to list a file's changes in six slightly different ways, and again
when a history was asked for a file whose record is gone ("Move Ship onto the
shared read").

## Context

A file's changes are separate signed events (`kind:1851`), each naming the file
it changes. Before November, three pieces of code turned those events into a
history: Ship's own read, the agent's own rebuild, and nothing in the shared
read. They differed in small ways:

- a change that arrived twice was listed twice in one of them;
- a change that sets several fields was one line per field in Ship and no line
  at all in the agent;
- a change signed in another team than the file's, one aimed at another file,
  and a summary or delete on a file that names no team were listed by some and
  not others, although the file's fields ignore all of them;
- a file that names no team showed no History in Ship;
- a file whose record is gone (deleted the old way) or cannot be read still had
  its changes listed by the agent: 382 lines on 135 files on production,
  21 Nov.

The shared read now has one history (`historyOf` in
`@estiva-app/interop`, 0.111.0 and later), and Ship, the agent, Peek and Leaf
all use it. What it lists is today written only as Decided lines on one issue
and a comment on the function.

## Decision

A file's history lists exactly the changes that changed the file's fields, the
same ones the file's current fields are built from:

- each change once, however many times it arrives;
- one line per field a change sets;
- oldest first, in the order the relay keeps;
- left out: a change signed in another team than the file's, one that names
  another file, and a summary or delete on a file that names no team. None of
  them changed the file;
- a file that names no team still has its history.

A history is listed only for a file whose record the reader holds. Only then
can the reader check that a change was signed in the file's team, so a change
to a file the reader cannot see, or whose record is gone, is not listed
anywhere.

## Rejected alternatives

- **Each app keeps its own history.** Ship's and the agent's differed in six
  ways nobody had chosen. An outside builder would have had no answer to start
  from.
- **List every change that names the file, whether it counted or not.** The
  History would then show a rename that never happened, for example one signed
  in another team. History and the file's fields would disagree.
- **Still list the changes of a file whose record is gone.** The reader cannot
  check which team signed them, so it would list changes it cannot trust.

## Consequences

- History and the file's current fields can no longer disagree: they are read
  from the same counted changes.
- `ship activity` no longer lists changes to files whose record it cannot
  read.
- A change kind an app declares in its own listing (not `1851`) is not in the
  history yet: no app on production declares one. When one does, this rule
  applies to it too.
- Changing what a history lists later means changing the shared read and
  telling outside builders. The changes themselves stay on the relay, so
  listing more later loses nothing.
