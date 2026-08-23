# Roadmap — five projects, sequenced

**Working reference. Living document.** The tickets in Estiva Ship are the source of truth for detail; this is the map between them — what depends on what, what can run in parallel, and what is still undecided.

Last updated 2026-08-22. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

---

## State

**48 tickets across five projects.** Nothing started.

| Project | Tickets | What it is |
| --- | --- | --- |
| Peek: Real-time Ship→Peek updates | PEE-1…11 | Peek reads the relay once per mount and never again. Make it live, and make stale state explain itself. |
| Cross-app read state | CRO-1…11 | Read/unread becomes a property of the person, not the app. Read it in Ship, it is read in Peek. |
| DMs on Nostr (DM channels) | DMS-1…11 | Move Peek's DMs off Convex and onto the relay. |
| Shared foundation packages | SHA-1…6 | Four packages plus a scaffold, so app four is cheap. |
| Rewrite Ship with shared foundation | REW-1…9 | Ship on React/Vite/Tailwind, and the second consumer that makes the packages extractable. |

The architectural decisions underneath are recorded in
[`decisions/0001-relay-canonical-by-default.md`](decisions/0001-relay-canonical-by-default.md).
Read that first if you are picking this up cold.

---

## Two gates, and everything else is parallel

### Gate 1 — one Estiva ID release unblocks three projects

Four tickets in three projects are all Estiva ID changes needing the same manual re-seed. **Batch them into one deploy.** Done separately it is three trips to the box and three chances to forget that `update.sh` runs `migrate` and never `seed`.

| ticket | change |
| --- | --- |
| CRO-1 | `POST /nip44/encrypt` and `/nip44/decrypt`, scoped to **self-encryption only** |
| CRO-2 | `peek` and `estiva-ship` += `30078` |
| PEE-4 | `peek` += `22242`, scoped by `relay` tag |
| DMS-1 | `peek` += `41010`, `41011`, `41012` — and **not** `30622`, which is relay-signed |

Order on the box: **deploy → confirm the image pulled → re-seed → verify the row.** See `operations/PRODUCTION.md` for the box itself.

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds from app_credentials"
```

Verify the row, never the `seeded N app credential(s)` log line.

**Run that query before editing `seed.ts`** — the live values were never read during planning (the check was blocked), so production may already differ from the file.

### Gate 2 — SHA-1 unblocks the packages

Where the foundation packages live and how they publish. Contains decisions that are not an implementer's to make: repo layout, public npm versus GitHub Packages, and who owns a breaking change. SHA-1 asks for a throwaway package published and upgraded in two apps before it closes, because the failure mode is a build that cannot resolve a dependency in CI rather than locally.

---

## Start now — seven tickets, no gate

| ticket | note |
| --- | --- |
| **PEE-1, PEE-2, PEE-3** | Client-side refetch on focus/visibility plus a ~30s interval, and a profile-cache TTL. Turns "until remount" into "within 30 seconds" and probably clears most reported symptoms. **PEEK-109 is in milestone M6, target 2026-08-27 — these go first.** |
| **CRO-3** | The read-context convention: `h:<folder-uuid>` / `thread:<root>` / `msg:<id>`. A document. Every later read-state ticket cites it. |
| **CRO-11** | The app-private storage convention (`kind:30078`). A document. |
| **SHA-1** | Gate 2. |
| **REW-1** | Can begin the scaffold immediately; needs SHA-1 before it consumes packages. |

Meanwhile, prepare the Gate 1 release.

---

## The five tracks

```
Gate 1 (Estiva ID) ──┬─> A. Peek real-time   PEE-5 → 6 → 7 → 8 → 9,10 → 11
                     ├─> B. Read state       CRO-4 → 5 → 6 → 7 → 9
                     └─> C. DMs              DMS-2 → 3,4 → 5,6 → 7 → 9,10,11

Gate 2 (SHA-1) ──────┬─> D. Foundation       SHA-2, SHA-3, SHA-6
                     └─> E. Ship rewrite     REW-2 → 3,4,5 → 6,7 → 8 → 9
                                             (SHA-4 lands in REW-2, SHA-5 in REW-3)
