# Roadmap — six projects, sequenced

**Working reference. Living document.** The tickets in Estiva Ship are the source of truth for detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-08-25. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

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
   | Gate 1's signing ceiling | a capability grant has **two halves**, and the row shows one of them |
   | PEE-5's socket | read the relay's source, not the NIP — three of its behaviours present as a healthy socket that delivers nothing |
   | M3's four tickets | the ticket's kind list was the thing most often wrong, and only live traffic showed it |
   | PEE-9's indicator | a status signal must **earn its way onto the screen by persisting** — four rounds of "it flickers" before it was quiet |

   So: no waterfall. Each project is expected to change this document, and the *first* thing to do when one finishes is say what it taught.

**What this means in practice for anything unfiled:** if a piece of work needs a decision we have deliberately deferred, it does not get tickets yet. Filing implementation tickets against an undecided design produces a backlog that looks like progress and is not.

## State

**Updated 2026-08-26.** Twenty-one tickets are done. **Gate 1 is closed and track A is finished** — Peek updates from the relay in real time, in production, on every surface that has a channel to watch, with a polling fallback for when it cannot.

| shipped | what it proved |
| --- | --- |
| **REW-11** | Ship's project record is global — served by an unscoped `kinds` query, *not* by an `#h` query for its own channel, while its issues still are. §4.2's central claim now has a working instance at one-tenth the scale |
| **CAT-9** | The relay accepts a global `kind:30850`. One line in Buzz, deployed and probed |
| **SHI-7** | Issue coverage **13 unreachable → 0**, 97 of 97 |
| **REW-10** | Comments are NIP-22 `kind:1111`, end to end: signing ceiling, relay, Ship's fold, both Peek surfaces, and the published manifest |
| **PEE-9 / PEE-10** | Peek reads both comment kinds, and a manifest can declare the kinds it *used* to emit (`emits.alsoRead`) |
| **SHI-8 / SHI-9** | The manifest verifier works again, cleans up after itself, and the projection reaches records written under either tag spelling |
| **CRO-1** | Estiva ID can encrypt and decrypt NIP-44 **to yourself**, verified on production. All 108 reference vectors run in CI, ten of them pinning our ciphertext byte-for-byte against the spec's |
| **PEE-4** | Peek may sign `kind:22242`, **bounded to one relay**. The last thing between M3 and being testable |
| **PEE-5** | A live relay socket that authenticates with NIP-42 and restores its subscriptions across reconnects. Proven end to end against production — challenge, accepted `22242`, then events instead of `auth-required` |
| **PEE-6** | One REQ per channel, refcounted. Two channels confirmed receiving simultaneously on production while a multi-`#h` control received nothing |
| **PEE-7** | Live events routed into the existing Convex projection — messages, reactions, deletions and assertions, batched per burst |
| **PEE-8** | `useTopicView` subscribes to its channel. **Proven on production**: a `kind:9` signed by the agent and POSTed straight to the relay appeared in an open Peek topic within a second, with no reload and nothing touching Peek's Convex |
| **PEE-9** | One connection state, surfaced once. Took four rounds of production feedback to stop crying wolf — see below |
| **PEE-10** | An empty Folder and one we could not read are now different things on screen |
| **PEE-11** | The Desk and inbox hold their own subscriptions. **Proven on production**: a topic went unread while a different one was open, no reload |
| **PEE-1 / 2 / 3** | The fallback: refresh on focus, visibility and a 30s timer, never in a hidden tab, and a profile cache that expires. The topic timer stands down while the socket is live |

Also done and not on any ticket: Estiva ID's live `allowed_kinds` were read against `seed.ts` for the first time and **matched exactly** — a caveat CRO-2, PEE-4 and this document had all been carrying.

The remaining ~35 are unstarted. **All four Gate 1 tickets are done**, CRO-2 and DMS-1 included — their browser-session clause was met on 2026-08-25 rather than waived.

