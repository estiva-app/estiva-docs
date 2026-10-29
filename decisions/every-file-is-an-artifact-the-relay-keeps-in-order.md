# Every file is an upstream Buzz artifact: each save is a whole copy, the relay decides which save is current, and a file's type is a name

- Date: 2026-10-29
- Status: Proposed
- Area: Files

## Who it affects

Miky and Katerina: a list (a Ship project, a Leaf Folder) loads each file as it
is now, and stays that size however many more edits pile up. When two of them
save the same page within a minute, the second save is refused as made on a
stale copy and their app merges both, instead of the newer clock silently
winning. History shows whole versions.

An outside company runs plain upstream Buzz and holds Estiva's files with no
Estiva code on its relay. An HR builder invents `acme.candidate` with Salary
band as a filterable tag and picks no number.

It came up on 29 October, shaping "A load stays the same size as edits pile up"
(initiative "Peek, Ship and Leaf are fast", step 3). Brief v1 recommended that
the relay hand back the newest change of each field. Miky asked why we don't
adopt Buzz, said not to weigh migration, and asked for one brief covering the
file model, Slack Connect and Notion-like files with their own properties.

## Context

- A file today is a root event (`30840`, `30842`, `30850`, `30851`) plus
  `kind:1851` changes, "set this field to this value", each signed by whoever
  made it. Every app folds all of them: the newest change per field wins, by
  the author's clock. A text save is a `1851` with the whole text (SPEC §6.2,
  §6.3, §6.10).
- Production, 29 Oct: 2,732 text saves, 42.0 MB, and 3,649 other changes,
  2.2 MB, across 1,163 files; growth about 13 MB a week. The newest value of
  every field is 1.5 MB, every file's newest text 5.1 MB. As whole-file saves
  the same history would weigh 53.5 MB. 62 of 6,381 changes followed a
  different person's change to the same file within 60 s, 29 of them on text.
- Upstream Buzz merged NIP-AR "Channel Artifacts" on 28 Sep (#7919): a
  `kind:45010` event per save, each a whole snapshot naming the save it was
  made on (`prev`). The relay owns identity (`(community, d)`), access (read
  and write follow the home channel's `h`) and order (a save not made on the
  current one is refused); clients own the type, a name such as `buzz.task`.
  It answers current state and history over HTTP `/query`, with exact matches
  on tags of any name, and `/count`. Moving changes the home and who can read;
  deleting is a restorable soft delete; `kind:5` is refused. Upstream uses it
  only for agent and team settings (NIP-AP, #8295).
- Our relay carries it behind an Estiva-added `artifacts` build feature, off;
  production's NIP-11 advertises none, and production holds no artifact.
  Upstream has no such switch.
- Limits: 256 tags, 128-byte tag names, 4 KB values, 64 KB of tags,
  32 predicates; pages of 1,000, offset at most 10,000; no sort, no range, no
  "changed since", and no way to leave `content` out of a current-state answer.
- The four Files records of 26 Oct chose a number per shared type, a
  relay-signed summary per file, and text in an event of its own. The Slack
  Connect record has the host's relay say yes or no to every change in a
  shared Folder.

## Decision

Proposed (the brief's recommendation, option A):

- **Every file is a NIP-AR artifact, as upstream defines it.** Its type is a
  name: a shared type carries the protocol's name (`osnova.issue`,
  `osnova.project`, `osnova.document`, `osnova.topic`), an app's own type
  carries the app's (`acme.candidate`), or it is a row of a person's database. The
  relay keeps saves in order and refuses a stale one; the app merges and saves
  again. Every save is signed by a person; the relay signs no summary.
- **Text stays in the save, and a list asks for saves without it**: a query
  option our relay adds and we propose upstream. A relay without it refuses
  the request, and the app reads whole saves.
- **Estiva ID limits which types an app or agent signs**, as it limits kinds
  today; the relay stays type-blind, as upstream.
- **A comment is a `kind:1111` naming the file's first save** (`E` = the
  `op=create` revision, `K` = `45010`). Links and mentions name the file by
  its id, as today.
- **A file's home Folder does not move for now**; where it is listed stays the
  Folder listing. Upstream's move, which changes who reads, waits for the
  navigation rework's access call.
- **A shared type belongs to the standard, not to Estiva** (Miky, 29 Oct:
  someone who builds an alternative to Ship with properties of their own
  should still write the same issue type). Shared types are `osnova.*`, named
  for the protocol, in the Osnova directory, which Estiva curates in public
  until adopters or a foundation take it over. `estiva.*` is left for what
  only Estiva's apps use, as `acme.*` is for Acme's; an app's extensions use
  its own prefix (`acme.story-points` on an `osnova.issue`). A type names one
  file (`osnova.issue`, not `osnova.issues`). A breaking change is a new name,
  and a type goes upstream once a second company uses it. The prefix is
  permanent on the wire, so the protocol's name is final before the first
  file is written (Peek topic "Osnova Application Protocol", 13 Oct: "let's
  sleep on it").
  A property anyone filters on is a tag named by its id; long text goes in the
  body; a link to many is kept on the many side.
- **In a shared Folder the host's relay orders each file's saves**; the
  partner's relay passes saves on and keeps the host's chain. A shared file
  keeps the host's id on both relays.

Supersedes in part, if accepted:
[a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)
(a number per shared type; the relay-signed summary; text in an event of its
own),
[a-files-text-is-a-readable-snapshot](a-files-text-is-a-readable-snapshot.md)
("the last save wins"),
[estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md)
(numbers and the kind registry; the directory becomes the Osnova directory), and
[a-shared-folder-lives-on-both-relays-and-its-host-runs-it](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md)
("every relay folds the same events into the same result").

## Rejected alternatives

None yet; the brief's other options, as they stand. For the shared types'
names: Estiva's own prefix (`estiva.issue`, the brief's first version) reads as
Estiva's to change and has a rival tracker write into a competitor's name; no
prefix (`issue`) leaves nobody owning the meaning. For the file model:

- **B · Artifacts' saves with a number of our own per type.** The same for
  Miky and Katerina, but our own variant of NIP-AR for good, and upstream
  relays refuse our files. It follows the Nostr community's rule, a number per
  meaning, and keeps type filtering on any relay and in live feeds; but an
  artifact needs an artifact-aware relay whatever its number, so a plain relay
  can filter the type yet not tell which save is current.
- **C · Keep field changes; the relay hands back the newest of each (do
  less).** Two-way and small to build. The newest clock keeps winning silently,
  the fold stays ours in the relay and every app, both relays in a shared
  Folder must fold identically, and a database view needs the same index
  artifacts already have, built again by us.

## Consequences

- One-way: every file and its history are re-signed as artifacts
  ([early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)).
- Lists stop growing with edits; history weighs about a fifth more and is read
  only by the History panel.
- Two people changing different fields at once collide too; the app merges
  that without asking.
- We follow a month-old draft: upstream's changes are ours to take or argue.
- A plain Nostr app sees each save as a separate post.
- It leans the navigation rework's open access call: an artifact is read by
  its home's readers, so a team or a space deciding who reads fits as it is,
  and a file deciding its own readers would need a channel per file. Upstream
  also lets whoever may post in a space edit every file homed there, which a
  front door that everyone posts in has to answer.
- A list someone curates (a topic listing files from any team) stays a list;
  a relationship a file's own editors set (an issue's project) is a tag on the
  file.
- Judged by Miky's four questions for Osnova (29 Oct): one company across all
  its apps, builders integrating with existing apps, cross-app conversations
  and workflows, and intelligence better than today's SaaS.
