# A team has members and followers, and you follow a topic or space at All, at Important, or not at all; a team's members and a place's followers at each level are visible, and the rest of what you follow is yours

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the Claude session working through his Leaf page "Read / Unread notifications + Activity" (2026-10-30), where his answers are recorded, answering the brief "Following a topic" ([page](briefs/following-a-topic.html)) with his own model rather than one of its options, and in the same session who can see it and that spaces follow the rules of topics
- Area: Read state

> Supersedes in part
> [membership-replaces-following](membership-replaces-following.md):
> "Following is retired", for teams and places. Following comes back for them
> as this record says. The old private list Peek kept per file stays retired,
> and the rest of that record stands.

## Who it affects

Miky and Katerina, and everyone in a company on Estiva:

- Someone in the Engineering team sees its own space. Someone who follows
  Engineering without being in it sees its public spaces, such as #releases
  and #bug.
- On each topic and space you choose All, Important, or not following.
- Open a topic and you see who follows it at All and who at Important, "so
  you know who you're discussing stuff with". You also see who is in each
  team.
- Nobody sees which teams you follow.

An outside company's app reads the team members and the levels on the relay,
as it reads a file's members today, and one private list for its own user.

It came up on 30 Oct, in Miky's Leaf page "Read / Unread notifications +
Activity". The brief "Following a topic" asked how following a topic sits
beside membership of a file. Miky answered: "I can't answer this as it's not
standalone decision. That's why I wrote with your help all those scenarios so
it help us better evaluate." He then gave his model, and the page walks it
through the scenarios in "Following, walked through the scenarios".

## Context

- [membership-replaces-following](membership-replaces-following.md) (Accepted,
  30 Sep) tells you about a file's conversation when you are its member, and
  it retired following, a private list only Peek kept.
- On 29 Oct the Navigation project made Teams and Topics the top level, made a
  topic a file, and gave each topic an icon for how you follow it: Important
  (what is said on the topic and shared to it) or All (the conversations on
  the files it lists too). A space is a kind of topic.
- Nothing said what a team is to a person beside access, who sees how someone
  follows a topic, or whether a space works like a topic.

## Decision

Miky's model, 30 Oct, in his words: "Teams has membership - they see the team
space like Engineering; followers of teams: see the public spaces of the team.
Topic/space: Following all, Following important, Not following."

- **A team has members and followers.** A member sees the team's own space,
  such as Engineering. A follower sees the team's public spaces.
- **A topic or a space is followed at All, at Important, or not at all.**
  "Space and Topics should have the very same rules as it's basically the same
  thing."
- **Visible:** "it should be visible who is member of which Team. It should be
  visible who is All and who Important on Topic, so you know who you're
  discussing stuff with." So anyone who can read a team sees its members, and
  anyone who can read a topic or space sees who follows it at All and who at
  Important.
- **Yours alone:** "otherwise it should not be visible as it's more of a
  distraction." Which teams you follow is seen only by you, as your mutes are.
- **A file's membership stays as it is** for the files a person is involved in
  ([membership-replaces-following](membership-replaces-following.md)).

## Rejected alternatives

The brief's options, all three answered by the model above:

- **A · Following a topic is being its member**, by the triggers of any file,
  with All a private setting. Miky's answer makes who chose All visible. And in
  his scenario 5.2, someone who reported a bug in #bug is "not actively
  following the #bug public space so you're not distracted by others people
  reports", which A's triggers would break: writing there would make them its
  member.
- **B · Following is a private list of its own**, so nobody sees who follows a
  topic. Miky wants to see "who you're discussing stuff with".
- **C · All is only a way of looking**, with nothing stored. A level others can
  see has to be stored.
- **Following stays retired**, as since 30 Sep. Miky's model has teams with
  followers and places followed at a level.
- **Everything about following is visible**, the teams you follow included:
  "more of a distraction".

## Consequences

- Every app shows the same levels on a topic or space, and the same members of
  a team. An agent can tell whom a post in a place will reach.
- Following has two halves on the relay: public (a team's members, and each
  place's followers at their level) and private (the teams you follow, kept
  like your mutes).
- One-way once written: a level or a team membership published on the relay
  stays there, as membership does.
- SPEC §11.8 gets following back for teams and places when it is built.
- Open, in the Proposed record
  [writing-in-a-place-never-follows-it](writing-in-a-place-never-follows-it.md):
  how following starts and its defaults, and how All and writing in a place
  meet a file's membership.
- Comes in its own record with the Teams stage: a team's own chat, #general
  included, lights for every new conversation (Miky, 30 Oct, in the same
  page). It supersedes
  [a-folders-own-chat-is-unread-only-for-a-mention](a-folders-own-chat-is-unread-only-for-a-mention.md)
  for team chats.
- Still open: older topics that are channels.
