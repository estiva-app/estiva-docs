# A topic or space lists everyone who chose a level, everyone added to it, and its team's members at their default; someone who follows it only through a team they follow shows once they choose

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline brief "Whose following a place shows": a, as recommended
- Area: Read state

## Who it affects

Miky opens #bug, a space of Engineering. He sees who chose All and who chose
Important, and Engineering's members at Important unless they chose
otherwise. Katerina follows Engineering without being in it: she is not
listed on #bug until she picks a level there herself.

An agent asked "who will see this" counts the same people, and knows the
count leaves out those who follow only through a team.

It came up on 2 Nov while shaping "Teams and following", raised by the
product and protocol pre-reviews of its draft.

## Context

- [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)
  (Accepted, 30 Oct) says two things that meet here: who follows a place at
  each level is visible, and which teams you follow is seen only by you.
- A team's members are public (its roster); the teams you follow are in a
  list encrypted to you. Listing a follower who follows only through a team
  would tell everyone which teams they follow.

## Decision

- **A place lists** everyone who set a level on it
  ([a-persons-level-on-a-place-is-theirs-alone](a-persons-level-on-a-place-is-theirs-alone.md)),
  everyone added to it, and, where the team gives its members a default, the
  team's members at that default.
- **Someone following only through a team they follow is not named** until
  they choose a level on the place.
- Every reader works the list out from public events alone, the same way.
- A member who turned a default off in their private list still shows at
  the default to others, since nobody else can read that list. SPEC says so,
  and says the list undercounts followers through a team.

SPEC §11.8 carries it, in the project "Teams and following".

## Rejected alternatives

- **Make the teams you follow public**, so the list is complete. It
  supersedes part of an Accepted record, which Miky had called "more of a
  distraction".
- **List written levels only.** Members' defaults would be hidden too, and
  the list would be nearly empty on the first day.

## Consequences

- Nothing private leaks, and no new read is needed.
- "Who will see this" is a lower bound, and every app says it the same way.
- A member's private opt-out is not visible on the list; a later stage can
  hide members' defaults from others if that matters.
