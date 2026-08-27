# Nostr for Business — Estiva Protocol, v1.0

**Status:** Descriptive of a running system, 2026-08-18.
**Relationship to prior drafts:** NfB RFC 0.2 and the "Buzz architecture vs
RFC 0.2" note both predate implementation. Neither is superseded wholesale —
RFC 0.2 is still the product thesis and the note is still the build strategy.
This document supersedes them **only on what is built and how it behaves**,
because this one was measured. The layer-by-layer diff, including the two places
the implementation diverged structurally, is in
[RFC-0.2-RECONCILIATION.md](RFC-0.2-RECONCILIATION.md).

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted
as in RFC 2119.

> **Rationale is deliberately absent here.** Every "why" lives in
> [RATIONALE.md](RATIONALE.md). This document is what you must implement; that
> one is why it is shaped this way.

---

## 1. Scope

This specifies what an application MUST do to participate in an Estiva
workspace: to publish objects other Estiva apps can read, to read and act on
objects those apps publish, and to be identified as the same person across all
of them.

It does **not** specify a relay implementation. It specifies what an app may
assume about one. The reference relay is [Buzz](https://github.com/block/buzz).

### 1.1 What this is built out of

| Layer | Component | Standard |
| --- | --- | --- |
| Transport & storage | Buzz relay | NIP-01, NIP-29, NIP-09, NIP-98 |
| Identity | Estiva ID | NIP-01 `kind:0`, NIP-05, NIP-43, Blossom BUD-11 |
| Applications | Peek, Ship, yours | NIP-22, NIP-89 + §7 of this document |

The only genuinely new protocol in this document is **§7, the projection
manifest**. Everything else is composition of existing NIPs.

---

## 2. The workspace is the relay

> A workspace is **not** an object. It is a relay URL.

A Buzz relay resolves a *community* from the request `Host` header, before a
connection is authenticated. Every client pointed at the same relay origin is in
the same workspace, in every app.

- An app MUST NOT publish a workspace, organisation, or index object.
- An app MUST treat its configured relay origin as the workspace boundary.
- An app MUST NOT allow a user to select the relay at runtime as though it were
  a preference. It is deployment configuration.

Objects are **discovered, not indexed**: an app asks the relay for a kind with
no `#h` filter and lets access control decide what comes back. An object in a
Folder you are not a member of is simply not in the response.

---

## 3. The Folder

The Folder is the single container. It is a NIP-29 group, created as a
`kind:9007`.

- A Folder id MUST be a **lowercase UUID v4**. The relay advertises
  `"h_grammar": "uuid-v4-lowercase"` in its NIP-11 document and parses the tag
  with a strict UUID parser. **A malformed id yields no channel rather than an
  error**, surfacing much later as a membership failure — so an app MUST
  validate the id before publishing.
- Every object event MUST carry its Folder in an `h` tag.
- There is exactly one level. A Folder MUST NOT contain another Folder.

### 3.1 One Folder, many projections

The same Folder is a Topic in Peek and a Project in Ship. This is not a link
between two records; there is one container, rendered differently.

Consequently: **pairing is not an operation.** An app that wants its object to
live alongside another app's object creates it *in that Folder*. An event cannot
change its own `h`, so an app that re-points an existing object MUST express
that as an explicit field override, and readers MUST take the **union** of every
Folder an object has pointed at, so previously filed children do not disappear.

---

## 4. Identity

### 4.1 One human, one pubkey

A person is one secp256k1 public key across every app in the workspace. Three
concerns are kept separate and MUST NOT be collapsed:

| Concern | Owner | Revocable? |
| --- | --- | --- |
| **Key** — who can sign | Estiva ID | No. A leaver keeps their keypair |
| **Admission** — who is in the workspace | The relay's member roster | Yes, instantly |
| **Attestation** — the `nip05` handle | Estiva ID | Yes |

Offboarding is therefore two revocations, neither of which requires cooperation
from the person leaving.

### 4.2 Profiles

- An application MUST NOT publish `kind:0`. The identity service is the sole
  publisher, and it refuses kind:0 for every app *before* consulting any
  per-app allowlist.
- An application MUST read `kind:0` for display names and avatars, and MUST NOT
  maintain its own user table as the source of truth for them.
- Profiles do not inherit across community domains. A pubkey that joins a second
  workspace reposts its profile there.

An app therefore renders people it has never met: the names and avatars in Ship
were mostly written by Peek, about people who have never opened Ship.

### 4.3 Signing

An app MUST NOT hold a user's secret key. It builds an unsigned event and posts
it to the identity service's `/sign` endpoint with the user's bearer token.

Tokens are ES256 JWTs where:

- `sub` is the user's **pubkey**;
- `aud` is the app's `client_id`, which selects the signing policy;
- `iss` is the identity service origin, from which
  `/.well-known/jwks.json` is discoverable in the standard way.

`/sign` enforces a per-app kind ceiling and returns
`422 policy_violation / kind_not_allowed` for anything outside it. Two rules are
normative:

1. `kind:0` is refused for every app, unconditionally.
2. `kind:27235` (NIP-98) is constrained by target URL prefix, so the endpoint
   cannot mint HTTP credentials for arbitrary destinations.

**An app's kind ceiling MUST be the union of the kinds it writes for itself and
the kinds declared by every app it offers actions on** (§7.3). Acting on another
app's object means writing that app's kind.

---

## 5. Transport

Apps talk to the relay over its **HTTP bridge**, not a websocket:

| Endpoint | Body | Returns |
| --- | --- | --- |
| `POST /events` | one signed event | `{"accepted": bool, "message": string}` |
| `POST /query` | a bare **array** of NIP-01 filters | an array of events |

Three requirements that are not guessable:

- Every request MUST be authenticated with a NIP-98 `kind:27235` event in an
  `Authorization: Nostr <base64(event)>` header, carrying a fresh nonce.
- **`HTTP 200` does not mean accepted.** A duplicate create returns
  `200 {"accepted":false,"message":"duplicate: channel already exists"}`. An app
  MUST read the `accepted` field and MUST NOT treat the status code as the
  answer.
- `/query` takes an **array** of filters. A single filter object is not valid.

NIP-98 rather than NIP-42 is deliberate: there is no challenge/response, so the
bridge is usable from a request-scoped server runtime that cannot hold a socket.

### 5.1 Timestamps

- `created_at` is in **seconds**, per NIP-01.
- The relay rejects events whose `created_at` is outside roughly ±15 minutes of
  its own clock. An app backfilling historical records MUST NOT expect them to
  be accepted.
- Because `created_at` is seconds, **several events from one client routinely
  land in the same second.** Any ordering that matters MUST carry it explicitly;
  see §6.2.

---

## 6. Objects

An object is a **root event** plus a stream of **change events**.

### 6.1 Root events

A root event carries **immutable facts only**. It MUST NOT carry any field that
somebody other than its author may need to set.

NIP-33 addresses are `(pubkey, kind, d)`, so only an author can replace their own
event. Putting a mutable field on the root makes it editable by its creator
alone — the wrong shape for anything collaborative.

Reference root events:

| Kind | Object | Tag order (normative — it is part of the id preimage) |
| --- | --- | --- |
| `30850` | Project | `d`, `title`, `h`, `[lead]` |
| `30851` | Issue | `d`, `title`, `h`, `[a]`, `[ref]` |

`a` on an Issue is the parent project's address, `30850:<pubkey>:<d>`. `ref` is
a display-only key such as `SHIP-12` and MUST NOT be used for addressing.

### 6.2 Change events

| Kind | Tag order |
| --- | --- |
| `1851` | `a`, `field`, `value`, `h`, `ts` |

- A change event is authored by **whoever acts**, not by the object's author.
- A change event MUST set exactly **one** field. Two fields in one event would
  require a conflict rule for partial application; one field per event requires
  none.
- `content` MAY carry a human-readable note. This is what makes an activity feed
  readable.
- The kind MUST be in the regular range (1000–9999), so every change is stored
  and append-only. A replaceable kind would destroy the history.

**The `ts` tag.** Epoch **milliseconds**. A reader MUST honour `ts` only when it
agrees with `created_at` to the second, and MUST ignore it otherwise. That
constraint is what keeps `ts` from being a new thing to trust: the relay already
bounds `created_at`, and a `ts` pinned inside an already-validated second can
only refine ordering *within* it.

An app that does not implement `ts` still folds correctly, at one-second
resolution.

### 6.3 The fold

Current state is the change stream replayed in order, **last write wins per
field**.

Ordering, most significant first: `ts` (when trusted), then `created_at`, then
event `id` as a stable tiebreak.

- An object with no change events has its **default** state. Defaults are
  declared in the manifest (§7), not assumed.
- A value outside the declared vocabulary MUST be displayed rather than
  swallowed. Another app may have written it, and the manifest's schema is an
  honour system, not an enforcement point.

### 6.4 Conversations

A conversation is a **`kind:9`** NIP-29 stream message posted into the object's
Folder. There is no separate comment kind for this.

| Shape | Meaning |
| --- | --- |
| no `e` tag | a root message — starts a conversation |
| `['e', <root>, '', 'reply']` | a reply in that conversation |
| `a` tag | the object the thread is about |
| `nostr:naddr…` in the body | the same thing, as a person types it |

A thread belongs to whatever anyone in it referenced, at any point. A thread
that mentions an object halfway through is from then on about that object, and
the **whole** thread attaches, not only the message carrying the reference.

`kind:9` messages MUST carry `ts` for the same reason change events do — two
messages in one second read back in the wrong order, which in a conversation is
not a subtle bug.

### 6.5 Deletion and archiving

These have genuinely different reach and MUST NOT be offered as two styles of
the same control.

**Archive** is a change event on an `archived` field. Reversible, attributable,
and available to anyone in the Folder.

**Delete** is a NIP-09 `kind:5`, and three properties are normative:

- It is a **request**. Relays MAY decline; copies held elsewhere are untouched.
- It is **author-scoped**. A relay honours a deletion only from the pubkey that
  signed the original. An app MUST therefore hide the control from non-authors
  rather than offer one that silently fails.
- It removes the **record**, not the work. Children are separate events with
  their own authors; they remain in the Folder.

---

## 7. Cross-app interoperability: the projection manifest

This is the new protocol. NIP-89's `kind:31990` says how to **open** an object
in its owning app. It says nothing about how to **render** one inline, or what
another app may **do** to it. This section adds both.

> **The owner defines the projection.** The publishing app decides which of its
> fields matter; the consuming app decides how they look.

An app that publishes objects other apps should render MUST publish a
`kind:31990` handler information event whose `content` is a JSON document with
`records` and `projections`.

`31989` / `31990` MUST be global — not scoped to any Folder. Discovery has to
work before you are a member of anything.

### 7.1 `records` — how to fold this app's objects

A consumer cannot fold without being told how. Leaving it to convention means
every consumer invents its own rule and they disagree the first time two changes
land in one second — the common case, not the rare one.

```json
"records": {
  "changeKind": 1851,
  "targetTag": "a",
  "fieldTag": "field",
  "valueTag": "value",
  "order": ["ts", "created_at", "id"],
  "rule": "last-write-wins-per-field",
  "orderingTrust": "ts is epoch-ms and MUST be ignored unless it agrees with created_at to the second",
  "hiddenWhen": { "field": "archived", "equals": "true" }
}
```

### 7.2 `projections` — how to render an object

A projection names a widget and fills its slots. A slot draws its value from
exactly one source:

| Source | Meaning |
| --- | --- |
| `{"tag": "title"}` | a tag on the root event |
| `{"field": "content"}` | a top-level event field |
| `{"fold": "status", "default": "todo"}` | a field produced by folding change events |
| `{"fold": "lead", "tag": "lead"}` | folded, **seeded** from a root tag |

Three rules learned from writing a consumer rather than from reading a spec:

1. A mutable field MUST be declared as a `fold`, never as a `tag`. Declaring
   status as a tag makes every consumer render an empty status forever, because
   the root event deliberately has no status tag (§6.1).
2. A slot MAY be **both** `fold` and `tag`. A project lead starts as a tag on
   the root and is later overridden by change events. Tag alone goes stale the
   first time somebody reassigns; fold alone loses the creation value.
3. `as: "pubkey"` marks a slot whose value is a pubkey, so the consumer resolves
   it through `kind:0` rather than printing hex.

Widgets are `card`, `row`, `table`, `stat`. The consumer owns the layout.

### 7.3 Actions

A manifest MAY declare actions a consuming app can take on the object. An action
is expressed as a change event of the owner's `changeKind` — so **the consumer
must be permitted by the identity service to sign the owner's kind** (§4.3).

This is a ceiling, not a grant of meaning: it says an app *may sign* the kind,
not that it decides what one means. The relay still applies its own membership
and authorization checks.

#### `alsoRead` — the kinds an action *used* to emit

An action's `emits.kind` is the single kind a consumer publishes. It MAY also
carry `alsoRead`, a list of kinds the owner has published in the past:

```jsonc
"emits": { "kind": 1111, "scope": "address", "alsoRead": [9] }
```

A consumer MUST publish under `kind` alone, and MUST read the union of `kind`
and `alsoRead`.

**Why it exists.** An app that changes the kind it emits does not move the
events it already published, and often *cannot* — a `kind:9` message is not
replaceable at all, so its history is fixed permanently. A consumer reading only
the declared kind then shows an object's newest comments and silently drops
every earlier one: a thread that begins in the middle, with nothing reporting a
problem. The migration is not a window that closes, it is the steady state.

**Why it belongs to the owner.** The consumer could hardcode the old kind, and
that is worse in two ways: it puts a fact about one app's history in every other
app, and it does nothing for the next app that migrates. The owner is the only
party that knows what it used to publish.

Absent `alsoRead`, a consumer reads exactly one kind, so every manifest
published before this field behaves unchanged.

Ship's move of comments from `kind:9` to NIP-22 `kind:1111` is the case this was
written for, and Peek implements it as `commentKindsOf`.

### 7.4 Vocabularies

An app publishing objects with enumerated fields MUST publish the vocabulary
verbatim in the manifest, as `{value, label, colour}` where `colour` is a
semantic name (`neutral`, `blue`, `green`, `muted`) and never a hex code. The
consumer picks the actual colour, so the object looks native in each app.

---

## 8. Registering a kind

Three separate gates must open before a kind is usable, and **each refuses in a
way that looks like success from the layer above it**:

1. the identity service's per-app `allowed_kinds`;
2. the relay's kind→scope allowlist at ingest — refused *after* signing already
   succeeded;
3. the deployed relay image, which has no auto-update.

This applies to ratified NIPs too. See [ADDING-A-KIND.md](ADDING-A-KIND.md).

Provisional Estiva numbers are drawn from `30820`–`30899` (addressable) and
`185x` (regular).

---

## 9. Conformance

An implementation conforms if it can be observed doing all of the following
against a live relay:

| # | Check |
| --- | --- |
| C1 | Event ids match a reference implementation byte for byte, for every kind it writes |
| C2 | Every object event carries a valid lowercase UUID v4 `h` |
| C3 | It reads `accepted` from `/events` responses and surfaces `false` to the user |
| C4 | It never publishes `kind:0` |
| C5 | It renders another app's object from that app's manifest alone |
| C6 | Its fold reproduces the correct final state for five changes to one field inside one second |
| C7 | A non-author can change a field on its objects |
| C8 | A non-author's deletion of its object has no effect |
| C9 | Publish failures are surfaced in the UI, not only to the console |

C9 is not decoration. Once no app can sign locally, an identity-service outage
looks exactly like nothing happening.

### 9.1 Reference checks

```bash
cd ~/estiva-ship && npm run probe     # which kinds does this relay accept?
cd ~/estiva-ship && npm run verify    # full round trip, two identities
cd ~/estiva-ship && npm run manifest  # publish the manifest, check it is satisfiable
cd ~/estiva-foundation && npm test -w packages/protocol
cd ~/estiva-foundation && npm run verify:live -w packages/protocol   # needs a credential
```

The fourth pins the wire format's event ids to ids **Buzz's own Rust crates**
produced (`test/buzz-parity.test.ts`, which was
`peek-app/convex/nostr/events.test.ts` until SHA-3 moved the code it covers), and
to the ids the live relay is storing real events under. A failure means two
implementations have drifted. **Do not update the expected ids.**

The fifth is the one a green suite cannot be. It publishes a real signed event and
reads the `accepted` field back, with two negative controls — a tampered event the
relay must refuse, and a `kind:0` the identity service must refuse — so "it works"
is distinguishable from "the rule was removed". It needs a workspace credential,
which is why it is a hand-run check rather than a CI job.

---

## 10. Independence is the point

Estiva Peek, Estiva Ship and Estiva ID share **no interpretation and no
database.** That is what makes "apps sharing no code and no database work on the
same data" a true statement rather than a claim about siblings, and it is
unchanged.

**Amended 2026-08-27 (SHA-3).** This section used to say the *duplication* was
the architecture: three separate implementations of NIP-01 serialization,
"kept honest by every implementation pinning its event ids to the same
reference", and it told an implementer to copy the shapes rather than import
them. That was right about the claim and wrong about the mechanism, and the
third copy is what settled it.

A second hand-written event-id hash is not a demonstration of independence. It is
a divergence the relay notices and we do not — and it had already happened, in
this suite, unnoticed. Peek's `buildMessage` grew an `about` parameter emitting
`a` tags; Ship's copy never received it and could not emit one at all. The same
logical message produced different bytes depending on which app sent it,
**nothing failed, and each copy was self-consistent.** Between the other two
copies — Ship's and `estiva-agent`'s — a `diff -r` somebody had to remember to
run was the entire safety mechanism. PEEK-165 had already found drift of exactly
this shape *inside one repository*, caught only because a person read two
outputs side by side.

So the wire format is one implementation on purpose:
**[`@estiva-app/protocol`](https://www.npmjs.com/package/@estiva-app/protocol)**,
public npm, MIT, installable with no auth of any kind. Event construction, the id
preimage, NIP-19, NIP-98, signing, and the relay clients. Peek, Ship and
`estiva-agent` all consume it, and a third party installs exactly what they
install. The reasoning behind packaging it — and behind the layer split that
keeps interpretation out — is recorded in this repository's decision records
0001 §8 and 0002, which are internal while the protocol settles.

**What is still separate is the part that matters.** How an app folds events into
current truth is where apps are *supposed* to differ, and the package deliberately
contains none of it: Ship's `foldFolder`, Peek's `foldResolution` and its
projection all stay in their apps, and each app keeps its own conformance fixture.
The test for what belongs in the package is not "both apps need it" — it is
**"would the relay notice if the two apps disagreed?"**

**An implementer reading this may import it or copy the shapes, and both are
supported.** Everything in this document is enough to build an independent
implementation, which is the point of §9's conformance list; the package is a
convenience and never a requirement. If you do write your own, pin its event ids
to a reference implementation rather than to itself — `nostr-tools/pure`'s
`getEventHash` agrees with `@estiva-app/protocol` on every event this workspace
has published, which makes it a usable oracle for anybody.
