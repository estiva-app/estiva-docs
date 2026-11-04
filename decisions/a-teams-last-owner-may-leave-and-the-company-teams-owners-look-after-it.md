# A team's last owner may leave it, and a team with no owner is looked after by the Company team's owners

- Date: 2026-11-04
- Status: Accepted
- Decided by: Miky, in the TEA-5 session (2026-11-04), answering the question "When a team's only owner wants to leave, what should happen?" with "Company owners take over", as recommended
- Area: Folders

## Who it affects

Miky owns six of Estiva's teams (Steer, QA, Backlog, Leaf, Ship and Peek),
each the only owner. Peek's team page offers him no Leave on any of them,
with no reason given, because the server would refuse it. With this rule he
can leave Backlog like anyone else, and Backlog keeps someone who can rename
or archive it: the Company team's owners, today Miky himself.

An outside company learns one rule: a team is never left with nobody who can
look after it, and nobody is kept in a team they want to leave. It is how
Notion, Linear and Slack treat a workspace's own admins.

It came up on 4 Nov in the review of Peek's Teams (TEA-5), where the product
reviewer found Leave hidden on every team Miky is in.

## Context

- A team's owners and admins, in its `kind:39001`, are who may rename or
  archive it
  ([only-owners-and-admins-rename-or-archive-a-folder](only-owners-and-admins-rename-or-archive-a-folder.md)),
  and who may give or change a role (SPEC §3.3).
- The relay refuses to take a team's last owner off it, by a remove or by
  their own leave: "cannot remove the last owner — transfer ownership first"
  (buzz-db `channel_members.rs`), NIP-29's rule for a sole owner. SPEC §3.3
  names it beside leave.
- No app offers a way to make someone else an owner, so "transfer ownership
  first" points nowhere.
- On production on 4 Nov, Miky was the only owner of Estiva HQ and of six
  other teams, and the only person on each roster. Nobody leaves Estiva HQ,
  the Company team
  ([everyone-in-the-company-is-on-the-company-teams-list-and-the-relay-keeps-it](everyone-in-the-company-is-on-the-company-teams-list-and-the-relay-keeps-it.md)).
- Every workspace has exactly one Company team, which the relay marks
  ([every-server-has-a-company-team-and-without-one-the-first-team-to-list-a-topic-keeps-it](every-server-has-a-company-team-and-without-one-the-first-team-to-list-a-topic-keeps-it.md)).

## Decision

- **A team's last owner may leave it**, as anyone else may; the relay
  accepts their `kind:9022`, and a remove of the last owner by another owner
  stays refused.
- **A team with no owner is looked after by the Company team's owners**:
  they may rename it, archive it and give its roles, as its own owners
  could. Nobody becomes its owner by leaving it, and no heir is picked.
- The Company team itself keeps its rule: nobody leaves it.
- Until the relay and SPEC carry this, apps keep Leave hidden for a team's
  last owner, as Peek does.

## Rejected alternatives

- **Keep Leave hidden for a team's last owner** (as built). Nothing on the
  screen says why, and a person stays in a team they want to leave.
- **Show Leave greyed, saying the person is its only owner.** Honest, but it
  asks for an owner handoff that no app offers.
- **Leave hands the team to another member**, the longest-standing one. It
  picks an heir without asking them, every app must follow the same choice,
  and with nobody else in the team (all six of Miky's on 4 Nov) Leave is
  still not offered.

## Consequences

- SPEC §3.2 and §3.3 gain a line: the Company team's owners act as owners of
  a team that has none, and leave no longer names NIP-29's sole-owner rule.
- The relay accepts a last owner's leave and checks a rename, archive or
  role change on a team with no owner against the Company team's owners.
  One more read on those commands, which are rare.
- Peek, Ship, Leaf and the agent offer Leave to a team's last owner once the
  relay accepts it.
- Two-way: nothing new is written. A team left without an owner is an
  ordinary roster; giving it an owner again is an ordinary role change.
