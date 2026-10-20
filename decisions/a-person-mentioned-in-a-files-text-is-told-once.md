# A person mentioned in a file's text is told once and becomes a member, and a later save that still names them changes nothing

- Date: 2026-10-19
- Status: Superseded by a-mention-in-a-files-text-adds-the-person.md
- Decided by: Miky, in the shaping session of the project *Widgets 2: build 2 — documents* (2026-10-19), asked twice there, and his merge of this record
- Area: Read state

## Who it affects

When Miky writes `@Katerina` in a Leaf page or a Ship description, Katerina
becomes a member of that file, and it shows her one unread in Peek, Ship and
Leaf until she opens it. After that she hears about its conversation as any
member does. If she leaves the file, she stays out while people keep editing
the page, typo fixes included. If the mention is taken out and someone
mentions her again later, she is back, with one unread, as in a message.
Taking the mention out does not remove her. An outside company's app that
writes a file's text tags the people it mentions, keeps no state to do it, and
counts mentions the same way when it reads.

## Context

- Being mentioned in a file makes a person a member
  ([membership-replaces-following](membership-replaces-following.md)), and
  "a mention requires the content to name `P`, not merely a `p` tag" (SPEC
  §11.8). Until now only a message's text could mention anyone: a file's text
  had no `@`, and its saves carried no `p` for the people it names.
- With `@` in documents
  ([every-app-edits-a-document-with-one-shared-editor](every-app-edits-a-document-with-one-shared-editor.md)),
  a text save has to say whom it mentions, as a message does.
- Miky was asked twice. The first question said a `p` on every later save
  "changes nothing", and his first answer rested on it. That was false: the
  fold makes a person a member again for a `p` on any later change ("a later
  trigger makes a person who left a member again", SPEC §11.8; foundation
  `conversation/src/membership.ts`, the loop over a change's `p` tags), so a
  person mentioned in a page people keep editing could never leave. Asked
  again with that corrected, he chose a leave that holds.

## Decision

- **Every save of a file's text tags the people it names.** A description
  change (`kind:1851`), and a creation whose text mentions someone (on the
  root), carries `["p", P]` for each person its value names by `nostr:npub`,
  capped at 50 as a message is, after the `imeta` tags. Writers keep no state.
- **A reader counts a save as a mention of P only when the save before it did
  not name P.** That save is a join, and one unread item for P in the file
  until they open it. So a leave holds through typo fixes, and mentioning
  someone again after the mention was taken out brings them back.
- **Taking the mention out does not remove membership.** Only the person
  leaves (SPEC §11.8).
- **The writer rule is keyed on prose**: an input with
  `format: "estiva-blocks-1"`, or a value with no content format. A generic
  writer still needs no list of fields.

## Rejected alternatives

- **Every save that mentions you counts.** Nobody mentioned in a page people
  keep editing could ever leave it, and every save would land in their
  membership read, which Peek caps at 1,000 events.
- **A save tags only the people its writer newly mentions.** The tag would
  mean "newly mentioned", which nobody can check from the text; two people
  editing at once could both tag or neither; and it is one-way once on the
  relay.
- **A mention in a document is a chip that tells no one.** A mention would
  mean less in a page than in a message, and turning it on later would count
  only new saves.
- **A mention makes you a member silently, without the one unread.** If nobody
  comments, you never learn you were mentioned.

## Consequences

- SPEC follows: §6.10 (the `p` tags on a text save and their cap), §7.3 (the
  writer rule keyed on prose), §11.8 (a new row, "mentioned in its text"; the
  sentence that a change places a person exactly when its input is a pubkey
  narrowed to fit it; the fold step; the creation row; the one unread), and
  §13.1 (the `p` rule widens from a message to every text save). A conformance
  case is added: mentioned, leaves, someone else saves.
- Each writer of a file's text needs one shared helper that finds the
  mentions in a block document: Leaf, Ship, Peek's panel through interop, and
  the agent's description writes.
- Text saves that mention a person join their membership read
  (`#p`, capped at 1,000), so that read is bounded, so assignments never drop
  out of it.
- Two-way: the tags are plain `p` tags, and the counting is a reading rule.
  Undoing it rewrites no event.