| Project | Tickets | What it is |
| --- | --- | --- |
| Peek: Real-time Ship→Peek updates | PEE-1…11 | Peek reads the relay once per mount and never again. Make it live, and make stale state explain itself. |
| Cross-app read state | CRO-1…11 | Read/unread becomes a property of the person, not the app. Read it in Ship, it is read in Peek. |
| DMs on Nostr (DM channels) | DMS-1…11 | Move Peek's DMs off Convex and onto the relay. |
| Shared foundation packages | SHA-1…6 | Four packages plus a scaffold, so app four is cheap. |
| Rewrite Ship with shared foundation | REW-1…11 | Ship on React/Vite/Tailwind, and the second consumer that makes the packages extractable. |
| Catch up the Buzz fork | CAT-1…9 | 625 commits behind upstream. The survey is cheap; the deploy is not. CAT-9 is done, and it added a *ninth* fork commit which is a **deletion** — the kind a merge silently undoes |
| Agent / Steer | AGE-1…2 | *(new)* The CLI, MCP server and Claude Code plugin. Filed separately because a defect there is invisible to `ship.estiva.app` and the agent has constraints the apps do not |

Two architecture documents sit under all of it. Read both if you are picking this up cold:

| document | what it settles |
| --- | --- |
| [ADR 0001](decisions/0001-relay-canonical-by-default.md) | **accepted** — relay-canonical by default; a database is a per-feature exception; Estiva ID excluded |
| [RFC 0.3](protocol/RFC-0.3-FOLDERS.md) | **draft, and now decidable** — both questions that could have invalidated it are answered (§5.2, §5.3), and REW-11 rehearsed §4.2 at one-tenth the scale. §10.1 (upstream versus fork) can still legitimately wait |

RFC 0.3 is a *draft*, and per rule 2 above nothing is filed against its undecided parts. What it changes about already-filed work is in §"RFC 0.3 implications" below.

---

## Two gates, and everything else is parallel

### Gate 1 — closed, 2026-08-25

Four tickets in three projects, all Estiva ID changes, all now live in production. **Nothing is waiting on this any more:** the M3 socket work, the read-state client and the DM migration are each unblocked.

| ticket | change | state |
| --- | --- | --- |
| CRO-2 | `peek` and `estiva-ship` += `30078` | **done** |
| DMS-1 | `peek` += `41010/41011/41012` — and **not** `30622`, which is relay-signed | **done** |
| PEE-4 | `peek` += `22242`, **scoped by `relay` tag** | **done** — grant and scope shipped together |
| CRO-1 | `POST /nip44/encrypt` and `/nip44/decrypt`, scoped to **self-encryption only** | **done** |

`1111` was added in the same pass for REW-10, and `claude-agent` was widened separately through `PATCH /admin/credentials/:clientId/kinds` — it is not in `SEED_APPS`, and that route exists so a capability change need not rotate the secret.

All four done-whens asked that `/sign` accept the kind **from a browser session**, which no terminal can produce. That was run rather than waived — devtools on a signed-in `https://peek.estiva.app`, cross-origin to the live `https://id.estiva.app`:

| signed | result |
| --- | --- |
| `22242`, `relay=wss://estiva.estiva.app` | `200` |
| `22242`, `relay=wss://evil.test` | `422 relay_auth_relay_not_allowed` |
| `30078` | `200` |
| `41010` | `200` |
| `30622` | `422 kind_not_allowed` |

**The two refusals are the valuable half.** One is the scope declining a relay Peek has no business authenticating to; the other is the relay-signed visibility kind staying ungrantable. Both were also *readable by the browser*, which is PEEK-93's failure mode checked from the far side — a refusal a browser cannot read arrives as a generic network error, and this one arrives as `policy_violation` with its reason.

The live row, which is what "verify" means here:

```
estiva-peek | {9,7,5,9007,27235,1851,9101,9002,9008,1111,30078,41010,41011,41012,22242} | {wss://estiva.estiva.app}
estiva-ship | {30850,30851,1851,9,5,9007,31989,27235,1111,30078}                        | {}
```

### What Gate 1 taught — a grant has two halves

**The kind list is not the capability.** Two of Estiva ID's kinds are credentials *aimed at somewhere* rather than things an app publishes, and for those the number alone says nothing about what was granted:

