# Every server must have a Company team; on one that has none anyway, a topic made outside any team goes to the first team that lists it

- Date: 2026-11-03
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-03), answering the product review of estiva-app/buzz#47: the first team to list it keeps it, and "having a Company team should be a firm rule on protocol level"
- Area: Folders

## Who it affects

Nobody at Estiva sees a change: Estiva HQ is our Company team. An outside
company running its own server learns that a Company team is not optional:
without one its server does not conform. If it runs one without anyway, a
topic made outside any team (inside a Ship project, say) is not stuck on no
list: the first team that lists it keeps it, and from then on it moves like
any other topic.

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
  marked. The reference relay (estiva-app/buzz#47) then counts every team as
  its home, which the product review raised as an unasked call.

## Decision

- **A Company team is a firm protocol rule.** Every server has one; the SPEC
  states it as a requirement, not a default.
- **On a server without one anyway, the first team to list a topic made
  outside any team keeps it.** After that it is on one team's list and leaves
  only by moving, as every topic does.

## Rejected alternatives

- **Nowhere until one is marked.** The one-home rule holds everywhere: the
  topic stays on no team's list until the company marks a Company team, and
  people on that server cannot see it in any team until then, which "a topic
  always has a team" exists to prevent.

## Consequences

- An app never has to handle a workspace without a Company team, and a server
  that has none still keeps every topic on one list.
- On such a server, who first lists the topic decides its team; on a
  conforming server nothing changes.
- Two-way: the fallback reaches only non-conforming servers, and topics it
  placed stay where they were put.
