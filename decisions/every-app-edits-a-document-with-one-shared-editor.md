# Every app edits and reads a document with one shared editor, and its links draw with the kit's chip, row and card

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the shaping session of the project *Widgets 2: build 2 — documents* (2026-10-19), and his merge of this record
- Area: Documents

## Who it affects

Miky and Katerina write a Leaf page, a Ship issue's or project's
description, and a file's text in Peek's panel the same way: `[` to pick a
file, `/` to format or insert, `@` to mention a person, a pasted link that
becomes its chip, pasted images, callouts, checklists and tables. What one app
writes, the others draw the same. An outside company's app gets the whole
document experience by supplying its own lists for `[`, rather than building
an editor of its own.

The moment: on 19 October, after the first stage of *Widgets 2* landed for
messages, Miky went through documents and wrote in *Widgets 2: build 1*'s
conversation (17:02) that Leaf's widgets did not look like the approved
prototype, that Ship's descriptions could not add widgets as Leaf's pages
can, and: "We need to make sure that the docs are in the shared packages so
all apps (now ship and leaf) has the very same capabilities and behavior."

## Context

- The editor's parts are shared already: the block translation lives in
  `@estiva-app/protocol` and the editor nodes in `@estiva-app/ui/editor`
  ([the-block-editor-kit-lives-in-protocol-and-ui](the-block-editor-kit-lives-in-protocol-and-ui.md)).
  But each app assembles its own editor from them: Leaf's `LiveDocument`, Ship's
  `LiveDescription` and Peek's `BlockDocumentField` (each repo's `origin/main`,
  19 October).
- The three had drifted. Leaf has `[` and comments on a selection; Ship turns
  a pasted link into a chip and takes pasted images; Peek's panel has neither
  `/` nor `[`. Leaf's `/` offers only Table, Ship's Table and File. Nobody can
  `@` a person in a document.
- Each app also draws links in a document with its own older widgets, without
  the status, key, assignee or a project's issues that the kit's chip, row and
  card from the first stage draw.
- Messages and comments went the same way on 16 October
  ([every-app-writes-and-reacts-with-one-shared-box](every-app-writes-and-reacts-with-one-shared-box.md)).
  Documents were left out of that stage on purpose, to be the second.

## Decision

- **One document editor**, in `@estiva-app/ui/editor`. Leaf's pages, Ship's
  descriptions and Peek's panel edit and read a block document with it. It
  holds everything any of the three has today:
  - `[` to pick a file. Each app supplies the lists it searches, so Leaf still
    offers the Folder's files first.
  - `/` with Format and Insert. Insert has Table, File, and *Link to a file*,
    which opens `[`'s list.
  - `@` to mention a person.
  - A pasted app link becomes its chip, and a link on words keeps its link.
  - Pasted images, attachments, callouts, checklists and tables.
  - Block ids, so comments anchored to blocks stay where they are.
  - Comments on a selection, as an option an app switches on. Leaf switches it
    on in this stage. Ship does in the next stage, after a prototype of where
    it shows them.
- **Links draw with the kit's chip, row and card**, by the rule already
  decided for documents
  ([a-link-on-words-counts-toward-the-card](a-link-on-words-counts-toward-the-card.md)).
  Each app's own document widgets go.
- Carried out by *Widgets 2: build 2 — documents*.

This extends [every-app-writes-and-reacts-with-one-shared-box](every-app-writes-and-reacts-with-one-shared-box.md)
from the comment box to the document.

## Rejected alternatives

- **Each app keeps its own editor, and only its links change to the kit's
  widgets.** Leaf and Ship would keep drifting apart in what a document can
  do, which is the gap Miky asked to close: "the very same capabilities and
  behavior" (19 October).
- **The shared editor first, and the prototype's widgets in it a stage
  later.** Leaf's widgets, Miky's first complaint, would wait another stage.
  He chose both together.

## Consequences

- A fix or a new capability in a document is one release that Leaf, Ship and
  Peek take, so they cannot drift apart again.
- A new app, an outside company's too, edits documents by supplying its `[`
  lists and switching on what it shows, such as comments on a selection.
- The editor must serve each app's needs at once: Leaf's comments on a
  selection, Ship's pasted images, Peek's narrow panel.
- Two-way: nothing on the relay changes. Undoing it means moving each app back
  onto an editor of its own.
