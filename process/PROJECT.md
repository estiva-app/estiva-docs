# Project description template

Every Ship project description follows this shape. `/shape-project` fills it, the
product pre-reviewer in `/kickoff` checks each ticket against it before the build,
the product reviewer in `/land` checks the work against it, and `/sweep` flags
projects that do not have it.

**Order:** highest level first, widest audience first, and what is least likely to
change first. Context is stable ground truth; Milestones are the living part.
Adapted from Linear's PRD guidelines (Context → Usage scenarios → Milestones).

**Small, and it finishes.** About 1–2 weeks and at most ~8 issues. Bigger is cut
to the smallest version worth building, or split into stages, each its own
project. When the Done when holds, the project is marked Completed and archived —
whatever is left in Later stays there. ("Design projects so that they can be
completed in 1–3 weeks", Linear Method, *Scope projects down*.)

**The one rule that is not negotiable:** a usage scenario is a real person at a
real moment that actually happened. Right now that means Miky or Katerina. If
there is no real moment yet, leave the scenario blank and say what to go and
find. An invented scenario turns a guess into something that reads like a fact;
a blank shows what we still need to learn.

Copy everything below the line. Delete each italic prompt once its section is
filled; leave it only on a section that is still empty.

---

```markdown
# Context
*For everyone. Stable — if it changes, question the project.*

## Goal
*One line: the outcome this project exists for, measurable where it can be.*

## Done when
*The action on production that ends the project, and as whom it is checked.*

## When it ships we say
*The one-sentence changelog line, in Peek's words.*

## Problem
*Why now — how it actually showed up, linked to the Peek message or Ship issue.*

# Solution
*What we will do: the mechanism, not the spec.*

## Not in scope
*What this deliberately does not do.*

## Options rejected
*(optional) Only alternatives that were really on the table, and why each lost.*

## How others do it
*(optional) Slack, Linear, Notion — only where it matters.*

# Usage scenarios
*One per real moment: what happened, then what changes with this project.*

## [Miky / Katerina], [date], [what they were doing]
*What happened. With this project: what changes for them.*

## Blank — to find
*Use when there is no real moment yet: whom to watch doing what.*

# Milestones
*How the issues are sequenced, riskiest first. Each is named for what a person
can do when it lands.*

## 1. <what someone can do when this lands>
- <issue title>
- <issue title>

## 2. <…>
- <issue title>

# Later
*Empty at shaping. One line per nice-to-have found while building — polish, an
edge case nobody has hit, parity on another surface, an idea. Not issues.*

# Technical notes
*Optional. Architecture, protocol, repos, links to SPEC sections and RFCs. Everything
engineering-only goes here, below the parts everyone reads.*
```

## Notes

- **Projects written before 2026-10-07** use bold labels and may have no Goal or
  Done when. They stay valid; add the headings when the project is next shaped or
  swept for its own sake, not in a bulk rewrite.
- **The issue list is fixed when the project is shaped.** An issue is added only
  for a blocker — it stops the Done when, or it is a production bug a person hits
  now — or on Miky's call. Everything else found on the way is a line in Later.
  `/sweep` prunes Later lines nobody has raised again in a month.
- **Milestones sequence issues; they are not objects.** Ship has no milestone
  field. Each issue names its milestone in its `## Milestone` section
  ([ISSUE.md](ISSUE.md)), and the project lists its issues under each milestone
  by title. Refs collide across projects, so a list of refs alone is ambiguous.
- **Usage scenarios cite their source**: a Peek conversation, a Ship issue, a
  session or a call. The test for every sentence in Context and Usage scenarios
  is that you can point to where someone said it or clearly meant it.
- An infrastructure project with no direct user still gets a Context. Its
  scenario is a real moment it would have changed, if there is one; otherwise
  it says `No direct user — enables <project>`.
- A **Feedback & Bugs** project is an inbox, not a plan: it has Context and no
  Usage scenarios, Milestones or Done when, and its issues have no Milestone. A
  blocker is fixed from there; other work is pulled into a small project. It is
  never the project a run of tickets is worked in.
