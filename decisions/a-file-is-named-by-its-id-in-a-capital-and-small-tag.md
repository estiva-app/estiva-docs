# A file is named by its id in a new pair of tags, a capital one for "about it" and a small one for "mentions it", and a chip picked from a menu is saved as the file's link

- Date: 2026-10-29
- Status: Accepted
- Decided by: Miky, in the shaping session of "A load stays the same size as edits pile up: projects" (2026-10-29), on the brief "Pointing at a file" ([page](briefs/pointing-at-a-file.html)): option 1, as recommended; and, in the same session at the review of estiva-docs#349, that a picked link carries only the file's id
- Area: Files

> Supersedes in part
> [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md)
> ("in one single-letter tag that every comment, mention, listing, unread
> state, card and chip uses": it is one letter in two cases, and a chip in
> text is the file's link) and
> [a-link-is-stored-as-the-url-a-person-wrote](a-link-is-stored-as-the-url-a-person-wrote.md)
> ("a pick from the `[` menu or Cmd+K still inserts the `nostr:` reference":
> it now inserts the file's link, which also answers the question that record
> left open). The rest of each stands.

## Who it affects

Nothing changes on Miky's or Katerina's screen. One thing differs: a chip
picked from the `[` menu or Cmd+K is saved as the file's link, so a copied
message carries a link that opens, as a pasted one already does.

An outside company asks three plain questions, each with one meaning: the
comments on this file, everything that names this file, and the comments on
any file of a type, such as every project, or its own `acme.candidate`.

It came up while shaping the project's first stage on 29 Oct: the Accepted
record had left the letter open, and the protocol pre-review found that one
letter is not enough.

## Context

- The Accepted record (D1) says one reference names a file everywhere, its
  workspace-unique `d`, "in one single-letter tag". The letter was left open.
- "About it" and "mentions it" differ by the tag's case today: a comment's
  capital `A` is the file it is about, a small `a` that differs from it is a
  file it mentions (SPEC §6.4). Nostr's comments (NIP-22) need both cases, each
  with its `K`/`k`. One letter in one case would lose that.
- A chip in text encodes the file's type number and author's key
  (`nostr:naddr`). A file the relay keeps (NIP-AR) is saved by anyone, has
  neither in its name, and is not an addressable event, so no `naddr` names it
  truly. A typed or pasted link carries only the id and keeps working.
- The 14 Oct record kept the `nostr:` reference for a pick from `[` or Cmd+K
  because "those picks have no link to keep". A file whose app publishes a
  link has one to keep.
- No NIP uses `o` or `O`, nor does our SPEC or relay; the relay filters by any
  one-letter tag (checked 29 Oct, on the brief).

The brief Miky decided on:
[briefs/pointing-at-a-file.html](briefs/pointing-at-a-file.html).

## Decision

- A comment about a file carries `["O", <d>]` with `["K", <type>]`, such as
  `osnova.project`; a top-level comment also carries `["o", <d>]` with
  `["k", <type>]`, as NIP-22's parent equals its root.
- Anything that mentions or lists a file carries `["o", <d>]`: a message beside
  the link in its text, a Folder's listing, who is on the file (kind 1851
  `member:<P>` targeted by `o`, SPEC §11.8), and block links and cards (`part`
  and `embed` take `<d>`, §13.6.1–§13.6.2).
- A chip in text is the file's link. A pick from `[` or Cmd+K inserts the
  app's link form that carries only the file's id, never its title (Ship's
  `/#/project/<d>`), so someone who cannot open the file learns nothing from
  the message and a rename leaves nothing stale (§13.1, C25). A pasted link
  stays as the person pasted it. A type whose app publishes no link has no
  chip in text.
- Unread state keys a file by its id, which looks like a Folder's; the SPEC
  adds the rule that tells the two apart (§11.1).
- The pair is proposed upstream with the SPEC text, beside NIP-AR, as a fourth
  thing a comment can be about. What Block or Nostr's comment standard refuses
  we carry as our own rule.

Carried out by the project "A load stays the same size as edits pile up:
projects", in the SPEC and in every app, for projects first.

## Rejected alternatives

- **A picked chip saves the readable link** (`/project/<slug>-<d>`, as the
  brief drew it). Copied text reads better, but anyone in the conversation,
  a partner company's relay included, could read the title of a file they
  cannot open, it stays after a rename, and the person picking never sees that
  a title went into the message. Today a reader without access sees only a
  locked chip.

- **Borrow Nostr's tag for things outside Nostr** (`["I", "osnova:<d>"]`,
  `["K", "osnova"]`, NIP-73). Plain Nostr comment apps would thread our
  comments, as comments on an outside thing they cannot open, which no business
  reader uses. The price: a file on our own relay is filed as "content outside
  Nostr" in every event, every app parses a prefix, and the type can only say
  "osnova", so nobody can ask for the comments on every project. Putting the
  type in the prefix would not fix that: converting a file would rename it.
- **Keep today's address tag** (`["A", "45010:<creator>:<d>"]`, `naddr` chips).
  Least new code, and picked chips would keep the internal form. But it breaks
  Nostr's base rule (NIP-01: the address tag points at a record its author
  replaces), every Nostr library would ask for the creator's saves only and
  never see anyone else's, the creator's key stays in every pointer for good,
  and it reverses D1. It saves no re-signing: every pointer is rewritten either
  way.

## Consequences

- One meaning per tag; the SPEC's "about" and "mentions" rule carries over
  letter for letter, and an outside company's own types work the same.
- One-way. Every comment, listing and chip written from the first stage on
  carries it; undoing it means re-signing each by its own author, and unread
  state only grows, so a wrong unread key stays.
- A plain Nostr comment app shows no thread for our files.
- After a type converts, older comments still name the old type, so a
  comment's `K` is a hint, not the file's type.
- Drawing a link as a chip needs the app's link rules, as the 14 Oct record
  already accepted. A chip picked from now on copies out as a link that
  opens.
- Not decided here: what happens to chips already in old signed messages,
  republished or left dead.
