# An agent's profile says, signed by its owner, whose agent it is, and a message by your own agent counts as your own

- Date: 2026-11-09
- Status: Accepted
- Decided by: Miky, in the PEE-79 kickoff session, on the brief "Whose agent is it" ([page](briefs/whose-agent-is-it.html))
- Area: Apps & agents

## Who it affects

Katerina's own Claude posted an untagged update on a Ship issue she is a
member of (3 Nov), and her Peek Screener showed it as news from someone else.
On 4 Nov Miky answered in the issue's conversation that your own Claude's
messages skip your Screener, like your own messages do (PEE-79).

With this record, Katerina's Claude's messages are quiet for Katerina and still
news for Miky, in every app. An outside company's app tells "my agent" from "a
colleague's agent" by checking one signature on the agent's profile, with any
Nostr library and no list kept by Estiva.

## Context

- Estiva ID signs an owner proof (NIP-OA, `["auth", owner, conditions, sig]`,
  signed by the owner's custodied key over a statement naming the agent's key):
  `estiva-id src/nostr/nip-oa.ts`.
- The agent sends it only as a request header to the relay (`x-auth-tag`,
  `estiva-agent lib/agent/credentials.ts`). The relay records the owner
  server-side (`users.agent_owner_pubkey`) and uses it to accept an owner's
  deletion. No event carries it and no route returns it (SPEC §6.5).
- So no app could tell whose agent wrote a message, and the name ("steered by
  Katerina") may not be used: [an agent says it is a bot in its
  profile](an-agent-says-it-is-a-bot-in-its-profile.md).
- The Screener and the unread dot share one rule by design, and a message by
  the viewer never makes anything unread for them (SPEC §11.8).

## Decision

- Estiva ID puts the owner's NIP-OA `auth` tag on the agent's profile
  (`kind:0`), where it already publishes the `bot` marker, and republishes the
  existing agents' profiles. An agent that belongs to the workspace rather than
  a person (such as the relay operator) carries none.
- An app that reads the tag checks its signature against the agent's key. A
  valid tag names the agent's owner; an absent or invalid one names nobody.
- **A message by an agent you own counts as your own** for what you are told
  about: it makes no Screener row and no unread dot for you, in Peek, Ship and
  Leaf, old messages included. For everyone else it is a message from someone
  else, as before.
- Carried out by PEE-79: SPEC §6.5 and §11.8, Estiva ID, the shared unread
  check in `@estiva-app/conversation`, and Peek.

## Rejected alternatives

- **Every message the agent writes carries the proof** (as upstream Buzz's CLI
  does). It works on another company's relay without a profile lookup, but
  covers only messages written from now on, adds about 200 bytes to every agent
  message (half of all messages), and cannot be taken back off old ones.
  Ownership is a fact about the agent, not each message. It can be added on top
  later if a folder shared across two relays needs it.
- **Leave it as it is.** No app learns whose agent it is, and your own Claude's
  messages show as news. It reverses Miky's 4 Nov answer.
- **Hide every agent's message from everyone's Screener** (from the `bot`
  marker alone). Miky would stop seeing Katerina's Claude's updates too, a
  different product from the one chosen; and `bot` is self-declared, used only
  for what is shown.

## Consequences

- Ownership becomes public inside the workspace in a form any app can verify;
  the agent's name already said it.
- It is the change [Edit and Delete are offered only on your own
  message](edit-and-delete-are-offered-only-on-your-own-message.md) names as
  what would let an owner get those controls back. That record stands until
  someone asks that question; this one does not decide it.
- In a folder shared with another company, their relay may not hold our agent's
  profile, and their apps then treat it as anyone's agent.
- Two-way: Estiva ID can republish the profiles without the tag.
