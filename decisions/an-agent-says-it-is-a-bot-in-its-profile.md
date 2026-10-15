# An agent says it is an agent in its own profile (NIP-24 `bot`), and Estiva ID publishes it

- Date: 2026-09-24
- Status: Accepted
- Decided by: Miky, in the session of 2026-09-24 that worked on REM-3 and EST-4
- Area: Apps & agents

## Who it affects

Miky's People list in Peek shows his colleagues, not "Claude (steered by
Miky)", "Claude (steered by Katerina)" or "PC (steered by Katerina
Kelepouri)". It came up when Peek's People list moved to the relay (REM-3) and
had to list humans only.

An outside company's app tells an agent from a person with any Nostr library,
by reading the profile, with no list kept by Estiva.

## Context

The workspace's roster (`kind:13534`) lists people and agents side by side, and
on 24 September none of their profiles (`kind:0`) carried a marker: the relay
could not tell a colleague from an agent. Estiva ID is the one place that knows
which accounts are agents (its role accounts).

## Decision

- An agent's profile carries NIP-24's **`"bot": true`**. Estiva ID adds it
  when it publishes a role account's profile, and republishes the existing ones.
- A person's profile carries no `bot` key at all.
- Apps read the marker. They never guess from the name, such as "steered by".

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- One marker, from a Nostr standard, serves every app; Peek keeps no list of
  agents of its own.
- The marker is self-declared, so SPEC uses it only for what an app shows,
  never for what someone may do.
- Two-way: Estiva ID can republish every role's profile with or without it.
