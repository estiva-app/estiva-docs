# A team's default starts when it reached you: the later of your joining or following the team and the place coming into it, so nothing older is unread

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline question "When a team's default starts"
- Area: Read state

## Who it affects

Katerina joins Engineering, which has had #bug for a month. #bug shows up for
her at Important with nothing unread: the month before she joined is history,
not a backlog. A week later Engineering marks a new space: it is followed
from that moment.

It came up on 2 Nov while shaping "Teams and following", from the protocol
pre-review of its draft.

## Context

- [writing-in-a-place-never-follows-it](writing-in-a-place-never-follows-it.md)
  (Accepted, 30 Oct) says following starts when you chose it, and that a
  team's default is worked out, never written. It does not say when a
  default starts, since nothing is chosen.
- Without a start, an app picks "now" or "the beginning", and on the day
  teams ship a whole team's history would light, or stay dark.

## Decision

- **A team's default starts at the later of** your joining or following the
  team and the place coming into the team (or being marked one of its
  spaces).
- **Nothing before it is unread.**
- Each start is read from what is already on the relay: the stored join or
  add event, the time kept for each team in your own list, and the event
  that put the place in the team. The project "Teams and following" checks
  that a reader can get each one before it is built on.

## Rejected alternatives

- **From when the team or place was made.** Joining an old team would bring
  months of unread.
- **From when the app first saw it.** Each app and device would disagree,
  and a missed open would move the start.

## Consequences

- Every app works out the same start from the relay, so a dot agrees across
  apps and devices.
- Leaving and rejoining a team starts it again: what was said while you were
  out is not unread.
