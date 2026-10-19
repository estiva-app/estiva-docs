# Any app with an editor may edit a file's text; the file's own app keeps its name, its fields and where it opens

- Date: 2026-10-19
- Status: Proposed
- Area: Documents

## Who it affects

Miky opens Leaf and most of its tree is files Leaf cannot do anything with:
24 Peek topics and 29 Ship projects (with about 150 issues), beside 11 Leaf
pages, each non-page row saying only "Open in Peek" or "Open in Ship". On
19 October he filed "Sidebar should not show Peek Topic and should allow to
edit Ship Project/Issues": a Ship project or issue has a description, so he
should be able to write it in Leaf, and a topic, which has no text, is noise
there.

An outside company that brings its own issue tracker or wiki learns from this
whether other apps in the workspace will edit its files' text.

## Context

[A document is its own type of file](a-document-is-its-own-type-of-file.md)
(Accepted, 14 October) says the app that owns a type decides how it is drawn,
named and opened, that only that app offers the text editor, and that Leaf's
tree shows a topic as a topic that opens in Peek. It also says topics and
documents never turn into each other.

The relay already treats text one way. SPEC §6.10 makes every file's body its
`description`, changed with a `kind:1851` by anyone who may write in the file's
Folder, through any app that signs `1851`; Leaf's sign-in already may. "Only
the owner edits" is a rule the apps keep, not one the relay keeps. Peek writes
no text on a topic, though §6.7 would allow one.

Miky's issue also sketches "file evolution": a topic that gains a text becomes
a document, and a document that gains a status and an assignee becomes a Ship
issue. A file's type is part of its address today, and NIP-89 ownership is
claimed by that type.

A brief with three options, "Who edits a file's text", was put to Miky on
19 October; it goes in `briefs/` once he answers.

## Decision

Proposed (the brief's recommendation): a file's text is shared. An app with an
editor may show and edit the `description` of any file whose owning app's
projection declares `describe` in `estiva-blocks-1` (§7.3), as Ship's already
does for projects and issues, under §6.10's existing rule. Leaf declares the
reserved `aspect: "document"` (§7.8), as Peek declares `conversation`. The
owning app keeps what the type is called, its own fields (a Ship issue's
status, assignee and project), and where "Open in …" goes, and keeps a type's
text to itself by not declaring `describe`. A topic is a conversation with no
text: the bare file's built-in projection (§6.7) drops `describe`; none of the
31 topics on the relay has a text. Topics, documents and Ship files stay
separate types, and none converts into another.

This would supersede, in
[A document is its own type of file](a-document-is-its-own-type-of-file.md),
"only the owner offers the text editor" and "Leaf's tree shows a Peek topic as a
topic that opens in Peek"; its "no conversion" stays.

## Rejected alternatives

None rejected yet; these are the options in the brief.

- **Each file is edited only in its own app** (today's record). Leaf becomes a
  pages-only app; an issue's description is written in Ship. A promise the
  relay does not enforce.
- **Files grow: one kind of file, which gains a text and then fields** (the
  issue's file evolution, Notion's model). Keeps a file's link and conversation
  through conversion, but only if the type leaves the address and ownership is
  claimed by a field, which changes how every app finds, names and opens
  files, and reverses "no conversion". One-way once written.

## Consequences

- Nothing new on the wire; the apps catch up to what the relay already allows.
  Two-way: undoing it is an app change.
- An owning app can no longer assume it is the only writer of its text: a Ship
  description written in Leaf, or in an outside editor, reaches Ship as any
  other save does.
- Ship and Peek would be allowed to edit a document's text by the same rule.
  Whether and when they offer it is a separate call (Peek's read-only line in
  Leaf 1's scope was Miky's, 13 October).
