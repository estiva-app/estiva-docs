# Every server keeps every type of file in order, with no second way left; a delete only marks the file and can always be undone; and the old way goes once Miky and Katerina have looked

- Date: 2026-11-20
- Status: Accepted
- Decided by: Miky, in the shaping session of the project "Documents and topics stop downloading every edit" (2026-11-19), the project's `## Decided` lines: the hold, the delete and conformance as three calls, then removing a whole file for good as a fourth in the same session; and in the kickoff session of its issue "The SPEC says every file type is kept in order, and how the list closes" (2026-11-20): a team that ever held a file, and how an app declares Delete
- Area: Files

> Supersedes in part:
>
> - [a-relay-advertises-the-list-read-apart-from-the-switch](a-relay-advertises-the-list-read-apart-from-the-switch.md):
>   its fallback, "An app that reads only `files` still works: it falls back
>   to the old read until the switch", and its consequence "Two-way: a key can
>   be withdrawn, and every app falls back to the read every relay has". After
>   the close every server answers the list read and there is nothing to fall
>   back to. Advertising the list read on its own key, and an app reading with
>   it as soon as it is there, stand until the close.
> - [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md):
>   its consequence "Close to two-way: the order is a rule the relay can stop
>   enforcing". After the close it is one-way.
> - [a-topic-always-has-a-team-and-moves-in-one-action](a-topic-always-has-a-team-and-moves-in-one-action.md):
>   "or deleted" in "A topic leaves a team only by moving to another, or by
>   being archived or deleted". A deleted topic stays on its team's list.
> - [folders-belong-to-the-protocol](folders-belong-to-the-protocol.md):
>   "unlist a deleted file" in §3.3's list of operations. A delete takes
>   nothing off a list, so the operation goes.

## Who it affects

- **Someone building an app or a server on the protocol** reads one rule for
  every file: each change names the one it follows, and a server keeps them in
  order. There is no list of types to ask the server about and no second way
  of reading or writing to build. An app's Delete is declared as what it
  writes.
- **Miky and Katerina**: a page or a topic deleted by anyone can be brought
  back exactly as it was, its sub-pages under it and the topic in its place on
  its team's list. Nobody, an owner or admin included, makes a whole file
  unrecoverable, and a team that ever held a file is archived rather than
  deleted.
- **Every app and the agent** carry one way of reading and writing files once
  the old way goes, so a copy kept on the device ("Leaf opens instantly") and a
  relay's catch-up have no exception left to carry.

Miky, 4 Nov, on the Initiative page: "I think we should first finish the 'A
load stays the same size as edits pile up' for all types of files (issues,
topics, documents) and not just projects."

## Context

- [a-file-is-its-fields-each-kept-in-order-by-the-relay](a-file-is-its-fields-each-kept-in-order-by-the-relay.md)
  is the rule; SPEC §6.13 brought it in type by type, each at its own switch
  (`requires_prev` in NIP-11). On 2026-11-20 the Estiva relay advertises
  `"files": {"requires_prev": ["osnova.project", "osnova.issue"]}`: projects
  switched on 11 Nov and issues on 19 Nov. Documents and topics are next, as
  one stage and at one moment.
- While any type is unswitched, every app and the agent keep two ways of
  reading and writing files, the relay keeps a list of which types are in
  order, and SPEC tells an outside builder to read that list and build both
  ways.
- [a-relay-advertises-the-list-read-apart-from-the-switch](a-relay-advertises-the-list-read-apart-from-the-switch.md)
  let an app read the fast list before the switch, and kept a fallback for a
  relay without it: read every change and fold them.
- SPEC §6.5 said that when a file is deleted the files under it MAY move up
  one level, and §3.3 that a deleted file is taken off each team's list that
  names it. Written for a delete that cannot be undone, both change more than
  the file, so a restore cannot bring back what was there.
- [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md)
  (D3) made a delete restorable, by anyone who may edit the file, and
  [a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)
  left removing a save for good, for a pasted password, to an admin as a
  separate action. Neither said whether that action may remove a whole file.
- SPEC §3.3 lets a team be deleted only once it holds no file, a deleted one
  counting, and named removing a deleted file for good as the way to empty it.
- An app's listing declares each action by the event it writes (SPEC §7.3).
  Delete was declared as a NIP-09 deletion request, which a server keeping
  files in order refuses on a file.

## Decision

