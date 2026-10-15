# A file's id is unique across every file type and author, deleted files included

- Date: 2026-10-03
- Status: Accepted
- Decided by: Miky, at the kickoff of PRO-23, shaping the project "Workspace apps: the organisation decides which app owns which files"
- Area: Apps & agents

## Who it affects

A link to a file, such as an issue Miky pastes into a message for Katerina,
always means that one file, whichever app opens it and whoever reads it later.
Nobody sees a refusal: when an app picks an id that is taken, it quietly picks
another.

An outside company's app can resolve a link by its id alone, without knowing
which app or author made the file.

## Context

A file's id is the `d` of its addressable event, an opaque uuid. A link such as
`/<word>/<d>` names the id, not the author or the kind (SPEC §7). The question
was whether an id names one file across every kind and author, or only within
one.

## Decision

- A `d` is unique across all file kinds and all authors, counting files that
  were deleted.
- A duplicate is refused, and the app that made it retries silently with a new
  `d`.

It is carried out by the Ship issue "A link to a file always means one file:
the relay keeps a file's id unique" (WOR-3), in the project "Workspace apps: the
organisation decides which app owns which files".

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- A link needs nothing but the id to name one file.
- An id is never reused, even after its file is deleted, so an old link never
  opens a new file.
- Every app that creates a file must handle the refusal and retry.
- Hard to undo: once links rely on it, allowing a shared `d` again would make
  old links ambiguous.
