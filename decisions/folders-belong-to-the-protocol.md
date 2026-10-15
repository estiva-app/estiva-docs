# Folders belong to the protocol, not to any app: every app gets the same Folder operations from SPEC

- Date: 2026-09-25
- Status: Accepted
- Decided by: Miky, on 2026-09-25 when asked whether Folder commands should be declared as app actions (MAN-3), and in the MAN-3 kickoff session on 2026-10-02 for how the operations are given
- Area: Folders

## Who it affects

Miky and Katerina see the same Folders, with the same create, rename, archive,
delete, move and conversation, in Peek, Ship and Leaf. An outside company
building an app on the protocol gets Folders out of the box: it reads one SPEC
section and can do everything Estiva's own apps do to a Folder, without
asking any app's permission or reading any app's manifest.

## Context

Every app has a folder structure. In September Folder handling was spread
across NIP-29 commands, SPEC §3, interop planners and each app's own code, and
a Folder's own conversation was declared as one of Peek's actions. While
mapping what each app declares (project "Manifests: every app declares its
actions"), the agent asked whether Folder commands should be manifest actions
too. Miky rejected the framing on 2026-09-25: "Folders are above any app", a
Nostr-for-Business thing, not Peek's or Ship's.

## Decision

- A Folder belongs to no app. It is a SPEC built-in, like the bare file (SPEC
  §3, §3.2), and no app's manifest (`kind:31990`) may claim it.
- Its operations are a fixed list in SPEC §3.3: create, rename, archive and
  restore, delete, place a new file, unlist a deleted file, move a file, start
  a conversation. Each is an ordered list of events with its refusals.
  Nothing about a Folder is declared by an app.
- `@estiva-app/interop`'s planners are the reference implementation; an app
  that does not use them produces the same events in the same order.
- Peek's `start-a-conversation` on a Folder moves out of Peek's manifest into
  the protocol.

## Rejected alternatives

- **Each app declares Folder commands in its manifest**, like its other
  actions. Miky rejected this on 2026-09-25: Folders belong in no app's
  manifest, because every app has them.

## Consequences

- A new app gets every Folder operation for free, and two apps cannot disagree
  about what a rename or a move is.
- Changing a Folder operation is a SPEC change that every app follows, not one
  app's release.
- A signing service may grant an app fewer of the Folder kinds; that app then
  offers fewer operations, never different ones (SPEC §3.3).
