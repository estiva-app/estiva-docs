# A relay may answer when each part of a file last changed, as its own statement under the same read rules, without sending the signed changes

- Date: 2026-11-16
- Status: Proposed
- Area: Files

## Who it affects

Miky and Katerina: every app orders their topics by the last time anything
happened in them (a comment, an edit, a new issue in a listed project). Learning
those times costs about 2.2 MB of Leaf's Home as Miky (16 Nov 2026), because a
time comes only with its whole signed event: a saved text whole, an issue with
its text. An outside company: any "recently changed" list or inbox it builds
meets the same cost.

## Context

- A Nostr filter answers only whole events. No NIP-01 filter returns an event's
  time without the event, and none skips a change that saves only the text.
  The Estiva relay offers neither COUNT (NIP-45) nor NIP-77 (its NIP-11,
  2026-11-16).
- Every answer the relay gives about files is signed events, except search's
  `matches`, which the relay adds beside the signed files it found (SPEC §6.13,
  record search-finds-a-file-by-the-words-of-its-current-fields).
- The relay already holds each field's current change for every file kind
  (buzz `newest_changes`, `crates/buzz-db/src/store/fields.rs`).
- The rule for what counts as activity lives in the shared interop code
  (`packages/interop/src/activity.ts`); no record states it.
- Measured as Miky, Leaf's Home, 2026-11-16: the ordering read is 2.2 MB, of
  which 0.92 MB is issues and pages found under 27 listed files and about
  1.3 MB the newest change of about 590 files (single answers up to 0.147 MB).

## Decision

Proposed, on the brief "May the relay tell an app when things changed, without
sending what changed?" (ALO-22). Options as asked:

- **A.** The relay answers, for files picked as the list read picks them (and
  the files under a parent), when each field last changed and its change's id,
  when each was last commented on, and each found file's address, team and
  first-record time. Each time passes the same read rules as the event it
  stands for, and a text's time goes only to readers of the file's home team.
  It is the relay's statement, not signed, advertised in NIP-11, and an app
  without it reads whole events as today. The rule for what counts stays in
  the apps' shared code.
- **B.** Every answer stays signed. An issue's or page's text is written only
  as a change, never in its first record, and the existing ones are migrated.
  This saves about 0.9 MB, and the saved texts still come whole.
- **C.** Keep reading whole events and accept the cost (2.2 MB, growing). The
  ticket's Done-when is dropped.

Recommended: A.

## Rejected alternatives

None yet. On Miky's answer, the options he turns down go here, each with its
cost as the brief put it.

## Consequences

Under A: ordering costs a few KB per topic and stays there as edits pile up. A
new relay answer exists that is not signed, so nothing may be decided on it
beyond the order of a list. SPEC §6.13 gains a section on it and §6.14 the
inputs of the activity rule. Undoing it means apps dropping the read, since
nothing new is written.
