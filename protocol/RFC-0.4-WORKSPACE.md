# RFC 0.4 — The Workspace: Folders, Files, Components, Conversations, Projections

**Status: draft, not accepted.** Written 2026-08-23 as RFC 0.3, revised 2026-08-24, superseded by this version 2026-08-28.

**This is RFC 0.3's next version, not a companion to it.** Everything 0.3 said is here — folders, files, components, conversations, the two production measurements, the rejected alternatives, the answered-questions ledger. [RFC 0.3](RFC-0.3-FOLDERS.md) is now a pointer stub. **Section numbers 1–12 are unchanged on purpose**, because the roadmap, [SPEC](SPEC.md) and several Ship issues cite §4.2, §5.2, §5.3 and §10.1 by number; renumbering would break every one of those silently. New material is §13–§15, and amendments to 1–12 are marked where they occur.

**What 0.4 adds, and why.** 0.3 specified *containment* — what holds what, and who may read it. It said almost nothing about **projection**: how an object belonging to one app is rendered, edited and acted upon inside another. That layer turned out to already exist in production between Ship and Peek, undocumented as a general mechanism, and it is the layer a third app actually plugs into. 0.4 specifies it, along with the two content models (§14) that 0.3 left as one.

| new | section |
| --- | --- |
| The projection layer — widgets, slots, actions, and the fallback chain | §13 |
| Messages and rich text are two models, not one | §14 |
| What a third app needs, as a checklist | §15 |
| Components are unfrozen — a block *is* a component | §6, amended |
| Conversation semantics: reactions, edit, delete, and the `kind:9`/`1111` correction | §7, amended |

**Three things 0.3 deferred are now decidable, and one has been decided against.** §10.1's stated trigger has fired — upstream shipped its forge layer as `kind:30621`, global-only and single-writer. §6 is unfrozen, because Ship's description field turns out to be a cheaper test bed than Leaf. And the intelligence/memory layer, considered for inclusion here, is **deliberately excluded** — see the roadmap's "not filed, and why", which carries the reasoning and the trigger.

The two verification questions that could have invalidated the containment model — is a topic addressable, and does the address survive — were answered against production on 2026-08-24 and both came back clean. See §5.2 and §5.3.

Succeeds the Folder/File/Component layer of [RFC 0.2](RFC-0.2-RECONCILIATION.md), which proposed three concepts and never specified them. It does **not** supersede [FILES_ARCHITECTURE.md](FILES_ARCHITECTURE.md) — it resolves the two gaps that document named and otherwise leaves its conclusion (git provides folders, files, history and merge) intact.

---

## 1. Executive summary

One structure, five concepts. The first four are containment — what holds what, and who may read it. The fifth is **projection**, which is what makes the other four useful to an app that did not create them.

```
Folder            a named, followable, access-controlled container. Addressable;
                  globally discoverable when listed, relay-gated when private.
  ├─ File         anything with an address: a topic, a Ship project, a doc, a Figma file
  │   └─ Component   an addressable location inside a file — a paragraph, a frame
  └─ Conversation NIP-22 threads anchored to a file or a component

Projection        how an app that owns none of the above renders it, and what it
                  may do to it. Declared by the owner, drawn by the consumer.
```

**Projection is the part a third app plugs into, and it already works.** Ship publishes a NIP-89 manifest declaring how its projects and issues should be rendered and what may be done to them; Peek renders and acts on them without a line of code that knows what Ship is. That mechanism was built for one pair of apps and specified narrowly ([SPEC §7](SPEC.md)); §13 generalises it, because the question this RFC is ultimately answering is *"what does the third app have to build, and what does it get for free?"*

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

#### Two failure shapes the rehearsal found, both of which this model repeats

Two of the things REW-11 and SHI-7 cost on Ship are not Ship-specific. They are what happens whenever a container's *description* stops living inside the container — which is exactly what §4.2 proposes, one level up:

**1. Discovering children only through their parent loses them when the parent goes.** Ship reached an issue only by widening from its project, so 13 of 97 became unreachable when their projects were deleted. **A folder is one level up from the same shape.** A folder lists its contents; a client that resolves files only by walking folders loses every file whose folder was deleted, went private, or was never followed — and §5.1's "one home, many references" makes it worse, because a file's *home* folder is the one most likely to be walked and the reference folders are not. Any folder client needs a direct `authors`/`kinds` route to a file as well as the folder route. Ship's fix was one extra unscoped filter; designing it in costs nothing and retrofitting it cost a ticket.

