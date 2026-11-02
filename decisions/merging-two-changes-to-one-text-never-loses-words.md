# Two people's changes to one text merge block by block, and anything that would lose someone's words asks instead

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the ALO-7 kickoff session of 2026-11-02, answering "when is a block 'changed by both', so the app asks instead of merging quietly?" (the issue "The agent reads and writes projects field by field", its `## Decided` lines)
- Area: Files

## Who it affects

Katerina, 13 Sep, on her project "UI Guardrails": her Claude's save and her own
crossed, and one landed on top of the other. Since 30 Oct the relay refuses the
second of two crossing saves, and the app that was refused merges. This record
says how, so Ship, Leaf, Peek, the agent and an outside company's app merge the
same two texts into the same result, and none of them drops a person's words
without asking.

## Context

- [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md)
  (D4, Accepted 2026-10-29) says a refused save merges: "different blocks
  merge without asking; only a block both people changed asks". It did not say
  when a block counts as changed by both: an edit against a delete, a move
  against an edit, two insertions in one place.
- A text is a §13.3 block document, and every block carries an id kept across
  edits, so the same block is found in all three versions: the text both
  started from, the text now current, and the refused one. Older texts are
  marker text with no blocks (§13.4).
- How an app *asks* is a screen, Katerina's to design (ALO-4). For an agent,
  Miky decided the same day: nothing is saved, and its answer shows both
  versions and names who changed the block.

## Decision

The refused app merges three texts: the **base** (the text its change named as
`prev`), **theirs** (the text now current) and **mine** (the refused one).
A block is any node with an `id`; a node with none belongs to the nearest one
around it.

- **A block one side changed and the other did not** takes the change.
- **A block both changed the same way** is kept once.
- **A block both changed differently asks.**
- **A block one side deleted and the other edited asks.** Neither a quiet
  delete nor a quiet return.
- **A block one side deleted and the other left alone** is deleted.
- **A block one side moved and the other edited** is merged at its new place.
  Both moved it to different places: theirs stands, since no words are lost.
- **Both inserted at one place**: both are kept, theirs first.
- **A text that is not a block document** is one block.

When anything asks, the app saves nothing of the refused text, whatever else
merged, and the person resolves the blocks that ask before it saves again.

SPEC §13.3 carries it out, and §6.2 points to it.

## Rejected alternatives

- **An edit beats a delete**: the edited block comes back with its new words
  and no note, and the person who deleted it may never notice.
- **A delete beats an edit**: the rewrite vanishes, and the answer says only
  "merged".

## Consequences

- Every app merges two crossing saves into the same text, so a result does not
  depend on which app was refused.
- A delete crossed with an edit costs one question to someone. Measured on
  29 Oct, 16 of 17 crossings within a minute were agents, which have no screen
  and answer by rewriting.
- Changing the rule once apps merge by it is a protocol change, and a merge
  already saved by the old rule stays as saved.
- Live co-editing, if it comes, sits on top of this as §6.10 says; the stored
  text stays the snapshot every app reads.
