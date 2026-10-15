# Peek and Ship may each choose when to offer Edit and Delete, and converge once they share one library

- Date: 2026-09-21
- Status: Superseded by edit-and-delete-are-offered-only-on-your-own-message.md
- Decided by: Miky, on CON-16 (estiva-docs#135)
- Area: Messages

## Who it affects

From 21 Sep, Miky and Katerina saw Edit and Delete only on their own messages
in Peek, and on every message in Ship, where the relay refused a non-author.
An outside company could pick either rule and still follow SPEC.

## Context

SPEC §6.5 said an app MUST NOT hide Delete by its own author check, because
only the relay knows every party with the right, an agent's owner included.
On 21 Sep Peek did exactly that, by Miky's decision (PEE-32, peek#281): a
non-author's request is refused every time, so the control only ever failed.
Ship offered it to everyone. The two apps did not yet share code for
conversations.

## Decision

- SPEC's MUST NOT became a documented trade-off, and both rules were
  acceptable: offer and let the relay adjudicate (Ship), or hide by author
  label (Peek).
- No Ship change. Ship following Peek was a separate decision.
- The apps were expected to converge on one answer once they shared a base
  library for the conversation standard, rather than be reconciled by fiat.

## Rejected alternatives

- **Make Ship match Peek now**, or **revert Peek to match SPEC.** Miky chose
  neither: with no shared implementation, forcing one rule would pick a side
  that nothing could keep in place.

## Consequences

- SPEC could record two valid choices for one rule while the apps differed.
- The shared library came with CON-5 (`@estiva-app/conversation`, 29 Sep),
  and one rule replaced both choices. The rule that holds now is
  [Edit and Delete are offered only on your own message](edit-and-delete-are-offered-only-on-your-own-message.md).