**2. A global container's address is no longer its location, and code that conflates the two fails as a permission error.** Ship's `resolveObject` found the project record, looked for the `h` it had always had, found none, and returned "not found" — which the UI reported as *"you may not have access to its Folder."* A lie, about the record type most likely to be public. Every read path that answers "which channel is this in?" has to answer "none, and that is legal" once a container is global, and the ones that get it wrong will say **access denied** rather than crashing. Grep for the channel tag before implementing folders, not after.

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

**Amended in 0.4 — this section is unfrozen, and it did not need Leaf after all.**

0.3 said: *"choosing needs a real editor to test against. Do not freeze this before Leaf exists."* Paired with §11.3 — *"Leaf should not start before §6 has an answer"* — that was a deadlock, and nothing in the programme was going to break it. Each half waited on the other.

**The way out is that a block is a component.** A rich text field made of blocks (§14) needs its blocks addressable for exactly the reason §6 exists: so a comment can point at one paragraph rather than at the whole document. They are not two problems that resemble each other; they are one problem reached from two directions.

And a block-structured rich text field already exists in production, in an app that is not Leaf. **Ship's issue and project descriptions are the test bed** — 76 of 89 issue descriptions on production carry markdown block structure, the longest 5,706 characters. That is a real corpus, in a real app, with real readers in a second app. Turning one of those fields into addressable blocks and anchoring one comment to one block answers §6 at roughly one-tenth of Leaf's scale — the same move REW-11 made for §4.2, and for the same reason: the small version produces the failure shapes the argument cannot.

So the sequencing in §11.3 inverts. **§6 is answered in Ship first, and Leaf starts with an answer** rather than starting blocked. Expect one iteration when Leaf does arrive — a document editor will stress anchoring harder than a description field — but iterating on a measured design is a different activity from choosing between three unmeasured ones.

**The hard problem is still hard, and the options are unchanged:** an app-maintained anchor event per component; content-addressed anchors that degrade to "somewhere in this file" when the target changes; `(path, anchor-id)` with the app responsible for rewriting. What changed is that there is now somewhere cheap to test them.

**The kind numbers already exist and are already published.** `KIND.FILE = 30840` and `KIND.COMPONENT = 30841`, with `buildFile` and `buildComponent`, ship today in `@estiva-app/protocol` — left over from NIP-FC, which FILES_ARCHITECTURE superseded as a *document model* while explicitly preserving its anchoring idea. Production holds **zero** events of either kind. So the anchoring work inherits allocated, published, unused numbers, and §12.1's caution about squatting does not apply here: these were allocated in our own NIP, not taken from a range we do not own.

## 7. Conversation

A conversation is a set of **NIP-22 `kind:1111`** comments anchored to a file or a component.

> **Correction carried into 0.4.** [SPEC §6.4](SPEC.md) still defines a conversation as a `kind:9` NIP-29 stream message and states *"There is no separate comment kind for this."* That was true when written and is now false — REW-10 moved Ship's comments to `kind:1111`, and SPEC §7.3 documents the move at length. A builder reading the definitional section therefore builds the wrong thing while the section three chapters later tells them so. **§6.4 is corrected as part of adopting this RFC**, and the correction is `kind:1111` for anything anchored to an object, `kind:9` for a message in a channel, with both read together forever — a `kind:9` is not replaceable, so the pair can never shrink to one.

**A conversation and a rich text field are different models, and 0.4 keeps them apart deliberately.** They share an inline vocabulary and nothing else. See §14 — the distinction is load-bearing enough that collapsing it produces a package nobody can use for either job.

NIP-22 is already the right mechanism, in Buzz's own words:

> a threaded comment scoped to any event, address or external identifier... The point of NIP-22 over a bare `kind:1` reply is that it can scope to an **addressable** event, which is what lets two different apps comment on the same object without either owning the comment kind.

- uppercase `A`/`E`/`K`/`P` name the thread **root** — the file or component
- lowercase name the immediate **parent** — the comment being replied to
- an `h` tag puts the thread in the folder's channel, which is what gates who can read it

`kind:1111` is in Buzz's registry and **already accepted by our relay** (commit `ffeb41606`).

### 7.1 One channel per folder, not one per file

Conversations for every file in a folder live in the folder's single channel, distinguished by their anchor. Extra channels exist only where **access differs** (§8).

**Ship already works this way** — `postMessage({ folder, body, about: issue.addr })` posts into the project's Folder tagged at the issue. This RFC replaces the custom `about` tag with NIP-22's standard tags; the pattern is otherwise proven in production.

