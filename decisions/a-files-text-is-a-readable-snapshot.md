# A file's text is stored as a readable snapshot, and the last save wins; live co-editing comes later, on top

- Date: 2026-10-13
- Status: Accepted
- Decided by: Miky, in the Leaf 1 shaping session, after research on Notion, Linear, Google Docs, Formstr and Leaflet
- Area: Documents

> Superseded in part, 2026-10-26: the part "written as a change to the file's
> `description` field (`kind:1851`)" is replaced by
> [a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md):
> each save is an event of its own. The rest of this record stands.

## Who it affects

Miky and the friend he wants as Estiva's first outside user write one page
together on Friday 16 October: each save is the whole page, and the newest save
is what everyone reads. If both save at the same moment, one save is lost, so
for now they take turns.

An outside company reads a page's text with any Nostr library, the same way it
reads a Ship issue's description, without Estiva's editor code or a merge
library. In Miky's words, he wanted "a proper solution from protocol
perspective", and would not pick a storage model before seeing best practice.

## Context

Leaf 1 ("write a page together and comment on it") was shaped on 13 October for
Miky's call on the 16th. Co-editing had to work for that call, so the shaping
had to say where a page's text lives and what happens when two people write it.
Before choosing, Miky asked for research on how Notion, Linear, Google Docs,
Formstr Pages (on Nostr) and Leaflet (on AT Protocol) store a document. At the
same shaping he set the layering: a topic is a bare file, a page adds a body, an
issue adds properties on top. A page became its own type of file the next day
([a document is its own type of file](a-document-is-its-own-type-of-file.md));
the body rule below is the same for every kind.

## Decision

- The stored truth of a file's text is a **readable snapshot**: every save is a
  full copy, written as a change to the file's `description` field
  (`kind:1851`), and the last save wins. The author saves the same way.
- A **live layer** between open windows (a CRDT such as Yjs, sent over events
  the relay does not keep, as Formstr Pages does) comes later, as its own Leaf
  project. It is an addition: it never changes what other apps read.

SPEC §6.10 carries it out, written for every file type, not only Leaf's.

## Rejected alternatives

- **A CRDT as the stored truth** (as Linear stores Yjs). Other apps must be able
  to read the body.
- **Last save wins per block.** The note on record gives no separate reason;
  the Leaf 1 project's description says edits to the same block would still
  lose one, and that Notion replaced it with a CRDT for text.

## Consequences

- Any app reads and writes a file's text with one rule, and Ship's description
  and Leaf's page are the same field.
- Two people saving at once lose one save until the live layer exists.
- Every save is kept as an event, so reading a file's history is possible, and
  reading its text means folding every save. SPEC §6.10 names a body kind of
  its own as the long-term shape for cost, and caps a save at 512,000 bytes.
- Hard to undo once pages are on the relay: the live layer has to be built so
  the snapshot stays the truth, and snapshot versus CRDT for the body is not
  reopened.
