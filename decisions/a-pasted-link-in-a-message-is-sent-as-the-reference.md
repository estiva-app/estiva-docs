# A link pasted into a message is sent as Estiva's internal reference, not the link

- Date: 2026-10-13
- Status: Superseded by a-link-is-stored-as-the-url-a-person-wrote.md
- Decided by: Miky, in Peek's kickoff session for "The composer resolves a URL as you paste it"
- Area: Links & widgets

## Who it affects

Someone pastes a link to an issue into Peek's message box and sees the issue's
chip. What the message sends is the internal `nostr:naddr…` (or `nostr:nevent…`
for a message) reference, not the https link. Copying the sent message's text
gives that reference string instead of a link anyone can open. An outside
company's app reads a plain Nostr reference, with nothing of ours needed to
know what it names.

## Context

Peek's message box was learning to turn a pasted link into the chip of what it
names (peek#491). At its kickoff on 13 Oct the question was what the sent
message carries for that chip. Descriptions had not yet been asked; the next
day Miky set "a URL is the one address" for them, and the message side was
then asked again as a brief.

## Decision

A pasted chip in a message sends the `nostr:naddr…` / `nostr:nevent…`
reference, not the https URL. The same kickoff decided that only a clipboard
that is one URL becomes a chip; a pasted passage keeps its links as written.

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- The same paste stored differently in a message and in a description once the
  14 Oct description call was made, which is why it was asked again.
- Replaced on 14 Oct by
  [a link is stored as the URL a person wrote](a-link-is-stored-as-the-url-a-person-wrote.md).
  Messages already sent with a reference keep it, and readers draw both forms
  as the same chip.
