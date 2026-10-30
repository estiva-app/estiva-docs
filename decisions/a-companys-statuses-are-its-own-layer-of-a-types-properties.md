# A company's statuses are its own layer of a type's properties, kept in a file the workspace's admins edit, and every status change also carries its stage

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the shaping session for "Each company sets its own statuses" (then titled "Apps declare their types to the relay", 2026-10-30), on the brief "Statuses and Declarations", call 1: A, the company's own list, sharpened: "this is exactly why we need Notion-like dbs on Osnova Protocol level that every app can use: define a column type, e.g. select box, then add the list of values — exactly Ship's statuses"; who edits it, "Company admins", then, asked which list names them, the workspace's owners and admins on the relay's roster, as recommended; and, asked later in that session, in a question of its own, how a change carries the stage: attached to the status change, not a field of its own; and, asked after review, which stage counts when the change's and the file's disagree: the change's, as recommended
- Area: Files

## Who it affects

There is no real moment yet of Miky or Katerina wanting a status Ship lacks.
The brief's example: if a company adds "Blocked" (meaning started) in Ship's
settings, Peek's project card shows "Blocked" at once and still counts the
project as underway, and so does any other app that reads projects. Renaming
"In Progress" to "Doing" changes no project.

An outside company's tracker reads and writes the same list as Ship, so one
company has one set of statuses whichever tracker its people use. Later its
labels, priorities and its own columns go in the same place.

## Context

- [each-company-defines-its-own-statuses](each-company-defines-its-own-statuses.md)
  (Accepted 30 Oct) made a shared type's statuses each company's own, starting
  from its tracker's defaults, with what each status means (its stage) shared.
  It left three rules for when Ship moves its projects: where the list lives
  and who changes it; whether a save carries the stage; what a reader shows for
  a status it cannot look up.
- [an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)
  (Accepted 26 Oct) gave a type's properties one schema shape, in two places,
  an app's listing and a person's database: each property has a fixed id, a
  label and a kind of value, and each option of a choice a fixed id and a label.
  This record extends it with a third place and two more parts of an option.
- Ship's four project statuses, each with a label, a colour and a stage, are in
  Ship's code and published in its listing (Ship `src/nostr/kinds.ts:173`,
  `src/nostr/manifest.ts:197`, checked 30 Oct). Nobody can change them.
- A listing is signed by its app's key (SPEC §7), so a person's edit cannot be
  signed with Ship's key.
- A project in no Folder lives in the workspace's Company Folder, the one every
  member reads (SPEC §6.13).
- A field's changes are folded one field at a time, last change wins (SPEC
  §6.3), and an app that reads changes today drops a change that names no
  field (Ship `src/nostr/fold.ts:214`, checked 30 Oct).
- Linear sets project statuses for the whole workspace, each under one of five
  fixed categories; in a Jira team-managed space, its admins edit statuses
  (the brief's Checked; who may edit Linear's was not confirmed).

## Decision

- **A company's statuses are the company's own layer of the type's
  properties**, in the one schema shape: Status is a choice property, and each
  option has a fixed id, a label, a colour and a stage. The layers are:
  1. the public type says a project has a Status;
  2. the tracker's listing gives the default options (Ship's: Planned, In
     Progress, Completed, Cancelled);
  3. the company's file holds the company's own options, starting from the
     defaults of the tracker the workspace added;
  4. later, a person's database writes the same property shape.
- **The company's file is kept in the workspace's Company Folder**, and every
  app reads it. Labels, priorities and new columns later are more properties in
  the same file.
- **The workspace's owners and admins on the relay's roster edit it**, in
  Ship's settings once that editor is built. There is one such file per type, and a change to it from
  anyone else, an app's key included, changes nothing anyone sees. Until an
  admin first saves it, apps use the defaults in the tracker's listing.
- **Renaming an option keeps its id**, so a rename changes no project.
- **Every status change carries the option's id and its stage**: the stage is
  attached to the status change, beside the value, not a field of its own, and
  so is a status set inside a change that sets several fields
  ([one-change-may-set-several-fields-taken-whole-or-refused-whole](one-change-may-set-several-fields-taken-whole-or-refused-whole.md)). A list of
  projects counts progress without reading the company's file.
- **The stage on the change is what counts**, in every app, even where the
  company's file gives that option another stage, so every app counts a
  project the same way whether or not it can read the file. An app that offers
  the file's options writes the option's own stage.
- **A reader that cannot look a status up**, because it cannot read the
  company's file or the option has been removed, draws the option's id and
  counts it by its stage; the label and colour come only from the file.
- SPEC §6.13, §7.4 and TYPES.md say so in the project "Each company sets its
  own statuses", before Ship moves its projects ("Ship reads and writes
  projects field by field", in "A load stays the same size as edits pile up:
  projects").

## Rejected alternatives

- **B · The tracker app's list, in its listing.** Ship's listing carries our
  statuses; we change them in Ship, and Ship signs the new listing. Turned
  down: a second tracker on the same projects has its own list, so the company
  has two sets of statuses for one project, against "each company defines its
  own". A person's edit must be signed by Ship's key, so Ship needs something
  that signs for it, and removing Ship removes the list. Undo cost medium
  (lists inside listings); build cost medium-high (signing for a person's
  edit).
- **C · Do less: no shared list; each status change carries its word and its
  meaning.** Ship's picker offers its defaults plus any status already used,
  and a new one is typed in. Turned down: renaming "In Progress" means changing
  every project that has it, a typo becomes a status, and with no single place
  saying which statuses exist, filters and pickers drift apart between apps.
  An outside company gets nothing to share. Undo cost low; build cost low.
- **The stage as a field of its own**, set beside the status in one change
  that sets both. Turned down: fields fold one at a time, so a later change
  that sets only the status leaves the old stage standing, and the two
  disagree; and a change that sets two fields names no single field, so an
  app that reads changes today drops it, and with it the status.
- **The file's stage counts wherever the file can be read**, the change's only
  as a fallback. Turned down: when an app writes a wrong stage, a member and a
  guest, or an app without the file, would count the same project
  differently. Under the chosen rule a wrong stage can make "Planned" count as
  done, which is no more than anyone who may set a status could already do by
  setting Completed.

## Consequences

- A company's settings for a type are a file the company owns, not an app's.
  The file is small, so moving it later is cheap.
- "A status with its stage", one of the cases
  [one-change-may-set-several-fields-taken-whole-or-refused-whole](one-change-may-set-several-fields-taken-whole-or-refused-whole.md)
  names, is now one field: setting a status needs no several-field change.
  That record's other cases stand.
- Status changes carry their stage on the relay for good. A later reader can
  ignore it, but cannot take it out.
- Two trackers can disagree on what to offer by default; the defaults come from
  the first one the workspace adds.
- A status removed from the list still sits on old projects, and apps draw its
  id. A reader that cannot read the company's file sees the id, not the label:
  after "In Progress" is renamed "Doing", it still shows `in_progress`.
- The schema shape of
  [an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)
  grows a colour and a stage on a choice option, and a third place that writes
  it: a company's file beside an app's listing and a person's database.
- Any member may write in the Company Folder, so this file is an exception to
  that Folder's rule. How that is enforced is a decision of its own, taken in
  the project that carries this out; whatever it is, anyone else's change
  changes nothing anyone sees.
