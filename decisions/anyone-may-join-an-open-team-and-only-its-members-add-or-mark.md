# Anyone in the company may join an open team; only its members add someone to it or mark one of its spaces, and the relay checks it

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline question "Who may"
- Area: Folders

## Who it affects

Katerina joins Engineering from its page without asking anyone. Once she is
in, she can add Miky to it and mark #bug as one of its spaces. Someone in the
company who is not in Engineering can join it, but cannot add other people
to it or put a space on everyone's sidebar in it.

## Context

- A team is the Folder (estiva-docs#372). Its members are the group's
  roster; NIP-29 has the person join (`9021`) and someone else add (`9000`).
  Upstream NIP-29 lets only admins add; our relay lets any member add
  (`decide_member_put`, as read by the protocol pre-review of 1 Nov).
- A space is a role on the team's own list
  ([a-space-is-the-teams-own-mark-on-a-topic-it-lists](a-space-is-the-teams-own-mark-on-a-topic-it-lists.md)),
  sent as a `kind:1852`, which the relay accepts today from anyone who may
  write in the team: in an open team, everyone in the company.
- Marking a space puts a place on every member's and follower's sidebar at
  Important, so who may do it decides who can reach a whole team.

## Decision

- **Anyone in the company may join an open team.**
- **Only a team's members may add someone to it.**
- **Only a team's members may mark or unmark one of its spaces.**
- **The relay checks both**, against the team's roster, so the rule holds for
  every app and on any company's relay. The project "Teams and following"
  carries it in its relay issue.
- Private and secret teams are the next stage, which decides who may join
  them.

## Rejected alternatives

- **Anyone in the company may do all three**, as a team's list allows today.
  Simplest, but someone outside a team could push a space onto all of it.
- **Only a team's admins add and mark**, as upstream NIP-29 has it. Tighter,
  but every team would need admins named, and adding a colleague would wait
  on one.

## Consequences

- A team's own people decide what lands on everyone's sidebar in it.
- Joining is enough to then add or mark, so in an open team the check stops
  a passer-by, not a determined colleague.
- Our relay differs from upstream NIP-29 on who may add; an outside relay
  that follows upstream lets fewer people add, never more.
