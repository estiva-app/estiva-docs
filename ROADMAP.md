# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-29. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Pruned 2026-09-18.** The sequence of 2026-09-11 is spent. Everything that was struck through, every finished milestone's narrative and every resolved dependency came out; what each one taught stayed, in [§Finished](#finished--and-what-each-one-taught). The previous version is in git if a citation is needed.

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
| **Folders: navigation for the whole suite** | **The centre of the programme.** Teams, files that nest, the tree that replaces the Topics view. Built: relay-maintained Folder state (buzz#13/#15), folder views in both apps, the file route `/topic/<address>` opening any file in three panes (FOL-19) — and since FOL-37 (peek#274, 2026-09-21) a bare file’s short form `/topic/<slug>-<d>`; RFC 0.5 §7.7 (estiva-docs#131) then made the path host-independent and reserved `/app/`, implemented in Peek by FOL-39 (peek#279, 2026-09-21: every declared word routes, `/app/` reserved; a Ship project still spins there — PEE-33, a record with no `h`) and in Ship by **PRO-22** (open), the left column of five teams with expand-on-demand (FOL-21, FOL-22), Ship's sidebar folding projects under teams (SHI-25, ship#152), bare-file topics with `1111` conversations (FOL-12/13/14, peek#194), per-file unread inside a shared channel (FOL-16), the union dot (FOL-18), and the topic migration (FOL-25, peek#220–#226) — **read off the relay 2026-09-18** (CON-3, peek#260): 14 files across Estiva HQ and Peek, 9 of them holding **134** threaded re-posts, 129 signed by their real authors and 5 the agent's own. `migrate`'s agent-signed stand-ins are all gone — of 626 `kind:1111` the agent has ever written, 5 carry an `orig` tag and all 5 are `remigrate`'s — so the figure of 549 describes what `migrate` attempted, not what stands on the relay. **What is left is in [§What to do next](#what-to-do-next)** |
| **Conversation standard** | Comments the third app adopts rather than rebuilds. Every affordance is in both apps (CON-2…CON-4, CON-8, CON-10, CON-13…CON-15). **Re-planned 2026-09-29.** Each rule has four copies — Peek, Ship, interop and the agent's vendored copy of Ship — and they disagreed in twelve places. **CON-5 step 1 is merged (estiva-docs#178, 2026-09-29):** the divergences are settled in SPEC §6.2–§6.9 (replies are a flat `1111`; Edit/Delete show on own and `bot: true` messages), the edit model is SPEC §6.8, and §9 has C10–C16. Left, in order: **PEE-38** (`f8ee17be`, a security fix: Peek and interop apply an edit to a different `e` than the relay checked, so a crafted edit forges another member's message); **CON-20** (`afa49eed`, republish the ~175 comment-shaped `kind:9` as `1111`, so the package never reads `kind:9` as a comment); then **CON-5** extracts `@estiva-app/conversation` with Ship, Peek and the agent as consumers; **CON-17** (`d8eeda32`, urgency's wire form — since RIC-2 an urgent mention is a plain `nostr:npub`, so nothing is urgent; FOL-43 follows it) runs beside it; **CON-19** (`6bd072cb`, unread from SPEC §11 in the package); **CON-18** (`02dd1894`, placeholder: where the drop-in views live); then **CON-6** (`13ce66c1`, publish, the guide, and comments in Leaf timed). Found on the way: **PER-24** (`bd5a8b2a`) — the agent's `peek` commands still read channel topics and see no `1111` |
| **Projection layer** | Render and act on another app's objects. Mostly built; **PRO-18**'s container-creating emit is what INT-9's last two rows wait on |
| **Manifests: every app declares its actions** | Opened 2026-09-25 (`f80c46dd`, Estiva HQ). Every app declares in its `kind:31990` every action another app may take, and reads other apps' objects only through manifests. Ship declares 10 of the ~17 things it does (live `31990`, 2026-09-29). **MAN-1**'s protocol half shipped 2026-09-29: SPEC §7 declares a move field (`movedBy`), a placement plus Folder listing (`placement`, `listed`) and a prose `format` (estiva-docs#181), and interop 0.36.0 / protocol 0.24.0 build them (estiva-foundation#86); the reply parent was PRO-20's. Its RIC-13 leg — Peek's block-editor control and Ship declaring the new actions — goes with **MAN-4**; **MAN-7** is interop's inline card list not folding a move; **MAN-3** makes Folders protocol-level and settles one name, *Folder* — "team" goes. **PER-21** (the agent drops its copy of Ship's code) waits on this project and on CON-5 (`cf3c5071`, which PER-20 merged into) |
| **Intelligence in Peek** | Cmd+K. Built and deployed; *Create project* and *Create topic* stay hidden until PRO-18 |
| **Rich text and blocks** | Thin on purpose |
| **Composition** | A document that points at live content. [RFC 0.6](protocol/RFC-0.6-COMPOSITION.md), gated on COM-1 |
| **Shared foundation packages** | The packages a third app installs. `@estiva-app/protocol` 0.22.0, `interop` 0.23.0, `identity`, `platform`, `ui` 0.22.0 |
| **Performance & infrastructure** | ~~CRO-10~~ (cancelled; the read-state cache it had been re-scoped to drop is now REM-5), ~~PER-6~~ (Ship's project page read every ~3 s and flashed its reference cards: one refresh timer per interval in platform 0.3.1, estiva-foundation#80, taken by ship#181 and peek#344; no skeleton on a refresh, ship#180; 2026-09-24, verified idle on production at one read per 10 s), ~~PER-7~~ (Peek CI's typecheck and a 4-way test shard run in parallel, peek#335, 2026-09-23: main ~425 s → 215 s.), ~~PER-15~~ (`node_modules` cached per lockfile and Node version, peek#340, 2026-09-24: install 13–31 s → 5–7 s per job on a hit), ~~PER-14~~ (`.test.ts` files run under node, only `.test.tsx` under jsdom, peek#341, 2026-09-24: jsdom setup across shards 107 s → 55 s, each shard 72–81 s → 60–71 s), ~~PER-16~~ (Ship's CI laid out as Peek's: one install action shared from estiva-foundation `@ci-v1` (foundation#82, peek#351), web tests sharded 3 ways, and the image wraps a bundle CI built, ship#186, 2026-09-24: the slowest check a merge waits on 133–138 s → ~60 s, `publish` 99 s → 43 s), ~~PER-19~~ (Ship is one package laid out as Peek is: the app in `src/`, its data layer in `src/nostr/`, every CI job installs once, ship#191, 2026-09-25; the bundle had been carrying protocol's NIP-19 code twice, and on production it now carries it once), ~~PER-22~~ (the agent holds a session as a person, approved with their passkey at a `/device` link, and two QA accounts sign in with nobody present, estiva-id#69, #70, 2026-09-25), ~~PER-23~~ (`scripts/probe.mjs` runs production Peek headless as QA-1 or QA-2 and prints JSON, peek#369, 2026-09-25. Measured: QA-1 posts, and QA-2's open page lights the Folder dot 0.7 s later. Signed-in checks no longer need a person), PER-21 (estiva-agent reads apps through a shared conversation library and each app's manifest, not its copy of Ship's `src/`, which was four features behind on 2026-09-24; depends on the conversation library, CON-5 `cf3c5071`, which PER-20 merged into), PER-24 (`bd5a8b2a`, the agent's `peek` commands read channel topics and see no `1111`) |
| **UI Guardrails** | Katerina's — the `@estiva-app/ui` gates, adopted by both apps through 0.22.0 (peek#245/#251, ship#161/#162). Not sequenced here; it runs beside everything |
| **Highlights on the relay** | HIG-1, research. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only |
| **Huddles** | Placeholder (`cec874b6`), 2026-09-18. A concept on paper; out of scope for the Folders work. **Disabled 2026-09-23** (peek#309, CON-8): existing huddles stay readable behind a paused banner, and none can be started or replied to. The rebuild is HUD-1 (`a7a301a9`), not scheduled |
| **Make Agent more token efficient** | MAK-1..3 |
| **Peek: Improvements**, **Peek: Feedback & Bugs**, **Ship: Feedback & Bugs** | the bug lists |

**Completed and archived** — Convex removed (REM-7/REM-8, 2026-09-25), DMs on Nostr, Live delivery, Cross-app read state, Agent / Steer, Other, Catch up the Buzz fork, Rewrite Ship, Peek real-time. Their lessons are in [§Finished](#finished--and-what-each-one-taught). Two open tickets sit in a completed project: **DMS-9** (immutable participants) and **DMS-10** (the 9-participant cap) — both presuppose group DMs, which Peek's pair-only `dmConversations` does not have, so they move to *Peek: Improvements*.

**Both gates are closed.** Gate 1 (Estiva ID capabilities) 2026-08-25; Gate 2 ([ADR 0002](decisions/0002-foundation-packages.md)) 2026-08-27. Nothing in the programme is gate-blocked.

---

## What to do next

**The sequence decided 2026-09-18 with Miky is spent**, and no sequence after it has been decided here yet. Its phase A stays below as the record of how the Folders tree replaced the Topics view.

### A — Folders reaches parity, then the tree replaces Topics

Four gaps were known before any audit, all from Miky using the tree on 2026-09-18, and they are the first four tickets:

| | ticket | what |
| --- | --- | --- |
| A1 | **FOL-28** (`d2d83474`), closed SHR-11 — **shipped 2026-09-18**, peek#261 | **Unlisted the topic channels** placed beside their projects and files: **26**, not the 18 the ticket counted — ten record channels of paired Ship projects (the nine, plus `Folders` 85db5b59 which FOL-25's reconcile had placed), nine that FOL-25 restored beside their `30840` files (Widgets), and seven FOL-25 had already deleted but whose placement was never taken out of state. One `1852 remove` per team, nothing deleted — a project's `h` is immutable, so its record channel stays as an invisible conversation container. The agent signed them itself: `1852` was in its ceiling all along, so "needs a person's click or a grant" was a stale premise. Confirmed in Peek by Miky 2026-09-19: every row under a team is a project or a file, Steer draws nothing (its only row is the archived Agent project) |
| A2 | **FOL-27** (`4358783d`) — **done** | **The parity audit** — `TopicsPage` → `useTopicView` → `ThreadReplyCard` → `ComposeBox`, feature by feature against `/topic/<address>` on production as a signed-in person. Its output is FOL-26's gate: a checklist with a ticket or a "not needed" beside every missing row |
| A3 | **FOL-31** (`e5031bf9`) — **shipped 2026-09-19**, peek#265 → **CON-5** → **CON-6** | **The conversation slice.** A file's conversation is Peek's own view — composer, edits, reactions, resolution, deletion, threads, drafts, attachments — reading `1111` on a file as it reads `kind:9` in a channel, on the `containerKind`/`containerKey` pair DMS-5 introduced. Today the file page renders every conversation through `ForeignConversationView`, which is read-only *by design*; "the composer is dumber and edits do not show" is that one fact. Then CON-5 extracts the view with Ship as the second consumer and CON-6 publishes it. **This moves *Conversation standard* from last to the middle of parity.** Katerina is the natural owner — she is migrating exactly these components through the `@estiva-app/ui` gates, and the extraction happens after the gates reach them or inside the package |
| A4 | **FOL-29** (`fea8e059`) — **shipped 2026-09-21**, peek#282, checked on production by Miky | **A non-Peek file's widget in the right pane** while no thread is open; a topic shows nothing there. Same three panes for every file, the widget the only difference (2026-09-13). What shipped: `FileWidgetPanel` — the app's name as the column's bar over the same reference card a message draws, its title the link into the owning app, the manifest's controls under it, Activity (CON-11) beneath; a thread replaces it and closing brings it back. "Another app's" is `referenceLink`'s answer, since the resolved object does not say which manifest it came through. Left on sight: the app's name now shows three times on one screen (middle caption, column bar, card label) |
| A5 | **FOL-30** (`d4d3f511`) — **shipped 2026-09-22**, peek#283 / #284 / #285, ship#169, docs#137 | **Following replaces topic membership.** The unread dot exists only for followed keys — a file's address or a Folder's id — and FOL-16 and FOL-18 judge nothing else; RFC 0.4 §4.6's list is `estiva:followed:v1`, suite-wide, any file. **Stars stay a separate list** (Miky, 2026-09-21): a star is "keep this near", a follow is "tell me when this moves". Defaults: what you create, comment in, are @mentioned in, are placed on — the last two read from one `#p` filter over `1111`, `9` and `1851`, which is why Ship now names an assignee or lead with a `p` tag; an unfollow of an implied key is a timed mute, and a naming after it follows again (found by test F). **Day one is quiet** by ruling — no seed from history. Verified on production with two identities, A–F. Found on the way: **FOL-40** — the team dot listens to `onForeignActivity`, which never fires for a comment, so it waits for a refresh trigger and the sidebar redraws with it |
| A6 | from FOL-27 (struck 2026-09-18) | **Blocking A7 beside A3:** **FOL-35** (the team's general `kind:9` chat as a row — `/topic/<team uuid>` stops resolving with `TopicsPage`; Miky: overkill, deferred), ~~**FOL-36**'s `/message/<id>` half~~ (shipped in peek#268, 2026-09-20, verified on production — a link to a file comment opens the file with the thread), ~~**FOL-14**~~ (a way to start a topic — closed 2026-09-20: peek#194 shipped it on 2026-09-11, FOL-15/31/32/33 overtook the rest, and Miky started a topic at team level and under a project on production; peek#269 is the relay census). **Not blocking:** ~~FOL-32~~ (live `1111` — shipped in peek#266, 2026-09-19, verified with two browsers), ~~FOL-33~~ (peek#267), ~~FOL-36's search/Recent half~~ (peek#268; search also needed buzz#18 — the relay's FTS allowlist had no `kind:1111`, so every file comment was unfindable; deployed 2026-09-20), ~~FOL-34~~ (Screener and Open work see a followed file's `1111`: shipped in peek#305 and peek#308 on 2026-09-23, relay only, verified on production by Miky; the urgent leg is **FOL-43**, blocked on HIG-1), CON-11, HIG-1. Found on the way: **PRO-21** — a Peek comment on a re-linked Ship project lands in the record's Folder and Ship reads the re-linked one, so it is invisible in Ship; a projection-layer bug, not a Topics one |
| A7 | **FOL-26** — **done** | **Retire the Topics view** — peek#337, 2026-09-23: no route renders `TopicsPage`; `/topics/<id>`, `/topic-old/`, `/topic/<slug>-<channel>` and a `39000:` naddr land on the file (or team Folder) through a table in the bundle, and the launcher can no longer start a conversation in a restored channel. Checked on production by Miky. A2's checklist is spent: ~~A3~~ (peek#265), ~~FOL-36's `/message` half~~ (peek#268), ~~FOL-14~~ (2026-09-20). **FOL-35** (`91a74134`) is deferred by Miky to a future Teams project (2026-09-19). The five teams' general chat holds 1 `kind:9`, and it is accepted that this has no row until then (2026-09-23) |

~~**FOL-25's delete mode**~~ — **done** 2026-09-24 (peek#342). All 16 topic channels with a `30840` file are deleted. For *Folders concept* and *Conversation across apps*, the placement in `85db5b59` was moved to their files first. 6 of the 8 test channels are deleted; *katerina topic* and *PEEK-72 probe* stay (Miky), because each holds an issue only its author can delete. The 9 project record channels stay by design.

### Left from the sequence

Not blocking: **PEE-36** (`809fcc1e`, a DM message link opens an empty "DM" Folder page that offers Delete) and **CON-17** (`d8eeda32`, Urgent has had no wire form since RIC-2).

**Huddles** are out of scope, with their own placeholder project (`cec874b6`). They were disabled on 2026-09-23 (peek#309). The one huddle has no messages and is dropped; the rebuild is HUD-1 (`a7a301a9`), not scheduled.

**Deferred past all of it, and why.** Labels (FOL-5/FOL-6) — the grant costs nothing, the UI is real with 62 Folders on production, but nothing waits on it. Private folders (FOL-10) — nothing on production is private, and Peek can only create open Folders; FOL-4's "nobody outside the team" leg was closed unrun for that reason (2026-09-23). PRO-18 → INT-9 — once containers are stable. ~~FOL-4~~ — shipped 2026-09-23. COM-2 — nothing waits on it. ~~FOL-7~~ — shipped 2026-09-29 (ship#207, estiva-agent#59): a project moves between Folders by `1852` add then remove only, and its conversation keeps its channel, so a moved project's new comments still light the old Folder (FOL-49). FOL-8 — placeholder.

### Blocked, and worth knowing why

- **INT-9's remaining half** — PRO-18's container emit. Waits on its turn and nothing else.

## What blocks what

Live dependencies only. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| **CON-5**'s extraction (step 2) | CON-5's SPEC PR (step 1) | A package extracted before the seven divergences are settled would freeze one app's answer as the standard. Its old gates are met: FOL-31 shipped (peek#265) and the `@estiva-app/ui` gates reach every Peek conversation component with 0 errors (2026-09-28) |
| **CON-6** (publish, guide, Leaf) | CON-5, CON-19, CON-18's decision | Leaf exists since 2026-09-27 (UIG-11), so the third app is no longer hypothetical |
| **FOL-43** (urgent file comment in Desk Urgent) | **CON-17** | Nothing on the relay says "urgent" until CON-17 gives it a wire form |
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
| **Convex removed** (REM-7/REM-8, 2026-09-25) | **Take the snapshot first** when content can be destroyed, and **prove a deletion against a control**. A census is only as good as its reader, and a census of 0 can be satisfied while content goes dark: before a retirement, ask what stops being readable, not only what is unpublished |
| **DMs on Nostr** — 2026-09-17/18, ten tickets, peek#240–#258, protocol 0.21/0.22 | **The bridge client discarded the relay's answer.** `parsePublishResponse` kept `message` only on the refusal branch, so a command kind's payload — the DM channel uuid — never reached a caller; the first ticket of the Peek track was a foundation publish. **A replay returns no uuid** (`duplicate: already processed`) — two tabs opening one DM in the same second hit it. **A DM uuid is minted, not derived.** And **verify as a participant, not as the agent**: the DMS-5 live check had to be redone twice (peek#253, #254) — first it published as the agent, then it read one capped page and hid the quiet channels. Every DM channel is private, which finally measured the access filter: 0 events to a non-member on the same filter, same run |
| **The topic migration** — FOL-25, peek#220–#226 | **A `9008` hides everything under the `h`, Ship issues included**, and only the channel owner may send one; the delete run took the `Folders` Folder and FOL-1…24 with it, and Miky un-deleted it on the box. **A Folder with state lists only its state** — filing by `h` never updates the 30890, so the first `1852` on a team must carry everything. **A verify that compares against what migrate read cannot see what migrate never read**; the messages it missed were found by a person looking at a file |
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

Failure shapes worth reading before building anything: [SILENT-FAILURES.md](operations/SILENT-FAILURES.md). The Screener and Desk research: [`decisions/SHR-7-screener-and-desk.md`](decisions/SHR-7-screener-and-desk.md).

---

## Still unverified

- **The `39000` half of the private-channel refusal.** The access filter is measured (DMS-4: 0 events to a non-member). A DM channel has no channel record, so "a non-member is refused a private channel's `39000`" still comes from reading the relay's `UNION`. Closing it needs a private *topic* channel, which nothing on production has.
- **Seven topic channels that answer nothing.** SHR-5's fold found 7 of the 26 topic channels return no messages and no `kind:39000`, while the other 19 have theirs — a channel absent or unreadable, not content unmigrated, and publishing into it will not fix it. **Settled by CON-4, 2026-09-22, with no person and no box**: six of the seven held no recorded event id in Convex either, so they were never created rather than deleted; the seventh, `3789d2ca` *For testing*, is the one genuine soft-delete and holds the whole 17-message unreadable bucket, and it is discarded. A `9008` in a channel's history is not a test for whether it is hidden — nine channels carry one and read fine; only a read answers it.
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. Every team's topics now share that team's channel, so production is becoming the test.
