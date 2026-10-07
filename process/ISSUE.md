# Issue description template

Every Ship issue opens with a short section about the person it is for, then the
engineering detail. The top lines are what the product reviewer checks a PR
against and what the production check proves before the issue is marked done.

Copy everything below the line.

---

```markdown
## Who, when
<A real person at a real moment: "Katerina, 24 Sep, replied to a comment in a Ship
issue from Peek and it stayed unread." Link where it happened.>

## What changes
<One sentence, in their words: what they can now do or no longer run into.>

## Done when
<The action that person can take on production, and as whom it is checked —
QA-1/QA-2 by probe, or Miky/Katerina by hand. Not the mechanism.>

## Milestone
<The project milestone it belongs to; omit the section if the project has none.>

## Decided
- <YYYY-MM-DD — a product, design or protocol question in a few words → the answer
  (who gave it — Miky, or Katerina for design — and where: a link, or "in the
  kickoff session")>. One line per decision; omit the section until there is one.

---

## Engineering
<What is wrong or missing and where, the approach, repos, Prior, links to the PR,
SPEC sections and related issues.>
```

## Writing the top section

- **Headings, so it reads at a glance** (Miky, 2026-10-07). Issues written
  before then carry the same sections as bold `**Who, when:**` labels; they mean
  the same and are rewritten only when the description is edited anyway.
- **Who, when is real or it is blank.** Right now the real people are Miky and
  Katerina. With no real moment yet, write `Blank — to find: <what would show it>`
  rather than a hypothetical user. A bug report is its own moment: who saw what,
  and when.
- **Done when is a user-facing action.** "The relay accepts a kind:1111 with an
  `A` tag" is a mechanism; "QA-2 sees QA-1's comment turn up unread in the moved
  project's Folder" is the done-when. Code that is merged, deployed and tested can
  still leave the user action broken, so the action is what gets checked.
- **Engineering-only work** (a refactor, a migration, a CI change) names the
  person it protects or the issue it unblocks: "No direct user — unblocks <issue
  title>". Do not invent a story for it.
- If the work shows the done-when to be wrong, **change the done-when in the
  description and say so in a comment**. Do not quietly satisfy a different one.
- **Decided lines record what Miky or Katerina settled**, before the build (`/kickoff`) or
  during it. The PR is reviewed against them, and where one contradicts older text
  in the description, the Decided line wins. A decision that lives only in a
  conversation or a handoff gets reopened, or reviewed against the wrong version.
  Only an answer a person actually gave is written as a Decided line — never the
  agent's own choice, however obvious. A line that names nobody is not a decision.

## Comments

A comment lands in the project's conversation in Peek, where people who were not
involved read it. **Open with one sentence anyone outside the project
understands** — what a person can now do, or what the change means for them: "You
can now move a project to another Folder from its menu, and its conversation
comes with it." Then the PR link and the technical detail. Under 600 characters;
the rest goes in the PR description.
