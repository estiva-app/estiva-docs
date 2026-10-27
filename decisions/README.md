# Decisions

Why Estiva is the way it is: one record per decision that was hard to make, so
nobody — Miky, Katerina, a company building on the protocol, or an agent in a
fresh session — has to rediscover it, or rebuild an idea that was already
turned down.

Product calls, protocol calls and engineering calls all live here, in one
folder. Every record opens on the person it affects. This folder is in the
public repository and is not published on docs.estiva.app.

## Statuses

| Status | Means |
| --- | --- |
| Proposed | Written down, not decided. It binds nobody, and nothing is built on it. |
| Accepted | Decided by Miky (or Katerina, for how a screen looks). Build to it. |
| Rejected | Decided against. Kept, so the idea is not proposed again without new facts. |
| Superseded by `<name>.md` | Was Accepted; a newer Accepted record replaces it. |

## When to write one

Write a record only for a decision that is **hard to undo**, would be
**surprising without its context**, and was **a real trade-off** between options
that each had something going for them. Anything else stays a comment at the
code or a Decided line on its issue. When unsure, write it as Proposed: Miky's
accept or reject settles the bar too.

## The rules

- **Names, not numbers.** A record is `decisions/<kebab-case-name>.md`, named
  for what it decides (`relay-is-canonical.md`). 0001 and 0002 keep the names
  they had, because much links to them.
- **A Proposed record binds nobody and is never built.**
- **An agent never accepts its own record.** `Decided by` names the person who
  decided and where they said so: an issue, a session, a PR.
- **Only Miky merges a change to `decisions/`.** An agent writes the record and
  reviews the pull request, then gives him the link; it never merges one
  itself, whatever the record's status. His merge is what puts a record on
  `main` (Miky, 2026-10-15, DEC-7).
- **Rejected records are kept.**
- **A decided record is never rewritten, only superseded.** Write a new record
  with `- Supersedes: <old>.md`, and change only the old one's Status, to
  `Superseded by <new>.md`. A fix that changes no meaning may be made: a
  typo, a link moved to where the same document now lives, or the metadata
  lines brought to this folder's format.
- **Never describe a security gap that is not fixed yet.** A decision that
  closes one can be recorded now, linking the issue that carries it out and
  saying nothing about how things stand until then. Anything that would
  describe the gap, such as the earlier call the decision replaces, is written
  once the fix has shipped (Miky, 2026-10-15).
- **A brief is published once it is answered.** When a record is decided, the
  brief Miky decided on goes in `briefs/` beside it, as the HTML page it was,
  and the record links it, after the same check for unfixed gaps. A brief still
  waiting on Miky stays out of the repository (Miky, 2026-10-15).
- **A brief asked of Miky is a Proposed record.** The record is written under
  the name it will keep, and its pull request handed to Miky, when the brief
  page is asked; once he merges it, it is listed as waiting on him; it follows the rule on security gaps above. On his
  answer the record goes Accepted in a pull request, and his merge of it is the
  accept, with `Decided by` naming the brief and where he answered; the options he turned down become its
  Rejected alternatives; the brief goes in `briefs/` and the record links it.
  The issue's Decided line links the record. A brief that describes a gap not
  fixed yet is published by the issue that closes the gap, which reads it again
  first. A brief whose call is below the bar for a record is published on its
  own and listed here:
  - [`briefs/unit-tests.html`](briefs/unit-tests.html): keep the unit tests,
    and how new tests get in (Peek and Ship, 14 Oct).

## The template

Copy [`template.md`](template.md). The title is the decision as a sentence.
Then the lines `Date`, `Status`, `Decided by` and `Area`, and five sections in
this order:

1. **Who it affects** — what Miky, Katerina or an outside company see or can do
   because of it, and the real moment it came up in, if there was one.
2. **Context** — what was true and what forced the choice.
3. **Decision** — what we do.
4. **Rejected alternatives** — what was considered and why it was not taken.
5. **Consequences** — what gets easier, harder, or now hard to undo.

