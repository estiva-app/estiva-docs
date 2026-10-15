# A reply is read only when you open its thread, not when you read the conversation it sits in

- Date: 2026-10-03
- Status: Accepted
- Decided by: Miky, in the PEE-44 kickoff session (2026-10-03), and in the CON-34 kickoff session (2026-10-05) for the reply floor
- Area: Read state

## Who it affects

When someone replies in a thread, Miky or Katerina sees it as new until they
open that thread, however far they have read the conversation around it.
Scrolling past a thread no longer marks its replies read unseen. An outside
company's app that follows the SPEC shows the same replies unread; an app that
follows plain NIP-RS shows fewer, never more.

It came up on 3 Oct, on PEE-44: "If the unread is in thread in Peek, it should
only get read when it's actually opened… In Peek only if you click on the
thread and it opens in sidebar."

## Context

Read state follows NIP-RS (SPEC §11), whose rule lets a conversation's read
marker reach every reply under it. So reading a file's conversation also read
every reply in its threads, including ones never opened. Changing the rule for
replies already on the relay would light up old threads again.

## Decision

- Reading a conversation reads its top-level messages. A reply stays unread
  until its own thread is opened (SPEC §11.3).
- The rule starts at a cut-over time, T0 (2026-10-05 19:00 UTC, fixed once).
  A reply from before T0 keeps the old rule, so nothing read before the
  cut-over lights up again.
- When a person's read-state store fills and thread marks must be dropped, a
  per-person floor (the reserved `reply-floor` context) is raised to a mark's
  time before that mark is dropped, so nothing read ever lights up again
  (SPEC §11.3, §11.6).
- This deliberately diverges from NIP-RS.

## Rejected alternatives

- **Keep NIP-RS's rule**, where reading a conversation reads every reply
  under it (what the apps did). Miky: a reply "should only get read when it's
  actually opened".
- **Apply the rule to every reply, old ones included.** Miky chose a cut-over
  date, with earlier replies keeping the old rule.

## Consequences

- Estiva's read state is no longer plain NIP-RS: a client must keep thread
  marks it would otherwise drop as covered by their conversation's marker.
- Thread marks take room in each person's read-state store, which the floor
  bounds.
- Hard to undo: T0 is a suite constant every app shares, and the marks are on
  the relay.
