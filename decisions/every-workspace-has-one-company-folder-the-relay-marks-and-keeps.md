# Every workspace has exactly one Company Folder, which the relay marks and keeps for good

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the kickoff session of "The SPEC says a file is its fields, how every type starts, and why projects and issues are not git's" (2026-10-30), on the brief "How an app finds the Company Folder" ([page](briefs/how-an-app-finds-the-company-folder.html)): A, as recommended
- Area: Folders

## Who it affects

Miky and Katerina see nothing new on screen. Estiva HQ is Estiva's Company
Folder; it can be renamed, but no menu offers to delete it, archive it or make
it private.

An outside company's app asks the relay which Folder is the company's and
always gets exactly one answer, in every workspace. That is where a project
filed in no Folder goes, and where the company's statuses file is found.

It came up on 30 Oct, at the kickoff of the SPEC rewrite that replaces SPEC
§6.13, whose sentence "how an app finds a workspace's Company Folder is
specified with the move" was the only place the question was written down.

## Context

- Three Accepted records put things in the workspace's Company Folder: a
  project in no Folder
  ([every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md),
  via SPEC §6.13, standing in that part), the company's statuses
  ([a-companys-statuses-are-its-own-layer-of-a-types-properties](a-companys-statuses-are-its-own-layer-of-a-types-properties.md)),
  and the way an app finds that statuses file, "by its type and the mark, in
  the Company Folder"
  ([a-file-can-say-only-admins-write-it-and-the-relay-keeps-to-it](a-file-can-say-only-admins-write-it-and-the-relay-keeps-to-it.md)).
- Nothing on the wire marks one (checked 30 Oct). A Folder's metadata is
  signed only by the relay and carries its id, name, about, public or private,
  unlisted, restricted, hidden, closed, labels and creator (buzz
  `nfb-demo-kinds`, `crates/buzz-db/src/store/channel.rs`,
  `group_metadata_tags`). Only an owner or admin may change a Folder's labels.
- The relay makes no Folder when a workspace is set up, and no app's code
  knows which Folder is the company's: Estiva HQ is one of five team Folders,
  the company's only by name.
- From the same rewrite, the relay refuses a change filed in another Folder
  than its file's, so the relay too must know which Folder an unfiled
  project's changes belong to.

## Decision

- **Every workspace has exactly one Company Folder.** The relay marks it as
  the company's, in the Folder metadata it signs, and makes it when a workspace
  is set up. Estiva's is Estiva HQ, marked once.
- **It is kept for good.** It can be renamed. The relay refuses to delete it,
  archive it, make it private or take the mark off it.
- **Apps find it by the mark**, never by its name or id, and trust only the
  mark their own workspace's relay signed, so a Folder shared from a partner
  company's relay never counts as ours.
- A project filed in no Folder, and the company's statuses file, live there.
- SPEC §3 says so, in the rewrite of "The SPEC says a file is its fields, how
  every type starts, and why projects and issues are not git's"; the relay's
  mark and refusals are built with the relay work of the projects that need
  them.

## Rejected alternatives

From the brief "How an app finds the Company Folder" (30 Oct):

- **B · The owner picks it and can move it.** An owner or admin marks any
  Folder in settings and can move the mark; until then there is none. Turned
  down: every app, an outside company's included, must handle "none picked" and
  "the mark moved"; moving it leaves the unfiled projects and the statuses file
  behind, so the company's statuses silently go back to the tracker's defaults
  until an admin saves them again.
- **C · Do less: no Company Folder.** A file in no Folder names no Folder and
  every member reads it. Turned down: it reverses "in the Company Folder" in
  three Accepted records and the rule that every file names its Folder, and
  every rule written per Folder (who archives, what a list shows, what a shared
  Folder carries) needs a "no Folder" case in every app.

## Consequences

- The Company Folder is part of the protocol: an outside app never handles a
  workspace without one.
- An admin who wants to reorganise can rename it, not remove it; a workspace
  with no use for a company-wide space still has one, empty.
- Mostly two-way: the protection can be dropped later and no file moves, but
  outside apps told "there is always one" would then each need a "none" case.
- The navigation rework's "there is always a Company team" (Miky's brainstorm,
  28 Oct, no record yet) can start from this Folder; that rework decides it.
- Relay work: the mark, making it at setup, and the four refusals.