### 7.2 Reactions, edit and delete — the affordances nobody specified

New in 0.4. A conversation is not only its messages, and the three things people expect around a message are each either unspecified, unevenly built, or both.

**Reactions are `kind:7`, and they have a query shape worth knowing before you build one.** SPEC did not mention reactions at all until 0.4's adoption added [SPEC §6.6](SPEC.md), which records the mechanism below as ratified fact. One property makes them harder than they look: **a `kind:7` carries no `h` tag**, so reactions cannot be found the way messages are. Peek fetches them addressed by *target* rather than by channel or cursor, capped at 100 targets per sync (`REACTION_TARGET_LIMIT`). That cap is undocumented and is a ceiling on how far back reactions resolve in a busy container. An app MUST NOT assume a channel query returns reactions; an app that shows reaction counts MUST state its own horizon.

**Reactions belong to messages, not to blocks.** A message is a social object and carries social affordances. A block in a rich text field is a structural object and carries anchoring instead (§14). This is a deliberate asymmetry, not an omission.

**Edit is a new event, never a rewrite.** A `kind:9` and a `kind:1111` are both non-replaceable, so an edit cannot overwrite what it edits. Whatever an app shows as "edited" is a fold over two events, and two apps folding the same pair MAY legitimately show it differently — the fold is where apps are supposed to differ ([SPEC §10](SPEC.md)).

**Delete is a NIP-09 `kind:5` and inherits every property SPEC §6.5 already gives it** — a request, author-scoped, removing the record and not the work. One consequence deserves restating here because it has bitten this workspace repeatedly: **an identity that cannot sign `kind:5` publishes permanently**, and no other identity can clean up on its behalf. An app MUST hide a delete control from a non-author rather than offer one that silently fails.

**Today only Peek implements any of this.** Ship has no reactions, no edit and no delete on comments — a grep for reaction handling in `estiva-ship` returns nothing. So "reactions are everywhere" describes an intention, and §13's projection layer is what would make it true for an app that never built them.

---

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
| **addressable sub-file anchors** | 🔧 §6 — still the hard one, but no longer frozen: a block is a component, and Ship's description field is the test bed |
| **inline rendering of a foreign object** | ✅ **built** — NIP-89 `kind:31990` + [SPEC §7](SPEC.md), running between Ship and Peek. §13 generalises it |
| projection vocabulary wide enough for a third app | 🔧 §13.2 — four named limits, all small |
| one specified content format | ❌ §14 — three producers, two renderers, nothing written down |
| a conversation model an app can adopt whole | 🔧 §7.2, §15 — specified in pieces, complete in one app |

**The second row moved from ❌ to ✅ between 0.3 and 0.4, and nobody filed a ticket for it.** 0.3 listed inline rendering of a foreign object as an unsolved gap needing "an embed extension to NIP-89". It was already working in production when 0.3 was written — Ship's manifest and Peek's widget had shipped months earlier. The gap was in the document, not the system, which is a reminder that this RFC's inventory is only as good as the last time somebody checked it against the running code.

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

> **Amended in 0.4 — the trigger has fired.** The third bullet above said the decision gets easier once we see *"whether upstream ships their forge layer, and in what shape."* The Buzz catch-up answered it: upstream shipped `kind:30621`, a parameterized-replaceable project record, **global-only**, single-writer, with members as `a` tags. That is the same container concept at a narrower scope, and it settles the shape question this deferral was waiting on. The deferral has come due; it is now a decision to make rather than a decision to postpone. Nothing in §13, §14 or §15 waits on it.

**The latest responsible moment is the first line of folder command or state code**, because that is the point where you either squat numbers or propose them. Everything before it is independent — the Ship alignment items, the shared foundation, the Peek real-time work, read state, DMs. So this can wait a long way without blocking anything, and it should.

**What to do meanwhile, cheaply.** Three things, none of which commits to either path:

1. ~~**Answer §5.2 and §12.3.**~~ **Done, 2026-08-24.** Both came back clean: the `d` is exactly the channel uuid, a non-member does read an open channel's `39000`, and the relay's signing key does not rotate — §12.3's evidence for rotation was a misread NIP-11 field. §5.2 and §5.3 carry the answers, and the topic-addressing model stands as written.
2. ~~**Build REW-11**~~ — **done, 2026-08-24**, along with the relay change it needed (CAT-9) and the discovery fix it turned out *not* to be (SHI-7). See below.
3. **Watch whether upstream ships `kind:1621` issues.** Their forge layer is `"📋 Designed"`; if it ships, its shape is data for this decision.

