# Leaf edits the text of any file whose own app shares it, as Peek shows every file's conversation; the file's own app keeps its name, its fields and where it opens

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, in the LEAF-13 kickoff session, on the brief "Who edits a file's text" ([page](briefs/who-edits-a-files-text.html))
- Area: Documents

## Who it affects

Miky opens Leaf and most of its tree is files Leaf cannot do anything with:
24 Peek topics and 29 Ship projects (with about 150 issues), beside 11 Leaf
pages, each non-page row saying only "Open in Peek" or "Open in Ship". On
19 October he filed "Sidebar should not show Peek Topic and should allow to
edit Ship Project/Issues": a Ship project or issue has a description, so he
should be able to write it in Leaf, and a topic, which has no text, is noise
there. With this decision he opens an issue in Leaf, rewrites its description,
and Ship shows the new text; Leaf's tree no longer lists topics.

An outside company that brings its own issue tracker chooses, per file type,
whether a generic editor such as Leaf may write its files' text.

## Context

[A document is its own type of file](a-document-is-its-own-type-of-file.md)
(Accepted, 14 October) says the app that owns a type decides how it is drawn,
named and opened, that only that app offers the text editor, and that Leaf's
tree shows a topic as a topic that opens in Peek. It also says topics and
documents never turn into each other.

The relay already treats text one way. SPEC §6.10 makes every file's body its
`description`, changed with a `kind:1851` by anyone who may write in the file's
Folder, through any app that signs `1851`; Leaf's sign-in already may, and the
relay checks Folder membership on a `1851`, never whose file it targets. Ship's
manifest already declares `describe-issue` and `describe-project` for other
apps. "Only the owner edits" was a rule the apps kept, not one the relay kept.

SPEC §6.7 gave the bare file (`30840`, a Peek topic) a `describe` action, but
none of the 31 topics on the relay has ever had a text, at creation or by a
change, and Peek has nowhere to write or show one. SPEC §7.8 reserved a
`document` aspect, the counterpart of Peek's `conversation`, and no app
declared it.

Miky's issue also sketched "file evolution": a topic that gains a text becomes
a document, and a document that gains a status and an assignee becomes a Ship
issue. A file's type is part of its address, and NIP-89 ownership is claimed by
that type.

## Decision

- A file's text is shared with a generic editor. Leaf declares the
  `aspect: "document"` of §7.8, as Peek declares `conversation`, and offers its
  editor on the `description` of any file whose owning app's projection
  declares `describe` in `estiva-blocks-1` (§7.3), under §6.10's existing rule.
  Ship's projects and issues qualify today.
- The owning app keeps what the type is called, its own fields (a Ship issue's
  status, assignee and project), and where "Open in …" goes. It keeps a type's
  text to itself by not declaring `describe`. In Leaf, a Ship file shows its
  title, its text and its comments, with the file's own compact widget row
  from Ship's manifest under the title, rather than a field strip Leaf builds
  itself.
- A topic is a conversation and has no text: the bare file's built-in
  projection (§6.7) drops `describe`. An editor app therefore lists no topics.
- Editing other apps' text is the generic document app's role only. Peek and
  Ship do not offer an editor on a document or on each other's files: Peek is
  for conversation, and Ship is specialized project management, which editing
  every document would make noisy (Miky).
- Topics, documents and Ship files stay separate types, and none converts into
  another, as the record above decided.

This replaces two statements in
[A document is its own type of file](a-document-is-its-own-type-of-file.md):
"only the owner offers the text editor" (now: the owner, or the generic
document app where the owner shares its text) and "Leaf's tree shows a Peek
topic as a topic that opens in Peek". Its type split and "no conversion" stand.
The project that builds it carries the SPEC change (§6.7, §6.11, §7.3, §7.8).

## Rejected alternatives

- **Each file is edited only in its own app** (the 14 October record as it
  stood). Leaf would be a pages-only app and an issue's description written in
  Ship. A promise the relay does not enforce; costs nothing to keep.
- **Files grow: one kind of file, which gains a text and then fields** (the
  issue's file evolution, Notion's model). Keeps a file's link and conversation
  through conversion only if the type leaves the address and ownership is
  claimed by a field, which changes how every app finds, names and opens
  files, and reverses "no conversion"; its first step, a topic with a text is a
  page, is the shape turned down on 14 October. One-way once written; the
  largest build.
- **A topic keeps an optional text, and Leaf just hides topics.** The tree
  would follow a filter rather than a rule, and an outside editor app could
  still show and edit topic text that Peek never draws.
- **Ship, and Peek, edit a Leaf document's text by the same rule.** Turned
  down: Peek is for conversation, Ship is specialized, and only a generic
  document tool fits (Miky).

## Consequences

- Nothing new on the wire and nothing to migrate: no topic has a text, and
  Leaf's text changes are the `1851`s Ship already writes. Two-way: undoing it
  is an app and SPEC change.
- An owning app can no longer assume it is the only writer of its text: a Ship
  description written in Leaf, or in an outside editor, reaches Ship as any
  other save does. An app that needs its text in a fixed shape stops declaring
  `describe`.
- Leaf writes a change into the file's own Folder (its `h`), never the Folder
  it opened it from, and refuses an archived file as Ship does.
- A Leaf page filed under a topic still needs a place in Leaf's tree once
  topics are not listed; none exists today.
