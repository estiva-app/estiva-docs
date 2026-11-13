# A reaction to your message is seen once, in the conversation it is in, so hovering an orange dot clears it in every topic, on the Desk and in every app

- Date: 2026-11-10
- Status: Accepted
- Decided by: Miky, in the shaping session of "Activity indicator on each topic and team" (2026-11-10), on the brief "Reactions turn orange" ([page](briefs/reactions-turn-orange.html)), call 2: B, as recommended
- Area: Read state

> Superseded in part, 2026-11-13: the key is named `reactions:<context>` and
> `reactions-floor`, and opening a conversation that shows the reaction writes
> it as well as hovering, in
> [reactions-seen-is-kept-under-reactions-and-opening-it-sees-it](reactions-seen-is-kept-under-reactions-and-opening-it-sees-it.md).
> Everything else stands as this record says.

## Who it affects

Miky and Katerina: a page listed in two topics they follow and on their Desk
gets a 👍 on their comment. Hovering one topic's orange dot clears that
reaction in the other topic, on the Desk row and on the page in Ship too.
Listing an older page into a new topic does not bring back reactions they
already saw. An outside company's app that shows the page, with or without
topics, can draw and clear the same orange.

It came up shaping "Activity indicator on each topic and team" on 10 Nov,
whose first version says "hovering clears an orange dot but not a blue one"
(the Initiative, "First version of the details"). It was asked on the brief
[Reactions turn orange](briefs/reactions-turn-orange.html), call 2, and Miky
answered B.

## Context

- Unread state is kept per conversation: a file's stream (`file:<d>` or its
  address), a team's chat (the bare channel uuid), a reply under its root
  (SPEC §11.1). It is never keyed by a place's id (record
  [a-files-unread-state-is-keyed-file-and-its-id](a-files-unread-state-is-keyed-file-and-its-id.md)).
  So reading is once, everywhere.
- Read state is one per-person blob that only grows, merged across apps and
  devices; a key once written stays in every copy (§11.4, §11.6). What
  "seen" remembers is therefore hard to change once written.
- The Desk's rows carry their own dot (Miky, 31 Oct, Navigation's Decided
  lines), and a Desk row is a file, not a place.

## Decision

- "Seen" for a reaction is kept per conversation, under
  `orange:<context>`, where `<context>` is the §11.1 context of the stream the
  reacted message is in (`orange:file:<d>`, `orange:<file address>`,
  `orange:<channel uuid>`); a reaction on a reply counts in its root's stream.
- A place is orange for `P` when any conversation it shows `P` at `P`'s level
  holds a reaction to `P`'s message newer than that conversation's `orange:`
  key. Hovering the place writes, for each conversation its hover listed, the
  newest shown reaction's `created_at`, never the clock.
- With no key, orange counts from the later of `P`'s start in the place and a
  suite-wide start date, so no backlog lights. When the blob is full, a
  trimmed `orange:` key raises `orange-floor`, as `reply-floor` does (§11.6).
- SPEC §11.1, §11.6 and §11.8 carry it.

## Rejected alternatives

- **A: seen per topic.** Each topic remembers its own "seen" time, so
  hovering one clears only that one. The same 👍 is cleared again in each
  topic that lists the page; listing an older page into another topic lights
  its old reactions as if new; the Desk's file rows and Ship's issue page have
  no mark to draw orange from, and an app with no topics has nothing to read
  or clear. It also keys read state by a place, which the file-key record
  rules out. Its undo cost is as high as B's: the marks are merged into
  everyone's read state.
- **C: no "seen" at all; orange clears only when the conversation is
  opened**, as blue does. Nothing new is written, but it reverses the first
  version, "hovering clears an orange dot but not a blue one", makes orange
  behave like blue, and "a 👍 you have no reason to open stays orange until
  you go and look at it anyway".

## Consequences

- One reaction is seen once, everywhere it shows, by one rule any app applies
  to the conversation it already draws.
- A hover may write several keys at once, so the blob grows faster; the
  `orange-floor` keeps a trim from bringing old orange back.
- One-way: `orange:` keys stay in every person's read state; changing the
  keying later means every app reading both shapes.
