# A key let in only to do a job, such as an app's or the server's own, may write but is not one of the company's people, so it is on no team

- Date: 2026-11-09
- Status: Accepted
- Decided by: Miky, in the kickoff session of "Estiva HQ becomes the Company team, with everyone in it" (2026-11-09), on the brief "Who is in the company" ([page](briefs/who-is-in-the-company.html)): B, as recommended
- Area: Folders

## Who it affects

Katerina opens Estiva HQ, the Company team, and sees the company's people and
its agents, not the server's owner key, its operator key or the keys three
apps publish their listings with. Ship and Leaf do not offer those keys as
assignees. An outside company's bots and integrations keep writing to its
server without appearing on its Company team.

It came up on 9 Nov, at the kickoff of "Estiva HQ becomes the Company team,
with everyone in it" (TEA-7), on the brief
[Who is in the company](briefs/who-is-in-the-company.html).

## Context

- [everyone-in-the-company-is-on-the-company-teams-list-and-the-relay-keeps-it](everyone-in-the-company-is-on-the-company-teams-list-and-the-relay-keeps-it.md)
  has the relay put "each person it lets into the workspace" on the Company
  team's roster. It did not say what happens to a key that is not a person.
- The relay lets only keys on its workspace roster write, and an app's
  listing key is let in like a member (KINDS, `9030`). So a key that is not a
  person cannot simply be taken off the workspace roster.
- On production on 9 Nov the workspace roster held 14 keys: six people's
  accounts, three agents, and five keys that are no one (the owner key, the
  operator key and three app listing keys).
- The workspace roster has roles (owner, admin, member) and nothing that says
  whether a key is a person.

## Decision

- **Letting a key in says whether it is someone or a service.** Whoever lets
  it in says so once; the relay keeps it on its workspace roster.
- **A service may write, and is on no team.** The relay puts only people and
  agents on the Company team's roster, and refuses adding a service, or any
  key not in the company, to the Company team.
- **The keys already let in are marked once** by whoever runs the server, when
  it is upgraded, as the Company team itself was.
- SPEC §3.4, the admission row of §4.1, and KINDS `9030` and `13534` carry it.

## Rejected alternatives

From the brief "Who is in the company" (9 Nov):

- **A · Every key the server lets in is in the company.** Least to build, and
  cheap to undo on the server. Turned down: the Company team and every people
  picker list keys nobody can name (on 9 Nov five of 14), and each app hides
  them its own way, which is the second meaning of member the 2 Nov record
  turned down, and those filters stick.
- **C · Services are not let in at all.** Gives the same list as B. Turned
  down: services need a second way to write, through server settings; it
  departs from the Nostr standard for member lists, where being on the list is
  what lets a key write, reverses "an app's key is let in like a member", and
  costs the most to build.

## Consequences

- One meaning of member stays: a person or agent on a team's roster.
- Every place a key is let in (Estiva ID's enrolment, the operator's tools)
  must say which it is; a key marked wrongly is left out of #general until the
  mark is fixed.
- The workspace roster event gains a marker an outside relay must keep to
  conform.
