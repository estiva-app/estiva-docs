# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-10-08. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Pruned 2026-10-08** by the sweep, under the size rule of 2026-10-07: the project table lists only live projects with their Goal, Conversation standard and Manifests are completed, the large projects are split into stages, and the long per-project shipping narratives came out (they are in git and in each ticket). **Pruned 2026-10-01** by the sweep: the Folders work and phase A are done and collapsed, every project row says what is left, and each in-progress project now sequences its own milestones in its Ship description. **Pruned 2026-09-18.** The sequence of 2026-09-11 is spent. Everything that was struck through, every finished milestone's narrative and every resolved dependency came out; what each one taught stayed, in [§Finished](#finished--and-what-each-one-taught). The previous version is in git if a citation is needed.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

**The shape, agreed 2026-09-05 and now built.** Four levels:

| level | what it is | on production |
| --- | --- | --- |
| **Workspace** | the relay — one per company | yes, unnamed as such |
| **Folder** | people, permissions, one conversation space — a NIP-29 group with a relay-signed listing (SPEC §3). **Folders never nest** (Miky, 2026-10-02, MAN-3) | **six since 2026-09-29**: Estiva HQ, Peek, Ship, Leaf, Steer, and QA. `kind:1852` in, relay-signed `kind:30890` out; every Ship project is *listed* in its Folder, every topic is placed in one. One Folder is still listed inside HQ (`85db5b59`), to be unwound. Private folders deliberately not yet (FOL-10) |
| **File** | anything addressable — project, issue, document, topic. **Files nest inside files** | yes; a topic is a **bare file** (`kind:30840`, RFC 0.5 §10.7, SPEC §6.7) and its conversation is `kind:1111` comments on its address. Nesting shipped with **FOL-4** (2026-09-23; foundation#75, peek#315/#328, ship#173, SPEC §6.7): a bare file names its parent, moves by a `parent` change, and both apps draw the nesting from the Folder's listing — breadcrumbs, the deep tree, Related at depth |
| **Block** | an addressable paragraph inside a file | shipped |

A file's **description is the file**, not a document beneath it. Nesting **organises and never grants access**: everything in a Folder is visible to that Folder's members.

**Two kinds of app** ([RFC 0.5 §10.7](protocol/RFC-0.5-ASSOCIATION.md), decided 2026-09-11). A **specialized** app owns kinds and its navigation lists only its own files — Ship lists projects and issues. A **generic** app owns no kinds and renders *one aspect of every file* — Peek the conversation, Leaf the document. **Navigation is by kind; nesting is by intent.** A subject no specialized app claims is a bare file, which the generic apps handle completely.

---

## How this document is meant to be used

1. **Aim for high-level architectural clarity.** Know the shape before building the parts. [ADR 0001](decisions/0001-relay-canonical-by-default.md) and [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) exist for that.

2. **Do not force a decision that does not need making yet.** Name it, name the *latest responsible moment*, and move on. A deferred decision with a trigger is a plan; a guessed decision is debt with interest. **Work that needs a deliberately deferred decision gets no implementation tickets — but it does get a placeholder** (amended 2026-09-04), carrying the open options, what has been measured, and what would decide it, so somebody reading Ship alone knows the work exists.

3. **Learn as you go, and fold what you learn back into the architecture.** Every substantial finding in this programme came from having built the previous piece, not from planning harder. The first thing to do when a project finishes is say what it taught — [§Finished](#finished--and-what-each-one-taught).

4. **Check the merge log before sequencing anything.** This document has lagged production three times (FOL-2, PRO-18, FOL-2 again); each time an agent would have re-blocked on work that was already deployed. Read each repo's merges since *Last updated* — buzz on `nfb-demo-kinds`, not `main` — and close the marker in the same turn the work lands.

---

## Where things stand

The live projects after the sweep of 2026-10-08, which applied the size rule of 2026-10-07: a project is about 1–2 weeks, at most ~8 issues, with a one-line Goal and a Done when; anything that does not block that Goal is a line in the project's **Later** list, not an issue. **Counts are deliberately not here** — `ship issues --project "…"` is the only place they can be right (OTH-4). Refs collide across projects (SHI-4, the open blocker in *Ship: Feedback & Bugs*), so address issues by short id.

| project | Goal | first open work |
| --- | --- | --- |
| **Optimistic updates & caching for Peek** (`c6b4bb0b`) | *no Goal line yet* | OPT-8 (a reaction, edit or delete shows at once and is undone, with a note, if refused); milestone 1, OPT-6 (a message shows as you press Enter) and OPT-7 (a send that fails says so and its text comes back) are done |
| **Read / unread** (`f74534fe`) | Unread shows what is new for you, and what you have read stays read | REA-4 (Unread filter and Ship issues), REA-5 (cold load), SHI-47 (indicators blink) |
| **People at the protocol level** (`c3636093`) | anyone's name in Ship, an agent's included, opens a page of what they are assigned | MAN-16 (a person in the SPEC), then the shared resolver |
| **People in Peek: open and paste a person's link** (`852c45c0`) | a person's link opens them in Peek, and pasting it mentions them | after People's stage 1 |
| **docs.estiva.app 1: the Specification says what runs** (`a3f2c248`) | a builder looks a rule up in the Specification and it is true on production | SHA-29, DOC-3, DOC-6, DOC-7, DOC-8, DOC-4 |
| **docs.estiva.app 2: a grant reviewer sees what it can do** (`4d513dea`) | a grant reviewer, with no password, sees what Nostr for Business can do and why | Overview (DOC-9) and Capabilities (DOC-10), then public (DOC-13), after stage 1 (order decided by Miky 2026-10-08: Spec → Grant → Builder) |
| **docs.estiva.app 3: a builder follows the docs to their own app** (`f9afdc6a`) | a builder who has never seen our code gets from the Quickstart to their own signed-in app using only the published pages | SHA-23, DOC-12; the Quickstart (DOC-1) shipped. The fresh-agent build is the Done when itself (it was referred to as `c4b9fc13`, which was never filed). Access is by email to hello@estiva.app, handled by hand: an Estiva ID invite plus a `client_id` for `http://localhost:5173/` (Miky, 2026-10-03) |
| **Folders are one level** (`bd46229d`) | no Folder is listed inside another, and a Folder you made by mistake can be deleted | MAN-18, MAN-21 |
| **Workspace apps** (`39395f98`) | a manifest or lookalike file from a key the workspace did not add changes nothing a member sees | the roster's `app` role, with Ship and Peek added |
| **Rich text and blocks** (`254a0dee`) | a description written in Ship keeps every block you write: a checklist, a nested list, a callout or an agent's table | MAN-13 (Tab loses text, data loss), RIC-20 (agent tables), RIC-19 |
| **Intelligence / Launcher** (`a39cafac`) | create a topic from Peek's launcher, filed in the Folder you choose | INT-12 |
| **Widgets** (`4fdb6017`) | a link to an issue, project, topic or person draws as an inline chip by default, with an optional attachment underneath | PEE-3 (a URL resolves as you paste) |
| **Composition** (`fa6af533`) | *no Goal line yet* | COM-2 (peek#457 awaits Katerina) |
| **UI Guardrails** (`24684889`) | *no Goal line yet*; its done-when closed 2026-09-30 (UIG-26) | seven next-phase tickets; whether to close it is Katerina's call |
| **Catch up the Buzz fork** (`5b2701f3`) | *no Goal line yet* | CAT-12, on the next upstream merge |
| **Peek / Ship: Feedback & Bugs**, **Agent: Feedback & Improvements** | *intake, no Goal*: a blocker is fixed from there, the rest is a Later line | SHI-4 (refs collide); `9142ac3b` (`edit-issue` flattens a Ship-editor description) |

Parked, with their ideas in their descriptions: *Private folders / topic / files* (FOL-10, FOL-44, MAN-20), *Transforming file types*, *Navigation & structure in Nostr for Business* (`0527cd72`, no issues yet), *Huddles* and *Highlights on the relay* (archived). Peek's highlights stay an experiment and must not be published to `kind:9802` while the model is unsettled: 9802 is append-only.

**Completed** — 2026-10-08: *Conversation standard* (reactions, edit and delete, formatting, the shared @ [ / lists, membership and unread, urgent mentions in Peek and Ship; a third app's comments guide, CON-6, was cancelled), *Manifests* (PER-21: the agent works through Ship's manifest alone), *Folder & Other Conversation Improvements*, *Peek: Improvements* and *Leaf Setup*. Archived earlier: *Folders: navigation for the whole suite* and *Folders & Sidebar in Ship / Peek* (2026-09-30), Performance & infrastructure (its last open issue, PER-25, is a Later line of Conversation standard), Shared foundation packages, Projection layer, Convex removed (REM-7/REM-8, 2026-09-25), Make Agent more token efficient (MAK-1…3), DMs on Nostr, Live delivery, Cross-app read state, Agent / Steer, Other, Rewrite Ship, Peek real-time. Their lessons are in [§Finished](#finished--and-what-each-one-taught).

**Both gates are closed.** Gate 1 (Estiva ID capabilities) 2026-08-25; Gate 2 ([ADR 0002](decisions/0002-foundation-packages.md)) 2026-08-27. Nothing in the programme is gate-blocked.

---

## What to do next

**Miky picks the next project.** Each project's Ship description orders its own issues as milestones, riskiest first; when its Done when holds it is marked Completed and archived, and Miky chooses the next one. No sequence across projects is decided here.

**Phase A of 2026-09-18 — the Folders tree replaces Topics — is done**; the narrative is in git before 2026-10-01 and the lessons are in [§Finished](#finished--and-what-each-one-taught).

## What blocks what

Live dependencies only. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| **People in Peek**: opening a link (PEO-8) and paste-to-mention (PEO-2) | People's stage 1 (the shared person-link resolver, PEO-3) | Peek's /person route and paste-to-mention read the same resolver |
| **docs.estiva.app 2** going public (DOC-13) | docs.estiva.app 1 | a public site must not carry a Specification that is untrue |
| **Leaf starting** | *(nothing)* | Unblocked; files nesting is what makes it cheap |

## Decisions that gate work

Open decisions only. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| **What the product says about DM privacy** | *(no ticket)* | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
| **Disclosure copy** | RFC 0.4 §12.6 | Granting access discloses all history, and *listing* a Folder discloses its roster — "who is in this Folder" is org structure |

### Settled, and not yet written into an RFC

**Settled 2026-09-05**, recorded here because the RFCs do not yet say so: workspace = the relay, the unit of people and permissions = a Folder (then called a "team"; one name since 2026-09-25), files nest inside, Folders never nest; a file's description is the file; nesting never grants access; labels are shared, not per-person; a Folder may point at another Folder's files, and a reference to something the reader cannot see renders as **nothing** (not "unavailable" — a deliberate divergence from NIP-MP); someone who should see one project and not the rest of its Folder gets a Folder of their own; following is a subscription, not a permission tier; open Folders have public rosters.

**Settled 2026-09-30 (Miky, CON-19):** **membership replaces following** (SPEC §11.8). A person is a member of a file they created, wrote in, were mentioned in, were placed on, or were added to, until they leave; everyone can see who the members are, and a mute stays private. A member's unread starts when they joined, and agent comments count like anyone's. This reverses FOL-30's "following replaces topic membership" in name only: the old membership granted access, and this one grants nothing.

**Settled 2026-09-11:** a topic is a **bare file** (`30840`) — not its own kind, not a Leaf document; a message in a topic is a **`kind:1111` comment** on it, and the Folder's own conversation stays `kind:9` in the channel. **Settled 2026-09-15 (Miky, FOL-25):** nothing obsolete stays on the relay — early-experiment shapes are migrated where easy and deleted otherwise, never kept beside the new shape. **Settled 2026-09-07:** the reaction horizon is 100 (SPEC §6.6). ~~**Settled 2026-09-18 (Miky):** topic membership is replaced by **following**~~ — superseded 2026-09-30 by membership (above, SPEC §11.8). What carries over: it is never a permission; everyone in a Folder can open every file in it, and the relay grants access per channel, not per file.

## Not filed, and why

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **`@onboarding-team` mentions** | the reference works today; what is missing is fanning a notification to members | nothing protocol-shaped — a Later line of *Folder & Other Conversation Improvements*, archived (was FOL-7; `ship projects --archived`) |
| **Association and facets** (RFC 0.5 §2, §3) | parked 2026-09-05; facets withdrawn (§10) | a panel needing §2 |
| **The upstream NIP proposal** (RFC 0.4 §10.2) | not happening — FOL-1 chose fork | kept as the list to propose if revisited |
| **The intelligence layer** — cross-app agent actions, per-app harnesses | what it protects is the *persistence*, not the reasoning; see *Highlights on the relay* | the first time a second app's harness needs another app's memories |
| **Composition beyond the pointer** (RFC 0.6 §6, §7) | RFCs are retired (COM-1 cancelled 2026-10-06); transcluding *one* block is COM-2, whose rules enter the SPEC when it ships | COM-2 shipping, then a real need for more |

## Finished — and what each one taught

Rule 3 is why these survive the pruning: the lesson, not the history.

| shipped | what it taught |
| --- | --- |
| **Folders replaces Topics** — phase A, FOL-25…FOL-31, peek#261–#342; the Folders projects, completed 2026-09-30 | **A premise that a step needs a person goes stale** — FOL-28's `1852` was in the agent's ceiling all along. **A primary navigation target needs a one-click open and a selected state**: FOL-21's tree was reverted the day it shipped (peek#215). **A dot that listens to the wrong event waits for a refresh** (FOL-40) — verify a live path from a second identity |
| **Performance & infrastructure** — PER-6, 7, 14, 15, 16, 19, 22, 23 (2026-09-23…25) | **Measure the step, not the run**: CI fell from ~425 s to ~215 s (Peek) and ~135 s to ~60 s (Ship) by parallelising typecheck and shards, caching `node_modules` per lockfile and Node version, and running `.test.ts` under node. **A refresh timer per interval, not per consumer** (PER-6: one page read every ~3 s). **A bundle can carry a dependency twice** without anything failing (PER-19, protocol's NIP-19). And **signed-in checks no longer need a person**: the agent holds a session (PER-22) and `scripts/probe.mjs` runs production Peek as QA-1/QA-2 (PER-23) |
| **Convex removed** (REM-7/REM-8, 2026-09-25) | **Take the snapshot first** when content can be destroyed, and **prove a deletion against a control**. A census is only as good as its reader, and a census of 0 can be satisfied while content goes dark: before a retirement, ask what stops being readable, not only what is unpublished |
| **DMs on Nostr** — 2026-09-17/18, ten tickets, peek#240–#258, protocol 0.21/0.22 | **The bridge client discarded the relay's answer.** `parsePublishResponse` kept `message` only on the refusal branch, so a command kind's payload — the DM channel uuid — never reached a caller; the first ticket of the Peek track was a foundation publish. **A replay returns no uuid** (`duplicate: already processed`) — two tabs opening one DM in the same second hit it. **A DM uuid is minted, not derived.** And **verify as a participant, not as the agent**: the DMS-5 live check had to be redone twice (peek#253, #254) — first it published as the agent, then it read one capped page and hid the quiet channels. Every DM channel is private, which finally measured the access filter: 0 events to a non-member on the same filter, same run |
| **The topic migration** — FOL-25, peek#220–#226 | **A `9008` hides everything under the `h`, Ship issues included**; the delete run took the `Folders` Folder and FOL-1…24 with it, and Miky un-deleted it on the box. Since buzz#16 (FOL-11, verified deployed 2026-09-29) the relay takes a `9008` from the channel owner or a steward and refuses one at a Folder holding a file, and since peek#388 (FOL-9) Peek offers Delete only on a Folder with no state and nothing filed in it. **A Folder with state lists only its state** — filing by `h` never updates the 30890, so the first `1852` on a Folder must carry everything. **A verify that compares against what migrate read cannot see what migrate never read**; the messages it missed were found by a person looking at a file. **A `9008` in a channel's history is not a test for whether it is hidden** — nine channels carry one and read fine; only a read answers it (CON-4) |
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
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. Every Folder's topics now share that Folder's channel, so production is becoming the test.
