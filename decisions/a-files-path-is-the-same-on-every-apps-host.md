# A file's address is the same in every app with only the host changed, every app answers it, and a pasted one is that file on any Estiva app's host

- Date: 2026-10-20
- Status: Accepted
- Decided by: Miky, in the kickoff session of "Ship's address for a project or issue opens it in Leaf too", on the brief "One file, one address, any app's host" ([page](briefs/a-files-address-on-every-host.html)); the serving rule first in RFC 0.5 §7.7, 21 September
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

1. **Every app answers every app's file address.** A type word is the owning
   kind's, on every host. An app that has a view of the file draws it; one that
   has none hands off to the owner. "A 404 or an empty page is not an option."
   SPEC §7.7 takes RFC 0.5 §7.7's serving rules.
2. **A pasted address is that file on any Estiva app's host.** A reader
   accepts a declared file path on any host that some app declares as its own,
   and an app declares `urls` only on its own origin. A click opens the address
   as written, in the app it names. Leaf does not copy its own host for another
   app's file until the shared reader with this rule is in Peek, Ship and Leaf,
   because a message sent before then never counts as a mention.

## Rejected alternatives

- **Only Leaf takes Ship's paths.** One pair of apps agrees and no rule
  exists for anyone else; `leaf.estiva.app/topic/…` would keep showing Home,
  and Peek and Ship already do more.
- **Each app owns its paths and redirects to the owner.** The swap would land
  in Ship rather than in Leaf's view of the file, the opposite of what Miky
  wanted, and it would undo what Peek and Ship do today.
- **Each app re-lists the addresses it serves for other apps' types** (Leaf's
  manifest claiming `/issue/` and `/project/` on its host). The same screen for
  Ship's files at one manifest line, but a many-to-many list every app must
  republish whenever any app adds a type, an outside app's type never
  recognised on Leaf's host until Leaf republishes, and it blurs which app owns
  a type. One-way, since published manifests are copied.
- **Only the owner's address is recognised.** The smallest build, but Leaf's
  address bar and Copy link would differ, and a Leaf address pasted by hand
  would stay a plain link while Ship's draws the issue.

## Consequences

- Leaf serves `/<word>/<slug>-<d>` for every word the manifests declare, and
  owes those paths for as long as its addresses are in people's text.
- The shared link reader and SPEC §7.7 change, with a conformance row
  for a host-swapped address, and Peek, Ship and Leaf take the release before
  Leaf shows or copies its own host for another app's file.
- An outside company declares its file words once and every Estiva host
  answers and recognises them; it must answer theirs in return.
