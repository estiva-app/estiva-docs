# A copy on the device catches up with Nostr's own set reconciliation (NIP-77), so it downloads only what it is missing or no longer may hold

- Date: 2026-11-04
- Status: Accepted
- Decided by: Miky, in the Initiative "Re-architecting Osnova protocol" (session of 2026-11-04), on the brief ["One copy on the device, for all three apps"](briefs/one-copy-for-all-apps.html): "we shouldn't invent the wheel. If NIP-77 is proven and it fits our usecase, let's use it."
- Area: Devices & sessions

## Who it affects

Miky and Katerina: an app that opens from its copy downloads only what changed
since, rather than everything on screen again. An outside company: any Nostr
client or library that speaks NIP-77 catches up from our relay the same way,
with nothing Estiva-specific to learn.

## Context

- The relay has no "changes since" answer. Peek's copy stays honest by asking
  the relay the same question again on every open and dropping whatever the
  answer leaves out: a deleted event, or a Folder the person has lost
  (`event-snapshot.ts` in `@estiva-app/platform`).
- The Initiative listed "a full sync engine like Linear's" as Not in scope,
  because the relay keeps current versions, not a change log.
- [NIP-77](https://github.com/nostr-protocol/nips/blob/master/77.md) is an official NIP, marked draft and optional. It comes from strfry's
  author, strfry runs it in production, and rust-nostr speaks it as a client.
  The client sends a fingerprint of the events it holds for a filter, and the
  relay answers with the ids the client is missing and the ids it holds that the
  relay no longer returns. The events themselves are then fetched by id.
- Buzz, both our fork and Block's upstream, does not speak NIP-77. As of
  2026-11-04, no open issue or PR upstream proposes it or any other change feed.
  The negentropy library appears only as a dependency of a client for Block's
  LLM mesh feature. Buzz's own apps catch up by re-asking history (at most 500
  events per filter) while a live subscription stays open.

## Decision

A copy on the device catches up with NIP-77. Our relay learns `NEG-OPEN`,
`NEG-MSG` and `NEG-CLOSE`, and we offer the change to Block like our other
proposals. A copy reconciles each question it has asked before and fetches only
the ids it is missing. It drops the ids the relay no longer returns, which
covers deletes and lost access, as today's re-asking does.

It was chosen on the condition "if it fits". Building it checks three things:

- **Who can read.** The relay applies who-can-read inside the reconciliation, so
  a person never learns that an event they cannot read exists.
- **The 500 cap.** Reconciliation covers a filter's whole set, not Buzz's
  500-event history window. Otherwise "gone" cannot be told from "past the cap".
- **Small questions.** Finding the difference and fetching it are two round
  trips, so a tiny question may stay cheaper to re-ask.

Re-asking stays as the fallback for a relay without NIP-77.

## Rejected alternatives

- **Re-ask and correct (today).** It is simple and honest, but it downloads
  everything on screen again on every open. It stays only as the fallback.
- **A numbered change stream, Linear's way.** The relay would number events as
  they arrive, and a copy would ask for everything after the last number it
  saw. It was turned down for two reasons. It is a rule only our relay would
  have, which every other relay would have to copy. And a delete or lost access
  would have to be announced as a new kind of notice, because absence no longer
  says it. Miky: "we shouldn't invent the wheel."

## Consequences

- The Not in scope line "a full sync engine like Linear's" narrows to "a
  numbered change stream like Linear's": syncing comes in, the Estiva-only
  shape stays out.
- Combined with
  [the-copy-on-the-device-is-the-persons-shared-by-every-estiva-app](the-copy-on-the-device-is-the-persons-shared-by-every-estiva-app.md),
  what one app fetched is never downloaded again by another.
- The relay takes on new work, building a filter's set per reconciliation, and
  a new place where read access must hold.
- NIP-77 is a draft. If it changes upstream, we follow it. Undoing it means
  falling back to re-asking, which every app keeps anyway.
