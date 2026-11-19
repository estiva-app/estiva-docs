# An Insight, Journal entry or Risk shows where it was used, and a Proposed one nobody uses or adds to fades and is archived

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509: receipts on every item, unused items fade as Linear archives issues, "only proposed highlights"
- Area: Files

## Who it affects

Miky opens an Insight and sees "Used · 2: the Friday summary, Ship's triage
loop". A Proposed Insight nobody used or added to says "Fades in 24 days
unless used or added"; when it fades it is archived, says "Nobody used or
added it in 30 days, so agents no longer read it", and can be restored.

## Context

- Miky, 19 Nov: every item shows where it was used ("receipts"), and unused
  items fade and are archived, as Linear auto-archives issues. Only Proposed
  items fade; how long is the agent's call ("small detail").
- Proposed items count for less than accepted or commented ones.

## Decision

- Every item lists where it was used: by whom or what, where, and when.
- A Proposed item that nobody uses, accepts or adds to for a set time fades
  and is archived; agents stop reading it. Anyone can restore it.
- Accepted items never fade.
- The time is a setting the team tunes; the prototype uses 30 days.

## Rejected alternatives

- **Everything fades, Accepted included.** Turned down: an accepted item is
  what the team chose to keep.
- **Nothing fades.** Turned down: unsorted Proposed marks pile up and agents
  keep reading them.

## Consequences

- Every agent, loop and app that reads an item must record that it used it,
  so receipts are complete; a reader that does not breaks fading.
- Fading is an archive, not a delete, so it keeps
  [a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md).
