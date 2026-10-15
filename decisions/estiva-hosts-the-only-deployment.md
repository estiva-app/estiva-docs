# The Specification states what a relay and an identity service must do, and Estiva hosts the only deployment

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, in the SHA-29 shaping session
- Area: Protocol

## Who it affects

A builder at an outside company builds against Estiva's hosted relay and
Estiva ID, after asking Estiva for an invitation and an app registration. They
cannot run their own relay or identity service and expect it to work. A grant
reviewer reading the Specification finds the rules any relay and identity
service must follow, stated as requirements, and a plain sentence that Estiva
runs the only one.

## Context

While docs.estiva.app was being reshaped for builders and grant reviewers
(SHA-29), the protocol pre-review found that SPEC §1 names upstream Buzz as
the reference relay, although upstream Buzz refuses every Nostr for Business
object kind. A builder following it would have pointed their app at a relay
that refuses it. Two questions came out of it: whom the Specification is for,
and whether a builder runs their own stack or uses Estiva's.

## Decision

- Own stack or ours: "Build against our hosted relay and Estiva ID." (Miky,
  2026-10-02.)
- The Specification states the contracts, what any relay and identity service
  must do, and says that Estiva hosts the only deployment and running your own
  is not supported.

DOC-6 ("The Specification states what any relay and identity service must do,
and that Estiva hosts the only deployment") carries it out in SPEC.

## Rejected alternatives

- **Builders run their own relay and identity service.** It was the other
  side of the "own stack or ours" question; the reason it was not taken is not
  on record.

## Consequences

- The Specification can describe the relay and identity service as contracts,
  without promising that anyone else's deployment exists or works.
- Every outside builder depends on Estiva to admit them and register their app;
  the Quickstart says to ask for both.
- Supporting self-hosting later is a new decision: the contracts make it
  possible to describe, but nothing about running one is promised.
