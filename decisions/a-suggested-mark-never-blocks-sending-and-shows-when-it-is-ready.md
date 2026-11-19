# A model's suggested mark never holds back sending: it shows before you send when it is ready in time, otherwise on the sent message, and on a document block when you pause or move on

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the prototype session of 19 November 2026 for issue 009bc509, choosing when a suggestion appears in the message box and the block editor
- Area: Messages

## Who it affects

Miky writes "I'm worried that moving Folders out of the sidebar might break
old links people saved." and presses Enter. If the model has already read it
as a Concern, the suggestion showed in the box and the message goes out
marked; if not, the message goes out at once and the suggestion appears on it
a moment later. In Leaf, Katerina gets the suggestion when she pauses in a
block or moves to the next one.

## Context

- Miky, 19 Nov: the model's suggestion is the main way to mark; typed
  symbols are a nice-to-have.
- A suggestion comes with a confidence (the prototype assumes a decisions API
  that returns one per word). Above a threshold it marks with Undo; below it,
  it is only offered and fades if ignored.

## Decision

- Sending never waits for a suggestion.
- A suggestion that is ready before you send shows in the message box; one
  that arrives later shows on the sent message.
- In a document, a block gets its suggestion when you pause in it or move to
  the next block, once per block.
- A sure suggestion marks with Undo; an unsure one is only offered and goes
  when ignored.

## Rejected alternatives

- **Hold sending until the model answers.** Turned down: a chat that waits
  on a model is slower than one without it.
- **Only after sending.** Turned down: when the answer is ready in time, the
  person should see and correct it before the message is out.

## Consequences

- Each app needs a place for a late suggestion on a sent message or a block,
  drawn the same in Peek, Ship and Leaf.
- The threshold is tuned from real use; every deleted suggestion is an
  example that tunes it.
