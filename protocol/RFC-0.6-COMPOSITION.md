# RFC 0.6 — Composition: how a document includes live content from elsewhere

- **Status:** draft
- **Date:** 2026-09-11
- **Builds on:** [RFC 0.4](RFC-0.4-WORKSPACE.md) (containment, projection) and
  [RFC 0.5](RFC-0.5-ASSOCIATION.md) (association, addressing), both unchanged by
  this document
- **Supersedes:** *nothing.*

> **The numbers are not a version sequence.** As RFC 0.4's header says, each RFC
> after 0.4 takes a *topic* the previous one left open. 0.4 stays current for
> containment and projection; 0.5 for how files relate and what a link looks
> like. A change to how a document **includes** content belongs here.

RFC 0.4 settled what holds what and how one app renders another's objects. RFC
0.5 settled how two files relate and how they are addressed. Both are about
**whole objects**. Neither says what happens when a document wants to show a
*part* of another object, live.

That gap is where three product requests land, and they turn out to be one
question.

---

## 1. Three scenarios, and why they are the same scenario

1. **A section of a plan, in a conversation.** A project description holds the
   plan. Someone discussing it in Peek wants to bring a specific part into the
   conversation — an image, a table, a paragraph, or a heading and the few
   paragraphs under it — *without copy-pasting*, and it should not go stale when
   the plan changes.
2. **A sync block.** One table, appearing in several documents, edited in one
   place and current in all of them.
3. **A live widget inside a document.** A project description mentions an issue,
   and the issue renders as its widget rather than as a link, always current.

They differ in exactly one dimension: **how much of a thing the address names.**

| | address | what is drawn |
| --- | --- | --- |
| scenario 3 | an object | the object's widget, per its manifest (§7) |
| scenario 1 | an object **and one block** | that block |
| scenario 1′ | an object **and a run of blocks** | that section |
| scenario 2 | the same, **plus writing back** | that block, editable |

So this document is not about images, or tables, or attachments. It is about
**the address**, and about what a reader owes the person when the address stops
resolving.

---

## 2. What already exists

Three things, and naming them keeps this RFC from re-inventing them.

**Scenario 3 is built.** [SPEC §13.3](SPEC.md)'s block documents plus §7's
projection manifest already do it: a `nostr:` pointer alone in a paragraph is a
*standalone reference*, and a consumer renders it as the object's widget rather
than as prose (`standaloneReference`, RIC-10). Ship's issue and project
descriptions do this today. **This RFC adds nothing to scenario 3** — it
generalises what scenario 3 already proves.

**Blocks are already addressable.** [§13.3](SPEC.md) gives every block an `id`
that is unique within its document and stable across edits that do not replace
it. [§13.6](SPEC.md) already defines the address `(object address, block id)`
and requires a reader to distinguish four outcomes when resolving it. A comment
anchored to a paragraph is that address in use, in production, today.

**`kind:30840` File is allocated and unused.** Zero events on production,
measured 2026-09-10. [FILES_ARCHITECTURE §8](FILES_ARCHITECTURE.md) supersedes
NIP-FC as a document model and keeps one idea from it: addressable sub-file
units for anchoring. §3 below says what that means here.

---

## 3. An image is a block, and nothing about it is special

The question that started this was whether an attached image should be its own
addressable object. **It should not**, and the reason generalises.

A block already has an address. If an image became an object *in order to be
referenced*, there would be two addressing schemes for the parts of a document —
`(object, block)` for paragraphs and tables, and a standalone address for
images. The next person asks why a table cannot be referenced the same way, and
the honest answer is "history". **The consistent move is to make images less
special, not more.**

So:

- An `attachment` block stays a block. Its `attrs` describe the bytes, the way a
  `codeBlock`'s `attrs.language` describes its contents. It is a leaf.
- An attachment is referenced the way every other block is: by its block id.
- **`kind:30840` is not needed for attachments.** It would earn its place only
  for a file that must exist with no document mentioning it — a Files view over
  every upload. That is a separate feature, addable later over the same
  content-addressed blobs, and it changes nothing here.

---

## 4. One pointer, four resolutions

### 4.1 The grammar

A **content pointer** names:

```
(object address, block id?, extent?)
```

- no `block id` — the whole object. Scenario 3, and §13.6's `unanchored`.
- a `block id`, no extent — that one block.
- a `block id` with `extent: "section"` — that block and everything following it
  that belongs to it (§4.2).

§13.6's `block` tag is this grammar's degenerate case and stays exactly as it
is. **This is deliberately not a new addressing scheme**: RFC 0.5 §7 settled what
a link to an object looks like, and a pointer to a part of one must be that plus
a block, or apps will grow two answers.

### 4.2 Extent, and why not `(from, to)`

"A heading and a couple of paragraphs" needs more than one block id. Three
candidate forms, and the choice is not cosmetic:

| form | behaviour when the author adds a paragraph to the section |
| --- | --- |
| **enumerate ids** `[b3, b4, b5]` | the new paragraph is not included — the pointer is precise and *wrong* |
| **`(from, to)`** | anything inserted between is silently pulled in, including content the pointer's author never saw |
| **structural** — "the section headed by `b3`" | the new paragraph is included, because that is what the section now is |

