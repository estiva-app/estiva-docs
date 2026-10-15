# Edit and Delete are offered only on your own message, in every app

- Date: 2026-10-06
- Status: Accepted
- Decided by: Miky, in the SHI-29 kickoff session
- Supersedes: each-app-chooses-its-own-edit-and-delete-rule.md
- Area: Messages

## Who it affects

Miky and Katerina see Edit and Delete on the messages they wrote, and on no
one else's: not another person's, and not an agent's, such as "Claude (steered
by Miky)". The same is true in Peek and in Ship. An outside company's app
offers the two controls on the same messages, and the relay still decides.

The moment: on 30 Sep and 1 Oct Katerina, reading Folder conversations in Ship
and in Peek, met Edit and Delete on Claude's messages, "happening in Peek as
well", and the relay refused her every time (SHI-29).

## Context

The relay accepts an edit or a delete from the message's author, and from the
NIP-OA owner of an agent that wrote it. No app can tell who an agent's owner
is, because nothing a client can verify says so.

The apps had tried three rules before this one, recorded in SPEC §6.5:

- 21 Sep: Peek hid both controls on any message not the viewer's (PEE-32,
  Miky's call), while Ship offered them to everyone and let the relay refuse.
  Miky accepted both, to converge later
  ([each app chooses its own rule](each-app-chooses-its-own-edit-and-delete-rule.md)).
- 29 Sep: both apps moved, inside the shared `@estiva-app/conversation`
  package (CON-5), to "your own messages and any agent's", so an agent's owner
  kept the control. 1,181 of 2,345 messages on production were agents'.
- In use, every agent message showed Katerina two controls that could only
  fail. The owner path had been used once.

## Decision

- An app offers Edit and Delete on a message the viewer wrote, and on no
  other message, an agent's included. An app that does not know who the viewer
  is offers neither.
- Edit and Delete stay paired: an app offers both or neither (Miky, same
  session).
- The relay adjudicates whatever is offered, and an app shows a refusal in the
  relay's words.
- One function decides it for every app, `offersEditAndDelete` in
  `@estiva-app/conversation`. SPEC §6.5 ("Decided 2026-10-06") and check C14
  carry it.

## Rejected alternatives

- **Offer on any agent's message too** (the 29 Sep rule). It kept the owner's
  control and showed everyone else a control that always fails. No answer of
  Miky's to it is on record; it came in with CON-5's plan.
- **Offer to everyone and let the relay refuse** (Ship before CON-5). Never
  wrong, but most of what people saw was a control that could not work.
- **Each app picks** (21 Sep). It was the accepted state until the shared
  package gave both apps one rule.
- **Delete only, or Edit only.** Miky kept them paired.

## Consequences

- No one sees a control that the relay will refuse them, except the rare
  owner of somebody else's agent.
- An agent's owner loses the control in the apps, not the right: they can still
  edit or delete through the relay, and an agent edits its own messages.
- Showing the controls to an agent's verified owner needs ownership a client
  can verify, such as a NIP-OA `auth` tag on the agent's profile. That is a
  protocol change with its own ticket in "People at the protocol level", and
  would supersede this record.
