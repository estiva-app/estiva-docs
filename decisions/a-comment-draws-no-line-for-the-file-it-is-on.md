# A comment draws nothing for a line that only links the file it is on, in every app

- Date: 2026-11-09
- Status: Accepted
- Decided by: Miky, in the kickoff session of "A comment written in Ship shows a link to its own issue as an extra row in Peek and Leaf" (*One conversation in every app*, 2026-11-09), choosing "Nothing" of three options
- Area: Links & widgets

> Supersedes in part
> [a-link-on-words-counts-toward-the-card](a-link-on-words-counts-toward-the-card.md):
> its rule "a line that is only a reference draws the object's row in place",
> for one file, the file the comment is on. Everything else in it holds.

## Who it affects

Miky and Katerina, reading in Peek or Leaf a comment written in Ship. On 9 Nov,
closing *One conversation in every app*, QA-1 commented on a Ship issue from
Ship and QA-2 saw an extra row in Peek and Leaf naming the issue the comment
was on, above the card of the issue the comment linked. Ship showed no such
row. Every comment Ship ever wrote on an issue carries that line.

An outside company's app adds one reading rule: on a comment, a line that is
only a link to the comment's own file draws nothing.

## Context

- Ship ended every issue comment with `\n\nnostr:naddr1…` of the issue
  (`startConversation`'s `withReference`, from July 2026, so that the old Peek
  Folder chat showed which issue a thread was about). The line earns no tag.
  Ship hid it on its own page (`omitOwnReference`); Peek and Leaf drew it as
  the issue's row or chip.
- Every app now reads a file's comments by the comment's NIP-22 `A` (and its
  `O` id), so the line tells no reader anything the tags do not.
- The three apps already drew a link to the file a message is shown on as its
  chip, never its row (WID-3), a rule no record stated.
- An event can only be changed by its author, so the old lines cannot be
  edited out by anyone but each comment's writer.

## Decision

- In a comment (`kind:1111`, its replies and their edits), a line that is only
  a link to the file the comment is on, by its `A` address or its `O` id,
  written as a `nostr:` reference or an app URL, draws nothing, in Peek, Ship,
  Leaf and any app reading the protocol. It sits beside the rule that a file
  whose card is under the message draws nothing on its own line: a file
  already in front of the reader is not drawn again.
- A message left with no words draws that line as it would without the rule
  (its chip).
- A link to that file inside a sentence keeps its chip.
- A writer adds no such line. Ship stops appending it.
- An edit box opening an old comment drops a `nostr:` line naming the
  comment's own file, as Ship's edit always has.
- SPEC §13.6.2, "The file a comment is on draws nothing on its own line", and
  conformance case C52. The shared rule is `placeLines`' `ownFile` in
  `@estiva-app/conversation` 0.36.0.

## Rejected alternatives

- **The file's chip, as the apps drew it, written into the SPEC.** A link
  somebody wrote is never hidden, but every old Ship comment would show the
  issue's chip line in all three apps, Ship included, until each author edited
  it out, and Katerina's only she can.
- **Hide only the `nostr:` form, keep a URL as its chip.** Old comments read
  the same as the decision, but one file draws two ways depending on how its
  link was written, and the SPEC would carry a rule only Ship's old writing
  explains.

## Consequences

- Every comment already on the relay reads the same in every app, with nothing
  to migrate.
- Somebody who deliberately writes the issue's own link alone on a line sees
  it disappear once sent; they still see it while editing.
- Two-way: no event changes. Undoing it is a SPEC edit and a shared-package
  release.