**Structural.** A person pointing at a section means the section, not the three
blocks that happened to be in it. `(from, to)` is the one to avoid: it grows
silently, and what it grows into can cross a boundary the author would not have
chosen — in the worst case pulling content into a conversation that the author
of the pointer never read.

A `section` extent is defined as: the named block, plus every following sibling
until the next block of the same type and rank, or the end of the document. For
a heading that is the obvious reading. For a non-heading block it degenerates to
the single block, which keeps one rule rather than two.

### 4.3 Four states, and a fifth

[§13.6](SPEC.md) already requires a reader to distinguish **unanchored**,
**resolved**, **unaddressable** and **detached**, and says why collapsing any
two is the failure the section exists to prevent. A transclusion inherits all
four, and adds one that only appears once content crosses a boundary:

| state | when | what a reader owes the person |
| --- | --- | --- |
| **unreadable** | the object exists and this reader may not read it | say so — *not* "gone", and *not* nothing |

**`unreadable` and `detached` must not be collapsed.** One means somebody
deleted a paragraph; the other means you are not in that Folder. A reader that
renders them alike tells a person their colleague removed something when in fact
they were never allowed to see it.

---

## 5. Pointer, never copy

**A transclusion MUST store the pointer and resolve it on read. It MUST NOT
store a copy of the content.**

This looks like a liveness rule and is also an access-control rule. Both
requirements are satisfied by the same mechanism, which is the strongest
argument available for it:

- A copy goes stale. That is the whole of scenarios 1 and 2.
- **A copy is a permanent access leak.** Transclude a paragraph from a private
  Folder into a conversation, cache the text, and revoking the Folder does not
  revoke the cache. A pointer fails closed on the next read; a copy cannot fail
  at all.

The second is the one that must not be traded away for performance. A consumer
MAY cache a resolution for the life of a view; it MUST NOT persist one as
content, and it MUST NOT publish one.

This has a cost and the cost is real: rendering a document becomes N+1 reads.
That is a batching problem, and the ecosystem already has the answer — Buzz
meters `POST /query` per call, and `queryAll` exists because of it.

---

## 6. Sync blocks

Scenario 2 is scenario 1 **plus writing back**. There are only two models.

**Source-owned.** The table lives in one document. Every other appearance is a
pointer. Editing a transcluded copy writes to the source object.

**Promoted object.** The block becomes its own addressable object with no home
document. Every appearance, including the original, is a pointer to it.

Source-owned is the default, for a reason that is about access rather than
tidiness. **Every object in this ecosystem lives in a Folder, and the Folder is
the access boundary** (RFC 0.4 §4). A block promoted out of a project
description has to land in *some* Folder — and if it lands anywhere more open
than the description did, promoting a block silently widens who can read its
content. That is a privacy change disguised as a formatting action.

Source-owned has its own obligation, and it is the visible one: writing back
crosses a boundary too, so **an editor MUST establish whether this person may
write to the source before offering to edit**, not after they have typed. "Your
change could not be saved" after the fact is the failure mode this rule exists
to prevent.

Promotion stays available as a later, **explicit and user-visible** action for
content with no natural home — a team's table rather than a page's. It is not
the mechanism behind ordinary transclusion, and it should not be introduced as
one.

---

## 7. Two things that bite once this exists

**Cycles.** A transcludes B; B transcludes A. This must be decided once, here,
rather than three times in three apps: a consumer MUST bound resolution depth
and MUST render a cycle as a distinguishable state rather than as a truncation
or a hang. The bound belongs in the shared package for the same reason the
`imeta` parser does — a second implementation is a second set of refusals to get
wrong.

**Attribution.** Transcluded content was written by somebody, somewhere else. A
reader MUST be able to tell transcluded content from the document's own, and
MUST be able to reach the source. A section of a plan that reads as if the
person writing the conversation wrote it is a misattribution the protocol
handed them.

---

## 8. What this closes, and what stays open

**Closed by this document, if accepted:**

- An image is a block. Attachments get no object, no second addressing scheme,
  and no special case (§3).
- One pointer grammar, with §13.6's tag as its degenerate case (§4.1).
- Extent is structural, never `(from, to)` (§4.2).
- Pointer, never copy (§5).
- `unreadable` is a state a reader must distinguish (§4.3).

**Deliberately open:**

- Whether promotion to a standalone object is ever offered, and where such an
  object lives (§6). Nothing here depends on the answer.
- Whether a Files view wants a File object over the blobs (§3).
- The wire form of the pointer — a tag, an inline node, or a block — which is
  §4.1's grammar expressed, and wants one implementation before it is fixed.

---

## 9. One thing is time-sensitive

Everything in this document is additive to what has shipped, with a single
exception.

The `attachment` block was specified on 2026-09-10 ([SPEC §13.3](SPEC.md)) and
Ship began producing them the same day. **Production held zero of them when this
was written.** If §3's conclusion changes the block's shape, it is free now and
expensive once people have attached files to descriptions.

This RFC's §3 says the shape is *right* and should not change — an attachment is
a block, its `attrs` describe the bytes. That is the conclusion, not an
assumption, and it is the reason the window matters: **the cheap moment to
disagree with it is now.**
