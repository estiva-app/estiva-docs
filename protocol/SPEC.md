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
| Per-person state | read state, app data | NIP-RS, NIP-78 + §11 and §12 of this document |

The only genuinely new protocol in this document is **§7, the projection
manifest**. Everything else is composition of existing NIPs — but three of those
compositions are load-bearing conventions that the NIPs deliberately leave open,
and an app that picks its own instead will interoperate on everything except the
thing the convention covers: **§7** (how another app folds your objects), **§11**
(what a read marker is called) and **§12** (where a person's own app state
lives).

**On the numbering:** §11 and §12 arrive after §10's closing argument rather than
beside the sections they relate to, because the section numbers in this document
are cited from three repositories and a renumbering would break every one of them
silently. Read §11 after §6 if you are reading in order.

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

**Corrected 2026-08-28.** This section said a conversation is a `kind:9` NIP-29
stream message and that *"there is no separate comment kind for this."* That was
true when written and stopped being true with REW-10, which moved comments to
NIP-22 — while §7.3 below documented the move at length. A builder reading this
section therefore built the wrong thing, and was told so three sections later.
The correction:

**A comment anchored to an object is a NIP-22 `kind:1111`. A message in a channel
is a `kind:9`. A reader MUST read both, permanently.**

`kind:1111` is the right kind for anything scoped to an object because it scopes
to an **addressable** event, which is what lets two apps comment on the same
object without either owning the comment kind. `kind:9` remains what it always
was: a message in a channel, not about anything in particular.

The pair can never shrink to one. A `kind:9` is not replaceable, so every comment
written before an app switched stays a `kind:9` for good — there is no migration
and there never will be. §7.3's `alsoRead` is how an app declares that history so
a consumer reads the union rather than showing a thread that begins in the middle.

| Shape | Meaning |
| --- | --- |
| no `e` tag | a root message — starts a conversation |
| `['e', <root>, '', 'reply']` | a reply in that conversation |
| `a` tag | the object the thread is about |
| uppercase `A`/`E`/`K`/`P` (on a `1111`) | the thread **root** — the object being commented on |
| lowercase `a`/`e`/`k`/`p` (on a `1111`) | the immediate **parent** — the comment being replied to |
| `h` tag | the Folder the thread lives in, which is what gates who reads it |
| `nostr:naddr…` in the body | the object, as a person types it |

A thread belongs to whatever anyone in it referenced, at any point. A thread
that mentions an object halfway through is from then on about that object, and
the **whole** thread attaches, not only the message carrying the reference.

**That rule is only defensible because attachment has two strengths, and an app
MUST present them separately** (added 2026-08-31):

| | in the data | presented as |
| --- | --- | --- |
| **a comment** | uppercase `A` at the thread root — the thread *is* about this object | the object's own discussion |
| **a mention** | the address referenced inside a message | *Mentioned in*, secondary and collapsed |

A twenty-message thread that names an issue on message twenty-one is a mention,
not a comment. Merged into one list it would put an unrelated discussion inside
the issue's conversation, which is why the rule above reads as surprising until
the two are split.

Message content is immutable, so **an accidental mention attaches permanently**
and cannot be withdrawn. That is acceptable for the secondary section and would
not be for the primary one — a second reason the two must not merge.

An app MAY offer a mention as a *suggestion* to associate two files. It MUST NOT
create the association automatically: mentions arrive retroactively and by
accident, and a shared record must not reorganise itself because somebody typed
a reference. See [RFC 0.5](RFC-0.5-ASSOCIATION.md).

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

### 6.6 Reactions

**Added 2026-08-28**, recording behaviour that has been in production since before
this document existed and was never written down.

A reaction is a **`kind:7`** (NIP-25) pointing at the event being reacted to.

**A `kind:7` carries no `h` tag, and that is the whole difficulty.** Reactions
cannot be found the way messages are — a channel query does not return them. An
app MUST fetch reactions **addressed by target**: collect the event ids it is
displaying, then query for reactions pointing at those ids.

The consequence is a horizon rather than a complete answer. A client fetching
reactions for N targets has to choose N, and the choice is invisible to the
person reading: reactions on older messages simply do not appear, and nothing
reports that they were not asked for. The reference client's N is **100**.

