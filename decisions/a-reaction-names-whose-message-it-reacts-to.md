# A reaction names the person whose message it reacts to, so any app finds the reactions to your messages by asking for the ones that name you

- Date: 2026-11-10
- Status: Accepted
- Decided by: Miky, in the shaping session of "Activity indicator on each topic and team" (2026-11-10), on the brief "Reactions turn orange" ([page](briefs/reactions-turn-orange.html)), call 1: A, as recommended
- Area: Read state

## Who it affects

Miky and Katerina: when one of them reacts 👍 to the other's message, in a
topic or on a file a topic lists, the place turns orange for the person who
wrote the message, live, however old the message is. An outside company's app
answers "who reacted to my messages?" with one request and gets the whole
answer.

It came up shaping "Activity indicator on each topic and team" on 10 Nov,
which turns a place's dot orange for a reaction to your message (Miky's 30 Oct
rule: "a reaction to your message (orange)"). It was asked on the brief
[Reactions turn orange](briefs/reactions-turn-orange.html), call 1, and Miky
answered A.

## Context

- A reaction (`kind:7`, NIP-25) names only the message it reacts to, by `e`.
  Our shared builder (estiva-foundation `buildReaction`) and Buzz's
  (`build_reaction`, upstream and ours) write no `p`. It carries no `h`; the
  relay files it under its target's team.
- SPEC §6.6 says an app MUST fetch reactions by target: collect the message
  ids it shows and ask for reactions on them, for the newest 100. That draws
  👍 under an open conversation. It cannot answer "who reacted to me?" without
  first collecting every message the person wrote in every place they follow
  and every file their topics list, and older messages fall past the 100.
- NIP-25: "There SHOULD be a `p` tag set to the `pubkey` of the event being
  reacted to … the target event `pubkey` should be last". A comment already
  names its parent's author (§6.4, NIP-22), and a `p` alone is not a mention
  (§11.8), so the tag does not turn a reaction into a mention.
- Since TOPI-12 (Buzz `460f3d77`, 9 Nov) the relay answers a stored read and a
  kept-open request only with what the reader may read
  ([a-request-kept-open-hears-what-asking-again-would-return](a-request-kept-open-hears-what-asking-again-would-return.md)),
  so a read by person returns no reaction from a team the reader cannot read.
  The relay already indexes `p` on every event it stores (`event_mentions`).

## Decision

- Every reaction names the author of the message it reacts to, as its last
  `p`. For a message the relay signed on someone's behalf, that is its
  effective author (§6.5).
- An app finds the reactions to `P`'s messages with
  `{kinds:[7], "#p":[P], since}`, stored and live, and keeps a reaction only
  when its last `p` equals the author of its target (the last 64-hex `e`), so
  a reaction that names `P` falsely lights nothing. It reads the targets it
  does not hold, by id, to learn where each is.
- SPEC §6.6 states this read as the one exception to "fetch reactions by
  target"; counting reactions under a conversation keeps the target rule and
  the horizon of 100. KINDS `7` says so.
- Reactions written before the date orange starts carry no name and are never
  read for it; nothing is backfilled.

## Rejected alternatives

- **B: keep finding reactions by the message** (SPEC §6.6 as it stands).
  Nothing on the wire changes, but each app rebuilds "reactions to me" itself:
  it collects the person's messages in every place they follow and every file
  their topics list, then asks for reactions on them, and to stay live it
  listens to every reaction in the company and fetches each one's message to
  see whose it is. A reaction to a three-month-old comment in a busy
  conversation never lights if the app keeps SPEC's cut at the newest 100, or
  the cold open grows with everything the person ever wrote if it does not. The
  brief's costs: "a load that grows with the company, not with you; two apps
  that cut in different places disagree about whether you were reacted to".

## Consequences

- One small read answers "reactions to me", complete and live, in any app.
- Every writer of reactions must add the name: Peek, Ship and Leaf through
  the shared builder, and Buzz's builders (`build_reaction`,
  `build_custom_emoji_reaction`). A reaction from an app that leaves it out,
  upstream Buzz's own apps included today, lights nothing.
- Two-way: the tag is harmless on old reactions if apps stop reading it.
