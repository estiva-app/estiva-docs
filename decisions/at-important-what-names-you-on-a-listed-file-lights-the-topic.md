# Following a topic at Important, what names you on a file it lists lights the topic: a mention or a reply in your conversation blue, a reaction to your message orange; the file's other conversations never do

- Date: 2026-11-10
- Status: Accepted
- Decided by: Miky, in the read / unread session on his Leaf page "Read / Unread notifications + Activity" (2026-10-30), on "The Important dot, walked through the scenarios": B; and, for hovering, his answer of 2026-11-10 on the brief "Reactions turn orange" ([page](briefs/reactions-turn-orange.html)), call 2: B
- Area: Read state

## Who it affects

Miky follows a topic at Important. The bot mentions him with a question on a
Ship issue the topic lists: the topic's dot turns blue, and its hover says who
mentioned him. The bot replies again in that conversation without a mention:
blue again. Katerina reacts 👍 to his comment on a listed issue: the dot turns
orange. Somebody comments on a listed issue in a conversation he has no part
in: the topic stays dark. In none of these does the message appear in the
topic's feed. An outside company's app draws the same dot from what is
already on the relay.

These are Miky's own scenarios 2.1, 2.5, 2.8 and 2.2 on his page "Read /
Unread notifications + Activity", answered on 30 Oct. The project "Activity
indicator on each topic and team" (10 Nov) builds them.

## Context

- On 29 Oct the rule was narrower: "Following Important, only a new message
  on the topic itself turns it blue; one on a file the topic lists does not"
  (Miky, Navigation project's Decided lines). Miky's own scenarios 2.1 and
  2.5 gave the topic a blue dot, and the prototype drew the 29 Oct line.
- Things on a listed file can be for you in two ways: they name you (a
  mention, a reply in a conversation you are in, a reply to your agent; a
  reaction to your message is the orange kind), or they are on a file you
  are a member of without naming you.
- SPEC §11 ("Places and following") gives Important "what is said on the
  place: each new conversation, the replies in a conversation `P` is in, and
  every message that mentions `P`", with nothing from the files the place
  lists. All adds "the conversations on the files the place lists".
- No app can tell today whose agent wrote or received a message: SPEC §6.5,
  "No client can evaluate this predicate". Record
  [an-agents-profile-says-whose-it-is](an-agents-profile-says-whose-it-is.md)
  (Accepted, 9 Nov) puts an agent's owner on its profile, carried out by
  PEE-79.

## Decision

Miky answered B on 30 Oct, which his page records as: "What names you on a file the topic lists
lights the topic: a mention, a reply in your conversation, a reply to your
agent (blue), a reaction to your message (orange). The file's other
conversations reach you in the Screener or on the Desk, never on the topic."

- Following a topic at Important, on a file the topic lists, a mention of
  you and a reply in a conversation you are in light the topic blue; a
  reaction to your message lights it orange. The topic's feed stays the same:
  none of them is added to it.
- The file's other conversations, even on a file you are a member of, never
  light the topic. They reach you in the Screener or on the Desk.
- A reply to your agent is part of the rule and lights blue once an app can
  tell whose agent it is (an agent's owner on the wire, record
  [an-agents-profile-says-whose-it-is](an-agents-profile-says-whose-it-is.md)).
  Until then it lights nothing on the topic.
- Hovering the dot clears its orange
  ([a-reaction-is-seen-once-in-its-conversation](a-reaction-is-seen-once-in-its-conversation.md));
  it does not clear blue, which clears when what it points to is opened (the
  Initiative's "First version of the details": "hovering clears an orange
  dot but not a blue one").
- SPEC §11's Important row gains the files a place lists, as above.

## Rejected alternatives

- **A: only the topic's own conversation lights it.** One rule for a topic's
  dot, the same for everyone at a level; what is for you on its files is
  only in the Screener and in the topic's Activity. Turned down because "your
  own mention is missing from the topic you are working in", and starring the
  topic on the Desk does not catch it. It changed Miky's 2.1 and 2.5.
- **C: also every conversation on the files you are a member of.** For
  those files Important works like All. Turned down because it "lights the
  topic for talk you are not part of, which your 2.2 keeps out of
  Important"; as a member you are still told about it, in the Screener or on
  the Desk.

## Consequences

- An Important topic is the same for everyone at that level, plus what names
  each person: Miky's and Katerina's dots on one topic differ only by what
  names each of them.
- Nothing new is written for the blue part: the dot is worked out from what
  is already on the relay (the level, mentions, who wrote in a conversation).
  That part is two-way, at the cost of the apps' code. Orange needs a
  reaction to name whose message it reacts to
  ([a-reaction-names-whose-message-it-reacts-to](a-reaction-names-whose-message-it-reacts-to.md)).
- A reply to your agent lights nothing until PEE-79 lands.
