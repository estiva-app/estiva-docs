# What is already on the relay does not weigh against the right protocol shape

- Date: 2026-09-06
- Status: Accepted
- Decided by: Miky, choosing CON-9's model on 2026-09-06
- Area: Protocol

## Who it affects

Miky and Katerina see their own workspace change, and sometimes empty out, when
a better shape replaces an early one. An outside company gets a protocol shaped
for what it will build, not for what two people happened to write in its first
weeks.

## Context

For CON-9 the agent measured that 93% of every paired Peek topic's
conversation was Ship issue comments, and recommended keeping that stream so
the topics would not empty before a demo, against the model CON-9 described.
The production workspace was a two-person workspace: Miky and Katerina talking.

## Decision

Miky, 2026-09-06: "we are in early stage and we are just having conversation me
and Katerina. We should almost never take into consideration existing content.
It's all about setting good architecture and protocol for the future." He chose
CON-9's model, and called the comment stream leaving the topics a benefit.

## Rejected alternatives

- **Keep the stream so topics do not empty before the demo.** Rejected: the
  existing content is not a customer's data, and protecting it biases every
  decision toward whatever was built first.

## Consequences

- What a change does to live data is still measured and reported, as a
  consequence of the option, not as an objection to it.
- Cost arguments are kept for what the relay cannot undo: a published event and
  a new kind are permanent.
- The companion rule for old shapes is
  [early shapes are migrated or deleted](early-shapes-are-migrated-or-deleted.md).
