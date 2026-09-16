# Do `screenerItems` and `deskOpenWork` need an index, or are they a fold?

**Research for SHR-7.** A spike: a recommendation and the query behind it, not a
migration. Everything below is read off `peek-app` `origin/main` at
`0e65a5b` (2026-09-16), or measured; where something is estimated rather than
measured, it says so.

---

## Executive summary

**Split, and not along the line the ticket expects.** The DM/non-DM seam is the
right seam for the *screener* and the wrong one for *open work*.

1. **`deskOpenWork` is layer 2 whole — DMs included.** It is pure curation: a
   person puts a conversation in front of themselves and takes it out again.
   Nothing about it needs a relay stream, so the DM coupling does not bind it.
   It is the same shape as `stars`, and the shipped `stars` blob is the
   precedent to copy verbatim.

2. **`screenerItems` is neither layer 2 nor layer 3 — it is a fold.** Its rows
   are *derived*, every input is something the viewer can already read, and only
   two things in the table were authored by the person: a snooze and a dismissal.
   Those two go to layer 2 as a timestamp map. The other five fields are
   recomputed.

3. **The ticket's case for layer 3 does not survive a read of `origin/main`, and
   neither does PER-5's.** Both cite `by_user`/`by_topic` indexes on these
   tables. `screenerItems` and `deskOpenWork` have **exactly one index each** —
   `by_user` on `['userId']` (`convex/schema.ts:388,396`). The `by_topic` at
   `convex/screener.ts:55` is on **`topicMembers`** (`schema.ts:165`), a
   different table doing recipient fan-out, which stays at layer 3. There is no
   compound index on either table and never has been; every lookup is "all my
   rows, then a JS `.find()` / `.some()` / `Set`". That access pattern *is* a
   blob.

4. **ADR 0001 §3's one serious candidate is server-side compute, and it argues
   for layer 2, not against it.** `screenMessage` collects **every user in the
   workspace** per message sent (`screener.ts:135`, again at `:191`), and for
   each candidate reads **that person's own `readState`** (`:150-154`). The
   sender's mutation reads another person's private read markers. At layer 2
   read state is NIP-44-encrypted to its owner, so this fan-out is not merely
   replaceable — it is unimplementable, which is a property to want.

5. **Size is the only leg that needs the deployment, and the analytic bound
   already settles it.** Open work on the `stars` shape fits **554** topics in
   65,535 bytes; the app's own `WATCHABLE_LIMIT` is **32**. Screener decisions
   as a timestamp map fit **1,433**. The shape that does *not* fit is the naive
   one — the rows lifted whole, `preview` and all, at **169**. That control is
   the argument for a fold rather than a copy.

6. **What actually stays in Convex is rendering and membership**, which is the
   split `src/nostr/stars.ts` already made in its header: *"Convex stops being
   where the stars are and becomes how they render."*

**Not recommended and stated plainly:** the DM half of the *screener* stays in
Convex, but **not because it meets one of the five**. It stays because its relay
substrate does not exist — `dmConversations` has no relay representation at all
(`convex/nostr/sync.ts:527`), so there is nothing to fold from until DMS-3. That
is debt with an owner, not a legitimate layer 3, and ADR 0001 §2 is explicit that
conflating the two is what the ADR was written to stop.

---

## 1. What the code actually says

### 1.1 The indexes

| Table | Indexes on `origin/main` | Every access path |
| --- | --- | --- |
| `screenerItems` | `by_user` `['userId']` (`schema.ts:388`) | `by_user` → JS filter |
| `deskOpenWork` | `by_user` `['userId']` (`schema.ts:396`) | `by_user` → JS filter |
| `topicMembers` | `by_topic`, `by_user` (`schema.ts:165-166`) | fan-out; **stays layer 3** |

Nine call sites, no exceptions:

- `screener.ts:79` `findItem` — `by_user`, then `rows.find(r => r.kind === kind && r.targetId === targetId)`.
- `screener.ts:100` `inOpenWork` — `by_user`, then `rows.some(...)`.
- `desk.ts:132,141` `screenerList` — both tables by `by_user`, then a `Set` of
  `` `${kind}:${targetId}` `` to subtract one from the other.
