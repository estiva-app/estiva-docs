# Writing in a topic or space puts you in that conversation, never in the place; you follow a place only by your choice or by a team's default, which is worked out and never written; and All never makes you a member of the files a topic lists

- Date: 2026-10-30
- Status: Proposed
- Area: Read state

## Who it affects

Miky's own scenarios, in his Leaf page "Read / Unread notifications +
Activity":

- **5.1 and 5.2.** You report a bug in #bug, a public space of Engineering.
  Every reply to your report lights for you. Someone else's report does not:
  "you're not actively following the #bug public space so you're not
  distracted by others people reports, but still you are involved in
  conversation you participate in".
- **1.2.** You follow a topic at All, and someone comments on a Ship issue it
  lists, with no mention. The topic lights for you. Your name does not go on
  that issue, which you have no part in.
- When Engineering adds a public space, its members and followers see it at
  once, without anyone's app having to be open at that moment.

An outside company's app works out what a person follows from what is on the
relay, the same way every Estiva app does.

## Context

- [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)
  (Accepted, 30 Oct) brought following back for teams and places. It does not
  say how following starts, what the defaults are, or how it meets a file's
  membership.
- [membership-replaces-following](membership-replaces-following.md) (Accepted,
  30 Sep) makes you a member of a file when you write in its conversation, and
  a member is told about every new message there. A topic is a file, and a
  space is a kind of topic. So today, reporting one bug in #bug would light
  every later report, which 5.2 says must not happen.
- The page's section "Following, walked through the scenarios" walks the model
  through scenarios 1.2, 1.7, 1.8, 2.2, 2.5, 4.1, 4.2, 5.1, 5.2, 6.1, 7.1,
  11.2, 12.4, 12.6 and 15.1. This record is what it found. Miky has not
  confirmed it yet.

## Decision

Proposed:

- **Writing in a topic or space, or being mentioned there, puts you in that
  conversation**, so its replies are for you (5.1, 2.2). It never makes you
  follow the place, and never makes you its member (5.2). Writing on any other
  file still makes you its member (2.5), as today.
- **You follow a place only by choosing it, or by default from a team** you
  are a member or follower of: its public spaces, at Important, the default
  since 29 Oct.
- **A default is worked out, never written.** Who follows a team's space by
  default is read from the team's members and followers each time, so a space
  the team adds is followed at once, and nothing has to be written for each
  person. Your own choice of All, Important or not following is written, and it
  wins over the default.
- **All never makes you a member of the files a topic lists** (1.2). A new
  message on such a file is in what you follow, and reading it once in any app
  reads it everywhere (1.7, 1.8).
- **Following grants no access** (11.2): lose access to a team and its spaces
  stop lighting.
- **Following starts when you chose it** (12.6): the history before that is not
  unread.

On acceptance it supersedes in part
[membership-replaces-following](membership-replaces-following.md): "writing in
its conversation" stops making you a member of a topic or space.

## Rejected alternatives

As they stand:

- **Writing in a place follows it**, as for any file (option A of the brief
  "Following a topic"). One bug report in #bug would light every later report,
  against 5.2.
- **All makes you a member of every file the topic lists.** It puts your name
  on files you have no part in. It misses a file's first comments when the file
  is listed while your app is closed. Going back to Important cannot tell the
  files you joined yourself. And the membership events stay on the relay.
- **Defaults are written** for each person when a space is added or someone
  joins a team. It needs an app running at that moment, and one missed write is
  a space that never lights for someone, which is not the 100% reliable unread
  the page asks for.

## Consequences

- Every app works out "in what you follow" the same way, from a team's members,
  the teams you follow, your levels and your mutes. The shared conversation
  package carries it, as it carries membership.
- SPEC §11.8 changes: a topic or space has its own rule for writing.
- An issue's members stay the people involved in it, whoever follows the topics
  that list it.
- Being in a conversation is smaller than a file's membership: you wrote in it
  or were mentioned in it. How an app keeps it is an engineering choice once
  this is accepted.
