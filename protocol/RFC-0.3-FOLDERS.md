# RFC 0.3 — Folders, Files, Components, Conversations

**Status: draft, not accepted.** Written 2026-08-23, revised 2026-08-24. Kind numbers are deliberately unassigned (§12.1) and the upstream-versus-fork question is deliberately deferred (§10.1). Tag shapes here are proposals nobody has implemented. Read §12 before building anything.

The two verification questions that could have invalidated the model — is a topic addressable, and does the address survive — were answered against production on 2026-08-24 and both came back clean. See §5.2 and §5.3.

Succeeds the Folder/File/Component layer of [RFC 0.2](RFC-0.2-RECONCILIATION.md), which proposed three concepts and never specified them. It does **not** supersede [FILES_ARCHITECTURE.md](FILES_ARCHITECTURE.md) — it resolves the two gaps that document named and otherwise leaves its conclusion (git provides folders, files, history and merge) intact.

---

## 1. Executive summary

One structure, four concepts:

```
Folder            a named, followable, access-controlled container. Addressable;
                  globally discoverable when listed, relay-gated when private.
  ├─ File         anything with an address: a topic, a Ship project, a doc, a Figma file
  │   └─ Component   an addressable location inside a file — a paragraph, a frame
  └─ Conversation NIP-22 threads anchored to a file or a component
```

**A topic stops being special.** Today a Peek topic *is* a Buzz channel. Here it is a file whose own content is thin and whose value is its conversation — the same shape as a Figma file with comments on a frame, or a doc with comments on a paragraph.

**Discussions work identically across every file type.** That is the point of the whole design, and the mechanism already exists: NIP-22 `kind:1111`, which scopes a threaded comment to any address.

**A huddle needs no new concept.** It is a conversation whose channel has narrower access, anchored to a file or component.

**Folder state is maintained by the relay**, not signed by a user — commands in, relay-signed state out, exactly how Buzz already runs channels. That is what makes a folder editable by more than one person, and it is a structural divergence from upstream. See §4 and §10.

Almost everything needed exists. Two things must be built, and [FILES_ARCHITECTURE.md](FILES_ARCHITECTURE.md) already named both.

## 2. Motivation

Three problems, in the order they bite:

1. **Nothing pairs.** A project's Figma file, its Ship board, its docs and its conversations live in four tools with four navigation models. A person has to remember where each is; an AI harness has no way to assemble them as context.
2. **Peek's topic list reads like an email inbox.** A flat, endless list with no structure to hang recency or relevance on.
3. **Every SaaS tool invents its own hierarchy.** Learning where things live is per-tool work that does not transfer.

The fix is one container concept that works at the protocol level, so every app renders the same tree and an agent can resolve "the context for this project" without knowing which apps are involved.

## 3. What changes from today

Stated plainly, because these are not small:

| today | under this RFC |
| --- | --- |
| **Folder = a Buzz channel** (a uuid in an `h` tag) | Folder = relay-maintained state that *references* a channel |
| **Topic = a channel** | Topic = a file listed in a folder |
| Comments = `kind:9` with a custom `about` tag | Conversations = NIP-22 `kind:1111` anchored by address |
| A project record is channel-scoped, so discovery runs through membership | A listed folder is global and discoverable without access; a private one is not discoverable at all beyond a contentless stub |
| Huddle = a bespoke Peek concept in Convex | Huddle = a channel with narrower access and an anchor |

The first two are the load-bearing changes and both land on Peek's central abstraction. See §11.

## 4. Folder

### 4.0 Terminology, because one word was doing two jobs

Upstream's NIP-MP calls the repositories inside a project its *members*. In Estiva "member" means a **person**. This document therefore never uses it for files:

- **contents** — the files a folder holds
- **access** / **core team** — the people who can read it

A reviewer who conflates the two will misread every authorization rule below.

### 4.1 Folder state is relay-maintained

