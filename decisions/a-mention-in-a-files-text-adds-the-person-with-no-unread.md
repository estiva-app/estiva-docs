# A mention in a file's text adds the person, as the Add button does, and being added shows no unread until a document has its own read state

- Date: 2026-10-20
- Status: Accepted
- Decided by: Miky, in the WBD-2 build session (2026-10-20), answering `/land`'s product review of estiva-app/estiva-foundation#161, and his merge of this record
- Supersedes: a-mention-in-a-files-text-adds-the-person.md
- Area: Read state

## Who it affects

When Miky writes `@Katerina` in a Leaf page or a Ship description and saves,
Katerina is added to that file exactly as if he had clicked Add in its
Members: she becomes a member, and the file is in her lists in Peek, Ship and
Leaf. It does not light up as unread for her: nothing was said to her in the
file's conversation, and what is new to her in the document itself is a read
state documents do not have yet. Fixing a typo in that page later tells her
nothing, so if she left she stays out. If someone writes `@Katerina` there
again later, she is added again. An outside company's app that lets people
mention someone in a file's text writes the same Add, and every app folds it.

## Context

- [a-mention-in-a-files-text-adds-the-person](a-mention-in-a-files-text-adds-the-person.md)
  (Accepted 2026-10-20) made a mention in a file's text write the Add, and
  added that being added by someone else — by a mention or the Add button —
  shows one unread on the file until the person opens it. SPEC §11.8 carried
  it as *Being added is one unread item* (estiva-app/estiva-docs#319).
- `/land`'s product review of the shared helper (estiva-app/estiva-foundation#161)
  asked what clears that unread. Today a file's unread is its conversation's:
  it clears when the person reads the stream (SPEC §11.2, §11.3). An Add that
  sits in no message made "read the conversation" the only way to clear being
  added to a document, though the person was added to the document, not to a
  message.
- Miky's answer (2026-10-20, in the WBD-2 build session): conversation unread
  clears only when you read the conversation. Being added to a file is
  **document** unread — the whole document is new to you — and a document's
  read state ("what changed since you last looked", like Linear's change bars)
  is a bigger topic, shaped on its own.
- Nothing reads the unread rule yet: no app shipped it, and no event carries
  it, since it was only a reading rule over the Add that already exists.

## Decision

- **Writing a mention into a file's text adds the person**, unchanged from the
  superseded record: when a save of a file's text names someone by
  `nostr:npub` whom the version the writer edited did not name, the writer
  also signs the membership change that adds them (`member:<P>` = `true`). A
  creation whose text names someone does the same. That is the only event a
  mention in a file's text writes.
- **A save of a file's text carries no `p` for the people it names**, unchanged.
  A typo fix is just a text save, so it changes nobody's membership and tells
  nobody.
- **Taking a mention out removes nobody.** Only the person leaves (SPEC §11.8).
- **Being added shows no unread by itself**, whether by a mention or the Add
  button. A file's unread stays its conversation's, cleared by reading the
  conversation. What being added shows — the document as new to you — belongs
  to a document's own read state, shaped later (Ship: *Widgets 2: build 2 —
  documents*, Later list).

## Rejected alternatives

- **Being added by someone else is one unread on the file until it is opened**
  (the superseded record). It cleared only by reading the file's conversation,
  so a document-level event would be read by a conversation-level marker, and
  every reader, an outside company's included, would build a rule that a
  document read state replaces.

## Consequences

- SPEC follows: §11.8 loses *Being added is one unread item* and says being
  added is not unread by itself; C28 loses its unread clauses. §13.1 and §7.3
  stay as merged.
- The shared helper writes only the Adds (`mentionAddsFor` in
  `@estiva-app/conversation`); there is no unread helper.
- Being added, by a mention or the Add button, is silent until somebody writes
  in the file's conversation, as an Add was before. A mention in a document
  still puts the file in the person's lists.
- Two-way: no event changes. Document read state can later make the Add
  unread, or mark the whole document new, without rewriting anything on the
  relay.