- `desk.ts:200,237,267,309` — `by_user`, then `.some()` / a loop.
- `readState.ts:60` `clearScreenerFor` — `by_user`, then a loop on `targetId`.
- `nostr/sync.ts:542,546` `watchableChannels` — `by_user` on all three tables.

The two exceptions to `by_user` are **unindexed full table scans across every
user**, at `topics.ts:207,210`, sweeping both tables when a topic is deleted.

### 1.2 What is authored, and what is derived

`screenerItems` has seven fields. Five are recomputable from things the viewer
can already read:

| Field | Authored by | Recoverable from |
| --- | --- | --- |
| `userId` | — | the blob's owner |
| `kind`, `targetId` | the fan-out | the container the message is in |
| `preview` | the fan-out | `snippet(m.body)`, `PREVIEW_MAX = 240` (`screener.ts:26-27`) |
| `messageId` | the fan-out | the message that triggered it |
| `createdAt` | the fan-out | that message's `createdAt` |
| **`snoozedUntil`** | **the person** — "Later" | **nothing. Must be stored.** |
| *(row absent)* | **the person** — Dismiss | **nothing. Must be stored.** |

Dismissal is a deletion today (`desk.ts:178`), and later traffic re-creates the
row. That is exactly a watermark: *ignore this conversation up to now*. It is
**not** read state — dismissing does not mark the conversation read, and the
unread dot stays — so it is a second map, not a reuse of NIP-RS.

`deskOpenWork` has four fields and **all of them are authored**: you put a thing
there. `addedAt` exists only to order the list.

### 1.3 The five inputs the screener fold needs

The rules are in `screener.ts:1-20` and `:164-174`. Every input is viewer-side:

| Rule | Input | Where the viewer gets it |
| --- | --- | --- |
| 1 — someone DMs you | the DM stream | **Convex today. The blocker.** See §4. |
| 2 — added to a topic, never opened, new message | membership + read state + traffic | `topicMembers` (layer 3), read state (layer 2 already), the channel |
| 3 — you were `@mentioned` | `mentionsUser(body, myName)` | the message body and my own name |
| refresh — you participated in the thread | prior replies' authors | the thread |
| divert — urgent | `isUrgentBody`, `!@` | the message body |

Not one of them requires knowing anything about another person that the viewer
cannot already see. The current implementation requires exactly that, twice.

---

## 2. ADR 0001 §3's five, one at a time

**Query — no.** SPEC §12.3's "no sorting, no ranges, no aggregation, no joins"
is a real limit and neither table meets it. `screenerList` sorts by `createdAt`
descending over a set it has already collected whole; that is `Array.sort`, not
a range query.

**Index — no.** One index on each, on `['userId']`, which is "give me my rows".
A blob is my rows by construction. An index whose only key is the owner is the
index a blob does not need.

**Aggregation across records — no, and PEE-6 is the case to look at.** PEE-6
de-duplicates the Screener against Open Work at read time. That join is between
**two per-user sets**; in one document it is a `Set` intersection over two
arrays in memory, which is what `desk.ts:145` already does after fetching both
whole. PEE-6 also heals stale rows at read time with no migration — and that
property *survives* the move, because a fold recomputes from scratch every time
and has no stale rows to heal. PEE-6 is a good feature. It is not evidence for a
database.

**Server-side compute — the only serious candidate, and it points the other
way.** Two facts from `screener.ts`:

```
:135   const candidates = await ctx.db.query('users').collect()      // every user
:150-4 await ctx.db.query('readState')
         .withIndex('by_user_container', q => q.eq('userId', user._id)…)   // *their* read state
```

Per message sent, the cost is O(users × their containers); the same again for
every reply (`:191`). The fold's cost is O(my containers), once, for one person,
on their own device. And the `readState` read is a cross-user read of private
state that layer 2 makes impossible by construction.

