# A loop may change an Accepted item, merging or updating it; the item says who, what and why, whoever added it is told in Activity, and they can undo it

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509, answering the brief "Memory layer, next level", question 4: "It should be able. Somebody probably should be notified to reviewed it"
- Area: Apps & agents

## Who it affects

Overnight the dreaming loop merges "Search finds only word starts" into Miky's
Accepted Insight about how search matches words. Next morning his Activity
says the loop changed his Insight; the Insight shows "The dreaming loop merged
“Search finds only word starts” into it · Both say how search matches words ·
2h ago", with Undo.

## Context

- Loops are background work that sorts, merges and consolidates memory
  ("dreaming"). Every item a loop writes starts as Proposed.
- Asked whether a loop may touch an Accepted item, Miky answered on 19 Nov:
  it should be able to; someone should be told and can review it, "but
  that's the whole point: agents (loops) doing the tedious work for humans".

## Decision

- A loop may change an Accepted item: merge another into it, update it, or
  mark it Outdated.
- The item shows who changed it, what changed and why, and keeps the change
  in its history.
- Whoever added the item is told in Activity and can undo the change.

## Rejected alternatives

- **A loop only proposes; every change to an Accepted item waits for a
  person.** Turned down: it hands the tedious work back to people.

## Consequences

- Undo must restore the item exactly, including what was merged into it.
- Follows
  [nothing-an-agent-does-to-memory-is-hidden](nothing-an-agent-does-to-memory-is-hidden.md).
