# Roadmap — six projects, sequenced

**Working reference. Living document.** The tickets in Estiva Ship are the source of truth for detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-08-24. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

---

## How this document is meant to be used

Three rules, and they are why this roadmap looks the way it does:

1. **Aim for high-level architectural clarity.** Know the shape before building the parts. [ADR 0001](decisions/0001-relay-canonical-by-default.md) and [RFC 0.3](protocol/RFC-0.3-FOLDERS.md) exist for that.

2. **Do not force a decision that does not need making yet.** Where something is risky or genuinely unclear, name it, name the *latest responsible moment* to decide, and move on. A deferred decision with a trigger is a plan. A guessed decision is debt with interest.

3. **Learn as you go, and fold what you learn back into the architecture.** This is not optional tidying — it is where the architecture comes from. Every substantial finding in this programme came from having built the previous piece, not from planning harder:

   | built | taught us |
   | --- | --- |
   | Peek's relay interop | there is no polling at all, and the projection is where the bugs live |
   | Ship's agent CLI | two copies of one fold drift silently (PEEK-165) |
   | Ship's tracker | change events solve multi-writer, which upstream calls a non-goal |
   | reading Buzz upstream | Projects ≈ Folders, and NIP-22 already does cross-app comments |

   So: no waterfall. Each project is expected to change this document, and the *first* thing to do when one finishes is say what it taught.

**What this means in practice for anything unfiled:** if a piece of work needs a decision we have deliberately deferred, it does not get tickets yet. Filing implementation tickets against an undecided design produces a backlog that looks like progress and is not.

## State

**58 tickets across six projects.** Nothing started.

| Project | Tickets | What it is |
| --- | --- | --- |
| Peek: Real-time Ship→Peek updates | PEE-1…11 | Peek reads the relay once per mount and never again. Make it live, and make stale state explain itself. |
| Cross-app read state | CRO-1…11 | Read/unread becomes a property of the person, not the app. Read it in Ship, it is read in Peek. |
| DMs on Nostr (DM channels) | DMS-1…11 | Move Peek's DMs off Convex and onto the relay. |
| Shared foundation packages | SHA-1…6 | Four packages plus a scaffold, so app four is cheap. |
| Rewrite Ship with shared foundation | REW-1…11 | Ship on React/Vite/Tailwind, and the second consumer that makes the packages extractable. |
| Catch up the Buzz fork | CAT-1…8 | 625 commits behind upstream. The survey is cheap; the deploy is not. |

Two architecture documents sit under all of it. Read both if you are picking this up cold:

| document | what it settles |
| --- | --- |
| [ADR 0001](decisions/0001-relay-canonical-by-default.md) | **accepted** — relay-canonical by default; a database is a per-feature exception; Estiva ID excluded |
| [RFC 0.3](protocol/RFC-0.3-FOLDERS.md) | **draft** — Folders, Files, Components, Conversations. Resolves the huddle model. Two decisions inside it are deliberately deferred |

RFC 0.3 is a *draft*, and per rule 2 above nothing is filed against its undecided parts. What it changes about already-filed work is in §"RFC 0.3 implications" below.

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

## Start now — ten tickets, no gate

| ticket | note |
| --- | --- |
| **PEE-1, PEE-2, PEE-3** | Client-side refetch on focus/visibility plus a ~30s interval, and a profile-cache TTL. Turns "until remount" into "within 30 seconds" and probably clears most reported symptoms. **PEEK-109 is in milestone M6, target 2026-08-27 — these go first.** |
| **CRO-3** | The read-context convention: `h:<folder-uuid>` / `thread:<root>` / `msg:<id>`. A document. Every later read-state ticket cites it. |
| **CRO-11** | The app-private storage convention (`kind:30078`). A document. |
| **SHA-1** | Gate 2. |
| **REW-1** | Can begin the scaffold immediately; needs SHA-1 before it consumes packages. |
| **REW-11** | **Pulled forward out of the rewrite.** Its changes live in `src/events.ts`, `src/store.ts` and `src/fold.ts` — the shared code REW-1 explicitly says not to move — so it needs no React and can be done in the current vanilla-DOM app. It fixes a live defect *and* rehearses the folder decision. See §"Finishing the Folder decision". |
| **CAT-1, CAT-2, CAT-3** | The catch-up survey. Read-only, nothing merged, nothing deployed. CAT-3 answers whether an upstream deploy would break production data, which is the gate for the rest of that project. |

