# A file can say that only the workspace's owners and admins write it, and the relay keeps to that, for any type

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the shaping session for "Each company sets its own statuses" (2026-10-30), on the brief "Who changes a company's statuses" ([page](briefs/who-changes-company-statuses.html)): C, an admins-only mark the relay keeps to, as recommended
- Area: Files

## Who it affects

There is no real moment yet. The first file to use it would be a company's
statuses file: only the workspace's owners and admins may change it. If
Katerina, a member, tries to change it through any app, the relay says no, and
every app shows the same statuses. Later, labels, priorities and a company's
own columns would use the same mark, and so would an outside company's own
settings files.

## Context

- [a-companys-statuses-are-its-own-layer-of-a-types-properties](a-companys-statuses-are-its-own-layer-of-a-types-properties.md)
  (Accepted 30 Oct) puts a
  company's statuses in one file per type in its Company Folder. Only the
  workspace's owners and admins on the relay's roster change it, and a change
  from anyone else changes nothing anyone sees. How that is enforced was left
  to its own decision.
- Any member may write in the Company Folder.
- The relay's member list carries each member's role, and every member can
  read it (buzz `crates/buzz-db/src/store/relay_members.rs`, ours and upstream;
  read as a member on production on 30 Oct).
- The relay refuses a new file whose id is already held, by any author
  ([a-files-id-is-unique-across-every-kind](a-files-id-is-unique-across-every-kind.md)).
  So any member can take first a file id made from a type.
- [a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md)
  (Accepted 30 Oct): the relay never refuses a save because of its type, but
  rules that are the same for every type, "the right to write there" among
  them, still refuse.

## Decision

- **A file of any type may be created with a mark saying that only the
  workspace's owners and admins write it.** The relay creates a marked file
  only for an owner or an admin, and then takes every write to it only from
  them: a change, a move, an archive or a delete. The relay checks the role when
  each write arrives, so a demoted admin's earlier changes stand, and a demoted
  admin can no longer delete the file. The mark is read only from the file's
  first record; the relay refuses it on any later change. In a shared Folder
  the host's roster counts, as for every rule the host's relay keeps
  ([a-shared-folder-lives-on-both-relays-and-its-host-runs-it](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md)).
- **A company's statuses file is created with the mark.** Apps find it by its
  type and the mark, in the Company Folder, not by an id made from the type,
  so a file a member made first cannot take its place. A file of that type
  without the mark changes nothing. If two marked files exist, the one the
  relay stored first counts, never the date its author wrote on it; an admin
  retires the other by archiving it.
- The SPEC says so in the project "Each company sets its own statuses"
  (milestone 1).

## Rejected alternatives

From the brief "Who changes a company's statuses" (30 Oct):

- **A · Do less: every app ignores changes from non-admins.** The relay
  stores anyone's change, and each app checks the member list. Turned down:
  every app, ours and an outside company's, must repeat the
  check correctly. The relay keeps ignored changes in the file's order, so the
  next admin change follows one that every app skips. The member list holds only
  today's roles, so a demoted admin's statuses would revert. And no app could
  find the file by an id made from its type, so each would have to search past
  files members made first. Undo cost: low for
  the rule, but the ignored changes stay on the relay. Build cost: low.
- **B · The relay refuses non-admins' changes to a statuses file, by type.**
  Turned down: it would supersede
  [a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md),
  and every new settings type would wait for a relay release. Undo cost:
  medium. Build cost: medium.

## Consequences

- "Only admins" holds whichever app someone uses, including one we did not
  build, and is checked once, by the relay.
- The mark stays on the file's first record for good. It is a new right that
  every Estiva relay enforces, and upstream Buzz has none unless we propose it.
- The same mark can later name a different group, such as one team, without
  changing the shape.
- The relay keeps to the mark from the project that writes the first marked
  file (the statuses editor's); until then no marked file exists, and the SPEC
  says the rule ahead of it.