Two rules follow:

- An app MUST NOT assume a channel or cursor query returns reactions.
- An app that displays reaction counts MUST decide its own horizon deliberately,
  and SHOULD state it where a reader can find it. An undocumented cap is
  indistinguishable from "nobody reacted".

**What the horizon SHOULD be is unsettled** and is open question 10 in
[RFC 0.4](RFC-0.4-WORKSPACE.md). This section records the mechanism, not a
guarantee.

**Reactions attach to messages.** Whether they attach to anything else — a block
inside a rich text field, an object — is a product question RFC 0.4 §7.2 answers
in the negative for blocks, and it is not settled for objects.

---

## 7. Cross-app interoperability: the projection manifest

This is the new protocol. NIP-89's `kind:31990` says how to **open** an object
in its owning app. It says nothing about how to **render** one inline, or what
another app may **do** to it. This section adds both.

> **The owner defines the projection.** The publishing app decides which of its
> fields matter; the consuming app decides how they look.

An app that publishes objects other apps should render MUST publish a
`kind:31990` handler information event whose `content` is a JSON document with
`projections`, and with `records` **if and only if it has change events**.

`31989` / `31990` MUST be global — not scoped to any Folder. Discovery has to
work before you are a member of anything.

### 7.1 `records` — how to fold this app's objects

**OPTIONAL, and this section used to say otherwise.** An app with no change
events needs no rule for folding them, and such an app exists: nothing of Peek's
folds — a topic's name is a tag the relay wrote, and a message is immutable.

A consumer **MUST** render a projection that declares no `records`, treating
every `fold` slot as absent and falling through to its `default`. It MUST NOT
refuse the projection. Refusing renders the object as *nothing*, which §7.5's
argument covers exactly: a blank object is indistinguishable from one the reader
may not be allowed to see, and reports *"that app is broken"* about an app that
published a correct manifest.

> **This was wrong in the reference implementation first, and in the same
> direction.** Both resolvers required `records` and returned null for the whole
> projection. It survived because Ship was the only app that had ever published
> a manifest and Ship folds — so the requirement was never exercised against an
> app that does not. Fixed in the runtime during PRO-6; corrected here because
> **the specification is what a stranger implements from**, and a stranger
> following the old text would have built the same failure.

When an app *does* have change events, it MUST declare this. A consumer cannot
fold without being told how, and leaving it to convention means every consumer
invents its own rule — they disagree the first time two changes land in one
second, which is the common case rather than the rare one.

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
| `{"children": {"kind": 30851, "via": "a", "limit": 200}}` | child objects, found by the tag **on the child** that names this one |

**`children` is the only source that does not read the root event.** The others
answer *"what does this event say?"*; it answers *"what points at it?"* The
inversion is forced by replaceability: an addressable record is replaceable only
by its author, so a parent cannot maintain a tag listing children other people
created. The link lives on the child, written by the child's own author.

A consumer resolves each child through *that child's own projection*, which is
what makes "a card with its children underneath" compose instead of being a
special case. **Recursion depth is the consumer's budget and MUST NOT be
declared in the manifest** — the app at risk of a render loop is the one drawing
it, and a producer able to set that number could hang any consumer that trusted
it. `limit` is the producer's hint about how many children are worth fetching;
a consumer applying it MUST apply it to what it renders and not to what it
counts, or a total silently changes with the render budget.

Three rules learned from writing a consumer rather than from reading a spec:

1. A mutable field MUST be declared as a `fold`, never as a `tag`. Declaring
   status as a tag makes every consumer render an empty status forever, because
   the root event deliberately has no status tag (§6.1).
2. A slot MAY be **both** `fold` and `tag`. A project lead starts as a tag on
   the root and is later overridden by change events. Tag alone goes stale the
   first time somebody reassigns; fold alone loses the creation value.
3. `as: "pubkey"` marks a slot whose value is a pubkey, so the consumer resolves
   it through `kind:0` rather than printing hex.

