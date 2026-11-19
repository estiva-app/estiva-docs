# Nothing an agent or a loop does to memory is hidden: each mark says why, each change says who, what and why, and a person can undo it

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509, turning down a loop that types items with no picker: "open the black box of AI memory"
- Area: Apps & agents

## Who it affects

A loop marks Miky's message as a Concern. The item says
"“worried” reads as a Concern". When the dreaming loop merges two of his
Insights, the item says who merged what and why, with Undo. Miky sees why
memory changed and can steer it; an outside company can tell its people the
same.

## Context

- On 19 Nov Miky turned down a shape where a loop types items in the
  background with no picker: "open the black box of AI memory". People should
  see why things happen, feel in control, and steer.
- Other AI products keep what they learn in the vendor's black box, which is
  the opposite of what the memory layer is for
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)).

## Decision

- Every mark an agent or a loop makes carries why, in words the person can
  check (the words its guess turned on).
- Every change an agent or a loop makes to an item says who made it, what it
  changed and why, and can be undone.
- Every item says where it was used
  ([an-item-shows-where-it-was-used-and-a-proposed-one-nobody-uses-fades](an-item-shows-where-it-was-used-and-a-proposed-one-nobody-uses-fades.md)).

## Rejected alternatives

- **A loop types items in the background, no picker, nothing shown.**
  Turned down on 19 Nov: memory people cannot see or steer is the black box
  this layer exists to avoid.

## Consequences

- An item's events carry a reason field every app draws, and every agent and
  loop must fill it.
- Undo must exist for every agent change, which rules out changes that cannot
  be reversed.
