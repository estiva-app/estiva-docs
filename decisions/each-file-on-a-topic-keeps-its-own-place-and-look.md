# Each file on a topic keeps its own place and look, as notes of their own beside its list entry, so two people arranging at once both keep their change

- Date: 2026-11-06
- Status: Accepted
- Decided by: Miky, in the shaping session for "Topics: level up the topic experience" (2026-11-06), on the brief "Arranging a topic's files" ([page](briefs/arranging-a-topics-files.html)): A, as recommended, after asking whether C was good enough for how rarely a topic is arranged
- Area: Files

## Who it affects

Miky drags Widgets 2 to the top of the Widgets topic while Katerina makes
Testing Widgets a card: both changes stand, the same in Peek, Ship and Leaf,
and nobody is asked. History says "moved" apart from "added".

An outside company that draws a topic's files reads two more notes per file,
of the kind it already reads for the list; without them it shows the files in
the order they were added.

It came up on 6 Nov 2026, shaping "Topics: level up the topic experience":
Miky decided a topic's files keep one order and one look (row or card), kept
on the topic, the same for everyone, and that anyone who can add a file can
arrange it. This record is about how that is kept.

## Context

- A topic keeps its list as one `kind:1851` entry per file, field
  `lists:<d>`, because anyone in the team writes the list and a whole-list
  save would overwrite someone else's (SPEC §6.14; record
  [a-topic-keeps-its-own-list-of-files](a-topic-keeps-its-own-list-of-files.md)).
  §6.14 says "No order is promised"; nothing records a row or a card.
- The fold is last write wins per field (§6.3). When the relay refuses a
  change to a field other than the text as out of date, the app sends its
  value again and "the later stands, and no one is asked" (§6.2; Miky,
  2026-10-30).
- `row` and `card` are closed widgets every app draws (§7.5).
- Nothing is arranged on production today, so nothing migrates.

## Decision

Option A of the brief "Arranging a topic's files".

The topic keeps, per listed file, two fields of its own, beside the entry that
lists it: `order:<d>`, a sort key that places the file between its neighbours
(a move writes one change, for the file that moved), and `look:<d>`, `row` or
`card`. Each is a `kind:1851` on the topic with §6.14's tags and skip rules,
including `["o",<d>]`. Then:

- `#o` "which topics list a file" folds only `lists:` fields;
- a place older than the file's newest `lists:<d>`=`true` is ignored, so a
  file taken off and put back comes back at the end;
- files with no place follow the placed ones, oldest listed first, and a
  reader that knows neither field shows that order;
- a missing look draws the manifest's widget;
- an archived topic takes no arrangement (§6.5);
- the ordering rule replaces "No order is promised" in §6.14.

Carried out by the arrangement issue of "Topics: level up the topic
experience", milestone 3: SPEC §6.14, §6.7 Changes, §6.5, §9 C31 and the
KINDS row for `1851`, an interop release and a `PROTOCOL_VERSION` bump.

## Rejected alternatives

- **B. The place and look on the file's list entry.** Every move writes the
  entry again, so history and "which topics list this file" read each move as
  an add, and those lines stay on the relay. A stale tab's move, re-sent after
  an out-of-date refusal by §6.2's rule, writes "on the list" again and puts
  back a file someone took off, unless every app adds a special case.
- **C. One arrangement for the whole topic (do less).** One value, saved
  whole on every drag: when two people arrange at once, the later save drops
  the other's change and nobody is told, unless every app learns a new merge
  rule. Files added after the last arrange, or taken off since, leave it
  stale. It is the shape §6.14 turned down for the list itself.
- **C with the move replayed.** Asked when Miky questioned whether C was good
  enough, since a topic is arranged only now and then: on an out-of-date
  refusal the app re-applies its one move or look change to the newest
  arrangement and saves again. Nothing is lost in practice, and going to A
  later would cost reading the old arrangement once. It lost because the
  safety would be a rule every app and every outside company must remember,
  where A has it in the shape, for about a day's more build. "At once" here
  means "since my tab last caught up", which can be hours on an open tab.

## Consequences

- The first order a person sets by hand in the protocol; the next
  hand-ordered list (a team's pinned files, an initiative's projects) starts
  from this shape.
- A topic carries up to three fields per file; a reader folds them in the
  same pass as the list.
- Mostly two-way: dropping the fields later loses only an arrangement, and
  apps fall back to the order added.
