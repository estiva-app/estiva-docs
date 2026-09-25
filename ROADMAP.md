# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-25. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Pruned 2026-09-18.** Two projects finished in the same week — *DMs on Nostr* and *Shrinking Convex* — and the sequence of 2026-09-11 is spent. Everything that was struck through, every finished milestone's narrative and every resolved dependency came out; what each one taught stayed, in [§Finished](#finished--and-what-each-one-taught). The previous version is in git if a citation is needed.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

**The shape, agreed 2026-09-05 and now built.** Four levels:

| level | what it is | on production |
| --- | --- | --- |
| **Workspace** | the relay — one per company | yes, unnamed as such |
| **Team** | a Folder: people, permissions, one conversation space. **Teams never nest** | **five, and only five, since 2026-09-15**: Estiva HQ, Peek, Ship, Leaf, Steer. `kind:1852` in, relay-signed `kind:30890` out; every Ship project is *linked* under its team, every topic is placed in one. Private folders deliberately not yet (FOL-10) |
| **File** | anything addressable — project, issue, document, topic. **Files nest inside files** | yes; a topic is a **bare file** (`kind:30840`, RFC 0.5 §10.7, SPEC §6.7) and its conversation is `kind:1111` comments on its address. Nesting shipped with **FOL-4** (2026-09-23; foundation#75, peek#315/#328, ship#173, SPEC §6.7): a bare file names its parent, moves by a `parent` change, and both apps draw the nesting from the team listing — breadcrumbs, the deep tree, Related at depth |
| **Block** | an addressable paragraph inside a file | shipped |

A file's **description is the file**, not a document beneath it. Nesting **organises and never grants access**: everything in a team is visible to that team.

**Two kinds of app** ([RFC 0.5 §10.7](protocol/RFC-0.5-ASSOCIATION.md), decided 2026-09-11). A **specialized** app owns kinds and its navigation lists only its own files — Ship lists projects and issues. A **generic** app owns no kinds and renders *one aspect of every file* — Peek the conversation, Leaf the document. **Navigation is by kind; nesting is by intent.** A subject no specialized app claims is a bare file, which the generic apps handle completely.

---

## How this document is meant to be used

1. **Aim for high-level architectural clarity.** Know the shape before building the parts. [ADR 0001](decisions/0001-relay-canonical-by-default.md) and [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) exist for that.

2. **Do not force a decision that does not need making yet.** Name it, name the *latest responsible moment*, and move on. A deferred decision with a trigger is a plan; a guessed decision is debt with interest. **Work that needs a deliberately deferred decision gets no implementation tickets — but it does get a placeholder** (amended 2026-09-04), carrying the open options, what has been measured, and what would decide it, so somebody reading Ship alone knows the work exists.

3. **Learn as you go, and fold what you learn back into the architecture.** Every substantial finding in this programme came from having built the previous piece, not from planning harder. The first thing to do when a project finishes is say what it taught — [§Finished](#finished--and-what-each-one-taught).

4. **Check the merge log before sequencing anything.** This document has lagged production three times (FOL-2, PRO-18, FOL-2 again); each time an agent would have re-blocked on work that was already deployed. Read each repo's merges since *Last updated* — buzz on `nfb-demo-kinds`, not `main` — and close the marker in the same turn the work lands.

---

## Where things stand

The active projects and what each is *for*. **Counts are deliberately not here** — `ship issues --project "…"` is the only place they can be right (OTH-4). Two projects share the `CON-` prefix (SHI-4): address issues by short id.

| project | what it is |
| --- | --- |
| **Folders: navigation for the whole suite** | **The centre of the programme.** Teams, files that nest, the tree that replaces the Topics view. Built: relay-maintained Folder state (buzz#13/#15), folder views in both apps, the file route `/topic/<address>` opening any file in three panes (FOL-19) — and since FOL-37 (peek#274, 2026-09-21) a bare file’s short form `/topic/<slug>-<d>`, the Convex topics moved to `/topic-old/`; RFC 0.5 §7.7 (estiva-docs#131) then made the path host-independent and reserved `/app/`, implemented in Peek by FOL-39 (peek#279, 2026-09-21: every declared word routes, `/app/` reserved; a Ship project still spins there — PEE-33, a record with no `h`) and in Ship by **PRO-22** (open), the left column of five teams with expand-on-demand (FOL-21, FOL-22), Ship's sidebar folding projects under teams (SHI-25, ship#152), bare-file topics with `1111` conversations (FOL-12/13/14, peek#194), per-file unread inside a shared channel (FOL-16), the union dot (FOL-18), and the topic migration (FOL-25, peek#220–#226) — **read off the relay 2026-09-18** (CON-3, peek#260): 14 files across Estiva HQ and Peek, 9 of them holding **134** threaded re-posts, 129 signed by their real authors and 5 the agent's own. `migrate`'s agent-signed stand-ins are all gone — of 626 `kind:1111` the agent has ever written, 5 carry an `orig` tag and all 5 are `remigrate`'s — so the figure of 549 describes what `migrate` attempted, not what stands on the relay. **What is left is in [§What to do next](#what-to-do-next)** |
| **Conversation standard** | Comments the third app adopts rather than rebuilds. Track 2 is done. Left: **CON-5** (extract `@estiva-app/conversation`, Peek and Ship the two consumers), **CON-6** (publish it with the "comments in an hour" guide), ~~**CON-11**~~ (shipped in peek#272, 2026-09-21), **CON-14** (Peek reads a kind:9's `a` as a comment on the issue it names; SPEC §6.4's per-tag rule landed in estiva-docs#129 and Ship reads it since ship#167 — CON-13, done 2026-09-21), **CON-17** (`d8eeda32`, urgency gets a wire form: since RIC-2 an urgent mention is written as a plain `nostr:npub`, so the urgent marker and the Desk's Urgent never light). **Re-sequenced 2026-09-18 into the middle of Folders parity**: the extraction follows FOL-31, the one conversation view for both shapes — see *What to do next* A3 |
| **Projection layer** | Render and act on another app's objects. Mostly built; **PRO-18**'s container-creating emit is what INT-9's last two rows wait on |
| **Intelligence in Peek** | Cmd+K. Built and deployed; *Create project* and *Create topic* stay hidden until PRO-18 |
| **Rich text and blocks** | Thin on purpose |
| **Composition** | A document that points at live content. [RFC 0.6](protocol/RFC-0.6-COMPOSITION.md), gated on COM-1 |
| **Shared foundation packages** | The packages a third app installs. `@estiva-app/protocol` 0.22.0, `interop` 0.23.0, `identity`, `platform`, `ui` 0.22.0 |
| **Performance & infrastructure** | ~~CRO-10~~ (cancelled; the read-state cache it had been re-scoped to drop is now REM-5), ~~PER-6~~ (Ship's project page read every ~3 s and flashed its reference cards: one refresh timer per interval in platform 0.3.1, estiva-foundation#80, taken by ship#181 and peek#344; no skeleton on a refresh, ship#180; 2026-09-24, verified idle on production at one read per 10 s), ~~PER-7~~ (Peek CI's typecheck and a 4-way test shard run in parallel, peek#335, 2026-09-23: main ~425 s → 215 s. Removing Convex takes under 20 s more off CI), ~~PER-15~~ (`node_modules` cached per lockfile and Node version, peek#340, 2026-09-24: install 13–31 s → 5–7 s per job on a hit), ~~PER-14~~ (`.test.ts` files run under node, only `.test.tsx` under jsdom, peek#341, 2026-09-24: jsdom setup across shards 107 s → 55 s, each shard 72–81 s → 60–71 s), ~~PER-16~~ (Ship's CI laid out as Peek's: one install action shared from estiva-foundation `@ci-v1` (foundation#82, peek#351), web tests sharded 3 ways, and the image wraps a bundle CI built, ship#186, 2026-09-24: the slowest check a merge waits on 133–138 s → ~60 s, `publish` 99 s → 43 s), ~~PER-19~~ (Ship is one package laid out as Peek is: the app in `src/`, its data layer in `src/nostr/`, every CI job installs once, ship#191, 2026-09-25; the bundle had been carrying protocol's NIP-19 code twice, and on production it now carries it once), PER-21 (estiva-agent reads apps through a shared conversation library and each app's manifest, not its copy of Ship's `src/`, which was four features behind on 2026-09-24; depends on the conversation library, see CON-5 and PER-20) |
| **UI Guardrails** | Katerina's — the `@estiva-app/ui` gates, adopted by both apps through 0.22.0 (peek#245/#251, ship#161/#162). Not sequenced here; it runs beside everything |
| **Highlights on the relay** | HIG-1, research. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only |
| **Remove Convex** | **The critical path since 2026-09-23**, when the data migration finished (census 0, DMS-7 done; that project is completed and archived). **Peek runs on Buzz and Estiva ID and nothing else:** `convex/` gone, and the `honorable-guineapig-592` deployment deleted after a snapshot with file storage. Re-planned with Miky on 2026-09-23: Convex turned out not to be leftover tables but what the app stands on — sign-in, the relay URL, the viewer, the whole DM path, uploads and the Desk. The order and the table-by-table map are in the project brief on Ship (`e6aefcdc`), which is the source of truth; the sequence is [§C](#c--remove-convex) |
| **Huddles** | Placeholder (`cec874b6`), 2026-09-18. A concept on paper; out of scope for the Folders and Convex work. **Disabled 2026-09-23** (peek#309, CON-8): existing huddles stay readable behind a paused banner, and none can be started or replied to. The rebuild is HUD-1 (`a7a301a9`), not scheduled |
| **Make Agent more token efficient** | MAK-1..3 |
| **Peek: Improvements**, **Peek: Feedback & Bugs**, **Ship: Feedback & Bugs** | the bug lists |

**Completed and archived** — Convex → Buzz data migration (2026-09-23), DMs on Nostr, Shrinking Convex, Live delivery, Cross-app read state, Agent / Steer, Other, Catch up the Buzz fork, Rewrite Ship, Peek real-time. Their lessons are in [§Finished](#finished--and-what-each-one-taught). Two open tickets sit in a completed project: **DMS-9** (immutable participants) and **DMS-10** (the 9-participant cap) — both presuppose group DMs, which Peek's pair-only `dmConversations` does not have, so they move to *Peek: Improvements*; **DMS-7** (Convex-only DMs) moved to the migration project and is done.

**Both gates are closed.** Gate 1 (Estiva ID capabilities) 2026-08-25; Gate 2 ([ADR 0002](decisions/0002-foundation-packages.md)) 2026-08-27. Nothing in the programme is gate-blocked.

---

## What to do next

**One sequence, decided 2026-09-18 with Miky**, replacing the one of 2026-09-11, which is spent — steps 0–3b landed the week of 2026-09-14 and steps 4–7 were never started. The goal it serves: *get rid of Convex, and make Folders as good as the Topics view is now, because Folders replace Topics.* Three phases, **interleaved**: A in the foreground, B prepared in the background from day one and executed when Miky's inputs land, C after B's census reads 0. One ticket per session.

**Where it stands, 2026-09-23:**
- A is finished, except A7, which moved into C.
- B is finished: the census reads 0 and the project is archived.
- C is what is left. It was re-planned the same day.

### A — Folders reaches parity, then the tree replaces Topics

Four gaps were known before any audit, all from Miky using the tree on 2026-09-18, and they are the first four tickets:

| | ticket | what |
| --- | --- | --- |
| A1 | **FOL-28** (`d2d83474`), closed SHR-11 — **shipped 2026-09-18**, peek#261 | **Unlisted the topic channels** placed beside their projects and files: **26**, not the 18 the ticket counted — ten record channels of paired Ship projects (the nine, plus `Folders` 85db5b59 which FOL-25's reconcile had placed), nine that FOL-25 restored beside their `30840` files (Widgets), and seven FOL-25 had already deleted but whose placement was never taken out of state. One `1852 remove` per team, nothing deleted — a project's `h` is immutable, so its record channel stays as an invisible conversation container. The agent signed them itself: `1852` was in its ceiling all along, so "needs a person's click or a grant" was a stale premise. Confirmed in Peek by Miky 2026-09-19: every row under a team is a project or a file, Steer draws nothing (its only row is the archived Agent project) |
| A2 | **FOL-27** (`4358783d`) — **done** | **The parity audit** — `TopicsPage` → `useTopicView` → `ThreadReplyCard` → `ComposeBox`, feature by feature against `/topic/<address>` on production as a signed-in person. Its output is FOL-26's gate: a checklist with a ticket or a "not needed" beside every missing row |
| A3 | **FOL-31** (`e5031bf9`) — **shipped 2026-09-19**, peek#265 → **CON-5** → **CON-6** | **The conversation slice.** A file's conversation is Peek's own view — composer, edits, reactions, resolution, deletion, threads, drafts, attachments — reading `1111` on a file as it reads `kind:9` in a channel, on the `containerKind`/`containerKey` pair DMS-5 introduced. Today the file page renders every conversation through `ForeignConversationView`, which is read-only *by design*; "the composer is dumber and edits do not show" is that one fact. Then CON-5 extracts the view with Ship as the second consumer and CON-6 publishes it. **This moves *Conversation standard* from last to the middle of parity.** Katerina is the natural owner — she is migrating exactly these components through the `@estiva-app/ui` gates, and the extraction happens after the gates reach them or inside the package |
| A4 | **FOL-29** (`fea8e059`) — **shipped 2026-09-21**, peek#282, checked on production by Miky | **A non-Peek file's widget in the right pane** while no thread is open; a topic shows nothing there. Same three panes for every file, the widget the only difference (2026-09-13). What shipped: `FileWidgetPanel` — the app's name as the column's bar over the same reference card a message draws, its title the link into the owning app, the manifest's controls under it, Activity (CON-11) beneath; a thread replaces it and closing brings it back. "Another app's" is `referenceLink`'s answer, since the resolved object does not say which manifest it came through. Left on sight: the app's name now shows three times on one screen (middle caption, column bar, card label) |
| A5 | **FOL-30** (`d4d3f511`) — **shipped 2026-09-22**, peek#283 / #284 / #285, ship#169, docs#137 | **Following replaces topic membership.** The unread dot exists only for followed keys — a file's address or a Folder's id — and FOL-16 and FOL-18 judge nothing else; RFC 0.4 §4.6's list is `estiva:followed:v1`, suite-wide, any file. **Stars stay a separate list** (Miky, 2026-09-21): a star is "keep this near", a follow is "tell me when this moves". Defaults: what you create, comment in, are @mentioned in, are placed on — the last two read from one `#p` filter over `1111`, `9` and `1851`, which is why Ship now names an assignee or lead with a `p` tag; an unfollow of an implied key is a timed mute, and a naming after it follows again (found by test F). **Day one is quiet** by ruling — no seed from history. Verified on production with two identities, A–F. `topicMembers` and the members pill leave with the Convex deletion, not here. Found on the way: **FOL-40** — the team dot listens to `onForeignActivity`, which never fires for a comment, so it waits for a refresh trigger and the sidebar redraws with it |
| A6 | from FOL-27 (struck 2026-09-18) | **Blocking A7 beside A3:** **FOL-35** (the team's general `kind:9` chat as a row — `/topic/<team uuid>` stops resolving with `TopicsPage`; Miky: overkill, deferred), ~~**FOL-36**'s `/message/<id>` half~~ (shipped in peek#268, 2026-09-20, verified on production — a link to a file comment opens the file with the thread), ~~**FOL-14**~~ (a way to start a topic — closed 2026-09-20: peek#194 shipped it on 2026-09-11, FOL-15/31/32/33 overtook the rest, and Miky started a topic at team level and under a project on production; peek#269 is the relay census). **Not blocking:** ~~FOL-32~~ (live `1111` — shipped in peek#266, 2026-09-19, verified with two browsers), ~~FOL-33~~ (peek#267), ~~FOL-36's search/Recent half~~ (peek#268; search also needed buzz#18 — the relay's FTS allowlist had no `kind:1111`, so every file comment was unfindable; deployed 2026-09-20), ~~FOL-34~~ (Screener and Open work see a followed file's `1111`: shipped in peek#305 and peek#308 on 2026-09-23, relay only, verified on production by Miky; the urgent leg is **FOL-43**, blocked on HIG-1), CON-11, HIG-1. Found on the way: **PRO-21** — a Peek comment on a re-linked Ship project lands in the record's Folder and Ship reads the re-linked one, so it is invisible in Ship; a projection-layer bug, not a Topics one |
| A7 | **FOL-26** — **done** | **Retire the Topics view** — peek#337, 2026-09-23: no route renders `TopicsPage`; `/topics/<id>`, `/topic-old/`, `/topic/<slug>-<channel>` and a `39000:` naddr land on the file (or team Folder) through a table in the bundle, and the launcher can no longer start a conversation in a restored channel. Checked on production by Miky with `*.convex.cloud` blocked. Was: *moved into C's phase 2, after the DMs.* B6 is met: census 0 and CON-12's probe 0 (2026-09-23). A2's checklist is spent: ~~A3~~ (peek#265), ~~FOL-36's `/message` half~~ (peek#268), ~~FOL-14~~ (2026-09-20). **FOL-35** (`91a74134`) is deferred by Miky to a future Teams project (2026-09-19). The five teams' general chat holds 1 `kind:9`, and it is accepted that this has no row until then (2026-09-23) |

~~**FOL-25's delete mode**~~ — **done** 2026-09-24 (peek#342). All 16 topic channels with a `30840` file are deleted. For *Folders concept* and *Conversation across apps*, the placement in `85db5b59` was moved to their files first. 6 of the 8 test channels are deleted; *katerina topic* and *PEEK-72 probe* stay (Miky), because each holds an issue only its author can delete. The 9 project record channels stay by design. Then **FOL-23**, the demolition, in C's phase 2.

### B — the migration: Convex → Buzz, with true dates (finished 2026-09-23)

**Done:**
- The census reads 0 and `probe-con16` reads 0 (CON-7, peek#325).
- CON-8 stopped Peek writing messages to Convex (peek#304, #309).
- DMS-7 republished the Convex-only DMs, dated as their authors wrote them (peek#324).

All fifteen tickets are done, and the project is completed and archived. Its brief on Ship keeps the sequence, the decisions of 2026-09-22 and the bucket sizes; what it taught is in [§Finished](#finished--and-what-each-one-taught).

**The gap it left is closed:** REM-1 (peek#336) writes a DM to the relay only, so a failed publish no longer leaves a Convex-only DM. One slipped through first: a tab still running the pre-REM-1 bundle sent an image DM at 2026-09-23 21:22Z that never reached the relay. REM-8's census has to catch it.

### C — Remove Convex

**This is the whole of what is left** (`e6aefcdc`, `in_progress` since 2026-09-23). It was re-planned with Miky on 2026-09-23 from an inventory of Peek `origin/main`.

The 2026-09-18 brief read Convex as leftover tables once the migration was done. The inventory showed it is what the app still stands on:
- the sign-in gate (`ConvexProviderWithAuth` and Convex's `<Authenticated>`);
- the relay URL every relay hook waits on (`relayConfig`);
- the viewer (`users.me`);
- the whole DM path: the view reads only a relay→Convex import, and every DM action writes Convex first, then mirrors to the relay without waiting;
- every upload;
- the Desk's DM half and Urgent;
- a read-state cache.

Nothing outside Peek calls the deployment, and no relay event points at Convex storage (measured 2026-09-23).

~~**REM-2**~~ (`c762527c`) shipped on 2026-09-23 (peek#330, #333): sign-in, the relay URL and file-comment uploads no longer depend on Convex, so every later done-when can be checked with `*.convex.cloud` blocked.

~~**REM-1**~~ (`9cf225fb`) shipped on 2026-09-23 (peek#336). The DM view reads its channel off the relay and writes only there, and a send reports success only on the relay's acceptance (CON-7's guard). It was checked with Convex reachable, because the DM list and each DM's channel still come from Convex; REM-3 re-runs the check with it blocked. Until CON-14, a new DM does not reach the Screener.

~~**REM-3**~~ (`fe8d1aeb`) shipped on 2026-09-24 (peek#343, estiva-id#68). People, the DM list, DM channels, hide and DM dots read the relay, and a DM is keyed by the partner's pubkey. Miky checked it on production with `*.convex.cloud` blocked. People lists humans only: Estiva ID now marks role accounts NIP-24 `bot` (EST-4). `unread.summary` is gone from `src/`, so topic dots have also lost Convex's `topicMarks` cache ahead of REM-5. The Screener's DM half is still Convex, and its links use old ids and land on the People list until CON-14.

~~**REM-6**~~ (`48378c5e`) shipped on 2026-09-24 (peek#350). The viewer is the Estiva ID token's pubkey, named by its `kind:0`. Mentions, avatars and the person pickers read the same roster + `kind:0` answer as People, with agents still mentionable. `users.adoptIdentity` and the `kind:0` → `users` copy are gone, and `role` and `email` were dropped. Miky checked it on production with `*.convex.cloud` blocked. Two things are left until the tickets that delete them: the Screener preview labels your own rows with your name rather than "You" (CON-14), and a first-time sign-up gets no Convex `users` row, so the Convex Desk, stars and read state stay empty for them (CON-14, REM-4, REM-5).

~~**REM-5**~~ (`6316e113`) shipped on 2026-09-25 (peek#363). Read state is the NIP-RS blob only. Thread reads no longer write Convex, and the merge no longer fills, re-anchors from or diffs against the Convex horizon cache. The Read state panel keeps only its size readout, and `api.readState.*` has no caller in `src/`. No replacement is needed for the re-anchor: the 90-day horizon drops whole slot events, and any marker in a dropped slot is older than every message the unread fold still judges. The Convex functions stay deployed so tabs on the old bundle do not throw, and REM-7 deletes them. Miky checked it on production on two devices with `*.convex.cloud` blocked.

~~**REM-7**~~ (`99437ab8`) shipped on 2026-09-25 (peek#366, #368). Peek's code has no Convex left: `convex/`, the client, the Convex upload path, the scripts, the dependencies, the CI deploy step and the `CONVEX_DEPLOY_KEY` secret are all gone. The production bundle has 0 `convex.cloud`, and Miky saw no Convex request from a signed-in session. The deployment is still up, for tabs on the old bundle, until REM-8 snapshots it and deletes it.

One ticket per session, in **three lanes run in parallel** (re-planned with Miky 2026-09-23; the brief on Ship has the reasons):

| wave | DMs | Topics | per-person |
| --- | --- | --- | --- |
| 1 | ~~**REM-1**~~ (`9cf225fb`, done, peek#336): the DM view reads and writes the relay through FOL-31's conversation view with a `{ kind: 'channel', h }` container; CON-7's guard lands here | ~~**FOL-26**~~ (`fcddc731`, done, peek#337): no route renders `TopicsPage`, and old links land on files. Now **FOL-25**: re-delete the 9 restored channels and the 8 test channels | **REM-4** (`4764de85`): stars and open work live only on the relay |
| 2 | ~~**REM-3**~~ (`fe8d1aeb`, done, peek#343): the People page, the DM list and DM unread come from the relay, and DM links are keyed by pubkey | ~~**FOL-23**~~ (`f5b889a0`, done, peek#358): the topic and huddle code, the live projection into Convex and every `src/` reader of Convex topics are deleted; the tables go in REM-7 | |
| 3: after REM-3 (landed) and FOL-23 | ~~**REM-6**~~ (`48378c5e`, done, peek#350): the viewer is a pubkey. The DM lane is finished | ~~**CON-14**~~ (`083b091a`, done, peek#360): the Desk reads the relay. Its Urgent leg moved to **CON-17** (`d8eeda32`), because urgency has had no wire form since RIC-2 | ~~**REM-5**~~ (`6316e113`, done, peek#363): read state is the blob only (replaces the cancelled CRO-10) |
| 4 | ~~**REM-7**~~ (`99437ab8`, done, peek#366) → **REM-8** (`d60dbbe4`): delete Convex from the code, then snapshot, Miky's click-through, delete the deployment, update the docs | | |

The DM lane is finished. With one session, REM-4 runs next because it waits on nothing. FOL-23 landed 2026-09-24 (peek#358; Miky checked the old links on production), so REM-5 waits on nothing. CON-14 landed the same day (peek#360; Miky checked it on production with `*.convex.cloud` blocked). PER-7 (CI speed) can run alongside, since it touches only `.github/workflows/`.

**Huddles** are out of scope, with their own placeholder project (`cec874b6`). They were disabled on 2026-09-23 (peek#309). The one huddle has no messages and is dropped; the rebuild is HUD-1 (`a7a301a9`), not scheduled.

**Deferred past all of it, and why.** Labels (FOL-5/FOL-6) — the grant costs nothing, the UI is real with 62 Folders on production, but nothing waits on it. Private folders (FOL-10) — nothing on production is private, and Peek can only create open Folders; FOL-4's "nobody outside the team" leg was closed unrun for that reason (2026-09-23). PRO-18 → INT-9 — once containers are stable. ~~FOL-4~~ — shipped 2026-09-23. COM-2 — nothing waits on it. FOL-7, FOL-8 — placeholders.

### Blocked, and worth knowing why

- **Nothing in C waits on a person until REM-8's click-through.** The agent's ceiling covers everything the plan signs (`24242` has been granted since 2026-09-23). Deleting the deployment may need whoever holds the Convex account.
- **INT-9's remaining half** — PRO-18's container emit. Waits on its turn and nothing else.

## What blocks what

Live dependencies only. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| ~~every *Remove Convex* done-when "with `*.convex.cloud` blocked"~~ | ~~**REM-2**~~ | Shipped 2026-09-23 (peek#330, #333) |
| ~~**FOL-25** delete mode~~ (done), ~~**FOL-23**~~ (done) | **FOL-26** | The restored channels stayed until nothing could write into them; FOL-25 deleted them 2026-09-24 |
| ~~**FOL-23**~~ (done) | **REM-1** | Not behaviour: both rewrite Peek's `src/api/actions.ts` and `messages.ts`, and one would pay for a large rebase. FOL-26 no longer waits for the DMs; the DM view renders neither `TopicsPage` nor `useTopicView` |
| ~~**REM-3**, **REM-6**~~ | ~~**REM-1**, REM-3~~ | Both landed (peek#343, #350) |
| **REM-5** | ~~REM-3~~, ~~FOL-23~~ | DM unread has left the Convex horizon cache (REM-3); topic unread goes with FOL-23 |
| ~~**CON-14**~~ (`083b091a`, the Desk reads the relay) | ~~**REM-1**~~, ~~FOL-23~~ | Shipped 2026-09-24 (peek#360). A DM row's preview reads the channel store the DM dots already hold, not a second container read |
| ~~**REM-7**~~ (delete Convex from the code) | every other *Remove Convex* ticket | Shipped 2026-09-25 (peek#366, #368) |
| **REM-8** (delete the deployment) | ~~**REM-7**~~ live, a snapshot with file storage, Miky's click-through | The snapshot is the only copy of the bytes. There is no quiet period (Miky, 2026-09-23) |
| ~~**CON-11**~~ → **CON-14** (a kind:9's `a` in Peek; an older ticket that shares its ref with the Desk's `083b091a`) | *(nothing)* | CON-11 shipped in peek#272. CON-13 wrote the per-tag rule (SPEC §6.4) and Ship reads it; Peek still draws a topic message naming a Ship issue as a comment on the issue's page, and its mentions read is 1111-only |
| **CON-5** (extract the package) | **FOL-31**, and the `@estiva-app/ui` gates reaching the conversation components | Extracting the read-only foreign view would produce a package shaped like today's file page and then change it; extracting before the gates ships the old primitives on day one |
| **FOL-30** (following) | *(nothing)* | Its one open question — do stars become follows — is answered on the ticket, not by anyone else |
| **INT-9**'s remaining half | **PRO-18**'s container half | An action still cannot create a container |
| **Leaf starting** | *(nothing)* | Unblocked; files nesting is what makes it cheap |

## Decisions that gate work

Open decisions only. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| **Accept or amend RFC 0.6** | COM-1 | **Open, with a window** — Ship began producing `attachment` blocks on 2026-09-10 and §3 fixes their shape; production held zero when written, so disagreeing was free then and gets expensive as people attach files. No new kind, no Buzz change, nothing to migrate |
| **What the product says about DM privacy** | *(no ticket)* | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
| **Disclosure copy** | RFC 0.4 §12.6 | Granting access discloses all history, and *listing* a team discloses its roster — "who is on this team" is org structure |

**Settled 2026-09-05**, recorded here because the RFCs do not yet say so: workspace = the relay, team = a Folder, files nest inside, teams never nest; a file's description is the file; nesting never grants access; labels are shared, not per-person; a team may point at another team's files, and a reference to something the reader cannot see renders as **nothing** (not "unavailable" — a deliberate divergence from NIP-MP); someone who should see one project and not the team gets their own team; following is a subscription, not a permission tier; open teams have public rosters.

**Settled 2026-09-11:** a topic is a **bare file** (`30840`) — not its own kind, not a Leaf document; a message in a topic is a **`kind:1111` comment** on it, and the team's general conversation stays `kind:9` in the channel. **Settled 2026-09-15 (Miky, FOL-25):** nothing obsolete stays on the relay — early-experiment shapes are migrated where easy and deleted otherwise, never kept beside the new shape. **Settled 2026-09-07:** the reaction horizon is 100 (SPEC §6.6). **Settled 2026-09-18 (Miky):** topic membership is replaced by **following** — a per-person, private list (RFC 0.4 §4.6) widened from Folders to any file; the unread dot exists only for followed files, and an unfollowed file never lights a row or its team however new its messages are. Following is a subscription, never a permission: everyone in a team can open every file in it. The alternative — a member list that grants access — is the old model, and the relay grants access per channel, not per file.

**Settled 2026-09-23 (Miky, *Remove Convex*):**
- DMs move onto the relay before Topics goes, and they move entirely: reads as well as writes.
- `users.role`, `users.isExternal`, `topicRenames`, the one huddle and DM highlights are dropped, not migrated; the snapshot keeps them.
- FOL-35 stays deferred to Teams.
- There is no quiet period before the Convex deployment is deleted.

## Not filed, and why

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **`@onboarding-team` mentions** | the reference works today; what is missing is fanning a notification to members | nothing protocol-shaped — FOL-7 is the placeholder |
| **Association and facets** (RFC 0.5 §2, §3) | parked 2026-09-05; facets withdrawn (§10) | a panel needing §2 |
| **The upstream NIP proposal** (RFC 0.4 §10.2) | not happening — FOL-1 chose fork | kept as the list to propose if revisited |
| **The intelligence layer** — cross-app agent actions, per-app harnesses | what it protects is the *persistence*, not the reasoning; see *Highlights on the relay* | the first time a second app's harness needs another app's memories |
| **`30841 Component`** | `30840` became the bare file; `30841` has zero events and no use | FOL-8 |
| **Composition beyond the pointer** (RFC 0.6 §6, §7) | draft RFC, rule 2. Transcluding *one* block is buildable today (COM-2) | COM-1 |

## Finished — and what each one taught

Rule 3 is why these survive the pruning: the lesson, not the history.

| shipped | what it taught |
| --- | --- |
| **Convex → Buzz data migration** — 2026-09-17/23, fifteen tickets, peek#260–#325, buzz#19 | **Convex was never a mirror, and a census is what proved it:** 202 of 842 non-DM messages and 62 of 68 attachments existed nowhere else. The count moved in both directions while nobody was publishing, because rows *left* Convex, and a row leaving read as progress. **Take the snapshot first** when content can be destroyed (CON-10). **A census of 0 was satisfiable while 507 messages went dark:** it scored what was on the relay, not what stayed readable once the old view went (CON-12). Before a retirement, ask what stops being readable, not only what is unpublished. **True dates were one env var away** once the floor became a knob (CON-13); a date-in-a-tag rule would have made every reader sort by it for ever. **An event's author is its signature,** so copies were re-signed with their authors' keys. **Check the allow list before calling a box read impossible:** an allow rule is a prefix match on the whole command |
| **Convex-only DMs (DMS-7)** — 2026-09-23, peek#324 | **The option the ticket argued against won once its blocker was measured away** — the drift window had become an env var (CON-13), so republishing kept true dates. **But a republish into a channel Peek syncs races the importer:** it matches rows by `nostrEventId`, which a row only gets at write-back, so a tab open during the run imported 164 copies and every `.unique()` on that index now throws for them. Write the ids back *before* publishing. And **an `imeta` size is the store's, not the row's** — canonicalization changed one file by 21 bytes and ingest refused it |
| **DMs on Nostr** — 2026-09-17/18, ten tickets, peek#240–#258, protocol 0.21/0.22 | **The bridge client discarded the relay's answer.** `parsePublishResponse` kept `message` only on the refusal branch, so a command kind's payload — the DM channel uuid — never reached a caller; the first ticket of the Peek track was a foundation publish. **A replay returns no uuid** (`duplicate: already processed`) — two tabs opening one DM in the same second hit it. **A DM uuid is minted, not derived.** And **verify as a participant, not as the agent**: the DMS-5 live check had to be redone twice (peek#253, #254) — first it published as the agent, then it read one capped page and hid the quiet channels. Every DM channel is private, which finally measured the access filter: 0 events to a non-member on the same filter, same run |
| **Shrinking Convex** — 2026-09-14/18, nine tickets, peek#229–#249 | **It is divergence, not duplication.** PER-5 described Convex as a copy; FOL-25 measured it and 41 of 175 messages were Convex-only, then the census made it 202 of 807 and 62 of 70 attachments. The mirror was partial, one-directional and silent. **And "gated on the migration" was wrong for anything that is ids rather than content** — SHR-5, SHR-6 and SHR-9 all shipped ungated once that was said out loud (a fold undercounts a badge; it loses nothing). The topic half of unread went from 531 collects / 26 requests / 1,602 ms to 1 POST / 276 ms. The Screener had no index to lose; Buzz can supply four of its five inputs but not the per-viewer queue. The read-state blob was **latent, not live** — 37.2% of the 65,535-byte ceiling, capped in bytes since SHR-4 |
| **The topic migration** — FOL-25, peek#220–#226 | **A `9008` hides everything under the `h`, Ship issues included**, and only the channel owner may send one; the delete run took the `Folders` Folder and FOL-1…24 with it, and Miky un-deleted it on the box. **A Folder with state lists only its state** — filing by `h` never updates the 30890, so the first `1852` on a team must carry everything. **A verify that compares against what migrate read cannot see what migrate never read**; the Convex-only messages were found by a person looking at a file |
| **Folders, listed** — buzz#13/#15, peek#173–#192, ship#121 | **A placeholder nobody closes is a lie that compounds.** And the relay's silences came in pairs: every Folder's state shared one coordinate because a `d` was written and never read; deleting a Folder swept three kinds by `channel_id`, which global state cannot match |
| **Live delivery** — 2026-09-08, five tickets | **Centralising found the blocker.** A socket half in one project and half in another had a blocker in neither. `createChannelSubscriptions` was one REQ per channel, unaffordable against a budget that refuses the 51st; `watchFolders` came out of the second consumer |
| **The demo** — 2026-09-11 | *Nothing on screen needs a relay change* held. "Needs a Buzz change" and "needs an Estiva ID grant" have very different costs — separate them when scoping. The grant's re-seed ran before the box had pulled, wrote the old values back, and exited 0 |
| **Track 2** — Conversations | **Two apps agreeing needs a rule, not a convention.** Every defect was two self-consistent implementations. **And a withdrawn rule propagates** — SPEC §6.5's author-scoped deletion reached third-party adopters before anyone noticed |
| **Cross-app read state** | **Seven defects, none caught by review or a green suite**, every one in the seam between correct code and whatever was meant to invoke it. **Observing read state changes it.** [READ-STATE.md](operations/READ-STATE.md) |
| **Track A** — Peek real-time | **A two-window test of one account proves nothing.** Verify a live path from a different identity |
| **Track F** — Buzz catch-up | A green image build is not a deploy; the relay refuses as `200 {"accepted": false}`. Measure the defect before the design change. Do not squash-merge an upstream catch-up |
| **Gate 1** — Estiva ID capabilities | **A grant has two halves.** `allowed_kinds` can read as correct while every use is refused, because the deployment half lives in `.env` |
| **Gate 2** — [ADR 0002](decisions/0002-foundation-packages.md) | Releases go through OIDC. **npm publishes asynchronously** — the registry served the old version for three minutes after a green release, twice |
| **SHA-3** — `@estiva-app/protocol` | **The drift was real and nothing had failed.** A red build was never going to be the signal |
| **SHA-4** — `@estiva-app/identity` | **A second consumer proves the package is not shaped like the first app; it does not prove the first app handed everything over.** Extracting found four defects live in production — of three `POST /sign` implementations only Peek's checked the author |
| **SHA-9** · **RFC 0.3 → 0.4** | Two of four research topics were already built and an RFC listed one as an unsolved gap. Check the document against the running code before believing it |
| **RFC 0.5** | **A relay-signed object cannot declare anything.** That constraint forced one-sided declaration, and it solved authorization rather than complicating it |
| **Intelligence in Peek** | **A suite of negative assertions cannot tell "correctly does nothing yet" from "does nothing ever."** |
| **Rich text and blocks** (MS2) | Two surfaces meant to match cannot be kept matching by care — share the styles |

Two documents sit under all of it:

| document | what it settles |
| --- | --- |
| [ADR 0001](decisions/0001-relay-canonical-by-default.md) | **accepted** — relay-canonical by default; a database is a per-feature exception; Estiva ID excluded |
| [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) | **accepted, and current.** Containment, the projection layer, messages vs rich text, the third-app checklist |
| [RFC 0.5](protocol/RFC-0.5-ASSOCIATION.md) | **§7 and §10.7 accepted and implemented; §1–§6 accepted 2026-09-05 with corrections** |

> **The RFC numbers are not a version sequence.** 0.3→0.4 was supersession; everything after 0.4 takes a *topic* the previous left open, and the earlier document stays current for what it covers.

Failure shapes worth reading before building anything: [SILENT-FAILURES.md](operations/SILENT-FAILURES.md). Numbers behind the Convex decision: [`decisions/PER-5-convex-research.md`](decisions/PER-5-convex-research.md), [`decisions/SHR-7-screener-and-desk.md`](decisions/SHR-7-screener-and-desk.md).

---

## Still unverified

- **The `39000` half of the private-channel refusal.** The access filter is measured (DMS-4: 0 events to a non-member). A DM channel has no channel record, so "a non-member is refused a private channel's `39000`" still comes from reading the relay's `UNION`. Closing it needs a private *topic* channel, which nothing on production has.
- **Seven topic channels that answer nothing.** SHR-5's fold found 7 of the 26 topic channels return no messages and no `kind:39000`, while the other 19 have theirs — a channel absent or unreadable, not content unmigrated, and publishing into it will not fix it. **Settled by CON-4, 2026-09-22, with no person and no box**: six of the seven hold no recorded event id in Convex either, so they were never created rather than deleted; the seventh, `3789d2ca` *For testing*, is the one genuine soft-delete and holds the whole 17-message unreadable bucket, and it is discarded. A `9008` in a channel's history is not a test for whether it is hidden — nine channels carry one and read fine; only a read answers it.
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. Every team's topics now share that team's channel, so production is becoming the test.
