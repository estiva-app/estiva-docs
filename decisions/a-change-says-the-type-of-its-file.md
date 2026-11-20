# A change says the type of the file it changes, as a comment does, so an app can ask for a person's changes to one type of file

- Date: 2026-11-20
- Status: Accepted
- Decided by: Miky, in the session for ALL-4 "Leaf loads each page as it is now, merges two saves of one page, and brings back a deleted page" (2026-11-20), on the question "How should Home find the Ship issues and projects you edited?"
- Area: Files

## Who it affects

Miky and Katerina open Leaf, and Home lists the pages and the Ship issues and
projects they worked on lately. To find those issues and projects, Leaf's Home
downloads the person's last 200 changes to any file. That is 1.3–1.9 MB on every
cold open, mostly their own page text, which Home throws away because the tree
already lists pages. An outside company has the same need: "my recent changes
to invoices" should be one plain question to the relay.

## Context

- A change (`kind:1851`, SPEC §6.2) names its file by address (`a`) and by id
  (`O`), but not by type. SPEC said so on purpose: "carries no `K`: the `a`
  says the kind" (§6.2, added 2026-10-30 with the topics stage).
- Nostr can filter only on a tag's whole value, so no filter can leave out
  changes whose `a` starts with `30842:`. Without a type tag, Home cannot ask
  for "my changes, except to pages".
- A comment already carries `K` with the type of the file it is on (§6.4).
  The production relay answers `#K` filters: on 20 Nov, `{kinds:[1111], "#K":[…]}`
  returned only events carrying that `K`, and a made-up type returned nothing.
- ALL-4 made Leaf stop downloading old page saves everywhere else (a cold open
  went from 27.5 MB to 3.2 MB). This read is what remains.

## Decision

- Every change carries `["K", <type>]` beside `O`: the type of the file it
  changes, by name (`osnova.document`, `osnova.issue`, `osnova.project`,
  `osnova.topic`, or a builder's own type, §6.1), never a kind number.
- An app asks for a person's changes to some types with
  `{kinds:[1851], authors:[<them>], "#K":[<types>]}`. Leaf's Home asks for the
  types it opens other than pages, so page saves never reach it.
- A reader ignores a change whose `K` is not the type of the file its `a`
  names.
- SPEC §6.2 says so. The writers (the shared interop builders, Leaf, Ship,
  Peek and the agent) and Leaf's Home read are one issue in the project
  "Documents and topics stop downloading every edit".

## Rejected alternatives

- **B · The relay answers "which files did this person change, and when".**
  This would also work on changes written before, so nothing would drop off
  Home. But it is a read only our relay offers: every relay an outside company
  runs would have to build it, where a tag works with any relay.
- **C · Home stops reading the person's own changes and ranks the issues and
  projects the tree lists by their newest change by anyone.** This needs no
  new protocol, but Home would then show what anyone touched, not what you
  worked on, and the agent changes issues all day.
- **D · Keep the read of the last 200 changes and reword ALL-4's first
  Done-when leg.** The read is capped at about 2 MB, but page saves still fill
  it. This is a looser promise than the project's goal.

## Consequences

- Hard to undo: the tag stays on every change written from now on.
- Changes written before carry no `K`. An issue or project someone changed
  only before the writers switch drops off their Leaf Home until they change it
  again. Miky took this cost over B.
- Every writer of changes adds one tag. A change built by the shared interop
  builders gets it in one place; Leaf's own save code, Ship, Peek and the agent
  each add it.
- This reverses SPEC §6.2's "carries no `K`". That was a wording choice in
  the topics stage, not a decided call:
  a-change-is-about-its-file-as-a-comment-is says nothing about a type.
- Comments on production mostly carry `K` as a kind number (`30842`), not the
  type name SPEC asks for. This record does not change that.
