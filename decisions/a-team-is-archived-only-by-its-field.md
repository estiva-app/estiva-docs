# A team is archived one way, by its archived field like every file; the server refuses the groups archived flag on a team

- Date: 2026-11-03
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-03), on the brief "Why the server says no" ([page](briefs/why-the-server-says-no.html)), question 2: A, as recommended
- Area: Folders

## Who it affects

When Miky archives a team in Peek or Ship, it is greyed out in every app, its
topics stay where they are, and people can still talk in it. That is the only
way a team is archived. An outside company sees one event called "archived"
on a team, with one meaning, the same as for a project or a page.

## Context

- Our apps archive a team by writing its `archived` field (`kind:1851` on the
  team's address, SPEC §3.3), as they archive any file. The server keeps an
  archived team's list of topics as it is (record
  [an-archived-teams-list-is-kept-by-the-server-and-a-topic-made-outside-a-team-is-the-company-teams](an-archived-teams-list-is-kept-by-the-server-and-a-topic-made-outside-a-team-is-the-company-teams.md)).
- NIP-29 has a second switch: an `archived` flag on the group's own settings
  (`kind:9002`). When it is set, the server refuses every write in the group,
  its chat included. Our apps never set it; only Peek's conversation list
  reads it, to hide an archived channel.
- Freezing a whole team, chat included, is the option the record above turned
  down, because whether people can talk in an archived team waits for the
  Folders rework.
- The server already refuses the flag on the Company team (SPEC §3.4).
- On 3 Nov, of the 55 groups (teams and conversations) QA-1 can read on production, 3 carry the
  flag, all probe throwaways.

## Decision

- **A team is archived only by its `archived` field.** The server refuses the
  groups `archived` flag on a team, as it already does on the Company team,
  and the SPEC says so. Clearing the flag still lands, so a team that carries
  it can be unfrozen.
- **A direct message is not a team** and keeps its own archive.
- The refusal is built in the TEA issue "When the server says no, every app
  knows why".

## Rejected alternatives

- **One meaning, both ways.** The server and every app treat either switch as
  the same archive: topics kept, chat open. The groups flag would then mean
  something weaker than on every other Nostr groups server, which confuses
  anyone who knows the standard, and every app must read both.
- **Keep both.** The SPEC says what each does: the field keeps the topics,
  the flag freezes everything. A frozen team looks normal in our apps until
  someone tries to write, and an outside company has two archives to learn.

## Consequences

- One switch with one meaning for every file, teams included.
- An outside NIP-29 groups client that archives a team is refused and must
  write the field instead.
- Two-way: the refusal can be lifted later, and a team frozen by the flag
  before it lands can be unfrozen by its owner.
