# A type of file and its properties are defined by an app's listing or by a person's database, in one schema shape; app types come first, and people's databases come with the Notion-like app

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the brief session of 26 October, on the brief "Files, Types, History" ([page](briefs/files-properties-schemas.html)), call 3: "an app's listing or a person's database, staged"
- Area: Files

## Who it affects

The brief's example, not a request yet: Katerina keeps a candidate tracker.
Once the Notion-like app is shaped, she makes it herself as a database in a
Folder, with a Stage property and its options, and each candidate is a row. She
needs no developer. Peek, Ship and Claude draw a row of her tracker the way
they draw an HR app's interview scorecard.

An HR expert at an outside company declares the HR app's own types, and its
extensions to shared types, in the app's listing, in the same schema shape.

On 25 October Miky said "for now only an app, not a person". On 26 October he
chose both, staged.

## Context

- A type that no other app shares yet is a record: one kind with one meaning,
  whose root names the schema that defines it
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)).
- An app's manifest already declares its fields and their allowed values,
  each with a value and a label (SPEC §7.4), but a field is named on the wire
  by its word (SPEC §6.2), so a renamed field leaves every earlier change
  under the old word, and nobody can rewrite changes other people signed.
- Notion and Airtable give every property a fixed id, so a rename is free.
  Anytype makes types and properties objects that people create in their own
  space.
- An app speaks for a type only once the workspace has added it
  ([an-app-counts-only-once-the-workspace-adds-it](an-app-counts-only-once-the-workspace-adds-it.md)).

## Decision

- **One schema shape, in two places**: an app's listing, or a database, which
  is a file a person makes in a Folder.
- **Each property has a fixed id, a label and a kind of value**, and each
  option of a choice has a fixed id and a label. A rename touches no file.
  Today's field words become the ids of today's four types.
- **A database's rows are records under it**, with members, comments, archive
  and history like any file. A database's schema changes appear in its own
  history.
- **Staged.** App types first; databases when the Notion-like app is shaped.
  How a person reshapes a database (a property changed from text to choice, or
  options merged) is shaped then.

## Rejected alternatives

- **Only an app's listing** (Miky's 25 October "for now", and the Proposed
  record in the draft estiva-docs#330). Katerina's candidate tracker would need
  a developer, or an app that ships fixed types.
- **Nobody: any file takes any property.** The fastest start. People will write
  "Stage" and "stage", and two apps will not agree.

## Consequences

- An app's types and a person's database read the same way to every app, so
  nothing is drawn twice.
- Fixed ids are one-way once files use them; labels can change at any time.
- The Notion-like app's shaping owes the rules for reshaping a database, who
  may change its schema, and which rows count in it (a row names its database,
  so someone who cannot write there must not add one). Until then only app
  types exist.
