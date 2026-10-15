# It is called a Folder; "team" is not a second name for it

- Date: 2026-09-25
- Status: Accepted
- Decided by: Miky, in a working session
- Area: Folders

## Who it affects

Miky, Katerina and anyone reading the apps, the docs or an agent's message see
one word for what the apps call a Folder. Estiva HQ, Peek, Ship, Leaf and Steer
are Folders, not teams. An outside company reading SPEC learns one name. This
record is about the word only; what a Folder is for, and whether it decides who
can read a file, is open ([folders-are-labels](folders-are-labels.md),
Proposed).

## Context

"Team" entered on 5 Sep in the ROADMAP's table ("Team | a Folder: people,
permissions, one conversation space", estiva-docs#71). From there it spread
into SPEC §6.7 ("Same team", "team listing"), Ship's New project dialog, the
`ship create-project --team` flag, Peek's code and errors, and agents' notes.
Each session read it and repeated it. On 25 Sep Miky: "why you still say team,
it's confusing. It's Folder. It's happening cross session."

## Decision

- The word is Folder, or "top-level Folder" for the ones at the top.
- Text written for people says Folder. Where a source says "team", it is
  translated, and quoted only when citing that source.

## Rejected alternatives

- **"Team" as a friendlier name for a top-level Folder.** Two names for one
  thing confused Miky, and the second one spread. No other option was
  discussed.

## Consequences

- One word across apps, SPEC and agents.
- Older identifiers still say team (`useTeamUnread`, `--team`, variables
  named `teams`). Whether those are renamed is not decided here.
