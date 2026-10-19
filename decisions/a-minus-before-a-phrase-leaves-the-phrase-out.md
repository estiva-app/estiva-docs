# A minus before a quoted phrase leaves out anything with those words next to each other

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the landing session of 2026-10-19 on the issue "Search finds a file or message by part of a word" (the phrase left out, and nothing left out while its quote is still open)
- Area: Search

## Who it affects

Anyone who types into a search box in Peek, Ship or Leaf, and an outside
company that builds a relay or an app on the protocol.

It came up while landing the search rule of
[search-matches-every-word-as-a-word-start](search-matches-every-word-as-a-word-start.md).
That record has `"…"` for an exact phrase and `-word` to leave a word out, and
says nothing about putting the two together. With this decision,
`remov -"short summary"` no longer lists *Remove Short summary from few
places*, as in Gmail, while `remov -"summary short"` still does.

## Context

- Typed together, the two operators already did something, and it was the
  opposite of what the person typed: the relay and the shared matcher both
  dropped the lone `-` and read `"short summary"` as a phrase to **find**.
  Checked on production over `/query` before the fix: `remov -"short summary"`
  found only that file, and `-"short summary"` alone found two.
- Gmail and Google read `-"…"` as leaving that exact phrase out.
- A search box asks the relay as the person types, so a half-typed
  `remov -"short summ` reaches the relay before the closing quote does.

## Decision

- **`-"…"`** leaves out anything with those whole words next to each other, in
  that order, as `"…"` would find them. `-"summary short"` does not leave out
  *Short summary*.
- **A search made only of things left out finds nothing**, phrases included,
  as with `-word`.
- **While the quote after `-"` is still open, nothing is left out yet**, and
  the words after it are not words to find either: `remov -"short summ` finds
  what `remov` finds. The list narrows once the quote closes.
- It is part of the one search rule, so it reads the same over the live
  connection and HTTP, and in a reader's check of a current title.

SPEC §5.2 states it. The reference relay carries it since estiva-app/buzz#32,
and the shared matcher since `@estiva-app/conversation` 0.15.1
(estiva-app/estiva-foundation#157).

## Rejected alternatives

- **The minus ignored, and the phrase found** — how both halves read it before
  this decision, by accident. It does the opposite of what was typed.
- **While the quote is open, leave out by the words typed so far** (so
  `remov -"short summ` already drops *Short summary*). The list would shrink
  and grow back as the person types, and a phrase is not whole until its quote
  closes. Miky chose nothing left out until it does.

## Consequences

- A relay and a reader must recognise `-"` at the start of a term, apart from
  `-word` and `"…"`. One that does not finds the opposite set, so a relay that
  is behind is visible: `x -"y z"` finds only the texts holding the phrase.
- A typed `-"` with no closing quote ends the query for both the relay and the
  reader, so whatever follows it is not searched until the quote closes.
- The phrase is matched by whole words, so how a relay splits words decides
  what is left out. The reference relay keeps `0.15` and `notes.pdf` whole,
  and a phrase typed with a hyphen also needs the hyphenated word, so
  `-"short-summary"` leaves out less there than the rule says. A reader's check
  of the title still drops those hits.
