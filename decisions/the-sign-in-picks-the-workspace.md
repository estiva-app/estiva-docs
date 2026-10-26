# A copy of an app holds one workspace, which the sign-in picks and a company's own address picks for you; a sign-in is good for that one workspace, and a person has one name and picture in all of them

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the shaping session of 26 October, on two briefs. On "A Second Workspace" ([page](briefs/second-workspace.html)): the recommended answer to both smaller calls, and option A dropped. On "Reaching a Workspace" ([page](briefs/reaching-a-workspace.html)): C, as recommended
- Area: Protocol

## Who it affects

A second company, Acme in the briefs, gets a workspace on Estiva's deployment.
This is the first step of
[a shared Folder that lives on both relays](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md).
Alice at Acme opens Peek at Acme's own address, taps her passkey at Estiva ID,
and is in Acme. Miky and Katerina, in Estiva's workspace only, see nothing new
at `peek.estiva.app`. Someone in both workspaces is asked which one when they
sign in on the generic address, and switches by signing in again.

For an outside company, its apps still serve one workspace at a time. The one
new thing is that the relay comes from the sign-in answer, not from how the app
was built. No second company has been picked yet.

## Context

- Every app is built with one relay address, `https://estiva.estiva.app`, and
  SPEC §2 makes that relay the workspace and never a runtime choice. Peek, Ship
  and Leaf have no server: the address is built into the browser bundle only.
- The relay picks the workspace by the address it is reached at, and checks a
  connection's sign-in against that address. It refuses an event whose author
  is not the signed-in key. It signs every workspace with one key; its
  per-workspace key column is unused.
- A Folder's address names the relay's key (SPEC §3.2), so Estiva's workspace
  keeps today's key.
- An Estiva ID sign-in names the person and the app, never a workspace, and its
  renewal is tied to an app, a person and a session. Three settings bind Estiva
  ID to one workspace. Handles are kept per workspace already.
- A link names a file by its type and id, never its relay, and a reader resolves
  it on its own relay (SPEC §7.7). A shared Folder has one address on both
  relays, so a link to a shared file opens in either company.
- Slack picks the workspace from the company's address at sign-in, then shows a
  switcher with the workspace in the path. Teams takes the organisation from
  your account and reloads to switch. Linear and Notion put the workspace in
  the path with a switcher. Atlassian and Zendesk give each customer its own
  address.

## Decision

- **A running copy of an app holds one workspace:** the one its sign-in names.
  It talks to that workspace's relay until the next sign-in. A person picks a
  workspace by name at Estiva ID, which asks only when they are in more than
  one and the address did not say. Switching signs in again without the passkey
  and reloads.
- **An app is served on Estiva's generic address or on a company's own
  address** (`peek.estiva.app`, `peek.acme.com`). The company's address tells
  Estiva ID which workspace before it asks. One build serves all of them.
- **Links keep today's shape.** A link made on a company's address names that
  company by its address; a link made on the generic address does not name a
  workspace.
- **A sign-in is good for the one workspace it was made for:** Estiva ID signs a
  connection or a request only for that workspace's relay.
- **A person has one name and picture in every workspace**, set in Estiva ID;
  only the handle differs per workspace.
- **The list of a person's workspaces stays inside the identity service**; no
  app reads it.

## Rejected alternatives

- **Each workspace has its own address, and nothing else** (Atlassian,
  Zendesk; option A, dropped by Miky). Apps need nothing new, and a link names
  its workspace by its address. But a person in two workspaces keeps two tabs
  with no way to move between them, and every workspace needs its own addresses
  set up before anyone can reach it. A company's own address in the decision
  keeps A's good part.
- **One copy of an app holds every workspace you are in, with a switcher and
  the workspace in the link's path** (Linear, Notion; option B). One tab and an
  unread dot from both. But every app, an outside company's too, learns to hold
  several workspaces at once: a sign-in, a relay connection and a device copy
  for each, all live, and the identity service hands every app your list. Link
  paths change for good, and every link sent before means "Estiva" forever. A
  bug that mixes two device copies shows one company's text in the other's
  view.
- **A sign-in good for every workspace you are in.** As today: each relay's
  member list is the only wall, and a sign-in stolen from one company's app
  reaches every other workspace the person is in.
- **A name and picture per workspace** (Slack). More to edit and keep, and
  Estiva ID's profile screen gains a workspace choice. It can still be added
  later.

## Consequences

- SPEC §2 changes: an app treats the relay its sign-in names as the edge of the
  workspace until the next sign-in, and a person picks a workspace by name,
  never by typing a relay address. The token response says which relay, and
  `/sign` refuses NIP-42 AUTH and NIP-98 for any other.
- Estiva ID keeps a list of workspaces (each one's relay, handle domain,
  operator and app addresses) and who is in which, and asks "Which workspace?"
  on its own page. Letting people in, admins and invites become per workspace.
- The sign-in, its renewal and sign-out name one workspace, and a switch
  replaces them. Drafts and view settings are cleared or kept apart on a
  switch; the device copy of the relay's answers already names its relay. Every
  tab on one address shares one workspace and reloads when it changes.
- Each app shows the workspace's name and a "Switch workspace" item.
- The relay signs each new workspace with its own key; Estiva's keeps today's.
- A company's own address needs DNS and a certificate at Estiva's edge, an
  exact return address per app in Estiva ID, and a listing in the apps'
  manifests on every relay that should read its links as files. Passkeys do not
  change: they are always tapped at `id.estiva.app`.
- Someone in two workspaces sees one per address at a time and no unread from
  the other. A link made on the generic address to a file only the other
  workspace has shows "not here", and the app can offer to switch.
- A switcher across workspaces can come later on top of this; going the other
  way would have left a workspace part in every link already sent.
