# An old link shape is rewritten where it is stored and then no app reads it, and the Specification does not ask an app to keep reading links it once published

- Date: 2026-11-24
- Status: Accepted
- Decided by: Miky, in the session shaping the project "Links" (2026-11-24)
- Area: Links & widgets

## Who it affects

Miky and Katerina: the links to three Leaf pages in nine descriptions, and the
links in six comments, change to the short link and open in whichever app they
are in. An old link they kept outside the apps, in a bookmark or a pull
request, stops opening.

An outside company building on the protocol reads one link shape for a file in
the Specification, and no rule that it must keep answering every address it
ever published.

## Context

- A file has one short link, `…/<slug>-<uuid>`
  ([record](a-files-id-is-a-lowercase-uuid.md)). Two older shapes were still
  written and read on 24 Nov: Peek's long link
  `/topic/<kind>:<pubkey>:<id>`, and Leaf's `/f/<naddr>`, which Leaf used for
  every file that is not a page and declared as its "open" address. The agent
  printed that address, so `/f/` links were pasted into descriptions as late as
  19 Nov.
- Production, 24 Nov, read from the relay's database: 9 live descriptions
  (7 projects, 2 Leaf pages) and 4 live comments hold a `/f/` link, and 2 live
  comments hold the long link. All point at files with ordinary uuid ids. No
  record, document or script in the repositories holds one.
- A description can be rewritten by a change; a comment only by its author.
- SPEC §7.7 said "an app that changes its routes still has to read the links it
  published under the old ones".
- Two Accepted records pulled in different directions:
  [early shapes are migrated or deleted](early-shapes-are-migrated-or-deleted.md),
  and [an old folder link still opens the same team](a-teams-link-says-teams-and-an-old-folder-link-still-opens-it.md),
  which kept old team addresses for good on the understanding that links in
  text cannot be rewritten.

## Decision

- The stored old-shape links are rewritten once to the short link: each
  description by one change, each comment by an edit from its own author
  (Miky edits his own). Nothing is re-posted under another key.
- After that, no app reads the long link or `/f/`. A copy kept outside the
  relay stops opening. `/o/<naddr>` stays as the Specification's general form.
- The sentence in SPEC §7.7 is deleted. Miky: "We are still just in
  experimentation mode. There is no reason for others to read our old stuff."
- This is a one-time migration. A link a person writes is still stored as
  written ([record](a-link-is-stored-as-the-url-a-person-wrote.md)); no app
  rewrites links as a rule.

The project "Links" carries it out.

## Rejected alternatives

- **Keep the old shapes opening for good, as redirects to the short link** (the
  team-link pattern). Nothing breaks, bookmarks included, but each app carries
  old readers for ever, for 15 texts that can be rewritten today.
- **Remove the readers and rewrite nothing.** The least work, and 15 live texts
  would hold links that open nothing.
- **Specification: keep "keep reading old links" as the default, with "or
  rewrite every stored copy and retire the shape" as the way out.** Gives an
  outside company guidance, but writes a rule about our early experiments into
  the protocol.
- **Specification: keep the sentence as a must.** It would contradict what our
  own apps do.

## Consequences

- One link shape for a file is written and read; the shared code and the
  Specification stay short.
- Old team addresses are not affected: they keep opening for good, as their
  record says.
- The removal can be undone by adding a reader back. The rewrite adds one
  change to each of nine files' histories and marks six comments as edited.
- An outside company gets no guidance on retiring a link shape. If one asks,
  that is a new question, not this record reopened.
