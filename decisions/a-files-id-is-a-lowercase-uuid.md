# A file's id is always a lowercase uuid, so every file has one short link that opens it in every app; an id a person knows it by is a field

- Date: 2026-11-20
- Status: Accepted
- Decided by: Miky, in the /land session of "A random link reads back as the same file in every app" (TES-4), on the brief "A file's id and its link" ([page](briefs/a-files-id-and-its-link.html))
- Area: Links & widgets

## Who it affects

An outside company building on the protocol: an app that imports its tracker
and wants to keep `PROJ-123` as each file's id. Without a rule, its files get a
different link in each Estiva app, and some of those links open nothing.

Miky and Katerina see no change: every file Peek, Ship and Leaf make already
has a uuid id.

## Context

- A file's link ends in its id, `…/<slug>-<uuid>`, and is the same on every
  app's host ([record](a-files-path-is-the-same-on-every-apps-host.md)). SPEC
  §7.7 relies on that id being a v4 uuid, and SPEC §6.7 and §6.11 require one
  for a bare file and a document. NIP-FC, the rule an outside company reads
  first, said only that the id SHOULD be a UUID.
- TES-4's property tests (20 Nov) tried thousands of made-up ids. For an id
  that is not a lowercase uuid each app answered differently: Peek wrote a long
  link carrying the whole address, Ship a short link that opened nothing, Leaf
  its old `/f/<naddr>` link. An upper-case uuid's short link named the
  lower-cased id and opened nothing either.
- Production, read as the agent on 20 Nov: every file kind (30840, 30842,
  30850, 30851, 30852, 30890, 39000–39002) has a lowercase uuid id. Ids that
  are not uuids exist only on app settings (30078) and one app listing (31989),
  which are not files and have no link.

## Decision

A file's `d` MUST be a lowercase uuid (NIP-FC, changed in this PR). An id a
person knows the file by is a tag or a field, never the `d`. A relay MAY refuse
a file whose `d` is not one, and ours will, so an app learns the rule when it
saves rather than from links that open nothing. Every file therefore has one
short link shape, and no app writes or reads a second one for odd ids.

Building the relay's refusal, and dropping the apps' own fallbacks for odd ids,
is follow-up work on the project's Later list.

## Rejected alternatives

- **Any id, and every app writes and reads a long link for one that is not a
  uuid** (Peek's `/topic/<kind>:<pubkey>:<d>`). An outside company keeps its own
  ids, but every app owes two link shapes forever, and the tests found three
  apps getting the second one wrong three ways. Once long links sit in
  messages, they must be read forever: the hard-to-undo option.
- **Leave it until such a file exists.** Nothing to build, but the first
  outside app with its own ids finds its links open in some apps and not
  others, and a pasted one may stay a plain link.

## Consequences

- One link shape; a link reads back the same in every app.
- A generic Nostr client writing our file kinds with its own ids is refused by
  our relay once the rule is built.
- Two-way: loosening to "any id" later stays possible; tightening after odd ids
  were on the relay would not have been.
