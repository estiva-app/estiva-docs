# A Folder two companies share is kept on both companies' relays, and the company that started it runs it; each company decides about its own people and their words

- Date: 2026-10-26
- Status: Proposed
- Area: Folders

## Who it affects

Miky shares a Folder with a partner company, Acme, much as in Slack Connect: a
Ship project, a Peek topic or a Leaf document. Miky and Katerina see it in their
own apps like any Folder, marked as shared, with Acme's people badged. Alice at
Acme sees the same Folder in Acme's apps, on Acme's relay. Each person's apps
talk only to their own company's relay. When Acme takes Alice off its roster,
she loses the shared Folder at once. When the partnership ends, each company
keeps what it holds.

For an outside company, its relay speaks one new exchange with other relays, and
its apps need almost nothing new. No partner has a shared Folder yet. The call
came from Miky's notes of 26 October: "Slack Connect for everything", one relay
per company with its apps on that relay only, and "probably a folder would
basically live on both relays".

## Context

- Every app treats its configured relay as the workspace, and lets no one pick
  another (SPEC §2). A Folder's address names its relay's key, and an app keeps
  a Folder's record and listing only when that key signed them (SPEC §3.2).
- A person has one key in every workspace, and each workspace admits them on
  its own. A leaver keeps their key (SPEC §4.1).
- The relay keeps channels and rosters per workspace, and access never crosses
  them. It has no relay-to-relay exchange. It signs every workspace with one key
  today; a per-workspace key is listed as owed in its design notes. Estiva ID
  serves one workspace, and production has one.
- [Estiva hosts the only deployment](estiva-hosts-the-only-deployment.md), so
  for now a partner is a second workspace on Estiva's deployment.
- [A file's type is a shared meaning](a-files-type-is-a-shared-meaning-any-app-extends.md)
  keeps the relay's summaries generic, so that two relays serving one Folder
  work out the same summaries without each other's schemas.
- Nostr's groups (NIP-29) belong to one relay. A group can move to a relay that
  keeps "acknowledging the same admins", or fork under other admins. Nobody has
  proposed a group run jointly from two relays. Matrix runs rooms jointly
  across servers. Faults in the rule that settles disagreements re-added people
  and reset access, and took from 2022 to August 2025 to fix (CVE-2025-49090).
  Its newest room version gives a room's creators a power nobody can lower.
- Slack Connect: one company owns the channel and alone invites or removes
  companies. Each company's retention covers its own people's messages, and
  only the sending company can edit or delete them. An invited company keeps a
  read-only copy after a disconnect. Teams shared channels: the host holds
  everything, and the partner has no audit log and no hold over its people's
  messages there.

## Decision

Proposed, as the brief "Two companies, one Folder" recommends; Miky has not
answered yet.

- **Where it lives:** each event ends up on both companies' relays, and each
  company's apps work from their own. There is no merging: a change is a signed
  event, and every relay folds the same events into the same result. The relay
  of the company that started the Folder is the host. It says yes or no to every
  change, and signs who is in and what the Folder lists. A person's app sends
  only to their own company's relay, and the relays pass each event on, so a
  lost send is filled in. A shared Folder has the host's address on every relay.
- **Who lets whom in:** anyone in the Folder can invite a person from a partner
  company, who gets in only once their company allows it. Each company takes
  out its own people; the host can take out anyone. Only the host invites
  another company. Either company can leave, and a partner that leaves keeps a
  read-only copy.
- **Whose rule a message follows:** its author's company, on every relay. Only
  the author, and later their company's admins, edit or delete it, and their
  company's retention, once there is one, applies to it on every relay. The host
  can take a person out, not delete their words.

## Rejected alternatives

None rejected yet; these are the options in the brief.

- **One copy, at the host; partners come in as guests** (Teams, XMPP group chat,
  Nostr's groups as written). The least to build in the relay. The partner
  company holds nothing and cannot export or keep its people's words. Every app
  learns to connect and sign in to other companies' relays. A leaver keeps
  their key in unless the host checks with their company every time. Easy to
  undo: copies can be added later.
- **A copy on each relay, run by both together** (Matrix). Equal standing, and
  the Folder survives either company leaving. But it needs a rule that settles
  disagreements between admins, the same on every relay, for good. Nobody in
  Nostr has proposed one. The Folder would have two addresses, and a partner's
  admin could take out the host's own people.
- **Each app sends every event to both relays, and the relays never talk**
  (Miky's version, 26 October). Each relay decides on its own who may write,
  and nothing needs merging. It is the least work in the relay, and it is
  social Nostr's way of publishing, with the group as a fork that every writer
  keeps close. But a send that lands on one relay only stays there, since a
  relay refuses an event about 15 minutes from its clock. The two companies
  then see different states for the same file, with no way to tell. Every app
  signs in to every partner's relay. A leaver's writes are taken until the
  other relay is told. A partner that joins late gets no history, and the
  Folder has two addresses. A repair between relays can be added later, which
  turns it into the decision above.
- **The host adds and removes every person** (Teams). The partner company is
  told, not asked, and can take one of its people out only by removing them
  from the company altogether.
- **The host decides about every message in its Folder** (Teams). The host's
  admins could delete a partner's words on both relays, and the host's
  retention would cover everything.
- **Each copy to itself.** Each company keeps or deletes what is on its own
  relay, and only an author's own delete travels. The two companies' records of
  one conversation drift apart.

## Consequences

- Apps stay on one relay; talking across companies is the relays' job, written
  into the Specification as an exchange between relays from the start.
- Every option needs Estiva ID to serve more than one workspace, and this one
  needs each workspace to sign with its own key. SPEC §3.2 changes so that an
  app trusts the key the Folder's address names, since a partner's relay serves
  the host's signed record.
- While the host's relay is unreachable, a partner's people can read the shared
  Folder, but their changes wait. That cannot happen while both companies are
  on Estiva's deployment.
- Only what is created in the shared Folder is shared:
  [moving a file never changes who can read it](moving-a-file-never-changes-who-can-read-it.md).
- Hard to undo once another company's relay speaks the exchange, and a copy
  given to a partner stays given. Adding joint running later would be a new
  record.
- Not decided here: direct messages between companies; whether a company may
  run its own relay, which would be a new record beside
  [Estiva hosts the only deployment](estiva-hosts-the-only-deployment.md);
  carrying on in a partner's copy after a split.
