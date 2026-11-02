# An app defines the files it needs, and the workspace's owner or admin decides which apps are installed, so every Estiva app may start a file of a named type

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the /land session of ALO-11 ("The relay marks and keeps the Company Folder, and accepts a named type's first record"), 2026-11-02
- Area: Apps & agents

## Who it affects

Ship, Peek and Leaf may each start a file of a type the app defines itself: a
`kind:30852`, a named type's first record (SPEC §6.1). Miky, as the
workspace's owner, decides which apps are installed; he does not decide which
app may create which file types.

It came up on 2 Nov 2026: the relay had just started accepting a `30852`, and
Estiva ID refused it from all three apps (`422 kind_not_allowed`), because
nobody had added the kind to their lists.

## Context

Estiva ID signs for an app only the kinds on that app's credential
(`app_credentials.allowed_kinds`). Each list is written by hand in estiva-id's
`src/db/seed.ts`, kind by kind, each added for the ticket that needed it.

Every type but the four base ones (project, issue, document, topic) starts on
one shared kind, `30852`, with one `k` naming the type (SPEC §6.1). A type is
defined by an app's listing
([A type of file and its properties are defined by an app's listing or by a person's database](an-apps-listing-or-a-persons-database-defines-a-type.md)),
so an app that cannot sign `30852` cannot create a single file of a type it
defines.

## Decision

- An app defines which files it needs, and the workspace's owner or admin
  decides which apps are installed (Miky's words).
- So every Estiva app — Ship, Peek and Leaf — may sign a `30852`, all three at
  once, not only the first app that writes a named type.
- Estiva ID's seed carries the grant until an install step exists.

**Not decided here**, and asked before it is built:

- whether installing an app grants **every** kind it declares, beyond the
  files it defines (Folder commands, deletes, roster changes);
- whether that holds for an outside company's app;
- what "installed" is in Estiva ID, and how it relates to the steward's `app`
  roster role
  ([An app speaks for a file type only once the workspace has added it](an-app-counts-only-once-the-workspace-adds-it.md));
- whether a `30852` grant is narrowed to the types the app itself defines.

This record does not change what an agent may sign; that is
[Which kinds an agent may sign is an admin's explicit grant per app](an-agent-signs-for-an-app-only-by-an-admin-grant.md).

## Rejected alternatives

- **Grant `30852` to an app only when it first writes a named type.** It keeps
  each list minimal, the way every other kind was added. It was not taken
  because creating the files an app defines is what installing it is for:
  a separate grant per app would be a second step before an installed app's
  first file of its own type.

## Consequences

- Any Estiva app can create a file of a type it defines without a new grant.
- The seed's hand-written lists still stand in for an install step; when
  Estiva ID gets one, the open questions above come first.
- Two-way: a grant is a row in Estiva ID; changing it changes no event on the
  relay.