A folder is not a user-signed event. Clients send **commands**; the relay validates authorization at write time and emits the **state** as an addressable event it signs itself.

This is not a new pattern — it is exactly how Buzz already runs channels: `kind:9000`/`9001` commands from authorized users, relay-signed `39000`/`39001`/`39002` state out.

The reason is that **NIP-01 addressable events are single-signer by construction.** The address is `(pubkey, kind, d)`, so a second person does not replace your folder — they create a different one. Upstream concluded from this that shared editing is a non-goal, and for a repository grouping that is defensible. For a company folder that several people add files to, it is not.

Two alternatives were considered and rejected; see §4.7.

### 4.2 Visibility determines scoping, not a tag

#### Why a listed folder must be global

Three of the four required properties are **impossible** if the folder state carries an `h` tag, because `h` files it under a channel and gates reads by access:

| property | needs | works under `h`? |
| --- | --- | --- |
| "explore folders you don't follow" | discoverable without access | **no** |
| "a file has one home but can be referenced elsewhere" | the folder *lists* its contents, so one address appears in two lists | **no** |
| "follow / unfollow a folder" | a stable address to point a follow-list at | **no** |
| "access permissions, core team" | channel access | yes — the one thing `h` does well |

So the channel stays and keeps doing access and conversation; the folder becomes a layer above it.

**A claim that was here and is not true, corrected rather than deleted.** This section used to say the change "removes a live defect: Ship loses issues whose project record is unreachable — 13 of 65 in production — precisely because discovery runs through access-gated records." Building REW-11 measured those issues one at a time, and **none of them is caused by access gating**: 12 have a parent project record that was *deleted* and resolves by no query at all, and 1 never carried an `a` tag. All of them sit in folders the reader can already see. Global discovery takes the count from 13 to 13.

The argument above is unaffected — it rests on the four properties, not on that defect. What the correction costs is the evidence, and the lesson is worth more than the sentence was: **the workspace this was measured on has no private channel at all.** All 50 of production's channels are `open` (§5.2), so discovery-through-access-gating is a failure mode Estiva has not yet had. It is a real one, and the first private Folder will produce it. It was simply not what was happening to these thirteen.

#### Why visibility cannot then be a tag

A tag cannot hide anything on a global event. `buzz-visibility: private` on a world-readable event still exposes the folder's name, description and the addresses of everything in it — which for "Employees evaluation" leaks precisely the sensitive part.

So visibility is **structural**:

**Listed folder** — one global state event. Metadata public; conversations still gated by channel access.

**Private folder** — two events:

| event | scope | carries |
| --- | --- | --- |
| stub | global | the folder's `d` and `visibility: private`. **Nothing else.** |
| detail | `h` = the folder's channel, so relay-gated by access | name, description, contents |

The stub exists because existence being known is acceptable and useful: it lets "explore folders" be honest about what it is not showing, and it gives an access request something to point at (§4.5). The detail event reveals nothing to a non-member — not the name, not the people, not what is inside.

Relay-maintained state is what keeps the pair consistent. Two user-signed events would drift.

### 4.3 The `d` tag is always an opaque uuid

Never a human slug, for any folder.

An address is immutable and appears in public places — a file's home pointer, a reference from another folder, an access request. `30852:<pk>:employees-evaluation` puts the name in plaintext forever, and a folder that starts listed and later goes private has already leaked it. The display name is the `name` tag, which lives in the detail event and can therefore be private.

This settles what was open question 5.

### 4.4 A private folder's channel MUST itself be private

An enforced invariant, not a convention.

A folder points at a channel. If the folder is private and the channel is `open`, then the channel's name and **every conversation in it** are world-readable — and the channel name will match the folder name, because a human made both. The UI would show a padlock over public content and nothing anywhere would report a problem.

That is the failure shape catalogued in [SILENT-FAILURES.md](../operations/SILENT-FAILURES.md): healthy-looking, wrong, invisible from the layer that would tell you. The relay must refuse a private folder whose channel is not private.

