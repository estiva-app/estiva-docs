# Search finds a file by the words of its current save: title first, then its summary and key, then its text, read by the format each save names, and each hit says where it matched

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the ALO-3 kickoff session, 2026-10-30, answering the six questions on the issue "Search finds a file by the words in its current version" (its `## Decided` lines), and in its review session the same day, on what a hit says when the typed words are spread over several fields
- Area: Search

## Who it affects

Miky and Katerina, once the pickers and Peek's launcher switch to it (milestone
3 of the project "A load stays the same size as edits pile up: projects"): a
project is found by any word of its description, not only its name, and a hit
found only in the text shows the words around the match. An outside company
gets the same search from the relay for its own types, and the rule for what
its saves must say for their text to be searched. The moment it came up in is
still blank: nobody has yet recorded a day they could not find a project by a
word in its text.

## Context

- The record
  [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md)
  (Accepted 2026-10-29) says search covers each file's current version only:
  title, text-valued properties and text, every word as a word start
  ([search-matches-every-word-as-a-word-start](search-matches-every-word-as-a-word-start.md)),
  under the home's read access. It left open how the relay knows which part of
  a save is words, which fields count, and how hits are ordered and explained.
- A project's text is a SPEC §13.3 block document: JSON with block ids, types
  and attributes. Indexed raw, `paragraph`, `doc` and every block id would be
  words in every project.
- SPEC §13.4 already makes a block document say so (`["content-format",
  "estiva-blocks-1"]`) and reads an unlabelled body as marker text. No app
  writes a project as an artifact yet (2026-10-30), so nothing published
  would be refused by a new rule for saves.
- Upstream Buzz already limits NIP-50 search to an artifact's current save, and
  indexes its `content` raw on a database that indexes content at all.

## Decision

- **Each save names its text's format** in `content-format`. The relay reads
  the words of the formats SPEC lists (today `estiva-blocks-1`: its text runs,
  no attributes, a mention contributing nothing). Text with no label, or a
  label the relay does not read, is not searched; **a project save with text
  and no label is refused**. Which fields of a type are text comes later from
  the app's listing, once schemas are specified and a workspace names its
  trusted apps; until then the relay has a table per type, with the project's
  entry built in.
- **The fields searched are the title, the summary and the key** (a
  project's), besides the text — not the status, the lead or archived.
- **A picker may search the list query**: the artifact query takes `search`
  with `#type`, `#h` and `omit`, so it gets small rows of one type without
  their text. The ordinary NIP-50 search keeps finding current saves too.
- **Title matches come first**, then summary and key, then text: a hit ranks
  by the best field holding a typed word.
- **Each hit says why it is there**: the relay lists every field that holds a
  typed word, best first (`"fields": ["title", "text"]` when one word is in the
  title and another only in the text), and returns the words around a typed
  word found in the text. How a row draws it is Katerina's, in the milestone-3
  story.
- **"Apps declare their types to the relay" is shaped on its own**, alongside,
  not before this search was built.

SPEC §5.2, §6.12, §6.13, §9.1 and §13.3 carry it out; the relay change is
estiva-app/buzz#39.

## Rejected alternatives

- **Index `content` as it is** (upstream's behaviour): every block id and JSON
  key becomes a word, so a two-letter search starts hundreds of false hits.
- **Decide the format by looking at the body**: §13.4 forbids it, because a
  legacy description that happens to begin with `{` is marker text.
- **An app-written plain-text field beside the text**: every app would have to
  write it, it could disagree with the text, and the save would carry the words
  twice.
- **Search the ordinary NIP-50 path only**: a picker would get whole saves,
  text included, and could not ask for one type in one Folder without text.
- **A hit names one field, the first that holds every typed word, or
  `several` when they are spread**: `several` tells a row nothing it can draw,
  and a picker would still have to guess where each word is.
- **A hit names only its best field**: a title hit whose other word is only in
  the text would hide the words that explain it.
- **Shape "apps declare their types to the relay" first**: it would hold this
  search back for a call that is wider than it; the built-in table moves into
  the listing when that call is made.

## Consequences

- A save that forgets its label loses its text from search, and for a project
  is refused, so an app finds out at once. A company with its own text format
  needs it listed in SPEC before its text is searchable.
- The relay keeps the words of each current save beside it (a column per
  head), so search never reads an old save and the index does not grow with a
  file's history.
- `match` (the fields that matched, and the words around a text match) is new wire on a
  query row; changing its shape once apps draw it is a protocol change.
- Moving the per-type field table into the app's listing later changes where
  the relay reads it, not what a person finds.
