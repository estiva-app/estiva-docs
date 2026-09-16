# ADR 0001 — Relay-canonical by default; an app database is an exception

- **Status:** accepted
- **Date:** 2026-08-22
- **Applies to:** every app-layer product in the suite — Peek, Ship, Leaf, and any app after them
- **Does not apply to:** Estiva ID (see §4)

---

## 1. Context

Peek runs on Convex. Ship has no backend at all — it reads the relay and folds
events in the browser. Estiva ID has its own Postgres. Three apps, three
different answers, none of them a decision anybody made on purpose.

Leaf is next, and the question that prompted this ADR was not "should Peek keep
Convex" but **"what should a new Estiva app do by default?"** Without an answer
written down, the default is set by reflex: a developer starting a React app
reaches for a backend-as-a-service, because that is the normal instinct and
because Peek is there as precedent. That is exactly how Peek got Convex.

The reflex is hard to reverse. **Adding a backend later is easy; removing one is
a rewrite.** So the default matters more than any individual app's choice.

## 2. Decision

**A new app has no backend of its own.** Data goes on the relay.

An app acquires its own database only when a specific, shipped feature
demonstrates it needs one — meaning it needs a **query, an index, aggregation
across records, server-side compute, or size**. The need must be shown by a
feature, not anticipated during design, and preferably measured.

**"Only this app reads it" is not sufficient grounds for a database.** That
conflation is what made the suite's ownership claim only half true: Peek's
starred containers, curated desk work and screener queue sit in a deployment the
person cannot export, archive or delete.

## 3. The three-layer rule

Two questions, in order, for any piece of state:

1. **Does another app need to see it?** → **layer 1**: the relay, standard kinds.
2. **Otherwise, would the person reasonably expect to own, export or take it
   with them?** → **layer 2**: the relay, `kind:30078` with an app-namespaced
   `d_tag`, NIP-44 encrypted. See the app-private storage convention.
3. **Otherwise, and only if it needs a query, an index, aggregation,
   server-side compute or size** → **layer 3**: the app's own database.

Layer 2 is not speculative. `kind:30078` is NIP-78 arbitrary app data; the relay
performs no `d_tag` validation on it, the NIP-RS handling is a narrow predicate
matching only `read-state:<32 hex>`, and **Buzz already stores its own mesh
member status this way** — a `BOOKMARK_SET` under a namespaced `d_tag`.

Layer 3 is permanent and legitimate. It will grow as apps ship features that
genuinely need it, and Convex may well be the right tool. The rule is only that
apps do not *start* there.

## 4. Estiva ID is excluded, and it is not a close call

Estiva ID custodies the private keys that sign for the relay. Its Postgres holds
KEK envelopes, passkey credentials, authorization codes and audit events. None of
that can live on the relay, because the relay's trust rests on it.

Estiva ID is **infrastructure, not an app**. Asking whether it should adopt an
app-layer backend convention is a category error, and this ADR does not.

## 5. Why Peek is not the precedent it appears to be

Peek adopted Convex before three things existed. Each was a real reason at the
time; none survives:

| Reason Convex was needed | What changed |
| --- | --- |
| The relay could not push live data to a browser | A WebSocket client with NIP-42 AUTH does exactly that. `wss://estiva.estiva.app` accepts an upgrade and sends an AUTH challenge today. |
| There was no home for per-user app state | Layer 2 — `kind:30078`, app-namespaced, encrypted. |
| There was no substrate for document-shaped data | Relay git hosting is live (§6). |

So "Peek has Convex, why can't Leaf?" has an answer: Leaf would be choosing it
with none of Peek's reasons.

This ADR does **not** require removing Convex from Peek. What causes harm there
is the *duplicate* — Convex holding a second copy of relay content, which is what
its projection layer exists to maintain and where its reliability problems came
from. The rule that applies to Peek is narrower and enforceable per change:

> Convex may never be the source of truth for something the relay owns, and never
> the only home for something a person would reasonably expect to own.

## 6. Documents use relay git — decided, and recorded elsewhere

For Leaf specifically, the substrate is **git hosted on the relay**, not
addressable events and not a database.

