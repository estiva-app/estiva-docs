# What you do shows at once; if the relay refuses it, it is taken back with a note and what you typed comes back to you

- Date: 2026-10-07
- Status: Accepted
- Decided by: Miky, in the shaping of "Optimistic updates & caching for Peek" on 2026-10-07, and for a new topic in the shaping of "Peek opens instantly" on 2026-10-12
- Area: Messages

## Who it affects

Miky presses Enter and his message is in the thread at once. If the relay
refuses it, the message disappears, a note says "Not sent — text restored in
<topic>", and the text is back in that topic's composer, above anything typed
there since. A reaction, edit or delete shows at once and is undone the same
way. A new topic opens at once; if it is refused, a note says "Topic not
created — title restored", the title is back in Start's field, and anything
typed in it is kept as a draft. Nothing they wrote is lost.

The moment: on 7 Oct Miky wanted a message to "immediately appear in the
thread" (Peek · Planning and sequencing). On production it appeared about
1.35 s after Enter, because Peek waited for the relay and re-read the
conversation.

## Context

Showing an action before the relay accepts it means deciding what a person
sees when the relay later says no. Peek had no pending state: it waited, so a
refusal was simply an error.

## Decision

- An action goes into the person's view the moment they act and looks exactly
  like an accepted one. It is swapped for the relay's copy when accepted.
- A refused action is removed or undone. A note says what did not happen, and
  any text the person typed goes back where they can use it: a message to its
  topic's composer, a new topic's title to Start and its text to a draft.
- Carried out in Peek by the two projects above. Ship and Leaf are to adopt
  the same store, so this becomes the rule for all three apps.

## Rejected alternatives

- **A "Not sent" row with Retry**, as Slack does. Miky chose remove-and-restore
  on 7 Oct. No reason beyond the choice is on record.
- **Wait for the relay before showing anything** (Peek before 7 Oct). Every
  message took over a second to appear.

## Consequences

- Writing feels instant, and a refusal never costs the person their words.
- A refused message leaves no trace in the thread; the note is the only sign.
- Every write path in every app needs a pending state and an undo, which is
  real work in Ship and Leaf when they adopt it.
