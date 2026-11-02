# A relay advertises its list of files' newest changes on its own key, and an app uses it as soon as it is there, before the relay keeps files in order

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the ALO-7 kickoff session of 2026-11-02, answering "may an app use the relay's fast project list as soon as the relay offers it, or only from the announced switch?" (the issue "The agent reads and writes projects field by field", its `## Decided` lines)
- Area: Files

## Who it affects

Miky, Katerina and their Claude sessions: each app loads projects at the same
size as soon as that app ships its half, rather than all at once on the day the
relay starts refusing old-style changes. An outside company can run a relay
that offers the fast list without also refusing every change that names no
`prev`.

## Context

- SPEC §6.13's NIP-11 key `files: {"newest": true, "requires_prev": [...]}`
  meant two things at once: "the list read exists" and "this relay keeps files
  in order and refuses a change with no `prev`" (**the switch**).
- On production on 2026-11-02 the list read is live (estiva-app/buzz#40) while
  `files` is not advertised, because the switch waits for every app to write
  `prev`. An app that follows SPEC could not use the read it can already get.
- Search was split out the same way on 2026-11-02: `file_search` advertises the
  search read apart from the switch
  ([search-finds-a-file-by-the-words-of-its-current-fields](search-finds-a-file-by-the-words-of-its-current-fields.md)).

## Decision

- A relay whose `/query` answers `"fields": "newest"` advertises
  `"file_list": {"newest": true}` in NIP-11, whether or not it keeps any type
  in order. When it also takes `"text": true`, it says so:
  `"file_list": {"newest": true, "text": true}`
  ([opening-a-file-reads-its-current-text-not-its-history](opening-a-file-reads-its-current-text-not-its-history.md)).
- **An app reads with it as soon as it is advertised.** `files` stays the
  switch and only the switch: it says what the relay refuses, never whether
  the read exists.
- A relay advertising `files` advertises `file_list` too.

SPEC §6.13 carries it out.

## Rejected alternatives

- **One key, from the switch.** Faster loads arrive for everyone only on the
  switch day; QA could try the read only through an app-specific override; and
  an outside relay could not offer the read without the fence.

## Consequences

- Each app switches its reads on its own release and its writes on the relay's
  switch, so the two are rolled out and rolled back apart.
- Two keys to read instead of one. An app that reads only `files` still works:
  it falls back to the old read until the switch.
- Two-way: a key can be withdrawn, and every app falls back to the read every
  relay has.