Slots are `title` (required), `subtitle`, `status`, `meta`, `image`, `list` and
`body`. The set is closed — a slot is semantic, so a consumer must know what it
*means* to render it — but it **grows**, and producers and consumers upgrade at
different times. **A consumer MUST ignore a slot it does not implement and MUST
still render the rest**; a producer MUST NOT put information only in a slot
added after `title`, `subtitle`, `status` and `meta`.

Widgets are `card`, `row`, `table`, `stat` — and a manifest may declare others, as a chain terminating in one of those. See §7.5. The consumer owns the layout.

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
verbatim in the manifest, as `{value, label, colour, stage}` where `colour` is a
semantic name (`neutral`, `blue`, `green`, `muted`) and never a hex code. The
consumer picks the actual colour, so the object looks native in each app.

**`stage` says what a status *means*** — `open`, `started`, `done` or `dropped`
— as distinct from what it is called or how it is drawn. Without it a consumer
reporting progress has to infer meaning from the label, and the only way to do
that is a list of words in the consumer, which fails for the next app that
spells its statuses differently: its objects render, its progress reads as zero,
and nothing reports an error.

`dropped` is the value nothing can infer. A cancelled item is neither
outstanding nor progress — counted as open it holds a finished container below
its total for ever, counted as done it claims work that was abandoned — and only
the owning app knows which of its statuses have that shape.

`stage` is OPTIONAL, because a manifest published before it existed cannot be
given one. A consumer MUST treat its absence as *"this app does not say"*, which
is a different fact from *"not progress"*, and MUST treat a value outside the
four as absent rather than as a fifth stage — validation here is an honour
system, and this is one app reading another's self-description.

**What `stage` does not do:** it says what a status means, never what a consumer
should draw. Whether that becomes a counter, a progress bar or nothing is the
consumer's decision. An owner that could specify that would be designing another
app's UI, which is the same objection that rules out iframes (§7).

---

### 7.5 Widgets: a closed floor, an open vocabulary

*Added 2026-08-31. Numbered after the existing subsections rather than beside
§7.2 where it belongs topically, so that every cross-reference into §7.1–§7.4
keeps resolving.*

A **slot** is semantic — a consumer must know what `title` *means* to render it
at all — so an unknown slot name is unrenderable by definition and the set is
closed. A **widget** is a layout hint, so an unknown one can degrade honestly.
The two therefore get opposite policies.

`card`, `row`, `table` and `stat` are closed: every consumer implements them.
Beyond that, **a manifest MAY declare any widget name, and MUST declare it as an
ordered chain terminating in a closed type**:

```jsonc
"widget": ["message", "card"]   // a message if you know it, otherwise a card
```

A bare string is the older form and is a chain of one, so it MUST itself be a
closed type.

**A consumer MUST walk the whole chain**, not only its first entry, and render
the first type it implements.

**A producer MUST NOT publish a chain ending in a type this document does not
close.** `["profile"]` is not publishable; `["profile", "card"]` is.

Those are the same rule from opposite sides and both are required, because they
fail differently. A consumer that stops at the first entry renders nothing for a
widget it has not heard of. A producer that does not terminate its chain makes a
**conformant** consumer render nothing, having done exactly what it was told —
and that failure appears in somebody else's app, caused by a manifest they do
not control, with nothing to report it.

**Why neither pure option.** A closed set is provably too small on day one: "a
card with its children underneath" is not any of the four, and every addition
becomes a lockstep deployment across every consumer. A bare open set makes the
fallback the risk — an object that is present but blank is indistinguishable
from one the reader may not be allowed to see, and reports *"that app is
broken"* about an app behaving correctly. The terminal type makes that outcome
impossible rather than merely unlikely.

This is the same shape as `tag: ["name", "title"]` (§7.2) and `emits.alsoRead`
(§7.3), and exists for the reason all three do: **published events are immutable
and consumers upgrade at different times.**

A widget names a *kind of thing to draw*, never how to draw it. The consumer
owns the layout throughout — an owner that could specify it would be designing
another app's product, which is the objection that rules out iframes.

---

### 7.6 Not every object has an address

*Added 2026-09-01. Numbered after §7.5 for the same reason it was — every
cross-reference into §7.1–§7.5 keeps resolving.*

A projection MAY be declared for a kind that is **not addressable**, and a
consumer MUST be able to resolve one.