This was already settled. The reasoning is in
[`../protocol/FILES_ARCHITECTURE.md`](../protocol/FILES_ARCHITECTURE.md), and the
draft it supersedes is at
[`../protocol/nips/NIP-FC.md`](../protocol/nips/NIP-FC.md), marked
`superseded — do not propose`. The decisive point:

> NIP-33 addresses are `(pubkey, kind, d)`, so a File edited by two people is two
> addresses. […] **Git solves exactly this, and has for twenty years.** […] That
> one fact is close to decisive on its own.

Git hosting is live — `GET /git/{owner}/{repo}/info/refs` returns
`401 missing Authorization header`, so the route exists and is NIP-98 gated. And
permissions are already unified: **channel role = repo role**, so a document's
access *is* its Folder's membership. One permission model, not two.

A Leaf built on a database would reimplement merge, history, folders and access
control that are already deployed.

Both documents were moved here from `peek-app/docs/buzz-compat/` on 2026-08-22,
because by this repo's own test — *if I change code in repo X, does this document
become wrong?* — a conclusion about document substrates does not belong in one
app's repo. Pointer stubs remain at the old paths so existing links resolve.

## 7. Consequences

**Good:**

- The ownership claim becomes true rather than half true. One `authors: [pk]`
  query returns everything a person owns; NIP-IA archives it on offboarding;
  NIP-09 deletes it.
- A new app starts with no infrastructure to provision — no deployment, schema,
  migration, backup or secrets story.
- Fewer places for two sources of truth to disagree, which is where the suite's
  reliability problems have concentrated.

**Costs, accepted:**

- Layer 2 is blob-shaped. No queries, whole-blob replaceable writes, a 64 KB
  content cap, no server-side compute, and last-write-wins on a
  *seconds*-resolution timestamp. An app needing more must either use a CvRDT, as
  NIP-RS does, or take layer 3 deliberately.
- Client-side folding may not scale for every view. Peek's sidebar is the open
  case: computing one unread dot reads every message in a container. That is
  being measured, not assumed.
- Layer 2 requires NIP-44 in Estiva ID, which did not exist when this was
  written.

## 8. A claim in this repo's README that this ADR contradicted — amended

> **Done.** `edeed19` (#17, 2026-08-27) rewrote `README.md` to almost exactly
> the wording proposed below. The sentence there now reads "there is no shared
> database and no private channel between them", followed by a paragraph on
> `@estiva-app/protocol` and the "share the wire format, never the
> interpretation" distinction. This section is kept for the reasoning; there is
> no action left in it.

`README.md` said, when this ADR was written:

> The apps interoperate through published Nostr events and NIP-89 manifests,
> exactly as a third party's app would — there is **no shared database, no shared
> package**, and no private channel between them.

The shared-foundation work deliberately introduces shared **packages** for the
wire format, identity, platform concerns and UI. The README's *intent* survives —
apps still share no database and no private channel, and interop remains as
genuine as a third party's — but the sentence as written becomes false.

**Action, carried out in `edeed19`:** amend the README to say what it means.
Something closer to: apps
share no database and no private channel, and interoperate exactly as a third
party's app would; they may share libraries for speaking the protocol, because a
second hand-written copy of an event-id hash is a divergence the relay notices
and we do not.

The distinction that matters, and which should be stated wherever this comes up:
**share the wire format, never the interpretation.** How an app folds events into
current truth is where apps are *supposed* to differ.

## 9. How this decision is enforced

A document nobody reads changes nothing. Two mechanisms, and the first matters
more:

1. **The scaffold template produces an app with no backend**, with the shared
   packages already wired. Relay-canonical becomes the physical default — you
   have to add a database on purpose. Tracked as SHA-6.
2. **This ADR**, so nobody strips that out of the template without finding the
   reasoning first, and so the "why can't Leaf have Convex" question has a
   permanent answer.

## 10. Related

- Shared foundation packages — SHA-1…6
- App-private storage convention (`kind:30078`) — CRO-11
- Read-context convention — CRO-3
- Convex read-path measurement for Peek — CRO-10
- `protocol/SPEC.md` — the wire protocol this ADR assumes
