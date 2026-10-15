# A Folder never holds another Folder: there is one level

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, in the MAN-3 kickoff session
- Area: Folders

## Who it affects

Miky and Katerina see their Folders side by side at the top of every app,
never one inside another. A file can sit under another file (an issue under a
project, a page under a page), but a Folder is never a row inside a Folder.
An outside company's app draws the same flat list of Folders and needs no
rule for nesting.

## Context

The SPEC rewrite of the Folder (MAN-3, SPEC §3) had to say whether a Folder's
listing (its relay-signed `kind:30890`) may name another Folder. On production
one Folder already did: the "Folders" Folder had been listed inside Estiva HQ
by a single `kind:1852`, and Peek, Ship and interop drew it as a row there.

## Decision

- There is exactly one level. A Folder's listing names files, never a Folder
  (`39000:` address). A writer never sends a `kind:1852` naming one (SPEC §3).
- A reader that finds such a row ignores it and draws the named Folder at the
  top, like every other Folder.
- The one nested Folder on production is unwound, and nesting comes out of
  interop and the apps.

## Rejected alternatives

- **Folders inside Folders.** Interop could already draw them, and one existed
  on production. Miky, confirming the call on 2026-10-03 while shaping the
  docs site: one level is an "easier concept to grasp, at least now".

## Consequences

- Navigation is the same in every app: a flat list of Folders, with any depth
  coming from files under files.
- Miky's "at least now" leaves nesting open to a later call. Allowing it then
  is a SPEC change every reader must follow, or nested Folders vanish in the
  apps that do not.