### 4.5 Access — people, and how they get in

**Access to a folder is access to its channel.** Nothing new is needed: `kind:9000` adds a person, `kind:9001` removes them, any admin may do either, and the relay emits the updated `39002`. This is already multi-writer and already relay-mediated.

**A new person can read all past conversation. Decided.** The relay stores `joined_at` and `removed_at` on every membership but no read path consults them, so this is also the current behaviour rather than a change.

The consequence belongs in the product, not the protocol: **the moment of granting access is the moment of disclosure.** The UI must say so before it happens — naming the volume, not just the act. Where that is the wrong outcome, the answer is a tightly scoped folder ("Employees evaluation 2026 Q3", fixed cohort, next quarter is a new folder) or a huddle, not a mechanism.

**Access requests cannot use NIP-29 join requests.** `kind:9021` is refused outright for private channels (`buzz-relay/src/handlers/ingest.rs:2193` — `"restricted: channel is private"`). Recorded here so nobody rediscovers it.

Instead a request is a **NIP-22 `kind:1111` comment anchored at the folder's stub**. The stub is global, so a non-member can publish against it; admins watch for `1111` anchored at their folders. The requester learns nothing beyond "my request exists", and no admin identity is revealed — `kind:39001` (group admins) is itself channel-scoped and gated, so a non-member could not discover who to ask anyway.

Letting private channels accept join requests without revealing anything would be cleaner, and is on the propose-back list in §10.

### 4.6 Following

A per-user list, private, using the app-private storage convention: `kind:30078`, `d = "estiva:folders-followed:v1"`, NIP-44 encrypted, holding folder addresses. See CRO-11. NIP-51 `kind:30003` is the alternative and makes follows public; following is a navigation preference, so private is the better default.

### 4.7 Rejected alternatives

Recorded because both are reasonable enough to be re-proposed.

**User-signed folder with `kind:1851` change events.** The first draft of this RFC. Two defects: authorization is evaluated at read time, so a person's additions silently vanish when they leave the core team; and if changes are channel-scoped so the relay can authorize them, non-members read the base event and none of the changes — seeing the folder as created rather than as it is, which defeats §4.2's stub entirely.

**Copy the folder and retire the original when access changes** — the pattern Buzz uses for DMs, where adding a participant creates a new DM.

That works for a DM because **a DM *is* the channel**: its id is derived from the participant hash, so a different set is arithmetically a different channel. A folder only *references* a channel, which leaves two outcomes and both fail. Keep the same channel and the new person reads all history anyway, so the copy is theatre. Create a new channel and the conversation is stranded in the retired one — history protected by destroying continuity for everybody, repeated on every join.

It also breaks every inbound reference. A DM has none; a folder is the hub of the navigation model, so file homes, cross-folder references, follow lists and read-state contexts would all need rewriting each time somebody joined.

**History gating on join** was considered as the thing copy-and-retire was really reaching for. `joined_at` exists and nothing reads it, so it is buildable — but the product decision is that a new person sees the history (§4.5), so it is not needed. Left here because it is a real relay gap worth knowing about.

## 5. File

