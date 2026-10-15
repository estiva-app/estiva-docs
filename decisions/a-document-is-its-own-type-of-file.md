# A document is its own type of file, which any app may own; Leaf owns it first

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, in LEAF-2's review session (two types, not one) and in the kickoff session of "A Leaf doc is its own type of file" (a general type any app may own)
- Area: Documents

## Who it affects

A page Miky writes in Leaf is a document, and a conversation he starts in Peek
is a topic. Neither turns into the other: Leaf's tree shows a Peek topic as a
topic that opens in Peek, and Peek shows a Leaf document as a document that
opens in Leaf. It came up at LEAF-2's review, when every Peek topic appeared in
Leaf as an empty page and every Leaf page appeared in Peek as a topic. In
Miky's words: "Peek Topic is Peek Topic. Leaf doc is Leaf doc. It's two
different types of docs. It's not the same thing."

An outside company can build its own document editor: the document type is not
Leaf's, and any app may claim it the same way Leaf does.

## Context

Leaf 1 was shaped on 13 October with a Leaf page and a Peek topic as one
object, the bare file `kind:30840` (SPEC §6.7). That premise was stated in the
shaping, never asked. On 14 October, before any real page existed (LEAF-3 had
not shipped), Miky was asked whether the two are one object, and then whether
the new type should be Leaf's alone or a general one.

## Decision

- A document is its own file type, `kind:30842`, separate from the topic.
  Existing topics stay topics, and there is no conversion either way.
- It is a general document type, not a Leaf-only kind: any app may own it
  through its manifest (a `kind:31990` with a `k` tag for `30842`), as Ship
  owns projects and issues. Leaf owns it first, with its own manifest key.
- Owning the type decides how a document is drawn, named and opened. It grants
  no write: anyone in the document's Folder may change its text.
- A document may sit under a file of any kind, as a topic can.

SPEC §6.11 carries it out (estiva-docs#268), with protocol 0.34.0 and interop
0.56.0 as the reference.

## Rejected alternatives

- **A Leaf page is a Peek topic with text at its top** (the shape Leaf 1 was
  shaped with). Miky's reason is the quote above: they are two different types.
  Splitting before LEAF-3 meant no real page needed migrating.
- **A kind only Leaf can use.** Not taken; a general type any app may own was
  chosen. The reason is not on record.

## Consequences

- Peek and Ship show another app's documents read-only, with a way to open
  them in the owning app; only the owner offers the text editor.
- A Folder holding a document cannot be deleted, as with every file type, and
  the relay refuses a document filed in no Folder.
- Leaf's own sign-in may sign documents and not topics, so Leaf cannot make a
  topic by mistake.
- One-way once documents are on the relay: merging the two types again would
  mean migrating every document.
