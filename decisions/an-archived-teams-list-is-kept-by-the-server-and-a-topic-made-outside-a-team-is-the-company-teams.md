# The server keeps an archived team's list of topics as it is, for every app, and a topic made outside any team has the Company team as its home

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-02), answering the two questions "Archived" (the server refuses, as recommended) and "No home" (the Company team, as recommended), and his merge of this record
- Area: Folders

> Supersedes in part
> [a-topic-always-has-a-team-and-moves-in-one-action](a-topic-always-has-a-team-and-moves-in-one-action.md):
> "An archived team keeps its topics until an owner or admin unarchives it",
> now a rule the server keeps rather than one each app keeps; and "the team it
> was created in", for a topic that was not created in a team. The rest of it
> stands.

## Who it affects

Katerina archives Marketing. Someone's script, or an outside company's app,
moves #launch out of it: the server says "Marketing is archived", and #launch
stays in Marketing in every app until an owner or admin unarchives the team.
The same holds for moving a topic into an archived team.

A topic made inside a Ship project's conversation, not in any team, can be
put in the Company team, and from there moved like any other topic.

## Context

- The record "A topic always has a team" says an archived team keeps its
  topics, and that a topic on no list can be listed only in the team it was
  created in.
- A team is archived by the `archived` field of its `kind:1851`, counted only
  from the team's owners and admins (SPEC §3.2). The server does not read it:
  SPEC §6.5 says "No relay lock", archive is a view each app works out, and
  the relay's one archive rule is that the Company Folder is never archived
  (§3.4).
- A topic's `h` names where it was made. On 2 Nov one topic on production,
  "Testing Conversation standard topic", has an `h` that is a Ship project's
  conversation, not a team, and is on no team's list; under the record it
  could never be listed anywhere.
- Both came up while building the one-action move (TEA-3) and were asked of
  Miky together in that session.

## Decision

- **The server refuses any change to an archived team's list of topics**,
  into it or out of it, from every app: a move, an add, a remove or a set
  naming it. It works out whether the team is archived the way a reader does
  (§3.2), from its owners' and admins' `archived` changes. SPEC §6.5's "No
  relay lock" gains this one exception.
- **A topic whose `h` is not a team has the Company team as its home** (§3.4):
  while it is on no list it can be listed there, and then moved like any
  other topic.
- SPEC §3.3 and §6.5 carry it; the relay rules are TEA-3's (estiva-app/buzz#47).

## Rejected alternatives

- **Only our apps keep an archived team's topics.** Peek and Ship hide Move on
  an archived team and nothing changes on the server. An outside app, an
  agent or a script could still empty the team and nothing would say no, so
  "an archived team keeps its topics" would be good manners, not a rule.
- **Archiving a team freezes everything in it**, its chat included. The
  simplest to state, but it would also decide whether people can still talk
  in an archived team, which waits for the Folders rework (§6.5 "Not covered
  yet").
- **A topic made outside a team is never listed.** Nothing to add to the
  record, but an app that lets someone make a topic outside a team would then
  make one nobody can ever put in a team.
- **Its maker lists it once, in any team they can write in.** The most
  flexible, but it brings back "whoever lists it first keeps it" for these
  topics, which the brief "Who can claim a topic" turned down.

## Consequences

- An archived team's list is the same in every app, whoever wrote the move.
  The server reads the team's archive state on each change to its list: one
  more read per command.
- Unarchiving is the only way to move a topic out of an archived team, as the
  record already said for its topics.
- Every topic has exactly one home, the one rule an outside company follows.
  Today it reaches one test topic.
- Two-way: the server's refusal can be loosened later without rewriting
  anything on the relay; the Company home, once topics are listed there by
  it, stays where they were put.
