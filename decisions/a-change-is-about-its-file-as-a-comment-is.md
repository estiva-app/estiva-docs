# A change names the file it changes the way a comment names the file it is on, and every other file it points at the way a mention does

- Date: 2026-10-30
- Status: Proposed
- Area: Files

## Who it affects

Nothing changes on Miky's or Katerina's screen. What it settles is what an app
gets back when it asks the relay "what changed on this file": only that file's
own changes, never a topic's entry that merely lists it.

An outside company learns one rule for every type, its own included: the
capital tag is the file an event is about (a comment, a change, who is on the
file), and the small tag is any other file it points at (a mention, a listing,
a move's new parent, its own "blocked by").

It came up on 30 Oct, in the protocol pre-review of the topics stage of
"Navigation & structure in Nostr for Business". A topic's list writes "Widgets
lists build 1" as a change on the Widgets topic that names build 1 with the
small tag, while the projects stage planned to put the small tag on every
project change for the project itself.

## Context

- A change names its file by the file's address, `a`, and §6.2 says "`a` is
  the only tag a change targets". Ship ignores a change without `a`
  (`estiva-ship` `src/nostr/fold.ts`, `parseChange`).
- [a-file-is-named-by-its-id-in-a-capital-and-small-tag](a-file-is-named-by-its-id-in-a-capital-and-small-tag.md)
  (Accepted 29 Oct) names a file by its id: `O` for a comment's file, `o` for
  anything that mentions or lists it, and puts "who is on the file
  (kind 1851 `member:<P>` targeted by `o`)" under the small one. SPEC §11.8
  says the same for a file kept whole (§6.13), which is being replaced and
  which no app writes.
- [osnovas-base-types-keep-their-records-and-every-new-type-starts-named](osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md)
  (Accepted 30 Oct): "Every later change names the file by its id". Which of
  the two tags was not said.
- The projects stage's plan (project "A load stays the same size as edits pile
  up: projects", Technical notes, 30 Oct) keeps `a` on new changes, adds `o`
  beside it, and has the relay refuse a change whose `a` and `o` name different
  ids. Its SPEC issue is not written yet.
- The topics stage lists a file with a `kind:1851` on the topic, field
  `lists:<d>`, naming the listed file with `["o", <d>]`. Under the projects
  plan, `#o` for build 1 would return Widgets' entry as one of build 1's
  changes, and the relay would refuse that entry.

The brief: "What a change is about" (`decision-briefs/what-a-change-is-about.html`,
copied to `briefs/` on the answer).

## Decision

Proposed (option A of the brief, recommended):

- A change names the file it changes with `["O", <d>]`, as a comment names
  the file it is on, and keeps `a` beside it while readers that need it
  remain; the relay refuses a change whose `a` and `O` name different ids.
- Every other file a change names goes in `["o", <d>]`: a topic's `lists:<d>`
  entry, a move's new parent by id, and any relation a builder's type adds.
- Who is on a file (`member:<P>`) is a change about the file, so it is
  targeted by `O`.
- A reader asks `{kinds:[1851], "#O":[d]}` for a file's changes and `#o` for
  what points at it.
- SPEC §6.2, §6.4 and §11.8 say so, in the projects stage's SPEC issue.

## Rejected alternatives

Open until Miky answers:

- **B · A change keeps `o` for its own file, and a topic's list names files in
  a third tag.** Keeps the projects plan. "Lists" would then be two tags (a
  Folder's listing and a topic's), "about" two cases (capital for a comment,
  small for a change), and "what points at this file" would miss its topics.
- **C · Do less: a change names its file only by its address, never by id.**
  Nothing new on the wire, and adding the id later is additive. Changes become
  the one place a file is named by type and creator, so an app holding only an
  id must find the first record before it can read the file's changes.

## Consequences

- Supersedes in part, once Accepted, the membership clause of
  a-file-is-named-by-its-id-in-a-capital-and-small-tag.
- Two-way until the projects switch: none of the 6,658 changes on production
  carries either tag (30 Oct). After it, readers read `O` on every project
  change for good.
- Asking "about this file" without a kind returns comments and changes
  together. No app asks that yet.
