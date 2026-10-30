# Following a topic is being its member; choosing All tells you about its files' conversations, and that choice is yours alone

- Date: 2026-10-30
- Status: Proposed
- Area: Read state

## Who it affects

Miky and Katerina pick how they follow each topic by its icon: Important (the
default) or All, decided on 29 Oct in the Navigation project. With All,
Katerina hears about a comment on any Widgets issue, read once, in any app,
without becoming a member of that issue. Anyone who can read a topic sees who
follows it. Nobody sees who chose All. An outside company's app reads the same
public members it reads today, plus one more private list for its own user.

It came up on 30 Oct, in Miky's Leaf page "Read / Unread notifications +
Activity", where following a topic sat against the record that retired
following. The brief is "Following a topic".

## Context

- [membership-replaces-following](membership-replaces-following.md) (Accepted,
  30 Sep) says you are told about a file's conversation when you are its
  member, and it retired following, a private list only Peek kept. The
  alternative it turned down was keeping that list: Ship couldn't see it, and
  one mention lit a file's whole history.
- On 29 Oct, Miky decided in the Navigation project that a topic is a file,
  and that its icon says how you follow it: Important (what was said on the
  topic and shared to it) or All (every conversation on the files it lists
  too).
- A topic made in Peek today is a file whose conversation is comments (SPEC
  §6.7), so membership already decides whose unread it is. Older topics are
  channels, unread only for a mention
  ([a-folders-own-chat-is-unread-only-for-a-mention](a-folders-own-chat-is-unread-only-for-a-mention.md)).
- A topic keeps its own list of files
  ([a-topic-keeps-its-own-list-of-files](a-topic-keeps-its-own-list-of-files.md)).
- Nothing yet says where the choice of All lives, or how Ship and Leaf learn
  it.

## Decision

Proposed, option A of the brief:

- Following a topic is being its member, by the same triggers as any file
  (SPEC §11.8). Unfollow is leaving it. The topic's members are its followers,
  public like any membership.
- Important is the default. All is a private setting, kept like muting in one
  list every app reads, encrypted to the person.
- With All, a new message on a file the topic lists is unread for you once it
  is newer than both your choice of All and the file's listing, unless you
  muted that file. It does not make you the file's member.

This adds one path to `membership-replaces-following` without superseding it.
A file's conversation reaches you when you are its member, or when a topic you
follow at All lists it. Everything else in that record still holds.

## Rejected alternatives

Not decided yet. The brief's other options, as they stand:

- **B · Following is a private list of its own**, read by every app. Nobody
  can see who follows a topic. Membership stays beside it, so a person who
  wrote in a topic and then unfollowed it is still lit by its talk until they
  also leave. A notifier on a server can't work out whom to tell.
- **C · All is only a way of looking.** Nothing new is stored. The icon opens
  the topic on All, and a file's talk reaches you only when you are a member
  of that file. Katerina misses a question on a Widgets issue where nobody
  mentioned her.
- **Set aside: All makes you a member of every file the topic lists.** It puts
  a follower's name on files they have no part in. It misses a file's first
  comments when the file is added while their app is closed. Going back to
  Important can't tell which files they joined themselves. And it is one-way:
  the membership events stay on the relay.

## Consequences

- "Unread for you" gets a second path, which every app must compute the same
  way: the shared conversation package carries it, and Peek, Ship and Leaf
  read one more private list.
- A topic's member list says who follows it, so an agent can tell whom a post
  there will reach.
- An issue's members stay the people involved in it, whoever follows its
  topics.
- The private list can be reshaped later. Topic membership has been public
  since 30 Sep.
- Left open: following a team, writing once in a topic making you follow it
  (one bug report in #bugs), and older topics that are still channels.
