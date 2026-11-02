# Everyone in the company is on the Company team's member list, and the relay keeps them there

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the kickoff session of "The SPEC says what a team, its chat, its spaces, Add on a place and following are" (2026-11-02), on the question "How is everyone in the company in the Company team?"
- Area: Folders

## Who it affects

Katerina is let into Estiva's workspace. From that moment she is a member of
the Company team in Peek, Ship, Leaf and Claude alike, and its chat, #general,
lights for her at Important like any team's chat does for its members. She
cannot leave the Company team; if #general is too loud, she sets it to Not
following. An outside company's relay gives its own people the same, from the
SPEC alone.

## Context

- [every-workspace-has-one-company-folder-the-relay-marks-and-keeps](every-workspace-has-one-company-folder-the-relay-marks-and-keeps.md)
  has the relay mark the Company Folder and keep it for good; every member of
  the workspace reads it.
- [a-team-is-the-folder-and-is-called-a-team](a-team-is-the-folder-and-is-called-a-team.md)
  makes it the Company team, and the project "Teams and following" shows it
  with everyone in the company in it. No record said how they get in.
- SPEC §11.8 calls a team's member a person on its roster (`kind:39002`); in
  an open team, a reader who has not joined is not one. On 1 Nov Estiva HQ's
  roster listed only Miky.
- The SPEC defines no list of a workspace's people that an app can read.

## Decision

- **The relay keeps everyone in the company on the Company team's roster.**
  It adds each person it lets into the workspace, and the people already in it
  when it is upgraded, as it already keeps the Company mark.
- **Nobody leaves the Company team or is removed from it** while they are in
  the company: the relay refuses a leave or a removal there. Leaving the
  company takes them off.
- **A member is one thing everywhere**: a person on a team's roster. No app
  counts someone as a member of the Company team any other way.
- **Quieting #general is your level on it**: Not following, as on any place.
- SPEC §3.4 and §11.8 carry it, in the project "Teams and following"; the
  relay work is the project's.

## Rejected alternatives

- **Apps assume it**: every app counts everyone in the workspace as a member
  of the Company team, with nothing on its roster. That is a second meaning of
  member, and it needs a list of the workspace's people that apps can read,
  which the SPEC does not define.

## Consequences

- The Company team's roster is as long as the company, and the relay writes to
  it whenever someone is let in or leaves.
- A team default on #general starts when that person was put on the roster,
  read like any join; for the people already in the company, when the relay
  first adds them.
- The relay gains rules an outside relay must follow to conform: add on
  admission, refuse leave and removal on the Company team.
