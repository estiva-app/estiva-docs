# An urgent mention is a tag beside the person's mention, and the text stays an ordinary mention

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, ruling on CON-17
- Area: Messages

## Who it affects

When Miky writes an urgent mention of Katerina, the message reaches her as
urgent, in a DM or in a file's conversation, and only for her: someone else
named in the same message gets an ordinary mention. Another company's Nostr app
that knows nothing of urgency shows the same message as an ordinary mention of
Katerina, with no stray characters.

## Context

Urgency had no wire form: Peek's composer wrote an urgent mention as an
ordinary `nostr:npub…`, so no urgent message had been urgent since 2026-09-03.
Miky found it on 24 Sep while testing CON-14 on production. An earlier ruling
(2026-07-16) had made urgency per message and per recipient.

## Decision

- An urgent mention carries `["urgent", <pubkey>]`, one per urgent recipient,
  beside that person's `p` tag. The body keeps a plain `nostr:npub…`
  (SPEC §13.1, "An urgent mention", conformance C19).
- A message is urgent for me only if it carries `["urgent", me]` and its body
  names me. Legacy `!@Name` text still reads as urgent.

## Rejected alternatives

- **A fourth field on the `p` tag.** Its positions are relay hint and petname,
  and libraries that de-duplicate tags by pubkey drop it.
- **Text `!nostr:npub…`.** Every other app shows a stray `!`, and it would be a
  private extension of SPEC §13.1's inline vocabulary.

## Consequences

- Other apps ignore the tag safely and render an ordinary mention. It has the
  same shape as Buzz's `["broadcast","1"]`.
- It cannot be filtered at the relay (multi-letter tag), so clients find urgent
  messages among those they already hold, such as what `#p` returns.
- An edit carries no `p` or `urgent` tag, so an edit cannot make a message
  urgent or stop it being urgent.