| the object is | identified by | resolved from |
| --- | --- | --- |
| replaceable — has a `d` | `kind:pubkey:d` | `naddr` |
| regular — has no `d` | its event id | `nevent` |

A `kind:9` message is the case in hand: it carries no `d`, so no address exists
for it and an address-keyed resolver cannot see it at all. NIP-22 already spans
both — uppercase `E` names an event root where `A` names an address — so the
wire format was never the obstacle.

**A projection for a regular event is thinner, and nothing declares that it is.**
The object is immutable and has no folded state, so `records` does not apply; it
cannot be the target of an `a` tag, so it has no comments addressed to it and
**no actions**. A consumer discovers each of those from the object rather than
from a field, which is why no manifest change was needed to support it.

**`web` is typed per NIP-19 entity, and an app owning both shapes MUST publish
one template for each.**

```jsonc
["web", "https://example.app/#/o/<bech32>", "naddr"]
["web", "https://example.app/#/o/<bech32>", "nevent"]
```

Both may point at the same route — the entity type tells the *consumer* what it
is holding, not the app what to do. **Publishing only the `naddr` form is the
failure worth naming**: a consumer holding a regular event finds no template it
can use, has nothing to substitute for `<bech32>`, and renders the object while
silently offering no way to open it. Nothing errors, and the omission is
invisible from an app whose objects are all addressable.

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

**Two sections follow this one**, despite it reading as a conclusion — see the
note in §1.1 on why they are numbered where they are. §11 fixes what a read
marker is called, and §12 fixes where a person's own app state lives. Both are
conventions over NIPs that decline to specify them, and both are the difference
between an app interoperating and an app being a second opinion.

---

## 11. Read state

Read state is **per person, not per app.** Reading a conversation in one Estiva
app marks it read in the others, and in any other client on the relay that
implements NIP-RS.

The mechanism is NIP-RS: `kind:30078` blobs, NIP-44 encrypted to self, one per
installation, merged by taking the **maximum** timestamp per context. The relay
already implements it. What NIP-RS deliberately does not specify is the *context
identifier*, and it says so: "Interoperability between different client
implementations on context ID conventions is outside the scope of this NIP."

That single omission is the whole reason "read it in Ship, it's read in Peek"
does not already work. This section fixes the identifiers for the Estiva suite.

### 11.1 Context identifiers

| grain | context id | format |
| --- | --- | --- |
| container | `<channel-uuid>` — **bare, no prefix** | lowercase UUID v4 |
| thread | `thread:<root-event-id>` | 64-char lowercase hex |
| message | `msg:<event-id>` | 64-char lowercase hex |
| folder | `folder:<folder-address>` | **RESERVED, unspecified** — see §11.5 |

**The container context is the bare channel uuid.** NIP-RS's grandfathered
clause states that "a bare channel identifier remains the channel context", and
the reference clients write exactly that. An app MUST NOT prefix it. A prefixed
variant would be a second convention for the same object on the same relay: one
app marks a container read and the other still shows it unread, and because
NIP-RS blobs are grow-only, reconciling later means tolerating both keys
permanently or migrating published blobs.

`thread:` and `msg:` are NIP-RS's own optional well-known schemes, adopted
verbatim rather than replaced. A key beginning `thread:` or `msg:` whose
remainder is not 64 lowercase hex characters is not a well-known context and
MUST NOT be treated as one.

The container grain is a **channel**, which is what messages carry in their `h`
tag — not a Folder address and not an application's own id for whatever is
rendered in it. One convention therefore covers a Peek topic, a Ship project and
a DM channel without any app knowing about the others.

### 11.2 Write discipline

- Marking a thread read MUST advance only `thread:<root>`.
- Marking a message read MUST advance only `msg:<id>`.
- Neither MUST advance the parent container context.

Advancing the parent when a person reads one reply silently marks every later
top-level message read. **This becomes load-bearing rather than tidy the moment
one channel carries more than one file's conversations**: today a container holds
one topic, so getting it wrong is invisible; a container holding five topics
marks four of them read.

### 11.3 Hierarchy at read time

A container's frontier propagates down: `effective(thread:<root>)` is the later
of the thread's own marker and the container's. Marking a container read clears
threads whose events predate the frontier; replies newer than it stay unread
until their own marker advances.

