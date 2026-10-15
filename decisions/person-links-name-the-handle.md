# A person's link names their handle: /person/katerina

- Date: 2026-10-03
- Status: Superseded by person-links-carry-the-key.md
- Decided by: Miky, in the kickoff session of "SPEC: a person is a protocol-level object" (MAN-16)
- Area: People

## Who it affects

Anyone who copies or pastes a link to a person: in a Peek message, a Ship
issue, a Leaf page, or outside Estiva. Under this call the link would have read
`/person/katerina`, and every app would open whoever holds that handle when the
link is opened.

## Context

People pages were being designed for Peek and Ship, and a person needed one
link every app opens in its own way. A mention inside a message already stored
the person's key; the link was a new thing. Miky was asked how the link should
read and what happens if a handle is given to someone new, framed as how short
the link is against a rare DM to the wrong person.

## Decision

- A person's link is `/person/<handle>`, with `/people` as the directory, and
  their Estiva ID handle names the person in it, not their key.
- A reissued handle: accept the risk. Old links follow the handle to its new
  holder.

Never built. Replaced on 14 Oct by
[person links carry the key](person-links-carry-the-key.md).

## Rejected alternatives

- **The link carries the key, `/person/katerina-npub1…`.** Recommended at
  kickoff and turned down for readability. Taken on 14 Oct instead, once the question showed what the
  handle link meant.
- **Never reissue a handle.** Recommended at the time; Miky chose to accept the
  risk instead.

## Consequences

Never in force: nothing was built on it before it was replaced. Had it shipped,
it would have been one-way: signed messages holding handle links, with no
record of who held a handle before, could not be pointed back at the person
they meant.
