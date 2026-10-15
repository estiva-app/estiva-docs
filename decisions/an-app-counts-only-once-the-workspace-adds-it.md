# An app speaks for a file type only once the workspace has added it, and with no app added, nobody does

- Date: 2026-10-03
- Status: Accepted
- Decided by: Miky, at the kickoff of PRO-23, shaping the project "Workspace apps: the organisation decides which app owns which files"
- Area: Apps & agents

## Who it affects

Miky, as a steward, decides which apps belong to the workspace. Only those apps
name a file's type and offer "Open in …" for it, in Peek, in Ship and in every
other app. Katerina sees the same names and links Miky does, because they come
from the workspace's choice and not from whoever published last.

An outside company's app is added the same way: a steward adds its key, and
from then on its manifest counts in that workspace.

## Context

An app tells the others how to name and open its files through its manifest, a
NIP-89 `kind:31990` (SPEC §7). The workspace already keeps a roster
(`kind:13534`) with roles, which its stewards manage with `kind:9030`. The
question was who decides which app's manifest counts.

## Decision

- Stewards add an app with a new roster role, **`app`**: a `kind:9030` with
  `["role","app"]`, which puts `["member",<key>,"app"]` on the roster.
- The relay accepts a `kind:31990` only from a key with the `app` role, and
  interop reads manifests only from those keys.
- **Fail closed:** with no app added, or no roster, a file is shown as a plain
  type, with no "Open in" and no hand-off to another app.

It is carried out by the Ship issues "A steward can add an app to the
workspace, and Ship and Peek are added" (WOR-1), "Only an app the workspace
added can publish an app manifest" (WOR-2) and "A topic's app name and link
come only from an app the workspace allowed" (PRO-25), in the project
"Workspace apps: the organisation decides which app owns which files".

## Rejected alternatives

- **Give an app's key the admin role.** Too wide.
- **A steward-signed recommendation (`kind:31989`).** Ship already publishes a
  `kind:31989` for each user.

## Consequences

- Adding an app is a steward's deliberate step, and every app's manifest key
  has to be added before its "Open in" links appear.
- One rule serves people and agents: what Claude learns from apps follows the
  same list ([Claude learns each app from its manifest](claude-learns-each-app-from-its-manifest.md)).
- A screen in Estiva ID for managing the workspace's apps is a later
  milestone, not yet shaped.
- Hard to undo once apps hold the role: the role is on the roster, and every
  reader filters on it.
