# An app declares the kinds it writes, and an owner or admin installing it grants them

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the /land session of ALO-11 ("The relay marks and keeps the Company Folder, and accepts a named type's first record"), 2026-11-02
- Area: Apps & agents

## Who it affects

Miky, as the workspace's owner, decides which apps are installed; he does not
decide, kind by kind, what each installed app may write. Ship, Peek and Leaf
may each write the files they need, a file of a type the app defines itself
(`kind:30852`) included, because they are installed.

An outside company's app gets the same: it says which kinds it writes, and once
a workspace's owner or admin installs it, Estiva ID signs those kinds for it.
Nobody at Estiva has to add its kinds by hand.

It came up on 2 Nov 2026: the relay had just started accepting a `30852`, and
Estiva ID refused it from all three apps (`422 kind_not_allowed`), because
nobody had added the kind to their lists.

## Context

Estiva ID signs for an app only the kinds on that app's credential
(`app_credentials.allowed_kinds`). Until now each list was written by hand in
estiva-id's `src/db/seed.ts`, kind by kind, each with a comment saying which
ticket needed it; six times a kind was added only after `/sign` had refused a
feature that looked finished.

The workspace already decides which apps count: an owner or steward adds an
app's key with the `app` role, and only then does its manifest count
([An app speaks for a file type only once the workspace has added it](an-app-counts-only-once-the-workspace-adds-it.md)).
A file of a named type is a `kind:30852` with one `k` (SPEC §6.1), defined by
an app's listing ([A type of file and its properties are defined by an app's listing or by a person's database](an-apps-listing-or-a-persons-database-defines-a-type.md)),
so a type an app defines is only usable if the app may sign `30852`.

## Decision

- **An app defines which files it needs**: it declares the kinds it writes.
- **The workspace's owner or admin decides which apps are installed**, and
  installing an app grants it the kinds it declares. Nobody grants an
  installed app's kinds one by one.
- Every Estiva app (Ship, Peek, Leaf) may sign a `30852`. Until Estiva ID has
  an install step, its seed stands in for "the app declares, the owner
  installs": each app's list there is what that app declares.

Not decided here: where an app declares its kinds (its manifest or a field of
its Estiva ID registration), and whether a `30852` grant is narrowed to the
types the app defines. An agent's grant is unchanged
([Which kinds an agent may sign is an admin's explicit grant per app](an-agent-signs-for-an-app-only-by-an-admin-grant.md)):
it covers what an agent signs for an app, not what the app signs for itself.

## Rejected alternatives

- **An admin grants each app each kind, as the seed does today.** It puts a
  per-kind call on the owner that he cannot judge better than the app's
  author, and it fails late: every missing kind so far was found by a refusal
  after the feature was built.
- **Grant `30852` to no app until a type needs it.** It keeps the list
  minimal, but a type an app defines would then need a second, separate step
  before its first file can be saved, which is the failure above again.

## Consequences

- Installing an app is the one decision about what it may write. An app that
  declares a new kind writes it in the next release, with no grant in between.
- The seed's hand-written lists are a stand-in: Estiva ID needs an install step
  that reads an app's declaration and sets its credential's kinds. Until then a
  new kind is still added to the seed with the change that needs it.
- What an installed app may write grows when the app does. The check on that
  is the install: an owner or admin who does not trust an app does not install
  it.
- Two-way: a grant is a row in Estiva ID; changing how it is set changes no
  event on the relay.
