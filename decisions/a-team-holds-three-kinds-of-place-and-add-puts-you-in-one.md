# A team holds three kinds of place, its chat, its spaces and the topics it leads; joining one is following it, and someone adding you puts you in it

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline questions "What a team holds" ("That's how I meant it") and "Add on a topic" ("it's all about intentionality")
- Area: Read state

> Supersedes in part
> [writing-in-a-place-never-follows-it](writing-in-a-place-never-follows-it.md):
> besides your own choice and a team's default, there is a third way into a
> place: someone adds you. Writing in a place still only puts you in that
> conversation.
>
> Supersedes in part, for topics,
> [a-mention-in-a-files-text-adds-the-person-with-no-unread](a-mention-in-a-files-text-adds-the-person-with-no-unread.md):
> naming someone in a topic's summary puts them in nothing; it stays a link.
> On every other file a mention in its text still adds the person.

## Who it affects

Engineering has its chat, its spaces such as #bug, and topics it leads such
as one release. Katerina, in Engineering, follows the chat and #bug at
Important without doing anything, and the release topic not at all until she
joins it. Miky adds her to the release topic from its menu: it shows on her
Topics and in Engineering's section at Important, and its next new
conversation lights for her. She leaves it with the same switch she would
use to stop following. Miky: "If I'm intentional about adding Katerina to
the topic, I have very good reason. And she can always leave."

## Context

- [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)
  (Accepted, 30 Oct) gave a team members and followers, and every topic or
  space a level per person: All, Important or not following.
- [writing-in-a-place-never-follows-it](writing-in-a-place-never-follows-it.md)
  (Accepted, 30 Oct) said you follow a place only by your choice or by a
  team's default. It did not say what Add on a topic does, which every app
  already offers and writes as the file's member change.
- [a-mention-in-a-files-text-adds-the-person-with-no-unread](a-mention-in-a-files-text-adds-the-person-with-no-unread.md)
  makes a name in a file's text write the same Add. A topic has no text of
  its own (SPEC §6.7): its one line is its summary (§6.12).
- [anyone-may-add-a-person-to-a-file](anyone-may-add-a-person-to-a-file.md)
  (Accepted) lets anyone add someone, including someone who left.

## Decision

- **A team holds three kinds of place:**
  - **its chat**, the conversation about no file, which its members follow
    at Important by default
    ([a-teams-chat-is-followed-like-a-space](a-teams-chat-is-followed-like-a-space.md));
  - **its spaces**, topics with no expected end that the team marks on its
    own list
    ([a-space-is-the-teams-own-mark-on-a-topic-it-lists](a-space-is-the-teams-own-mark-on-a-topic-it-lists.md)),
    which its members and followers follow at Important by default;
  - **the topics it leads**, every other topic on its list, which nobody
    follows by default.
- **Joining a topic is following it at a level, and leaving it is Not
  following**: one switch, not two.
- **Add on a topic or space puts the person in it, at Important.** It is a
  third way in, beside your own choice and a team's default. An Add never
  chooses your level: your own choice made after it wins, and you leave with
  the same switch. An Add after you left puts you back in, as on any file.
- **Writing in a place still puts you only in that conversation.**
- **Naming someone in a topic's summary puts them in nothing**; it stays a
  link.
- **A topic a team leads shows in that team's section only for people who
  are in or follow the team**: "If she is not following Engineering at all,
  she shouldn't see it Engineering section with the Topic." A topic you
  follow shows on Topics too, and its dot is read once and clears in both.
- SPEC §3 and §11.8 carry it, in the project "Teams and following". The Add
  keeps today's member change on the topic, which now means "in it, at
  Important unless you chose a level" rather than "told about every
  message".

## Rejected alternatives

- **No Add on a topic; only you can put yourself in.** It followed from
  writing-in-a-place-never-follows-it's "only by your choice or a team's
  default". Lost to Miky's "you should be able to add other user to the
  Topic just by adding them from menu".
- **Joining and following as two switches**, a member list beside a level.
  Miky: one switch, "that's how I meant it".
- **A name in a topic's summary adds the person**, as a name in other files'
  text does. A topic's summary is its one line on every card; naming someone
  there describes the topic, it does not invite them.

## Consequences

- Topics people already joined or were added to go quieter on the day it
  ships: they were told about every message, and now follow at Important, so
  a reply in a conversation they are not in no longer lights unless they set
  the topic to All.
- A topic's author is in it at Important from its first record.
- A leave from any app (Peek, Ship, Leaf, the CLI) ends a level chosen in
  another: the latest of the person's own acts decides.
- An Add after someone left is ordered by the relay, not by two people's
  clocks: it names the member change it follows.
