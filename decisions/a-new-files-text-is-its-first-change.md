# A new file's text is its first change, never in its first record, and the relay refuses a first record that carries text

- Date: 2026-11-18
- Status: Accepted
- Decided by: Miky, in the shaping session of "Issues stop downloading every edit" (2026-11-16: the rule for every type, old files stay, the relay refuses an issue from its switch and a new type's file at once), and in ISS-1's kickoff session (2026-11-18: a new project is refused too, from the issues switch)
- Area: Files

## Who it affects

Anyone opening a list of files in Ship, Leaf or Peek: a list carries what each
file is now, and never the words a file was first written with. An outside
company writing to the relay creates every file the same way, a first record
and then its text, and the relay tells it with a reason code when it does not.
It came up while shaping issues' move to being kept in order (16 Nov), when the
measure of what a list of issues would still carry showed most of it was old
first texts.

## Context

- A file is its fields, and its first record is written once (record
  [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)).
  A list reads each file's first record and the newest change of each field
  but the text (SPEC §6.13), so it never carries a saved text, and always
  carries the first record whole.
- Until now a new file's text was written into its first record: an issue's or
  a document's `content`, a project's `description` tag, a named type's
  `["set", "description", …]` (SPEC §6.1 as it stood).
- Measured on production, 16 Nov, as the agent: 958 issues' first records weigh
  3.29 MB, 2.42 MB of it their first texts; the newest change of every other
  field adds 1.70 MB. So a list read of issues as they are now would still be
  two-thirds old text, most of it replaced long ago. 417 of the 958 have their
  only text in the first record.
- Old first records cannot be rewritten without their text: nothing that names
  a file is re-signed, and every author's key would be needed.

## Decision

- **A new first record of every type carries no text**: no `description` tag,
  an empty `content`, no `set` of `description`. It says what the file is: id,
  type, team, title, parent, ref, key, summary.
- **The text is written straight after as its own one-field change**, `prev` the
  first record's id, never one field of a several-field change (the list read
  returns those whole). A creation action's text property is that change
  (SPEC §7.3).
- **The relay refuses a first record that carries text** with the code
  `text-is-a-change`: a named type's (`30852`) at once, and a project's or an
  issue's from the issues switch, after Ship and the agent create projects the
  new way. Documents and topics from their own switches.
- **Creating is two writes.** The app keeps the person's words and says
  "created" only when the text change is accepted, and sends the change again,
  never the first record, if it was not.
- **Old files stay as they are.** A first record written before the rule keeps
  its text, and readers take it as the text's starting value while no
  `description` change exists, the one starting-value fold every field has.

SPEC §6.1 ("A new file's text is its first change"), §6.2, §6.10, §6.11, §6.13,
§7.3, §3.3's `text-is-a-change`; issue ISS-1 in Ship.

## Rejected alternatives

- **Keep the text in the first record.** Nothing changes on the wire, but every
  list carries each file's original text for good: 3.3 MB of the 5 MB a list of
  today's issues would weigh.
- **Move old files' text out of their first records.** Would need re-signing
  every such record with its author's key, which the fields record rules out.
  Record
  [early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)
  does not require it: old first records are read by the same one starting-value
  fold every field already has (a `title` tag is read the same way), so there is
  no second reader path to keep.
- **The rule written for every type, but the relay refusing only issues and new
  types** (18 Nov, option B). Ship would keep writing a new project's text into
  its first record, the relay would accept it, and an outside builder would see
  the reference app break a rule the relay does not enforce.
- **The rule only for the types the relay refuses** (18 Nov, option C). Two
  rules for one concept, and it narrowed the 16 Nov call for every type.
- **The text as one field of the creation's several-field change.** The list
  read returns a several-field change whole, so the text would ride every list
  until the creation's other fields changed.

## Consequences

- A list of new files carries no text at all, and its size grows with files,
  never with edits.
- Creating a file is no longer atomic: for a moment readers see it with no
  text, and every writer handles a text change that did not land.
- Ship's and the agent's new project, Peek's launcher, Ship's `add-issue` and
  any outside consumer of a creation action change how they write a creation
  before the relay refuses the old shape.
- Readers keep the starting-value fold for text for good, for the older files.
- Two-way: the relay's refusal can be loosened; files written meanwhile carry
  no text in their first records, which every reader already reads.
