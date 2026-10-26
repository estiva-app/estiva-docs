# When a file type's schema changes, every app translates old files as it reads them, by rules the schema declares; a renamed property or option touches no file

- Date: 2026-10-25
- Status: Proposed
- Area: Protocol

## Who it affects

Miky renames a status from "Interviews" to "1st interview", merges two stages,
or turns a text property into a choice. Every file of that type shows the new
shape at once, in Peek, Ship, Leaf and Claude, and nothing is re-published, so
every change in a file's history still shows the person who made it. An app a
version behind keeps working. An outside company that changes its HR app's
schema ships a new manifest and never runs a migration on its customers' data.

It came up on 25 October. Asked whether existing files may change kind, Miky
answered: "there should be mechanism how to migrate files to new schema". Of
three mechanisms offered (copy and replace, translate on read, migrate on next
save) he picked translation on read: "it will also help us build Notion like
app where people can really change properties all the time for files." The
brainstorm ran in a Claude conversation and is not published; what it found is
in Context below.

## Context

- **A signed event cannot be changed or re-signed by anyone else.** Moving a
  file to a new shape by re-publishing it means either a migration key signs
  it, so its history names the agent instead of the person, or Estiva ID signs
  as each person without them in the loop
  ([early shapes are migrated or deleted](early-shapes-are-migrated-or-deleted.md):
  "a re-post can lose its author's signature").
- **Allowed values already keep a value apart from its label** (SPEC §7.4,
  `{value, label, colour, stage}`), so a status's label can change while files
  keep the value. A property is named on the wire by the `field` tag of its
  `kind:1851` changes (SPEC §6.2).
- **Every app reads another app's files through that app's manifest** (SPEC §7),
  and a rule copied into one app's code drifts: the agent's copy of Peek did
  ([record](claude-learns-each-app-from-its-manifest.md), AGE-1).
- **[Early shapes are migrated or deleted](early-shapes-are-migrated-or-deleted.md)**
  (Accepted) refuses keeping a shape "left over from early experiments" on the
  relay for compatibility. A translation keeps old shapes on the relay on
  purpose. This record reads a declared translation as a feature of the
  schema, not as experiment residue, so the older record still governs
  experiment leftovers. That reading is the agent's, from Miky's pick; his
  accept of this record confirms it or refuses it.
- The speed work is adding a kind of its own for a file's text (Miky's go,
  25 October, in the speed work's planning). A text save names its file by id as well
  as address, so it keeps working whatever a schema change does.

## Decision

Proposed:

- **A property and an option each have a fixed id**, which is what a change's
  `field` and `value` name on the wire, and a label that lives only in the
  schema. Renaming either is a schema change and touches no file.
- **A structural change is declared as a translation** in the owning app's
  manifest, from one schema version to the next: a property's id changed, one
  option mapped onto another (a merge), a value of one kind read as another
  (text into a choice, by a mapping), or an older kind read as a type
  ([proposed record](an-app-adds-a-file-type-by-declaring-it.md)).
- **Every reader applies the translations as it folds**, oldest version first.
  `@estiva-app/interop` holds the one implementation, with a conformance
  fixture, as Ship's fold has today (`estiva-agent` `scripts/conformance.test.ts`),
  so two apps never show one file two ways.
- **Writers write the newest version.** A change written in an older version,
  by an app not yet updated, is translated forward when read.
- **Only the app that owns a type declares its translations**, in its manifest,
  under the workspace's list of apps
  ([record](an-app-counts-only-once-the-workspace-adds-it.md)).
- **Squashing is allowed, later.** When a type's translations pile up, its
  owner may copy files into the newest shape once and drop the old
  translations. Who signs that copy is decided then.

## Rejected alternatives

- **Copy and replace on every schema change**, as a database migration does.
  One shape on the relay at all times. Not taken: every run re-signs other
  people's events, so history names the migrator or Estiva ID signs as
  everyone, and a schema that changes "all the time" (Miky) would mean
  migrations all the time.
- **Migrate on next save**: an app writes the new shape when someone next edits
  a file. Nothing is re-signed, but files nobody touches keep the old shape for
  ever, and every reader handles both without a declared rule saying how.
- **Each app translates in its own code.** No shared mechanism to build, but
  the copies drift, which is how the agent showed posts nobody could see
  (AGE-1).

## Consequences

- People can change a type's properties often, as in Notion, at the cost of a
  schema edit rather than a migration.
- History stays true: every change keeps its author's signature.
- Every reader runs the translations, and they accumulate until squashed. A
  slow or wrong translation is wrong in every app at once.
- Some translations lose information: two merged stages cannot be split back.
- The old shapes stay on the relay, so a reader that skips the translations
  shows old values. A plain Nostr client is such a reader, which is acceptable
  while plain Nostr clients do not matter (Miky, 25 October).
- Hard to undo once owners declare translations: removing the mechanism would
  mean copying every translated file into its newest shape.
