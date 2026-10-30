# You are told about the files you are a member of, the same in every app, and following is retired

- Date: 2026-09-30
- Status: Accepted
- Decided by: Miky, in the CON-19 issue conversation
- Area: Read state

> Superseded in part, 2026-10-30: "Following is retired" no longer holds for
> teams and places. Following comes back for them in
> [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md).
> The old private list Peek kept per file stays retired, and the rest of this
> record stands.

## Who it affects

Miky and Katerina are told about the files they are part of: ones they
created, wrote in, were mentioned in, were assigned to, or joined, and only
about what is new since they joined. Reading a file in Ship clears it in Peek,
and the other way round. An outside company's app computes the same members
from events already on the relay, so a member in Ship is a member in its app
too.

It came up on 29–30 Sep: a message Miky had nothing to do with showed up "out
of nowhere" in Peek's Screener, being mentioned once on an issue had lit up its
whole history (PEE-35), and reading a file in Ship did not clear it in Peek.

## Context

What a person was told about came from *following* (RFC 0.4 §4.6): a private
list that only Peek kept and no other app could see or add to. On 29 Sep Miky
asked to unify it: "Originally we had similar but better concept and we should
get back to it - membership. You are member of a file (therefor) you follow it
and you get read / unread state. Every file including Ship project, issue, Leaf
document should have memebership", with triggers such as being assigned or
mentioned. The agent drafted a plan, and Miky decided its calls on 30 Sep.

## Decision

- Membership of a file decides whose unread a file's conversation is, in every
  app (SPEC §11.8). You join a file by creating it, writing in its
  conversation, being mentioned in it, being placed on it (an assignee, a
  lead), or being added or joining; you leave only by your own change.
- Membership is public, on the relay; muting is private.
- A member's unread starts when they joined.
- Agent comments count like anyone's.
- Membership grants no access (SPEC §11.8).
- Following is retired: its list is read once and never written again, and
  its files are not published as memberships, because the list was private
  (SPEC §11.8 "Following, retired").

## Rejected alternatives

- **Keep following**, a private per-app list. Ship reading a file never
  cleared Peek's dot, and a single mention lit a file's whole history.

## Consequences

- Every app that adopts `@estiva-app/conversation` gets the same unread
  without writing it.
- Who is a member of a file is visible to anyone who can read the file.
- A file someone followed by hand no longer lights until they join it.
- One-way once outside apps rely on it: membership events are public on the
  relay and every reader folds them.
