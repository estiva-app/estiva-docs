# What an agent reads as memory is a brief written from the Insights, Journal entries and Risks; the items stay the sources a person opens and corrects

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509, answering the brief "Memory layer, next level", question 2: "I think it's the brief. The item is the source."
- Area: Files

## Who it affects

An agent preparing Miky's Friday summary reads the project's brief, not 40
separate items. When Miky wants to know where a line of it came from, he opens
the items it cites, and when he corrects one, the next brief follows.

## Context

- Miky, 19 Nov: "the item is the source. It's like doing a research and
  reading some website. The website is the item you learned from, it can
  change over time, but the memory is what's being used because that's the
  research."

## Decision

- Memory, as agents use it, is a brief written from the items.
- The items stay the sources: each line of a brief points at the items it
  came from, and an item's receipts show the briefs that used it.
- Changing an item changes the next brief, not the past ones.

**Still open:** what a brief is as a file: who writes it (a loop, an app),
where it lives (per project, per team), and how it points at its items. That
is a record of its own, asked when the brief is built.

## Rejected alternatives

- **Agents read the items directly.** Turned down: the items are many and
  change; the brief is what an agent can use, as research is to the pages
  it read.

## Consequences

- A brief is a new kind of file every app and agent reads, and the shape of
  the next protocol question.
