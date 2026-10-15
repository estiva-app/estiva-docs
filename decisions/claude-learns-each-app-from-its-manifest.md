# Claude learns each app from the app's own manifest, and what it must know about the app goes in a guide there

- Date: 2026-10-13
- Status: Accepted
- Decided by: Miky, in the shaping session of "Universal agent 1: Claude learns each app from the app itself"
- Area: Apps & agents

## Who it affects

When Miky or Katerina ask Claude to post in Peek or file an issue in Ship, Claude
works from what the app itself publishes, so a change to the app reaches Claude
without a new release of the agent. Between 29 September and 1 October Claude
reported posts as sent that nobody in Peek could see, because Peek had changed
what it shows and the agent's copy of Peek had not (AGE-1).

An outside company's app works with the agent the same way: it publishes a
manifest, writes its own guide, and needs nothing from Estiva's agent code.
Stage 1 serves Miky and Katerina in Claude; SPEC is written so that stage 2,
an outside builder's app, works the same way.

## Context

The agent carried a hand-written copy of each app, which drifted (AGE-1,
AGE-7), and its 24 tools cost 29,778 characters of context in every session. An
app's manifest (`kind:31990`, SPEC §7) already declares its records and
actions; what it lacked was the prose an agent needs, such as what Ship's
statuses mean or how a description is structured.

## Decision

- The agent learns each app from its manifest.
- Facts about an app go in a **`guide` field on the app's `kind:31990`**: short
  prose by the app's owner, about 4,000 characters at most, public facts only.
  It is a field of the manifest, not an event of its own. Ship writes the first
  one, and Ship's facts leave the agent's instructions for it.
- **The team's own conventions** (Progress lines, whom to mention, the assignee
  as who acts next) are not an app's facts and stay in the team's CLAUDE.md,
  until a workspace rules document in stage 2.
- **Only apps the workspace added teach Claude**: the agent reads manifests
  only from keys with the roster's `app` role
  ([an app counts only once the workspace adds it](an-app-counts-only-once-the-workspace-adds-it.md)),
  filtered on the manifest's signer inside interop, on every read path. The
  Workspace apps issues "A steward can add an app to the workspace, and Ship
  and Peek are added" (WOR-1) and "Only an app the workspace added can publish
  an app manifest" (WOR-2) are finished first, and nothing trusts other
  members' manifests in the meantime.
- **What Claude signs follows each action's shape**: a change is the owner's
  change kind on the owner's object; a creation is what the declaring
  manifest's projections say; and a comment (`kind:1111`), a deletion
  (`kind:5`), a listing in a Folder (`kind:1852`) and the protocol's built-in
  actions follow their SPEC shapes. All of it stays inside the admin's grant
  ([which kinds an agent may sign](an-agent-signs-for-an-app-only-by-an-admin-grant.md)).

The project "Universal agent 1" carries it out; it has no issues yet, pending
Miky's Intelligence layer brainstorm.

## Rejected alternatives

- **The guide as an event of its own.** The reason is not on record.
- **Trusting any member's manifest until the workspace's list of apps is
  built.** Miky chose to build the list first; the reason is not on record.
- **The team's conventions in Ship's guide.** The project's description gives
  the reason: an outside company using Ship would inherit Estiva's process.

## Consequences

- An app's owner, not the agent, is answerable for what the agent knows about
  the app.
- A guide is public, because a manifest is: nothing private or team-specific
  goes in it.
- Adding the `guide` field changes SPEC §7 for every app, so once apps publish
  guides, removing the field means every app republishing its manifest.