The hierarchy is applied **at read time**, never by writing extra keys.

### 11.4 Monotonic, and there is no mark-as-unread

A client MUST NOT lower a timestamp. The merge rule is a maximum, so a lower
value is not merely ignored — it cannot be expressed.

**There is no mark-as-unread in this protocol**, and NIP-RS says so about itself.
An app that wants the feature needs a separate mechanism; it is not a gap to be
filled by writing a smaller number. Stated here so nobody promises it.

### 11.5 Reserved: the folder grain

`folder:<folder-address>` is **reserved and unspecified.** "I have read
everything in this folder" is a different frontier from "I have read this
conversation", and it will want a scheme.

It is reserved rather than specified because the folder model is still a draft.
Reserving it costs a line; discovering the need later means either colliding with
an identifier an app chose in the meantime, or migrating published blobs — and
NIP-RS blobs are grow-only, so a bad context id is effectively permanent.

**No huddle context is standardised.** If huddles land as channels they get the
container scheme for free. Nothing is reserved for them.

### 11.6 Storage shape, and the limits that come with it

A client MUST publish `kind:30078` with:

- `d` = `read-state:<32 lowercase hex>` — the installation's slot id;
- exactly one `d` tag, and exactly one `["t", "read-state"]` tag;
- `content` = the NIP-44 self-encrypted blob.

The relay's NIP-RS handling is a **narrow predicate** on exactly that shape. Any
`kind:30078` that misses it is an ordinary addressable event with ordinary
replaceable semantics — which is what §12 relies on.

Limits an implementer needs before writing a client, from NIP-RS and the
reference implementation:

| limit | value |
| --- | --- |
| context entries per blob | 10,000 max |
| context id length | 256 bytes max |
| timestamp range | integer 0–4294967295 |
| plaintext per slot | 32,768 bytes in the reference client |
| slots per person | 8 in the reference client |
| schema version `v` | `1` |

To load read state, fetch every slot and merge:

```json
{"kinds": [30078], "authors": ["<pubkey>"], "#t": ["read-state"], "since": <now - horizon>}
```

**The horizon is a client choice with no protocol default.** NIP-RS states that
blobs are "best-effort recent activity hints bounded by a time horizon" and does
not fix the value. A consequence that bites: absence of a context means unread,
so a container last read before the horizon reads as unread unless the client
keeps its own cache behind the protocol.

Superseded blobs at a NIP-RS coordinate are **hard-deleted** by the relay, and a
watermark survives a NIP-09 deletion so an old signed blob cannot be
resurrected. Read state is not an audit log.

### 11.7 What the relay does not tell you

The relay does **not** advertise NIP-RS, and `supported_nips` does not include
78. An app cannot discover this support from NIP-11 and MUST NOT gate on it.

---

## 12. App-private, user-owned storage

"You own your data" holds for content on the relay. It fails for everything else:
a person's starred containers, their curated work queues and their app
preferences have generally lived in an app's own database, which they cannot
read, export, or take with them. A relay-wide export by author does not include
it and NIP-09 cannot delete it.

