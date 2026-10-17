# Where a link sits decides how it draws, and one file's card is added under a message: a link on words counts as naming its file

- Date: 2026-10-17
- Status: Accepted
- Decided by: Miky, in the `/land` session of WBM-5 (*Widgets 2: build 1 — messages*, 17 Oct), and his merge of this record
- Supersedes: where-a-link-sits-and-which-file-gets-the-card.md
- Area: Links & widgets

## Who it affects

When Miky or Katerina write `the plan is [these words](<an issue's URL>) for
now` in a message, the words stay a link where they were written, and the
issue's card is added under the message as it would be for the bare URL. The
rule for the one card counts files, not links: when a message names exactly
one file, however the link to it is written, that file gets the card, and ✕
removes it as before; with two or more files, none does. An ordinary web link
changes nothing. A comment that chose a card for a file it links on words
draws that card again.

The moment: Miky, 17 Oct, reviewing the link rules while Ship's comments moved
to the shared kit (estiva-app/estiva-ship#312). Since `@estiva-app/protocol`
0.39.0 a link on words named no file, so it could never get the card, and old
comments that had chosen a card on words lost it in Peek and in Ship.

An outside company's app counts one more kind of link when it reads which
cards a message draws and when it adds the default; it writes nothing new,
since a writer already tags the file a link on words names (§7.7, §13.1).

## Context

where-a-link-sits-and-which-file-gets-the-card.md (Accepted 2026-10-16) says
what counts toward "one file" is "a file named by a reference or an app URL".
It never excluded a link on words; `@estiva-app/protocol` 0.39.0's code and
tests did. Its `valuesIn` resolves only a bare URL, so `[words](url)` named
nothing for `cardsIn` and `defaultCardOf`, and a card chosen for it drew
nothing. Meanwhile the mention index counted it: §6.4 and §13.1 tag every app
URL a body holds, and Peek and Ship both write the file's `a` for a link on
words. "The body names `V`" meant two things. On 17 Oct Miky settled it as one:
a link's target names what it links to, and its words name nothing.

A decided record is never rewritten, only superseded (`README.md`), so this
record carries the whole call as it now stands.

## Decision

Everything in where-a-link-sits-and-which-file-gets-the-card.md holds, with
this call (Miky, 17 Oct):

- **A link on words names its file for the card.** The target of a link on
  words that names a file by §7.7 counts toward "one file", is a value a card
  under the message may be drawn for, and gets the default card when it is the
  message's only file. Its label never names anything, a URL written in it
  included.
- **It still draws as its words.** A link on words is never a chip or a row,
  alone on its line too: the words stay where they were written, and the card
  goes under the message.
- **Files are counted, not links.** A web link, or an app URL that resolves to
  nothing, does not count, so it neither adds a card nor takes one away.

## Rejected alternatives

- **A link on words names nothing** (protocol 0.39.0's reading). Whoever
  chooses words for a link could then never get its file's card, though the
  link names the same file as the bare URL, and old comments that chose a card
  on words lose it.
- Everything where-a-link-sits-and-which-file-gets-the-card.md rejected stays
  rejected.

## Consequences

- SPEC §13.6.2 and conformance C20, C25, C26 and C27 say a link on words
  counts; `valuesIn` in `@estiva-app/protocol` resolves a link's target
  whatever its words, and Peek and Ship take it by a version bump, with no
  drawing change. The composers that add the default card (Widgets 2, build 1)
  count with `valuesIn`, so they inherit it.
- Undoing it is a SPEC change and a protocol release; no event is rewritten,
  since it is a reading rule and the writer's choice of today's `embed` tag.
- Once Accepted, the `why:` pointers in `@estiva-app/protocol`, Peek and Ship
  that name where-a-link-sits-and-which-file-gets-the-card.md move to this
  record.