| kind | tag read | bounded by | match |
| --- | --- | --- | --- |
| `27235` NIP-98 | `u` | `SIGN_NIP98_ALLOWED_URL_PREFIXES` ∩ `app_credentials.nip98_url_prefixes` | prefix |
| `22242` NIP-42 | `relay` | `SIGN_RELAY_AUTH_ALLOWED_URLS` ∩ `app_credentials.relay_auth_urls` | **exact**, after URL normalization |

Three things fell out of building the second row, and none of them were in the ticket:

- **`SIGN_RELAY_AUTH_ALLOWED_URLS` is a new required setting.** It is the deployment half of the AND, it lives only in `.env`, and empty means refuse. So `allowed_kinds` can contain `22242` and read as correct while every challenge is refused. On the box it must be added **before** the new container starts, or the timer's `--force-recreate` brings up an image without it. Check it inside the container (`docker compose exec -T estiva-id printenv SIGN_RELAY_AUTH_ALLOWED_URLS`), not in the file.
- **Copy a pattern's structure, not necessarily its matching rule.** PEE-4 said to copy the NIP-98 URL-prefix branch. The two-bound structure was right to copy; the prefix was not. A `u` tag is a full request URL with a path, so a prefix is the only workable shape. A `relay` tag has no path, and as a prefix `wss://estiva.estiva.app` also admits `wss://estiva.estiva.app.attacker.example/` — the hazard redirect URIs are already matched exactly for.
- **`RELAY_BRIDGE_URL` exists and is the wrong thing to reuse.** Three planning documents said Estiva ID had no relay URL at all. It has one — but empty means *profile publishing is off*, so deriving relay auth from it would give two unrelated capabilities one switch. Same objection to reusing `nip98_url_prefixes`: widening an app's bridge access would silently widen what it can authenticate *as*. **A column per capability, or you cannot grant one without the other.**

And one that generalises past Estiva ID: **`update.sh` applying migrations makes a half-deployed state look finished.** Mid-deploy this time, the migration had run, the container was healthy, the timer log was green — and the row still had no `22242` and an empty relay list, because `update.sh` runs `migrate` and never `seed`. Every signal said done.

Deploy order on the box is **merge → confirm the image pulled → re-seed → verify the row**, and the verify is the step that has been skipped before:

```bash
docker compose exec -T estiva-id node dist/db/seed.js
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds, relay_auth_urls from app_credentials"
```

Verify the row, never the `seeded N app credential(s)` log line. `docker compose run --rm -T estiva-id node dist/db/seed.js` works too, if the service container is mid-restart.

~~**Run that query before editing `seed.ts`** — the live values were never read.~~ **Done.** Production matched `seed.ts` exactly for all four credentials. The worry can be dropped. For any credential whose secret you hold, `/token` also returns `allowed_kinds`, which reads the live ceiling without the box.

### Gate 2 — SHA-1 unblocks the packages

Where the foundation packages live and how they publish. Contains decisions that are not an implementer's to make: repo layout, public npm versus GitHub Packages, and who owns a breaking change. SHA-1 asks for a throwaway package published and upgraded in two apps before it closes, because the failure mode is a build that cannot resolve a dependency in CI rather than locally.

**Decided, 2026-08-26 — [`decisions/0002-foundation-packages.md`](decisions/0002-foundation-packages.md).** One repo (`estiva-foundation`, npm workspaces, per-package CI), public npm under **`@estiva-app`**, built ESM + `.d.ts` rather than TypeScript source, and the person making a break opens the upgrade PR in every consumer before the major publishes.

**The gate is not closed.** The pipeline is proved from clean checkouts of all three consumers — publish, install, `0.0.1` → `0.0.2`, and the new version present in Peek's and Ship's *built bundles* — but against a **local registry**, because there are no npm credentials on the machine and the `@estiva-app` org does not exist. What remains is human: create the org, mint a granular token, publish for real. §7 of the ADR is the list.

Two findings worth having before SHA-2 and SHA-3 start:

- **Publishing raw `.ts` would have shipped a package that is green in Peek and red in Ship** — Ship's `noUnusedLocals` applied to the library's own source, `skipLibCheck` no help because these are not `.d.ts`. Ship's esbuild build passed the same package. That is b990b57's objection relocated into a typecheck, and it is why the packages are built.
- **Peek's Vercel build could not be confirmed and may no longer exist.** `peek-develop.vercel.app` is serving a build four commits behind `main`, and the repo shows no Vercel check-runs or deployments — only `github-actions`. Public npm needs no registry token, so the stakes are low, but somebody with Vercel access should say whether that project still builds Peek at all.

---

## Start now — no gate

| ticket | note |
| --- | --- |
| ~~**PEE-1, PEE-2, PEE-3**~~ | **Done, 2026-08-26.** Ahead of the M6 target. Not the mitigation they were filed as — the socket arrived first, so they shipped as its fallback, and the topic timer stands down while it is live. |
| **CRO-3** | The read-context convention: `h:<folder-uuid>` / `thread:<root>` / `msg:<id>`. A document. Every later read-state ticket cites it. |
| **CRO-11** | The app-private storage convention (`kind:30078`). A document. |
| **SHA-1** | Gate 2. |
| **REW-1** | Can begin the scaffold immediately; needs SHA-1 before it consumes packages. |
| ~~**REW-11**~~ | **Done, 2026-08-24**, with CAT-9 (the relay change it needed) and SHI-7 (the defect it turned out not to fix). See §"Finishing the Folder decision". |
| ~~**REW-10**~~ | **Done, 2026-08-25.** Comments are NIP-22 `kind:1111`. Needed grants for three credentials, both Peek read paths, and a manifest republish — none of which the ticket named. |
| **CAT-1, CAT-2, CAT-3** | The catch-up survey. Read-only, nothing merged, nothing deployed. CAT-3 answers whether an upstream deploy would break production data, which is the gate for the rest of that project. **CAT-2's title says "our four commits" and the fork is now nine** — the newest is CAT-9's *deletion* inside a match arm, the kind a merge silently undoes. There is a test that catches it; keep it through the merge. |

## Track A is finished — what it cost and what it left

**Eleven tickets, 2026-08-25 to 2026-08-26**, from a Peek that read the relay once per mount to one that updates live on every surface with a channel, and falls back to polling where it cannot.

Three things from it are worth carrying to any track, and none is about WebSockets.

**A two-window test of one account proves nothing.** It was the first test run here and it looked exactly like success. Both windows share one Convex deployment, so a reply sent in one reaches the other by **Convex reactivity alone** — as it did before any of this existed. The relay path is only exercised when an event originates *outside Peek's own database*. What settled it was a `kind:9` signed by the agent and POSTed to the relay's bridge, appearing in an open topic with no other route to the screen. Any future verification of a live path has to publish from Ship, the agent, or a second identity.

**Check the bytes, not the image id.** A container whose image id matches a local tag proves nothing about what it serves. The deploys here were confirmed by fetching the served bundle and grepping it for the new code.

**A status signal must earn its way onto the screen by persisting.** PEE-9 shipped correct and was reported four times for crying wolf. Every state now has a threshold. An indicator built from "is everything perfect right now?" fires at every transition, and a badge that lights during normal use is one people stop seeing.

### What is worth doing next, and why

Nothing is blocked. In rough order of leverage:

| next | why |
| --- | --- |
| **SHA-1** (Gate 2) | Unblocks the entire foundation half — tracks D and E, which contain the programme's long pole. It is also mostly *decisions* rather than implementation: repo layout, public npm versus GitHub Packages, who owns a breaking change. Needs a person, not an implementer. |
| **CRO-3, CRO-11** | Two convention documents every later read-state ticket cites. Cheap, and they unblock CRO-4 onward, which Gate 1 already cleared the way for. |
| **CAT-1, CAT-2, CAT-3** | The catch-up survey. Read-only, nothing merged or deployed. CAT-3's answer is the trigger for the rest of that project. |
| **The Folder decision** | §"Finishing the Folder decision" — both verification questions are answered and both rehearsals are built. It is now a reading session and a decision, not an investigation. |