Meanwhile, prepare the Gate 1 release.

---

## The six tracks

```
Gate 1 (Estiva ID) ──┬─> A. Peek real-time   PEE-5 → 6 → 7 → 8 → 9,10 → 11
                     ├─> B. Read state       CRO-4 → 5 → 6 → 7 → 9
                     └─> C. DMs              DMS-2 → 3,4 → 5,6 → 7 → 9,10,11

Gate 2 (SHA-1) ──────┬─> D. Foundation       SHA-2, SHA-3, SHA-6
                     └─> E. Ship rewrite     REW-2 → 3,4,5 → 6,7 → 8 → 9
                                             (SHA-4 lands in REW-2, SHA-5 in REW-3)

no gate ─────────────┬─> F. Buzz catch-up    CAT-1,2,3 → CAT-4 → 5 → 6 → 7 → 8
                     └─> REW-10, REW-11      independent of the rewrite (see Start now)
```

A through F touch different code and share no gate beyond the two above. They can run concurrently with different people.

**Track F is deliberately two-speed.** CAT-1/2/3 are read-only and should happen soon. CAT-4 onward waits for a reason — deploying 625 commits of relay change against the database Peek and Ship both depend on is not something to do because the number is annoying. CAT-3's answer is what makes that trigger legible.

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

## RFC 0.3 implications for filed work

Small, and deliberately so — per rule 2, the RFC's undecided parts produced no tickets.

| ticket | effect | status |
| --- | --- | --- |
| **CRO-3** | conversation read state stays keyed on the channel, so the convention holds as written. Add one line reserving a *folder*-level context (`folder:<address>`) — NIP-RS blobs are grow-only, so a bad context id is effectively permanent | commented on the issue |
| **PEE-6** | no change. One REQ per channel is still right. But build the manager keyed on **channel uuid**, never on a topic id, because later there are fewer channels each carrying several files' threads | commented on the issue |
| **REW-10** *(new)* | comments become NIP-22 `kind:1111` instead of `kind:9`+`about`. Upstream plans the same kind, and our relay already accepts it — no gate | filed |
| **REW-11** *(new)* | Ship's project record goes global with `buzz-channel`. **Fixes a live defect** — 13 of 65 production issues are unreachable because discovery runs through access-gated records | filed |
| **CRO-11** | reinforced, not changed. RFC 0.3 §4.6 uses the app-private convention for folder follow-lists | none needed |
| **DMS-\*** | unaffected. DM channels are orthogonal to folders | none needed |
| **SHA-\*** | unaffected now. `@estiva/protocol` would carry folder kinds eventually, but not before they exist | none needed |

Both new REW tickets are independently valuable and depend on nothing deferred. REW-11 in particular is worth doing for the bug alone.

## Finishing the Folder decision

The folder decision unblocks the most: folder implementation, Peek's `topic = channel` → `topic = file` migration, and the upstream NIP proposal all wait on it. It has two halves and they land in different places.

### The cheap half — do it now

Two verification questions gate whether the design is even valid. Both are relay probes, about an hour of work, blocked by nothing:

| question | why it matters |
| --- | --- |
| **RFC 0.3 §12.3** — does the relay's key rotate? | Topics are addressed as `39000:<relay-pubkey>:<channel-uuid>`. NIP-11 advertises `keys: [{ current: true, id: "relay-v1", … }]`, and a `current` flag with a versioned id implies rotation is designed for. **If it rotates, every folder's topic reference breaks** — and the "one tag type lists every file" property the model rests on goes with it. |
| **RFC 0.3 §5.2** — is `39000`'s `d` exactly the channel uuid, and can a non-member read a *listed* channel's `39000`? | If not, listed folders cannot show their topics to non-members. |

If §12.3 comes back badly the RFC needs rework **before** anyone reasons further about it. That is a cheap way to de-risk a large decision, and it is the kind of thing that is much more expensive to discover after implementation starts.

### The decision itself — end of the Ship rewrite, and REW-11 is the rehearsal

**REW-11 makes Ship's project record global with a `buzz-channel` tag. That is structurally the same move as making a folder global with a channel reference.** Building it answers, empirically rather than on paper:

- does global discovery actually fix the unreachable-record problem (13 of 65 issues today)?
- what breaks when a record's name becomes world-readable?
- how does a fold cope with two shapes coexisting, given republishing is barred by the ±15 minute drift window?
- how much work is it, really?

