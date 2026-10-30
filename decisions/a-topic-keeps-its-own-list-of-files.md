# A topic keeps its own list of files, one entry per file by its id; a file stays in its Folder's tree and can be in many topics

- Date: 2026-10-30
- Status: Accepted
- Decided by: Miky, in the session shaping the topics stage of "Navigation & structure in Nostr for Business" (2026-10-30), on the brief "How a topic lists its files" ([page](briefs/how-a-topic-lists-files.html)): A, as recommended; the flat lens and a list on any type in the session that followed (2026-10-30)
- Area: Files

## Who it affects

Miky and Katerina put a Ship project, an issue or a Leaf document into a topic,
from any Folder, and see it on the topic, on Peek's Topics screen and as a
"Topics: …" line in Ship and Leaf. Whoever runs a topic decides what is in it;
the file's own editors are not asked, because listing grants nothing.

An outside company lists its own types in a topic without changing them, and
may give its own type a list the same way (an initiative, say).

It came up on 29 Oct: "the navigation is a mess with zillions of small files,
usually tasks from Ship; simple topics that group files under them would make
it so much more digestible" (Miky). Their example is the Widgets topic, with two
Ship projects and Katerina's Leaf document "Testing Widgets".

## Context

- Only a Folder keeps a list of files: the relay-signed `kind:30890`, built from
  `kind:1852` commands, which the relay refuses for anything that is not a
  Folder (SPEC §3, §3.1). A topic is a `kind:30840` with no list (§6.7).
- A file can sit under a topic in the tree only from the topic's own Folder
  (§6.7 "Same Folder"); one does on production (30 Oct).
- A topic is a file, not a group (Miky, 29 Oct). A file's changes are its fields,
  each signed by whoever made it
  ([a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)).
- A file is named by its id
  ([a-file-is-named-by-its-id-in-a-capital-and-small-tag](a-file-is-named-by-its-id-in-a-capital-and-small-tag.md)),
  and a change names its own file with `O` and every other file with `o`
  ([a-change-is-about-its-file-as-a-comment-is](a-change-is-about-its-file-as-a-comment-is.md)).

The brief Miky decided on:
[briefs/how-a-topic-lists-files.html](briefs/how-a-topic-lists-files.html).

## Decision

- "Topics is just lens. The file still lives in Folder (in future we will rename
  to Team). Topic is group of files across different teams." One file can be in
  many topics (Miky).
- A topic keeps its own list: one `kind:1851` change on the topic per entry, in
  the topic's Folder, signed by whoever adds or removes it, with field
  `lists:<d>` = `true` or `false`. It names the topic with `a` and `O`, and the
  listed file by its id in `["o", <d>]`. The newest change per topic and file
  counts (§6.3).
- Any app asks "which topics list this file?" with `{kinds:[1851], "#o":[d]}`,
  folded per topic.
- A topic is a flat lens: its files are its list, wherever each sits in its
  Folder's tree and however deep. Nesting stays in the tree: "the nesting is not
  going anywhere. It's much needed" (Miky).
- `lists:<d>` is a field any type may carry. The first stage reads only topics'
  lists.
- SPEC §6.7 "Changes" gains the field, and §6.4's "lists a file" names it.

## Rejected alternatives

- **C · The file says which topics it is in.** A field set by the file's
  editors, so a topic could not gather files its people cannot edit, and every
  type, an outside company's included, would need the field. Notion's relations
  work this way only because one database syncs both sides.
- **D · No list: a topic's files are the ones its conversation links to.**
  Nothing new on the wire, but a file mentioned once stays forever and cannot
  be removed: a Slack channel's Files tab.
- **The relay keeps a topic's list, as a Folder's.** It would make a topic a
  group, reversing "a topic is a file, not a group" (29 Oct).

## Consequences

- A topic's people curate it, and the list moves unchanged when topics become
  the new file type, provided that reader also reads entries named by `a`.
- A listing is not a mention, not a parent and not a Folder listing: Mentioned
  in, the archive chain and a Folder move ignore it.
- Two-way at today's size: 32 topics and nothing private. It gets harder once
  outside companies write entries we cannot re-sign, or private teams make some
  entries unreadable to whoever migrates them.
- Not yet probed on production: that the relay stores a `1851` carrying `o` and
  finds it by `#o` across Folders, and how fast that is on Miky's workspace.
