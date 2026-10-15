# Which kinds an agent may sign is an admin's explicit grant per app, never derived from the apps

- Date: 2026-10-13
- Status: Accepted
- Decided by: Miky, in the shaping session of "Universal agent 1: Claude learns each app from the app itself"
- Area: Apps & agents

## Who it affects

Claude may write to an app only after an admin (today Miky) grants Claude's
credential that app's kinds: one call in Estiva ID, a deliberate decision
rather than an agent release. Katerina's
agent is granted the same way, separately.

An outside company whose app joins a workspace gets the agent writing to it once
that workspace's admin grants it, not before.

## Context

Estiva ID signs for an agent through a credential that lists the kinds it may
sign, and an admin changes that list (`PATCH /admin/credentials/:clientId/kinds`
in Estiva ID). "Universal agent 1" makes the agent learn apps from their
manifests ([Claude learns each app from its manifest](claude-learns-each-app-from-its-manifest.md)),
which raised whether the signing grant should follow the manifests too.

## Decision

An agent's signing grant stays an **explicit admin grant per app**, on the
agent's credential in Estiva ID. It is not derived from the apps' manifests or
the workspace's list of apps, and the owning app does not publish the agent's
actions itself (RFC 0.4 §13.10).

## Rejected alternatives

- **Estiva ID derives the grant from the manifests or the workspace's list of
  apps.** Hands-off. The project's description gives the reason it was not
  taken: one added app would widen what every agent may sign.
- **The owning app publishes the action itself** (RFC 0.4 §13.10). It would
  remove the signing grant entirely. The project's description gives the
  reason: every app would need a server that is up, which is bigger than this
  stage.

## Consequences

- Letting the agent write to a new app is always its own step: an admin grants
  the agent that app's kinds.
- What an agent may sign never grows by itself.
- Two-way: a grant is a row in Estiva ID, and deriving it later would change no
  event on the relay.