That is rule 3 applied: build the small version, then decide the big one. It costs nothing extra — REW-11 was already filed to fix the bug.

**So REW-11 is pulled forward** (see Start now). It needs no React and lives entirely in code the rewrite does not touch, so it can be done today in the current app. Doing so moves the folder decision months earlier than the second critical path would otherwise allow.

**REW-10 is in the same position** — `kind:1111` comments also change only `src/`. It is not a rehearsal for anything, so there is less reason to hurry it, but nothing stops it either.

### What the decision then consists of

1. Accept or amend RFC 0.3, with the §12.3 and §5.2 answers in hand and REW-11's experience behind it.
2. Decide RFC 0.3 §10.1 — upstream proposal or private fork implementation. Its own stated trigger is the first line of folder command/state code, so this is the same moment.
3. Only then does folder implementation get tickets.

## Open items

### Not filed, and why

Per rule 2, these are held deliberately rather than forgotten.

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **Folder implementation** (RFC 0.3 §4) | the RFC is a draft, kind numbers are deliberately unassigned, and the upstream-versus-fork decision is deferred | RFC 0.3 accepted + §10.1 decided |
| **The upstream NIP proposal** (RFC 0.3 §10.1/10.2) | deferred on purpose — hard to reason about now, easier after Ship's rewrite and after we see whether upstream ships their forge layer | reaching the first line of folder command/state code, which is the latest responsible moment |
| **Peek's `topic = channel` → `topic = file` migration** (RFC 0.3 §11.1) | depends on folders existing. Plausibly larger than the Ship rewrite | folders shipped; sequence after the Ship rewrite has proven the shared foundation |
| **Component anchoring** (RFC 0.3 §6) | the least settled part of the RFC — needs a real editor to choose against | Leaf existing enough to test one option |
| ~~Buzz upstream catch-up~~ | **now filed** as CAT-1…8. Two-speed: the survey is read-only and should happen soon; the merge and deploy wait for CAT-3's answer | — |

Two items that *were* here are now filed: the Ship rewrite (REW-1…11) and the Buzz catch-up (CAT-1…8). The folder decision has its own section above rather than a row here, because it is the one that unblocks the most.

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

## Appendix — all 58 tickets

**Peek: Real-time Ship→Peek updates** — PEE-1 topic refetch · PEE-2 project panel re-resolve · PEE-3 profile cache TTL · PEE-4 grant 22242 · PEE-5 WS client + NIP-42 · PEE-6 per-channel subscriptions · PEE-7 route events into the projection · PEE-8 wire useTopicView · PEE-9 connection state · PEE-10 surface read failures · PEE-11 subscribe outside topics

**Cross-app read state** — CRO-1 NIP-44 in Estiva ID · CRO-2 grant 30078 · CRO-3 read-context convention · CRO-4 publish blob · CRO-5 fetch and merge · CRO-6 horizon cache · CRO-7 dual-run and cut over · CRO-8 Ship publishes · CRO-9 prove cross-app · CRO-10 Convex read-path spike · CRO-11 app-private storage convention

**DMs on Nostr (DM channels)** — DMS-1 grant 41010/41011/41012 · DMS-2 probe · DMS-3 open channel · DMS-4 publish messages · DMS-5 project channels · DMS-6 hidden set · DMS-7 existing DMs · DMS-8 DM read state · DMS-9 immutable participants · DMS-10 participant cap · DMS-11 privacy copy

**Shared foundation packages** — SHA-1 registry decision · SHA-2 PWA package · SHA-3 `@estiva/protocol` · SHA-4 `@estiva/identity` · SHA-5 `@estiva/ui` · SHA-6 scaffold with no backend

**Rewrite Ship with shared foundation** — REW-1 shape and scaffold · REW-2 auth via `@estiva/identity` · REW-3 projects views · REW-4 issue views · REW-5 writes · REW-6 keep the poll · REW-7 parity checklist · REW-8 cut over · REW-9 remove the old app · REW-10 NIP-22 comments · REW-11 global project record

**Catch up the Buzz fork** — CAT-1 survey the gap · CAT-2 collisions and conflict surface · CAT-3 migration audit · CAT-4 merge into `nfb-demo-kinds` · CAT-5 probe the kinds · CAT-6 rehearse migrations on a throwaway · CAT-7 deploy and verify by image id · CAT-8 exercise Peek, Ship and the agent