```

A, B, C, D and E touch different code and share no gate beyond the two above. They can run concurrently with different people.

### The programme splits cleanly in two

Useful if two people are working: after the gates, there are two long chains that barely touch.

- **The Peek half** — tracks A, B, C. All in `peek-app` plus documents. Ends at CRO-10, the measurement that decides Convex's role.
- **The foundation half** — tracks D and E. All in `estiva-ship`, the new package repo, and `estiva-docs`. Ends at REW-9.

The only real contact between the halves is CRO-8 (Ship publishes read state), which belongs inside the Ship rewrite.

### Cross-track dependencies — six, all of them

| dependency | note |
| --- | --- |
| SHA-4 → REW-2 | `@estiva/identity` is extracted *during* the auth ticket. Ship is the second consumer that stops it coming out Peek-shaped. |
| SHA-5 → REW-3 | Same for `@estiva/ui`. Tokens land in REW-1, primitives in REW-3. |
| CRO-8 → REW M3/M4 | CRO-8 says so itself: if the rewrite is underway it belongs there rather than being written twice in the old app. |
| DMS-8 → CRO-3 | DM read state uses the context convention. Do DMS-8 last in track C. |
| CRO-10 → PEE-8, CRO-5, CRO-11 | The spike needs live relay data in the browser *and* read state on the protocol. |
| SHA-3 ↔ REW | SHA-3 deletes Ship's hand-written `lib/nostr/`, which REW-1 says not to move. Not a conflict — SHA-3 owns that deletion, including what `estiva-agent` does — but whoever hits it first should not resolve it alone. |

### Two critical paths

1. `Gate 1 → PEE-5 → 6 → 7 → 8 → CRO-10`
2. `Gate 2 → SHA-4 → REW-2 → REW-3,4,5 → REW-6,7 → REW-8 → REW-9`

The second is longer in wall-clock terms and has the most sequential UI work. The Ship rewrite is the programme's long pole, not the Peek work.

### Ordering constraints worth knowing

- **CRO-6 before CRO-7.** NIP-RS's fetch horizon defaults to 7 days and absence of a context means "unread", so a topic read three weeks ago reads as unread. Cutting over before the cache exists regresses unread for every quiet container — which would look exactly like the bugs track A is fixing.
- **DMS-2 before any DM code.** It verifies the assumption track C's independence rests on: that `kind:41010` is accepted over the HTTP bridge. If it is not, track C needs the WebSocket path from track A and changes shape.
- **PEE-5 and PEE-6 build in `peek-app`, not the package.** They currently say "shared package". Gate 2 has not happened when PEE-5 is due, and PEE-5 is on the M6 deadline — build locally, move it into `@estiva/protocol` as part of SHA-3.
- **REW-6 is a release blocker, not a detail.** Ship polls every 5 s and refreshes on `visibilitychange`; Peek does neither. Adopting Peek's conventions naively moves Peek's staleness into Ship, and no test would catch it.

---

## Open items

### Not filed

1. **Huddles.** Deliberately parked — the concept is still an experiment. The findings are worth keeping: Buzz's "huddle" is a live audio room (Opus frames, ephemeral Redis-only channel, kinds 48100–48103 are call lifecycle) while Peek's is a persistent membership-scoped sub-conversation with stored messages and a `resolved` lifecycle. The right mapping is an ordinary private Buzz **channel** — `channel_type` is an unvalidated free string, and `ChannelRecord` already has `ttl_deadline`, `topic`, `purpose` and `canvas`. The one missing primitive is an **anchor**: channels are flat, so "this private space is about that issue/topic/document" has nowhere to live. Precedent exists in `huddle_started_content_links`. Two things to decide before any code: the **name collision** with Buzz's own huddle kinds, and **DM promotion**, which crosses an encryption boundary rather than re-parenting.
2. **The Convex working rule**, as a line in `peek-app/CLAUDE.md` beside the existing data-access-seam rule — which has actually held, unlike most documented intentions:
   > Convex may never be the source of truth for something the relay owns, and never the only home for something a person would reasonably expect to own.

### Documents

**Fixed 2026-08-22:**

- `README.md` no longer claims the apps share *"no shared package"*. It now states the distinction that matters: shared libraries for **speaking** the protocol, never for **interpreting** it.
- The relay-git decision for documents moved here from Peek's repo — [`protocol/FILES_ARCHITECTURE.md`](protocol/FILES_ARCHITECTURE.md) and [`protocol/nips/NIP-FC.md`](protocol/nips/NIP-FC.md). Pointer stubs remain at the old paths so existing links resolve. **This is the document to hand whoever starts Leaf.**

**Still wrong:**

- `README.md` lists Ship as "TypeScript, plain DOM", which the rewrite makes false. REW-9 flags it, and it stays true until the cutover — so fix it then, not now.

### Decisions that are not an implementer's to make

| decision | ticket |
| --- | --- |
| Package repo layout; public npm vs GitHub Packages; who owns a breaking change | SHA-1 |
| What the product says about DM privacy — "private" is accurate for membership-scoped; whether to say more is product and possibly legal | DMS-11 |
| What happens to existing Convex-only DMs. The relay's ±15 minute drift window means republished history cannot carry original timestamps, so migration is not free | DMS-7 |
| Whether `claude-agent` gets `kind:30078` — decide rather than omit | CRO-2 |
| In-place versus parallel app directory for the rewrite | REW-1 |

---

## Verified against live systems

Worth knowing which claims in the tickets are observations rather than inferences.

**Verified:** the WebSocket handshake and AUTH challenge at `wss://estiva.estiva.app` (with `curl --http1.1` — over HTTP/2 the same request returns NIP-11 JSON, because `Connection`/`Upgrade` are not h2 headers); NIP-11 capabilities including NIP-42, `auth_required`, `max_subscriptions: 1024`; relay git hosting responding `401` on `/git/{owner}/{repo}/info/refs`; `#h` filters matching reactions and deletions through the `channel_id` fallback; `claude-agent` can sign `30850`/`30851`/`1851` but is refused `9007`; every kind these projects need already present in the relay's `ALL_KINDS`, so **no Buzz change and no relay deploy is required by any of this work**; gift wrap rejected over the HTTP bridge; and `computeEventId`, `threadTags`, `toNostrSeconds`, `canonicalChannelName`, `normalizeUrl` byte-identical between `peek-app` and `estiva-ship`.

