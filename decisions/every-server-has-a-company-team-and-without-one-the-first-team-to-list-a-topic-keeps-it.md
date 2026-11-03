# Every workspace must have a Company team; on a server without one anyway, a topic made outside any team goes to the first team its author lists it in

- Date: 2026-11-03
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-03): answering the product review of estiva-app/buzz#47, the first team to list it keeps it, and "having a Company team should be a firm rule on protocol level"; then, answering the security review of estiva-app/estiva-docs#391, only its author lists it first (A, as recommended)
- Area: Folders

## Who it affects

Nobody at Estiva sees a change: Estiva HQ is our Company team. An outside
company running its own server learns that a Company team is not optional:
a workspace without one does not conform. If its server runs one anyway, a
topic Alice made outside any team (inside a Ship project, say) is not stuck
on no list: Alice lists it in the team she picks, that team keeps it, and
from then on it moves like any other topic. Nobody else can put her topic in
a team first.

## Context

- A topic made outside any team has the Company team as its home: it can be
  listed there, then moved (record
  [an-archived-teams-list-is-kept-by-the-server-and-a-topic-made-outside-a-team-is-the-company-teams](an-archived-teams-list-is-kept-by-the-server-and-a-topic-made-outside-a-team-is-the-company-teams.md)).
- Every workspace has exactly one Company team, which the relay marks
  (record
  [every-workspace-has-one-company-folder-the-relay-marks-and-keeps](every-workspace-has-one-company-folder-the-relay-marks-and-keeps.md));
  SPEC §3.4 already says a relay serving a workspace without the mark does not
  conform.
- The SPEC did not say what the server does with such a topic when no team is
  marked, which the product review of estiva-app/buzz#47 raised as an
  unasked call.

## Decision

- **A Company team is a firm protocol rule.** Every workspace a server hosts
  has one; the SPEC states it as a requirement, not a default.
- **On a server without one anyway, only a topic's author lists it first**,
  in any team they may list it in. That team keeps it; after that it leaves
  only by moving, as every topic does.
- The relay rule is built in the TEA issue "When the server says no, every
  app knows why".

## Rejected alternatives

- **Nowhere until one is marked.** The one-home rule holds everywhere: the
  topic stays on no team's list until the company marks a Company team, and
  people on that server cannot see it in any team until then, which "a topic
  always has a team" exists to prevent.

## Consequences

- An app never has to handle a workspace without a Company team, and a server
  that has none still keeps every topic on one list.
- On such a server, the author decides the topic's first team; on a
  conforming server nothing changes. "Leave it to whichever team lists it
  first", which the record
  [a-topic-always-has-a-team-and-moves-in-one-action](a-topic-always-has-a-team-and-moves-in-one-action.md)
  turned down, does not come back: the choice is the author's, and only where
  there is no Company team to be the home.
- Two-way: the fallback reaches only non-conforming servers, and topics it
  placed stay where they were put.
