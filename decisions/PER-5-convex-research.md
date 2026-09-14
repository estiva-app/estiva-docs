# Do we need Convex?

**Research for PER-5.** Not a decision — ADR 0001 already made the policy
decision, and this applies it to the code that exists on 2026-09-14. Everything
below is read off `origin/main` at that date, or off `origin/nfb-demo-kinds` for
the relay. Where something is estimated rather than measured, it says so.

---

## Executive summary

**The intuition in the ticket is broadly right, and the reason is sharper than
the ticket states.** Convex is not "historical residuum" in general — it is
running two quite different jobs, and only one of them was ever justified.

1. **Convex is Peek-only.** Ship, `estiva-foundation`, `estiva-ui` and
   `estiva-id` have no `convex` dependency and not one `from 'convex…'` import
   between them. "Should the suite drop Convex" is a question about one app.

2. **Roughly 2,900 of Peek's 6,474 non-test Convex lines exist to maintain a
   copy of content the relay already owns.** The genuinely app-private surface —
   screener, desk, huddles, topic renames — is about 1,000 lines.

3. **The last two weeks paid the duplicate's bill in public.** 19 of 23 commits
   touching `convex/` also had to touch the relay path. All 7 schema fields
   added in the window mirror a relay field. Two user-reported bugs were pure
   projection drift, of a kind that cannot occur in Ship.

4. **Buzz is substantially more capable than the ticket assumes** — it has a
   cron/workflow engine, NIP-50 full-text search, NIP-45 COUNT, transactional
   thread counters, Blossom blob storage and relay-signed derived state. Three
   things usually listed as "only an app backend can do this" are simply wrong
   for Buzz.

5. **The strongest remaining argument for Convex does not survive contact with
   the spec.** `readState` was kept as a "horizon cache" because an aged-out
   read context is indistinguishable from never-read. But SPEC §11.6 says in
   terms: *"The horizon is a client choice with no protocol default."* Peek
   chose 90 days, and the `since` it produces filters the **blob's
   `created_at`**, not the age of the contexts inside it. Peek never prunes a
   context by age. So for any installation used within 90 days, every context
   comes back. The cache is compensating for a clause Peek chose and can drop.