**What item 2 taught, 2026-08-24.** REW-11 is complete — reader, relay change and writer — and verified against production: the record is served by an unscoped `kinds` query and **not** by an `#h` query for its own channel, while its issues still are. §4.2's central claim now has a working instance behind it at one-tenth the scale. Five things bear on the choice above:

- **The relay is on the critical path, and its ingest gates are invisible from the app.** Buzz refuses a `kind:30850` with no `h` — `KIND_LL_PROJECT` sits in `requires_h_channel_scope` — and refuses it as `200 {"accepted": false, …}` rather than an error. That is one line to change for a project record. It will *not* be one line for folder command and state kinds. This is the concrete form of the fourth bullet above: **read the ingest path, do not estimate it, and read it before the client work rather than after.**
- **The reader must land before the writer, as its own change.** No migration is available — a replaceable event is rewritable only by its author, and rewriting stamps a `created_at` the relay will not backdate — so the two wire shapes coexist permanently. A folder model inherits that property with more at stake, and §4.2's stub/detail pair doubles it.
- **Measure the defect a design change is justified by, before the change.** REW-11's was measured after, and it did not say what the ticket assumed. See §4.2.
- **A Buzz change is cheap to write and expensive to land.** CAT-9 was one line and a test. Merging it, building the image and deploying took longer than the entire client change, because the relay has no update timer and **a green image build is not a deploy** — a probe run straight after the build still got the old refusal. Whatever the folder work costs in Rust, add a deploy that only a behavioural check can confirm.
- **The relay refuses in a shape that reads as success.** `200 {"accepted": false, …}`. Every gate this touched answered 200. Any folder command or state kind will be gated the same way, so the acceptance criteria for folder work must name the `accepted` field, not the status code.

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

**Amended in 0.4 — this inverts.** 0.3 said Leaf was *"the only app that needs §6, and therefore the only one that can choose between the anchoring options"*, and that it should not start before §6 has an answer while §6 should not be frozen before Leaf can test one. Those two clauses are a deadlock, and it held.

It breaks because **Leaf is not the only app with a block-structured field.** Ship's issue and project descriptions already carry block structure in 85% of production records, in an app that exists, with a second app already reading them. §6 gets its answer there, at roughly one-tenth of Leaf's scale, and **Leaf then starts with an answer instead of starting blocked.**

Leaf remains the app that will stress anchoring hardest — a document editor rewrites its own content far more aggressively than a description field — so expect one iteration and budget for it. But iterating on a design that has been measured is a different activity from choosing between three that have not.

### 11.4 Agents — the thing that motivated this

"The context for X" resolves to a folder address, and everything in it is reachable without knowing which apps are involved. That is the payoff, and it arrives with §4 rather than needing §6.

## 12. Open questions

> **Three sections follow this one**, despite it reading as a conclusion — §13, §14 and §15 are new in 0.4 and are numbered after the existing material so that every cross-reference into §1–§12 keeps resolving. [SPEC](SPEC.md) carries the same quirk for the same reason.

**Amended in 0.4.** Question 2 is no longer frozen (§6, §11.3). The rest stand, with what would close each.

1. **Kind numbers — deliberately unassigned.** A folder needs a command kind and a relay-signed state kind. Buzz's convention is `9xxx` for commands and `39xxx` for state, but those ranges are NIP-29's, and Estiva's own block (`30850`–`30899`) has no convention for relay-signed state. **If this goes upstream as a NIP (§10.1) the numbers should be allocated there, not squatted here first.** Whichever way it goes, run the allocation check NIP-MP modelled — the upstream NIPs table, nostrbook.dev, and our own registry — and remember both external registries are advisory rather than authoritative.

2. **Component anchoring** (§6). ~~Needs a real editor to choose against.~~ **Unfrozen in 0.4.** The three candidate approaches are unchanged and still differ in fragility, but the test bed is Ship's description field rather than Leaf, so this is now work rather than a question waiting on an app that does not exist. See §6 and §11.3.

3. **What happens to Peek's existing topics.** They are channels with no folder. Do they gain membership retroactively, who decides which folder, and what happens to one nobody claims?

4. **Does the folder's channel hold every file's conversation at scale?** One busy folder is one busy channel. Probably fine; worth knowing the ceiling before finding it.

5. **The word "huddle"** (§8), given Buzz's `48100`-family audio rooms already own it in the same registry.

