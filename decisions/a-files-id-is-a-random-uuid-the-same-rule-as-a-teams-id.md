# A file's id is a random (version 4) lowercase uuid, the same rule as a team's id

- Date: 2026-11-24
- Status: Accepted
- Decided by: Miky, in the session shaping the project "Links" (2026-11-24)
- Area: Links & widgets

## Who it affects

An outside company building on the protocol: it generates a random uuid for
each file and keeps its own database key, time-ordered or not, as a field.

Miky and Katerina see no change: every file and every team on production
already has a random uuid.

## Context

- [A file's id is always a lowercase uuid](a-files-id-is-a-lowercase-uuid.md)
  (Accepted 20 Nov) did not say which kind of uuid.
- A team's id must be a random (version 4) uuid, and the relay advertises that
  rule. A file's id and a team's id share one id space (SPEC §6.1).
- SPEC §7.7 calls the link rule sound "because a `d` is a v4 uuid", and
  NIP-FC's example shows one. The relay's one existing check, on the bare
  file, accepted any version, the all-zero uuid included.
- Production, 24 Nov: no file id is a uuid of another version.

## Decision

A file's `d` MUST be a version 4 lowercase uuid. The relay refuses any other on
every file type, and a change aimed at one. NIP-FC and SPEC §6.1, §6.7, §6.11
and §7.7 say so. The project "Links" carries it out.

## Rejected alternatives

- **Any standard uuid.** An outside company could reuse time-ordered database
  keys as file ids. But files and teams would follow different rules, and once
  such ids are on a relay the rule can no longer be tightened.

## Consequences

- One id rule for files and teams.
- Two-way: loosening to any uuid later stays possible.
- A time-ordered key cannot be a file's id; it is a field.
