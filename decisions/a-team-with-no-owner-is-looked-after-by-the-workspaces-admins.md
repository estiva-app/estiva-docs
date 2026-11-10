# A team with no owner is looked after by the workspace's owners and admins, the same people who may delete a team

- Date: 2026-11-10
- Status: Accepted
- Decided by: Miky, in the TEA-10 kickoff session (2026-11-10), on the brief "Who looks after a team nobody owns?" ([page](briefs/who-looks-after-a-team-with-no-owner.html)), choosing "Workspace admins", as recommended
- Area: Folders

> Supersedes in part
> [a-teams-last-owner-may-leave-and-the-company-teams-owners-look-after-it](a-teams-last-owner-may-leave-and-the-company-teams-owners-look-after-it.md):
> a team with no owner is looked after by the workspace's owners and admins,
> not by the Company team's owners. Its first rule, that a team's last owner
> may leave it, stands.

## Who it affects

Miky is the only owner of six of Estiva's teams. Once a team's last owner may
leave it, somebody must still be able to rename it, archive it and give its
roles. An outside company learns one group of company admins: the people its
workspace marks as owners and admins, who already delete teams and keep the
company's statuses. That is how Slack, Notion and Linear treat a workspace's
own admins.

It came up at the kickoff of TEA-10 (10 Nov). The protocol pre-review found
that the 4 Nov question had not shown the workspace's own admins as an
option.

## Context

- The 4 Nov record named the Company team's owners (Estiva HQ's `kind:39001`
  owners) as who looks after a team with no owner. That question was asked
  inline, with no brief page.
- The protocol already has a company-level admin: an owner or admin of the
  workspace on the relay's roster (`kind:13534`). They delete any team
  (SPEC §3.3), remove a change for good (§6.5), and are the only people who
  write admin-only files such as the company's statuses
  ([a-file-can-say-only-admins-write-it-and-the-relay-keeps-to-it](a-file-can-say-only-admins-write-it-and-the-relay-keeps-to-it.md)).
- On production on 10 Nov, HQ's only owner is Miky. The roster's admins are
  Miky and the agent's key, plus two service keys holding owner and admin.
- When every HQ owner leaves the company, the relay keeps the first one on HQ
  as owner (TEA-7), although they can no longer write.

## Decision

- **A team whose `kind:39001` lists no `owner`** is looked after by the
  workspace's owners and admins on the relay's roster. Admins on the team do
  not change that: they keep their own rights alongside.
- **They may do what the team's own owners could**: rename it, archive or
  restore it, start its listing, give and change its roles (themselves
  included, which is how a team gets an owner again), and remove its
  members. Doing so does not add them to the team. They could already
  delete it.
- **The relay checks it** on each of those commands. **Readers count it** for
  a team's `archived` change (SPEC §3.2). A reader on a team with no owner
  takes the workspace's owners and admins from the relay-signed roster.
- The first rule of the 4 Nov record stands: a team's last owner may leave
  it, and nobody leaves the Company team.

## Rejected alternatives

- **The Company team's owners**, as recorded on 4 Nov. This gives two groups
  of company admins: HQ's owners for a team's own jobs, and the workspace's
  admins for delete, removing a change for good and the statuses. Once HQ's
  last owner leaves the company, nobody can act, and a server without a
  Company team has nobody at all.
- **The Company team's owners for everything**: also team delete, removing a
  change for good and admin-only files. It makes one group, but an
  Estiva-only one rather than upstream's relay membership. It rewrites three
  Accepted rules and has the same gap when HQ's owner departs.

## Consequences

- SPEC has one group of company admins, the one upstream relay membership
  already defines. It still works after HQ's owner leaves the company and on
  a server without a Company team.
- The server's own admin keys and the agent's key are in that group. They can
  already delete teams.
- No screen lists the workspace's admins yet.
- A reader of a team with no owner also reads the workspace roster, which
  Peek already reads for people.
- Two-way: nothing new is written.
