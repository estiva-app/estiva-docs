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
| `30840` | Bare file | `d`, `title`, `h`, `[a]` — §6.7 |

`a` on an Issue is the parent project's address, `30850:<pubkey>:<d>`. `ref` is
a display-only key such as `SHIP-12` and MUST NOT be used for addressing. `a` on
a bare file is the address of the file it sits under, **of any kind**.

### 6.2 Change events

| Kind | Tag order |
| --- | --- |
| `1851` | `a`, `field`, `value`, `h`, `ts` |

A move — a change to a `movedBy` field (§7.2) — also carries `A` after `ts`,
naming the new parent. It is an index, not a second target: `a` is the only
tag a change targets.

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

*Clarified 2026-09-29 (CON-5).* "Agrees to the second" means
**`floor(ts / 1000) == created_at`, exactly**. A reader MUST NOT widen it to a
tolerance. Two implementations accepted ±1 s (Peek's edit fold and
`@estiva-app/interop`'s change and edit folds), and one required equality
(Ship). The loose reading lets a `ts` claim the neighbouring second, which is
the one thing this rule exists to prevent. Every writer floors (`buildEdit`,
`buildChange`, Ship's `buildConversationMessage`). Production holds **3,470**
events carrying `ts` (`kind:9` 192, `1111` 1,680, `1851` 1,485, `40003` 113),
and all of them agree exactly (2026-09-29), so the strict reading changes no
fold that exists.

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

The pair does not shrink to one, because chat stays `kind:9` (§6.7). What did
shrink is a comment's kinds. This section used to say every comment written as a
`kind:9` before an app switched stays one for good, since a `kind:9` is not
replaceable. **Corrected 2026-09-30 (CON-20):** they were republished, author-signed
with their original `created_at`, as `kind:1111`, and the originals deleted —
107 comment roots, 24 replies and what pointed at them. A comment on an object is
a `kind:1111`. §7.3's `alsoRead` is how an app declares a history it has *not*
migrated, so a consumer reads the union rather than a thread that begins in the
middle.

| Shape | Meaning |
| --- | --- |
| no `e` tag | a root message — starts a conversation |
| `['e', <root>, '', 'reply']` | a reply in that conversation |
| `a` tag | on a `kind:9`, the object the thread is about — or, since RIC-11, an address the body names; the rule below tells them apart |
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
| **a mention** | an `a` tag on the root that is not its `A`, or an address in a body | *Mentioned in*, secondary and collapsed |

A twenty-message thread that names an issue on message twenty-one is a mention,
not a comment. Merged into one list it would put an unrelated discussion inside
the issue's conversation, which is why the rule above reads as surprising until
the two are split.

**Which tag carries which strength** (added 2026-09-21, CON-13). The table
above left the mention's *data* as "referenced inside a message", and two apps
read the same tag two ways: since RIC-11 and peek#272 a message carries every
`nostr:naddr…` its body names as an `a` tag too — the body is what the person
wrote, the tag is the index that lets one `#a` filter answer *who named this
file* without reading every conversation — and Ship read a root's `a` as a
comment, which put a Peek comment written on a file inside a Ship issue's own
discussion. The rule, which is what both apps already publish:

| on the thread's root | strength |
| --- | --- |
| a `kind:1111`'s `A` | **comment** — NIP-22's root object is the one thing a comment is about |
| a `kind:1111`'s `a` that is not its `A` | **mention** — the index of an address the body names; NIP-22 makes a root's own `a` equal its `A`, so any other one is a reference |
| a `kind:9`'s `a` that its body also names | **mention** — the same index on a message that has no `A` |
| a `nostr:naddr…` in the body with no tag | **mention** — written before the index existed; a reader that wants it reads the body |
| any tag on a reply | nothing — a reply's lowercase tags name its parent, or repeat the root's; only the root decides how the thread attaches |

A `kind:1111` with no `A` at all is malformed. A reader that meets one reads
its `a` as the `A` rather than dropping the thread; none exists on production.
*Clarified 2026-09-29 (CON-5):* **every** `a` it carries is read as an `A`, so
the thread is a comment on each address it names. Ship's `anchorIndex` and
interop's `isCommentOn` already say so; Peek's `isCommentOn` reads "no `A`" as
a comment on whatever address it was asked about, which is the same answer
for any event that arrived by `#a`. None has ever existed on production — 0 of
2,297 `kind:1111`, deleted ones included (2026-09-29).

**Only the root decides, and a reply is never a root** (added 2026-09-29,
CON-5). A reader listing an object's comments MUST NOT list an event that
carries a reply `e` — a `kind:9` with any `e`, a `kind:1111` with a lowercase
`e` that differs from its `E` — as a comment of its own, whatever `a` it
carries. (A top-level comment on an *event* root carries `E` and `e` naming the
same event, and is a comment. On an address root it carries no `e` at all.) The last row of the
table above says a reply's tags decide nothing, and a per-event test for `a`
contradicts it the day a reply carries one: interop's `isCommentOn` is applied
per event, so a `kind:9` reply carrying `a` would be listed as a second
top-level comment beside the thread it answers. None does today (0 on
production, 2026-09-29), because Ship's builder adds `a` to a reply only when a
caller passes both `replyTo` and `about`, and none does.

A writer MUST NOT put an address in a `kind:1111`'s `a` that the body does not
name, unless it is the `A`. That is the only way the second row stays
readable without decoding the body, and it is what `referenceTagsFor` in Peek
and `buildNip22Comment` in Ship do.

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

#### Replies — decided 2026-09-29 (CON-5)

**A reply to a comment is a `kind:1111`, one level deep.** It carries:

| tag | value |
| --- | --- |
| `A`, `K`, `P` | the object the thread is about: the top-level comment's `A`; `K` and `P` from that address |
| `e` | the id of the thread's **top-level comment**, never of another reply |
| `k` | that comment's kind, `1111` |
| `p` | that comment's author |
| `h` | the same Folder as the comment |
| `a` | only an address the body names (the rule above), never the object's own |
| `ts` | as §6.2 |

A reply's lowercase `a` is left out because NIP-22 would read it as the
parent, so a copy of the object's address there would claim the reply is a
top-level comment. It follows that a reply is absent from an object's `#a`
read, and is found by `#e` on the comments that read returned.

**One level, because NIP-22 cannot name the thread otherwise.** When the thread
root is an *address*, NIP-22 carries no id for the top-level comment: the
uppercase tags name the object, and the lowercase `e` names only the immediate
parent. A reply to a reply would leave a reader to walk parents to find its
thread, one read per level. A reader that meets one anyway SHOULD walk its
parents to the top-level comment rather than drop it. None exists on
production: 0 of 342 `kind:1111` replies name a reply (2026-09-29).

**A reply to a message in a channel stays a `kind:9`,** threaded by Buzz's
`thread_tags` (`['e', <root>, '', 'reply']`, and a `root`/`reply` pair for a
nested reply). Chat is talking *in* a room (§6.7), and a `kind:1111` scopes to
an object that a channel message does not have. A reader files a nested one
under its `root`-marked `e`, which names the thread, rather than dropping it
because its parent is not a root (1 on production, 2026-09-29).

**Why `1111`.** Production held two reply shapes under `kind:1111` comments on
2026-09-29: **335** live `kind:1111` replies (Peek), and **19** `kind:9` replies
(Ship's reply button, `buildConversationMessage`, on 12 roots, the newest on
2026-09-21). A `kind:9` reply names its parent and nothing else, so a client
that knows NIP-22 and not Ship does not see it, and every future app would
learn Ship's shape as a second writer rule. Ship's own reason for it was
app-internal ("the caller does not pass the anchor"): the comment being answered
already carries its `A`, so a reply can copy it.

**Reading.** CON-20 (2026-09-30) republished every comment-shaped `kind:9` on
production as a `kind:1111` — 107 legacy comment roots, 24 replies (14 more were
already copied by SHR-8 and only deleted) and the 14 events that pointed at them
— and the 24 left in deleted channels were deleted, so no `kind:9` on
production is a comment, and the strengths table's "`kind:9`'s `a` its body
does not name" row is gone. Miky's call, 2026-09-29: the protocol does not keep
an experiment's shape for compatibility when it can be migrated. The last writer,
Ship's reply button, writes a flat `kind:1111` since SHI-28 (2026-09-30), so a
reader does not read a `kind:9` as a comment or a comment's reply, and Ship's
manifest declares no `emits.alsoRead` (§7.3).

### 6.5 Deletion and archiving

These have genuinely different reach and MUST NOT be offered as two styles of
the same control.

**Archive** is a change event on an `archived` field. Reversible, attributable,
and available to anyone in the Folder.

*Added 2026-09-30 (FOL-46), as shipped in interop 0.37–0.38, Ship and Peek:*

- **One concept for every kind.** A project, an issue, a topic, a bare file and
  a Folder are all archived the same way: `archived` set to `true` on the
  file's address, and an empty value to restore it. A Folder is archived on its
  channel's address, published in the Folder that lists it.
- **An archived file hides its subtree, computed when reading.** A project's
  issues, a file's sub-files and a Folder's contents leave every list with it,
  and nothing is written to them, so unarchiving the parent restores exactly
  what was there. A file another, unarchived Folder also lists stays visible
  there. Before archiving, an app SHOULD say what would be hidden, counted.
- **The resolution is the change's `content`**, optional, and a reader shows it
  first when the archived file is opened. A link still opens an archived file;
  it is out of lists, not gone.

**Delete** is a NIP-09 `kind:5`, and three properties are normative:

- It is a **request**. Relays MAY decline; copies held elsewhere are untouched.
- It is **author-scoped, and the author is not only the signing pubkey** — see
  the correction below.
- It removes the **record**, not the work. Children are separate events with
  their own authors; they remain in the Folder.

#### Corrected 2026-09-06: who a relay accepts a deletion from

This section said a relay *"honours a deletion only from the pubkey that signed
the original"*, and derived from it that **an app MUST hide the control from
non-authors rather than offer one that silently fails.** The premise is wrong,
so the rule does not follow. Both are withdrawn.

What the reference relay enforces
(`buzz-relay/src/handlers/side_effects.rs`, `validate_standard_deletion_event`)
is author **or** the author's NIP-OA owner:

```rust
if target_pubkey_bytes != actor_bytes
    && !state.db.is_agent_owner(tenant.community(), &target_pubkey_bytes, &actor_bytes).await?
{
    return Err(anyhow::anyhow!("must be event author"));
}
```

The same test applies on both branches — an `a`-tag deletion of an addressable
record, and an `e`-tag deletion of a regular event — so it covers objects and
comments alike. And the actor is the **effective** author rather than the
signing pubkey: `effective_message_author` resolves a relay-signed event to its
`actor` or `p` tag, so even the narrow reading of "the pubkey that signed the
original" was not the comparison being made.

**No client can evaluate this predicate.** Ownership lives in
`users.agent_owner_pubkey`, written from the NIP-OA attestation and read
server-side only; no event carries it and no route returns it. The attestation
runs one way — the identity service issues `owner_attestation` on the
client-credentials grant, so an *agent* learns who owns it and a *human* never
learns which agents they own.

So the rule inverts:

- An app **MUST NOT** hide a delete control behind an author comparison it
  computes itself. The comparison is narrower than the relay's and cannot be
  made correct client-side, so it withholds the control from people entitled to
  use it.
- An app **SHOULD** offer deletion and let the relay adjudicate, surfacing a
  refusal in the words the relay gave. This is what archiving already does.
- An app **MUST** still keep archive and delete as visibly different
  affordances. That half of this section is unaffected.

**Why this is not a technicality.** Agent-authored content is the common case,
not an edge: measured on production 2026-09-06, **425 of 583 messages** were
written by one agent identity. Under the withdrawn rule the person who owns that
agent — the only party besides the agent itself the relay would accept — was the
one guaranteed never to see the control. Ship found this as SHI-14 and removed
its own author gate for exactly this reason; the specification had been saying
the opposite ever since.

**What stays true:** deletion is still a request, still refusable, and still
narrow. It is not an ACL. Nobody may delete another person's work; the widening
is one identity cleaning up after an agent it is answerable for.

#### Amended 2026-09-21: hiding by author label is a documented trade-off, not forbidden

The MUST NOT above forbade gating the control on a client-side author
comparison at all. Peek does it anyway: PEE-32
(estiva-app/peek#281, merged b628bd1, on production 2026-09-21) hides Edit and
Delete on any message whose author label is not the viewer's, in both
`ConversationMoreMenu` and `ReplyMoreMenu` — by Miky's decision, not an
oversight.

The reasoning holds even though the rule doesn't: a plain non-author's request
is refused by the relay every time, so offering the control there only ever
shows a button that cannot work. The comparison this section warned about —
narrower than the relay's and unable to include NIP-OA ownership — is still
true, and it lands on exactly one party: an agent's owner, who has the right
(the relay accepts the deletion from them) but does not get the control in
Peek's UI. That is a real cost, not a hidden one, and it is accepted rather
than fixed here.

So both are now acceptable, and an app picks one:

- **Offer and let the relay adjudicate** (Ship's CON-3 delete and CON-4 edit,
  unchanged). Never wrong, including for an agent's owner, at the cost of a
  control that a plain non-author will always see fail.
- **Hide by author label** (Peek, since PEE-32). Never shows a control that
  cannot succeed for the common case, at the cost of withholding it from an
  agent's owner, who must act some other way.

This does not make Ship's behavior wrong, and Ship following Peek is a
separate decision for a Ship ticket, not implied by this correction. The two
apps are expected to converge on one answer once they share a base library for
this standard, rather than being reconciled by fiat now.

#### Decided 2026-09-29: own messages and agents' messages (CON-5)

The two choices above converge on one rule, for edit and delete alike. For
these two controls it replaces both the 2026-09-06 MUST NOT and the choice of
2026-09-21:

- An app **SHOULD** offer Edit and Delete on a message **the viewer wrote**.
- An app **SHOULD** offer them on a message whose author's profile
  (`kind:0`) declares **`bot: true`** (NIP-24). The viewer may be the agent's
  NIP-OA owner, whom the relay accepts, and no client can tell whether they are.
- An app **SHOULD NOT** offer them on a message by **another human**. The relay
  refuses that request every time.
- Whichever it offers, the relay adjudicates. An app MUST surface a refusal in
  the relay's own words, as above.

Measured on production, 2026-09-29. **1,181 of 2,345** live messages (`kind:9`
and `1111`) were written by the workspace's two agents, and both agent
profiles carry `bot: true`. Hiding by author label withheld the control from the
owners of every one of them. The owner path is used (one owner edit of their
agent's message is on the relay), and the dead control is rare (the relay's
log since 2026-09-23 holds 2 refused non-author deletions). The rule keeps the
first and removes almost all of the second. What remains is a non-owner
trying somebody else's agent's message and being refused.

`bot` is self-declared, and that is acceptable here because it decides only
what is **shown**. A false `bot: true` shows a control the relay refuses. A
missing one withholds it from an owner, which is the cost this rule removes.
An app that cannot read the author's profile offers the control, which is never
wrong. Peek adds the `bot` case to PEE-32's gate and Ship hides the control on
other humans' messages, both in CON-5's extraction.

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
reports that they were not asked for. N is fixed at **100** — see below.

Three rules follow:

- An app MUST NOT assume a channel or cursor query returns reactions.
- An app that displays reaction counts MUST decide its own horizon deliberately,
  and MUST report when it truncates. An undocumented cap is indistinguishable
  from "nobody reacted", which is the whole difficulty — a person cannot tell a
  quiet message from an unasked question.
- An app that reads reactions across **more than one id space** — messages and
  thread replies are distinct spaces in at least one implementation — MUST share
  one budget between them rather than concatenating two capped lists and
  truncating the result. See the amendment below for why this is stated.

#### Reading a reaction — decided 2026-09-29 (CON-5)

Two apps must agree on a **count**, so what counts is specified. How the
counts are ordered is not specified.

- **Target.** The **last** `e` whose value is 64 hex, as NIP-25 says. The relay
  derives a reaction's channel and its dedupe row from that same tag
  (`handlers/ingest.rs`), so a reader that picks another `e` counts a reaction
  against a message the relay did not file it under.
- **Emoji.** The content as stored, **not trimmed**. An empty content is `+`,
  which is NIP-25's "like" and what the relay records for it. The relay refuses
  more than 64 characters.
- **Count.** One per `(target, pubkey, emoji)`. The relay already refuses an
  active duplicate (`buzz-db` `reaction.rs`, `ON CONFLICT (…, event_id,
  pubkey, emoji)`). A reader still deduplicates, because another relay, or
  a copy, need not.
- **Retraction** is a `kind:5` on the reaction (§6.5). The relay stops
  returning a deleted reaction, so a reader re-reads and does not reconcile.
- **Events, not only targets.** A reader that caps the number of reaction
  *events* it takes back MUST report that cut, as it reports the target cut.
- **Order** is presentation. An app MAY sort by count, by first reaction, or
  otherwise, and two apps that differ here do not disagree about anything.

Where the apps stood, 2026-09-29:
- **Target.** Ship and interop took the first `e`.
- **Emoji.** Ship trimmed, and skipped an empty reaction.
- **Count.** Peek and interop counted every event.
- **Event cap.** Ship asked for at most 500 events per read (`REACTION_EVENT_LIMIT`), interop for 1,000 per 100 targets, and neither reported a cut.

None of these differences shows on production today. Of 57 live reactions, 0
have more than one `e`, 0 are empty or untrimmed, 0 are duplicates, and 2 targets carry
more than one emoji, where order is visible.

### The horizon is 100

*Decided 2026-09-07, closing RFC 0.4 open question 10 (CON-1).* This section
previously said the horizon was unsettled and recorded "the reference client's N
is 100" as an observation rather than a rule.

**N is 100, and an implementation SHOULD adopt it rather than choose its own.**

The reasoning is the interoperability one rather than a performance one. A
horizon is not a private tuning constant: two apps showing the same conversation
with different N **disagree about the count, legitimately and unfixably**, and
a reader has no way to tell that from a bug. The value matters much less than
its being the same everywhere, which is why this is a number in the
specification and not a recommendation to measure locally.

100 was chosen from what production actually holds rather than from a round
number (measured 2026-09-06/07 across the reference workspace):

| surface | messages |
| --- | --- |
| busiest container | 77 |
| median container | 9 |
| busiest issue | 13 |
| containers at or over 100 | 0 |

So it covers every surface this workspace has, with room — which is the point of
picking it *now*. The truncation report is what makes the boundary visible on
the day something crosses it, and an app whose surfaces routinely exceed 100
should raise the question here rather than quietly raise its own constant.

**Where the two reference apps stand today**, stated because a rule nobody
follows is a wish:

| | horizon of 100 | reports truncation | shared budget |
| --- | --- | --- | --- |
| Ship | yes | yes — names the cap and how many were skipped | n/a, one id space |
| Peek | yes | yes — one caption under the container, since PEE-21 | yes, since the amendment below |

Peek's cell was "no — truncates silently" until 2026-09-12 (peek#196), and that
gap is why the second rule is a MUST rather than a SHOULD: Peek is the app where
the cap can actually bite, because a container is where messages accumulate.
Peek counts the omission where it truncates — in the sync, from the true totals
rather than the capped lists — and records it on the container, so every reader
sees the same number whichever of its two sync paths ran last.

**The shared-budget rule was found the hard way.** One implementation read
reactions for messages and for thread replies, capped each list at N, then
capped their concatenation at N again — which spends the whole budget on
messages first. At 100 messages in a container, *every* reply target was
dropped and every reaction on every reply silently disappeared for every
reader. Concatenating two capped lists is not a horizon; it is one id space
starving another.

#### Which 100 — decided 2026-09-29 (CON-5)

**The newest 100 targets, by the target's `created_at`, ties broken on the
higher event id**, in one budget across every id space shown (roots and
replies alike). The rest are the reported omission. `created_at` rather than
§6.3's `ts`, because every target has one and not every target carries `ts`.
The id tie-break is what keeps the cut stable between two reads of the same
page.

Ship keeps the last 100 of its caller's order (`reactionTargets`), and its one
caller sorts oldest first by time. Interop keeps the newest 100 by `at`, with
ties on the higher id (`commentDecorationsOf`). They agree except on ties at the
cut, where Ship's answer depended on thread order.

**Measured again 2026-09-29: the horizon now bites.** The table above said no
container reached 100. Now five channels hold more than 100 live messages. The
busiest holds 399 (`kind:9` and `1111` together), the busiest chat 199
`kind:9`, and the busiest single file conversation 93. N stays 100. This is the
day the truncation report was written for, and whether the busiest
chat should be read further is a question for this section, not for one app's
constant.

**Reactions attach to messages.** Whether they attach to anything else — a block
inside a rich text field, an object — is a product question RFC 0.4 §7.2 answers
in the negative for blocks, and it is not settled for objects.

### 6.7 The bare file

*Added 2026-09-11, from [RFC 0.5 §10.7](RFC-0.5-ASSOCIATION.md).*

**A bare file is a file no app owns.** It has a document, a conversation, and no
type-added properties. A Peek topic is one. So is any subject nobody has built a
specialized app for — a job description in a workspace with no HR app. Typed
kinds (a project, an issue) add properties on top of this shape; the bare file
adds none, and that absence is why it is ownerless: NIP-89 keys ownership by
kind, and an app that owned the bare file would own every subject nobody has an
app for.

**Shape.** `kind:30840`, addressable. Tag order is normative, as §6.1 says:

| tag | | |
| --- | --- | --- |
| `d` | REQUIRED | an opaque uuid (RFC 0.4 §4.3), never a slug |
| `title` | REQUIRED | seeds the `title` field; a rename is a change event |
| `h` | REQUIRED | the team's channel. The relay says SHOULD; **this document says MUST**, for the reason the relay already gives for issues — several apps write these, and one forgetting the `h` puts an unreachable object in the shared space that nobody can unpublish |
| `a` | at most one | the address of the file this one sits under, of any kind. Seeds the `parent` field; a move is a change event |

`content` is a §13.3 block document, or empty. A topic that is only a
conversation has nothing here; the day somebody writes a brief at the top, this
is where it goes, and nothing about the file "converts".

**Conversation.** `kind:1111` anchored at the file's address (§6.4), with the
same `h` — the shape an issue's comments already have. Threads are NIP-22
replies (§6.4). Reactions, edits, deletions and drafts follow §6.5, §6.6 and
§6.8 unchanged. The team's general conversation stays `kind:9` in the
channel: chat is talking *in* a room, a comment is talking *about* a file, and
the line between them is the kind.

**Changes.** `kind:1851` under §6.2, targeted by `a` at the file. Two fields are
defined: `title` and `parent`, each seeded by the root tag of the same name and
overridden by the change stream — the way an issue's `project` field works. A
consumer MUST read `parent` before the `a` tag.

**Projection.** A bare file has no `kind:31990`, and **a consumer MUST NOT let
one claim it**. Its projection is this section: `title` from the tag with the
`title` fold over it; `body` from `content`; the `comment` action emitting
`kind:1111` at its address; widget `card`; a `list` of bare files beneath it.
`@estiva-app/interop` carries exactly that and answers it before consulting
NIP-89 at all. The test of a conformant consumer is that **with every manifest
removed from the relay, a bare file still resolves, lists its comments and
names its parent.** What NIP-89 contributes to this kind is only **where to
open it**: a consumer takes the `web` template of the generic app declaring the
`conversation` aspect (§7.8) — a link nobody owns still has somewhere to go. A
`kind:31989` recommendation by the file's author MAY name a different app; that
tie-break is not yet read.

**Nesting.** A bare file may sit under a file of any kind, and a file of any
kind may sit under a bare file, by the `a` tag above. The parent's owner does
not declare this and does not need to: for every other kind `parentRef` is
derived from the *parent's* declared child list; for a bare file it is the file
naming its own parent. Both directions exist and a consumer reads both.
Nesting organises and never grants access (RFC 0.4): a bare file's readers are
its team's, at any depth.

*Added 2026-09-23 (FOL-4):*

- **Same team.** A sub-file's `h` is its parent's team: a consumer creating a
  file under a bare file MUST copy that file's `h`, and one creating it under
  any other kind MUST use the team whose listing it was offered from. A move
  changes `parent` and never `h`, so a consumer MUST offer as targets only
  files in the same team's listing. There is therefore no permission question
  at any depth, and nothing to check.
- **A move** is a `parent` change whose `value` is the new parent's address, or
  empty for the top of the team. An empty value is a move, not an absence: a
  consumer MUST NOT fall back to the root `a` tag when the change stream holds
  one. The bare file's projection declares it as the `move` action.
- **Read nesting from the team's listing, not from a tag query.** A relay
  indexes a change's `a` (the file moved) and not its `value` (where to), so
  `#a: [X]` answers "what was *created* under X" — it still returns what has
  moved away and never what has moved in. The listing folds every change
  against every file it holds, so it is the one read that answers "what is under
  X". It also makes a breadcrumb free: every ancestor of a file is in the same
  team, so the chain is walked in memory rather than one request per level. A
  parent absent from the listing is in another team or unreadable, and is not
  drawn — not even as "unavailable", because the count is the disclosure (the
  rule a Folder listing already follows); the file is drawn at the top.
- **Cycles.** Nothing on the wire can stop A naming B and B naming A. A reader
  MUST still draw every file in the listing, so a file on a cycle is drawn at
  the top with its parent link ignored; a file merely under a cycle keeps its
  parent. A writer SHOULD refuse to move a file under its own descendant, and
  with the listing in hand that is a lookup rather than a search.
- **Depth** is unbounded on the wire and the consumer's budget in the drawing
  (§7.2). A tree that opens one level per click needs no budget.
- **No "may nest" field in a manifest.** Whether a kind may hold bare files is
  answered here — every kind may — and whether it holds its own kinds is its
  projection's `list.children` (§7.2). A consumer offers "start a file under
  this" on any file it can address.

**No migration.** An existing Peek topic is a channel and stays one: it becomes
a *team*, and its `kind:9` messages that team's general conversation. New
topics are bare files inside a team. Both shapes coexist permanently in every
consumer, which is the same rule §6.4 already states for comments.

### 6.8 Edits

*Moved here 2026-09-29 (CON-5) from [RFC 0.4 §7.2.1](RFC-0.4-WORKSPACE.md),
decided 2026-09-07 (CON-4) and amended 2026-09-23. That section said it would
move once both apps implement it. Ship has since CON-4, and Peek since CON-8.*

**An edit is a new event, never a rewrite.** A `kind:9` and a `kind:1111` are
both non-replaceable, so an edit cannot overwrite what it edits. What an app
shows as "edited" is a fold over the message and its edits.

**Wire shape.** Mirrors Buzz's `build_edit` (`buzz-sdk/src/builders.rs`), which
is what the relay validates against, plus `ts`:

| Kind | Tag order | Content |
| --- | --- | --- |
| `40003` | `h`, `e`, `ts`, `[imeta…]` | the **new body**, in the target's own format |

- **`h`** is REQUIRED. `40003` is in the relay's `requires_h_channel_scope`, so
  an edit without one is refused with `accepted: false`, and the relay refuses
  one whose `h` is not the target's channel. The content cap is 64 KB.
- **`ts`** is REQUIRED, in epoch milliseconds, under §6.2's rule. `build_edit`
  emits `h` and `e` only, which leaves two edits in one second with no defined
  order. The relay ignores a tag it has no rule for, so adding it is safe.
- **`e`: exactly one, naming the target.**

**The target is the first `e` whose value is 64 hex, and a reader MUST NOT apply
an edit to any other `e`** (decided 2026-09-29, CON-5). That is the event whose
ownership the relay checked (`validate_edit_ownership`, `handlers/ingest.rs`:
the first `e` with a 64-hex value, marker ignored). **Since 2026-09-29 the
relay refuses an edit that does not carry exactly one `e`, or whose `e` is not
64 hex** (`invalid: an edit must name exactly one target via one e tag`,
CON-21, buzz#20). Before that, nothing refused a second `e`, so a reader that
picked a different one applied an edit the relay authorised for message X to
message Y. An edit tagged `['e', <own message>, '', 'mention'], ['e', <victim>]`
passed the relay's check on the writer's own message, and a reader taking "the
first unmarked `e` naming a message on screen" drew it on the victim's. Peek's
`foldEdits` and `@estiva-app/interop` before 0.34.0 read it that way (PEE-38);
both now read `editTargetOf`, the rule above. The reader rule stays a MUST
because a reader cannot assume every relay refuses the shape. Ship's first-`e`
rule was right except for skipping a non-hex `e`, which fails safe and can no
longer be stored. All 113 edits on production carried exactly one unmarked `e`
naming a `kind:9` or `1111` on the relay (2026-09-29), so no edit that exists is
read differently under either rule.

**The fold.** The latest edit wins, ordered `ts` (when trusted), then
`created_at`, then event `id` as a stable tiebreak. That is §6.3's ordering on
purpose, since a second ordering rule would be a second thing to get wrong. An
edit whose target the reader cannot see is held, not dropped: the target may
arrive later, and a dropped edit is not recovered by a re-read.

**An edit changes the body and the attachments, and nothing else.** It does not
change the target's kind, channel, place in a thread or author. An edit that
appears to change any of those is folded for its content and its `imeta` tags,
and ignored for the rest.

**Attachments fold separately from the body** (amended 2026-09-23). CON-5 found
62 attachments whose bytes existed only in Convex. The only event that can
repair a non-replaceable message in place is the one that already targets it.

- An edit MAY carry NIP-92 `imeta` tags, in the form a message carries them
  (§13), with `m` and `x` as the relay reported them. Ingest verifies `imeta` on
  any kind (`verify_imeta_blobs`), so an edit naming a blob the relay does not
  hold is refused.
- A message's attachment set is the `imeta` set of its **latest edit that
  carries at least one `imeta`**, in the body fold's order. If no edit carries
  one, it is the message's own set. An edit with no `imeta` leaves the
  attachments as they were, so every edit written before 2026-09-23 keeps its
  meaning.
- **A set replaces, it does not append.** An edit that adds one file to a
  message with two carries all three.
- **Emptying** a message's attachments is not expressible, because an edit with
  no `imeta` means "unchanged". That is RFC 0.4 open question 11.

**What a reader shows.** An app that renders an edited message MUST show the
current text and MUST mark it as edited. The mark is about the **body**. An
edit whose content is byte-identical to the body it replaces, judged against
the body as it then stood, changes attachments only, and a reader SHOULD NOT
mark the message edited for it. "Edited at" is the last edit that changed the
body. Whether earlier versions are reachable is the app's call, because every
event stays on the relay either way.

**Who may edit is the relay's answer.** `validate_edit_ownership` accepts the
target's effective author, or the NIP-OA owner of an authoring agent, and on
the author path re-checks channel membership. So somebody removed from a
private channel cannot rewrite what they said there. Which controls an app
offers is §6.5, decided 2026-09-29.

**An app that does not implement `40003` shows the original text.** An edit is
a progressive enhancement. Until every reader folds it, the same message reads
differently in two apps, and neither is wrong.

### 6.9 Where the apps stand (CON-5, 2026-09-30)

**Every row below is closed.** Since 2026-09-30, Peek (peek#406), Ship
(ship#215), the agent (estiva-agent#65) and `@estiva-app/interop` 0.41.0 read
these rules from `@estiva-app/conversation` 0.1.0 and have deleted their own
copies. The package's conformance tests are §9's C10–C16. A thread written
from each of the three apps, with replies, edits, reactions and a delete, read
the same in the other two on production (CON-5). The one exception is the
agent's CLI, which does not show reactions at all.

The table is kept as the record of what the extraction changed. The rules
above were lined up against Peek, Ship and `@estiva-app/interop` at
`origin/main` on 2026-09-29, before the package was extracted from them. Each
row was one app still to change. "Production" counts what that difference
changed on the relay at the time.

| rule | § | differs in | production |
| --- | --- | --- | --- |
| a reply is never a root | 6.4 | interop's `isCommentOn` is per event | 0 |
| a nested chat reply files under its `root` | 6.4 | Peek's channel read drops it | 1 |
| a `1111` with no `A`: every `a` is an `A` | 6.4 | none (Peek equivalent by `#a`) | 0 |
| Edit and Delete: own and `bot` messages | 6.5 | Peek hides `bot` messages; Ship offers on humans' | 1,181 agent messages |
| `ts` exactly within its second | 6.2 | Peek and interop accept ±1 s | 0 of 3,470 |
| edit target: first 64-hex `e` | 6.8 | none since PEE-38 (Peek, interop 0.34.0); the relay refuses a second `e` since CON-21 | 0 of 113 |
| reaction target: last 64-hex `e` | 6.6 | Ship and interop take the first | 0 of 57 |
| reaction emoji untrimmed, empty is `+` | 6.6 | Ship trims and skips empty | 0 |
| one reaction per `(target, pubkey, emoji)` | 6.6 | Peek and interop count every event | 0 |
| a reaction event cap is reported | 6.6 | Ship (500) and interop (1,000) cut silently | 57 reactions in all |
| newest 100 targets, ties on higher id | 6.6 | Ship breaks ties by thread order | ties only |

The agent, which reads through a byte-copy of Ship's `src/nostr/`, inherited
Ship's column, and the same sync closed it. Its comment lists and counts no
longer count a mention as a comment. `delete-issue`'s warning and
`edit-comment`'s candidate set still take mentions too, on purpose: both are
about every message that names the object.

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

**One kind has no handler, by design, and it is not an error.** The bare file
(§6.7) is owned by no app; its projection is written in this document and a
consumer MUST resolve it from here rather than from the relay, ignoring any
`31990` that lists it. A consumer that treats "no handler found" as "cannot
render" will render a team's topics as nothing.

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

A projection names a widget and fills its slots, and MAY name what one of its
objects is called (`noun`, §7.9). A slot draws its value from exactly one
source:

| Source | Meaning |
| --- | --- |
| `{"tag": "title"}` | a tag on the root event |
| `{"field": "content"}` | a top-level event field |
| `{"fold": "status", "default": "todo"}` | a field produced by folding change events |
| `{"fold": "lead", "tag": "lead"}` | folded, **seeded** from a root tag |
| `{"fold": "description", "field": "content"}` | folded, **seeded** from the event body |
| `{"children": {"kind": 30851, "via": "a", "limit": 200}}` | child objects, found by the tag **on the child** that names this one |
| `{"children": {"kind": 30851, "via": "a", "movedBy": "project"}}` | the same, where a child **moves** by a change to the named field (below) |

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

#### `movedBy` — the field that moves a child (MAN-1, 2026-09-29)

The `via` tag is written once, on the child's root, by the child's author, and
the root is replaceable by that author alone. So a child that can change parent
— a Ship issue moved to another project — moves by a **change event** (§6.2),
and `movedBy` names the field that change sets:

```json
"list": { "children": { "kind": 30851, "via": "a", "movedBy": "project" } }
```

A consumer MUST read a child's parent in this order:

1. **The folded `movedBy` field**, when the fold holds a value for it. An
   **empty value is a move to no parent** and not an absence: falling back to
   the tag would put the child straight back under the parent it was moved out
   of.
2. Otherwise **the `via` tag** whose value is an address of the declaring kind.

The field's value is the new parent's address, `kind:pubkey:d`, or empty. A
folded value that is not an address of the declaring kind names no parent, and
a consumer MUST treat it as empty rather than as a reference to fetch.
`movedBy` is meaningful only when `via` holds an address; a consumer MUST
ignore it on a list whose child tag holds anything else.

**A `#via` read cannot see a move.** It finds the children *created* under a
parent, still finds the ones moved away, and never finds the ones moved in,
because a relay indexes single-letter tags and a move's new parent is in a
`value`. A consumer drawing a parent's children from `#via` alone MUST drop a
child whose folded `movedBy` names another parent. A consumer that does not
draws a moved issue under its old project, which is the failure this field
exists to end.

**So a move names its new parent twice** (FOL-45, 2026-09-30). A change to a
`movedBy` field whose value is an address MUST also carry `["A", <that
address>]`, after `ts`; a move to no parent carries none, and no other change
carries it. A consumer finds the children moved in with `{ kinds: [<change
kind>], "#A": [<parent>] }`, reads the root of each target of the child kind,
and folds it as it folds a child found by `#via`:

- **The tag is a hint, the fold is the answer.** A later move away names the
  *next* parent, so a change found by `#A` may be stale. A consumer MUST keep a
  child found this way only while its folded `movedBy` names this parent.
- **Uppercase, because `a` is the target.** A reader takes a change's first
  `a` as what it changes, and a Folder listing matches a change against *every*
  `a` it carries — a second `a` would fold the move into the parent itself.
  `A` is NIP-22's root scope on a comment; on a change it means only this, and
  a consumer MUST NOT query `#A` without a `kinds` filter.
- **Moves written before this carry no `A`.** Such a child is still found only
  by a read that folds every change in the Folder — the Folder's listing — or
  once it is moved again.

> **The reference implementation meets this in both reads since interop
> 0.38.0** (MAN-7, 2026-09-30). The Folder listing has folded `movedBy` since
> 0.36.0. A card's inline `list` (`resolveForeignObject`'s children) now folds
> each addressable child from one more read of the children's changes, made
> only when the app declares `records`, and drops a child whose folded
> `movedBy` names another parent. Measured on production, 36 of 36 issues moved
> away from a project are on no card of it. **Since interop 0.42.0** (FOL-45)
> `buildActionEvent` writes the `A` on a move, and a card's own read asks
> `#A` for its parent, reading the roots it names with the children's changes —
> no request more. Ship's and the agent's own writers carry it too.

**The move is the action whose `emits.field` is the `movedBy` field** and which
applies to the child kind (§7.3). Its value is an address, so a consumer SHOULD
draw it as a choice among objects of the declaring kind rather than a text box
asking a person to type `30850:<hex>:<uuid>`. A move changes the parent and
never the child's Folder, which is its own placement (§7.3).

The bare file declares `movedBy: "parent"` on its own list, naming the field
§6.7 defines; §6.7's rule that a bare file's parent may be of *any* kind is
unchanged, and is why its `via` tag is not matched on the declaring kind. Absent
`movedBy`, the `via` tag is the only parent, so every manifest published before
this field reads exactly as it did.

Measured on production 2026-09-29, the 1,000 newest `kind:1851`: 41 set
`project` on a `kind:30851`, and all 41 values are a `kind:30850` address.

Three rules learned from writing a consumer rather than from reading a spec:

1. A mutable field MUST be declared as a `fold`, never as a `tag`. Declaring
   status as a tag makes every consumer render an empty status forever, because
   the root event deliberately has no status tag (§6.1).
2. A slot MAY be **both** `fold` and `tag`. A project lead starts as a tag on
   the root and is later overridden by change events. Tag alone goes stale the
   first time somebody reassigns; fold alone loses the creation value.

   A fold MAY equally be seeded from `field: "content"`, and MAY name both: the
   chain is **fold, then tag, then content, then `default`**. A description is
   where this matters, because `content` is where an app puts a body — Ship
   reads an issue's as `fields.description?.value ?? event.content` and a
   project's as the same with a `description` tag in between, and neither could
   be declared until the content seed existed. The seed tag reports no content
   format (§13.4); a tag is a scalar even when standing in for a body.
3. `as: "pubkey"` marks a slot whose value is a pubkey, so the consumer resolves
   it through `kind:0` rather than printing hex.

Slots are `title` (required), `subtitle`, `status`, `meta`, `image`, `list` and
`body` — which holds structured content, in one of the models §13 specifies. A
consumer rendering `body` MUST establish which model by §13.4's rule and MUST
NOT read one as the other; rendering it as plain text is always available
(§13.5). `truncate` MUST NOT be applied to it, for the reason §13.5 gives about
constructing output from a parsed model: a slice of a block document is not a
block document, and a consumer cannot tell that what it drew is wrong.

The set is closed — a slot is semantic, so a consumer must know what it
*means* to render it — but it **grows**, and producers and consumers upgrade at
different times. **A consumer MUST ignore a slot it does not implement and MUST
still render the rest**; a producer MUST NOT put information only in a slot
added after `title`, `subtitle`, `status` and `meta`.

**`image` is reserved and has no producer.** No manifest in the ecosystem
declares it and no addressable kind carries a value it could name — measured
2026-09-02 and again 2026-09-10 (RATIONALE.md). It stays in the closed set
because the slot is right the moment an object grows a cover or a thumbnail, and
because removing it would change a published vocabulary for no gain. A consumer
MAY therefore implement `image` last: there is nothing to render it against, and
the absence is the ecosystem's rather than that consumer's. An object's *avatar*
is not this slot — a person's picture is reached by declaring the slot holding
their pubkey `as: "pubkey"`, which resolves through `kind:0`.

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
written for, and Peek implements it as `commentKindsOf`. Ship then migrated that
history instead (CON-20) and withdrew the field (SHI-28, 2026-09-30).

#### What an action declares

Stated here because a consumer builds the event from the declaration alone, and
until MAN-1 the rules below lived only in the reference implementation.

```jsonc
{
  "id": "add-issue",
  "label": "Add issue",                  // a button caption
  "description": "File a new issue…",    // prose for a caller choosing between actions
  "effect": "writes",                    // "safe" | "writes" | "destructive"; absent means unknown
  "appliesTo": "30850",                  // the kind(s) it is offered on, as strings
  "emits": { "kind": 30851, "setTag": "a", "toAddressOf": "self" },
  "input": {
    "type": "object",
    "properties": { "title": { "type": "string" }, "description": { "type": "string", "target": "content" } },
    "required": ["title"]
  }
}
```

An action is one of four shapes, decided in this order:

| shape | declared by | the event |
| --- | --- | --- |
| **deletion** | `emits.kind: 5` | NIP-09: `a` naming the object, `k` its kind; no `h`; takes no value |
| **creation** | `input.type: "object"` with `properties` | a new root of `emits.kind`: a fresh `d` if addressable, one tag per property, the Folder tag, and `[setTag, <object's address>]` when `toAddressOf` is `"self"` |
| **change** | `emits.field` | `emits.kind` carrying the fold rule's target, field and value tags (§7.1), `h`, and `ts` when the rule orders by it |
| **comment** | `emits.scope: "address"` | NIP-22 `kind:1111` naming the object (§6.4) |

**A property's name is the tag its value is written to**, unless it declares
`target: "content"`, when its value is the event's `content`. At most one
property may target `content`; a consumer MUST refuse a declaration with two,
because the second would silently replace the first. `input.enum` (or a
property's `enum`) names a vocabulary (§7.4) the value MUST come from — the
owner cannot enforce it, so the consumer checks. An empty property is omitted,
not written as an empty tag.

An action MAY produce more than one event (`listed`, below). A consumer MUST
publish them in the order given and stop at the first refusal, because each
later event assumes the earlier ones were accepted.

#### `placement` and `listed` — where a new object lives, and the command that follows (MAN-1)

A Ship project is not filed in its Folder the way an issue is. Its record
carries `buzz-channel` instead of `h`, so the relay stores it globally and
anybody can discover the project without being admitted to its channel (RFC 0.3
§4.2). And it is then **named** in its Folder with a `kind:1852`, because a
Folder with state (`kind:30890`) lists only what its state names and filing
never updates it. Neither could be declared, so `add-project` could not be.

```jsonc
"emits": { "kind": 30850, "placement": "buzz-channel", "listed": true }
```

**`placement`** — on a creation only — is the tag the new root names its Folder
with: `"h"`, the default, or `"buzz-channel"`. Those are the two tags a relay
indexes for a Folder's containment read and the two a consumer reads an
object's Folder from (`h` first), and a consumer MUST refuse any other value: a
root naming its Folder in a tag nothing reads belongs to no Folder. `buzz-channel` changes where the *record* lives and nothing else: the
changes, comments and children of that object still carry `h`, naming the
Folder the root's `buzz-channel` names.

**`listed: true`** says objects of this action's kind are named in their
Folder's state, so writing one is followed by a Folder command (RFC 0.4 §4):

- **On a creation**: publish the root, then — **only if the Folder has state** —
  a `kind:1852` with `op: add` naming the new address, in the Folder the root
  was placed in. A Folder without state lists by containment and already shows
  the root; a command against it would emit state listing only this one object
  and hide everything else filed there.
- **On a deletion**: publish the `kind:5`, then one `kind:1852` with
  `op: remove` naming the address in **each Folder whose state names it**. A
  Folder with state lists what it names, deleted or not, so without it the row
  stays pointing at nothing (FOL-48). The deletion goes first, so a refused
  `remove` leaves a stale row rather than unlisting an object the relay kept.

Whether a Folder has state, and which Folders name an object, MUST come from a
read of `kind:30890` and never from a guess — a wrong guess is silent loss. A
consumer that cannot read them MUST NOT offer a `listed` action; publishing the
root alone creates an object its Folder does not show, and reports success.

Measured on production 2026-09-29: 24 of 34 `kind:30850` carry `buzz-channel`
and 10 carry `h` (older records, which never move); 0 of 452 `kind:30851` carry
`buzz-channel`. Of the 24, 20 are named by an `op: add` and 4 by none — objects
in no Folder's listing, the failure `listed` is for. Of 5 `kind:5` naming a
`kind:30850`, 4 were followed by an `op: remove`.

#### `format` — a field whose value is prose (MAN-1, RIC-13)

Ship writes a description as a block document (§13.3) with
`["content-format", "estiva-blocks-1"]`, and nothing in a declaration could say
so: a consumer saw `{"type": "string"}` and drew a one-line box. A field is
declared as prose with a **format on the declaration, not a new type**, because
the wire value is a string either way:

```jsonc
// a creation: on the property that targets content
"description": { "type": "string", "target": "content", "format": "estiva-blocks-1" }
// a change: on the scalar input
"emits": { "kind": 1851, "field": "description" },
"input": { "type": "string", "format": "estiva-blocks-1" }
```

`format` names the richest model the owner accepts for this value. It does not
make the value mandatory, and it does not refuse a plain one:

- A value **written as a block document** carries the `content-format` tag with
  the declared format — on the root for a creation, where it describes
  `content`; on the change for a change, where it describes `value`. The tag is
  per event (§13.4), so a change's tag describes that change alone.
- A value **written as plain text** — from a consumer that drew a text box, or
  one that does not know the format — carries **no tag**, and is §13.2 marker
  text, which §13.4 obliges every reader to accept permanently. So a consumer
  that ignores `format` still publishes a correct event.
- A consumer MUST NOT put the tag on a value it did not produce in that format,
  and MUST NOT write a format it does not implement. A reader decides the model
  by the tag alone (§13.4), so a wrong tag renders JSON at a person, or a
  paragraph as nothing.
- A block document carrying `attachment` blocks carries one `imeta` per file,
  as §13.3 requires of every event holding one.
- On a creation, `format` is meaningful only with `target: "content"`: a tag is
  a scalar (§7.2), and an event has one `content-format`. A consumer MUST ignore
  `format` on a property written to a tag.

A consumer SHOULD draw a prose field as a block editor and MAY draw a
multi-line text box. `estiva-blocks-1` is the only format defined (§13.3).

Measured on production 2026-09-29, the 1,000 newest `kind:1851`: 234 set
`description`, and 67 of those carry `estiva-blocks-1`. **0 of 452 `kind:30851`
roots carry the tag** — an issue has never been *created* with a block
document, which is the gap RIC-13 names: rich text arrives only by a later
edit.

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

### 7.7 `urls` — recovering an object from a link somebody pasted

`web` is **outbound**: given an object, build a link that opens it. `urls` is
**inbound**: given a link, recover which object it names. An app MAY declare the
URL shapes it serves, and a consumer matches a pasted link against the shapes
from every published `kind:31990`.

```jsonc
["urls", "https://example.app/issue/<slug>-<d>", "30851"]
["urls", "https://example.app/#/issue/<d>", "30851"]
["urls", "https://example.app/message/<id>", "9"]
```

**`<d>` and `<id>` are the two identities**, and the pattern says which it
carries. `<d>` is an addressable object's identifier and resolves with
`{"#d": […]}`; `<id>` is an event id — 64 hex, all of it — for a kind that has
no `d`, and resolves with `{ids: […]}`. A consumer MUST read which from the
declaration rather than from the value's shape.

They are separate fields because they answer different questions, and because an
app that changes its routes still has to read the links it published under the
old ones — which is why the second line above exists in the example rather than
being tidied away. [RFC 0.5 §7](RFC-0.5-ASSOCIATION.md) specifies the grammar
and the reasoning; this section is the manifest surface.

**The third element is the kind, and it is what makes this work for a stranger.**
§7.2 says the kind comes from the path segment — but `/issue/` means `30851`
only to the app serving it, and a consumer has never heard of "issue". An app
MAY omit it, in which case a consumer falls back to the kinds the manifest
declares it handles; that is sound only because a `d` is a v4 uuid and is not
reused across kinds, so naming the kind is cheaper and clearer.

**A consumer MUST match the host and the `<type>` segment, and MUST ignore only
the slug.** Matching the trailing uuid alone resolves any site's URL as this
app's object, which is a way of rendering an attacker's chosen content inside
someone's conversation. A link matching no published shape MUST render as an
ordinary link — it is one, and nothing should claim otherwise.

**This is the projection layer's inversion applied to links**: the owner says
what its URLs look like, the consumer decides whether to draw a widget. No
central registry, no per-app integration, and no service that can go down and
take every published link with it.

### 7.8 `aspect` — what a generic app renders of everybody else's files

The `k` tags say which kinds an app **owns**. A generic app (RFC 0.5 §10.7)
owns none and renders one aspect of every file, so nothing above lets a
consumer find it. It MAY declare that aspect in `content`:

```jsonc
{ "name": "Peek", "aspect": "conversation", "projections": {} }
```

`aspect` is one of `conversation` or `document`. A specialized app omits it.

**This is how a bare file gets a link.** §6.7 gives it no handler, so no `web`
template is its own. A consumer resolving one takes the `naddr` template from
the manifest declaring `conversation` — newest first, among manifests that
carry a `web` template — and derives the file's open URL from it; with no such
manifest published, the file still resolves and simply has nowhere to open.
`@estiva-app/interop` 0.20.0 does exactly that, and Peek publishes the field.

A consumer MUST NOT read `aspect` as ownership: a manifest declaring it still
claims no kind, and a `k` tag naming `30840` is ignored as §7 says.

### 7.9 `noun` — what one of these is called

*Added 2026-09-30 (PEE-41). Numbered after the existing subsections for the
reason §7.5 gives; it belongs beside §7.2.*

A projection MAY declare a `noun`: what the owning app calls one object of that
kind, lower case and singular.

```jsonc
"projections": {
  "30851": { "widget": "row", "noun": "issue", "slots": { … } }
}
```

It exists for a consumer that names the object in its own sentences — a menu's
"Delete issue", a confirm's "Delete this project?". Without it the only way to
say anything better than a generic word is to recognise the kind number, which
is the check this section exists to replace.

`noun` is OPTIONAL, and a manifest published before it existed has none. A
consumer MUST treat its absence as *"this app does not say"* and use its own
word, never infer one from the app's `name` or the kind. The bare file (§6.7)
declares none: a consumer says its own word for a file nobody owns.
`@estiva-app/interop` 0.39.0 resolves it onto the object as `noun`.

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

**Conversations** (added 2026-09-29, CON-5). An app that shows or writes a
conversation also conforms to these. They are stated so that an app can build
conversations from this document alone, without `@estiva-app/conversation`.
Every one is a fixture of events plus the expected result, runnable against a
throwaway relay or a fake query.

| # | Check |
| --- | --- |
| C10 | **Both kinds.** A thread rooted in a `kind:1111` on an object lists under that object, and a channel's `kind:9` chat lists under no object, whatever `a` it carries (§6.4) |
| C11 | **Two strengths.** On one object: a `1111` whose `A` is the object is a comment; a `1111` whose `A` is another file but whose `a` names this one is a mention; a `kind:9` whose body names the object is a mention; a `1111` with no `A` is a comment on each of its `a`. Mentions are presented apart from comments. A reply carrying the object's `a` lists as neither (§6.4) |
| C12 | **Edit fold.** Three edits to one message inside one second, carrying `ts`, fold to the last by `ts`. One whose `ts` is off by a second folds by `created_at`. An edit whose first `e` is marked and names another message is applied to that message and never to the second `e`. An edit byte-identical to the body does not mark the message edited. The message is marked edited, and shows the current text (§6.2, §6.8) |
| C13 | **Reaction horizon and count.** With 101 targets, reactions are asked for the newest 100 and the omission of 1 is reported. `+`, empty and a duplicate from one pubkey count as one `+`. A reaction with two `e` counts against the last (§6.6) |
| C14 | **Deletion left to the relay.** After the author's `kind:5`, the next read no longer holds the message, and the app shows nothing for it from local state. A non-author's `kind:5` is refused and the refusal is shown in the relay's words. Edit and Delete are offered on the viewer's own message and on a `bot: true` author's, and not on another human's (§6.5) |
| C15 | **Attachment fold.** An edit carrying `imeta` replaces the message's set. A later edit with none leaves it. An edit carrying one file on a message with two leaves one (§6.8) |
| C16 | **Reply shape.** A reply to a comment is a `kind:1111` with the comment's `A`/`K`/`P`, `e`/`k`/`p` naming the top-level comment, the comment's `h`, and no lowercase `a` for the object. A reply read back threads under that comment in every conforming app (§6.4) |
| C17 | **Membership fold.** The file's author is a member from the earliest root version. Writing in the stream, a body mention, an assignee change carrying `["p", P]`, and `member:<P>`=`true` by anyone each make the person a member. A comment's `p` tag alone does not, nor an assignee change without a `p`, nor an unassign, nor a `kind:9` with an `a`. An edit of the root after the author left does not re-join them. A `member:<P>`=`false` signed by someone else is ignored. One signed by `P` ends membership until a later trigger, and member-since is then that trigger's second. Two changes inside one second order by `ts` (§11.8) |
| C18 | **Unread for a member.** Someone mentioned for the first time on a year-old file has one unread message, the mention. The person's own messages are never unread. A reply is read once its thread's marker or the file's passes it, and the channel's marker never reads a file. A muted file shows only the messages that mention the person (§11.3, §11.8) |

C11 and C12 both have a failure that is invisible from the app that has it.
A merged mention looks like somebody said it here. A forged edit looks like an
edit, which is the reason the target rule in §6.8 is a MUST.

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
| channel | `<channel-uuid>` — **bare, no prefix** | lowercase UUID v4 |
| file | `<file-address>` — **bare, no prefix** (FOL-16) | `<kind>:<pubkey>:<d>`, kind 30000–39999, pubkey 64-char lowercase hex, `d` verbatim |
| thread | `thread:<root-event-id>` | 64-char lowercase hex |
| message | `msg:<event-id>` | 64-char lowercase hex |
| folder | `folder:<folder-address>` | **RESERVED, unspecified** — see §11.5 |

**A container context is the scope a message carries on the wire, verbatim.**
The `h` tag scopes a message to a channel, and the channel uuid is the context.
The `a` tag scopes a comment to a file (§6.4), and the file's address is the
context. Neither is prefixed, neither is an application's own id for whatever it
renders, and nothing has to be looked up to derive either — a reader holding
the message holds its context. Prefixed forms name frontiers that are *not* a
wire scope: `thread:` and `msg:` (NIP-RS's own), and the reserved `folder:`.

**The channel context is the bare channel uuid.** NIP-RS's grandfathered
clause states that "a bare channel identifier remains the channel context", and
the reference clients write exactly that. An app MUST NOT prefix it. A prefixed
variant would be a second convention for the same object on the same relay: one
app marks a container read and the other still shows it unread, and because
NIP-RS blobs are grow-only, reconciling later means tolerating both keys
permanently or migrating published blobs.

**The file context is the bare address** (added 2026-09-13, FOL-16). One rule
covers every kind of file — a Ship issue, a Ship project, a bare file (§7.8), a
Leaf document — because every one of them is the target of the same `a` tag,
and nothing about the rule is shaped by which app owns the file. Only an
addressable kind has an address, so the kind is 30000–39999; a key that looks
like an address outside that range is not a file context. The `d` segment is
**case-sensitive and copied verbatim** — an app MUST NOT normalise it — and the
whole key is subject to the 256-byte limit of §11.6.

`thread:` and `msg:` are NIP-RS's own optional well-known schemes, adopted
verbatim rather than replaced. A key beginning `thread:` or `msg:` whose
remainder is not 64 lowercase hex characters is not a well-known context and
MUST NOT be treated as one.

#### Streams: which context a message answers to

A channel's messages divide into **streams**, and a message answers to exactly
the marker of the stream it is in:

- a root with no `a` tag — a `kind:9`, the team's general conversation — is in
  the **general stream**, whose marker is the channel uuid;
- a root whose root-level `a` tag names a file — a `kind:1111` about that
  file — is in that **file's stream**, whose marker is the file's address. A
  root with two `a` tags is in both streams, and is unread in each until that
  file has been read;
- a reply is in its root's stream, under `thread:<root>`.

A thread attaches to a file by *comment* — its root's own `a` tag — and never
by *mention* (§6.4's weaker strength). A thread in the general stream that
name-drops an issue halfway through stays in the general stream: mention is
what a reader is shown alongside a file, not what the file's unread counts.

This is why the channel uuid alone stopped being enough. It was one topic per
channel, so "I have read this channel" named exactly one conversation. A Folder
holds a team's general chat *and* several files' conversations in one channel,
and a Ship project has always held its issues that way; a per-file marker is
what says which of them you have read.

### 11.2 Write discipline

An app advances **exactly the streams it is showing**, and nothing beside them:

- Opening a file's conversation MUST advance only that file's address. It MUST
  NOT advance the channel, any other file, or the folder.
- Opening a channel's general conversation MUST advance only the channel uuid.
  It MUST NOT advance any file in it.
- A screen that shows both — Ship's project page draws the Folder's `kind:9`
  chat and the project's own comments as one feed — advances both.
- Marking a thread read MUST advance only `thread:<root>`.
- Marking a message read MUST advance only `msg:<id>`.
- None of these MUST advance a parent it is not showing.

Advancing the parent when a person reads one reply silently marks every later
top-level message read. **This became load-bearing the moment one channel
carried more than one file's conversations**: while a container held one topic,
getting it wrong was invisible; a container holding five topics marks four of
them read. A listing is not a reading — a page that *lists* files, or rolls
their activity up as titles, advances none of them.

### 11.3 Hierarchy at read time

A stream's frontier propagates down: `effective(thread:<root>)` is the later of
the thread's own marker and **its stream's** — the channel uuid for a root in the
general stream, the file's address for a root about that file. Marking a stream
read clears threads whose events predate the frontier; replies newer than it
stay unread until their own marker advances.

**The channel's marker does not propagate into a file's stream.** That is the
one place the hierarchy stops, and it is the whole point of the file grain:
reading the team's chat says nothing about which of the team's topics you have
read. The reserved `folder:` grain (§11.5) is the only key that would ever reach
every stream in a Folder, and it is not specified.

The hierarchy is applied **at read time**, never by writing extra keys.

#### A team's indicator is the union — the product call

A Folder's own indicator — the dot on a team in Peek — is **the union of its
streams**: unread if its general conversation is unread, or any file in it is,
or any Folder beneath it is. Each file row carries its own indicator alongside;
the team's clears when the last of them does. Every stream in the union is
judged for the person's membership of it (§11.8): a file they are not a member
of, or have muted, contributes only the messages that mention them.

Union rather than general-stream-only, for two reasons. Peek already rolls
activity up this way — a huddle's new message raises its parent topic's dot,
because a signal only visible once you have opened the parent is a signal you
do not get. And a collapsed team must not be able to hide a topic that needs
you. The cost is a dot that stays lit until every conversation under it is read,
which is what every workspace tool does and what people expect of it.

It is a **display rule, computed at read time from the markers above.** Nothing
is written to express it, no key is needed for it, and it does not consume the
reserved `folder:` grain.

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

The file grain (§11.1) does not take its place, and a Folder is not a special
case of it. A Folder is a file, so a comment anchored at the Folder's *address*
answers to that bare address like any other file's would; the Folder's *general*
conversation answers to its channel uuid; and `folder:<address>` remains the
name for the third thing, "everything under it at once". The union indicator of
§11.3 is computed from the first two and needs no third.

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

For a **file**, membership settles it (§11.8, added 2026-09-30, CON-19): a
member's unread starts when they became a member, so a file they have never
opened is unread only for what was said since they joined. Until then each app
chose — Ship showed no divider without a marker, and Peek counted everything
inside its 90-day horizon, which is what lit a file's whole recent history the
day a mention made someone follow it. For a **channel**, the choice is still
the app's. What an app MUST NOT do in either case is write a marker to settle
the question — that is a read it did not make.

Superseded blobs at a NIP-RS coordinate are **hard-deleted** by the relay, and a
watermark survives a NIP-09 deletion so an old signed blob cannot be
resurrected. Read state is not an audit log.

**Only the author can read their slots** (added 2026-10-02, CON-23). A blob's
`created_at` says when a person last read something, so a reader who could
fetch someone else's slots could watch them. The Estiva relay serves a
`kind:30078` carrying `["t","read-state"]` only to its author, on every read
path including `ids`, COUNT and live delivery. NIP-RS makes this a SHOULD for
relays that authenticate their readers; a client cannot detect it (§11.7), so
it should not assume it on another relay. The Estiva relay drops those rows before any
`limit`, so a short page does not reveal a hidden one either. Querying another
person's read state returns nothing. Other `kind:30078` data is unaffected.

### 11.7 What the relay does not tell you

The relay does **not** advertise NIP-RS, and `supported_nips` does not include
78. An app cannot discover this support from NIP-11 and MUST NOT gate on it.

### 11.8 Membership: whose unread a stream is

Added 2026-09-30 (CON-19). Read state says *how far* a person has read. It does
not say *which* conversations they should be told about, and without a rule for
that every stream a person can open is a candidate for a dot. **A person is told
about a file's conversation when they are a member of the file.** Every app
computes membership the same way, from events already on the relay, so a member
in Ship is a member in Peek and in Leaf.

It replaces *following* (RFC 0.4 §4.6), which was a private list that only Peek
kept and that no other app could see or add to. "Member" keeps the meaning
RFC 0.4 §4.0 gives it — a **person** — and names a different relation for each
grain:

| grain | a member is | decided by |
| --- | --- | --- |
| a Folder | a person on its channel's roster — in an open Folder, a reader who has not joined is not one | the relay roster, `kind:39002` (RFC 0.4 §5) |
| a file | a person involved in it | the fold below |

**Membership of a file grants nothing.** Access is the Folder's (§3). A person
who is a member of a file in a Folder they cannot read has nothing to be told,
and a reader cannot see the events that would make them a member anyway.

#### What makes a person a member of a file

A person `P` **joins** file `F` with each of these events. Every one is public
and already carries what the rule needs:

| trigger | the event |
| --- | --- |
| created it | `F`'s root event, whose address names `P` as its pubkey. It joins at the earliest `created_at` of the root the reader holds. |
| took part in its conversation | a message in `F`'s stream (§11.1) authored by `P` |
| was mentioned in it | a message in `F`'s stream whose content mentions `P` (§13) |
| was placed on it | a `kind:1851` on `F` carrying `["p", P]`, whose field is not a membership field and whose `value` is not empty — an assignee, a lead |
| was added, or joined | a `kind:1851` on `F` setting `member:<P>` to `true`, by anyone |

A person **leaves** `F` with one event: a `kind:1851` on `F` setting
`member:<P>` to `false`, **signed by `P`**. A `false` signed by anybody else is
ignored. Membership costs its member only their attention, so only they can
give it up, and nobody can take away somebody else's view of a file they are
involved in.

A mention requires the content to name `P`, not merely a `p` tag. The comment
builders tag the file's author and the parent's author on every comment
(§6.4), so a `p` alone would make each new comment re-join an author who had
left.

A placement counts by its `p` alone (decided 2026-10-01), so the members a
fold finds are exactly what the `#p` filter below returns. A writer that places
a person MUST add `["p", <value>]`. On production on 2026-09-30, 37 of 52
assignee changes and all 4 lead changes carried no `p`, and those place nobody.
A change with an empty `value`, such as an unassign, takes someone off the file
and places nobody, whatever `p` it carries.

The creation orders **before every other event for the file**. A relay keeps
only the latest version of an addressable event, so the root a reader holds is
usually the last edit. Ordered by its own time, an edit after the author left
would make them a member again. The author's member-since is the earliest
second among their joins after their last leave.

#### The membership change

```
kind: 1851
tags: ["a", F] ["field", "member:<P>"] ["value", "true" | "false"] ["h", <channel>] ["ts", <ms>] ["p", P]
```

It is an ordinary change event (§6.2). The field is **per person** because §6.3
folds last write wins per field: one `member` field would hold one person.
`<P>` is 64 lowercase hex. The trailing `p` is what lets a person find every
file they were added to with one `#p` filter, as they already find what they
were assigned to. An app that does not know the field folds it like any other
(§6.3).

Measured on production 2026-09-30, as the agent in the QA Folder: the relay
accepted a `member:<P>` change on an issue, and both `#p` and `#a` returned it.

#### The fold

Take every join and leave for `(F, P)` and order them as §6.3 orders changes.
`P` is a member when the last of them is a join. They are a member **since**
the first join after the last leave, or the first join of all when they never
left.

A later trigger makes a person who left a member again: being mentioned,
placed, added, or writing in the conversation themselves. Other people talking
in it does not.

A reader computes one file's membership from that file's own events: its root,
its stream and its `kind:1851` changes. To find **which** files a person is a
member of, these filters return every candidate, and each candidate is then
folded as above:

```json
[{"kinds": [1851], "#p": ["<P>"]},
 {"kinds": [1111, 9], "authors": ["<P>"]},
 {"kinds": [1111, 9], "#p": ["<P>"]}]
```

together with the files `P` created. A client MAY bound these with `since`.
Membership that such a client cannot see lapses for that client alone, and it
comes back with the next event that names the person.

#### What membership changes about unread

A message in a file's stream is **unread for `P`** when all of these hold:

1. `P` is a member of the file and has not muted it, or the message's content
   mentions `P`;
2. `P` did not write it;
3. its `created_at` is at or after the second `P` became a member — so the
   message that mentioned or placed them counts;
4. it is newer than `P`'s effective marker for it (§11.3).

Condition 3 is what settles absence for a file (§11.6). A member who has never
opened the file is told about what was said since they joined, and nothing
before it. A person who is mentioned for the first time on a year-old issue sees
the message that mentions them, not the year.

A Folder's general stream is judged the same way, with the channel roster as
its membership. The roster carries no join time, so condition 3 does not apply
to it, and absence is still the app's choice there (§11.6). A DM's two
participants are its members.

**An app lights nothing for a stream it has no screen for.** A dot the person
cannot clear in that app is noise, whatever another app shows.

**Agents are members like anyone else.** A comment the agent writes lights a
member's dot the way a person's does. Membership is what keeps that bounded:
nobody is told about a file they have no part in.

#### Muting is private

A member MAY mute a stream: stay a member, visible to everyone as one, and be
told nothing about it except the messages that mention them. A mute is the
person's own and nobody else's business, so it lives in suite-wide app-private
storage (§12): `kind:30078`, `d` = `estiva:muted:v1`, `["t", "estiva-appdata"]`,
NIP-44 encrypted to self, holding

```json
{"v": 1, "updatedAt": <epoch ms>, "keys": ["<file address or channel uuid>", …]}
```

Whole blob, last write wins (§12.3). `estiva` is the suite's client id, shared
because muting is judged the same way in every app.

#### Following, retired

`estiva:followed:v1` (RFC 0.4 §4.6) is read once more and not written again. Its
file keys are **not** published: the list was private, so a client MUST NOT
sign a membership change for one without the person choosing to join. Its
`muted` keys become this list. Its Folder keys are dropped, because the roster
decides the general stream. Nothing else is migrated, because everything
following implied is a trigger above.

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
> read, measured. §13.1's `code` mark and `nostr:` reference were specified
> ahead of an implementation. The reasoning, the alternatives and what the
> choice costs are in [RFC 0.4 §14.5](RFC-0.4-WORKSPACE.md).
>
> **§13.3 is no longer among them.** It said "no app writes a block document
> today" until 2026-09-10; Ship has published issue and project descriptions as
> `estiva-blocks-1` since RIC-14, and its browser test asserts the format tag on
> the event. The `attachment` block below is the part still specified ahead of
> its first producer.

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

**Rule 2 does not apply to the code marker.** It resolves an ambiguity only the
asymmetric prose markers have: `*` is also multiplication and a glob, `_` is also
part of an identifier. A backtick has no such second meaning, and applying the
fence to it leaves `` `main`s `` literal — a code span followed by a plural or a
possessive, which is ordinary English. Measured 2026-09-02: **8 such spans in 6
published messages, and zero cases where the opening side needed the fence.**
CommonMark draws the same line. Rule 1 still applies to code.

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

#### The `attachment` block

A file placed in the document. Its `attrs` are NIP-92's `imeta` fields, as a
JSON object rather than a space-separated tag:

```json
{
  "type": "attachment",
  "id": "b3",
  "attrs": {
    "url": "https://relay.example/media/<sha256>.png",
    "m": "image/png",
    "x": "<sha256>",
    "size": 27564,
    "dim": "366x296",
    "thumb": "https://relay.example/media/<sha256>.thumb.jpg",
    "filename": "diagram.png"
  }
}
```

`url`, `m`, `x` and `size` are REQUIRED; `dim`, `thumb`, `alt` and `filename`
are OPTIONAL and carry NIP-92's meanings. The same fields deliberately: one
description of a file, carried two ways because the two content models differ,
so a reader that can draw a message's attachment draws this one with the same
code.

`m` and `x` MUST be the values the **relay** reported when it stored the blob,
never the client's own guess: the relay compares them against what it holds and
refuses a message whose `imeta` disagrees, with nothing in the error to say
which field was wrong. `x` is the blob's sha256, and it is also what a reader
must name in the authorization it signs to fetch the bytes — media GET is
authenticated, so an `<img src>` cannot load one.

**A producer MUST also emit an `imeta` tag on the event carrying the document,
naming the same blob.** The block is where the file *appears*; the tag is what
the relay can check.

Ingest verifies `imeta` **tags** and never parses `content`. The check is not
gated on kind — any event carrying `imeta` tags is verified — so the tag earns a
change event the same guarantee a message has: a document naming a blob the
relay does not hold is refused outright, rather than published and rendering as
a broken file for every reader. Without the tag there is no such check, and
nothing would refuse it.

A consumer MUST render the block from its `attrs` and MUST NOT require the tag
to be present: it is the producer's obligation, a consumer cannot repair its
absence, and refusing to draw a file that is plainly described would punish the
reader for the writer's omission.

A block whose `attrs` are missing a REQUIRED field is malformed: a consumer MUST
render its inline content per the unknown-block rule below rather than drawing a
broken file, exactly as it would for a type it does not know.

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


### 13.6 Anchoring a comment to one block

*Added 2026-09-02 (RIC-7). This is the answer to RFC 0.4 §6, and the reason
§13.3 requires a block id at all.*

A comment MAY name a single block of the object it addresses, by carrying that
block's id in a `block` tag:

```jsonc
{
  "kind": 1111,
  "tags": [
    ["A", "30851:<pubkey>:<d>"], ["K", "30851"], ["P", "<pubkey>"],
    ["a", "30851:<pubkey>:<d>"], ["k", "30851"], ["p", "<pubkey>"],
    ["block", "8373a025427f"],
    ["h", "<folder>"]
  ],
  "content": "this table is out of date"
}
```

The address says which object; the `block` tag says which part of it. The id is
§13.3's — unique within the document and stable across every edit that does not
replace the block.

**A `block` tag is meaningful only against a block document.** Marker text has
no addressable sub-unit (§13.1), so an anchor on an object whose body is marker
text does not resolve and never will. That is not a defect to repair: it is what
"two content models" means, and it is why §13.3 is JSON.

#### Four states, and a reader MUST tell them apart

Resolving an anchor has four outcomes, and **collapsing any two of them is the
failure this section exists to prevent**:

| | when | what a reader owes the person |
| --- | --- | --- |
| **unanchored** | no `block` tag | nothing — it is a comment about the whole object |
| **resolved** | the tag names a block that is present | show what it points at |
| **unaddressable** | the body is not a block document | say the comment refers to a part of something that has no parts |
| **detached** | the tag names a block that is gone | **say so** |

**A reader MUST NOT render a detached anchor as if the comment were
unanchored.** The two look identical on screen and mean opposite things: one is
a remark about the object, the other is a remark about a paragraph somebody has
since deleted. A reader that cannot tell them apart silently converts the second
into the first, and nothing reports it.

This is the same discipline §7.5 applies to an unknown widget and §13.3 to an
unknown block type, for the same reason each time: **an absence that renders as
an ordinary presence is indistinguishable from correctness.**

> **This address has a second use, still a draft.** `(object, block)` is also
> what a *transclusion* needs — a document or a message showing a live part of
> another object rather than a copy of it. [RFC 0.6](RFC-0.6-COMPOSITION.md)
> generalises this section's grammar and its four states, and adds a fifth the
> anchor case cannot reach: content the reader is not permitted to see. Nothing
> in §13.6 changes if that is accepted; it becomes the degenerate case.

#### An anchor is expected to break

A block can be deleted, split, or merged by somebody who never saw the comment,
and a description is replaced wholesale on every edit. An implementation
reconstructing blocks from text carries a further limit — a block that is moved
*and* edited in one save may not be recognisable as the same block at all.

So **detachment is a normal state, not an error condition.** An implementation
MUST NOT delete a comment whose anchor no longer resolves, and MUST NOT rewrite
the comment to drop its `block` tag: the tag is the record of what the author
was looking at, and it is still true that they were looking at it.
