# Search matches every typed word as the start of a word; quotes ask for an exact phrase and a minus leaves a word out

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the shaping session of 2026-10-19 (every word as a word start, over any connection) and in the kickoff session of 2026-10-19 on the issue "Search finds a file or message by part of a word" (quotes and minus)
- Area: Search

## Who it affects

Anyone who types into a search box in Peek, Ship or Leaf, and an outside
company that builds a relay or an app on the protocol.

Miky hit it on 17–19 Oct, checking a page on production. Peek's search found
"sum7" but not "sum7 20" for a page called "sum7 202455", and it found
nothing for "Remov", while the `[` picker found both. In his words: "it's
annoying me".

With this decision, "Remov" and "remov short" both find *Remove Short summary
from few places*, in either word order, over the live connection and over HTTP
alike. Someone who wants exactly some words types them in quotes, and someone
who wants to leave a word out puts a minus in front of it, as in Slack, Gmail
or GitHub.

## Context

- The relay answered the same search differently depending on how it was
  asked. Over HTTP (`/query`) an app could ask for prefix mode, and only the
  last word was then matched as a prefix. Over the live connection (a NIP-01
  REQ), which Peek has used for its reads since OPT-2, every word had to be a
  whole word, and quotes, a minus and `or` worked as operators there only.
- The shared matcher the apps use on the device (`referenceMatch`) already
  accepted every word at the start of a word. The relay therefore dropped hits
  that the app itself would have shown.
- Measured on production on 19 Oct (title search, as the agent): "Remov" found
  0 files as whole words and 12 in prefix mode, and "remov short" found 0 in
  both.
- Search engines differ on prefixes. Algolia and Meilisearch match only the last
  word as a prefix by default. Matching every word as a prefix is an opt-in
  setting (Algolia's `prefixAll`, Slack's `word*`), and it is the only one that
  finds "remov short". The price is more candidates for a short query: 395 files
  for "re" on production. Ranking whole-word hits first takes care of that.
- On operators, the engines mostly agree: quotes for an exact phrase and a minus
  to leave a word out. Slack, Gmail, GitHub, Google, Algolia's advanced syntax,
  Meilisearch and Postgres's web-search syntax all have both. `OR` is less
  common. Slack leaves it out, partly because "or" is an ordinary word in a
  title.

## Decision

- **Every word a person types matches the start of a word**, in any order and
  ignoring case, unless it is in quotes or marked with a minus.
- **A word starts** at the beginning of the text, or after any character that
  is not a letter or a digit. Punctuation typed at either end of a word is
  ignored.
- **`"…"`** matches those whole words, next to each other and in that order.
- **`-word`** leaves out anything with a word that starts that way.
- **`or` is an ordinary word**, and so is a `key:value` pair.
- **It is the same rule on every connection**: a `search` in a live-connection
  REQ and one in an HTTP `/query` answer alike. No app has to ask for it, and a
  relay ignores `search_mode`.
- **A relay MUST return every event that meets the rule.** It MAY return more,
  for example by stemming words or folding accents. It SHOULD rank a hit where
  a typed word is a whole word above a hit where it is only the start of a word.
- **A reader's check of an object's current title** uses the same rule, so
  that it never drops a hit the relay found.
- Peek's launcher matches what it holds on the device (topics, people, apps) by
  the same word-start rule. It asks the relay for files and messages from the
  second letter typed. (Miky, kickoff session, 2026-10-19.)

## Rejected alternatives

- **One plain rule, with no operators.** It was the simplest grammar for an
  outside company to build. It was rejected because a person would lose
  "exactly these words" and "leave this out", which every comparable product
  offers.
- **Quotes only, with no minus.** It was the smallest grammar that still allowed
  exactness. It was rejected because "leave this out" already worked over the
  live connection, and it would have stopped working without anyone being told.
- **Quotes, minus and `OR`**, the full Google and Postgres web-search syntax. It
  was the most expressive. It was rejected because "or" appears in titles, and
  Slack leaves it out for the same reason.
- **A filter field that lets code switch back to whole words**
  (`search_mode: "word"`). It was rejected because it is a key outside NIP-01
  that other relays may refuse. It would also keep the trap that caused the
  bug: two ways of asking that answer the same filter differently.
- **Only the last word as a prefix**, the default in Algolia and Meilisearch.
  It was rejected because it cannot find "remov short", which is the case Miky
  hit.

## Consequences

- An outside relay implements one rule with a short grammar that any search
  engine already supports, and a reader's title check is a small function.
- A short query brings many more candidates. The relay's ranking and Peek's
  two-letter floor have to keep the file a person means near the top.
- The rule can be undone, because no event stores it. Removing an operator once
  agents and people rely on it costs more than adding one. Adding field
  filters such as `in:` or `from:` later is possible through NIP-50's
  `key:value`, but it would have to treat `key:value` as an operator from then
  on.
- Mid-word matches are gone from the launcher: "aud" no longer finds Claude.
