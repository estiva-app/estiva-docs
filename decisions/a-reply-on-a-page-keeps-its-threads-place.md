# A reply to a comment on part of a page remembers that part too, so its thread keeps its place when the comment is deleted

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the COMM-5 kickoff session, on the brief "Where a reply goes when its comment is deleted" ([page](briefs/where-replies-go.html))
- Area: Documents

## Who it affects

Miky comments on a paragraph in Leaf, Katerina replies, and Miky then deletes
his comment. Katerina's reply stays beside that paragraph, still highlighted,
under "This comment was deleted.". An outside company's app commenting on
parts of a file reads and writes the same shape: every comment on a page,
replies included, says what part of the page it is about.

It came up at the kickoff of "Edit and delete your own comment in Leaf"
(17 October 2026), after Miky had decided on 16 October that replies to a
deleted comment stay, under "This comment was deleted.", in every app, as Peek
does.

## Context

- SPEC §13.6 (added 2026-10-14, Leaf 1) said a reply inherits its top-level
  comment's anchor and MUST NOT carry a `block` tag of its own. It was written
  as an engineering choice, never asked.
- A NIP-09 delete makes the relay stop returning the comment (buzz
  `handle_standard_deletion_event`); its replies stay. With the old rule,
  nothing left on the relay said which blocks the thread was about once the
  comment was gone.
- Leaf's `readThreads` dropped a reply whose comment was gone. Peek draws a
  thread as a list, so it never needed a place.
- [A comment points at a run of blocks, narrowed by the words quoted at its ends](a-comment-points-at-blocks-and-the-words-quoted.md)
  gives a comment one anchor. This keeps one anchor per thread, repeated on
  its replies.
- NIP-22 already has every reply repeat the thread's root object; this extends
  that from "which file" to "which part of the file".

## Decision

A reply to a comment on a document copies its top-level comment's `block` and
`quote` tags, verbatim, when it is written. A reader places a thread by its
comment's anchor while the comment is readable, else by its earliest reply's.
SPEC §13.6's "a reply carries no `block`" is reversed. Replies written before
this carry no place: a thread with neither a readable comment nor an anchored
reply is drawn apart, at the end of the column, under "This comment was
deleted.".

Carried out by "Edit and delete your own comment in Leaf" (COMM-5): the shared
reply builder in `@estiva-app/conversation`, Leaf, Peek's reply to a page's
comment, and SPEC §13.6.

## Rejected alternatives

- **The place goes with the comment.** A reply would store only which comment
  it answers; a thread whose comment is deleted would move to a group at the
  end of the column with no highlight. Free to build and to undo, but a reply
  about paragraph 3 would lose paragraph 3 the moment one other person's event
  was deleted, and an app holding only a reply could not place it.
- **Deleting the comment takes its thread, as in Google Docs and Figma.**
  Considered by Miky on 19 October 2026, after comparing Slack (the replies
  stay under a note) with document apps (the thread goes). On the relay only
  a reply's author can delete it, so deleting the thread could only hide other
  people's words while they stay readable in the Folder, and an app that does
  not hide them still shows them. Offering "Resolve instead" when you delete a
  comment that has replies is kept for later.
- **Blank the comment with an edit instead of deleting it.** It keeps the
  place, but the original words stay readable on the relay, which is not a
  delete, and it goes against "as Peek does". Ruled out before asking.

## Consequences

- An app holding only a reply can place it on the page.
- A reply now carries the page's quoted words as well as its own, on its
  author's event.
- Every app that replies to a comment on a document must pass the place; a
  reply without it falls back to being drawn apart once its comment is gone.
- Undoing it means readers ignoring the copied tags; they stay on replies
  already written.
