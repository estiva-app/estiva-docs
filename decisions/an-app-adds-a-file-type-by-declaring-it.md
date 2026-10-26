# An app adds a file type by declaring it in its manifest, with no new event kind: one typed-file kind carries the type, and today's file kinds are read as types

- Date: 2026-10-25
- Status: Proposed
- Area: Apps & agents

## Who it affects

A developer at another company builds an HR app on Estiva. It has two file
types: a job position (title, text, status: open, interviews, make offer,
closed) and a candidate (stage: submitted, 1st interview, …). With this record
they publish a manifest that declares both types and their properties, a
steward adds the app to the workspace, and Peek, Ship, Leaf and Claude show job
positions and candidates as they show Ship issues today. Nobody at Estiva
changes a line of code or a server setting for it.

Miky raised it on 25 October, while the speed work was about to add a kind for
a file's text: "before we do another new kind, we should review the kinds we
already added", and "the idea is to have a system where each app doesn't need
to create completely new kinds if it can be served by simple properties on a
file." The HR app is only an example: "we want any app to participate." He
answered the same evening that the builder is a developer at another company,
that for now only an app defines a type (not a person), and that plain Nostr
clients do not matter right now. The brainstorm ran in a Claude conversation
and is not published; what it found is in Context below.

## Context

- **Properties are already generic.** A file's fields are `kind:1851` changes,
  one field each, last write wins, written by anyone in the file's Folder
  (SPEC §6.2, §6.3). An app's manifest declares its fields, their allowed
  values with what each means (`stage`: open, started, done, dropped, §7.4),
  the actions that write them with typed inputs (text, person, choice, §7.3),
  relations (`children`, `movedBy`, §7.2) and what a file is called (`noun`,
  §7.9). Interop checks values against it. An HR app's status is the same
  thing as a Ship issue's status.
- **The type is the kind number, and a kind number costs three gates.** Each
  file type is its own addressable kind: topic `30840`, document `30842`,
  project `30850`, issue `30851`. A new kind is usable only after Estiva ID's
  per-app list is re-seeded by hand on the server, the relay gains a Rust arm
  for it on its own branch, and the new relay image is deployed
  (`protocol/ADDING-A-KIND.md`, SPEC §8). Estiva hosts the only deployment
  ([record](estiva-hosts-the-only-deployment.md)), so an outside company can
  open none of the three: every new file type in the ecosystem waits on
  Estiva's operations.
- **The four file kinds are one idea copied four times**, and the copies drift:
  a project says `name` where the others say `title`, and `buzz-channel` where
  the others say `h` (SPEC §6.1). Provisional numbers come from a range of
  eighty (`30820`–`30899`, SPEC §8), shared by every company that would build.
- **A file's id is already unique across every kind and author**
  ([record](a-files-id-is-unique-across-every-kind.md)), so a link needs only
  the id to name one file; the kind in the address is not needed to find it.
- **This brings back half of an idea turned down on 19 October.** "Files grow:
  one kind of file, which gains a text and then fields" is a rejected
  alternative of
  [a-card-changes-what-a-files-app-shares](a-card-changes-what-a-files-app-shares.md)
  (Accepted), carried from the records it superseded. It was turned down for two
  reasons: conversion between types (a topic that gains a text becomes a page),
  and "the type leaves the address and ownership is claimed by a field, which
  changes how every app finds, names and opens files". This record keeps the
  first refusal: a file's type is fixed on its root and never changes. It
  reopens the second, on facts that are new since then: the goal that any
  outside app joins without Estiva (25 October), and Miky's answer the same
  day that existing files may be read as a new kind or type through a declared
  translation
  ([proposed record](a-file-follows-schema-changes-by-translation-on-read.md)).
  Accepting this record overturns that one rejected point; the rest of
  a-card-changes-what-a-files-app-shares stands.

## Decision

Proposed:

- **One typed-file kind.** A new addressable kind (number chosen in SPEC from
  `30820`–`30899`) whose root carries the bare file's tags (`d`, `title`, `h`,
  `[a]`, `[summary]`) and one more, `type`, naming the type as
  `<app>:<type name>`, where `<app>` is the declaring manifest's key, so two
  companies cannot collide. The type is fixed on the root, like every root
  fact (§6.1): a file never changes type.
- **An app declares a type in its manifest**: its noun, its properties (each
  with a fixed id, a label and a kind of value: text, choice with a vocabulary,
  person, date, number, link to a file), whether it has a text, and its
  actions. Properties are written with `kind:1851`, as every field is today.
  The relay accepts the typed-file kind once, for every app; adding a type
  changes nothing on the relay or in Estiva ID's kind list.
- **An app speaks for a type only once the workspace has added it**, as for a
  kind today ([record](an-app-counts-only-once-the-workspace-adds-it.md)), and
  only for types named with its own key.
- **Today's four file kinds are read as types**, by a translation their owners
  declare (`30842` is the type "document", `30851` is "issue"), so nothing on
  the relay is re-published and no address changes. Whether new documents,
  issues and projects go on being written with their own kinds or move to the
  typed-file kind is decided when the SPEC section is written.
- Topics, documents and Ship's files stay separate types, and none converts
  into another ([record](a-document-is-its-own-type-of-file.md)).

## Rejected alternatives

- **One kind per type, with the three gates opened automatically** (the relay
  accepts any kind in Estiva's range that carries a Folder; Estiva ID lets an
  app sign the kinds its manifest claims). The most familiar shape to Nostr
  developers and the smallest build. Not proposed: plain Nostr clients do not
  matter now (Miky, 25 October), eighty numbers are shared by every company,
  and four drifting copies would become many.
- **Freeze the protocol at a handful of kinds and migrate every file to the
  typed-file kind** (file, property change, text save, comment, plus the
  existing message, reaction and Folder kinds). The same end state as this
  record, but with every existing file re-published. Not needed: reading the
  old kinds as types reaches it without a migration.
- **No schemas at all**, as OpenStreetMap's free-form tags: any file carries
  any property, and a manifest only suggests. Serves a person building their
  own tracker with no developer, which is not the builder for now (Miky,
  25 October). "A value outside the vocabulary is displayed, never swallowed"
  (SPEC §6.3) already keeps its one cheap part.
- **A person defines a type inside a Folder**, as in Notion. Not now: "for now
  only an app" (Miky, 25 October). A schema a person edits would itself be a
  file, changed by the same `kind:1851`, so it can be added later without a new
  mechanism.

## Consequences

- An outside company adds file types with a manifest and a steward's yes,
  without Estiva's operations.
- **Signing limits stop following ownership.** Estiva ID limits each app by
  kind ([record](another-apps-new-file-is-made-by-that-app.md): Peek cannot
  make a Leaf document because it cannot sign `30842`). With one typed-file
  kind for every app, Estiva ID would have to check the `type` tag against the
  app's manifest, or Peek could sign an HR candidate. The same holds for an
  agent's grant, which is per kind today
  ([record](an-agent-signs-for-an-app-only-by-an-admin-grant.md)). The SPEC
  section has to say which.
- Every reader resolves a typed file through its manifest's type, as it
  resolves a kind's projection today; NIP-89 claims a type, not only a kind.
- The relay already indexes the root `title` of any addressable kind for
  search (SPEC §5.2), so typed files are findable by name with no relay
  change.
- Views across files ("candidates in 1st interview") are computed by the app
  from a Folder's changes, since the relay cannot filter by a property's
  value; cheap once a file's text is no longer a `kind:1851`.
- One-way once typed files are on the relay: going back to a kind per type
  would mean translating or re-publishing every typed file.
