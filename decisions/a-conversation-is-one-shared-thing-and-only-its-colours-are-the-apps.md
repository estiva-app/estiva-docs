# A conversation is one shared thing that looks and works the same in Peek, Ship and Leaf, and only its colours are each app's own

- Date: 2026-10-20
- Status: Accepted
- Decided by: Miky, in the shaping session of "Peek moves onto the shared box" (2026-10-20), on the brief "One conversation everywhere" ([page](briefs/one-conversation-everywhere.html))
- Area: Messages

## Who it affects

Miky and Katerina comment and chat in Peek, Ship and Leaf. With this call a
conversation looks and works the same in each of them, so nobody has to learn
it three times. Miky said on 20 October: "the capabilities should be shared
and work the same including the layout. But the styling - the colors should be
on the app." And: "The conversations behave and look (except the styling)
same-ish so people don't need to have multiple mental models of conversations
based on where they are. Everywhere it works the same."

An outside company's app places one shared conversation and gives it its own
colours, instead of drawing the cards itself.

## Context

- Since 16 October Leaf and Ship write and react with one shared comment box
  and one shared reaction row, and Peek moves onto them next. That record kept
  everything around the box each app's own: "The cards stay each app's own"
  ([every-app-writes-and-reacts-with-one-shared-box](every-app-writes-and-reacts-with-one-shared-box.md)).
- Because each app draws its own cards, the apps already differ. From the 20
  October triage of "Comments work the same in Peek, Ship and Leaf":
  - In Ship, a thread under a deleted comment still takes replies.
  - Leaf's "(edited)" shows no time.
  - A link alone on its line is a row in Peek and a chip in Leaf.
  - A refused reaction's note stays in Leaf and goes by itself in Ship.
  - A file that is too big reads "Too large" in Leaf and "upload failed: 413"
    in Ship.
  - Ship shows no quoted words for a comment on part of a page.
- Katerina ruled on 22 September (UIG-18) to "record all seven, promote none
  yet", which kept ConversationThread and ConversationCard out of the shared
  kit. On 23 September (UIG-17) she ruled that EditedMarker stays Peek's
  (estiva-ui `docs/GATES.md:378-384`).
- Each app already has its own colours: estiva-ui's `tokens.css` has a theme
  per app (`signal` for Peek, `ship` for Ship), and the shared box and
  reaction row read it.

## Decision

- **A conversation is one shared thing** in the shared packages, with the same
  layout and behaviour in Peek, Ship and Leaf. It holds the comment and reply
  cards, threads, the Edit/Delete menu, "This comment was deleted.",
  "(edited)", a link alone on its line, quoted words, the person chip, and the
  words.
- **Each app supplies only three things:** where the conversation sits (Peek's
  pane, Ship's Activity, Leaf's column beside the blocks), its data (people,
  `[` lists, `/` rows, send), and its theme's colours (estiva-ui `tokens.css`
  themes, such as `signal` for Peek and `ship` for Ship).
- **How it looks stays Katerina's call.** The work starts with her prototype.
- It replaces the part "The cards stay each app's own" of
  [every-app-writes-and-reacts-with-one-shared-box](every-app-writes-and-reacts-with-one-shared-box.md).
  The rest of that record stands.
- It ends Katerina's UIG-18 "record all seven, promote none yet" for
  ConversationThread and ConversationCard, and UIG-17 "EditedMarker stays
  Peek's". Katerina was away when this was decided, and she is told on her
  return.
- Carried out by stage 2, a project "One conversation in every app", which
  starts with Katerina's prototype.
- Still open, asked with stage 2: whether Resolve and the Highlights are
  offered in every app.

## Rejected alternatives

- **A: keep today's record.** The box and reaction row are shared, and the
  cards stay each app's own. Every difference listed above is fixed in each app
  on its own, and the apps keep drifting apart.
- **C: one set of shared rules and words, and each app draws its own cards and
  layout.** The behaviour would match, but an outside company still builds the
  drawing, and a bug in the drawing can still differ by app.

## Consequences

- One release fixes a conversation in every app.
- An outside company places one component and gets all of it.
- Leaf's narrow column beside the blocks limits the shared layout, which has to
  fit there.
- Two-way: nothing on the relay changes. Kinds 1111, 9, 7, 5 and 40003 stay as
  they are. Undoing it means apps draw their own cards again.
