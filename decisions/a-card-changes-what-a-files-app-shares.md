# Any app may change a file from its card through an action the file's own app shares; Leaf also writes the title, summary and text of any file whose app shares each; the owner keeps a field to itself by not sharing it

- Date: 2026-10-21
- Status: Accepted
- Decided by: Miky, in the /land session of Ship issue 5ebf2756 ("A project's card shows its key, issues and progress in every app", estiva-app/leaf#59), 21 October, answering "May someone change a Ship issue's status or a project's lead from its card in Leaf, as they already can in Peek?" and "In a Leaf page, can someone change status and lead from a link shown as a card?"
- Area: Documents
- Supersedes: a-document-app-writes-what-a-files-app-shares.md

## Who it affects

On 21 October Miky compared one comment linking *Widgets 2: build 2 —
documents* in Leaf and in Peek and found two different cards (issue 5ebf2756).
The ticket makes them one card in every app, and Peek's card already had Status
and Lead pickers on a Ship project. With this decision Miky changes a Ship
issue's status or a project's lead from its card in Peek, in Ship and in Leaf
alike, under a comment or as a card in a Leaf page while he reads it.

An outside company that brings its own issue tracker gets one rule: share a
field's action in your manifest and any app drawing your file's card may change
it; leave the action out and only your app does.

## Context

- [Leaf writes the title, summary and text…](a-document-app-writes-what-a-files-app-shares.md)
  (Accepted, 19 October) let a generic document app write those three fields
  and said "the owning app keeps … its own fields (a Ship issue's status,
  assignee and project)", and also "it keeps a field to itself by not declaring
  its action". The two sentences disagree once a card can act: Ship's manifest
  declares `set-status` and the lead and assignee choices for every app's card.
- Peek has changed Ship statuses and leads from cards on production since a
  call on 16 October ("any reader may change a file from its card; words only
  in a preview and for a file that cannot be read"), written in
  `@estiva-app/ui`'s `linkedFrom` but in no record.
- Every card change is the `kind:1851` one-field change SPEC §6.2 already
  defines, signed by the reader, in the file's own Folder. The relay checks
  Folder membership, not which app signs it. Nothing new goes on the wire.

## Decision

- **A card may change what its file's app shares.** Any app that draws a
  file's card (Peek, Ship, Leaf, an outside company's) offers the file's own
  shared actions on it, a status select and a person picker, and writes each
  change as the file's app would. An archived file's card, and one for a file
  archived with its parent, shows its values as words ([an archived file is
  read-only in every app](an-archived-file-is-read-only-in-every-app.md)).
- **A card never writes a file's words, its parent or its archive**: the
  title, summary and text are written in an editor, a move in the file's own
  app.
- **In a Leaf page, a link shown as a card has the same pickers** while the page
  is read; while its text is being edited, the card shows its values as words.
- **Leaf writes the title, summary and text of any file whose own app shares
  each**, as the superseded record decided: Leaf declares the
  `aspect: "document"` of SPEC §7.8 and offers its editor on each of the three
  fields whose action the owner's projection declares (for the text,
  `describe` in `estiva-blocks-1`). Peek and Ship do not offer an editor on a
  document or on each other's files.
- **The owner keeps a field to itself by not sharing its action**, and keeps
  what the type is called, its archive and delete, and where "Open in …" goes.
- **A topic is a conversation and has no text**: the bare file's built-in
  projection (§6.7) drops `describe` and its `body`, so an editor app lists no
  topics. Topics, documents and Ship files stay separate types and none
  converts into another.

## Rejected alternatives

- **Leaf's cards show words; status is changed in Ship or Peek.** Keeps the
  19 October sentence as written, but one file draws as two different cards
  again, which is what 5ebf2756 set out to end.
- **No card writes anywhere: only a file's own app changes its fields.**
  Reverses the 16 October call and takes Peek's pickers away.
- **A page's card shows words; only cards under comments change things.** One
  file would draw two ways a few lines apart on the same page.
- The alternatives the superseded record turned down stand: each file edited
  only in its own app; files that grow from one type into another; a topic
  that keeps an optional text; Ship and Peek editing a document's text; the
  document app writing the text only.

## Consequences

- Two-way: nothing new on the wire and nothing to migrate; undoing it is an
  app change.
- An owning app cannot assume it is the only writer of a field it shares: a
  change from any app's card reaches it as any other save does. An app that
  needs a field written only by itself stops declaring its action.
- SPEC §6.4, §6.5, §6.7, §6.10, §6.11, §7.3 and §7.8 carry the editor part
  (2026-10-19); the card part needs a sentence in §7 saying a declared action
  is offered on every app's card.