There is one genuine loss: **compute-on-write amortises**. Today a screener row
is already sitting in a table when the Desk loads. A fold computes it on load.
The hardest input is rule 2 — "a topic you never opened got a message" — which
needs unread across every container you are in. That is precisely FOL-18's
Folder-row unread union, and PER-5 records it as the best-measured merge of that
window: **2 POSTs, 449 ms, 147 Folders, against production, with no Convex at
all.** Cited, not re-measured here.

**Size — measured.** §3.

---

## 3. The bound, and which precedent each blob takes

The binding limit is **65,535 bytes of UTF-8 plaintext** — what
`POST /nip44/encrypt` refuses (`src/nostr/appData.ts:45,99`), which bites long
before the relay's 256 KiB ingest cap. Entries at the cap, on the real field
widths (32-char Convex id, 36-char channel uuid, 64-hex pubkey,
`PREVIEW_MAX = 240`):

| Blob | Shape | Bytes/entry | Entries at 65,535 | At 100 entries |
| --- | --- | --- | --- | --- |
| Open work — topics | `stars` shape, `id` + `channelUuid` | 118 | **554** | 11,856 B (18.1 %) |
| Open work — people | `stars` shape, `key` + `pubkey` | 142 | **461** | 14,256 B (21.8 %) |
| Screener decisions | two `container → unix seconds` maps | 46 | **1,433** | 4,200 B (6.4 %) |
| *(control)* screener rows lifted whole | `preview` + `messageId` + `createdAt` | 388 | **169** | 38,743 B (59.1 %) |

The control is the point: a lift-and-shift of the table is the one shape that is
tight, and the field making it tight — `preview`, 240 of its 388 bytes — is
derived. Publishing derived state is what costs the headroom.

**Open work takes the `stars` precedent: last-write-wins, and refuse over the
cap.** `appData.ts:99` throws rather than truncating, with *"A blob is not a
table (SPEC §12.3)"*. That is right here for the same reason it is right for
stars: the set is curated by hand, so silently evicting an entry would delete
something a person chose, and a refusal is actionable — close something. SPEC
§12.3 requires the convention to say which of accept-the-loss or
per-installation slots it took; open work says **accept**, on `stars.ts`'s own
argument: two tabs adding work in the same second can lose one, and the cost is
one row, recoverable by clicking again.

**Screener decisions take the `readState` precedent: `capContextsToBytes`,
evicting oldest first.** Dismissals are machine-paced and unbounded in
principle — every conversation you ever dismissed — which is the shape SHR-4
shipped that function for. Eviction is safe here in a way it is not for stars:
an evicted dismissal can only cause a stale item to reappear, and only for a
conversation that has had no traffic since (one with traffic would have been
rewritten). Two rules keep it honest:

1. drop expired snoozes at write time — a `snoozedUntil` in the past is dead
   weight, and this alone bounds the snooze map to live "Later"s;
2. cap the dismissal map last, never the snooze map: a snooze is a live future
   instant a person is relying on, a dismissal is history.

---

## 4. The DM portion: what it would additionally need

**Open work needs nothing.** A DM entry in the blob is the partner's person key;
rendering resolves it exactly as `desk.ts:217-221` already does, and exactly as
the shipped stars blob already does for starred people. `stars.ts:34-40` settles
the id objection: at layer 2 only Peek reads the blob, so an app-local id is
legitimate rather than a compromise, and the portable identity travels alongside
when one exists.

**The screener's DM half needs three things, all owned by DMs-on-Nostr:**

1. **A relay identity for a DM conversation.** `dmConversations` has no
   `channelUuid`. `convex/nostr/sync.ts:527-531` states it flatly — *"DMs live
   entirely in Convex today and have no relay representation at all, so there is
   nothing to subscribe to until track C gives them one (DMS-3)"* — and records
   that this was checked rather than assumed.
