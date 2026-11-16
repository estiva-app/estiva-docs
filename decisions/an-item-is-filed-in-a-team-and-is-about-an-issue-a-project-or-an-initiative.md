# An Insight, Journal entry or Risk is filed in one team, whose people read it, and is about an issue, a project or an Initiative when it can be, or else is just the team's

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the shaping session of 16 November 2026 for the project "Insights, Journal and Risks" ("I think that's right… I think you write it"): "Highlight is type of file -> the root home is one team. E.g. there is Engineering insights (the home is engineering team), it's customer insights (the home is product design,...)"; "Highlight ideally reference something specific (a issue, a project,..) worst case scenario it's just team highlight"; "if you're not able to reference e.g. specific issue or project, you can reference a Initiative"; and, asked whether this made more sense than the Accepted rule: "You learn e.g. some insights regarding process. Sure it happened on that project and you learned it there, but it's Engineering insights primarily and will be used by the whole team." Two parts are Claude's, marked below; his merge of this record accepts them
- Area: Files

> Superseded in part, 2026-11-16: its "about an issue, else a project, else an
> Initiative". An item can be about any file of any app, Ship's three levels
> being Ship's own case, and each app says how its files roll up, in
> [an-item-can-be-about-any-file-of-any-app-and-every-app-that-opens-that-file-shows-it](an-item-can-be-about-any-file-of-any-app-and-every-app-that-opens-that-file-shows-it.md).
> Everything else stands as this record says.

## Who it affects

Most of what we have learned so far is a team's, not one project's. "Measure
speed at Miky's scale", "a green test run can hide a broken feature" and
"review is the agent's own step" were each learned on one ticket, and each is
an Engineering lesson the whole team uses (the Leaf page "Insights, Journal
and Risks: real examples", 16 Nov). Under the rule accepted on 13 November each
would have to sit on an issue or a project it does not really belong to.

With this call Miky marks such a lesson as an Insight filed in Engineering. If
it is about a specific issue, project or Initiative, it says so, and it shows
there too; if not, it is simply one of Engineering's insights. Where it was
learned stays visible through its sources, the message or block it came from.

## Context

- Miky's frame for it: "Team -> File -> Subfile / Steer team -> Intelligence
  project -> specific issue", and Initiatives as a "lens that group different
  files (and subfiles) across teams".
- [an-insight-journal-entry-or-risk-lives-on-the-most-specific-place-it-fits](an-insight-journal-entry-or-risk-lives-on-the-most-specific-place-it-fits.md)
  (Accepted 13 Nov) gives each item one home: a task, else a project, else an
  Initiative. It leaves open an insight from a team's chat about no project.
- [an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed](an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed.md)
  (Accepted 16 Nov): an item's readers are fixed when it is made, and a move
  changes only where it is listed.
- Every file carries the team it was filed in, and that team decides who reads
  it (SPEC §3.1); moving a file never changes who can read it
  ([moving-a-file-never-changes-who-can-read-it](moving-a-file-never-changes-who-can-read-it.md)).
  An issue, filed in a team, also belongs to a project through a field that
  can change.
- A comment, or a file made under another file, is stored with that file
  ([what-belongs-to-a-file-is-stored-with-it](what-belongs-to-a-file-is-stored-with-it.md)).
- A topic lives in exactly one team
  ([a-topic-lives-in-exactly-one-team](a-topic-lives-in-exactly-one-team.md)),
  while an Initiative, the name Miky leans to for cross-team work, groups files
  from several teams. That name still waits on Katerina's look.
- No Insight, Journal entry or Risk is on the relay yet: changing this costs no
  migration.

## Decision

- **An item is filed in one team**, its root home. As for every file (SPEC
  §3.1), that team decides who reads it.
- **It is about something specific when it can be**: an issue, else a project,
  else an Initiative, meaning whatever that cross-team level is finally called.
  **If none fits, it is just the team's**: an Engineering insight, a Product
  design risk.
- *Claude's:* **it shows on what it is about and is listed by its team.** A
  project shows what is about its issues; an Initiative shows what is about it
  and about the projects and issues it groups. Rolling up is a way of showing,
  as the 13 Nov record said. How each app draws a team's list is shaped with
  the build.
- **What it is about is a field and can change**, and the change is kept in its
  history. Changing it never changes who reads the item. **"About" is a
  reference, not a parent**: the item is not a file made under its issue,
  project or Initiative, and only its own comments are stored with it.
- *Claude's, not Miky's words:* **when marking, the team starts as the team
  where the source was written**, and another team is offered only when its
  readers are the source's (until private teams and notes are brainstormed).
  Moving an item to another team later is a move like any file's: it changes
  where it is listed, never who reads it. **Where it was learned is its
  sources**, never its "about".

## Rejected alternatives

- **The item's home is the issue, project or Initiative itself** (the rule
  Accepted on 13 Nov). Turned down: a team's lesson would be pinned to the one
  project it happened on, when it is "Engineering insights primarily and will be
  used by the whole team" (Miky). *Claude's, in addition:* an Initiative spans
  teams, yet an item homed on it would be read by one team only, without saying
  so; and a team's chat about no project had no place.

## Consequences

- Supersedes in part
  [an-insight-journal-entry-or-risk-lives-on-the-most-specific-place-it-fits](an-insight-journal-entry-or-risk-lives-on-the-most-specific-place-it-fits.md):
  its "one home per item … a task, else a project, else the Initiative" becomes
  "filed in a team, about a task, else a project, else an Initiative, or about
  nothing". It also answers that record's open line on an item that fits no
  task, project or Initiative: it is the team's. Its roll-up, its changeable
  field and "choosing is secondary" stand.
- In [an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed](an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed.md),
  "home" is the team an item is filed in. Changing what it is about, or moving
  it to another team, changes only where it is listed.
- An item filed in one team about another team's issue shows on that issue
  only to people who can read the item's team. Today every team is open to the
  whole company, so nobody meets this until private teams.
- **Not decided here, and brought with private teams and notes:** an item in an
  open team about a private team's work names that work to the item's readers;
  and whether an item about another team's issue, project or Initiative shows
  there before someone in that team has accepted it.
- Marking names two things, the team and what the item is about; how the
  screen asks them is shaped with the build.
