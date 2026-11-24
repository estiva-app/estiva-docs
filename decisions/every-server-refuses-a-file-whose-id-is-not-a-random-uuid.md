# Every server that speaks the protocol refuses a file whose id is not a random uuid, not only ours

- Date: 2026-11-24
- Status: Accepted
- Decided by: Miky, in the kickoff session of "The relay refuses a file whose id is not a lowercase uuid, and the Specification says so" (project "Links"), on the protocol pre-review's question, option A as recommended
- Area: Links & widgets

## Who it affects

An outside company that runs its own server: to count as compatible, it
refuses a file whose id is not a random (version 4) lowercase uuid, and a
change aimed at one, with the reason code `bad-file-id`. It adds one check.

An outside company that builds an app: it never meets a file with an odd id
on any compatible server, so it writes and reads one link shape and keeps no
fallback.

Miky and Katerina see no change: no file on production has an odd id.

## Context

- [A file's id is always a lowercase uuid](a-files-id-is-a-lowercase-uuid.md)
  (20 Nov) and NIP-FC said a server MAY refuse a file whose id is not one,
  "and ours will". [A file's id is a random (version 4) lowercase uuid](a-files-id-is-a-random-uuid-the-same-rule-as-a-teams-id.md)
  (24 Nov) said "the relay refuses any other", without saying which servers.
- SPEC §9.2 lists what every server does (R1–R9); one that does not is not
  compatible. §6.13 says the same for every file type.
- If only our server refuses, a partner's server in a shared team can still
  hold an odd-id file, and each app needs a rule for showing it. On 20 Nov the
  three apps did three different things with one (TES-4).
- Production, 24 Nov: 0 files with an odd id.

## Decision

Every server that speaks the protocol refuses a file event of a file type
(§6.1's table and `kind:30852`) whose `d` is not exactly one version 4
lowercase uuid, and a change or list entry aimed at one, with
`invalid: bad-file-id: <sentence>` (§3.3). It is SPEC §9.2's R10 and a line in
§6.13's list. NIP-FC, the general convention, keeps "a relay MAY refuse"; the
Osnova Specification makes it a MUST. This narrows the 20 Nov record's "a
relay MAY refuse … and ours will" for Osnova servers; the rest of that record
stands.

## Rejected alternatives

- **Only ours refuses, and the Specification tells apps to hide a file whose
  id is not a random uuid.** An outside server keeps its freedom, but its
  odd-id files go silently missing in our apps: a save that looks accepted
  and is never seen.
- **Only ours refuses, with no rule for apps.** No build, but each app again
  does its own thing with such a file, the split the 20 Nov tests found.

## Consequences

- No app keeps a second link shape or a fallback for odd ids, on any
  compatible server.
- An outside server must implement the check to be compatible.
- Two-way while no odd ids exist anywhere: loosening it later stays possible.
  Once a partner's server held odd-id files that apps show, tightening would
  make them stop opening; this rule avoids that by never letting them exist.
