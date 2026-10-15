# A link to a file is stored as the URL a person wrote, in descriptions and in messages

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, for descriptions in the ticket session of "Choose a link's card in a description" (Widgets), and for messages in the OPT-19 kickoff session, on the brief "What a pasted link becomes in a message"
- Supersedes: a-pasted-link-in-a-message-is-sent-as-the-reference.md
- Area: Links & widgets

## Who it affects

Katerina pastes a link to an issue into a Peek message or a page description.
She sees the issue's chip. When she later copies that text into an email, the
email gets a link anyone can open, because the link is what was saved. The
same paste stores the same thing in every box, in Peek and in Ship. There is
one way to address a file: its URL. Ship no longer offers "Copy reference";
"Copy link" and the `[` and Cmd+K pickers remain.

An outside company's app sees an ordinary https link it can open, plus the
tag that says which object it names, so its "Mentioned in" works without
reading our link rules. Drawing the link as a chip does need the app's link
rules (SPEC §7.7).

## Context

A file could be addressed two ways: its URL, and Estiva's internal `nostr:`
reference. On 14 Oct, in the Widgets ticket on cards in descriptions, Miky
said: "everything should be unified about URL, so it's not confusing for users
to address the same file with different things. URL is recognizable and
understandable." That answer covered descriptions. Messages still did the
opposite: on 13 Oct Peek's message box had been set to send a pasted link as
the internal reference
([the earlier call](a-pasted-link-in-a-message-is-sent-as-the-reference.md)),
and Ship's comment box kept the link as text and did not tag it. Miky was asked
again for messages as a brief the same day (OPT-19).

The brief Miky decided on:
[briefs/pasted-link-in-a-message.html](briefs/pasted-link-in-a-message.html).

## Decision

- A link to a file stays a URL on the wire. In a description, a bare app URL is
  plain text, and with a card it is a `link` mark whose `href` is the URL
  (SPEC §13.3). It is never rewritten into a `nostr:` reference.
- In a message, in Peek and in Ship, a pasted or typed app link stays in the
  body as written, and the message carries the tag the reference would earn:
  the object's `a`, or a message's `q` (SPEC §13.1, conformance C25). Peek's
  rewrite of a pasted link into `nostr:` goes.
- Both draw as the chip of what the link names, and take a card.
- A pick from the `[` menu or Cmd+K still inserts the `nostr:` reference: those
  picks have no link to keep.
- Ship's "Copy reference" buttons are deprecated; no new "copy reference"
  affordance is added. "Copy link" is what is offered.

Carried out in OPT-19 (Ship, Peek, estiva-ui) and SPEC §13.1 / C25.

## Rejected alternatives

- **Messages store the internal reference; descriptions keep the link** (the
  13 Oct call for Peek). Same chip on screen, but copying a message's text gives
  `nostr:naddr1…` while the same paste in a description keeps the link: two
  addresses for one file, depending on the box, which is what the 14 Oct rule
  was against. Its one real advantage, that a reader needs none of our link
  rules, is already covered by the tag.
- **The internal reference everywhere, descriptions included.** One address
  again, but the hidden one; it would reverse the 14 Oct description call and
  the removal of "Copy reference".

## Consequences

- One rule everywhere: the text is what the person wrote, and the tag is the
  index machines search by.
- A chip drawn from a link relies on the app's link rules. If an app ever moved
  its domain, old links would need the old address kept as an alias; the tag
  still names the object either way.
- Mostly two-way: every sent message keeps the form it was sent with, and both
  apps' readers draw a `nostr:` reference and an app URL as the same chip, so a
  change of course only changes what the boxes write.
- Whether `[` and Cmd+K picks should also write the link is a separate,
  unasked question.
