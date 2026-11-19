# When an agent or a loop marks your message or block, you are told in Activity, as when a person names you

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509, answering the brief "Memory layer, next level", question 1: "when a loop mark her message, she should get and Activity notification"
- Area: Read state

## Who it affects

Claude marks Miky's message as a Concern. The topic it is in lights in his
Topics column with "Claude marked yours as a Concern", and the item says why.
He can accept it, change its word, or delete it.

## Context

- [intelligence-works-in-the-background-and-reaches-you-only-by-naming-you](intelligence-works-in-the-background-and-reaches-you-only-by-naming-you.md)
  (Accepted): intelligence reaches a person only the way a person's message
  does, by naming them.
- Asked on 19 Nov, Miky answered: when a loop marks her message, she should
  get an Activity notification.

## Decision

- A mark an agent or a loop makes on your message or block names you, so it
  reaches you in Activity once, as a mention does.
- A change a loop makes to an item you added reaches you the same way
  ([a-loop-may-change-an-accepted-item-and-whoever-added-it-can-undo-it](a-loop-may-change-an-accepted-item-and-whoever-added-it-can-undo-it.md)).
- A mark a person makes on your message stays as today.

## Rejected alternatives

- **Silent: the label on the message is enough.** Turned down: you would
  learn that an agent read your words as a Concern only by happening on it.

## Consequences

- Loops that mark many messages add Activity lines; ranking and grouping
  them is the Activity indicator's job, not a reason to stay silent.
