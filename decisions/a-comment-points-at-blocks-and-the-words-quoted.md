# A comment points at a run of blocks, narrowed by the words quoted at its ends

- Date: 2026-10-13
- Status: Accepted
- Decided by: Miky, in the Leaf 1 shaping session (LEAF-7)
- Area: Documents

## Who it affects

Miky selects a word, a sentence or several paragraphs of a page in Leaf and
comments on exactly that; whoever reads the page sees those words highlighted
and opens the comment from them. In Miky's words, shaping Leaf 1: "It's not just
words. You can comment specific word, sentence, or even block(s)." It is the
centre of Katerina's prototype for Leaf's comments, and it is aimed at Miky's
second call with an outside user.

An outside company's app reads one shape for "what this comment is about",
whether the comment is on a few words or on several whole blocks.

## Context

SPEC §13.6 anchors a comment to one block of a file's text. Composition 2
already shares a run of whole blocks, selected from the first to the last
([a shared part of a page is a selected run of whole blocks](a-shared-part-of-a-page-is-a-selected-run-of-blocks.md),
Miky, 9 October). Leaf 1's second milestone
needed comments on any selection, from a word to several blocks.

## Decision

A comment has **one anchor**, the same run of blocks Composition 2 shares, plus
the words quoted at its ends, so it can mean a word, a sentence or several
blocks. Comments and shared selections use the same shape.

LEAF-7 carries it out ("Comment on a word, a sentence or several blocks, and
see it highlighted"); its exact wire form goes through the protocol pre-review
at that ticket's kickoff, and SPEC §13.6 changes with it.

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- One anchor serves sharing and commenting, so an app that reads one reads the
  other.
- Quoting the words lets a reader tell a comment whose words changed from one
  whose blocks are gone; LEAF-7 plans a new state in §13.6 for it, the blocks
  found but the words not.
- Until LEAF-7 lands, a comment still anchors to one block.
- Hard to undo once such comments are on the relay: every reader must keep
  resolving the shape.
