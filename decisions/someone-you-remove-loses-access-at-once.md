# Someone you remove loses access the moment the removal lands

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, in the workflow review session of 2026-10-14, on the brief "When access ends"
- Area: People

## Who it affects

When Miky or an admin removes someone from the workspace, or from a Folder,
nothing written after that moment reaches them, in any app, whether or not the
app was built by Estiva. Their open apps are told their access has ended. What
already reached their device before the removal stays there.

For an outside company running the protocol, this is what it can promise when
someone leaves: one removal on the relay ends their access everywhere, without
building a forced sign-out into each app it runs.

## Context

SPEC §4.1 lists workspace admission as revocable instantly. Miky was asked on
14 Oct how a removal should take effect, as a brief with three options and the
outcome of each for him, Katerina and an outside company.

## Decision

Access ends the moment the removal lands, and the relay enforces it. The relay
closes the removed person's open connections and checks every later request. This covers their agents too, since an agent borrows its
owner's access.

It is carried out by the issue
[Someone you remove loses access at once](https://ship.estiva.app/issue/someone-you-remove-loses-access-at-once-39f569d5-bfa2-415b-815e-4c281ce25564)
in the project "People at the protocol level".

## Rejected alternatives

- **At their next sign-in.** Each app would have to police removal itself, each
  in its own way, and an app the company did not write would never hear of it.
  SPEC's "revocable instantly" would have to become "at the next connection".
- **Within a set time, such as ten minutes.** One number to promise, but the
  window becomes part of the contract and can never reach zero. Every open
  connection would be re-checked against the identity service on a timer, so
  if Estiva ID is down at a re-check, everyone is disconnected.

## Consequences

- Every Nostr-for-Business relay must act on a removal and close whatever that
  person has open, on all of its servers. Weakening this later breaks a
  promise companies rely on, so it is hard to undo.
- Apps must handle being told "access ended": say so, and drop what they hold.
- The rule holds whatever the unit of access turns out to be: if Folders stop
  being it ([Folders are labels](folders-are-labels.md), Proposed), losing
  access to whatever replaces them still takes effect at once.