CI (`scripts/decisions.test.mjs`) refuses a record with a missing or misordered
section, an unknown Status, a bad Date, no person in `Decided by`, a numbered
name, a link that goes nowhere, or a record superseded by one that is not
Accepted. It also checks that every record is listed below, under its Area.

Code points to its record with a comment, `why:
https://github.com/estiva-app/estiva-docs/blob/main/decisions/<name>.md`. The
app repositories are private, so this CI cannot see them:
`node scripts/decision-pointers.mjs <repo>` checks that every pointer in a
repository names a record on `main` that is Accepted. Run it on the pull
request's repository before merging one that adds or moves a pointer.

# Records by area

An Area is what the call is about, not what kind of call it is: a product call
and a protocol call about Folders both go under Folders. A new area is a new
heading here.

## People

- [Someone you remove loses access the moment the removal lands](someone-you-remove-loses-access-at-once.md) — Accepted, 2026-10-14
- [A person's link carries their key: /person/katerina-npub1…](person-links-carry-the-key.md) — Accepted, 2026-10-14
- [A person's link names their handle: /person/katerina](person-links-name-the-handle.md) — Superseded by the one above, 2026-10-03

## Folders

- [Folders belong to the protocol, not to any app: every app gets the same Folder operations from SPEC](folders-belong-to-the-protocol.md) — Accepted, 2026-09-25
- [A Folder is a group the relay keeps a listing for; every other group is only a conversation space](a-folder-is-a-group-the-relay-lists.md) — Accepted, 2026-10-02
- [A Folder never holds another Folder: there is one level](folders-are-one-level-deep.md) — Accepted, 2026-10-02
- [Moving a file to another Folder never changes who can read it, and its sub-files move with it](moving-a-file-never-changes-who-can-read-it.md) — Accepted, 2026-10-02
- [A conversation belongs to the file it is about, not to the Folder it was filed in](a-thread-belongs-to-what-it-is-about.md) — Superseded by "A comment, or a file created under another file, is stored with it", 2026-10-19
- [Only a Folder's owners and admins can rename or archive it, and its name is the relay's channel name](only-owners-and-admins-rename-or-archive-a-folder.md) — Accepted, 2026-10-03
- [It is called a Folder; "team" is not a second name for it](a-folder-is-called-a-folder-never-a-team.md) — Accepted, 2026-09-25
- [Who can read a file is decided on the file, and Folders are labels](folders-are-labels.md) — Proposed, 2026-10-14; parked until the navigation rework
- [A comment, or a file created under another file, is stored with it, so only that file's readers can read it](what-belongs-to-a-file-is-stored-with-it.md) — Accepted, 2026-10-19
- [A Folder two companies share is kept on both companies' relays, and the company that started it runs it; each company decides about its own people and their words](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md) — Accepted, 2026-10-26
- [Only a group's owners and admins make it a Folder; DMs and workflow channels never become one](only-a-groups-owners-and-admins-make-it-a-folder.md) — Accepted, 2026-10-27

## Read state

- [You are told about the files you are a member of, the same in every app, and following is retired](membership-replaces-following.md) — Accepted, 2026-09-30
- [A Folder has no read state of its own: its chat is unread for you only when a message names you](a-folders-own-chat-is-unread-only-for-a-mention.md) — Accepted, 2026-10-01
- [A reply is read only when you open its thread, not when you read the conversation it sits in](a-reply-is-read-only-when-its-thread-is-opened.md) — Accepted, 2026-10-03
- [Anyone may add a person to a file, including someone who left it](anyone-may-add-a-person-to-a-file.md) — Accepted, 2026-10-06
- [A mention in a file's text adds the person, as the Add button does, and being added shows no unread until a document has its own read state](a-mention-in-a-files-text-adds-the-person-with-no-unread.md) — Accepted, 2026-10-20
- [A mention in a file's text adds the person, as the Add button does, and being added shows one unread](a-mention-in-a-files-text-adds-the-person.md) — Superseded by the one above, 2026-10-20
- [A person mentioned in a file's text is told once and becomes a member, and a later save that still names them changes nothing](a-person-mentioned-in-a-files-text-is-told-once.md) — Superseded by the one above, 2026-10-20

## Messages

- [An urgent mention is a tag beside the person's mention, and the text stays an ordinary mention](an-urgent-mention-is-a-tag-beside-the-mention.md) — Accepted, 2026-10-02
- [@, !@, [ and / are one shared kit for every app's composer, not built inside an app](composer-triggers-are-one-shared-kit.md) — Accepted, 2026-10-02
- [Edit and Delete are offered only on your own message, in every app](edit-and-delete-are-offered-only-on-your-own-message.md) — Accepted, 2026-10-06
- [Peek and Ship may each choose when to offer Edit and Delete, and converge once they share one library](each-app-chooses-its-own-edit-and-delete-rule.md) — Superseded by the one above, 2026-09-21
- [What you do shows at once; if the relay refuses it, it is taken back with a note and what you typed comes back to you](a-refused-action-is-undone-and-your-text-comes-back.md) — Accepted, 2026-10-07
- [A file's Activity lists only the places that mention it, never the conversations of the files under it](activity-lists-only-mentions-from-elsewhere.md) — Accepted, 2026-09-20
- [A chat message belongs to the protocol, like a comment, and no app owns it](a-chat-message-belongs-to-the-protocol.md) — Accepted, 2026-10-15
- [A conversation is one shared thing that looks and works the same in Peek, Ship and Leaf, and only its colours are each app's own](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md) — Accepted, 2026-10-20
- [Every app writes comments and chat with one shared comment box and reacts with one shared reaction row, and the cards stay each app's own](every-app-writes-and-reacts-with-one-shared-box.md) — Accepted, 2026-10-16; its part "the cards stay each app's own" superseded by the one above, 2026-10-20
- [An archived file is read-only in every app: no new comment, reply or reaction, and no edit or delete, until it is unarchived](an-archived-file-is-read-only-in-every-app.md) — Accepted, 2026-10-20; its part "or when every Folder listing it is" superseded by the one below, 2026-10-23
- [A file is archived with the closest archived file above it, at any depth, and its line names that file by its kind; whether a Folder's archive freezes the files it lists waits for Folders as labels](a-file-is-archived-with-the-closest-archived-file-above-it.md) — Accepted, 2026-10-23
- [A comment is the same object in every app; suggestions, review verdicts and an agent's assertions are objects of their own beside it](a-comment-is-the-same-object-in-every-app.md) — Proposed, 2026-10-16
- [An edit is the whole new message, its words and its files, so an edit with no files takes every file off](an-edit-is-the-whole-new-message.md) — Accepted, 2026-10-26
- [An edit says what the message links now, so a file lists a comment while its latest words link it](an-edit-says-what-the-message-links-now.md) — Accepted, 2026-10-27
- [Nobody deletes a whole DM; each person deletes only their own messages](nobody-deletes-a-whole-dm.md) — Accepted, 2026-10-27

## Links & widgets

- [A file's address is the same in every app with only the host changed, every app answers it, and a pasted one is that file on any Estiva app's host](a-files-path-is-the-same-on-every-apps-host.md) — Accepted, 2026-10-20
- [A link to a file is stored as the URL a person wrote, in descriptions and in messages](a-link-is-stored-as-the-url-a-person-wrote.md) — Accepted, 2026-10-14
- [A link pasted into a message is sent as Estiva's internal reference, not the link](a-pasted-link-in-a-message-is-sent-as-the-reference.md) — Superseded by the one above, 2026-10-13
- [Where a link sits decides how it draws, and one file's card is added under a message: a link on words counts as naming its file](a-link-on-words-counts-toward-the-card.md) — Accepted, 2026-10-17
- [Where a link sits decides how it draws, and one file's card is added under a message: a part counts, a person or a Folder alone on its line stays a chip](where-a-link-sits-and-which-file-gets-the-card.md) — Superseded by the one above, 2026-10-16
- [Where a link sits decides how it draws: a chip in a sentence, a row alone on its line, and one file's card under the message by default](where-a-link-sits-decides-how-it-draws.md) — Superseded by the one above, 2026-10-15
- [Every link draws as a chip, and its author chooses a card with an `embed` tag they can change after sending](the-author-chooses-a-links-card.md) — Superseded by the one above, 2026-10-15
- [A file's summary is its own short field beside the title, not part of its description](a-files-summary-is-its-own-field.md) — Accepted, 2026-10-15
- [A shared part of a page is a selected run of whole blocks, and it stays live as the page changes](a-shared-part-of-a-page-is-a-selected-run-of-blocks.md) — Accepted, 2026-10-09
- [While editing a document, a link alone on its line opens a menu with Open and Show as Row or Card; a chip in a sentence offers Open only](a-lone-links-chip-menu-offers-row-or-card.md) — Accepted, 2026-10-19
- [While editing a description, clicking a chip opens a menu, Open and its card, and a fresh link opens it by itself](clicking-a-chip-while-editing-opens-a-menu.md) — Superseded by the one above, 2026-10-14
- [Another app's file is labelled by its type ("Topic", "Issue"), and the app's name only says where it opens](a-file-is-labelled-by-its-type-not-its-app.md) — Accepted, 2026-10-02

## Files

What a file is on the wire, for any app and any company: its type, its
properties and its history.

- [A file's type is a shared meaning with its own number, which any app extends with its own properties; what no other app shares yet is a record; and the relay keeps each file's current state, so its changes become its history](a-files-type-is-a-shared-meaning-any-app-extends.md) — Accepted, 2026-10-26
- [Estiva curates the shared types in public, in a directory of types any builder starts from, and the optional App Store's review helps builders agree but forces no one](estiva-curates-shared-types-in-a-public-directory.md) — Accepted, 2026-10-26
- [A type of file and its properties are defined by an app's listing or by a person's database, in one schema shape; app types come first, and people's databases come with the Notion-like app](an-apps-listing-or-a-persons-database-defines-a-type.md) — Accepted, 2026-10-26
- [A file keeps every change and every text save for good, and has a History panel that shows them](a-file-keeps-every-change-for-good.md) — Accepted, 2026-10-26

## Documents

- [A document is its own type of file, which any app may own; Leaf owns it first](a-document-is-its-own-type-of-file.md) — Accepted, 2026-10-14
- [A file's text is stored as a readable snapshot, and the last save wins; live co-editing comes later, on top](a-files-text-is-a-readable-snapshot.md) — Accepted, 2026-10-13; its part "written as a change to the file's `description` field" superseded by "A file's type is a shared meaning", 2026-10-26
- [A comment on a selection remembers the words where it starts and where it ends, and a comment on whole blocks remembers no words](a-comment-remembers-where-its-selection-starts-and-ends.md) — Accepted, 2026-10-15
- [A comment points at a run of blocks, narrowed by the words quoted at its ends](a-comment-points-at-blocks-and-the-words-quoted.md) — Accepted, 2026-10-13
- [A reply to a comment on part of a page remembers that part too, so its thread keeps its place when the comment is deleted](a-reply-on-a-page-keeps-its-threads-place.md) — Accepted, 2026-10-19
- [Any app may change a file from its card through an action the file's own app shares; Leaf also writes the title, summary and text of any file whose app shares each; the owner keeps a field to itself by not sharing it](a-card-changes-what-a-files-app-shares.md) — Accepted, 2026-10-21
- [Leaf writes the title, summary and text of any file whose own app shares each, as Peek shows every file's conversation; the file's own app keeps its other fields, its name and where it opens, and a topic has no text](a-document-app-writes-what-a-files-app-shares.md) — Superseded by the one above, 2026-10-21
- [Leaf edits the text of any file whose own app shares it, as Peek shows every file's conversation; the file's own app keeps its name, its fields and where it opens](a-files-text-is-shared-by-every-app.md) — Superseded by the one above, 2026-10-19
- [Every app edits and reads a document with one shared editor, and its links draw with the kit's chip, row and card](every-app-edits-a-document-with-one-shared-editor.md) — Accepted, 2026-10-19

## Apps & agents

- [An app speaks for a file type only once the workspace has added it, and with no app added, nobody does](an-app-counts-only-once-the-workspace-adds-it.md) — Accepted, 2026-10-03
- [A file's id is unique across every file type and author, deleted files included](a-files-id-is-unique-across-every-kind.md) — Accepted, 2026-10-03
- [Claude learns each app from the app's own manifest, and what it must know about the app goes in a guide there](claude-learns-each-app-from-its-manifest.md) — Accepted, 2026-10-13
- [Which kinds an agent may sign is an admin's explicit grant per app, never derived from the apps](an-agent-signs-for-an-app-only-by-an-admin-grant.md) — Accepted, 2026-10-13
- [An app may offer another app's "New …", and the app that owns that kind makes the file](another-apps-new-file-is-made-by-that-app.md) — Accepted, 2026-10-16; its part "the app that owns that kind makes the file" superseded by "A file's type is a shared meaning", 2026-10-26
- [An app that owns a "New …" declares a create link in its manifest, and a launcher opens it](an-app-declares-a-create-link-for-its-new-action.md) — Accepted, 2026-10-19
- [An agent says it is an agent in its own profile (NIP-24 `bot`), and Estiva ID publishes it](an-agent-says-it-is-a-bot-in-its-profile.md) — Accepted, 2026-09-24
- [Removing an agent from a Folder keeps it out, even while the person it works for is in](removing-an-agent-from-a-folder-keeps-it-out.md) — Accepted, 2026-10-27
- [The person an agent works for can end that at once, and the relay cuts the agent off](an-agents-owner-ends-its-access-at-once.md) — Accepted, 2026-10-27

## Devices & sessions

- [Signing in to Estiva ID is plain OAuth 2.0 with PKCE, and Estiva's own request format is retired](sign-in-is-plain-oauth.md) — Accepted, 2026-10-16
- [Peek keeps a plain copy of what it read on the device, until you sign out](peek-keeps-a-plain-copy-on-the-device-until-sign-out.md) — Accepted, 2026-10-14
- [Peek keeps no copy of what it read once the page reloads](peek-keeps-nothing-after-a-reload.md) — Superseded by the one above, 2026-10-07

## Infrastructure

- [Relay-canonical by default; an app database is an exception](0001-relay-canonical-by-default.md) — Accepted, 2026-08-22; its part "share the wire format, never the interpretation", as far as it covers the fold, superseded by "A file's type is a shared meaning", 2026-10-26
- [Foundation packages: one repo, public npm, built ESM, and a named owner for a break](0002-foundation-packages.md) — Accepted, 2026-08-26
- [The block editor is shared: its translation lives in @estiva-app/protocol and its editor nodes in @estiva-app/ui/editor](the-block-editor-kit-lives-in-protocol-and-ui.md) — Accepted, 2026-09-30

## Search

- [Search matches every typed word as the start of a word; quotes ask for an exact phrase and a minus leaves a word out](search-matches-every-word-as-a-word-start.md) — Accepted, 2026-10-19
- [A minus before a quoted phrase leaves out anything with those words next to each other](a-minus-before-a-phrase-leaves-the-phrase-out.md) — Accepted, 2026-10-19

## Protocol

- [A shape left over from early experiments is migrated or deleted, never kept on the relay for compatibility](early-shapes-are-migrated-or-deleted.md) — Accepted, 2026-09-15
- [The Specification states what a relay and an identity service must do, and Estiva hosts the only deployment](estiva-hosts-the-only-deployment.md) — Accepted, 2026-10-02
- [RFCs are no longer a kind of document: what is still true moves into the Specification and a builder's guide](rfcs-are-retired.md) — Accepted, 2026-10-02
- [A copy of an app holds one workspace, which the sign-in picks and a company's own address picks for you; a sign-in is good for that one workspace, and a person has one name and picture in all of them](the-sign-in-picks-the-workspace.md) — Accepted, 2026-10-26
- [A relay too busy to answer says it is busy, at every door; a host it does not know still gets the same answer as before](a-busy-relay-says-it-is-busy.md) — Accepted, 2026-10-27

# Research

Spikes and measurements a decision leaned on. They are not records and have no
status.

- [Do `screenerItems` and `deskOpenWork` need an index, or are they a fold?](research/SHR-7-screener-and-desk.md) — SHR-7, 2026-09-16
