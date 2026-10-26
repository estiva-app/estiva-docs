# An app may offer another app's "New …", and the app that owns that kind makes the file

- Date: 2026-10-16
- Status: Accepted
- Decided by: Miky, in the /land session of the Ship issue "A Folder and a chat message belong to no app" (2026-10-16), asked as a brief: who creates the Leaf document when someone picks New document on a Folder in Peek's launcher
- Area: Apps & agents

> Superseded in part, 2026-10-26: "the app that owns that kind makes the
> file", and each app's allowed kinds in Estiva ID as a hand-kept list, are
> replaced by
> [a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md):
> a shared type has no owning app, and any app the workspace has added whose
> listing declares the type may make its files. The hand-off stands: an app
> offering a "New …" for a type its own listing does not declare opens an app
> that does. The rest of this record stands.

## Who it affects

Miky and Katerina can pick New document on a Folder in Peek's launcher and end
up in Leaf with a new, empty document filed in that Folder. The document is
Leaf's, so Leaf makes it and Peek never writes it. An outside company gets the
same rule both ways: its app may offer Leaf's New document, and another app may
offer its own "New …" the same way. It came up in the /land session of "A Folder
and a chat message belong to no app", when Peek's launcher offered New document
on a Folder and Peek was not allowed to sign one.

## Context

- A document is its own file type, `kind:30842`, which Leaf owns
  ([A document is its own type of file](a-document-is-its-own-type-of-file.md)).
- What an app may sign is set per app in Estiva ID (its allowed kinds,
  `estiva-id src/db/seed.ts`). Peek's list does not include `30842`.
- Peek's launcher reads Ship's New project from Ship's manifest, but Peek signs
  Ship's project kind (`30850`) itself, since it is in Peek's allowed kinds
  (`estiva-id src/db/seed.ts`). *Correction, 2026-10-19: this line first said
  that Peek "opens Ship to make it", which was not true. Peek does not open
  Ship for it today; the new record
  [An app that owns a "New …" declares a create link](an-app-declares-a-create-link-for-its-new-action.md)
  decides that it will.* Claude learns each app's actions from its manifest
  ([Claude learns each app from its manifest](claude-learns-each-app-from-its-manifest.md)).
- Which kinds an agent may sign is an explicit grant per app, never derived
  ([Which kinds an agent may sign](an-agent-signs-for-an-app-only-by-an-admin-grant.md)).

## Decision

When someone picks another app's "New …" in an app's launcher, the app **hands
off to the owning app**, and the owner writes the file with its own kind:

- Peek reads Leaf's create action from Leaf's manifest, as it reads Ship's New
  project, and opens Leaf's link in a new tab. It signs nothing. (How the
  manifest declares that link is decided in
  [An app that owns a "New …" declares a create link](an-app-declares-a-create-link-for-its-new-action.md).)
- Leaf has a link that starts a new document in a given Folder, and Leaf creates
  the document, signing `kind:30842` itself.
- This holds for every app, an outside company's included: an app may offer
  another app's "New …", and the app that owns that kind writes it.
- No app's signing limits widen to make this work. Peek's allowed kinds in
  Estiva ID stay without `30842`.

## Rejected alternatives

- **Let Peek sign Leaf documents.** A one-line change to Estiva ID's seed would
  add `30842` to Peek's allowed kinds. Not taken: any app could then be granted
  another app's kinds, so each app's limits would no longer follow which app
  owns what, and the documents Peek had signed would stay on the relay.
- **Not in this ticket: drop New document from Peek's launcher.** Offered as "not in this
  ticket"; not taken, and no further reason is on record.

## Consequences

- Leaf needs a link that opens a new document in a Folder, and it appears in
  Leaf's manifest as a create action; Peek's launcher builds its New document
  entry from that action.
- Starting a document from Peek moves the person to a new tab in Leaf, not to a
  dialog inside Peek.
- Peek's signing limits stay as they are, so Peek cannot make a Leaf document by
  mistake, and Leaf's files always carry Leaf's signature.
- Two-way: it changes what a launcher entry opens and no event on the relay. A
  later move to signing in the offering app would be a new record that
  supersedes this one, and would also need the signing grant to widen.
