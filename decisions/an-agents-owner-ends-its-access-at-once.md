# The person an agent works for can end that at once, and the relay cuts the agent off

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the session landing Ship issue fd9fd483 on 2026-10-27, on the brief "Agents, Folders, deletes"
- Area: Apps & agents

## Who it affects

Katerina stops using a Claude she set up, or hands its key to someone else.
She signs "this agent no longer works for me" (an admin can sign it too), and
from that moment the Claude reaches none of her Folders, on every app and
every server. It keeps its own workspace seat and any Folder it was added to
directly, as when its owner is removed from the workspace.

For an outside company, it is the same promise the protocol makes about
people: one action, effective at once, enforced by the relay, with no window.

## Context

An agent reaches its owner's Folders because the relay records whom it works
for when it first signs in with its owner's signed permission. Upstream Buzz
records that link the same way. The question of how the link ends came out of
the security review of the relay catch-up, as the agent counterpart of
[Someone you remove loses access the moment the removal
lands](someone-you-remove-loses-access-at-once.md), and was asked as a brief
with three options.

## Decision

The owner, or an admin, ends an agent's link with a signed event, and the
relay drops the link and closes the agent's connections everywhere at once.
The agent keeps its own seat and what it was added to directly. Estiva ID,
which signs for Katerina today, is where she does it.

It is a new piece of the protocol, so it is built as its own project: the
relay, Estiva ID and SPEC together. It was decided on the Ship issue
[Our relay runs current upstream Buzz](https://ship.estiva.app/issue/fd9fd483-08f8-4ede-ad4c-790189f4160b).

## Rejected alternatives

- **Keep the link permanent and let an admin's ban end it**, written into the
  spec. A ban also stops the agent's own seat and everything it was added to,
  it needs an admin, and a company's people could not cut off their own agent.
- **Permissions that expire and are renewed** (say every 30 days by Estiva
  ID). Access would last until the permission ran out, the kind of window
  Miky turned down for people on 14 Oct, and if Estiva ID were down at renewal
  every agent would lose access.

## Consequences

- A new event every Nostr-for-Business relay must honour; once outside apps
  rely on it, its shape is costly to change.
- Estiva ID gains a "Disconnect this agent" action, effective at once.
- A link ended by mistake needs a fresh permission and a fresh sign-in.