---

## The six tracks

```
Gate 1 ✔ CLOSED ─────┬─> A. Peek real-time   ✔ COMPLETE (11 of 11)
  (Estiva ID, live)  ├─> B. Read state       CRO-4 → 5 → 6 → 7 → 9
                     └─> C. DMs              DMS-2 → 3,4 → 5,6 → 7 → 9,10,11

Gate 2 (SHA-1) ──────┬─> D. Foundation       SHA-2, SHA-3, SHA-6
                     └─> E. Ship rewrite     REW-2 → 3,4,5 → 6,7 → 8 → 9
                                             (SHA-4 lands in REW-2, SHA-5 in REW-3)

no gate ─────────────┬─> F. Buzz catch-up    CAT-1,2,3 → CAT-4 → 5 → 6 → 7 → 8
                     └─> REW-10, REW-11      independent of the rewrite (see Start now)
```

A through F touch different code and share no gate beyond Gate 2, now that Gate 1 is closed. They can run concurrently with different people.

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

1. ~~`PEE-5 → 6 → 7 → 8`~~ → `CRO-10` — **track A is done bar its fallback**; CRO-10 now needs only read state on the protocol (CRO-5, CRO-11)
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
| **REW-11** | **Done.** Ship's project record is global, carrying `buzz-channel`, `name` and `description`. Verified against production: served by an unscoped `kinds` query, *not* by an `#h` query for its own channel, while its issues still are. It was filed as fixing 13 unreachable issues and **that was wrong** — see SHI-7 | done |
| **CAT-9** *(new)* | The relay change REW-11 needed: `KIND_LL_PROJECT` out of `requires_h_channel_scope`, so a project record may omit `h`. One line, plus a manual deploy | done |
| **SHI-7** *(new)* | The actual fix for the 13: discover `kind:30851` directly instead of only through parents, **and** widen into each issue's own Folder so its changes come with it. Coverage 13 → 0 | in review |
| **CRO-11** | reinforced, not changed. RFC 0.3 §4.6 uses the app-private convention for folder follow-lists | none needed |
| **DMS-\*** | unaffected. DM channels are orthogonal to folders | none needed |
| **SHA-\*** | unaffected now. `@estiva/protocol` would carry folder kinds eventually, but not before they exist | none needed |

Both new REW tickets are independently valuable and depend on nothing deferred. REW-11 in particular is worth doing for the bug alone.

## Finishing the Folder decision

The folder decision unblocks the most: folder implementation, Peek's `topic = channel` → `topic = file` migration, and the upstream NIP proposal all wait on it. It has two halves and they land in different places.

### The cheap half — done, 2026-08-24

Two verification questions gated whether the design was even valid. Both were probed against production; both came back clean, so the folder model needs no rework on their account.

| question | answer |
| --- | --- |
| **Does the relay's key rotate?** *(was RFC 0.3 §12.3, now [§5.3](protocol/RFC-0.3-FOLDERS.md))* | **No, and it is not designed to.** The `keys: [{ current: true, id: "relay-v1", … }]` that suggested otherwise is not relay identity — it sits inside NIP-11's `push` object and is the NIP-PL push-executor descriptor, whose `id` defaults to the literal string `relay-v1`. No rotation exists in the fork or in upstream's extra 625 commits, the key is bound once at boot, and three subsystems already depend on it being stable. Every relay-signed event on production, back to 2026-08-07, has one author. |
| **Is `39000`'s `d` exactly the channel uuid, and can a non-member read a *listed* channel's `39000`?** *([§5.2](protocol/RFC-0.3-FOLDERS.md))* | **Yes and yes.** `d` is the `Uuid` verbatim; across all 50 production channels every `d` is a lowercase v4 uuid and every message `h` resolves to one. A reader that is a member of *nothing* reads all 50 `39000`s, because open visibility is a second route into the accessible set alongside membership. |

Two things the probes turned up that the RFC did not ask for, both recorded in §5.2:

