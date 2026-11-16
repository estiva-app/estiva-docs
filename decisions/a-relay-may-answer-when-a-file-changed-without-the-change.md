# A relay may answer when each part of a file last changed, as its own statement under the same read rules, without sending the signed changes

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the ALO-22 kickoff session of 2026-11-16, on the brief ["May the relay tell an app when things changed, without sending what changed?"](briefs/relay-answers-when-things-changed.html) (the issue "Ordering topics by activity downloads whole issues and changes to learn a time", its `## Decided` lines)
- Area: Files

## Who it affects

Miky and Katerina: every app orders their topics by the last time anything
happened in them (a comment, an edit, a new issue in a listed project). Learning
those times cost about 2.2 MB of Leaf's Home as Miky (16 Nov 2026), because a
time comes only with its whole signed event: a saved text whole, an issue with
its text. An outside company: any "recently changed" list or inbox it builds
meets the same cost, and gets this read for it.

## Context

- A Nostr filter answers only whole events. No NIP-01 filter returns an event's
  time without the event, and none skips a change that saves only the text.
  The Estiva relay offers neither COUNT (NIP-45) nor NIP-77 (its NIP-11,
  2026-11-16).
- Every answer the relay gave about files was signed events, except search's
  `matches`, which the relay adds beside the signed files it found (SPEC §6.13,
  record search-finds-a-file-by-the-words-of-its-current-fields).
- The relay already holds each field's current change for every file kind
  (buzz `newest_changes`, `crates/buzz-db/src/store/fields.rs`).
- The rule for what counts as activity lives in the shared interop code
  (`packages/interop/src/activity.ts`); no record states it.
- Measured as Miky, Leaf's Home, 2026-11-16: the ordering read was 2.2 MB, of
  which 0.92 MB was issues and pages found under 27 listed files and about
  1.3 MB the newest change of about 590 files (single answers up to 0.147 MB).

## Decision

A relay may answer, for the files a read picks (and the files under a parent),
**when each field last changed** and that change's id, **when each was last
commented on**, and each found file's address, team and first-record time —
times only, with no signed events. It is the relay's statement, not signed:

- **The same read rules.** Each time passes exactly the read rules the event
  it stands for would. A file's text time goes only to readers of the file's
  home team, as its text does (§6.13), so a time never says someone is editing
  a text the reader cannot read. A deleted file's changes stay readable by
  id, so its times are answered with its `deleted` change among them, and an
  event the relay no longer holds has no time.
- **Order only.** Nothing that decides who may do something, or what a file
  says, rests on a time from this answer; an app opens the signed event by its
  id when it needs one.
- **The rule stays in the apps.** What counts as activity (a rename does not,
  tidying does not, a comment does) is applied by the apps' shared code to the
  times; the relay answers fields and times, never "activity".
- **Advertised, with a fallback.** A relay offering it says so in NIP-11, and
  an app that finds no such read reads whole events as before.

SPEC §6.13 carries the read and §6.14 the inputs of the activity rule (ALO-22).

## Rejected alternatives

- **Every answer stays signed, and files get lighter instead.** An issue's or
  page's text would be written only as a change, never in its first record,
  and every existing one migrated (one-way). It would save about 0.9 MB, but a
  file's newest saved text still comes whole (about 1.3 MB), so ordering would
  still grow with every long text, and every app reading an issue's text from
  the issue itself would break until changed.
- **Do less: keep reading whole events and accept the cost.** 2.2 MB on Leaf's
  Home, growing with every issue filed and every long text; the device copy
  (NIP-77) would cheapen only a second open, not the first after a reload, and
  the relay does not offer it yet.

## Consequences

Ordering costs a few KB per topic and stays there as edits pile up. There is
now a relay answer that is not signed, so nothing may be decided on it beyond
the order of a list. Undoing it means apps dropping the read, since nothing new
is written to the relay; the precedent, that a relay may state facts about
events it does not send, is the part that stays.
