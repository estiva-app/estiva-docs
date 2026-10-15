# A comment on a selection remembers the words where it starts and where it ends, and a comment on whole blocks remembers no words

- Date: 2026-10-15
- Status: Accepted
- Decided by: Miky, in the LEAF-7 kickoff session, on the brief "What a comment remembers about its selection" ([page](briefs/what-a-comment-remembers.html))
- Area: Documents

## Who it affects

Miky selects a few words, a sentence, or a passage from the middle of one
paragraph to the middle of another in a Leaf page and comments on it. Whoever
reads the page sees the selection highlighted, and when the words he commented
on are later changed, the comment says so instead of passing for one about a
deleted paragraph. Katerina, editing the same page during a call, fixes a typo
two paragraphs away, and the comment stays where it was.

An outside company's app finds the highlight again from what the comment
stores, and has to match it the way every Estiva app does.

## Context

- [A comment points at a run of blocks, narrowed by the words quoted at its ends](a-comment-points-at-blocks-and-the-words-quoted.md)
  (Accepted, 13 Oct) gave a comment one anchor: the run of blocks Composition 2
  shares, plus "the words quoted at its ends". It did not say which words, and
  it was written without alternatives. This record makes it exact.
- [A shared part of a page is a selected run of whole blocks](a-shared-part-of-a-page-is-a-selected-run-of-blocks.md)
  (Accepted, 9 Oct) makes the run live: blocks inserted between the first and
  the last show. Its wire, a list of every selected id read as a span, is a
  Decided line on "Show a run of blocks in a Ship conversation" and was not yet
  in SPEC.
- No app wrote quoted words on a comment, and Leaf wrote no comments (checked
  in code on `origin/main`, 15 Oct). Peek reads the comments of any file, a
  Leaf document included, and shows the first listed block.
- The relay stores a comment's tags without checking them, so a quote is the
  commenter's claim, not the page's.

## Decision

- A selection inside one block remembers exactly its words.
- A selection across blocks remembers the selected words in the first block and
  the selected words in the last block. Each string lies inside one block, so
  no rule for joining blocks into one text is needed.
- A selection of whole blocks remembers no words. The comment is about those
  blocks and grows with the run.
- When the words repeat inside their block, the comment also remembers a few
  characters before and after them, and a reader picks the occurrence they
  match. Words are never searched for outside the run.
- The run is listed in the same `block` tag that names one block today, the way
  a `part` lists its run, so a reader that knows one block shows the first.
- When the run is found and its words are not, the comment is in a new state,
  `reworded`. A reader never draws it as a deleted block. It shows the comment
  beside its blocks with no highlight, and the words it quoted, marked as
  changed (Miky, same session; the look is Katerina's).

LEAF-7 carries it out, in SPEC §13.3 ("A run of blocks", shared with `part`)
and §13.6.

## Rejected alternatives

- **Every selected word** (one exact quote of the whole selection, as Linear
  stores it). Any edit inside a multi-block selection, a typo fix in the middle
  included, would read as "the words have changed", against the live run the
  9 Oct record set. An outside company would have to copy our rule for joining
  blocks into one string, and every comment would copy the longest stretch of
  the page.
- **Whole blocks once a selection crosses one**, words only inside one block.
  The simplest to read, and two-way, but a selection from mid-sentence to
  mid-sentence would light up whole paragraphs, short of "narrowed by the words
  at its ends".
- **The run in a new tag** beside today's one-block `block`. Older readers would
  see no change, but the two tags could disagree, and an outside company would
  get two ways to say one thing for good.

## Consequences

- Edits between a selection's ends keep its highlight, and blocks inserted in
  the middle join it. An edit to the words at either end reads as `reworded`.
- A comment copies at most two short strings of the page. They stay in the
  comment after the page changes, as the record of what the author was looking
  at.
- Peek must read the run before any app writes one; until then it would show
  only the first block, and "deleted" if that block alone is gone.
- One-way once such comments are on the relay: every reader keeps resolving
  this shape.