- **An open channel's member roster is world-readable** to any relay member — `39002` rides the same access rule as `39000`. A listed folder discloses who is in it, not only that it exists.
- **The negative arm is unmeasured.** Production has no private channel a non-member could be refused, and constructing the case needs a second relay-member identity the suite does not provision. Private gating follows from the SQL, which is a read of the code rather than a measurement.

### The rehearsal is done — 2026-08-24

**REW-11 made Ship's project record global with a `buzz-channel` tag, which is structurally the same move as making a folder global with a channel reference.** It is finished and verified against production, so the four questions it was pulled forward to answer have answers rather than arguments:

| question | answer |
| --- | --- |
| does global discovery fix the unreachable-record problem? | **No — 13 before, 13 after.** 12 had a *deleted* parent record, 1 never had an `a` tag, all 13 sat in folders the reader could already see. The real fix was discovering issues directly (SHI-7), which took coverage to **0 of 97** |
| what breaks when a record's name becomes world-readable? | Nothing mechanically, and the exposure is narrower than it looked — an open channel's member roster was *already* world-readable on the same rule. Two things broke **silently**: a lookup keyed on the channel tag reported "no access" for a global record, and the read-one-container methods stopped seeing it. Both are RFC 0.3 §4.2 material now |
| how does a fold cope with two shapes coexisting? | Three fallbacks, not one, because the tags move independently. `h` beats `buzz-channel` when both are present; an empty `description` tag beats leftover `.content`. Conformance passing with the fixture untouched is the evidence it costs nothing |
| how much work is it, really? | The client change was half a day and four files. **The relay change was one line and took longer to land than the whole client change** — merge, image build, and a manual deploy the relay has no timer for |

That is rule 3 applied and paid off: the small version was built, and it moved two claims from "argued" to "measured" and produced two failure shapes nobody had predicted.

**REW-10 is in the same position** — `kind:1111` comments also change only `src/`. It is not a rehearsal for anything, so there is less reason to hurry it, but nothing stops it either.

### What the decision then consists of

1. Accept or amend RFC 0.3, with the §5.2 and §5.3 answers in hand, REW-11 and REW-10 both built, and their failure shapes written into §4.2. Nothing is waiting on more evidence — this is now a reading session and a decision, not an investigation.
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
| **Live project-panel updates** *(new, small)* | found while building PEE-2. The Ship project panel polls on a 30s timer because `liveProjection` routes only message-shaped kinds — so a project or issue record changing in Ship reaches Peek eventually rather than instantly. The socket already delivers those events: the subscription is kindless, so nothing new is asked of the relay. Routing `30850`/`30851` into a panel refresh would close it | nothing — it is filed here only because it is smaller than a ticket and nobody has decided it is worth one |
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
| ~~Package repo layout; public npm vs GitHub Packages; who owns a breaking change~~ — **decided 2026-08-26**, [ADR 0002](decisions/0002-foundation-packages.md). What is left is not a decision: create the npm org | SHA-1 |
| What the product says about DM privacy — "private" is accurate for membership-scoped; whether to say more is product and possibly legal | DMS-11 |
| What happens to existing Convex-only DMs. The relay's ±15 minute drift window means republished history cannot carry original timestamps, so migration is not free | DMS-7 |
| Whether `claude-agent` gets `kind:30078` — decide rather than omit | CRO-2 |
| In-place versus parallel app directory for the rewrite | REW-1 |

---

## Verified against live systems

Worth knowing which claims in the tickets are observations rather than inferences.

**Verified:** the WebSocket handshake and AUTH challenge at `wss://estiva.estiva.app` (with `curl --http1.1` — over HTTP/2 the same request returns NIP-11 JSON, because `Connection`/`Upgrade` are not h2 headers); NIP-11 capabilities including NIP-42, `auth_required`, `max_subscriptions: 1024`; relay git hosting responding `401` on `/git/{owner}/{repo}/info/refs`; `#h` filters matching reactions and deletions through the `channel_id` fallback; `claude-agent` can sign `30850`/`30851`/`1851` but is refused `9007`; every kind these projects need already present in the relay's `ALL_KINDS`, so **no Buzz change and no relay deploy is required by any of this work**; gift wrap rejected over the HTTP bridge; and `computeEventId`, `threadTags`, `toNostrSeconds`, `canonicalChannelName`, `normalizeUrl` byte-identical between `peek-app` and `estiva-ship`.

