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
cd ~/peek-app && npx vitest run convex/nostr/events.test.ts
```

The last one pins one implementation's event ids to ids **Buzz's own Rust
crates** produced. A failure means two implementations have drifted. **Do not
update the expected ids.**

---

## 10. Independence is the point

Estiva Peek, Estiva Ship and Estiva ID each implement NIP-01 event
serialization separately. They share no package and no database.

**The duplication is the architecture.** It is what makes "apps sharing no code
and no database work on the same data" a true statement rather than a claim
about siblings. It is kept honest by every implementation pinning its event ids
to the same reference, which is independence without divergence.

An implementer reading this should copy the shapes, not import them.
