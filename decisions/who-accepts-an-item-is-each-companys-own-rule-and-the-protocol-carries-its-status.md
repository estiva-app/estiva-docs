# Who may accept an Insight, Journal entry or Risk, or unmark one, is each app's, company's or team's own rule; the protocol carries only the item's status, which starts at Proposed, and who signed each change

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the session of 16 November 2026 after the review of estiva-docs#442: "Let's go deeper. We should probably have status like proposed decision or decision open. Then it shouldn't be that much prescriptive who can do the final decision. That's not for the protocol. each app, probably each org or even team should have their own rules. We should start loose."; and, the same day, that unmarking is a status change gated by the same rule; his merge of this record accepts its wording
- Area: Messages

> Superseded in part, 2026-11-19: "unmarking is a status change, never a
> delete", and, for a highlight, "the relay lets only an event's author delete
> it". Anyone who can read a highlight can delete it, in
> [anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace](anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace.md).

> Supersedes in part
> [anyone-who-can-read-a-message-or-block-marks-it-and-anyone-confirms-a-proposed-item](anyone-who-can-read-a-message-or-block-marks-it-and-anyone-confirms-a-proposed-item.md):
> its "anyone who may comment on a Proposed item can confirm it", its "an
> agent never confirms its own suggestion", and who may unmark. Its marking
> rule stands: anyone who can read a message or a block can mark it.
> It also answers the open line of
> [what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)
> on whether a person's own mark starts at Proposed.

## Who it affects

Miky reads Katerina's message in Peek and sees a real insight; "she is shy to
mark it", so he marks it for her (13 November). Whether that insight then
counts at once, or waits for someone to accept it, is not something the
protocol says. Estiva's apps, a company or a team set it.

Estiva has its own rule today, and it is an example of a company's rule, not
the protocol's: only a person, or an agent with a person's explicit approval,
accepts. Claude writes decision records and Decided lines only from an answer
Miky gave, and his merge accepts a record. That rule is written in Estiva's
own working instructions, not in Osnova.

An outside company may set another rule, such as "only a project's lead
accepts a Journal entry" or "our review agent accepts Insights", and its items
still read the same in every app.

## Context

- An item is an Insight, a Journal entry or a Risk, with a status whose stages
  start at Proposed
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)).
- The record this one supersedes in part, merged on 16 November, wrote two
  rules on who accepts into the protocol: anyone who may comment, and never an
  agent for its own suggestion. The review of that pull request asked who
  checks such a rule, and Miky answered that it is not the protocol's to set.
- Each company names its own statuses, and every status change carries its
  stage
  ([a-companys-statuses-are-its-own-layer-of-a-types-properties](a-companys-statuses-are-its-own-layer-of-a-types-properties.md)).
- A file keeps every change for good, with a History panel
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)).
- The relay lets only an event's author delete it.

## Decision

- **The protocol carries the item's status and who signed each change.** Every
  item starts at Proposed. Each status change is signed by whoever made it and
  kept in the item's history, so every app shows who moved it, and when.
- **Who may move an item out of Proposed is not the protocol's.** Each app,
  company or team sets its own rule for accepting or rejecting an item. The
  protocol prescribes neither "anyone" nor "only a person"; we start loose.
- **Unmarking is a status change, never a delete**, someone else's mark
  included: the relay lets only an author delete. Who may unmark follows the
  same app, company or team rule as accepting.
- **Whether a person's own mark is accepted at once** is that same rule's call.

## Rejected alternatives

- **The protocol says anyone who may comment accepts an item** (the record
  this one supersedes in part). Turned down: "That's not for the protocol". A
  company that wants its project lead to accept decisions could not have it.
- **The protocol says an agent never accepts its own suggestion** (the same
  record, Claude's addition). Turned down: it is one company's rule, ours, not
  a shape every company would adopt, and it said nothing about one agent
  accepting another's suggestion.
- **Unmarking deletes the item.** Turned down: only its author can delete it,
  and a delete loses the history of who marked and who unmarked.

## Consequences

- An outside company adopts the three types without adopting our review
  habits; Estiva's apps ship a default rule, and a company or team changes it.
  Where that rule is kept and how an app reads it is shaped with the build.
- Every item says who accepted it, because every change is signed; an app or
  agent reading the Journal as memory can weigh an item by who signed it.
- Two apps with different rules may disagree about a change made in the other;
  how an app shows a change its own rule would not have allowed is shaped with
  the build.
