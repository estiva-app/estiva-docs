# A topic always has a team: a move changes both teams' lists in one action, and a topic on no list can go back only to the team it was created in

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-02), on the brief "Who can claim a topic"
- Area: Folders

## Who it affects

Katerina moves #bugs from Engineering to Design in Peek. If Design does not
take it, #bugs stays in Engineering and Peek says why; it is never in no team.
Every app that moves a topic (Peek, Ship, the agent, an outside company's
app) sends one Move naming both teams, the way a tracker changes an issue's
team in one update.

## Context

- The record "A topic lives in exactly one team, and only a move changes
  which" says a move "takes it off the old team's list as it puts it on the
  new one".
- A list command names one team, so a move is sent as two: one to each team's
  list. In between, and after a move whose second half fails, the topic is on
  no team's list. On 2 Nov, 3 of the 34 topics on production were on no list.
- Moving never changes who can read a topic; where it is stored is fixed.
- Asked of Miky as the brief "Who can claim a topic" (TEA-3, project Teams and
  following), with three options: this one; keep two steps and send a topic on
  no list home; and leave it to whichever team lists it first.

## Decision

- **A move is one action** naming the team a topic leaves and the team it
  goes to. The relay changes both lists or neither, checking the mover's
  rights on both at once (a member of each team for a space, as today).
- **A topic leaves a team only by moving** to another, or by being archived
  or deleted.
- **A topic that is on no list anyway can be listed only in the team it was
  created in**, its home.
- **An archived team keeps its topics** until an owner or admin unarchives
  it, as archiving leaves a team's contents as they are.
- SPEC §3.3 carries it; the relay rule and the apps' Move are TEA-3's.

## Rejected alternatives

- **Keep two steps, and send a topic on no list home.** While a topic is on
  no list, only the person who just took it off may list it, for about a
  minute, and after that only the team it was created in. It keeps the two
  events apps already send, but the relay must remember who removed what and
  when, a rule on a clock that is hard to explain to an outside company; and
  a topic whose move was left halfway waits on no list until its home team,
  which may not be where it was, picks it up.
- **Leave it to whichever team lists it first.** The simplest rule, and
  nothing to undo, but "exactly one team" then holds only after a move
  succeeds, and a topic on no list goes to whoever lists it first, leaving
  the rule to good manners.

## Consequences

- "Which team is this topic in" has one answer at every moment, not only
  after a move succeeds.
- A new action on the wire, which Peek, Ship and the agent adopt; going back
  to two steps would mean changing every app again. Two-step moves already on
  the relay stay valid as history.
- A topic whose home team is archived cannot be listed until the team is
  unarchived.
