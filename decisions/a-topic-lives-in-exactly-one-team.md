# A topic lives in exactly one team, and only a move changes which

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline question "One team" asked while answering the brief "Whose space is it"
- Area: Folders

## Who it affects

#bug is in Engineering. It shows in Engineering's section and nowhere else
among the teams, and when someone moves it to Design it leaves Engineering.
No team can list another team's topic beside its own. Miky, on a brief
whose example had Design listing Engineering's #bug: "Why would #bugs lives
into Teams. It should just live in Engineering. Why are you trying to have
bugs in multiple teams."

## Context

- The protocol lets any Folder list any file: a `kind:1852` `add` puts it on
  a Folder's list wherever it is stored (SPEC §3.1, §3.3), and a probe on
  30 Oct listed one project in two Folders. Nobody had asked for it, and no
  record depended on it.
- A topic shows in its team's section for the people in or following that
  team, and a team's spaces are what it marks; with two teams listing one
  topic, which team's section and whose mark would both be ambiguous.
- Where a topic is stored (its `h`) is separate and does not change: a move
  changes only which team lists it.

## Decision

- **Every topic is listed by exactly one team.** A move is the only way
  that changes, and it takes the topic off the old team's list as it puts
  it on the new one.
- Apps never offer to list a topic in a second team. SPEC §3.3 says so, and
  a reader that finds a topic on two lists draws it in the one it was added
  to last.
- A private team's public front door is unaffected: that topic is stored
  where everyone can read it and listed by its one team.

## Rejected alternatives

- **One team for every file, Ship issues and Leaf pages included.** Offered
  as the wider rule in the same question; Miky chose topics only.

## Consequences

- "Which team is this topic in" always has one answer, for its section, its
  spaces and its team default.
- Whether the relay itself refuses a second listing is the build's call;
  until it does, the rule is the apps' and readers'.
- Other files may still be listed by more than one Folder; a later stage
  can extend the rule.
