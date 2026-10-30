# Each company defines its own statuses for a shared type, starting from the defaults its tracker provides; the shared part is what each status means

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the /land session of ALO-2 (review of estiva-docs#351), 2026-10-30, asked whether Ship's four project statuses are the shared list for every company: "ideally each tracker defines the statuses, because even in Linear you can define your statuses, so eventually it's on the customer to decide what statuses are there and the tracker will provide some default"
- Area: Files

> Supersedes in part
> [a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)
> (a shared type's public definition fixes "an issue's status, and what each
> status means" as options with fixed ids). A shared type's statuses are now the
> company's own; the rest of that record stands.

## Who it affects

An outside company building a tracker on Osnova keeps its own workflow
("Backlog", "Paused", "In review") instead of fitting Ship's four words. Ship
offers its four as the defaults a workspace starts with. Miky and Katerina see
no change until a workspace edits its statuses.

It came up when `/land` reviewed the first public entry in the list of shared
types, `osnova.project` (estiva-docs#351). That entry gave a project's status
as exactly Ship's four words, "as Ship writes a project's status today". No
record had chosen that list.

## Context

- Ship writes a project's status as `planned`, `in_progress`, `completed` or
  `cancelled`. Its manifest gives each one a label, a colour and a stage (Ship
  `src/nostr/kinds.ts:173`, origin/main 2026-10-30).
- SPEC §7.4 already has every app publish its status words with a **stage**
  (`open`, `started`, `done`, `dropped`): what a status means, apart from what
  it is called. Without it, an app counting progress reads another app's
  words as no progress.
- The 26 Oct record made a shared type's statuses fixed options in its public
  definition, with Ship's words as the ids.
- No app writes a project as an artifact yet. Ship moves its projects in the
  next milestone of "A load stays the same size as edits pile up: projects", so
  nothing written has to change.
- Linear lets each team define its own statuses, and each one sits in a fixed
  category. Jira lets each workflow define them, in three categories.

## Decision

A shared type such as `osnova.project` does not fix its statuses. Each company
decides its own, and its tracker provides defaults to start from: Ship's
defaults are Planned, In Progress, Completed and Cancelled. What every app
shares is what a status means, one of the four stages of SPEC §7.4. So Ship,
Peek, Leaf and any outside app count a company's projects correctly whatever
the statuses are called. protocol/TYPES.md says so for `osnova.project`.

## Rejected alternatives

- **Ship's four, fixed for every company, adding more later as compatible
  changes.** The recommended option when asked. It was the simplest to read,
  but every company would have to bend its workflow to Ship's words and ask
  Estiva for each new one.
- **A longer fixed list now, as Linear's defaults (adding Backlog and
  Paused).** More companies would fit on day one. It is still a list nobody
  but Estiva can change, and every word added would be kept for ever.

## Consequences

- An outside tracker is adoptable without renaming its workflow; a status is
  never a protocol change.
- A reader can no longer know every status in advance. It draws the word it
  finds and counts by the stage.
- SPEC rules this record does not settle, owed when Ship moves its projects:
  - where a company keeps its list of statuses, and who may change it;
  - whether a save carries the stage beside the status, so a list read without
    the text still counts progress;
  - what a reader shows for a status whose definition it cannot read.
