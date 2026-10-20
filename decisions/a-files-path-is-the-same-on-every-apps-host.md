# A file's address is the same in every app with only the host changed, every app answers it, and a pasted one is that file on any Estiva app's host

- Date: 2026-10-20
- Status: Proposed
- Area: Links & widgets

## Who it affects

Miky, 20 October: after rewriting a Ship issue in Leaf, he changed only the
host of Ship's address for it, opened `leaf.estiva.app/issue/b2d86f1f-…`, and
got Leaf's Home. "The URL should be very much same in Ship and Leaf." The same
moment comes up for anyone who copies Leaf's address for that issue into a
Peek conversation: today it would stay a plain link, while Ship's address for
the same issue draws as the issue.

An outside company building an app on the protocol needs to know what it owes
another app's addresses on its own host, and whether its address for someone
else's file is recognised in a message.

## Context

- On 21 September Miky added "The path is the same on every host" to the
  association RFC (RFC 0.5 §7.7): the path names the file and the host names
  the perspective; an app draws a declared file in its own view or hands off to
  the owning app, and "a 404 or an empty page is not an option". It is in no
  decision record and not in SPEC.
- Peek (FOL-39) and Ship (PRO-22) serve every declared file word that way.
  Leaf knows only `/document/` and `/f/<naddr>` and shows Home for anything
  else (checked on leaf.estiva.app as QA-1, 20 October).
- The RFC's rule 5 says a reader MAY match a pasted link's path on any host
  some manifest declares. Nothing built does: SPEC §7.7 says a consumer MUST
  match the host and the type segment, the shared link reader compares hosts
  exactly, and only Ship declares `/issue/` and `/project/` addresses.
- A link is stored as the URL its author wrote
  ([record](a-link-is-stored-as-the-url-a-person-wrote.md)), and whether a
  message mentions a file is decided once, at send (SPEC C25, §13.6.2).

## Decision

Proposed, on the brief "One file, one address, any app's host"; options as
they stand, recommendation first:

1. **Every app answers every app's file address** (1A). A type word is the
   owning kind's, on every host. An app that has a view of the file draws it;
   one that has none hands off to the owner. SPEC §7.7 takes RFC 0.5 §7.7's
   serving rules.
2. **A pasted address is that file on any Estiva app's host** (2A). A reader
   accepts a declared file path on any host that some app declares as its own,
   and an app declares `urls` only on its own origin. A click opens the address
   as written. Leaf keeps copying the address it copies today until the shared
   reader with this rule is in Peek, Ship and Leaf.

## Rejected alternatives

None yet: the record is Proposed. Considered on the brief:

- 1B, only Leaf takes Ship's paths: one pair agrees, no rule for anyone else.
- 1C, each app owns its paths and redirects to the owner: the swap lands in
  Ship, not in Leaf's view, and undoes what Peek and Ship do.
- 2B, each app re-lists the addresses it serves for other apps' types: the same
  screen for Ship's files, but a many-to-many list republished on every new
  type, and it blurs which app owns a type.
- 2C, only the owner's address is recognised: Leaf's address bar and Copy link
  would differ, and a Leaf address pasted by hand stays a plain link.

## Consequences

- Leaf serves `/<word>/<slug>-<d>` for every word the manifests declare, and
  owes those paths for as long as its addresses are in people's text.
- Under 2A the shared link reader and SPEC §7.7 change, with a conformance row
  for a host-swapped address, and Peek, Ship and Leaf take the release before
  Leaf shows or copies its own host for another app's file.
- An outside company declares its file words once and every Estiva host
  answers and recognises them; it must answer theirs in return.