6. **But there is a real ceiling, and it is size, not time** — and it is
   currently unguarded. See [§5](#5-the-horizon-is-not-the-problem-the-blob-size-is).

**Recommended shape: shrink, in three stages, and keep a much smaller Convex.**
Not "delete Convex" — the last stage is a decision that should be taken on
measurements nobody has yet. Detail in [§7](#7-the-plan).

---

## 1. What Convex does today

22 non-test modules, 6,474 lines, 15 tables. Classified against ADR 0001 §3.

| Table | Layer it belongs in | Note |
| --- | --- | --- |
| `messages`, `replies`, `reactions`, `topics`, `topicMembers`, `resolutionAssertions`, `users` | **1 — relay** | Mirrors. Every one has a relay original. |
| `stars` | **2 — `kind:30078`** | Already dual-writing to `kind:30078` today. |
| `dmConversations` | **1, once DMS lands** | App-private *only* because DMs-on-Nostr has not shipped. |
| `screenerItems`, `deskOpenWork`, `huddles`, `huddleMembers`, `topicRenames` | **3 — legitimate** | Queues and aggregation. ~1,000 lines total. |
| `readState` | **contested** | The horizon cache. See §5. |

The two largest modules, `convex/nostr/sync.ts` (860) and `convex/nostr/data.ts`
(796), exist solely to keep the mirror current.

**A correction to CRO-10, which matters because CRO-10's framing rests on it.**
That ticket cites `convex/nostr/projection.ts`, 1,142 lines, as the heart of the
duplicate. The file is no longer there. On 2026-08-31 it moved to
`interop/projection.ts` as a pure `git mv`, and the commit message is the
cleanest statement of the whole problem anyone has written:

> Nothing about it is Convex: its entire import list is two lines of
> `@estiva-app/protocol`, the relay arrives as an injected `QueryFn`, and no
> Convex function has ever imported it. Convex's codegen listed it in the
> deployed function surface for nothing.

It has since been published as `@estiva-app/interop`. The largest thing anyone
called "the Convex projection" turned out not to be Convex code at all, and
removing it from `convex/` cost nothing and cut test setup from 79 s to 0 ms.

---

## 2. What Buzz can actually do

Read off `origin/nfb-demo-kinds`. Three claims that circulate in our own tickets
are wrong and should stop being repeated:

| Claim | Reality |
| --- | --- |
| "The relay can't run scheduled jobs" | `buzz-workflow` runs a 60 s tick with cron expressions, leader election and a scheduled-fire claim. Peek's own `convex/crons.ts` is an empty `cronJobs()` — we run no server-side schedule anywhere. |
| "No server-side derived data" | Transactional `reply_count`/`descendant_count`/`last_reply_at` maintained in the insert transaction; reaction aggregates; feed read-models; relay-*signed* derived state (kind:30890 Folder state in response to a client kind:1852). |
| "No search" | NIP-50 is real: Postgres `tsvector GENERATED ALWAYS … STORED` + GIN, so indexing *is* the insert. No indexer, no consistency window. Access re-checked per hit. |

Also confirmed: NIP-45 COUNT, Blossom blobs with thumbnails and per-type size
caps, WebSocket with NIP-42, HTTP bridge with NIP-98.

**On the meter.** 300/min per pubkey is confirmed, and is per *(community,
pubkey)* rather than per IP. Reads and writes share the one bucket, and writes
are metered at the same rate. It is counted before filters are parsed, so one
POST carrying 40 filters costs one unit — the batching lever in the project
brief is real and unbounded on HTTP (the advertised `max_filters: 10` is
enforced only on the WebSocket). **A WebSocket `REQ` costs nothing against the
300/min HTTP budget** — separate counters entirely. No endpoint emits a
remaining-budget header and NIP-11 has no field for one, so a client can only
discover the limit by hitting it. Worth its own ticket.

**On `{"#h": ["A","B"]}` — the reported bug is refuted.** Both paths explicitly
decline to collapse a multi-value `#h`, and push all accessible channels into
SQL as a set. A and B are both queried. What is not per-channel is the `limit`:
it becomes one `ORDER BY created_at DESC LIMIT n` over the union, so a busy A
starves B and the response is indistinguishable from "B is empty". That is
NIP-01 semantics — `limit` is per-filter — not a Buzz defect. One filter per
container is the correct idiom when you need guaranteed depth, and it costs
nothing extra because filters-per-POST is what the meter ignores.

---

## 3. The last two weeks (2026-08-31 → 2026-09-14)

108 merges to Peek's main. 23 commits touched `convex/`.

| | |
| --- | --- |
| Convex commits that also touched the relay path | **19 of 23 (83%)** |
| Schema fields added in the window | **7, all mirrors of a relay field** |
| Peek merges that shipped a relay feature with no Convex at all | **~85** |
| User-reported bugs that were pure Convex↔relay drift | **2** |

The same feature, both apps, same week:

| Feature | Ship | Peek | Ratio |
| --- | --- | --- | --- |
| FOL-16 per-file read state | 7 files, 178 ins. | 25 files, 727 ins. | **4.1×** |
| RIC-11 resolve a message mention | 4 files, 148 ins. | 27 files, 1,325 ins. | **9×** (Peek also built a picker) |

The two drift bugs are the part that should carry the most weight, because
neither could exist in Ship and neither was catchable by a test. In one,
`syncReactions` discarded every event whose author had a Peek account, so every
reaction made in Ship was fetched and silently thrown away — *"It only ever
looked like a de-duplication rule because the two apps had no second writer
until Ship got reactions this week."* In the other, the full persistence path
existed and never ran: *"Every layer agreed with itself, which is why no test
caught it."*

**The counter-evidence, stated fairly.** Two things in the window are better
because of Convex: CRO-6's horizon cache (§5 argues this one away, but it was a
reasonable thing to build) and PEE-6's screener de-duplication, which heals
stale rows at read time through `by_user`/`by_topic` indexes with no migration.
PEE-6 is a textbook ADR 0001 layer-3 case and should be kept.

And Peek's best-measured merge of the window, FOL-18's Folder-row unread union,
used **no Convex at all**: 2 POSTs, 449 ms, 147 Folders, against production.

---

## 4. Upcoming work

Nothing planned is blocked by shrinking Convex; several things are held back by
keeping it.

| Workstream | Convex | Why |
| --- | --- | --- |
| Folders / navigation | **hurts** | Cross-app by construction. FOL-23 is *already* titled "…and Convex topics as the source of truth" — the removal is scheduled work, not a proposal. |
| **Leaf** | **hurts / irrelevant** | Substrate is relay git, decided. Starts from the four foundation packages, none of which is Convex. |
| DMs on Nostr | **hurts, one real cost** | The project's purpose is moving DMs off Convex. DMS-7's migration is the genuine blocker. |
| Composition (RFC 0.6) | **leans hurts** | §5: a consumer "MAY cache a resolution for the life of a view; it MUST NOT persist one as content." A server-side projection is precisely the persisted copy that forbids. |
| Conversation standard | **hurts** | The package must be installable by an app with no backend. |
| Scaffold / SHA-6 | **hurts** | The scaffold is explicitly "no backend, enforcing ADR 0001". |
| Intelligence, Rich text, Interop | irrelevant | On-device, or wire-format work. |
| Screener / Desk / stars | **helps** | Genuine aggregation — but ADR 0001 names these as the *ownership* problem. |

**On Leaf, which is the reason this project exists.** The design is already
decided and none of it points at a database: git hosted on the relay, block-level
granularity with `(object address, block id)` as the anchor comments already use
in production, and real-time collaborative editing explicitly *off* the wire —
app-local CRDT, publish at the commit boundary, presence via ephemeral
kind:20001/20002. ADR 0001 pre-answers the question directly: *"Leaf would be
choosing it with none of Peek's reasons."*

---

## 5. The horizon is not the problem; the blob size is

This is the finding that changes the shape of the answer, so here is the whole
chain.

`convex/readState.ts:95` heads a block called "The horizon cache (CRO-6)" and
justifies keeping Convex in the read path like this: NIP-RS fetches with
`since: now - horizon`, and an aged-out context is indistinguishable from one
never read, so something durable has to sit behind the protocol.

Three facts undercut it.

**The horizon is ours.** SPEC §11.6: *"The horizon is a client choice with no
protocol default."* Peek picked 90 days (`src/nostr/readState.ts:377`); the
reference default is 7.

**The `since` does not do what the comment says.** `allSlotsFilter`
(`src/nostr/readState.ts:388`) puts `since` on a `kind:30078` query. That filters
the **blob's `created_at`** — when the slot was last republished — not the age of
the contexts inside it. The blob is rewritten on every read.

**Nothing prunes a context by age.** The only eviction in the file is
`MAX_CONTEXTS = 10_000`, applied by recency (`src/nostr/readState.ts:304`).

So for any installation used within 90 days, *every* context in the blob comes
back, including one last touched years ago. The failure the cache exists to
prevent — "a container last read three weeks ago reads as unread" — does not
occur for an active installation. It occurs only for one dormant longer than the
horizon, and dropping `since` closes that case entirely. The code's own comment
concedes the cost is nil: *"the relay stores the events either way, and the
query is bounded by author and tag rather than by scan."*

**The real ceiling, which nobody is watching.** Read-state blobs are grow-only,
and Peek enforces no byte cap on them. `src/nostr/appData.ts` establishes that
the binding limit for an app that holds no keys is `POST /nip44/encrypt`
refusing plaintext over **65,535 bytes** — not SPEC §12.5's 256 KiB relay cap
and not §11.6's 32,768-byte reference-client figure. `readState.ts` enforces
neither; it enforces only the 10,000-context cap.

Entry sizes, from the id constructors at `src/nostr/readState.ts:73–97`:

| Context kind | Id | JSON bytes/entry |
| --- | --- | --- |
| container | bare uuid, 36 ch | ~50 |
| `thread:<64 hex>` | 71 ch | ~85 |
| `msg:<64 hex>` | 68 ch | ~82 |

That puts the encrypt seam's refusal at roughly **770–1,310 contexts** — 8 to 13
times *below* the 10,000 cap Peek actually checks. Past that point read-state
publishing fails with a `console.warn` and the person's read markers quietly
stop advancing.

Peek is not there yet: ~147 Folders and ~66 containers is ~213 container
contexts. But `thread:` entries accrue one per conversation read, and they are
the expensive shape.

**This is unmeasured.** Nobody has read a production blob's byte size, and it
should be the first thing done — it is a two-minute check and it decides whether
this is a latent bug or a live one. But note what it is: a **size** problem with
at least two fixes that are not a server — prune by age (the horizon the code
already believes in, applied to contexts rather than to the query), or rotate
across the 8 slots §11.6 permits.

---

## 6. What genuinely blocks a smaller Convex

Honestly, and in order:

1. **DM history (DMS-7).** Peek's DMs live in Convex in plaintext and are the
   only copy. The relay rejects `created_at` outside ~±15 minutes, so
   republishing history destroys its chronology. This is decided-not-coded and
   should not be started by writing a migration.
2. **Rendering when the relay refuses.** Peek's cache is why a refused read
   costs a console warning instead of Ship's blank page. Remove it with no
   replacement and Peek inherits Ship's failure mode. The project brief already
   names the replacement direction — *a shared client-side cache, one library,
   that Ship, Leaf and Peek could share* — and that is packageable into
   `@estiva-app/platform`, which Convex can never be.
3. **Screener, Desk and the people directory.** Real aggregation with no relay
   answer today. Keep.
4. **The 65,535-byte NIP-44 ceiling** on anything moved to layer 2.

Not blockers, contrary to repeated assertion: scheduled jobs (Buzz has them,
Peek uses none), server-side search (NIP-50), and blob storage (new uploads
already go to Blossom via `@estiva-app/protocol`; only legacy `_storage` remains).

---

## 7. The plan

Three stages. Each is independently valuable and independently reversible, and
the order is chosen so the reversible things happen first.

**Stage 1 — stop the mirror growing.** No new Convex table or field may mirror
relay state; new state goes to layer 1 or layer 2. Given that 7 of the 7 fields
added in the last fortnight were mirrors, this rule is the highest-leverage
zero-cost item on the list. Delete `convex/identityProbe.ts` (29 lines, zero
callers, its own header says to).

FOL-23 removes Convex `topics` as the source of truth and belongs in this stage,
but it is **not runnable yet**: its own description waits on the tree, the route
and the HQ migration, which are FOL-21, FOL-19 and FOL-22 — all Todo, with
FOL-12 and FOL-14 still in progress. The policy half needs no decision and can
start today; FOL-23 is queued behind the Folders work.

**Stage 2 — move layer-2 state off Convex.** `stars`, `screenerItems` and
`deskOpenWork` are the state ADR 0001 names as the ownership failure. The
machinery exists and is proven: `src/nostr/appData.ts` implements the layer-2
convention and `src/nostr/stars.ts` already dual-writes to `kind:30078`. Finish
stars, then assess whether the screener's aggregation genuinely needs an index
or whether it is a fold over a blob the person owns. Keep whatever still needs a
query — that is ADR 0001 working as written, not a defeat.

**Stage 3 — decide the read path, on numbers.** This is CRO-10, and it should be
unparked and re-scoped. Its original framing is stale in two ways: the file it
names has left Convex, and the client-side fold it said did not exist now does
(`src/nostr/channelStreams.ts`, `src/api/teamUnread.ts`, shipped in FOL-18 and
measured at 2 POSTs / 449 ms / 147 Folders). What remains worth measuring is
narrow:

- the production read-state blob's byte size, against the 65,535 ceiling (§5);
- cold start to first meaningful paint with the sidebar folded from relay data
  only, against today's Convex-backed number;
- whether `convex/unread.ts` is replaceable. It is the most expensive thing in
  the tree: `containerFlags` collects every message in a container, then runs a
  nested query collecting every reply per message, looped over every topic,
  every huddle and every DM, to produce four arrays of ids. The queries are
  indexed (`by_parent`, `by_message`) — the cost is the full collection, not a
  missing index — but it is still O(messages × replies) per sidebar render.
  FOL-18 already computes the Folder version of that answer from the relay in
  449 ms.

**What this plan does not do is delete Convex**, and that is deliberate. ADR
0001's rule is the right one and it is narrower than the ticket's instinct:
*Convex may never be the source of truth for something the relay owns, and never
the only home for something a person would reasonably expect to own.* Applied
honestly, that rule removes most of what is in `convex/` today. What survives —
the screener's indexes, and possibly a much smaller read-state safety net — earns
its place by a shipped feature, which is exactly the test ADR 0001 sets.

### What does not wait for DMs

DMs are the slowest item in §6 and the whole DM track is untouched — DMS-2
through DMS-11 are all Todo. But they block **one table of fifteen**
(`dmConversations`) plus a DM branch inside five modules. They do not block the
programme. Four things are available before any of that:

1. **The Stage 1 policy**, above. Free, and it is what stops 7-of-7.
2. **The read-state size bug (§5).** Entirely DM-free, and shaped as a
   correctness fix rather than a migration. It is also the gate on ever
   retiring the horizon cache: until the blob is measured, the cache's
   justification cannot be falsified either way.
3. **The topic half of `unread.summary`.** The query already returns four
   separate arrays — `topics`/`urgentTopics` against `dms`/`urgentDms` — so the
   Folder side can fold from the relay while DMs keep using Convex. FOL-18
   computes that answer in 2 POSTs / 449 ms across 147 Folders. This attacks the
   most expensive query in the tree without touching a DM.
4. **The topic half of stars.** `starsList` is still the read source and the
   relay blob is only a restore path (`src/api/internal/starred.tsx:52,104`);
   flipping the read for `kind: 'topic'` entries finishes CRO-11 for that half.

**Stars does not split cleanly, and that is worth knowing before starting it.**
Starred *people* are keyed by `dmId` — a Convex id — and published as
`people: [{ key: e.dmId }]`. `src/nostr/stars.ts` already says the quiet part:
*"Neither half has a portable identifier today."* So the people half needs
either DM channels on the relay (DMS-3 gives them a uuid) or a pubkey-based key
first. Plan stars as two pieces, not one.

**One thing that looks like a cheap win and is not.** `nostr.config.relayConfig`
is 11 of the 67 Convex call sites in the UI — the single most frequent — and it
carries no data, only the relay origin. But `convex/nostr/config.ts` is
deliberate: the deploy builds both halves in one step so bundle and backend
cannot disagree, and an unset origin means publishing is *silently off* rather
than broken. Removing it early reintroduces exactly that drift. It is a
consequence of Convex leaving, not a step toward it.

---

## 8. What would change the answer

- **A production read-state blob already near 65,535 bytes.** Then §5 is a live
  bug, not a latent one, and it needs fixing this week — though still not
  necessarily with a server.
- **A cold-start measurement that is bad.** If folding the sidebar from relay
  data at real workspace size is materially slower than today, the hybrid
  option — materialise a small per-container summary rather than a copy of every
  message — becomes the right answer, and stage 3 stops at that.
- **Someone making a Folder private.** Ship's coverage block reads 0 unreachable
  of 97 today, which measures nothing until that happens.
- **A second app wanting a layer-3 store.** Then the question stops being about
  Peek and `@estiva-app/platform` has to answer it.
