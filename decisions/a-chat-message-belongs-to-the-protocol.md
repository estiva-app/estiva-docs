# A chat message belongs to the protocol, like a comment, and no app owns it

- Date: 2026-10-15
- Status: Proposed
- Area: Messages

## Who it affects

Miky and Katerina see no change under any option: a message linked from a Ship
issue or a Leaf page draws the same and opens in Peek. What changes is for an
outside company bringing its own chat app. Under this record it gets chat
messages from the Specification alone, and its app only has to say it opens
conversations. Otherwise it must replace Peek as the owner of messages in its
workspace. It came up while shaping "Decision records 2" on 2026-10-15, once
Folders were made to belong to no app: a Folder's chat is chat messages.

## Context

- A chat message (`kind:9`, the NIP-29 group message) is one shape for a Peek
  topic's conversation, a DM, a Folder's chat and a chat thread on a Ship
  project. Ship writes them too (`estiva-ship src/api/writes.ts`,
  `src/nostr/events.ts`).
- Peek's app listing (`31990:…:estiva-peek`) claims the kind (`["k","9"]`) and
  says how it draws (`projections["9"]`), read on the relay on 2026-10-15. A
  linked message is drawn by asking which app claims its kind (interop
  `resolveForeignEvent`).
- Comments (`kind:1111`) and bare files (`kind:30840`) already resolve through
  a built-in, and open through the app declaring the `conversation` aspect
  (SPEC §7.8).
- SPEC §7.8 says a generic app such as Peek "owns none". No record decided that
  messages are Peek's; the claim dates from Peek's first listing.

## Decision

Proposed, not decided. Asked of Miky as the brief "Who owns a chat message"
(15 Oct 2026). The option written here is the brief's recommendation.

- A chat message belongs to no app. The Specification says how it draws
  (author, text, time, its thread), and every app has that built in, as for a
  comment.
- It opens in the app that declares the `conversation` aspect: Peek today, a
  company's own chat app in its workspace.
- Peek's listing drops its claim on messages only after Ship, Leaf, Peek and
  the agent run the interop that has the built-in, the same release order as
  the Folder change in "Decision records 2".

## Rejected alternatives

Not decided yet; these are the options still open.

- **A message belongs to the workspace's chat app (Peek here).** Nothing
  changes now, and an app can extend messages through its own listing. But a
  shared, upstream shape that Ship also writes would be owned by one app. The
  Specification would need an exception to "a generic app owns none". An
  outside company would have to replace Peek as the owner to bring its own chat.

## Consequences

- Messages, comments and topics are all drawn from the Specification. There
  is one rule and no exception.
- Peek cannot give messages anything extra in other apps on its own. A new
  part of a message is a Specification change.
- Two-way: no stored message changes. Undoing it means republishing Peek's
  listing with the claim and changing interop again.
