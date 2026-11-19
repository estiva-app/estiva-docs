# A mark can be a Highlight, not sorted into a word yet, and a To-do is a fourth, light type anyone marks; both are a trial judged on the prototype

- Date: 2026-11-19
- Status: Proposed
- Area: Files

## Who it affects

Katerina reads a message she wants to keep but cannot say yet whether it is
an Insight or a Concern. She marks it as a Highlight and moves on; a person, a
suggestion or a loop gives it one of the seven words later, or nobody does.
Miky marks "send Katerina the preview link" as a To-do; it becomes an issue in
Ship only if someone makes it one.

## Context

- The Accepted record
  [what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)
  has three types and six words; Blocker was added on 16 Nov.
- Miky, 19 Nov: sorting is not a chore, and a mark should not wait for its
  word. He asked for To-do and Highlight as a trial, to judge on the
  prototype (issue 009bc509): Highlight heads the Mark as menu, To-do sits
  below Insight.

## Decision

- **Highlight** is a mark with no word yet. It stays a Highlight until a
  person, a suggestion or a loop gives it one of the seven words. Nobody has
  to.
- **To-do** is a fourth type: a light task anyone marks, made formal later as
  an issue in Ship or a task in whichever app owns that work.
- Both are a trial. This record is accepted, changed or rejected after Miky
  and Katerina judge the prototype.

## Rejected alternatives

- **Only the seven words.** Turned down for the trial: a person who cannot
  name the word yet would not mark at all.
- **A To-do is an issue at once.** Turned down: most to-dos are smaller than
  an issue, and Ship is not the only app that owns tasks.

## Consequences

- Every app's Mark as menu and lists draw two more kinds; an outside app must
  read them as items too.
- A Highlight nobody sorts is Proposed memory, so it fades like any other
  unused Proposed item
  ([an-item-shows-where-it-was-used-and-a-proposed-one-nobody-uses-fades](an-item-shows-where-it-was-used-and-a-proposed-one-nobody-uses-fades.md)).