1. **The old way goes after a hold.** Documents and topics switch together, at
   one announced moment. Until Miky and Katerina have each looked, after both
   the issues switch and this one, and found nothing missing, a switch can be
   turned back. Then the relay's per-type switches go, and the apps, the
   shared code and the agent drop the path that reads every change and writes
   without order.
2. **A delete touches only the file.** Deleting a file is one change to its
   `deleted` field, by anyone who may edit it. No sub-page is moved under
   another parent and no topic is taken off its team's list: while a page is
   deleted its sub-pages are drawn as if it were absent, and a restore brings
   back exactly what was there.
3. **After the close, every server that speaks the protocol keeps every type
   of file in order and answers the list read.** SPEC keeps no fallback for a
   server that does not; one that does not is not conformant. A new type is in
   order from its first change, as a named type already is.
4. **Nobody removes a whole file for good**, a team's or the workspace's owner
   or admin included: a server refuses a removal that names a file's first
   record, so every deleted file can be brought back. Removing an older change
   for good, for a pasted password, stays an admin's action as SPEC §6.5 says.
   Removing a whole file for good, for a legal or privacy reason, is its own
   later feature.
5. **A team that ever held a file is archived, never deleted.** A server
   refuses to delete a team while any file was filed in it, deleted ones
   included, and says to archive it instead. Only a team that never held a
   file can be deleted.
6. **An app declares Delete as what it writes**: a change of the file's
   `deleted` field with a confirm step, like Archive. A listing that still
   declares a NIP-09 deletion for a file is read the same way, and the
   NIP-09 declaration is left for what is not a file.

SPEC §6.13, §6.5, §6.2, §6.7, §6.14, §3.3, §6.1, §7.3 and §9, KINDS.md and
TYPES.md carry it out (the issue "The SPEC says every file type is kept in
order, and how the list closes"); the relay's half is the issue "The relay
keeps documents and topics in order behind its switch", and the listings' the
issue "The relay, the apps and the agent drop the old way of reading and
writing files".

## Rejected alternatives

- **The list grows.** Documents and topics join the switched types and both
  ways stay in every app. The four base types would stay special for good, and
  an outside builder would have to ask the relay which types are in order and
  build both ways.
- **The old way goes at the moment.** No switch left to turn back for the two
  types. The same end, but no way back while a count could still differ.
- **Kept type by type**, each type's old way removed on its own. The list of
  types stays until the last one, which is this stage anyway.
- **Sub-pages move up** to the deleted page's parent, as §6.5 allowed, and a
  topic leaves its team's list, as §3.3 said. A restore would bring the page
  back empty, and changes signed by the person who deleted it would sit on
  files they did not mean to touch.
- **Sub-pages hide with it.** A delete would take away pages other people
  wrote and still use, though nobody deleted them.
- **A fallback for a server without the list read or without order**, as the
  record this one supersedes in part kept. Every builder would keep a second
  way of reading and writing for a server nobody runs.
- **An owner or admin may still remove a whole file for good.** One action
  would undo the promise that a delete can be brought back, and remove a file
  other people wrote; a legal or privacy removal is a feature of its own, with
  its own rules.
- **A team holding only deleted files may be deleted**, its files left stored.
  Nobody could then open or restore them, since their team is gone: lost in
  practice.
- **Listings keep declaring a NIP-09 deletion**, and SPEC tells every app to
  write the `deleted` change instead. Nothing republished, but the declaration
  an outside builder copies would name an event every server refuses on a
  file.

## Consequences

- One rule for every file, in SPEC and in every app; the files stream has no
  exception left for a device copy or a catch-up to carry.
- One-way once the close ships: a server or an app that drops the old way
  cannot read or write a file without order again. The 649 page changes and
  343 topic changes that name nothing stay as they are, and are folded by
  time as before; the first ordered change of a field names the newest of
  them.
- Until the close, the hold keeps the switch two-way, as before.
- A deleted page's sub-pages stay where they are; every app draws them as it
  draws the children of a parent it cannot read.
- Wider delete: anyone who may edit a topic many people follow may delete it,
  and any of them may bring it back.
- A pasted password stays removable change by change. A secret pasted into
  what a first record itself carries, such as a title written at creation,
  cannot be removed by anyone until the later removal feature; a file a court
  or a person's privacy requires gone waits for it too.
- Test and short-lived teams pile up as archived rather than going away.
- Estiva's listings and the shared code that reads them change their Delete
  declaration; an outside listing that still declares a NIP-09 deletion keeps
  working.
