# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-22. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Pruned 2026-09-18.** Two projects finished in the same week — *DMs on Nostr* and *Shrinking Convex* — and the sequence of 2026-09-11 is spent. Everything that was struck through, every finished milestone's narrative and every resolved dependency came out; what each one taught stayed, in [§Finished](#finished--and-what-each-one-taught). The previous version is in git if a citation is needed.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

**The shape, agreed 2026-09-05 and now built.** Four levels:

| level | what it is | on production |
| --- | --- | --- |
| **Workspace** | the relay — one per company | yes, unnamed as such |
| **Team** | a Folder: people, permissions, one conversation space. **Teams never nest** | **five, and only five, since 2026-09-15**: Estiva HQ, Peek, Ship, Leaf, Steer. `kind:1852` in, relay-signed `kind:30890` out; every Ship project is *linked* under its team, every topic is placed in one. Private folders deliberately not yet (FOL-10) |
| **File** | anything addressable — project, issue, document, topic. **Files nest inside files** | yes; a topic is a **bare file** (`kind:30840`, RFC 0.5 §10.7, SPEC §6.7) and its conversation is `kind:1111` comments on its address. Nesting is drawn over the parent link; a *generic* parent declaration is FOL-4 |
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
| **Convex → Buzz data migration** | Opened 2026-09-17 out of SHR-8's census; **`in_progress` and the whole critical path since 2026-09-22**, now that phase A is done. **Move every non-DM message and attachment out of Convex into Buzz with its real date, and leave one store behind.** Fifteen tickets; the sequence, the four decisions of 2026-09-22 and the measured bucket sizes are in the project brief on Ship, which is the source of truth. The premise: Convex is **not a mirror** — it is the *only* copy of **202 of 842** non-DM messages and **62 of 68** attachments, across 26 topics and a huddle (re-measured 2026-09-22; peek#244 opened this at 202 of 807, and 2026-09-18 read 184 of 837 — **the count is a reading, not a constant, and it moves in both directions**). Code deletion is not here; that is FOL-23/FOL-26 |
| **Conversation standard** | Comments the third app adopts rather than rebuilds. Track 2 is done. Left: **CON-5** (extract `@estiva-app/conversation`, Peek and Ship the two consumers), **CON-6** (publish it with the "comments in an hour" guide), ~~**CON-11**~~ (shipped in peek#272, 2026-09-21), **CON-14** (Peek reads a kind:9's `a` as a comment on the issue it names; SPEC §6.4's per-tag rule landed in estiva-docs#129 and Ship reads it since ship#167 — CON-13, done 2026-09-21). **Re-sequenced 2026-09-18 into the middle of Folders parity**: the extraction follows FOL-31, the one conversation view for both shapes — see *What to do next* A3 |
| **Projection layer** | Render and act on another app's objects. Mostly built; **PRO-18**'s container-creating emit is what INT-9's last two rows wait on |
| **Intelligence in Peek** | Cmd+K. Built and deployed; *Create project* and *Create topic* stay hidden until PRO-18 |
| **Rich text and blocks** | Thin on purpose |
| **Composition** | A document that points at live content. [RFC 0.6](protocol/RFC-0.6-COMPOSITION.md), gated on COM-1 |
| **Shared foundation packages** | The packages a third app installs. `@estiva-app/protocol` 0.22.0, `interop` 0.23.0, `identity`, `platform`, `ui` 0.22.0 |
| **Performance & infrastructure** | CRO-10 (should Convex be in the read path — stale twice over, re-scope before running), PER-6 (Ship still polls), PER-7 (CI) |
| **UI Guardrails** | Katerina's — the `@estiva-app/ui` gates, adopted by both apps through 0.22.0 (peek#245/#251, ship#161/#162). Not sequenced here; it runs beside everything |
| **Highlights on the relay** | HIG-1, research. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only |
| **Remove Convex** | Opened 2026-09-18 (`e6aefcdc`). What *Shrinking Convex* excluded and the migration does not cover: the residue — all fifteen tables mapped to their relay homes in the brief — and the deletion of `convex/` and the deployment. Phase C of *What to do next* |
| **Huddles** | Placeholder (`cec874b6`), 2026-09-18. A concept on paper; out of scope for the Folders and Convex work, and the feature may be removed to get there — its one huddle exported first |
| **Make Agent more token efficient** | MAK-1..3 |
| **Peek: Improvements**, **Peek: Feedback & Bugs**, **Ship: Feedback & Bugs** | the bug lists |

**Completed and archived** — DMs on Nostr, Shrinking Convex, Live delivery, Cross-app read state, Agent / Steer, Other, Catch up the Buzz fork, Rewrite Ship, Peek real-time. Their lessons are in [§Finished](#finished--and-what-each-one-taught). Two open tickets sit in a completed project: **DMS-9** (immutable participants) and **DMS-10** (the 9-participant cap) — both presuppose group DMs, which Peek's pair-only `dmConversations` does not have, so they move to *Peek: Improvements*; **DMS-7** (Convex-only DMs) already moved to the migration project.

**Both gates are closed.** Gate 1 (Estiva ID capabilities) 2026-08-25; Gate 2 ([ADR 0002](decisions/0002-foundation-packages.md)) 2026-08-27. Nothing in the programme is gate-blocked.

---

## What to do next

**One sequence, decided 2026-09-18 with Miky**, replacing the one of 2026-09-11, which is spent — steps 0–3b landed the week of 2026-09-14 and steps 4–7 were never started. The goal it serves: *get rid of Convex, and make Folders as good as the Topics view is now, because Folders replace Topics.* Three phases, **interleaved**: A in the foreground, B prepared in the background from day one and executed when Miky's inputs land, C after B's census reads 0. One ticket per session.

### A — Folders reaches parity, then the tree replaces Topics

Four gaps were known before any audit, all from Miky using the tree on 2026-09-18, and they are the first four tickets:

| | ticket | what |
| --- | --- | --- |
| A1 | **FOL-28** (`d2d83474`), closed SHR-11 — **shipped 2026-09-18**, peek#261 | **Unlisted the topic channels** placed beside their projects and files: **26**, not the 18 the ticket counted — ten record channels of paired Ship projects (the nine, plus `Folders` 85db5b59 which FOL-25's reconcile had placed), nine that FOL-25 restored beside their `30840` files (Widgets), and seven FOL-25 had already deleted but whose placement was never taken out of state. One `1852 remove` per team, nothing deleted — a project's `h` is immutable, so its record channel stays as an invisible conversation container. The agent signed them itself: `1852` was in its ceiling all along, so "needs a person's click or a grant" was a stale premise. Confirmed in Peek by Miky 2026-09-19: every row under a team is a project or a file, Steer draws nothing (its only row is the archived Agent project) |
| A2 | **FOL-27** (`4358783d`) — **done** | **The parity audit** — `TopicsPage` → `useTopicView` → `ThreadReplyCard` → `ComposeBox`, feature by feature against `/topic/<address>` on production as a signed-in person. Its output is FOL-26's gate: a checklist with a ticket or a "not needed" beside every missing row |
| A3 | **FOL-31** (`e5031bf9`) — **shipped 2026-09-19**, peek#265 → **CON-5** → **CON-6** | **The conversation slice.** A file's conversation is Peek's own view — composer, edits, reactions, resolution, deletion, threads, drafts, attachments — reading `1111` on a file as it reads `kind:9` in a channel, on the `containerKind`/`containerKey` pair DMS-5 introduced. Today the file page renders every conversation through `ForeignConversationView`, which is read-only *by design*; "the composer is dumber and edits do not show" is that one fact. Then CON-5 extracts the view with Ship as the second consumer and CON-6 publishes it. **This moves *Conversation standard* from last to the middle of parity.** Katerina is the natural owner — she is migrating exactly these components through the `@estiva-app/ui` gates, and the extraction happens after the gates reach them or inside the package |
| A4 | **FOL-29** (`fea8e059`) — **shipped 2026-09-21**, peek#282, checked on production by Miky | **A non-Peek file's widget in the right pane** while no thread is open; a topic shows nothing there. Same three panes for every file, the widget the only difference (2026-09-13). What shipped: `FileWidgetPanel` — the app's name as the column's bar over the same reference card a message draws, its title the link into the owning app, the manifest's controls under it, Activity (CON-11) beneath; a thread replaces it and closing brings it back. "Another app's" is `referenceLink`'s answer, since the resolved object does not say which manifest it came through. Left on sight: the app's name now shows three times on one screen (middle caption, column bar, card label) |
| A5 | **FOL-30** (`d4d3f511`) — **shipped 2026-09-22**, peek#283 / #284 / #285, ship#169, docs#137 | **Following replaces topic membership.** The unread dot exists only for followed keys — a file's address or a Folder's id — and FOL-16 and FOL-18 judge nothing else; RFC 0.4 §4.6's list is `estiva:followed:v1`, suite-wide, any file. **Stars stay a separate list** (Miky, 2026-09-21): a star is "keep this near", a follow is "tell me when this moves". Defaults: what you create, comment in, are @mentioned in, are placed on — the last two read from one `#p` filter over `1111`, `9` and `1851`, which is why Ship now names an assignee or lead with a `p` tag; an unfollow of an implied key is a timed mute, and a naming after it follows again (found by test F). **Day one is quiet** by ruling — no seed from history. Verified on production with two identities, A–F. `topicMembers` and the members pill leave with the Convex deletion, not here. Found on the way: **FOL-40** — the team dot listens to `onForeignActivity`, which never fires for a comment, so it waits for a refresh trigger and the sidebar redraws with it |
| A6 | from FOL-27 (struck 2026-09-18) | **Blocking A7 beside A3:** **FOL-35** (the team's general `kind:9` chat as a row — `/topic/<team uuid>` stops resolving with `TopicsPage`; Miky: overkill, deferred), ~~**FOL-36**'s `/message/<id>` half~~ (shipped in peek#268, 2026-09-20, verified on production — a link to a file comment opens the file with the thread), ~~**FOL-14**~~ (a way to start a topic — closed 2026-09-20: peek#194 shipped it on 2026-09-11, FOL-15/31/32/33 overtook the rest, and Miky started a topic at team level and under a project on production; peek#269 is the relay census). **Not blocking:** ~~FOL-32~~ (live `1111` — shipped in peek#266, 2026-09-19, verified with two browsers), ~~FOL-33~~ (peek#267), ~~FOL-36's search/Recent half~~ (peek#268; search also needed buzz#18 — the relay's FTS allowlist had no `kind:1111`, so every file comment was unfindable; deployed 2026-09-20), FOL-34 (Screener, Desk, Open work never see a `1111`), CON-11, HIG-1. Found on the way: **PRO-21** — a Peek comment on a re-linked Ship project lands in the record's Folder and Ship reads the re-linked one, so it is invisible in Ship; a projection-layer bug, not a Topics one |
| A7 | **FOL-26** | **Retire the Topics view. Gated on B6 and nothing else, since 2026-09-22.** A2's checklist is spent: ~~A3~~ (peek#265), FOL-35 (deferred by Miky as overkill — and note **it has no ticket in Ship**, so "deferred" is the only record of it), ~~FOL-36's `/message` half~~ (peek#268), ~~FOL-14~~ (2026-09-20). What is left is **B6** — the Topics view, now at `/topic-old/` since FOL-37, is the only reader of **202** messages and 62 attachments, **and of a further 507 that are on the relay but have no file copy** (CON-12, measured 2026-09-22) |

Then **FOL-25's delete mode** (the 9 restored channels and the 8 test channels) and **FOL-23**, the demolition — which are phase C's first two steps.

### B — the migration: Convex → Buzz, with true dates

**Phase A is finished, so B is no longer "prepared in the background" — it is the only thing between here and FOL-26.** The project brief on Ship is the source of truth for steps 0–9.

What 2026-09-18 decided, and still holds: **(a) the floor is lowered for the window**, not a date-in-a-tag rule every reader carries for ever — the unpublished ones sit among 657 messages with true dates, so a tag would have every consumer sorting by it. **The keys are exported** (Miky's and Katerina's, by Miky, into a file the repo ignores before it exists). **The FOL-25 copies are re-done under the same mechanism** — nothing obsolete stays.

**Four decisions of 2026-09-22 (Miky), which change what gets built:**

1. **A migrated message lands as `kind:1111` on the topic's `30840` file**, not as `kind:9` in its old channel — the shape FOL-14, FOL-25's `remigrate` and FOL-37 already established. 141 of the 185 have a file waiting. **This removes the un-delete from the critical path**: a `1111` carries `h = <team channel>`, so republishing into a hidden channel is impossible by construction.
2. **The 507 are addressed, not ignored** — see CON-12 below.
3. **No freeze.** CON-1 stays a request; idempotence and a census before and after carry it. The accepted cost is that content can be destroyed before migration, and has been.
4. **"For testing" is discarded** — 6 unpublished + 17 unreadable, obsolete content, and the last reason to touch the box for an un-delete.

**The agent's ceiling moved and this document was the last to know.** Read directly on 2026-09-22 against `id.estiva.app/sign`, nothing published: `9`, `1111`, `30840`, `9008`, `5`, `1852` all answer **200**; `1` and `24242` answer **422**. Only blob authorization is still withheld. Every earlier line here claiming the agent lacks `30840`, `1852` or `9008` was stale — read the ceiling, never recall it.

**The census is a live reading, not a constant** (CON-3, peek#260). 202 of 807 when the project opened; **184 of 837** on 2026-09-18; **202 of 842** on 2026-09-22 (185 never published + 17 recorded-but-unreadable). It moves in both directions and one new unpublished row appeared on 2026-09-21. Publication is not what moves it — `MAX_DRIFT_MS` is 15 minutes (`convex/nostr/refs.ts`), so a row that was null at a census can never become published later; rows *leave* Convex. Re-read the count before sizing anything against it.

**And attachments are being destroyed.** 70 → **68**, `imeta`-carrying 8 → **6**, between 2026-09-17 and 2026-09-22. Two are gone, unmigrated, and nothing reported it — the census counts what is still there, so a row that leaves between runs reads as progress. The bytes in Convex `_storage` are the only irreplaceable thing in the programme, and with no freeze the **snapshot (CON-10) moved to step 0**.

**The discriminator is the `orig` tag, and the retraction set is 134.** The Folders row above already corrects the 549 — it is what `migrate` attempted, not what stands on the relay — and this is the same 134 read from the other side: `probe-con3-discriminator.ts`, re-run 2026-09-22: 134 events carry `orig` (all `kind:1111`, 129 author-signed, 5 agent-signed, **0 carrying an `imeta`**, late by 1–28 days); **501 carry `ts` without `orig`** — Ship's comments — so a `ts` rule would retract 501 correct events and miss every copy. Bucket 1 is 640 with a measured date drift of max 0.997 s; bucket 3 is 17, all behind one channel (`3789d2ca`, *For testing*), which settles CON-4's open question.

**CON-12, filed 2026-09-22 — the risk the plan did not contain.** `probe-con16-channel-vs-file.ts` asked what stops being readable when the old channels go: **507 published messages are readable only under a topic channel.** They score 0 on the census, correctly — they are on the relay — but FOL-26 retires their only reader. *"Census reads 0" was satisfiable while 507 messages went dark.* Split: **26 partials** (a file exists, the conversation grew after FOL-25 copied it) which ride along with the migration, and **481** in the nine project-record channels, which stay — so the question there is whether they *render* in the Ship project's conversation, and that is a signed-in click no agent can make. CON-7's done-when now refuses to close until this probe reads 0.

| who | what |
| --- | --- |
| **Miky** | **the two env vars (CON-2 / `7ffbaddd`) — still unread four days on, and now the only thing standing between the plan and its execution.** The agent tried: `/health` says `ok`, NIP-11 says nothing, the Helm chart proves only that the variable is optional, and the `ssh … grep /opt/buzz/.env` was refused by the auto-mode classifier (*Production Reads*). A read-only Bash rule for the box is being granted; meanwhile Miky runs the grep. Also: the key export; a `kind:24242` grant for the blob re-upload, or running `0bd35bc1` by hand; and **one signed-in click** on a project-record channel's conversation for CON-12's 481 |
| **agent, now** | the snapshot (CON-10 / `05c2773d`) **first** — content is being destroyed; the buzz PR making `CREATED_AT_FLOOR_SECS` env-overridable with the default unchanged (`nfb-demo-kinds`, deploy gated on CON-2); CON-4's one missing `30840`; CON-7's guard (`706eb704`); the migrate, copy and retract scripts |
| **then** | SHR-8 migrates 145 as `1111` on files → CON-12 copies the 26 partials → census verifies → CON-6 (`a61e921f`) retracts **the 134** → **B6: CON-7 census 0 *and* CON-12's probe 0** → CON-8 (`19ae5b48`) Peek stops writing messages to Convex → CON-9 (`209fa791`) counts the DM side with a signed-in token (peek#258's mechanism) → DMS-7 decides it |

### C — Remove Convex

A new project (2026-09-18, `e6aefcdc`) for what *Shrinking Convex* excluded and the migration does not cover: the residue and the deletion. Its brief maps all fifteen tables to their relay homes. Three small decisions first (rename history — Buzz applies a name change silently; `isExternal`/`role`; the one huddle), then the per-person blobs (screener snooze/dismissal; CRO-10 re-scoped to *drop the read-state cache*), then the two relay reads (my DM channels; the People directory from the roster), then — after B6 — FOL-25 delete mode, FOL-23, the dead tables, `convex/` gone, the deployment deleted behind a snapshot. **Huddles** are out of scope by their own placeholder project (`cec874b6`): the feature may be removed to get there, its one huddle exported first.

**Deferred past all of it, and why.** Labels (FOL-5/FOL-6) — the grant costs nothing, the UI is real with 62 Folders on production, but nothing waits on it. Private folders (FOL-10) — nothing on production is private. PRO-18 → INT-9 — once containers are stable. FOL-4 — breadcrumbs and a generic parent declaration, after the tree is the only navigation. COM-2 — nothing waits on it. FOL-7, FOL-8 — placeholders.

### Blocked, and worth knowing why

- **FOL-26 and everything behind it** (FOL-25 delete mode, FOL-23, C's deletions) — the Topics view is the only reader of 202 messages, 62 attachments and CON-12's 507. Until the census reads 0 (B6) retiring it loses content silently; that is the shape PEE-30 already produced once.
- **The migration's execution** — from a person: **the env-var read** (the gate), the key export, a `24242` grant or a hand-run of the blob script, and one signed-in click for CON-12's 481. The un-delete is no longer on the list. The agent's ceiling now covers `30840`, `1852`, `9008` and `5`; only `24242` is withheld.
- **INT-9's remaining half** — PRO-18's container emit. Waits on its turn and nothing else.

## What blocks what

Live dependencies only. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| **FOL-26** (retire the Topics view) | **CON-7** census 0 **and CON-12's probe 0** — Topics-parity is spent | A message sent in the Topics view after its channel is re-deleted lands in Convex with a null `nostrEventId` and reaches nobody; 202 messages are readable nowhere else today; and **507 more are readable only in the view being retired** |
| **FOL-25** delete mode, **FOL-23** | **FOL-26** | The 9 restored channels stay until nothing can write into them |
| **CON-8** stop writing to Convex | **CON-7** | Convex is not touched until the census reads 0, twice — before and after |
| **everything in B** | **CON-2** — two env vars, still unread | The floor comes down through ingest or it does not come down at all; the branch decides the mechanism, and the mechanism decides the scripts |
| Migrate (**SHR-8**) | **CON-2** · ~~CON-4 un-delete~~ · **CON-5** re-upload 62 blobs · key export | Publish before deleting; the attachment bytes are in Convex `_storage`, and deleting Convex destroys them. **The un-delete dropped out on 2026-09-22** — a `1111` on a file carries `h = <team channel>`, so a hidden topic channel cannot swallow the copy |
| **CON-12**'s 481 | one signed-in click | Whether a project-record channel's `kind:9` history renders in the Ship project's conversation cannot be read by any agent |
| ~~**CON-11**~~ → **CON-14** (a kind:9's `a` in Peek) | *(nothing)* | CON-11 shipped in peek#272. CON-13 wrote the per-tag rule (SPEC §6.4) and Ship reads it; Peek still draws a topic message naming a Ship issue as a comment on the issue's page, and its mentions read is 1111-only |
| **CON-5** (extract the package) | **FOL-31**, and the `@estiva-app/ui` gates reaching the conversation components | Extracting the read-only foreign view would produce a package shaped like today's file page and then change it; extracting before the gates ships the old primitives on day one |
| **FOL-30** (following) | *(nothing)* | Its one open question — do stars become follows — is answered on the ticket, not by anyone else |
| **INT-9**'s remaining half | **PRO-18**'s container half | An action still cannot create a container |
| **Leaf starting** | *(nothing)* | Unblocked; files nesting is what makes it cheap |

**Two constraints every migration step runs into**, settled rather than chosen:

- **A republished message carries today's `created_at`.** Buzz floors `created_at` at 960 s for anything with an `h` (`CREATED_AT_FLOOR_SECS`, a `pub const` in `replica_fence.rs`, part of the replica-read correctness proof), and the ingest drift check (`BUZZ_MAX_TIMESTAMP_DRIFT_SECS`, default 900) refuses first with a `400`. Widening only the env var moves the failure. **Decided 2026-09-18: the floor is lowered for the window** (a buzz PR makes the constant env-overridable, default unchanged), *provided* production serves no reads from a replica — the floor is part of that proof and guards nothing otherwise. That is what CON-2 reads, and it gates the PR's deploy. A date-in-a-tag rule was rejected: the unpublished messages sit between 653 with true dates, so every reader would carry the sort rule for ever.
- **An event's author is its signature.** A re-post signed by the agent is the agent's message. FOL-25's copies were re-signed with their authors' keys (peek#223); the 202 must be too, which is why the key export gates the migration and the retraction alike — only the author or the channel owner may send a `kind:5`/`9008`.

## Decisions that gate work

Open decisions only. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| **Accept or amend RFC 0.6** | COM-1 | **Open, with a window** — Ship began producing `attachment` blocks on 2026-09-10 and §3 fixes their shape; production held zero when written, so disagreeing was free then and gets expensive as people attach files. No new kind, no Buzz change, nothing to migrate |
| **What happens to Convex-only DMs** | DMS-7 | Republished history cannot carry original timestamps (above). Now in the migration project |
| **What the product says about DM privacy** | *(no ticket)* | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
| **Disclosure copy** | RFC 0.4 §12.6 | Granting access discloses all history, and *listing* a team discloses its roster — "who is on this team" is org structure |
| **Do the 481 render?** | CON-12 | Nine channels double as Ship project record Folders and hold 481 `kind:9` messages with no file copy. Whether a person opening that project's conversation in Peek sees them is one signed-in click, and it decides whether CON-12 is 26 messages of work or 507 |
| **Rename history, `isExternal`/`role`, the one huddle** | *Remove Convex* | Three small decisions that gate nothing else, so they go first |

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
- **Seven topic channels that answer nothing.** SHR-5's fold found 7 of the 26 topic channels return no messages and no `kind:39000`, while the other 19 have theirs — a channel absent or unreadable, not content unmigrated, and publishing into it will not fix it. PEE-30's soft-deleted channels are the first thing to rule out; needs a signed-in person or the box (CON-4).
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. Every team's topics now share that team's channel, so production is becoming the test.
