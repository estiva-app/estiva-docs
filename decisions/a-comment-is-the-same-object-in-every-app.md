# A comment is the same object in every app; suggestions, review verdicts and an agent's assertions are objects of their own beside it

- Date: 2026-10-16
- Status: Proposed
- Area: Messages

## Who it affects

Miky, 16 October, after trying comments in Leaf: "I think comment is the same
object everywhere. Can you tell me a case where it shouldn't be?" No counter-case
was found. Under this record a comment written in Leaf, Ship or Peek is one
thing. Every app draws it, and anyone can reply to it, react to it, and edit or delete
their own, the same way in each. An outside company building a review, approval or
suggestion feature makes its own object beside comments, rather than a
comment with a flag that other apps would draw as an ordinary comment.

## Context

- SPEC §6.4 already says a comment (`kind:1111`) is written by every app on any
  file it can read, and §7.8 that no app owns it and every app draws it.
  [a-chat-message-belongs-to-the-protocol](a-chat-message-belongs-to-the-protocol.md)
  rules the same for chat messages, "as for a comment".
- Edit and delete are one rule in every app
  ([edit-and-delete-are-offered-only-on-your-own-message](edit-and-delete-are-offered-only-on-your-own-message.md)).
  Resolve is the same `9101` assertion in Leaf and Peek (LEAF-5).
- What no record states is where a comment ends. Suggestions in a document,
  review verdicts, and an agent's assertions (`KIND_ASSERTION`) are each
  candidates to become "a comment with a flag".

## Decision

- A comment is a `kind:1111` on a file. What it anchors to may differ: a
  document's blocks and quoted words, an issue, a topic. So may the
  container's own fields. Nothing else differs between apps.
- A reply in chat stays a chat message (`kind:9`, SPEC §6.4). It is a
  different object, which shares the comment box and the reaction row
  ([every-app-writes-and-reacts-with-one-shared-box](every-app-writes-and-reacts-with-one-shared-box.md)).
- A suggestion, a review verdict or an agent's assertion is its own object
  beside a comment, never a comment with a flag. That is how upstream
  separates them (NIP-84 highlights and NIP-32 labels are their own kinds),
  and how resolve already works (`9101`).

## Rejected alternatives

- **A comment with a flag, for a suggestion or a verdict.** It would need no new kind. But every app that does not know the flag draws it as an ordinary comment, so a suggestion would look like a remark in Peek and an accepted verdict would look like chat. No case for it was found on 16 October.

## Consequences

- Every app that draws comments draws every comment correctly. A new feature
  never changes what a comment means elsewhere.
- A suggestion or review feature costs a new kind and a SPEC section, not a
  tag.
- Two-way today, because no flagged comment exists on the relay. It becomes
  one-way once a suggestion or verdict ships in either shape.
