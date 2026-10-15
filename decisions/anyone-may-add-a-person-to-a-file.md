# Anyone may add a person to a file, including someone who left it

- Date: 2026-10-06
- Status: Accepted
- Decided by: Miky, in the SHI-31 kickoff session (2026-10-06), and at SHI-31's /land (2026-10-07) for adding back someone who left
- Area: Read state

## Who it affects

Miky or Katerina can add each other, or anyone, to an issue or a project from
its Members dialog, and the person they add is told about it from then on.
That holds even for someone who left it earlier, an assignee included. An
outside company's app writes the same membership change and every app counts
it.

## Context

Membership decides whose unread a file's conversation is
([membership replaces following](membership-replaces-following.md)). SPEC
§11.8 already let anyone write the change that adds a person (a `kind:1851`
setting `member:<P>` to `true`), and only the person themselves can write the
one that makes them leave. On 1 Oct Miky's comment on SHI-31 described Members
as the place to join or remove yourself. At SHI-31's kickoff he brought back
adding others, and at its /land he settled whether someone who left can be
added back.

## Decision

- Anyone may add a person to a file (Ship's "Add members", and Peek's after
  REA-3).
- Re-adding somebody who left is allowed: anyone may add them back, assignee
  included.

## Rejected alternatives

- **Only you can add yourself** (Miky's comment of 2026-10-01). Superseded at
  the SHI-31 kickoff by bringing back "Add members"; the reason is not on
  record.

## Consequences

- Leaving is not a block: a person who left can be pulled back in by anyone,
  and leaves again with one click.
- An app needs no rule of its own for who may add whom.
- Which adds count when they come from outside the file's Folder is a separate
  rule, tracked in REA-7, and not decided here.