**Not verified:** the live `allowed_kinds` rows; end-to-end `kind:22242` signing (needs a live user token); whether `kind:41010` is accepted over HTTP (DMS-2 exists for exactly this); whether `nostr-tools` covers enough to replace part of `@estiva/protocol` (SHA-3 allocates an hour).

---

## Appendix — all 48 tickets

**Peek: Real-time Ship→Peek updates** — PEE-1 topic refetch · PEE-2 project panel re-resolve · PEE-3 profile cache TTL · PEE-4 grant 22242 · PEE-5 WS client + NIP-42 · PEE-6 per-channel subscriptions · PEE-7 route events into the projection · PEE-8 wire useTopicView · PEE-9 connection state · PEE-10 surface read failures · PEE-11 subscribe outside topics

**Cross-app read state** — CRO-1 NIP-44 in Estiva ID · CRO-2 grant 30078 · CRO-3 read-context convention · CRO-4 publish blob · CRO-5 fetch and merge · CRO-6 horizon cache · CRO-7 dual-run and cut over · CRO-8 Ship publishes · CRO-9 prove cross-app · CRO-10 Convex read-path spike · CRO-11 app-private storage convention

**DMs on Nostr (DM channels)** — DMS-1 grant 41010/41011/41012 · DMS-2 probe · DMS-3 open channel · DMS-4 publish messages · DMS-5 project channels · DMS-6 hidden set · DMS-7 existing DMs · DMS-8 DM read state · DMS-9 immutable participants · DMS-10 participant cap · DMS-11 privacy copy

**Shared foundation packages** — SHA-1 registry decision · SHA-2 PWA package · SHA-3 `@estiva/protocol` · SHA-4 `@estiva/identity` · SHA-5 `@estiva/ui` · SHA-6 scaffold with no backend

**Rewrite Ship with shared foundation** — REW-1 shape and scaffold · REW-2 auth via `@estiva/identity` · REW-3 projects views · REW-4 issue views · REW-5 writes · REW-6 keep the poll · REW-7 parity checklist · REW-8 cut over · REW-9 remove the old app
