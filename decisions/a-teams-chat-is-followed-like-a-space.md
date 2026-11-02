# A team's chat is followed like a space: its members follow it at Important, so a new conversation lights for them and a reply only for those in that conversation, unless they set the chat to All

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline question "How a team's chat lights"
- Area: Read state

> Supersedes in part
> [a-folders-own-chat-is-unread-only-for-a-mention](a-folders-own-chat-is-unread-only-for-a-mention.md):
> for a team's members, its chat now has read state, as a space does. For
> anyone else it stays as that record says: unread only when a message names
> them.

## Who it affects

Katerina is in Peek's team. Miky starts a new conversation in its chat: her
dot lights. He replies in a conversation she is not in: it stays dark. She
sets the chat to All, and from then on every reply lights.

Miky, 30 Oct: "It should light up for every new conversation, since you're
member of it."

It came up on 2 Nov while shaping "Teams and following", the Teams stage of
the Initiative "Re-architecting Osnova protocol", which draws a team's chat
in Peek for the first time.

## Context

- A Folder's own chat (`kind:9` with its `h`) is unread for you only when a
  message names you
  ([a-folders-own-chat-is-unread-only-for-a-mention](a-folders-own-chat-is-unread-only-for-a-mention.md),
  1 Oct). Peek draws no screen for it and skips it.
- A team is today's Folder, with members and followers (the record that a
  team is the Folder and is called a team, estiva-docs#372).
- A space's members follow it at Important: a new conversation lights, and a
  reply lights only in a conversation you are in
  ([a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)).

## Decision

- **A team's members follow its chat at Important by default**, worked out,
  never written, as a space's default is.
- **A member can set the chat to All or Not following**, as on any place.
- **A follower of the team is not told about its chat**; followers see its
  spaces.
- Anyone else is told only when a message names them, as before.

## Rejected alternatives

- **Every message in the chat lights for every member** (All by default). In
  a busy team, every reply in every thread would light, the noise the
  following model exists to remove.
- **Keep the chat unread only for a mention.** A new conversation in your
  own team would never light, against Miky's 30 Oct answer.

## Consequences

- Peek's dots, and every app's, read a team's chat with the same rule as a
  space.
- SPEC §11.8 loses the line that a Folder's chat has no read state, for its
  members.