Closing that needs no protocol change. `kind:30078` (NIP-78, "arbitrary custom
app data") is addressable by `(pubkey, kind, d)` and the relay already treats it
as user-owned global state.

> **`kind:30078` is not reserved by NIP-RS.** The relay's constant is named for
> read state, which reads as though the kind were taken. The NIP-RS handling is
> the narrow predicate in §11.6; ingest performs no other `d`-tag validation on
> the kind. Anything outside that predicate is an ordinary addressable event.

### 12.1 The three layers, and the test for choosing between them

| layer | where | what |
| --- | --- | --- |
| 1 · interop | relay, a standard kind | anything another app must see |
| 2 · app-private, user-owned | relay, `kind:30078` per this section | only one app reads it, but the person still owns it |
| 3 · app backend | a database | genuinely needs one |

Two questions, in order:

1. Does another app need to see it? → **layer 1**, using a standard kind.
2. Otherwise: would the person reasonably expect to own it, export it, or take it
   with them? → **layer 2**.
3. Only then, and only if it needs a **query, an index, server-side compute, or
   size** → **layer 3**.

**"Only this app reads it" is not grounds for layer 3.** That conflation is what
put a person's own preferences somewhere they could not reach them.

### 12.2 Address, tag and content

- **`d` = `<app>:<name>:v<n>`** — e.g. `peek:screener:v1`. The prefix is the
  app's Estiva ID `client_id`, so two apps cannot collide by construction. The
  trailing version lets a schema change without a migration.
- **Exactly one `["t", "<app>-appdata"]` tag**, so a reader can filter by `#t`
  rather than fetching every `kind:30078` the person owns — the same reason
  NIP-RS carries `["t", "read-state"]`.
- **`content` MUST be NIP-44 encrypted to self**, unless the data is
  deliberately public. See §12.4.

An app MUST NOT use a `d` beginning `read-state:` — that prefix is §11.6's
predicate, and it brings hard-deletion of superseded blobs with it.

An app MUST NOT add an `h` tag. These events are user-owned and global. The relay
classifies the kind as global-only precisely so a stray `h` cannot channel-scope
it — but the read path still treats an explicit `h` tag as authoritative when
matching `#h` filters, which the relay's own source records as a known
limitation. So a stray `h` does not scope the event on write and *does* make it
answer channel queries on read. That asymmetry is the reason this is a MUST NOT
rather than a style note.

### 12.3 The limits, so nobody puts a table in a blob

- **No queries.** Fetch by coordinate, or filter by `#t`. No sorting, no ranges,
  no aggregation, no joins.
- **Whole-blob writes.** Parameterized-replaceable: each write replaces the
  coordinate, so a hundred-item list is rewritten to change one item.
- **Size.** The relay rejects an event whose `content` exceeds **256 KiB** at
  ingest. Three other numbers in the same neighbourhood are *not* this limit and
  are routinely mistaken for it — see §12.5.
- **No server-side compute.** No functions, no scheduled work, no validated
  authoritative writes, no transactions.
- **Last write wins, at seconds resolution.** Two tabs writing one coordinate can
  silently lose one, and several events from one client routinely land in the
  same second (§6.2). An app MUST either use a convergent structure with
  per-installation slots, as NIP-RS does, or accept the loss knowingly — and its
  convention MUST say which.

### 12.4 Encrypt, or "app-private" is a misnomer

The relay serves any `kind:30078` by author, so an **unencrypted blob is readable
by every app the person signs into**, and by the operator. Private-from-other-apps
and private-from-the-operator are the same requirement here, and NIP-44 is what
satisfies both.

Encrypted is the default. Plaintext is a documented exception, not a shortcut.

`kind:30078` requires the `users:write` scope, and each app needs the kind in its
Estiva ID `allowed_kinds` — the same three gates §8 describes for any kind.

### 12.5 Five size limits, and the one that binds is neither advertised nor the relay's

The relay advertises numbers that look like content caps and are not. This is the
same shape as the NIP-11 `push` object's `keys` array being mistaken for relay
identity, and it has now caught three readers — including the first draft of this
section, which named four limits and called the wrong one operative.

| number | value | what it actually bounds |
| --- | --- | --- |
| `limitation.max_message_length` | 524288 | the whole websocket message, not one event's content |
| `push.limitation.max_content_len` | 65536 | **the NIP-PL push executor.** Inside the `push` object, nothing to do with stored events |
| `push.limitation.max_plaintext_len` | 32768 | also the push executor |
| *(not advertised at all)* | 262144 | the per-event `content` cap the relay enforces at ingest |
| *(not the relay's at all)* | **65535** | **the binding one.** Estiva ID's `POST /nip44/encrypt` refuses a plaintext over 65535 bytes of UTF-8 |

**The limit that applies is not in NIP-11, and it is not the relay's.** §12.4
requires the content to be NIP-44 encrypted, and no Estiva app holds a key — so
every layer-2 write goes through the identity service, whose plaintext cap is
65535 bytes. Ciphertext is larger than plaintext, so **the relay's 256 KiB ceiling
is never the one an app reaches first.**

An implementer reading the relay's own document therefore finds four numbers,
three of which are irrelevant, one of which is nine times too generous, and none
of which is the answer. Budget against 65535 bytes of **plaintext** and stay far
below it: a blob is not a table, whatever any of these say.

An app that genuinely needs more than 64 KiB of app-private state has outgrown
layer 2 rather than found a limit to raise — see the layer-3 test in §12.1.

---

## 13. Content: messages and rich text

*Added 2026-09-02 (RIC-1). Nothing in §1–§12 specified content formatting. A grep
of this document for markdown, rich text or formatting returned nothing, while
731 published bodies already carried it — so what existed was not a lenient
standard, it was three private ones.*

> **This section is not uniformly descriptive, unlike the rest of this document.**
> §13.2 describes what three producers already write and two renderers already
> read, measured. §13.1's `code` mark and `nostr:` reference, and the whole of
> §13.3, are **specified ahead of an implementation** — no app writes a block
> document today. The reasoning, the alternatives and what the choice costs are
> in [RFC 0.4 §14.5](RFC-0.4-WORKSPACE.md).

**There are two content models and they are independent.** A message is an event:
its content is fixed the moment it is signed. A rich text field is a field on an
object: it is replaced when the object is. Building one mechanism for both
produces something that serves neither.

| | message | rich text field |
| --- | --- | --- |
| carried in | `content` of a `kind:9` or `kind:1111` | `content` of a root event, or the `value` tag of a change |
| lifetime | immutable; an edit is another event | replaced with its object |
| wire form | **marker text** (§13.2) | **a JSON block document** (§13.3) |
| inline vocabulary | §13.1 | §13.1 |
| addressable sub-unit | the message | **the block** |
| attachments | appended below, as `imeta` tags | placed inline, as a block |
| reactions, threading | yes | no |

The two share the inline vocabulary of §13.1 and nothing else. An app MUST NOT
read a message body as a block document, and MUST NOT read a block document as
marker text.

### 13.1 The inline vocabulary

Six marks, and they mean the same thing in both models. An app MUST NOT extend
this set privately: this is wire-visible content, so by §10's test — *would the
relay notice if two apps disagreed?* — the vocabulary belongs to the protocol and
its parser and serialiser belong in `@estiva-app/protocol`.

| mark | in a message (§13.2) | in a block document (§13.3) |
| --- | --- | --- |
| bold | `**text**` | `{"type":"bold"}` |
| italic | `*text*` | `{"type":"italic"}` |
| underline | `__text__` | `{"type":"underline"}` |
| code | `` `text` `` | `{"type":"code"}` |
| link | `[label](url)` | `{"type":"link","attrs":{"href":…}}` |
| reference | `nostr:npub…` / `nostr:naddr…` | `{"type":"reference","attrs":{"uri":…}}` |

Bold, italic and underline MAY combine on one run. `code` MUST NOT combine with
any other mark, and its content MUST NOT be parsed for further marks.

A **reference** is NIP-27: a `nostr:` URI naming a pubkey, an event or an
address. It is the only specified way to write a mention, because it is the only
form that is resolvable by an app that does not hold the writer's directory and
that survives a rename. A message that mentions a person MUST also carry the
corresponding `p` tag; the tags say who was mentioned, the URI says where in the
text. A reader that cannot resolve a reference MUST render the URI's own label
or its shortened form, never blank.

A link's `href` MUST use the `http`, `https`, `mailto` or `nostr` scheme. A
reader MUST refuse any other scheme and render the link as text.

### 13.2 Message content: the marker dialect

A message body is plain UTF-8 text. Structure comes from line prefixes and paired
inline markers. **This is the form already on the wire** — it is specified here
rather than replaced, because 548 published messages are written in it and none
of them can be rewritten.

**Line prefixes.** At the start of a line, each requiring its trailing space:

| prefix | block |
| --- | --- |
| `# `, `## ` | heading, level 1 and 2 |
| `> ` | quote |
| `- `, `• ` | bullet item |
| `1. ` | numbered item |
| ```` ``` ```` | fenced code, optionally followed by a language name; closed by a line of ```` ``` ```` |

**Inline markers.** `**bold**`, `*italic*`, `***bold italic***`, `__underline__`,
`` `code` ``, `[label](url)`, and a bare `nostr:` URI.

**Two rules decide whether a marker is a marker**, and they are what keep already
published text rendering unchanged:

1. the text between a marker pair MUST NOT begin or end with whitespace — `** x**`
   is literal;
2. an opening marker MUST NOT follow an alphanumeric and a closing marker MUST NOT
   precede one — `2*3*4` is literal.

A reader MUST render an unmatched marker literally, and MUST NOT infer any
construct not listed above. In particular `###` and deeper, tables, setext
headings, images and reference-style links are **not** in this dialect and MUST
render as the characters they are.

`code` and fenced code are the only additions this section makes to what three
producers were already writing. They are additions rather than a new dialect
because backticks are the single most common construct in the message corpus and
no renderer has ever handled them (§13.4).

### 13.3 Rich text content: a block document

A rich text field is a JSON document:

```jsonc
{
  "type": "doc",
  "content": [
    { "type": "paragraph", "id": "b1", "content": [ { "type": "text", "text": "Hello" } ] },
    { "type": "codeBlock", "id": "b2", "attrs": { "language": "ts" }, "content": [ … ] }
  ]
}
```

**Every block MUST carry an `id` that is unique within the document**, and an
implementation MUST keep a block's id stable across every edit that does not
replace the block. The id is what makes a block addressable: a reference to one
paragraph is the object's address plus a block id, which is what §6 anchoring
binds to and the reason this model is JSON rather than text.

Block types: `paragraph`, `heading` (`attrs.level` 1–3), `bulletList`,
`orderedList`, `listItem`, `blockquote`, `codeBlock` (`attrs.language`), `table`,
`horizontalRule`, `attachment`, and `widget` — which names a widget from §7.5 and
follows that section's fallback chain.

A block's inline content is an array of `{"type":"text","text":…,"marks":[…]}`
nodes using §13.1's vocabulary. A reader encountering an unknown block type MUST
render that block's inline text rather than dropping it, and MUST NOT drop the
block silently.

The document is JSON in `content`, so §12.3's 256 KiB ingest cap applies to its
serialised form.

### 13.4 Reading what is already published

Measured against production on **2026-09-02**:

| corpus | bodies | carrying structure | not covered by §13.2 |
| --- | --- | --- | --- |
| messages (`kind:9`, `kind:1111`) | 548 | 261 (48%) | 0 |
| root descriptions (`kind:30850`, `kind:30851`) | 157 | 135 (86%) | 19 tables, 20 fences |
| description changes (`kind:1851`) | 26 | 21 (81%) | 5 tables |
| **total** | **731** | **417** | |

**None of them move.** Roots are replaceable by their author alone; messages and
changes are not replaceable at all; and REW-11 established that rewriting stamps a
`created_at` the relay will not backdate. The corpus was 487 bodies five days
before this section was written, so it also grows — the set that must keep
working is not a fixed backlog to clear.

**The rule: the absence of a declaration is a declaration.**

- An event whose body is a block document MUST carry a
  `["content-format", "estiva-blocks-1"]` tag.
- A reader MUST treat a body with no `content-format` tag as §13.2 marker text —
  **in both models, permanently.** This is not a migration window.
- A reader MUST NOT decide the format by inspecting the body. A legacy
  description that happens to begin with `{` is marker text, because it carries
  no tag.
- A writer MUST NOT rewrite a published body in order to add the tag.

**The format is per event, not per object.** A description created as marker text
and later edited into blocks is a root with no tag and a change with one; the
fold takes the change's value, tag and all. An app MUST read the tag from the
event it took the value from, never from the object's root.

This is `emits.alsoRead` (§7.3) one level down and exists for the same reason:
published events are immutable and consumers upgrade at different times. It is
the third application of that pattern, after `alsoRead` itself and §7.2's
`tag: ["name", "title"]`.

### 13.5 Rendering, which is where the safety lives

A body is untrusted text written by other people in other apps. A reader MUST
build its output by constructing nodes from the parsed model, and MUST NOT
produce markup from the body by string interpolation — not for the marker
dialect, not for a block document, and not for a fenced block's contents.

An app MAY render any body as plain text. Doing so is conformant: what this
section forbids is *interpreting* a body as markup, not declining to format it.

