# A copy catches up a file list with NIP-77 too: the relay compares it against each file's current changes, so a reopen downloads only the files that changed

- Date: 2026-11-25
- Status: Accepted
- Decided by: Miky, in the THE-6 kickoff session of 2026-11-25 ("Peek's Desk catches up from its copy", its `## Decided` lines)
- Area: Devices & sessions

## Who it affects

Miky and Katerina: reopening Peek, and later Ship and Leaf, no longer
downloads every listed file again. Measured as Miky on 25 Nov, a reopen of
Peek's Desk with nothing new downloaded 13.8 MB once its event questions caught
up with NIP-77, and 8.0 MB of that was file lists: about 1,200 file rows at
6.5 KB each, asked again in full on every reopen. An outside company: a client
that speaks NIP-77 and SPEC §6.13 catches up a file list the same way it
catches up any other question.

## Context

- [a-copy-on-the-device-catches-up-with-nip-77](a-copy-on-the-device-catches-up-with-nip-77.md)
  chose NIP-77 for every question a copy has asked before. It was decided on
  4 Nov, before apps read files only through §6.13's list read
  (`"fields": "newest"`, every relay since 24 Nov).
- A list read is not a set of events a filter matches. The relay picks each
  file's first record and the current change of each field. A copy cannot
  work out from a filter which events that is, and the relay's NIP-77 builds
  its set from a plain filter, so today neither side can compare a list.
- §6.13's times read (`"fields": "times"`) does name each field's current
  change by its id. Its record,
  [a-relay-may-answer-when-a-file-changed-without-the-change](a-relay-may-answer-when-a-file-changed-without-the-change.md),
  allows nothing to be decided on it beyond the order of a list.
- Ship's and Leaf's copies, planned to catch up with NIP-77 from their first
  day, read mostly file lists.

## Decision

A `NEG-OPEN` may carry a list read's filter, `"fields": "newest"` with what
picks the files (§6.13). The relay builds that filter's set as the list read
would answer it: each first record and each field's current change, under the
same read rules, deleted files left out. It reconciles that set as for any
other filter. The copy holds, for a list question it cannot judge, the ids of
its last answer; it tells the relay those, fetches only what it lacks by id,
and drops what the relay no longer returns: a change that was replaced, a
deleted file, a file the person can no longer read.

Carried out in SPEC §6.13 and the relay's NIP-77, then the shared copy in
`@estiva-app/platform`, then each app.

## Rejected alternatives

- **Ask when files changed, then fetch by id.** The times read already names
  each field's current change, so a copy could fetch only the ids it lacks,
  with no relay change. Turned down: that read's record allows deciding nothing
  on it beyond order, so it would have to change; it costs about 0.7 KB a file
  on every reopen (about 0.8 MB for Miky's 1,200 rows, estimated), against a few
  KB for a reconciliation when nothing changed; and apps would keep two
  catch-ups, NIP-77 for events and times for lists.
- **Ask file lists again on every reopen.** Nothing to build, but a reopen
  with nothing new stays around 8–10 MB, the project's 2 MB target goes, and
  Ship's and Leaf's copies could not catch up their lists.

## Consequences

- One way a copy catches up, for every question in every app.
- NIP-77 on our relay takes a key no other relay knows. A client that does not
  know §6.13 never sends it, and one that does gets a refusal from a relay
  without it, then asks the list plainly. Block would not take this part; plain
  NIP-77 is still offered to them on its own.
- The relay builds a list's set per reconciliation, under the same read rules
  as the list read: one more place where who-can-read must hold.
- Undoing it means apps asking lists again, which they keep as the fallback;
  the relay key can then go.
