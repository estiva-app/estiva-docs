# A space is a team's own mark on a topic it lists, so a move hands the choice to the team it moves to

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the brief "Whose space is it" ([page](briefs/whose-space-is-it.html)): C, after asking why a topic would be in two teams, which became [a-topic-lives-in-exactly-one-team](a-topic-lives-in-exactly-one-team.md) and redrew the brief
- Area: Folders

## Who it affects

Engineering marks #bug as one of its spaces, and its members and followers
follow it at Important. Someone moves #bug to Design. The move takes
Engineering's mark off with the topic; the move dialog has "Keep it a space
in Design" ticked, so in the usual case #bug is one of Design's spaces in
the same step, and Katerina and everyone in or following Design follow it
at Important. It is Design's mark, made by someone allowed to change
Design's list.

It came up on 2 Nov while shaping "Teams and following", from the protocol
pre-review of its draft, after Miky decided a team holds three kinds of
place: its chat, its spaces ("topics the team marks") and the topics it
leads.

## Context

- A topic is stored in the team it was created in for good (SPEC §3: an
  event cannot change its own `h`); a move changes only which team lists it
  (§3.1, §3.3), and a topic is listed by exactly one team
  ([a-topic-lives-in-exactly-one-team](a-topic-lives-in-exactly-one-team.md)).
  After a move, the team storing a topic and the team showing it differ.
- A change on a topic is stored with the topic (§6.2), so writing one needs
  the team it is stored in, not the team that lists it.
- A team's list is the relay-signed `kind:30890`, changed by `kind:1852`,
  which the relay accepts from anyone who may write in that team (buzz
  `nfb-demo-kinds`, `ingest.rs:630`). Every one of the 9 teams is open to
  everyone in the company, so today the two groups of writers are the same;
  they part when teams can be private.
- A private team's public front door needs its spaces to be what it lists,
  not what is stored in it (protocol pre-review, 1 Nov, F8).

## Decision

- **A team's spaces are the topics it marks on its own list.** The mark is a
  role on the team's entry for the topic in its relay-signed `kind:30890`,
  sent as a `kind:1852` `add` naming the topic with the role `space`; an
  `add` without the role unmarks it. The topic itself carries no mark.
- **Whoever may change the team's list may mark or unmark its spaces.** Who
  that is, whether everyone who may write in the team or only its members,
  is a separate product question in the same project.
- **A move drops the mark.** The move's `add` in the new team carries the
  role when the person ticks "Keep it a space in <team>", which is ticked
  when the topic was a space and the person may change the new team's list.
- **A team default from a space starts at that `add`** (the record on when a
  team's default starts reads it from there, since a list keeps no time per
  entry).
- SPEC §3.2, §3.3 and §11.8 and the KINDS rows for `1852` and `30890` carry
  it, in the project "Teams and following"; the exact tag position is SPEC
  work, since NIP-01 reads an `a` tag's third element as a relay hint.

## Rejected alternatives

- **A · "space" is about the topic, and goes with it** (a `space` change on
  the topic). Simplest to build: one field. Lost because a moved space would
  land on the new team's people with nobody there choosing it, and because
  the people who may mark it would be whoever may write where the topic is
  stored, not the team that shows it, which stops being the same group once
  teams can be private. Its marks would name no team, so after moves they
  could not be traced to the team that made them.
- **The mark on the topic, counting only for the team it is stored in.**
  After a move the storing team no longer lists the topic, so the mark
  would count for nobody and the new team could never make it a space.
  Dropped from the brief once a topic lives in one team.

## Consequences

- Every app reads a team's spaces from the list it already loads to draw
  the team, with no read of each topic's history.
- The relay changes: it copies the role onto the list entry, keeps it
  across re-adds that carry it, and may later check the sender against the
  team's members.
- A move by an app or the CLI that does not offer the tick drops the mark,
  and the topic becomes one the team leads until someone marks it again.
- Every mark names its team, so a later change of shape can rewrite marks
  without guessing.
