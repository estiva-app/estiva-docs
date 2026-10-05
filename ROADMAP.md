# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-10-03. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Pruned 2026-10-01** by the sweep: the Folders work and phase A are done and collapsed, every project row says what is left, and each in-progress project now sequences its own milestones in its Ship description. **Pruned 2026-09-18.** The sequence of 2026-09-11 is spent. Everything that was struck through, every finished milestone's narrative and every resolved dependency came out; what each one taught stayed, in [§Finished](#finished--and-what-each-one-taught). The previous version is in git if a citation is needed.

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

The active projects and what each is *for*. **Counts are deliberately not here** — `ship issues --project "…"` is the only place they can be right (OTH-4). Refs collide across projects (SHI-4) — CON-5, FOL-5, FOL-7, FOL-8, PEE-26, PEE-33 and PER-24 each name two issues — so address issues by short id.

| project | what it is |
| --- | --- |
| **Conversation standard** | Comments the third app adopts rather than rebuilds. Every affordance is in both apps. **CON-5 shipped 2026-09-30:** the SPEC §6 rules live in `@estiva-app/conversation` (0.1.0, estiva-foundation#92; 0.2.0, #97, 2026-10-01), and Peek (peek#406), Ship and the agent (estiva-agent#65) read conversations through it. Also shipped: **PEE-44** (a comment arriving while a file is open no longer stays unread, 2026-10-01; its DM half on 2026-10-03, peek#428: a message arriving while a DM is open counts as read, and a reply newer than the conversation's latest message stays unread, with "1 new" on its thread, until the thread is opened; older replies wait for the thread rule), **PEE-38** (an edit lands only on its first 64-hex `e`, interop 0.34.0; buzz refuses an edit naming more than one, CON-21) and **CON-20** (131 comment-shaped `kind:9` republished as `1111`; Ship's reply writes a `1111`, SHI-28), **CON-19** (membership and read state in the package, SPEC §11.8, 2026-10-01), **CON-23** (read state is private to its author, buzz#24, 2026-10-01) and **CON-17** (an urgent mention is `["urgent", <pubkey>]` beside its `p`, SPEC §13.1, estiva-docs#215 and peek#420, 2026-10-02). Also shipped 2026-10-05: Folder rows in Peek carry no dot, only their files do, and the Unread filter no longer counts a Folder's own messages (`9fb8e2d7`, peek#429; SPEC §11.3/§11.5/§11.8, estiva-docs#232). Next (Miky, 2026-10-03): the **thread rule** (`5163f2ac`, a reply is read only by opening its thread, from a cut-over date — a SPEC §11.3 change); then the **read/unread QA round** (`6d0c18bd`). Left, in no decided order: **CON-24** (`e3632704`, an urgent mention looks urgent after it is sent); **CON-26** (`3e6397f6`, `@`, `!@`, `[` and `/` from the shared packages in every app; slice 1, **CON-27**, shipped 2026-10-02: Peek takes them from `@estiva-app/conversation` 0.3.0 and `@estiva-app/ui` 0.52.0 with no visible change (and a pasted chip no longer sends `@null`), estiva-foundation#101, estiva-ui#138, peek#421; slice 2, **CON-25**, shipped 2026-10-02: Ship's message box takes them, `/` has Format then Insert, Ship writes the `p`/`urgent`/`a`/`q` a body earns, and a `[` reference carries a `q` in both apps (SPEC §13.1, conversation 0.4.0), estiva-foundation#102, estiva-docs#223, ship#236, ship#237, peek#423; next are PEE-21 (`[` ranking) and Peek's own rows under Insert (`f8f6ae28`, with Katerina's review)); **CON-18** (`02dd1894`, where the drop-in views live); **CON-6** (`13ce66c1`, the guide, timed on Leaf) |
| **Shared foundation packages** | The packages a third app installs: `@estiva-app/protocol` 0.26.2, `interop` 0.48.0, `conversation` 0.5.1, `ui` 0.53.1, `platform` 0.4.0, `identity` 0.2.2. Shipped 2026-10-05: **SHA-28** (an assignment or lead made from Peek counts for the person: a `pubkey` input writes `["p", key]`, SPEC §7.3 — estiva-foundation#107, estiva-docs#233, peek#431, checked as QA-1/QA-2; the agent's leg is `4ca69c17`). Open: SHA-2 (a PWA layer in `platform`), SHA-23 (the interop README never explains the signer or relay membership) |
| **Manifests: every app declares its actions** | `f80c46dd`, Estiva HQ. Every app declares in its `kind:31990` every action another app may take, and reads other apps' objects only through manifests. Shipped 2026-09-29/30: **MAN-1** (a move field, a placement plus Folder listing and a prose format — SPEC §7, estiva-docs#181, interop 0.36.0 / protocol 0.24.0; Ship's `add-issue` takes a block document, ship#209, peek#389), **MAN-4** (Ship declares move-issue, add-/delete-project and describe-*, ship#211; Peek builds `listed` actions, peek#392), **MAN-7** (a card's children fold, interop 0.38.0), **MAN-8** (an object offers the creations other apps declare on its kind, interop 0.40.0; New project on a Folder from Peek's launcher, peek#402, checked as QA-1) and **MAN-9** (the block editor kit moved into protocol 0.26.0 and ui 0.48.0; Peek edits a Ship description from its card and on the issue page). 2026-10-01: **MAN-10** (Enter at the start of an anchored block keeps its id on the text, ui 0.50.1 / protocol 0.26.1) and **MAN-11** (a pasted or `/`-menu block gets its id as it arrives, so a blur with no edit writes nothing — ui 0.50.2, estiva-ui#134, ship#225, peek#416, checked as QA-1). 2026-10-02: **MAN-12** (a paragraph turned into a quote or a list keeps its id on the quote or list item, from the `/` menu and the typed shortcuts — ui 0.50.4, estiva-ui#135 and #136, ship#228, peek#418, checked as QA-1), **MAN-5** (Ship's obsolete `folder` field and `link-project` are gone; a project's thread is its own by anchor, whatever Folder it sits in, and new work goes to the Folder that lists it — ship#230, estiva-agent#67, checked as QA-1; 50 of 56 old events deleted, the 6 author-signed ones are MAN-14), **PER-21** (the agent reads and writes Ship through Ship's manifest and interop, with no copy of Ship's code; a renamed issue's title now folds for every manifest reader, and a same-millisecond tie goes to the higher id everywhere — ship#231, estiva-foundation#100 / interop 0.45.0, estiva-agent#68, estiva-docs#220; Peek checked as QA-1, every agent write checked on production), and **SHI-27** (`npm run manifest` deletes the Folder it makes for its test project, and the 26 empty `team-…`/`project-…` Folders earlier runs left are gone — ship#235; a real republish read 47 Folders before and after). Left: MAN-14 (`ddedc05f`, the 6 old Folder-pointer events Miky or Katerina signed, which need their keys), **MAN-3** (Folders protocol-level, one name: *Folder*), MAN-6, MAN-13 (indenting a list item with Tab loses its text on save; editor-or-protocol choice is Miky's), MAN-15 (`34a8252c`, a run that crashes midway still leaves its fixtures), and SHA-18. PRO-25 and PRO-26 moved to *Workspace apps* on 2026-10-03 |
| **Intelligence / Launcher** | Cmd+K. Built and deployed; Create project shipped with MAN-8 (peek#402). Left: **INT-12** (`2a5bee21`, Peek declares `create-topic`), PEE-15 (the picker shows stale project names), PEE-21 (`[` references Ship issues, projects and files) |
| **Projection layer** | Render and act on another app's objects. Mostly built; ~~PRO-18~~ closed 2026-09-30 (`emits.listed`, MAN-1). ~~PRO-22~~ closed 2026-10-01 (ship#226: Ship hands off `/topic/` links on the same path on the owner's host, Folder page under `/app/`, manifest collision check; verified as QA-1 on production). ~~PRO-24~~ closed 2026-10-02 (another app's object is labelled by its type: interop 0.44.0 `fileNoun`, SPEC §7.8, peek#419, ship#229; verified as QA-1 on production). Left: PEE-2 (widget layouts); ~~PEE-33~~ (`aad54d76`) cancelled. PRO-23 moved to *Workspace apps* on 2026-10-03 |
| **Workspace apps: the organisation decides which app owns which files** | `39395f98`, shaped 2026-10-03 from PRO-23, PRO-25, PRO-26 and SHA-29. A workspace's stewards add each app's key to the roster with a new role `app`. The relay accepts a `kind:31990` only from those keys and keeps a file's `d` unique across file kinds and authors. Interop reads only allowed manifests and fails closed to the plain type. Milestones: 1, a stranger's manifest or lookalike file changes nothing (the `app` role first, because Ship's and Peek's manifest keys are not on the roster today); 2, https-only link templates (PRO-26); 3, one reading of type words (SHA-29); 4, an Estiva ID screen for stewards |
| **Rich text and blocks** | Thin on purpose. Left: RIC-17 (Ship's composer gets Peek's paste rule; its pickers came with CON-25), RIC-15 (History prints a description edit as raw blocks) |
| **Composition** | A document that points at live content. [RFC 0.6](protocol/RFC-0.6-COMPOSITION.md), gated on COM-1. Also COM-2 (one live block in a conversation), COM-3 (retire `30841`), COM-4 (the SPEC's remaining attachment rules) |
| **Folder & Other Conversation Improvements** | What is left around Folders and DMs, none of it scheduled: labels (FOL-6), private Folders (FOL-10), a Folder's general `kind:9` chat as a tree row (FOL-35, deferred by Miky 2026-09-19), Folder mentions (FOL-7, placeholder), one repo per Folder (FOL-8, placeholder), group DMs (DMS-9, DMS-10), labelled links drawn in Ship (PEE-25), a pasted URL resolving as you paste (PEE-3) |
| **Performance & infrastructure** | 22 of 24 done and one cancelled; what each taught is in its ticket and PR. Open: **PER-25** (`12039e44`, a file conversation reads its replies twice). Complete the project when PER-25 lands or moves |
| **UI Guardrails** | Katerina's `@estiva-app/ui` gates. **UIG-26 closed the project's done-when on 2026-09-30** (estiva-ui `docs/GATES.md`). The seven tickets she moved to a next phase (UIG-34, 39, 41, 43, 45, 46, 47) still sit here, waiting for that phase's project |
| **Highlights on the relay** | HIG-1, research. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only. Convex is gone, so there is nothing to migrate |
| **Huddles** | Placeholder (`cec874b6`). **Disabled 2026-09-23** (peek#309, CON-8): existing huddles stay readable behind a paused banner, and none can be started or replied to. The rebuild is HUD-1 (`a7a301a9`), not scheduled. Whether the one old huddle held messages is disputed (HUD-1 says yes, this document said no) — check the Convex backup before relying on either |
| **docs.estiva.app: learn and build on Nostr for Business** | `a3f2c248`, shaped 2–3 Oct: the site rebuilt for a SaaS builder and a grant reviewer, in four milestones, behind the password until the last one. Milestone 1, *a builder can follow the docs to their own app*: the **Quickstart** (`a7a4ddbb`, estiva-docs#227), from `create-estiva-app` to a signed-in app listing a project's issues. Its exact code ran as QA-1 against production, signed in through Leaf's existing client id. Sign-in through a newly registered app is still unproven and is `c4b9fc13`'s. Access is by email to hello@estiva.app, handled by hand: an Estiva ID invite plus a `client_id` registered for `http://localhost:5173/` (Miky, 2026-10-03). `create-estiva-app` sets `strictPort`, and its tests ignore `.env.local`, from ui 0.53.1 (estiva-ui#142). Next: `c4b9fc13` (a fresh agent builds it from the published pages), then a page per package (`76604958`). Milestones 2–4 (a true Specification, Overview and Capabilities, going public) are untouched |
| **Peek: Improvements**, **Peek: Feedback & Bugs**, **Ship: Feedback & Bugs**, **Agent: Feedback & Improvements** | the bug lists |

**Completed** — *Folders: navigation for the whole suite* (37 issues, archived) and *Folders & Sidebar in Ship / Peek* (16 of 16, 2026-09-30): five top-level Folders, files that nest, the tree that replaced the Topics view, moving (FOL-45) and archiving (FOL-46) any file in both apps. Also Convex removed (REM-7/REM-8, 2026-09-25), Make Agent more token efficient (MAK-1…3), DMs on Nostr, Live delivery, Cross-app read state, Agent / Steer, Other, Catch up the Buzz fork, Rewrite Ship, Peek real-time. Their lessons are in [§Finished](#finished--and-what-each-one-taught).

**Both gates are closed.** Gate 1 (Estiva ID capabilities) 2026-08-25; Gate 2 ([ADR 0002](decisions/0002-foundation-packages.md)) 2026-08-27. Nothing in the programme is gate-blocked.

---

## What to do next

**No sequence after 2026-09-18's is decided here.** Since the sweep of 2026-10-01 each in-progress project's Ship description orders its own issues as milestones, riskiest first. The first of each:

- **Conversation standard** — milestone 1 shipped 2026-10-01 (CON-19, and CON-23: read state is private to its author, buzz#24); milestone 2 shipped 2026-10-02 (CON-17: an urgent mention reaches the relay as urgent, in DMs and file comments); CON-27 and CON-25 shipped 2026-10-02 (the composer triggers come from the shared packages in Peek, then in Ship); PEE-44's DM half shipped 2026-10-03 (peek#428); Peek's Folder rows lost their dot 2026-10-05 (`9fb8e2d7`, peek#429, SPEC §11 in estiva-docs#232); next is the thread rule (`5163f2ac`), then the read/unread QA round (`6d0c18bd`); left are CON-24, CON-26 (PEE-21 and Peek's Insert rows), CON-18 and CON-6, in no decided order.
- **Shared foundation packages** — SHA-28 shipped 2026-10-05; next is the agent's interop bump (`4ca69c17`), which also makes an assignment from the CLI count.
- **Intelligence / Launcher** — INT-12: Create topic from the launcher.
- **Projection layer** — PRO-22 shipped 2026-10-01 (ship#226); next is PEE-2, widget layouts (waits on Katerina's layout answer).
- **Workspace apps** — first: a steward can add an app to the workspace (the roster's `app` role, with Ship and Peek added).
- **Rich text and blocks** — RIC-17: Ship's composer gets Peek's pickers and paste rule.

**Phase A of 2026-09-18 — the Folders tree replaces Topics — is done**, every ticket shipped and checked on production: FOL-28 (peek#261, 26 topic channels unlisted), FOL-27 (the parity audit), FOL-31 (peek#265, a file's conversation is Peek's own view), FOL-29 (peek#282, another app's widget in the right pane), FOL-30 (peek#283–#285, following — since replaced by membership, SPEC §11.8), FOL-26 (peek#337, the Topics view retired) and FOL-25's delete mode (peek#342). The narrative is in git before 2026-10-01; the lessons are in [§Finished](#finished--and-what-each-one-taught).

**Deferred, and why.** Labels (FOL-6) — the UI is real with dozens of Folders on production, but nothing waits on it. Private Folders (FOL-10) — nothing on production is private, and Peek can only create open Folders. A Folder's general chat as a row (FOL-35) — Miky: overkill for now. COM-2 — nothing waits on it.

## What blocks what

Live dependencies only. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| **CON-6** (publish, guide, Leaf) | CON-19, CON-18's decision | Leaf exists since 2026-09-27 (UIG-11), so the third app is no longer hypothetical |
| **CON-19**'s membership for an assignment made with the agent CLI | **`4ca69c17`** | Peek's is fixed (SHA-28); the agent still runs interop 0.45, which writes no `p` |
| **Leaf starting** | *(nothing)* | Unblocked; files nesting is what makes it cheap |

## Decisions that gate work

Open decisions only. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| **Accept or amend RFC 0.6** | COM-1 | **Open, with a window** — Ship began producing `attachment` blocks on 2026-09-10 and §3 fixes their shape; production held zero when written, so disagreeing was free then and gets expensive as people attach files. No new kind, no Buzz change, nothing to migrate |
| **What the product says about DM privacy** | *(no ticket)* | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
| **Disclosure copy** | RFC 0.4 §12.6 | Granting access discloses all history, and *listing* a Folder discloses its roster — "who is in this Folder" is org structure |

### Settled, and not yet written into an RFC

**Settled 2026-09-05**, recorded here because the RFCs do not yet say so: workspace = the relay, the unit of people and permissions = a Folder (then called a "team"; one name since 2026-09-25), files nest inside, Folders never nest; a file's description is the file; nesting never grants access; labels are shared, not per-person; a Folder may point at another Folder's files, and a reference to something the reader cannot see renders as **nothing** (not "unavailable" — a deliberate divergence from NIP-MP); someone who should see one project and not the rest of its Folder gets a Folder of their own; following is a subscription, not a permission tier; open Folders have public rosters.

**Settled 2026-09-30 (Miky, CON-19):** **membership replaces following** (SPEC §11.8). A person is a member of a file they created, wrote in, were mentioned in, were placed on, or were added to, until they leave; everyone can see who the members are, and a mute stays private. A member's unread starts when they joined, and agent comments count like anyone's. This reverses FOL-30's "following replaces topic membership" in name only: the old membership granted access, and this one grants nothing.

**Settled 2026-09-11:** a topic is a **bare file** (`30840`) — not its own kind, not a Leaf document; a message in a topic is a **`kind:1111` comment** on it, and the Folder's own conversation stays `kind:9` in the channel. **Settled 2026-09-15 (Miky, FOL-25):** nothing obsolete stays on the relay — early-experiment shapes are migrated where easy and deleted otherwise, never kept beside the new shape. **Settled 2026-09-07:** the reaction horizon is 100 (SPEC §6.6). ~~**Settled 2026-09-18 (Miky):** topic membership is replaced by **following**~~ — superseded 2026-09-30 by membership (above, SPEC §11.8). What carries over: it is never a permission; everyone in a Folder can open every file in it, and the relay grants access per channel, not per file.

## Not filed, and why

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **`@onboarding-team` mentions** | the reference works today; what is missing is fanning a notification to members | nothing protocol-shaped — FOL-7 is the placeholder |
| **Association and facets** (RFC 0.5 §2, §3) | parked 2026-09-05; facets withdrawn (§10) | a panel needing §2 |
| **The upstream NIP proposal** (RFC 0.4 §10.2) | not happening — FOL-1 chose fork | kept as the list to propose if revisited |
| **The intelligence layer** — cross-app agent actions, per-app harnesses | what it protects is the *persistence*, not the reasoning; see *Highlights on the relay* | the first time a second app's harness needs another app's memories |
| **Composition beyond the pointer** (RFC 0.6 §6, §7) | draft RFC, rule 2. Transcluding *one* block is buildable today (COM-2) | COM-1 |

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