A file is **anything with an address that a folder can list.** (Files are the folder's *contents*, never its "members" — see §4.0.) The folder does not care what it is; the owning app does.

| file | address |
| --- | --- |
| Ship project | `30850:<pk>:<uuid>` |
| doc, codebase | `30617:<pk>:<repo-d>` — git-backed per FILES_ARCHITECTURE |
| Peek topic | `39000:<relay>:<channel-uuid>` — see below |
| Figma file, foreign object | whatever kind its app declares, resolved via NIP-89 |

### 5.1 One home, many references

A file's **home** is the folder its own event names. A folder listing a file it does not own is a **reference**. Both render identically; only the home folder is authoritative for "where does this live."

Proposal: the file names its home, and folders name their contents. A reference is a folder listing a file whose home is elsewhere — no extra mechanism, and no way for one folder to steal another's file.

### 5.2 Topics are addressable, which was not obvious — verified

A channel is not an event, so it appeared to have no address. It does: the relay emits an addressable discovery event per channel — `kind:39000`, signed by the relay, with the channel uuid as its `d` (`buzz-relay/src/handlers/side_effects.rs:971`).

This matters more than it sounds. It means **one tag type — `a` — lists every file**, topics included, with no special case.

Both facts this section asked to verify were checked against production on 2026-08-24. Both hold.

**The `d` value is exactly the channel uuid.** `emit_group_discovery_events` binds `group_id = channel_id.to_string()` — the `Uuid` itself, lowercase and hyphenated, with nothing derived or prefixed — and passes it as the `d` of all three discovery kinds. Upstream is identical here. Measured over all 50 channels the relay serves: every `d` is a lowercase v4 uuid, none missing, none duplicated, and the set of `d` values on `39000` is exactly the set on `39002`. The same uuid is the `h` tag of the channel's messages — all 32 distinct `h` values across 156 `kind:9` events resolve to a `39000` `d`. One uuid, three roles: channel id, `h` tag, `d` tag.

**A non-member can read an open channel's `39000`.** The read path is `get_accessible_channel_ids` (`buzz-db/src/channel.rs:638`), and its whole body is *channels where this pubkey is an active member* `UNION` *every channel with `visibility = 'open'`*. Membership is one of two routes in; open visibility is the other.

Measured end to end with two identities: the Ship agent key (`b38fd268…`) appears in **none** of the 50 `kind:39002` rosters on production — it is a member of nothing — and it reads all 50 `kind:39000`, all 50 `kind:39001` and all 50 `kind:39002`. The channels belong to other people, 42 of the 50 to `f3a38fa6…`. A direct address read, `{"kinds":[39000],"#d":["925897ad-…"]}`, returns the event with its `d` intact. So a listed folder can show its topics to non-members, and §4.2's first property holds for topics.

Two consequences worth stating, because both are disclosures rather than conveniences:

- **An open channel's full member roster is world-readable** to any relay member. `39002` rides the same `UNION` and carries a `p` tag per member, so a listed folder discloses *who is in it*, not merely that it exists. §4.2 already accepts that a listed folder's metadata is public; this says the people are metadata too, and whatever the product says at the moment a folder is *listed* has to name that, the way §4.5 names it at the moment access is granted.
- **The negative arm was not measured.** All 50 channels on production are `public`, so there was nothing private for this reader to be refused, and constructing the case needs a second relay-member identity the suite does not currently provision. The `UNION` above is the only non-membership route into the accessible set, so the gate follows from it — but that is a read of the code, not a measurement, and it should be closed the first time a second service identity exists.

### 5.3 The address depends on the relay's signing key, which does not rotate

`39000:<relay-pubkey>:<channel-uuid>` is only as stable as the pubkey inside it. This was open question §12.3, and its premise turned out to be wrong.

**The evidence for "rotation is designed for" was a misread field.** `keys: [{ current: true, id: "relay-v1", … }]` is not relay-identity metadata. It sits **inside the `push` object** of the NIP-11 document, and it is the NIP-PL push-executor descriptor: `id` is `BUZZ_PUSH_EXECUTOR_KEY_ID`, whose default is the literal string `relay-v1` (`buzz-relay/src/config.rs:746`). NIP-PL does design for rotation *of the executor key* — it has a `retiring` flag and a two-entry example — but Buzz emits exactly one entry, always `current: true`, always `state.relay_keypair` (`nip11.rs:199`), so the descriptor cannot express rotation even for push.

The relay's actual identity field is NIP-11 **`self`**: a bare hex pubkey, no version, no flag. On production it equals `push.keys[0].pubkey`, which is how the two came to be conflated.

**Rotation is not implemented, in the fork or upstream.** `relay_keypair` is parsed once at boot from `BUZZ_RELAY_PRIVATE_KEY` into a plain `nostr::Keys` field on `AppState` (`main.rs:392`, `state.rs:528`); `AppState` lives behind an `Arc` with no interior mutability, so it cannot change while the process runs. Nothing in either tree re-signs, re-keys or retires a discovery event, and upstream — 625 commits ahead — has added nothing: `nip11_facts` is byte-identical to ours.

**The code requires the key to be stable and says so.** `nip11_facts` withholds `self` entirely when `BUZZ_RELAY_PRIVATE_KEY` is unset, on the stated ground that ephemeral keys "change on restart, leaving previously-signed events unverifiable" (`nip11.rs:293`). The relay refuses to boot with membership enforcement and no stable key. The mesh anchors peer acceptance to the same pubkey — "all pods share the relay signing key, so a seed attested by any other key is foreign and rejected" (`mesh_boot.rs:441`). Stability is already an invariant three subsystems depend on. Topic addressing would be the fourth, not the first.

**No rotation has happened on this deployment.** Every relay-signed event production serves — 50 `39000`, 50 `39001`, 50 `39002`, 50 `40099`, 1 `13534`, spanning 2026-08-07 to 2026-08-24 — has exactly one distinct author, equal to NIP-11 `self`.

**So the address is stable and §5.2's model stands.** The residual risk is not that rotation happens by design; it is that nothing stops an operator doing it by hand, and the result would be silent:

`replace_addressable_event` soft-deletes the prior event `WHERE … AND pubkey = $3` (`buzz-db/src/lib.rs:3370`). Under a new key that matches nothing. The old `39000` is **orphaned — not re-signed, not deleted**: still live in the store, still returned by a `#d` query, never updated again. Discovery events are re-emitted only when the channel itself changes (create, metadata edit, membership change, archive) and there is no boot-time sweep, so an unchanged channel would keep only its old-key event indefinitely, while a changed one would return **two** events for one `d` under different authors — one live, one frozen and progressively wrong. Every `a` tag pointing at the old address would keep resolving. Nothing would error. That is exactly the shape [SILENT-FAILURES.md](../operations/SILENT-FAILURES.md) catalogues.

**There is no stable relay identity separate from the signing key**, so there is nothing to switch the address to. NIP-11 `pubkey` is null; `push.origin` (`wss://estiva.estiva.app`) is stable but is a URL, and a NIP-01 `a` tag needs 64 hex characters; the community id is a Postgres column that never reaches the wire.

**What to do instead of a mechanism.** Treat `BUZZ_RELAY_PRIVATE_KEY` as load-bearing for addressing, and record that where operators look rather than only here. If it ever has to change, re-signing every discovery event and tombstoning the old ones is a migration to design deliberately — not an operational step somebody takes on a Tuesday.

## 6. Component

A component is **an addressable location inside a file**, existing so a comment can point at a paragraph rather than at the whole document.

FILES_ARCHITECTURE superseded NIP-FC's Files and Components in favour of git — correctly — but named one exception:

> **Comments on part of a file lose their anchor.** Git has no addressable sub-file unit. GitHub solves this with `(commit, path, line-range)` and it is famously fragile across edits. **This is the one place NIP-FC's addressable Components were genuinely better** — worth revisiting if pinned comments prove painful.

They are not "painful" — anchored comments across every file type are the core of this design. So the Component idea returns, **for anchoring only**. Git keeps folders, files, history and merge. NIP-FC stays superseded as a *document model*.

**This section is the least settled part of the RFC.** The hard problem is unchanged and unsolved: an anchor must survive edits to the file it points into. Options — an app-maintained anchor event per component; content-addressed anchors that degrade to "somewhere in this file" when the target changes; `(path, anchor-id)` with the app responsible for rewriting. Each has different fragility, and choosing needs a real editor to test against. Do not freeze this before Leaf exists.

## 7. Conversation

A conversation is a set of **NIP-22 `kind:1111`** comments anchored to a file or a component.

NIP-22 is already the right mechanism, in Buzz's own words:

> a threaded comment scoped to any event, address or external identifier... The point of NIP-22 over a bare `kind:1` reply is that it can scope to an **addressable** event, which is what lets two different apps comment on the same object without either owning the comment kind.

- uppercase `A`/`E`/`K`/`P` name the thread **root** — the file or component
- lowercase name the immediate **parent** — the comment being replied to
- an `h` tag puts the thread in the folder's channel, which is what gates who can read it

`kind:1111` is in Buzz's registry and **already accepted by our relay** (commit `ffeb41606`).

### 7.1 One channel per folder, not one per file

Conversations for every file in a folder live in the folder's single channel, distinguished by their anchor. Extra channels exist only where **access differs** (§8).

**Ship already works this way** — `postMessage({ folder, body, about: issue.addr })` posts into the project's Folder tagged at the issue. This RFC replaces the custom `about` tag with NIP-22's standard tags; the pattern is otherwise proven in production.

## 8. Huddles

A huddle is **a channel with narrower access, anchored to a file or component.** No new kind.

It is a file like any other (a channel, so it has a `39000` address, so a folder can list it), whose entry carries an anchor to what it is about.

Why it needs its own channel rather than being a thread: Buzz gates reads **per channel**, so different access requires a different channel. That is principled rather than accidental, and it is what earlier analysis was missing.

This also disposes of a name collision. Buzz's `kind:48100`–`48103` "huddle" is a **live audio room** — Opus frames over a WebSocket, an ephemeral Redis-only channel, and no chat content at all. Estiva's huddle is a persistent conversation. The two compose rather than conflict: an Estiva huddle can *host* a Buzz audio room. **Estiva should not use the 48100 family, and should consider a different word.**

## 9. What exists, what must be built

| need | status |
| --- | --- |
| threaded comments scoped to any address | ✅ NIP-22 `1111`, accepted by our relay |
| channels, membership, read gating | ✅ Buzz channels |
| addressable identity for a channel | ✅ relay-emitted `39000` — verified against production, §5.2 |
| container shape, tags, visibility | ✅ upstream NIP-MP, generalised here |
| git-backed files with history and merge | ✅ live — Smart HTTP, NIP-98 gated |
| pointing at another app's object | ✅ NIP-19, NIP-21, NIP-27 |
| which app owns a kind | ✅ NIP-89 `31990` |
| multi-writer contents editing | 🔧 §4.1 — relay-maintained state, needs a Buzz change |
| **addressable sub-file anchors** | ❌ §6 — the unsolved one |
| **inline rendering of a foreign object** | ❌ an embed extension to NIP-89, *"far easier to propose than a File kind"* |

Two gaps. Both were named by FILES_ARCHITECTURE before this RFC existed.

## 10. Relationship to Buzz upstream

**Read this before §10's table: the divergence is now structural, not cosmetic.** Upstream's project is a user-signed event. This RFC's folder is relay-maintained state. That is a different object with a different trust model, and no amount of shared tag vocabulary papers over it.

Upstream's `kind:30621` (NIP-MP) is a named grouping of git repository announcements with a `buzz-channel` binding. **It is the same container concept at a narrower scope** — repos only, single-writer, no nesting.

This RFC aligns where alignment is free and diverges only where required:

| | upstream | here |
| --- | --- | --- |
| tag vocabulary | `name`, `description`, `a`, `buzz-channel`, `buzz-visibility` | identical |
| contents | `30617` repos only | any addressable kind |
| editing | signer only, user-signed | core team, **relay-maintained** |
| nesting | out of scope | out of scope — agreed |

Upstream's stated principle is worth adopting explicitly: **"standard kinds as substrate, custom kinds only where genuinely novel."** They justified exactly one custom kind with a three-part argument. This RFC adds a folder command/state pair and nothing else; every other concept here is a standard kind. Estiva should be able to defend each of its custom kinds on those terms — including Ship's existing three.

### 10.1 Upstream or fork — deliberately deferred

Two paths. Propose this as a NIP to Buzz, or implement it privately in the fork.

**On today's merits, proposing looks right.** Relay-maintained state needs a Buzz change either way — new command and state kinds, and the §4.4 invariant enforced at ingest. Once a Buzz change is unavoidable, private kinds are the worse of two options: the same work, none of the review, and a permanent merge burden on top of a 625-commit gap.

**But the decision is deferred on purpose.** It is hard to reason about now, and it gets easier with things we will learn anyway:

- whether Ship's rewrite actually needs folder state, or whether the cheap alignment items are enough on their own
- whether upstream ships their forge layer, and in what shape — theirs is `"📋 Designed"`, not built
- whether Leaf's Component work (§6) pushes the model further than this document goes
- how large the relay change really is, once somebody has read the ingest path with intent rather than estimating

**The latest responsible moment is the first line of folder command or state code**, because that is the point where you either squat numbers or propose them. Everything before it is independent — the Ship alignment items, the shared foundation, the Peek real-time work, read state, DMs. So this can wait a long way without blocking anything, and it should.

**What to do meanwhile, cheaply.** Three things, none of which commits to either path:

1. ~~**Answer §5.2 and §12.3.**~~ **Done, 2026-08-24.** Both came back clean: the `d` is exactly the channel uuid, a non-member does read an open channel's `39000`, and the relay's signing key does not rotate — §12.3's evidence for rotation was a misread NIP-11 field. §5.2 and §5.3 carry the answers, and the topic-addressing model stands as written.
2. **Build REW-11** — Ship's project record going global with a `buzz-channel` tag. That is structurally the same move as making a folder global, so it is a **rehearsal for this decision** run at one-tenth the scale, on a ticket that was already justified by a bug. It answers empirically whether global discovery fixes unreachable records, what breaks when a name becomes world-readable, and how a fold copes with two shapes coexisting. REW-11 needs no part of the Ship rewrite and can be done today.
3. **Watch whether upstream ships `kind:1621` issues.** Their forge layer is `"📋 Designed"`; if it ships, its shape is data for this decision.

**What item 2 taught, 2026-08-24.** REW-11's reader half is built and the four answers are on the issue. Three of them bear on the choice above:

- **The relay is on the critical path, and its ingest gates are invisible from the app.** Buzz refuses a `kind:30850` with no `h` — `KIND_LL_PROJECT` sits in `requires_h_channel_scope` — and refuses it as `200 {"accepted": false, …}` rather than an error. That is one line to change for a project record. It will *not* be one line for folder command and state kinds. This is the concrete form of the fourth bullet above: **read the ingest path, do not estimate it, and read it before the client work rather than after.**
- **The reader must land before the writer, as its own change.** No migration is available — a replaceable event is rewritable only by its author, and rewriting stamps a `created_at` the relay will not backdate — so the two wire shapes coexist permanently. A folder model inherits that property with more at stake, and §4.2's stub/detail pair doubles it.
- **Measure the defect a design change is justified by, before the change.** REW-11's was measured after, and it did not say what the ticket assumed. See §4.2.

### 10.2 If it does go upstream, the list

1. **Multi-writer containers** — the core of this RFC, and a gap upstream has *named* as a non-goal rather than solved.
2. **Private channels accepting join requests** without revealing anything, so §4.5's access requests can use `kind:9021` as intended instead of NIP-22 at a stub.
3. **History gating on join** (§4.7) — not needed by Estiva, but `joined_at` exists and nothing reads it, and somebody will want it.

Estiva has the only working implementation of the tracker semantics either side needs, which is the strongest card and does not expire quickly — but it does expire.

## 11. Consequences

### 11.1 Peek — this is probably larger than the Ship rewrite

Saying "nothing filed is blocked" would be technically true and practically misleading, so: **`topic = channel` is Peek's central abstraction, and this RFC changes it.**

What that touches:

- the sidebar, which is the visible payoff and the smallest part
- the `@/api` data seam, since a topic stops being the unit of subscription
- **PEE-6**, which subscribes one WebSocket REQ per channel. Fewer channels and more anchored threads changes *what* to subscribe to, though not how
- **CRO-3**, which keys read contexts on `h:<folder-uuid>`. Conversation read state stays keyed on the channel so that survives, but a *folder*-level frontier is a new context and the namespace should be reserved now rather than discovered later
- every topic that already exists, each of which is a channel with no folder — see §12
- Convex's `topics` table, which stops being the source of truth for what a topic *is*

None of it is blocked and none of it is small. Plan it as its own project, sequenced after the Ship rewrite has proven the shared foundation, not concurrently.

**DMs are unaffected.** DM channels are orthogonal to folders.

### 11.2 Ship — closest to this already

One folder channel, threads anchored by address, changes as `1851` events: Ship built most of this model already. Its work is the `about` → NIP-22 swap, moving its project record to a relay-maintained folder, and adopting the upstream tag vocabulary. All of it fits inside the rewrite.

### 11.3 Leaf — first to need Components, first able to test them

Leaf is the only app that needs §6, and therefore the only one that can choose between the anchoring options. It should not start before §6 has an answer, and §6 should not be frozen before Leaf can test one — expect one iteration, and budget for it.

### 11.4 Agents — the thing that motivated this

"The context for X" resolves to a folder address, and everything in it is reachable without knowing which apps are involved. That is the payoff, and it arrives with §4 rather than needing §6.

## 12. Open questions

1. **Kind numbers — deliberately unassigned.** A folder needs a command kind and a relay-signed state kind. Buzz's convention is `9xxx` for commands and `39xxx` for state, but those ranges are NIP-29's, and Estiva's own block (`30850`–`30899`) has no convention for relay-signed state. **If this goes upstream as a NIP (§10.1) the numbers should be allocated there, not squatted here first.** Whichever way it goes, run the allocation check NIP-MP modelled — the upstream NIPs table, nostrbook.dev, and our own registry — and remember both external registries are advisory rather than authoritative.

2. **Component anchoring** (§6). The least settled part of this document. An anchor must survive edits to the file it points into, and the three candidate approaches have different fragility. Needs a real editor to choose against.

3. **What happens to Peek's existing topics.** They are channels with no folder. Do they gain membership retroactively, who decides which folder, and what happens to one nobody claims?

4. **Does the folder's channel hold every file's conversation at scale?** One busy folder is one busy channel. Probably fine; worth knowing the ceiling before finding it.

5. **The word "huddle"** (§8), given Buzz's `48100`-family audio rooms already own it in the same registry.

6. **Disclosure UI** (§4.5). Granting access discloses all history. That is decided, but *how* the product says so before the click is unspecified, and it is the difference between a considered decision and an accident.

### Answered, recorded so they are not re-opened

- **Is a topic addressable, and is `39000`'s `d` the channel uuid** — yes, and yes exactly. Measured on production. §5.2.
- **Can a non-member read a listed channel's `39000`** — yes. Open visibility is a second route into the accessible set alongside membership, and a reader who is a member of nothing reads all 50 of production's channels. §5.2.
- **Does the relay's signing key rotate** *(was §12.3)* — no, and it is not designed to. The `keys`/`current`/`relay-v1` evidence was the NIP-PL push-executor descriptor, not relay identity. Recorded with the failure mode a hand-rolled rotation would cause. §5.3.
- **Private folder privacy** — existence may be known; name, people and contents must not be readable. §4.2.
- **Slug versus uuid for `d`** — always uuid. §4.3.
- **Nesting** — out of scope, and upstream agrees.
- **Does a new person read past conversation** — yes. §4.5.
- **Copy-and-retire on access change** — rejected, with reasoning. §4.7.
- **User-signed folder with `1851` changes** — rejected, with reasoning. §4.7.
