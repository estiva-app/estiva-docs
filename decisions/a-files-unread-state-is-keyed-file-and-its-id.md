# A file's unread state is kept under "file:" and its id, so reading a file can never mark a Folder's chat read

- Date: 2026-10-29
- Status: Accepted
- Decided by: Miky, in the kickoff session of "The relay keeps each project's current version, refuses a save made on an out-of-date copy, and lists projects without their text; Estiva ID lets each app sign them" (2026-10-29), on the inline brief "When someone reads a project, how does every app know it read the project and not a Folder's chat?"
- Area: Read state

## Who it affects

Miky and Katerina: reading a project marks that project read and nothing
else, and a Folder's chat stays unread until its own messages are read, in
every app, whatever ids anyone picks for their Folders and files.

An outside company keeping its files on upstream Buzz gets the same, with no
change to its relay, and a partner's relay in a shared Folder cannot make the
two collide either.

It came up at the kickoff of the first stage of "A load stays the same size as
edits pile up: projects", on 29 Oct, after the security review of
estiva-docs#349 and the protocol pre-review of that ticket.

## Context

- Unread state is a per-person blob, encrypted to the person, that only grows
  (NIP-RS; SPEC §11.1, §11.6). No relay can rewrite it, so a key, once
  written, stays in every blob.
- A Folder's chat is kept under its bare channel id, a UUID (SPEC §11.1,
  NIP-RS's grandfathered clause). A file was kept under its bare address,
  `<kind>:<pubkey>:<d>`.
- From the first stage of "A load stays the same size as edits pile up", a
  file is a NIP-AR artifact named everywhere by its id alone
  ([every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md),
  [a-file-is-named-by-its-id-in-a-capital-and-small-tag](a-file-is-named-by-its-id-in-a-capital-and-small-tag.md)).
  That record left "the rule that tells the two apart" to the SPEC.
- A file's id is a UUID, like a channel's. The shared read-state code treats
  any UUID as a channel (estiva-foundation `packages/conversation/src/readState.ts`,
  `isPublishableContextId`), checked 29 Oct.
- Whoever creates a Folder picks its id: the relay makes the channel with the
  `h` a kind:9007 carries (buzz `nfb-demo-kinds`, `handlers/ingest.rs`).
  Upstream NIP-AR refuses a new artifact whose id another artifact has, and
  nothing else (NIP-AR "Identity and edits"). So a bare id could be chosen to
  equal a Folder's, or a Folder created with a file's id.
- SPEC §11.5 lets a comment be about a Folder as a file; under the new
  reference it names the Folder's own id, which is its chat's key, with no
  gaming at all.
- Miky set the bar in the handoff of 29 Oct: the rule must not rest on a
  lookup someone can game by choosing an id.

## Decision

- A file's unread context is `file:<d>`, the file's id after a `file:`
  prefix. A Folder's chat keeps its bare channel id, as NIP-RS requires.
  `thread:`, `msg:` and `reply-floor` are unchanged.
- The key is a fixed function of the comment's `O` tag; nothing is looked up
  to derive it. A key beginning `file:` whose remainder is not a lowercase UUID
  is not a file context, as with `thread:`.
- A comment about a Folder as a file (§11.5) is kept under
  `file:<channel-uuid>`, apart from the Folder's chat.
- A file moved from the old shape reads as unread from the later of its old
  address key and its `file:` key; an app may copy the old value under the new
  key, since that records a read the person did make.
- Our relay still refuses an id already used by any file or channel, deleted
  ones included, as
  [a-files-id-is-unique-across-every-kind](a-files-id-is-unique-across-every-kind.md)
  says, so a link means one file. Unread state does not depend on that refusal.
- `file:` is proposed upstream as an optional NIP-RS well-known scheme, beside
  `thread:` and `msg:`, with the reference and lists without text. If NIP-RS
  refuses it, we carry it as our rule.

Carried out in SPEC §11.1, §11.5 and §11.6 by the issue above, and in the shared
read-state code when the projects move.

## Rejected alternatives

- **The bare id, made safe by the relay refusing a reused id.** One key space,
  no prefix. Correct on our relay, but only while every relay holding
  something the person reads refuses reuse across files and channels: upstream
  Buzz does not, and a partner's relay in a shared Folder cannot be checked. A
  key that collided once can never be split again in a grow-only blob.
- **The prefix without the refusal.** Unread state would be safe, but a link or
  a reference could still mean two things; the 3 Oct record already requires
  one meaning per id.
- **`artifact:` as the prefix.** Upstream's word, but our SPEC and every app say
  file, and `folder:` is already reserved beside it.

## Consequences

- Reading a file can never change a Folder chat's unread, on any relay,
  whatever ids people choose.
- Read-state keys now come in two shapes for files: old address keys stay in
  every blob for good and are read, never written again after a file moves.
- Every app's read-state code learns one prefix; a NIP-RS client that does not
  know `file:` carries the key as opaque, as it does any unknown context.
- One-way: once the first project's comments are read, `file:` keys are in
  people's blobs for good.
