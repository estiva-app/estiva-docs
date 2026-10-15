# A person's link carries their key: /person/katerina-npub1…

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, in the workflow review session of 2026-10-14, on the brief "Person links: the person, or their handle?"
- Supersedes: person-links-name-the-handle.md
- Area: People

## Who it affects

A link to a person, in a message, an issue, a page, an email or a bookmark,
opens that person for good. Say Katerina leaves in March and a new hire picks
the handle `katerina` in June: a year-old issue that links to Katerina still
shows her, marked as left, and the new hire never inherits her links or her
mentions. If Katerina renames herself, her old links still work and show the
new name. The cost is a longer raw link outside Estiva.

An outside company's app knows who a link means without asking Estiva: any
Nostr library reads the key out of the link.

## Context

In Nostr, and in SPEC §4.1, a person is one key, and their handle is a
revocable attestation from Estiva ID: a rename or a departure frees it for
someone else. A mention inside a message already stores the key (SPEC §13.1). On 3 Oct a handle-only link was chosen
([person links name the handle](person-links-name-the-handle.md)), put as how
the link reads against a rare wrong DM. That framing did not say a handle link
would make every app that reads an old message depend on Estiva's handle
lookup for good, or that an old link would open whoever holds the handle now.
Miky was asked again on 14 Oct as a brief.

## Decision

- A person's link reads `/person/<handle>-<npub…>`, the same shape as an issue
  link: a readable part in front, which apps ignore, and the permanent part
  after it.
- Copy link gives this form, and inside Estiva it draws as the person's chip.
- Typing `/person/<handle>` still works as a shortcut to whoever holds the
  handle now. It is never stored.
- No old link ever opens a different person.

It is carried out in the project "People in Peek: open and paste a person's
link", and in SPEC by "SPEC: a person is a protocol-level object".

## Rejected alternatives

- **The handle is the address, `/person/katerina`** (the 3 Oct call). Short, but
  old links and pasted mentions move to the handle's next holder, and every
  reader must call Estiva's handle lookup on every read and still cannot tell
  whom the writer meant. Nostr's own rule for handles (NIP-05) is to follow the
  key, never the name.
- **Show the handle, store the person.** The address bar shows
  `/person/katerina`, and the app saves the key beside the link when it is
  pasted. Saved content stays right, but a link sent by email or Slack still
  drifts to the next holder, and SPEC would need a rule found nowhere else: read
  this one kind of link by the key beside it, never by the link itself. A reader
  that skips the rule draws the wrong person.

## Consequences

- Every Estiva link now names a permanent id behind a readable part. A person
  link follows the same rule as every other link: match the type, ignore the
  readable part. "A URL is the one address" holds for people too.
- Raw links to people are long.
- A handle only decides the name shown beside a key. An agent no longer needs a
  handle to be linkable; whether agents keep their own `/agent/` path is a
  separate call.
- Two-way: keys are what is stored, so the readable part can change freely.