Added 2026-08-25, all read from production rather than from a passing suite: **the live `allowed_kinds` rows** (they matched `seed.ts`); a full `/nip44/encrypt` → `/nip44/decrypt` round trip, against a `404` taken as the negative control beforehand; that a NIP-44 audit row records the operation and neither the plaintext nor its length, checked by scanning the whole table rather than the `detail` column; and the **CORS preflight for `/nip44/*` and `/sign` from `https://peek.estiva.app`** — `204` with the headers, `403` from an unregistered origin, and the header present on a `401`, which matters because nothing enforces CORS when a Hono app is called in-process and this repo has shipped that failure twice with green tests.

Also verified from a real signed-in browser session, cross-origin, which is the only place some of this is checkable: `/sign` issuing `22242`, `30078` and `41010`; the `22242` scope **refusing** `wss://evil.test`; `30622` still refused as relay-signed; and both refusal bodies being readable by the browser rather than arriving as network errors.

Added 2026-08-25 with PEE-5, and it closes the oldest open question in this list: **a real NIP-42 round trip against production.** A browser opened a socket to `wss://estiva.estiva.app`, was issued a challenge, signed a `22242` through the PEE-4 grant, was accepted (`OK … true`), and its REQ came back with three events and an `EOSE` rather than `auth-required`. Every clause of PEE-4's done-when, on one connection.

**Not verified:** whether `kind:41010` is accepted over HTTP — Estiva ID will sign one, which says nothing about ingest (**DMS-2**); whether `nostr-tools` covers enough to replace part of `@estiva/protocol` (SHA-3 allocates an hour).

---

## Appendix — all 58 tickets

**Peek: Real-time Ship→Peek updates** — PEE-1 topic refetch · PEE-2 project panel re-resolve · PEE-3 profile cache TTL · PEE-4 grant 22242 · PEE-5 WS client + NIP-42 · PEE-6 per-channel subscriptions · PEE-7 route events into the projection · PEE-8 wire useTopicView · PEE-9 connection state · PEE-10 surface read failures · PEE-11 subscribe outside topics

**Cross-app read state** — CRO-1 NIP-44 in Estiva ID · CRO-2 grant 30078 · CRO-3 read-context convention · CRO-4 publish blob · CRO-5 fetch and merge · CRO-6 horizon cache · CRO-7 dual-run and cut over · CRO-8 Ship publishes · CRO-9 prove cross-app · CRO-10 Convex read-path spike · CRO-11 app-private storage convention

**DMs on Nostr (DM channels)** — DMS-1 grant 41010/41011/41012 · DMS-2 probe · DMS-3 open channel · DMS-4 publish messages · DMS-5 project channels · DMS-6 hidden set · DMS-7 existing DMs · DMS-8 DM read state · DMS-9 immutable participants · DMS-10 participant cap · DMS-11 privacy copy

**Shared foundation packages** — SHA-1 registry decision · SHA-2 PWA package · SHA-3 `@estiva/protocol` · SHA-4 `@estiva/identity` · SHA-5 `@estiva/ui` · SHA-6 scaffold with no backend

**Rewrite Ship with shared foundation** — REW-1 shape and scaffold · REW-2 auth via `@estiva/identity` · REW-3 projects views · REW-4 issue views · REW-5 writes · REW-6 keep the poll · REW-7 parity checklist · REW-8 cut over · REW-9 remove the old app · REW-10 NIP-22 comments · REW-11 global project record

**Catch up the Buzz fork** — CAT-1 survey the gap · CAT-2 collisions and conflict surface · CAT-3 migration audit · CAT-4 merge into `nfb-demo-kinds` · CAT-5 probe the kinds · CAT-6 rehearse migrations on a throwaway · CAT-7 deploy and verify by image id · CAT-8 exercise Peek, Ship and the agent
