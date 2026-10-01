# Project description template

Every Ship project description follows this shape. `/shape-project` fills it, the
product reviewer in `/land` checks work against it, and `/sweep` flags projects
that do not have it.

**Order:** highest level first, widest audience first, and what is least likely to
change first. Context is stable ground truth; Milestones are the living part.
Adapted from Linear's PRD guidelines (Context → Usage scenarios → Milestones).

**The one rule that is not negotiable:** a usage scenario is a real person at a
real moment that actually happened. Right now that means Miky or Katerina. If
there is no real moment yet, leave the scenario blank and say what to go and
find. An invented scenario turns a guess into something that reads like a fact;
a blank shows what we still need to learn.

Copy everything below the line. Keep the italic prompts on any section that is
still empty.

---

```markdown
# Context
*For everyone, whatever their role. This should not change. If it does, question
whether we should be building this at all.*

**When it ships we say:** *One sentence, in the words someone reading Peek would
use — the changelog line. If it cannot be written cleanly, the project is not
clear enough to build yet.*

**Problem:** *The underlying problem, and why now. Anchor it to how it actually
showed up — a workaround, a complaint, a request for something adjacent — and
link the Peek message or Ship issue it came from. Claim no more than that
evidence supports.*

# Solution
*What we will do, stated simply: the mechanism, not the spec.*

- **Options we considered and rejected:** *Real alternatives that were on the
  table, and why each lost. This is where a reader can challenge the reasoning.*
- **How others do it:** *Slack, Linear, Notion — only where relevant. What they
  do, and why ours is the better story.*
- **Out of scope:** *What this project deliberately does not do.*

# Usage scenarios
*A real person at a real moment. Describe what happened, then what changes for
them with this project. Two or more.*

**[Miky / Katerina], [date], [what they were doing]** — *What happened, as it
happened. With this project: what changes for them.*

**[Blank — to find:]** *Who we would need to watch, doing what, to fill this in.*

# Milestones
*The living part: how the issues are sequenced. Riskiest and most uncertain work
first. Each milestone ends in something a person can do or see — not a layer of
plumbing with nothing to show. Name them for what they deliver.*

## 1. <what someone can do when this lands>
- <issue title>
- <issue title>

## 2. <…>
- <issue title>

# Technical notes
*Optional. Architecture, protocol, repos, links to SPEC sections and RFCs. Everything
engineering-only goes here, below the parts everyone reads.*
```

## Notes

- **Milestones sequence issues; they are not objects.** Ship has no milestone
  field. Each issue names its milestone on its `**Milestone:**` line
  ([ISSUE.md](ISSUE.md)), and the project lists its issues under each milestone
  by title. Refs collide across projects, so a list of refs alone is ambiguous.
- **Usage scenarios cite their source**: a Peek conversation, a Ship issue, a
  session or a call. The test for every sentence in Context and Usage scenarios
  is that you can point to where someone said it or clearly meant it.
- An infrastructure project with no direct user still gets a Context. Its
  scenario names the person whose experience it protects ("Katerina opens a
  Folder on a slow connection…"), or states plainly that it enables another
  project and names that project.
