# A highlight is one shared type, and whether it is a Decision, an Update, an Insight, a Concern, a Question or a Blocker is its word, a field that can change

- Date: 2026-11-28
- Status: Accepted
- Decided by: Miky, in the shaping session of 28 November 2026 for the project "The Journal in Ship, with Claude recording into it", on the brief "How Highlights work: the whole picture" ([page](briefs/how-highlights-work.html)): option B, "one type, highlight, with its word as a field"; and in the kickoff session of 28 November for its first issue, "A highlight is one shared type in the public SPEC, with its word as a field": the 19 November delete rule holds for an accepted Decision, and the names `osnova.highlight`, `word` and one `decider`; and, in the same session on the review of estiva-docs#501, "a re-sort keeps its meaning" (map the status by stage)
- Area: Files

> Supersedes in part
> [what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md):
> its three shared types, and a Journal entry's and a Risk's kind, become one
> type whose word is a field. Its fields, statuses, marking and Peek's fold
> stand.

## Who it affects

Miky reads a project's Journal in Ship and sees what was decided and what
happened. A Question Katerina raised last week was answered in a session; it
becomes a Decision by changing one field, and its conversation, its history
and where it was used stay with it. A highlight a model suggested as an
Insight that turns out to be a Concern is re-sorted the same way, by a person
or by a loop that tidies, and never splits into two files.

An agent reading a team's memory reads one type and filters by the word. An
outside company's app supports one type and reads every highlight any app
writes, a word it does not know included.

## Context

- On 13 November highlights were three shared types, Insight, Journal entry
  and Risk, each with its own kind inside (Decision or Update; Concern or
  Question), and on 17 November Blocker became a third kind of Risk
  ([every-app-reads-an-items-category-severity-blocker-decider-and-wait-and-each-company-names-their-values](every-app-reads-an-items-category-severity-blocker-decider-and-wait-and-each-company-names-their-values.md)).
- A file's type is written once, on its first record, and never changes
  (SPEC §6.1). Under three types, a Question that becomes a Decision, or an
  Insight that is really a Concern, is a new file pointing at the old one,
  with its history and conversation split in two.
- Miky calls the whole thing Highlights, the trial of 19 November already has
  "a Highlight not sorted yet"
  ([a-highlight-is-a-mark-not-sorted-yet-and-a-to-do-is-a-light-task](a-highlight-is-a-mark-not-sorted-yet-and-a-to-do-is-a-light-task.md),
  Proposed), a model's suggestion is the main way to mark, and loops re-sort.
  Each of these treats the word as something that changes.
- No highlight was on the relay when this was decided. Peek's five highlight
  types stay inside its client and never reached the wire (Peek
  `HIGHLIGHT_META`, origin/main, 28 Nov).
- Probed on production on 28 November, as QA-1 in the QA team: one
  `osnova.highlight` file was written with the word `update`, set to
  proposed, accepted, changed to the word `decision` with its decider, and
  superseded. The relay took every change, refused a change that did not
  follow the current status, and read back one file with the four changes in
  order and who signed each. The relay needs no new rule: what it knows about
  a type never changes what it accepts
  ([a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md)).

## Decision

- **A highlight is one shared type**, `osnova.highlight`, curated by Estiva
  in public as an Issue is (TYPES.md). Each highlight is a file of its own,
  with the fields and the life the records of 13 to 27 November give an
  Insight, a Journal entry and a Risk.
- **Its word is a field, `word`, that can change**: `decision`, `update`,
  `insight`, `concern`, `question` or `blocker`. What the records call a
  Journal entry is a highlight whose word is `decision` or `update`; an
  Insight is the word `insight`; a Risk is `concern`, `question` or
  `blocker`. The names Insight, Journal and Risk stay as the words people see
  where an app groups them.
- **The word is optional.** A highlight with no word, or a word the reader
  does not know (a company's own), is read as a plain highlight. Whether
  "not sorted yet" is offered to people stays the 19 November trial's.
- **One person field, `decider`**, says who will decide a Question and who
  decided a Decision, so it stays set when a Question becomes a Decision. It
  is what the records of 16 and 17 November call "decided by" and "decider".
- **One list of statuses for the type**, each with the stage the records of
  16 November gave it: proposed, rejected (stage dropped), accepted, open
  (stage accepted, a Risk's), resolved (stage done), superseded and outdated.
  Each option says which words an app offers it for: a Decision or an Update
  ends Superseded, an Insight Outdated, a Concern, a Question or a Blocker
  Resolved. A status stays readable after the word changes, and **a re-sort
  keeps its meaning**: when the new word is not offered the current status,
  the change that sets the word also sets the new word's status with the same
  meaning, so an Open Question that becomes a Decision is an Accepted
  Decision in every app, and nobody accepts it again. A highlight with
  no status yet is proposed. A company names its own statuses on top, as for
  any type.
- **Anyone who can read a highlight can delete it, an accepted Decision
  included**
  ([anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace](anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace.md)
  holds for every word): a wrong delete is restored from Activity, and an app
  that must keep decisions adds its own rule.
- **It is not a NIP-84 highlight.** A `kind:9802` is a fixed quote of a
  source, with no status, team or word that can change; one can later be a
  highlight's source, never a highlight.

## Rejected alternatives

- **Three types, Insight, Journal entry and Risk** (the record of 13
  November). Three well-known things, and a Risk means the same in two
  companies. Turned down: re-sorting a highlight, by a person or a loop,
  would make a new file and split its history and conversation; every new
  word would be a new shared type or squeezed into one of the three; an
  agent reads three types with three status sets.
- **A type per word.** Each word its own type. Turned down: a file can never
  be re-sorted, and every new word is a new type for every app to support.
- **Only the decider or the person who accepted it may delete an accepted
  Decision.** Fewer deletes by mistake. Turned down: the relay would read a
  file's status for the first time, and anyone could set it back to proposed
  and then delete it, since who changes a status is each company's rule.
- **An accepted Decision cannot be deleted, only superseded or archived.**
  Turned down for the same bypass, and it breaks the rule that a delete only
  marks a file and can be undone
  ([every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file](every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file.md)).
- **A re-sorted highlight keeps its old status** (a Decision shown "Open"),
  or **goes back to Proposed**. Turned down: the first shows a label the word
  does not have, differently in each app; the second turns every tidy-up by
  a loop or a model into a new queue for a person.
- **Two person fields, `decider` and `decided-by`.** Turned down: after a
  Question becomes a Decision, "decided by" would be empty until someone
  fills it in, for the same person.

## Consequences

- One-way once a highlight is on the relay outside a QA team: renaming the
  type, the `word` field or a shared word means a new type and rewriting
  every file. Adding a word, a field or a status only adds to the shape.
- SPEC §7.4's one list of stages gains proposed, accepted, superseded and
  outdated, as the record of 16 November said, and an option may name the
  words it is offered for. TYPES.md gains the `osnova.highlight` entry.
- A status whose last value depends on the word is a shape no other type has;
  it is said in the options, never checked by the relay.
- The 13 November record's fields, statuses, marking and Peek's fold stand;
  only its three types and each type's kind are replaced by this one.
