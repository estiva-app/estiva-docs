# Leaf writes the title, summary and text of any file whose own app shares each, as Peek shows every file's conversation; the file's own app keeps its other fields, its name and where it opens, and a topic has no text

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky. The text, in the LEAF-13 kickoff session, on the brief "Who edits a file's text" ([page](briefs/who-edits-a-files-text.html)); the title and summary, at the shaping of the project "Leaf edits any file's text", the same day
- Area: Documents
- Supersedes: a-files-text-is-shared-by-every-app.md

## Who it affects

Miky opens Leaf and most of its tree is files Leaf cannot do anything with:
24 Peek topics and 29 Ship projects (with about 150 issues), beside 11 Leaf
pages, each non-page row saying only "Open in Peek" or "Open in Ship". On
19 October he filed "Sidebar should not show Peek Topic and should allow to
edit Ship Project/Issues": a Ship project or issue has a description, so he
should be able to write it in Leaf, and a topic, which has no text, is noise
there. With this decision he opens an issue in Leaf, renames it, rewrites its
summary and its description, and Ship shows all three; Leaf's tree no longer
lists topics.

An outside company that brings its own issue tracker chooses, per file type
and per field, whether a generic editor such as Leaf may write its files'
title, summary and text.

## Context

This record restates [Leaf edits the text of any file whose own app shares
it](a-files-text-is-shared-by-every-app.md) (Accepted earlier on 19 October)
and adds one thing Miky decided at the shaping of the project that builds it:
a document app may write a file's **title and summary** as well as its text,
where the owner shares them. A decided record is never rewritten, so this one
supersedes it.

[A document is its own type of file](a-document-is-its-own-type-of-file.md)
(Accepted, 14 October) says the app that owns a type decides how it is drawn,
named and opened, that only that app offers the text editor, and that Leaf's
tree shows a topic as a topic that opens in Peek. It also says topics and
documents never turn into each other.

The relay already treats these fields one way. SPEC §6.10 makes every file's
body its `description`, and §6.2 makes `title` and `summary` change fields the
same way: each changed with a `kind:1851` by anyone who may write in the
file's Folder, through any app that signs `1851`. Leaf's sign-in already may,
and the relay checks Folder membership on a `1851`, never whose file it
targets. Ship's manifest already declares `rename`, a summary change,
`describe-issue` and `describe-project` for other apps. "Only the owner edits"
was a rule the apps kept, not one the relay kept. On 19 October QA-1, signed
in through Leaf, changed a QA Ship issue's description, the relay accepted it,
and QA-2 saw it in Ship on the first load.

SPEC §6.7 gave the bare file (`30840`, a Peek topic) a `describe` action, but
none of the 32 topics on the relay has ever had a text, at creation or by a
change, and Peek has nowhere to write or show one. SPEC §7.8 reserved a
`document` aspect, the counterpart of Peek's `conversation`, and no app
declared it.

Miky's issue also sketched "file evolution": a topic that gains a text becomes
a document, and a document that gains a status and an assignee becomes a Ship
issue. A file's type is part of its address, and NIP-89 ownership is claimed by
that type.

## Decision

- A file's title, summary and text are shared with a generic editor. Leaf
  declares the `aspect: "document"` of §7.8, as Peek declares `conversation`,
  and offers its editor on each of those three fields of any file whose owning
  app's projection declares the action that changes it (for the text,
  `describe` in `estiva-blocks-1`), under §6.10's existing rule. Ship's projects and issues qualify today, for
  all three.
- The owning app keeps what the type is called, its own fields (a Ship issue's
  status, assignee and project), its archive and delete, and where "Open in …"
  goes. It keeps a field to itself by not declaring its action. In Leaf, a Ship
  file shows its title, its summary, its text and its comments, with the
  file's own compact widget row from Ship's manifest under the title, rather
  than a field strip Leaf builds itself.
- A topic is a conversation and has no text: the bare file's built-in
  projection (§6.7) drops `describe` and its `body`. An editor app therefore
  lists no topics.
- Editing other apps' fields is the generic document app's role only. Peek and
  Ship do not offer an editor on a document or on each other's files: Peek is
  for conversation, and Ship is specialized project management, which editing
  every document would make noisy (Miky).
- Topics, documents and Ship files stay separate types, and none converts into
  another, as the record above decided.

This replaces two statements in
[A document is its own type of file](a-document-is-its-own-type-of-file.md):
"only the owner offers the text editor" (now: the owner, or the generic
document app where the owner shares the field) and "Leaf's tree shows a Peek
topic as a topic that opens in Peek". Its type split and "no conversion" stand.
SPEC §6.4, §6.5, §6.7, §6.10, §6.11, §7.3 and §7.8 carry it (2026-10-19).

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
- **The document app writes the text only, and the title and summary stay the
  owner's** (the record this one supersedes, as it stood). Not taken at the
  shaping: Miky chose the three fields every file has, and left a type's own
  fields with its owner.

## Consequences

- Nothing new on the wire and nothing to migrate: no topic has a text, and
  Leaf's changes are the `1851`s Ship already writes. Two-way: undoing it is an
  app and SPEC change.
- An owning app can no longer assume it is the only writer of its title,
  summary or text: a change made in Leaf, or in an outside editor, reaches it
  as any other save does. An app that needs a field in a fixed shape stops
  declaring its action.
- Leaf writes a change into the file's own Folder, never the Folder it opened
  it from, and a comment into the Folder SPEC §6.4 names. It offers no change
  on an archived file, as Ship does (§6.5).
- SPEC §7.3 also requires the owner to show the text it shares (a `body` slot
  that is the `description` fold), so nobody edits a text the owner never draws.
- A Leaf page filed under a topic still needs a place in Leaf's tree once
  topics are not listed; none exists today.