2. **The DM message stream readable client-side**, because rule 1 ("every DM to
   you screens") is a fold over messages, and there are none to fold.
3. **DM read state that can be published.** `src/nostr/useReadStateSync.ts`
   skips DMs and huddles entirely: a context id must be a protocol identity
   (SPEC §11.1) and a DM has none; SPEC §11.5 standardises no huddle context.
   Rule 1 does not need read state, but dismissal and the PEE-6 de-duplication
   do.

Until those land, the seam is `kind`, which both tables already carry as
`containerKind`: the blob holds `kind: 'topic'` entries and Convex keeps
`kind: 'dm'` rows, with `screenerList` merging two sources. That is the same
two-list shape the stars blob already has (`topics` and `people`).

**Huddles need nothing extra.** `screenTarget` (`screener.ts:67-76`) maps a
huddle onto its parent topic, so huddles never produce their own rows;
`huddleMembers` is read for gating and stays layer 3 with the rest of membership.

---

## 5. What else moves, and what it costs

**`watchableChannels` (`nostr/sync.ts:534`)** derives the relay subscription set
server-side from all three tables. At layer 2 the client holds the blob and
computes the same priority order itself — and the client is what opens the
subscriptions anyway. `WATCHABLE_LIMIT = 32` is unaffected. Worth noting that
this query is itself evidence for the recommendation: the app already declares
that *"a workspace can grow topics indefinitely while a Desk cannot grow
attention"*, which is the sentence that bounds the blob.

**`clearScreenerFor` (`readState.ts:59-67`)** — opening a conversation retires
its screener item — becomes free. Under the fold an item exists only while rule
2's `seen === null` holds, so reading it removes it with no write at all.

**The topic-delete sweep (`topics.ts:207-210`)** is a cross-user write, which
layer 2 forbids: nobody can write my blob but me. It is not needed.
`desk.ts:151-152` and `:207-208` already drop a row whose target no longer
resolves (`if (!topic) continue`) — the same read-time healing PEE-6 relies on.
The sweep is housekeeping, not correctness, and a fold never sees the row at all.

**The real cost, stated once:** a screener row currently arrives by Convex
subscription, live. A fold recomputes on load and on relay traffic. §2 gives the
measurement that makes this affordable; what it does not give is a measurement
of *Peek's* fold specifically, and that should be taken before the migration
rather than after.

---

## 6. The query that decides it

Four of the five are settled by reading the code above. **Size** is the only leg
that needs the deployment. This is written, and typechecks with `npx tsc -b` on
`peek-app` branch `shr-7-spike`, at `convex/dev/shr7BlobBound.ts`. It is **not
merged** — a spike ships no code.

It decides **layer 2** if `worst.openWorkBytes` and `worst.decisionsBytes` are a
small fraction of 65,535, and decides against it — or forces the eviction rule of
§3 — if either approaches it. `rowsBytes` is the control from the §3 table: the
same state lifted whole, which is the shape that does not fit.

```ts
import { query } from '../_generated/server'

/** `POST /nip44/encrypt` refuses a plaintext over this many bytes (SPEC §12.5). */
const MAX_PLAINTEXT_BYTES = 65535
const bytes = (value: unknown) => new TextEncoder().encode(JSON.stringify(value)).length

export const report = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect()
    const now = Date.now()
    interface Row {
      user: string
      screenerRows: number
      openWorkRows: number
      openWorkBytes: number
      decisionsBytes: number
      rowsBytes: number
    }
    const per: Row[] = []

    for (const user of users) {
      const screener = await ctx.db
        .query('screenerItems')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect()
      const openWork = await ctx.db
        .query('deskOpenWork')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect()

      // A — open work, on the shape `src/nostr/stars.ts` already publishes.
      const topicIds = openWork.filter((w) => w.kind === 'topic').map((w) => w.targetId)
      const channelUuid = new Map<string, string>()
      for (const id of topicIds) {
        const normalized = ctx.db.normalizeId('topics', id)
        const topic = normalized ? await ctx.db.get(normalized) : null
        if (topic?.channelUuid) channelUuid.set(id, topic.channelUuid)
      }
      const openWorkBlob = {
        v: 1,
        updatedAt: now,
        topics: topicIds.map((id) => ({
          id,
          ...(channelUuid.has(id) ? { channelUuid: channelUuid.get(id)! } : {}),
        })),
        people: openWork.filter((w) => w.kind === 'dm').map((w) => ({ key: w.targetId })),
      }

      // B — the screener's *decisions* only; the rows themselves are a fold.
      const decisionsBlob = {
        v: 1,
        updatedAt: now,
        snoozed: Object.fromEntries(
          screener
            .filter((s) => s.snoozedUntil !== undefined)
            .map((s) => [s.targetId, Math.floor(s.snoozedUntil! / 1000)]),
        ),
        dismissed: {} as Record<string, number>,
      }

      // Control — the same state lifted whole, preview included.
      const rowsBlob = {
        v: 1,
        updatedAt: now,
        items: screener.map((s) => ({
          kind: s.kind,
          targetId: s.targetId,
          preview: s.preview,
          messageId: s.messageId ?? null,
          createdAt: s.createdAt,
        })),
      }

      per.push({
        user: user.name,
        screenerRows: screener.length,
        openWorkRows: openWork.length,
        openWorkBytes: bytes(openWorkBlob),
        decisionsBytes: bytes(decisionsBlob),
        rowsBytes: bytes(rowsBlob),
      })
    }

    const max = (pick: (r: Row) => number) => per.reduce((acc, r) => Math.max(acc, pick(r)), 0)
    return {
      cap: MAX_PLAINTEXT_BYTES,
      users: per.length,
      worst: {
        screenerRows: max((r) => r.screenerRows),
        openWorkRows: max((r) => r.openWorkRows),
        openWorkBytes: max((r) => r.openWorkBytes),
        decisionsBytes: max((r) => r.decisionsBytes),
        rowsBytes: max((r) => r.rowsBytes),
      },
      per: per.sort((a, b) => b.rowsBytes - a.rowsBytes),
    }
  },
})
```

Run it against the deployment Peek actually uses — **not `--prod`**, which
resolves elsewhere (`peek-app/CLAUDE.md`):

```
npx convex run dev/shr7BlobBound:report \
  --url https://honorable-guineapig-592.eu-west-1.convex.cloud \
  --admin-key '<deploy key>'
```

**It has not been run.** The deployment answers (`/version` → 200) but this
session has no deploy key, and the function is not deployed, so neither the
dashboard nor an anonymous call reaches it. The §3 table is the analytic bound
in the meantime, computed on the real field widths; it does not depend on the
row counts, and the row counts are what this query adds.

---

## 7. Two corrections, so they are not re-argued from memory

1. **The `by_topic` index cited for these tables does not exist.** SHR-7's own
   description and PER-5 §3 both say PEE-6's de-duplication works "through
   `by_user`/`by_topic` indexes". `by_topic` is on `topicMembers`
   (`schema.ts:165`) and is used for recipient fan-out at `screener.ts:55`.
   Neither `screenerItems` nor `deskOpenWork` has ever had a second index.

2. **PER-5 §1 classifies both tables as "3 — legitimate: queues and
   aggregation", and §6.3 says "real aggregation with no relay answer today.
   Keep."** This spike is what PER-5 §7 stage 2 asked for — *"assess whether the
   screener's aggregation genuinely needs an index or whether it is a fold over
   a blob the person owns"* — and the answer changes that row. `huddles`,
   `huddleMembers` and `topicRenames`, classified the same way, are **not**
   examined here and that classification stands for them.

---

## 8. Related

- ADR 0001 §3 — the three-layer rule and the five
- PER-5 — `decisions/PER-5-convex-research.md`, §1, §3, §6.3, §7 stage 2
- SHR-4 — `capContextsToBytes`, the byte cap this reuses (peek#232)
- SHR-6 — the same question for `stars`; its blob is already shipped, so what
  remains there is removing the Convex copy, not designing one
- DMS-3 — the DM relay identity §4 waits on
- PEE-6 — the de-duplication §2 re-reads
