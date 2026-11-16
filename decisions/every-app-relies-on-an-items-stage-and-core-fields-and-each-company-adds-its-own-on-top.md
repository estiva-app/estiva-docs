# Every app relies on an Insight's, Journal entry's or Risk's shared stage and its core fields, and each company adds its own statuses and fields on top

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the shaping session of 16 November 2026 for the project "Insights, Journal and Risks". Asked whether the items' 13 November statuses still hold: "I think that's where the discussion about Notion like simple dbs should happen. Basically, I think the protocol should define high level Highlights: Insights, Journal logs, and Risks, but there probably should be some flexibility." Shown the brief "Osnova's memory layer" ([page](briefs/highlights-are-osnovas-memory-layer.html)), he took its recommendations: "Yes, all five". The stage words, a Risk's Open at the accepted stage and the item with no source are Claude's proposals on that page, accepted by that answer; lines marked as Claude's below are not on it; his merge of this record accepts them
- Area: Files

## Who it affects

An agent asked "what do we currently believe about this project?", or about
an HR app's open position, reads the items at the accepted stage, whatever
the company calls that status, and weighs each by who signed the change that
accepted it. Ship shows Proposed,
Accepted and Outdated as its defaults; a company may rename Accepted to
"Confirmed", add "Under review" under Proposed, or add a Severity to its
Risks, in its own layer. And Miky's Journal Update "Activity indicator
completed" of 16 November, which came from a project's status rather than a
message or a block, can be typed by hand with no source.

## Context

- The 13 November record set the three types' statuses, a shared start and
  each type's own end, and their fields
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)).
  It turned down "template databases each company reshapes", because two
  companies' Risks would no longer mean the same thing.
- Every type's statuses come in layers: Osnova says what a status means (its
  stage), an app gives defaults, a company names its own and adds its own
  fields, and later a person's database writes the same shape
  ([each-company-defines-its-own-statuses](each-company-defines-its-own-statuses.md),
  [a-companys-statuses-are-its-own-layer-of-a-types-properties](a-companys-statuses-are-its-own-layer-of-a-types-properties.md),
  [an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)).
- SPEC §7.4 has four stages, open, started, done and dropped, and a reader
  treats any other word as "this app does not say". An issue's Todo is at
  open, Done at done, Cancelled at dropped (Ship `src/nostr/kinds.ts`).
- Every item starts at Proposed, and who may accept it is each company's rule
  ([who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status](who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status.md)).

## Decision

- **The 13 November statuses hold for every app**, Ship's and any other:
  every item starts Proposed, then is Rejected or Accepted (a Risk: Open),
  and ends Outdated, Superseded or Resolved by type. Their stage words are
  the ones below. **The flexibility is each
  company's layer on top**: its own status names, its own statuses under a
  stage, its own fields, and later a person's database.
- **The stage words reuse a word where the meaning is the same.** Resolved is
  at **done**, as an issue's Done is; Rejected is at **dropped**, as an issue's
  Cancelled is. New stage words only for **proposed**, **accepted**,
  **outdated** and **superseded**.
- **A Risk's Open is at the accepted stage**, never at an issue's open: an
  issue's open means "not started", and a watched Risk is not work nobody has
  begun. The label "Open" can stay as Ship's default.
- **The core fields every app reads and writes** are the 13 November list:
  title, summary, details, sources, team, about, status with its stage, the
  kind of entry (Decision or Update; Concern or Question), and a Journal
  entry's decided by. Everything else is a company's or an app's own.
- **An item typed by hand may have no source.** One made by marking always
  has its source.
- *Claude's:* **a stage is the signer's own word**, as SPEC §7.4 says of
  every type: a reader weighs an accepted item by who signed the change that
  accepted it, against the company's rule
  ([who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status](who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status.md)).

## Rejected alternatives

- **Each company defines its statuses entirely, with no shared stages.**
  Already turned down on 13 November, brought back by "some flexibility" and
  the HR example. Turned down again: an agent could not tell a suggestion from
  what a team believes in another company's app, and no app could count a
  project's open Risks it did not write. The flexibility Miky asked for fits in
  the company's layer.
- **No stages at all**: whatever is marked is memory. Turned down: what an
  agent suggests in the background would land in memory as fact, against the
  record that every item starts at Proposed.
- **All new stage words** (resolved, rejected as well). Turned down: two words
  for "dropped", and an app that already counts stages would count nothing
  until it learned six.
- **A smaller core** (title, sources, team, about, status). Turned down: an
  agent could not tell a decision from an update across apps, and "who
  decided" would be a field some apps have and others do not.

## Consequences

- Confirms
  [what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)'s
  statuses and fields, and supersedes in part three things in it: the stage
  each status carries (its table called Proposed, Rejected, Open and Resolved
  stages; now Rejected is at dropped, Resolved at done and a Risk's Open at
  accepted), its consequence that each type has its own stages (they are now
  words in §7.4's one vocabulary), and its "sources (one or more messages or
  blocks it came from)": an item typed by hand may have none.
- SPEC §7.4's stages grow by proposed, accepted, outdated and superseded, in
  the SPEC PR the project "Insights, Journal and Risks" already owes. Apps that
  read only the four read the new words as "does not say", so nothing is
  miscounted.
- Once items are on the relay the stage words are one-way: every status change
  carries its stage word, kept in the item's history. A core field can be
  added later; removing one is a new type.
- *Claude's:* the relay's refusal of an item whose source its readers cannot
  read
  ([an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read](an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read.md))
  checks the sources an item names. The relay cannot tell a marked item from
  one typed by hand, so words a person types into an item with no source are
  theirs, as words typed into any message are. The SPEC PR states that an app
  or agent making an item by marking MUST name its source, so leaving it out
  is never a way around the check.
