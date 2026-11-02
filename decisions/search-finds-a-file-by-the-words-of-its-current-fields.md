# Search finds a file by the words of its current fields: title first, then its summary and key, then its text; only for readers of its home; and the relay says beside the signed records why each one matched

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the ALO-3 kickoff session of 2026-10-30, answering the questions on the issue "Search finds a file by the words in its current fields" (its `## Decided` lines); in its review session the same day, on what a hit says when the typed words are spread over several fields; in the reshaping session for "A load stays the same size as edits pile up: projects", 2026-10-30, re-pointing search from whole saves to each file's current field values; and in the ALO-3 kickoff session of 2026-11-02, on unlabelled text, where the relay says why a file matched, removing a pasted password, and what the ordinary search finds
- Area: Search

> Supersedes in part
> [a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md):
> its rule "a save with text says its format", under which a save with text
> and no label is refused. Text with no label is now read as marker text and
> found by its words, and nothing is refused for a missing label. The rest of
> that record stands.

## Who it affects

Miky and Katerina, once the pickers and Peek's launcher switch to it (milestone
3 of the project "A load stays the same size as edits pile up: projects"). A
project is found by any word of its text, not only by its name, and a hit
found only in the text shows the words around the match. An outside company
gets the same search from the relay for its own types. Every app reading an
answer can tell what an author signed from what the relay says. The moment
this came up in is still blank: nobody has yet recorded a day they could not
find a project by a word in its text.

## Context

- [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
  (Accepted 2026-10-30) makes a file its fields, each with its own changes,
  and the text one field, saved whole. Search was first built for whole saves
  (estiva-app/buzz#39) and was then re-pointed at each file's current field
  values.
- A project's text is either a SPEC §13.3 block document labelled
  `estiva-blocks-1` or older unlabelled marker text. Measured on production on
  2026-11-02, the newest text change of 62 projects is labelled and 22 are
  not: 17 in markdown from August to October, and 5 empty. SPEC §13.4 says a
  reader accepts unlabelled text as marker text, permanently.
- SPEC §6.13's list read returns every event whole and as signed: "nothing is
  a row the relay wrote".
- SPEC §6.5 removes a change for good only by an admin, and never the current
  change of a field. So a pasted password is taken out by saving the text
  without it first.
- A project's first record may be stored workspace-wide and placed by
  `buzz-channel`, while its changes, its text included, are in its Folder.

## Decision

- **Search reads each file's current values**: its title, its summary, the
  fields its type names as words (a project's `key`), and its current text.
  Status, lead and archived are not words. A word that is only in an older
  change is never found, and neither is a deleted file.
- **Only for readers of the file's home**: its `h`, else its `buzz-channel`.
- **Title matches come first**, then the summary and key together, then the
  text, by the best field that holds a typed word.
- **The text is read by its label.** An `estiva-blocks-1` text adds the words
  of its text runs. No attributes, block ids or types add words, and a mention
  adds none. **Text with no label is marker text**, and adds its words with
  the markers taken out. Nothing is refused for a missing label.
- **Search goes through the list read** (`"fields": "newest"` with `search`),
  so a picker gets one type's files without their text. **The ordinary
  search stays as it is**: it finds a file by its title only.
- **Why a file matched goes beside the signed records, never inside them.**
  With `search`, the answer is the events as signed plus a list of matches in
  rank order. Each match lists every field that holds a typed word, best first
  (`["title", "text"]` when one word is in the title and another only in the
  text), and the words around a typed word in the text. How a row draws them is
  Katerina's, in the milestone-3 story.
- **Removing a pasted password follows SPEC §6.5**: once the text is saved
  without it, nothing finds it, and removing the earlier changes keeps it so.
- **"Apps declare their types to the relay" is shaped on its own**, alongside
  this. Until then the relay keeps a table per type, with the project's entry
  built in.

SPEC §5.2, §6.12, §6.13, §9.1 and §13.3, TYPES.md and KINDS.md carry it out.

## Rejected alternatives

- **Refuse a text change with no label** (the 2026-10-30 rule). It was written
  for whole saves, which had no unlabelled past. Under fields, it contradicts
  §13.4's permanent reading of unlabelled text, and 17 projects would not be
  found by their text until someone saved them again. An app that forgets the
  label already sees raw JSON in every reader, so it learns of the mistake at
  once.
- **Refuse new unlabelled text and read the old**: a dated rule that an
  outside company implements twice, for no gain to the protocol.
- **Index the text as it is** (upstream's behaviour): every block id and JSON
  key becomes a word.
- **Put the match on the project's first record**: the event would no longer
  be as signed. A client that caches or forwards it would store the relay's
  note as the author's, and a strict Nostr library may drop the key.
- **Let the ordinary search find a project by its text**: every app's rule
  "show a hit only if its current title has the words" would change for
  projects.
- **Scope search by where the first record is stored**: a project stored
  workspace-wide would leak its text's words to people who cannot read its
  Folder.
- **A hit names one field, or "several"**: that tells a row nothing it can
  draw.

## Consequences

- The relay keeps the words of each file's current values in its own index.
  The index is rewritten in the same transaction that accepts a change, so
  it never grows with a file's history, and a word can be found as soon as its
  change is accepted.
- `matches` is new wire on the list read. Changing its shape once apps draw it
  is a protocol change.
- A relay advertises which types it searches (`file_search` in NIP-11), apart
  from the switch, and only once every file of a type is indexed.
- Moving the per-type field table into the app's listing later changes where
  the relay reads it, not what a person finds.
