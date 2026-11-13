# Seeing a reaction to your message is remembered under "reactions:", and opening the conversation that shows it counts as seeing it, as resting on its orange row does

- Date: 2026-11-13
- Status: Accepted
- Decided by: Miky, in ACT-7's kickoff session (2026-11-13), on two inline questions: "Opening it clears too" and "Name it reactions:", both as recommended
- Area: Read state

> Supersedes in part
> [a-reaction-is-seen-once-in-its-conversation](a-reaction-is-seen-once-in-its-conversation.md):
> its key is named `reactions:<context>` and `reactions-floor`, not
> `orange:<context>` and `orange-floor`, and opening a conversation that
> shows the reaction writes it as well as hovering. Everything else in that
> record stands: one mark per conversation, seen once everywhere.

## Who it affects

Miky and Katerina: Katerina 👍s Miky's comment on the Pricing page, listed in
the Launch topic. Miky opens the page from his Desk or in Ship, sees her 👍
under his comment, and Launch's orange dot in Peek is gone too. He does not
have to go back and rest on the row to clear something he has already seen.

An outside company's app writes a key that says what it remembers
(`reactions:`), beside `thread:`, `file:` and `msg:`, whatever colour it, or
Katerina in Peek's v1, draws reactions in. An app with no sidebar rows can
clear the reaction by showing it.

It came up in ACT-7's kickoff (13 Nov), from the protocol pre-review, before
any key was written.

## Context

- The record [a-reaction-is-seen-once-in-its-conversation](a-reaction-is-seen-once-in-its-conversation.md)
  (Accepted 10 Nov) keeps "seen" per conversation under `orange:<context>`
  and says hovering the place writes it. Its brief (call 2) weighed seen per
  topic, per conversation, or no mark at all (cleared only by opening); it
  never asked about the key's name or about clearing both ways.
- Every other prefix in SPEC §11.1 names an object or a rule (`thread:`,
  `msg:`, `file:`, `reply-floor`); none names a colour. The issue says
  Katerina may give the dot its own colour in v1.
- No `orange:` key had been written by any app on 13 Nov (none of Peek,
  Ship or Leaf accepted the prefix: `isPublishableContextId` in
  `@estiva-app/conversation` 0.40), so renaming cost nothing.
- Under the record as written, opening a file in Ship, in Leaf, or from a
  Desk link in Peek writes the file's own marker and not the reaction mark,
  so a 👍 already seen there kept the topic orange.

## Decision

- "Seen" for reactions to `P`'s messages in a conversation is kept under
  `reactions:<context>`, where `<context>` is the §11.1 context of the stream
  the reacted message is in; a trimmed key raises `reactions-floor`. The rest
  of the key's rules are the older record's.
- Two actions write it, each with the newest reaction it showed, never the
  clock: resting on (or, on a touch screen, opening) a row whose card lists
  the reaction, and opening a conversation that draws reactions to `P` under
  `P`'s messages.
- SPEC §11.1, §11.2, §11.3 and §11.6 carry it (ACT-7).

## Rejected alternatives

- **Keep `orange:` and `orange-floor`** (as the older record says). No new
  record, but an outside company writes a key named after one app's colour
  for good, and it reads wrong the day the colour changes; renaming later
  means every app reads both names forever.
- **Only resting on the row clears it** (as the older record says). After
  Miky has seen the 👍 on the page, the topic stays orange until he rests on
  its row; an app with no rows can never clear it.

## Consequences

- One reaction is seen once, wherever it was seen: a row, a card, or the
  conversation itself, in any app.
- An app that draws reactions under messages writes the mark when it opens
  a conversation, so Ship and Leaf gain a writer when they draw it (their
  project, Later).
- Two-way for the second writer (it can be removed); one-way for the name
  once written, as the older record says of its key.