6. **Disclosure UI** (§4.5). Granting access discloses all history. That is decided, but *how* the product says so before the click is unspecified, and it is the difference between a considered decision and an accident. **0.4 adds a second disclosure needing the same treatment**: §5.2 measured that an open channel's full member roster is world-readable, so *listing* a folder discloses who is in it, not merely that it exists. Both moments need product copy, and they are different moments.

**New in 0.4:**

7. **Which content format** (§14.5). Three candidates, and 487 published events that cannot move whichever is chosen. §14.5 recommends a split — marker dialect for messages, structured blocks for rich text — but recommending is not deciding, and the `alsoRead`-shaped compatibility story has to be written either way.

8. **Who may add a widget type** (§13.3). The fallback chain means an unknown widget always renders, so this is no longer *blocking*. It is still unanswered: does a new widget name need to be registered anywhere, or does the vocabulary converge by use and get written down afterwards? The second is this programme's usual answer, and it needs somebody to actually do the writing down.

9. **What a harness may read** (§13.4's deferred neighbour). An app that derives state by scanning raw events reads across every Folder its identity can see, and §5.2 measured that open-channel content and rosters are world-readable to any relay member. That constraint is recorded here so the intelligence layer inherits it rather than rediscovering it; the layer itself is deliberately outside this RFC.

10. **Reaction horizon** (§7.2). `kind:7` carries no `h` tag, so reactions are fetched by target with an undocumented cap of 100. Nobody has decided what the guarantee should be, and the current answer is whatever one app's constant happens to say.

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

**Answered in 0.4:**

- **Does upstream ship a forge layer, and in what shape** — yes: `kind:30621`, parameterized-replaceable, **global-only**, single-writer, members as `a` tags. This was §10.1's stated trigger and it has fired. §10.
- **Is inline rendering of a foreign object still a gap** — no. It shipped between Ship and Peek before 0.3 was written, and 0.3's inventory was stale rather than the system being incomplete. §9, §13.1.
- **Are a message and a rich text field one content model** — no, two, and the production corpus already shows two dialects. They share only their inline layer. §14.
- **Must §6 wait for Leaf** — no. A block is a component, and Ship's description field is a test bed that exists today. §6, §11.3.
- **Closed or open widget vocabulary** — neither alone: slots closed, widgets open with a fallback chain terminating in a closed type. §13.3.
- **Does the intelligence/memory layer belong in this RFC** — no. Deliberately excluded, with its trigger recorded in the roadmap: the first time a second app's harness needs to read another app's memories, which is [SPEC §12.1](SPEC.md)'s first question flipping. Peek's highlights are an experiment and are **not** to be published to an append-only kind while the model is unsettled.

---

## 13. The projection layer

**New in 0.4, and mostly already built.** This section describes a mechanism running in production between Ship and Peek, generalises it, and names the four things that stop a third app using it.

### 13.1 What exists

An app that owns objects publishes a NIP-89 `kind:31990` manifest declaring, in JSON:

| field | says |
| --- | --- |
| `records` | how to fold this app's change events into current truth — the change kind, its tag names, the ordering rule, and what "hidden" means |
| `projections` | per kind: a widget type and a set of **slots**, each sourced from a tag, a top-level field, or a folded field |
| `actions` | what another app may *do*, as an event to publish — not an API to call |
| `vocabularies` | enumerated values as `{value, label, colour}`, colour being semantic (`neutral`/`blue`/`green`/`muted`) and never a hex code |

The governing principle, already stated in [SPEC §7](SPEC.md) and unchanged here:

> **The owner defines the projection. The consumer decides how it looks.**

That inversion is the whole value. Normal integration has every consumer pick fields itself, and each gets it wrong differently. Here the owner says which fields matter and the consumer renders them in its own design language, so a Ship issue looks like Peek inside Peek. It is also why a manifest declares a widget *type* and never layout: an owner that could specify layout would control the consumer's UI, which is the same objection that rules out iframes.

**A consumer needs three things and no knowledge of the owner:** the owner's manifest, a renderer for the declared widget types, and its own design tokens. Peek's `ForeignObjectWidget` contains zero lines that know what Ship is.

### 13.2 Four things that stop a third app using it

Each of these is a real limit found by reading the running code, not a hypothetical.

**1. The widget vocabulary is a closed set of four, owned by nobody.** `card | row | table | stat` is a union type in one consumer's source. An app declaring anything else renders nothing, and there is no document that says what the legal values are or who may add one.

**2. Slots are scalar, so the most-wanted layout cannot be expressed.** Slots today are `title`, `subtitle`, `status`, `meta`. There is no list slot and no image slot — so "a project card with its issues underneath", which is the shape Peek actually shows, is *not* a manifest projection at all. It is bespoke consumer code. The pattern's own flagship example bypasses the pattern.

**3. Object-creating actions are declared but deliberately unrenderable.** Ship's manifest declares `add-issue` with a real input schema (`type: object`, `properties`, `required`). The consumer skips it, and says why: *"an action that creates a whole new object needs a form and a parent, so it is skipped rather than drawn as a control that cannot work."* Field-setting and commenting are the only two action shapes that render.

**4. Nothing in an action is addressed to a machine.** `{ id, label, appliesTo, emits, input }` is enough to draw a control and not enough for an agent to decide to use one. `label: "Change status"` is a button caption.

### 13.3 Slots are closed; widgets are open with a fallback chain

The two vocabularies get different policies, because they are different kinds of thing.

**`slots` — closed, specified here.** A slot is *semantic*: a consumer must know what `title` or `status` **means** in order to render it at all, so an unknown slot name is unrenderable by definition and openness buys nothing. 0.4 extends the closed set rather than opening it:

| slot | holds |
| --- | --- |
| `title` | the object's name — the one required slot |
| `subtitle` | a short description. See the truncation note below |
| `status` | a value from a declared vocabulary |
| `meta` | one or more secondary values, each optionally a person (`as: "pubkey"`) |
| `image` | *new* — an avatar, thumbnail or cover, as a URL |
| `list` | *new* — child objects by address, so the consumer resolves and renders them with their own projections |
| `body` | *new* — structured content per §14, for objects whose body is the point |

**`widget` — open, with a required fallback chain.** A widget type is a *layout hint*, not a semantic, so an unknown one can degrade honestly. A manifest MAY declare any widget name, and MUST declare it as an ordered chain:

```jsonc
"widget": ["profile", "card"]   // render me as a profile if you know it, else as a card
```

**A chain MUST terminate in a type this document closes** (`card`, `row`, `table`, `stat`). `["profile", "card"]` is legal; `["profile"]` alone is not. A consumer walks the chain and renders the first type it implements.

**This is the third application of a pattern already in the codebase, not a new invention.** `slots` already accept `tag: ["name", "title"]` meaning *first that resolves* — added by REW-11 because a renamed tag cannot be rewritten on events already published. `emits.alsoRead` is the same idea for kinds, added because an app that changes what it emits cannot move its history. Both exist because **published events are immutable and consumers upgrade at different times**, which is exactly the condition a widget vocabulary lives under.

What the chain buys, against the two pure alternatives:

- against a **closed set**: a producer is never blocked on a spec change plus a consumer upgrade — the two-sided deployment that would otherwise stand between a third-party builder and shipping.
- against a **bare open set**: there is always a known-good floor. An unrenderable widget is the [PEE-10](../ROADMAP.md) failure mode — an object that is present but blank reads as *"that app is broken"* — and the terminal type is what stops that being possible.

Conformance is checkable in both directions: a producer's chain must terminate in a closed type, and a consumer must honour the chain rather than only its first entry.

**One casualty to fix while extending slots.** `subtitle: { field: "content", truncate: 120 }` renders the first 120 characters of an object's description. Against the descriptions production actually holds — 85% carrying markdown structure, the longest 5,706 characters — that yields 120 characters of raw markup. `truncate` is a plain-text operation and MUST NOT be applied to a structured field; a `body` slot carries structure and a `subtitle` slot carries a plain-text summary, and an app with a structured description owes the consumer the latter.

### 13.4 Actions: forms, and one seam left open

**Object-creating actions become renderable.** An action whose `input.type` is `object` declares `properties` and `required`, and a consumer draws a form. This is the same declaration Ship already publishes; what is new is that a consumer is expected to render it rather than skip it. It is also the path an agent uses — *"take this Peek conversation and create a job description in the HR tool"* is this action shape with the form filled from context instead of by hand.

**Two optional fields exist for that second caller, and nothing more.**

| field | for |
| --- | --- |
| `description` | prose aimed at a machine, distinct from `label`, which is a button caption |
| `effect` | `safe` \| `writes` \| `destructive` — whether invoking without confirmation is acceptable |

These are **fields, not a design.** The intelligence layer they anticipate is deliberately outside this RFC (see the roadmap's "not filed, and why"). They are included because adding a field now costs nothing and adding one after three apps have published manifests is a migration — the same argument `alsoRead` makes one level down.

**An action is an event to publish, never an endpoint to call.** The consumer signs and publishes; the owning app has no server in the loop and cannot enforce anything. That is a property, not a gap: it is what lets a consumer act while the owner is offline. Its consequence is that **validation is an honour system**, and a consumer that skips the manifest's own vocabulary check is the one putting junk in a shared record.

### 13.5 The second consumer, and why this must not ship without one

`@estiva-app/protocol` gained the live relay socket as a single implementation with a single caller, and [SHA-7](../ROADMAP.md) exists to pay for it. This layer is at the same risk and larger: every line of the consumer runtime today lives in one app, and no second consumer has ever pushed back on its API.

**The second consumer is Ship, and the objects are Peek's.** Peek publishes a manifest for **Topic** and **Message**; Ship renders them inside a project or issue description. That direction has never run — today Peek only consumes and Ship only produces — and it exercises the layer where it is weakest:

- a **Message** is neither `card` nor `row` nor `table` nor `stat`, so it is the first real use of the fallback chain
- a **Topic** wants a `list` slot, which is the slot the pattern was missing
- a Message rendered in Ship is, in itself, the unified cross-app comment experience §14 and the conversation package are aiming at

---

## 14. Messages and rich text are two models

**New in 0.4.** 0.3 treated "content" as one thing. It is two, they overlap only in their inline layer, and building one mechanism for both produces something that serves neither.

### 14.1 The distinction

| | message | rich text field |
| --- | --- | --- |
| what it is | an event | a field on an object |
| lifetime | immutable; an edit is another event | replaceable with its object |
| attachments | appended **below**, always | placed **inline**, as a block |
| reactions | yes | no |
| threading | yes | no |
| addressable sub-unit | the message itself | **the block** (§6) |
| structure | a short run of inline-marked lines | a tree of blocks |

The rows are not arbitrary. They follow from the first two: a message is an append-only social object, so it accumulates social affordances and its content is fixed once written. A rich text field is a mutable structural object, so it accumulates structure and its parts need addresses.

### 14.2 The distinction is already true on the wire, and was never designed

Measured against production, 2026-08-28:

| | events | carrying structure | dialect |
| --- | --- | --- | --- |
| messages (`kind:9`, `kind:1111`) | 398 | **165 (41%)** | `**bold**`, `*italic*`, `__underline__`, `#`, `>`, `-`, `1.` |
| descriptions (`kind:30850`, `kind:30851`) | 89 with a body | **76 (85%)** | the above **plus tables (10), fenced code (14), links** |

Two different dialects are in use in the same workspace, and **neither is written down anywhere.** No section of SPEC mentions content formatting; a grep for markdown, rich text or formatting returns nothing.

**There are three producers and they do not agree.** Peek's composer serialises a TipTap document to an ad-hoc marker syntax. Ship's composer is a plain `<textarea>`. The agent CLI writes freehand markdown, and it is the heaviest producer of structure on the relay. The agent uses backticks constantly; Peek's editor has code spans *disabled* and its parser has no backtick rule — so `` `like this` `` renders with the backticks visible in both apps.

**And there are two renderers that disagree.** Peek parses the markers back and renders them. Ship renders message bodies as literal text, on purpose — *"the body is untrusted text from other people and other apps: rendered as text, never as markup."* So the same comment reads formatted in one app and raw in the other, today, in production, for 41% of messages.

**Ship's position is right and must survive whatever replaces this.** The fix is not "make Ship render markdown." It is: specify a format, and ship one renderer that is safe by construction. A format nobody wrote down is not a lenient standard, it is three private ones.

### 14.3 What is shared, and what is not

**Shared — the inline layer.** Bold, italic, underline, code, link, mention, and object reference. These appear in both models and mean the same thing in both. This is wire-visible content, so by [SPEC §10](SPEC.md)'s test — *would the relay notice if two apps disagreed?* — it belongs in `@estiva-app/protocol` with one serialiser and one parser.

**Not shared — the block layer.** Only rich text has it. Blocks nest, carry inline content, and are addressable per §6.

**Not shared — the affordances.** Reactions, threading and appended attachments are message-only and already have wire support (`buildReaction`, `threadTags`, `buildMessage`'s `imeta` tags).

### 14.4 Mentions are half-specified, and the half that is missing is permanent

`buildMessage` takes `mentions: string[]` and emits `p` tags, so **who** was mentioned is on the wire and resolvable by anyone. But the inline token is the person's **display name** — `@Ada Lovelace` — and the parser that turns it back into a chip resolves it against a local directory of names. Two consequences:

- another app cannot render the chip without holding the same directory, so a mention degrades to plain text across the ecosystem
- message content is immutable, so **a rename desynchronises the text from the `p` tags permanently**

NIP-27's inline `nostr:npub…` is the specified answer and is not currently used inside message bodies. Adopting it makes a mention self-describing — resolvable by any app, stable across renames — and it is additive: the `p` tags stay, and existing messages keep working unchanged because the old form is still parseable.

### 14.5 A format decision, and the corpus it has to live with

Three candidates, and the choice is not free in any direction:

1. **Specify the existing marker dialect.** Cheapest; matches the 398 messages already published; caps expressiveness at roughly what Peek's editor emits today.
2. **Adopt a CommonMark subset.** Standard, well-understood parsers, matches what the descriptions corpus already contains — but it is a *superset* of the message dialect, so the two models diverge further rather than converging.
3. **Structured blocks as JSON in `content`.** What block editing actually wants, and what §6 anchoring needs. Costs the most, and makes `content` unreadable to anything that does not parse it.

**Whatever is chosen, the 487 existing events do not move.** They are non-replaceable or replaceable-only-by-author, and REW-11 established that rewriting stamps a `created_at` the relay will not backdate. So every candidate needs an `alsoRead`-shaped answer: a declaration of what the old form was, and a reader that handles both permanently. The migration is not a window that closes — it is the steady state.

**A reasonable split, and the one this RFC recommends:** the message model takes (1), because its corpus is large, its needs are modest, and its content is immutable anyway. The rich text model takes (3), because blocks are the point and anchoring needs them. The inline layer is shared between them, which is what keeps a message and a paragraph feeling like the same product.

---

## 15. What the third app needs

**New in 0.4.** The programme's purpose is a third major application, and every foundation decision should be answerable by *"does this make the third app cheaper?"* This section is the checklist, written from the position of a builder who has an HR tool in mind and no interest in Nostr.

### 15.1 What they get today

| need | package | state |
| --- | --- | --- |
| authenticate a person | `@estiva-app/identity` | published, two consumers |
| speak the protocol | `@estiva-app/protocol` | published, three consumers |
| look like Estiva | `@estiva-app/ui` | published, two consumers |
| behave in a browser | `@estiva-app/platform` | **not built** — SHA-2 |

### 15.2 What they must still build themselves, and should not have to

- **Rendering another app's objects.** The consumer runtime exists, works, and lives inside one app (`peek-app/convex/nostr/projection.ts`) at a path that says Convex while its own header says it knows nothing about Convex.
- **Comments.** An HR specialist wants people commenting on candidates. They do not want to implement threading, reactions, edit, delete and unread. Today they would build all of it, and it would be the fifth independent implementation of a model that is specified in three places and complete in one.
- **Rich text.** Every app has description fields. Today that means choosing a dialect nobody wrote down.

### 15.3 The rule for getting there: build in the app, package deliberately

Functionality lands in a real app first and is packaged afterwards — extraction without a consumer produces a package shaped like nothing, which is [SHA-7](../ROADMAP.md)'s lesson. But *"we'll extract it later"* is how `liveTopics.ts` became a ticket, so the intention has to be checkable while the code is being written:

1. **No imports from the app's data layer, store or config.** The dependency runs one way.
2. **Every environment touch is an injected parameter** — query function, signer, clock. Never a module-level global.
3. **Its tests run with no app.** If a test needs a deployment or a browser, the package cannot carry that test, and untested code does not travel.
4. **Put it where it is going.** A path that lies about what a file is, is how a thing quietly grows app-shaped.

The two outcomes already in the tree show the difference: `projection.ts` takes a query function and is extractable today; `textParsing.ts` imports the app's own people and topic fixtures and cannot leave the building.

### 15.4 A package may be the standard without being the protocol

The commenting package is intended to become the default that essentially every app adopts, and that is a good goal — a unified conversation experience across the ecosystem is worth more than each app's variation on it. An app that wants to diverge still can, and some will.

**One rule keeps that honest.** [SPEC §9](SPEC.md)'s conformance list and the wire sections MUST stay sufficient to implement conversations *without* the package. If the package becomes the only place that knows how commenting works, an interop standard has quietly been traded for a monoculture — and then a defect in its fold is a defect in every app at once, invisible from any of them, which is precisely the failure class [SILENT-FAILURES.md](../operations/SILENT-FAILURES.md) catalogues.

**The package is the reference implementation. The specification is the standard.** Both, in that order.

Note also that a genuinely drop-in comments package is not complete until read state exists — unread is one of the things the HR builder most wants and least wants to build, and it is the *Cross-app read state* project. The wire and rendering halves can land first; the unread half joins when that project does.
