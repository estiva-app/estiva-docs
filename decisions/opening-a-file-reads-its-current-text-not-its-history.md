# Opening a file reads its first record, each field's current change and its current text, never its older changes, so opening costs one text however long its history

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the ALO-7 kickoff session of 2026-11-02, answering "when Claude, Ship or Leaf opens one project or page, should it download only the text as it is now, or every version of the text ever saved?" (the issue "The agent reads and writes projects field by field", its `## Decided` lines)
- Area: Files

## Who it affects

Miky, Katerina and their Claude sessions, every time they open a project, an
issue or a Leaf page: it opens as fast after its fortieth save as after its
first. Miky said on 23 Oct that a page opens slower the more it is edited. An
outside company's app gets the same read from the relay for its own types.

## Context

- [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
  (Accepted 2026-10-30) makes a file its fields, each a line of changes, and
  the text one field, saved whole each time. SPEC §6.13's list read returns a
  file's first record and each field's current change, **except the text**: a
  row never shows it.
- Opening a file, per §6.13 before this record, read the first record and
  **every** change by `#a`, and folded them. Every text save is a full copy of
  the document (§6.10), so opening cost every text ever saved. Measured on
  production on 2026-10-29: the newest text averages 8,989 bytes and reaches
  93,635. A page saved 40 times at ~9 KB cost ~360 KB to open.
- The project "A load stays the same size as edits pile up: projects" exists so
  a load does not grow with history, and the agent, Ship and Leaf each have a
  leg that opens a file "without its old changes". Neither the list read nor
  NIP-01 can ask for "the newest change whose `field` is `description`": no
  filter reads `field`.

## Decision

- **The list read, asked for named files, may also return their text.** With
  `#d` naming the files and `"text": true`, the relay answers what the list
  read answers, plus each named file's current `description` change, whole and
  as signed, and only to a reader of the file's home, as search does. `"text"` is refused without
  `#d`: a list never carries text.
- **Opening a file is that read**: one first record, one current change per
  field and one text. An app builds its next change on the ids it read.
- **A relay without it** is read as before: every change, folded by the app.

SPEC §6.13 carries it out; the relay's half is the ALO-7 change to
estiva-app/buzz.

## Rejected alternatives

- **Read every change, as before.** No relay change, but opening a page grows
  with every save, and the "opens without its old changes" legs of the
  projects stage would have had to be loosened.
- **Apps walk back newest-first** in pages until they meet a text change. No
  relay change, but the relay orders a page by `created_at`, not by the
  trusted `ts` §6.3 folds by, so a save in the same second can be missed, and
  every app, an outside company's included, writes the same walk.

## Consequences

- Opening a file costs the same however often it was edited, and its text's
  change id is the `prev` of the next save, so a save never needs a second
  read.
- History is still all there: an Activity panel or a merge that needs an older
  text reads it by id.
- `text` is new wire on the list read; it is two-way, as a read option that
  changes nothing stored. A relay that does not know it may ignore the key,
  so an app asks for it only where NIP-11 advertises it
  ([a-relay-advertises-the-list-read-apart-from-the-switch](a-relay-advertises-the-list-read-apart-from-the-switch.md)).
