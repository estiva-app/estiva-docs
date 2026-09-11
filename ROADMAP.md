# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-11. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

**The near-term shape, agreed 2026-09-05.** Four levels, and only one of them is new:

| level | what it is | exists? |
| --- | --- | --- |
| **Workspace** | the relay — one per company | yes, unnamed as such |
| **Team** | a Folder: people, permissions, one conversation space. **Teams never nest** | **listed folders built 2026-09-08** (buzz#13, fixed by buzz#15 on 09-11): `kind:1852` in, relay-signed `kind:30890` out, drawn in both apps. Private folders (§4.2 stub/detail, §4.4) deliberately not yet |
| **File** | anything addressable — project, issue, document, topic. **Files nest inside files** | files yes; **nesting drawn 2026-09-10** (peek#190) over the parent link Ship already writes; a generic parent declaration is FOL-4's remainder |
| **Block** | an addressable paragraph inside a file | shipped |

A file's **description is the file**, not a document beneath it — which is already how it is published. Nesting **organises and never grants access**: everything in a team is visible to that team. Depth comes from files, permissions stay flat, and that combination is what keeps "who can see this?" answerable.

**Two kinds of app, decided 2026-09-11** ([RFC 0.5 §10.7](protocol/RFC-0.5-ASSOCIATION.md)). A **specialized** app owns kinds, renders every aspect of them, and its navigation lists only its own files — Ship lists projects and issues. A **generic** app owns no kinds and renders *one aspect of every file*: Peek the conversation, Leaf the document. **Navigation is by kind; nesting is by intent** — a foreign file somebody placed under a Ship issue shows on that issue as *Related*, because the placement was a person saying it belongs there. A subject no specialized app claims is a **bare file**, which the generic apps handle completely; **a Peek topic is a bare file**, and its messages are `kind:1111` comments on it. That closes §10.6's open question, and it is what FOL-3 now builds.

---

## How this document is meant to be used

1. **Aim for high-level architectural clarity.** Know the shape before building the parts. [ADR 0001](decisions/0001-relay-canonical-by-default.md) and [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) exist for that.

2. **Do not force a decision that does not need making yet.** Where something is risky or genuinely unclear, name it, name the *latest responsible moment* to decide, and move on. A deferred decision with a trigger is a plan. A guessed decision is debt with interest. **In practice: if a piece of work needs a decision we have deliberately deferred, it does not get *implementation* tickets yet.** Filing those against an undecided design produces a backlog that looks like progress and is not.

   **Amended 2026-09-04 — work we know is coming gets a placeholder.** The rule as written was self-concealing: nothing is filed against an undecided part, so the blocked work exists only in this document's *Not filed, and why* table, and the cost of continuing to defer never appears anywhere anyone looks day to day. A placeholder is not an implementation ticket. It carries **the open options, what has already been measured, and what would decide it**, and says outright that it is not ready to build. The test is whether somebody reading Ship alone would know the work exists. The **Folders and facets** project is the first of these.

3. **Learn as you go, and fold what you learn back into the architecture.** Not optional tidying — it is where the architecture comes from. Every substantial finding in this programme came from having built the previous piece, not from planning harder. The first thing to do when a project finishes is say what it taught; see [§Finished](#finished--and-what-each-one-taught).

---

## Where things stand

The active projects, and what each one is *for*. **The counts are deliberately not here** — ask Ship, which is the only place they can be right: `ship issues --project "…"` for what is open, `ship projects` for the total and for how many archived projects a listing hid (AGE-7).

They used to be here, one `open / total` per row, and they drifted in both directions between hand-refreshes — at one point the header disagreed with the very table beneath it. Please do not add them back (OTH-4).

| project | what it is |
| --- | --- |
| **DMs on Nostr** | Move Peek's DMs off Convex onto the relay. Gated on one cheap probe |
| **Projection layer** | Render and act on another app's objects. *Mostly already built — this is extraction and extension* |
| **Cross-app read state** | Read/unread becomes a property of the person, not the app. **Shipped and verified against production** — what is left is CRO-10, a parked spike. See [READ-STATE.md](operations/READ-STATE.md) |
| **Shared foundation packages** | The packages a third app installs. **SHA-4 done 2026-09-08** — `@estiva-app/identity` is the whole Estiva ID client, including `POST /sign`, in all three consumers |
| **Intelligence in Peek** | Cmd+K: every action an app declares, offered where the conversation is. **Built and deployed.** *Start a conversation* publishes since 2026-09-09 (peek#180); *Create project* and *Create topic* are what is left of INT-9, and they wait on PRO-18's container-creating emit — which no longer waits on a folder model, because there is one |
| **Ship: Feedback & Bugs** | |
| **Peek: Feedback & Bugs** | |
| **Conversation standard** | Comments the third app adopts rather than rebuilds. Track 2 is done; **CON-5, the extraction, is what is left**, and it is sequenced after FOL-3 on purpose — see *What to do next* |
| **Rich text and blocks** | *Thin on purpose — see the format decision below* |
| **Composition** | A document that points at live content instead of copying it — a section of a plan quoted in a conversation, a table shared across documents, an issue rendered as a live widget. Designed 2026-09-11 in [RFC 0.6](protocol/RFC-0.6-COMPOSITION.md); gated on accepting it |
| **Folders: navigation for the whole suite** | Navigation — teams, files that nest, and labels. **The near-term centre of the programme, and most of it landed the week of 2026-09-08**: relay-maintained folder state, folder views in both apps, Peek drawing a Ship project's conversation (the aspects thesis, peek#189), issues nested under their project (peek#190), rename/delete/move (peek#192). **What is left is FOL-3** — a topic becomes a bare file — and it is now the next thing rather than the last. Facets are withdrawn (RFC 0.5 §10) |
| **Other** | `estiva-docs` tooling and one-offs belonging to no track. Unarchived 2026-09-01 — it was hidden while holding open issues |
| **Agent / Steer** | The CLI, MCP server and Claude Code plugin |
| **Performance and efficiency** | What a read and a write actually cost, before Leaf is built on it. **PER-1 shipped 2026-09-08**: a Ship workspace read is 3 requests where it was 39, and the poll went back to 10 s |
| **Live delivery** | Ship subscribes instead of polling, and the package a second app needs in order to. **Complete 2026-09-08**, all five issues: a change from another pubkey reaches Ship in under two seconds against a ten-second poll, and the poll now runs only while the socket is not live. Created the same day by centralising a socket that had a package half in *Shared foundation packages* and a Ship half in *Performance and efficiency* — and a blocker in neither, which is what the centralising found |

**Both gates are closed.** Gate 1 (Estiva ID capabilities) closed 2026-08-25; Gate 2 (where packages live and how they publish, [ADR 0002](decisions/0002-foundation-packages.md)) closed 2026-08-27. **Nothing in the programme is gate-blocked any more.**

---

## What to do next

**One sequence, decided 2026-09-11 after the demo**, replacing the two tracks that used to be here — Track 2 finished on 2026-09-07 and most of Track 1 landed the week after. Each step is a stopping point with a done-when a person can check, because the week is token-constrained and a step that cannot be verified from the running system is not finished.

| step | do | done when |
| --- | --- | --- |
| **0** | Make the tracker true — FOL-1 closed, FOL-2's listed-only half closed and *private folders* split off as its own placeholder, this document brought level with `origin/main`. **COM-1** — accept or amend RFC 0.6 — is still open and has a window: its §3 fixes the `attachment` block's shape, and Ship began producing them on 2026-09-10 | Ship and this document agree with the merge log |
| **1** | **FOL-3, the decisions**, now made: a topic is a **bare file** — the generic file kind, owned by no app — and a message in a topic is a **`kind:1111` comment** on it; the team's general conversation stays `kind:9` in the channel, because it is room chat rather than talk about a file. One Estiva ID seed change carrying **both** the bare file kind and `30852` (labels, FOL-5, already decided), one re-seed, one probe that reads `accepted` — so labels' grant costs nothing extra | a topic record is accepted by production; a negative-control shape is refused |
| **2–3** | **FOL-3, the additive half**: new topics are bare files inside a team, their messages carry the topic's address; both folder views show them nested; conversation counts and Activity mentions turn on (CON-11, RIC-11). **No data migration** — every existing channel becomes a team, its messages that team's general conversation. *Not* Peek's sidebar coming off Convex; that is *Remove Convex*, later | create a topic under a project in Peek; it nests in Ship's folder view; a message elsewhere naming it shows in its Activity |
| **4** | **PRO-18 → INT-9's last two rows**: a container-creating emit; *Create project* (a Folder plus a record, both of which exist) and *Create topic* (a bare file) | from a Peek thread, all four creates publish and come back as widgets; no launcher row opens a form and publishes nothing |
| **5–6** | **CON-5** — extract `@estiva-app/conversation` with Peek and Ship as the two consumers and their local copies deleted; **CON-6** publishes it with the "comments in an hour" guide | both apps render conversations from the package, and the ticket records what the second consumer forced to change, "nothing" included |
| **7** | The deploy dance (a green buzz build is not a deploy), FOL-4's remainder (a generic parent declaration, breadcrumbs, the manifest saying a kind may nest), the update for Katerina | — |

**Why FOL-3 before CON-5, and not the other way round.** A topic whose messages are `1111` comments on its address is Peek consuming Ship's conversation shape — the second consumer CON-5 has been waiting for, and peek#189 already does it for a project. Extracting first would produce a package shaped like today's `kind:9`-only Peek and then change it. The package reads both shapes forever regardless, because the general conversation does not migrate; FOL-3 costs it nothing, it only has to come first.

**One cost FOL-3 carries that neither decision removes: unread.** Read state is keyed on the *channel* (CRO-3, [SPEC §11.1](protocol/SPEC.md)). Once several topics share a team's channel, "unread in this topic" is a new read-state context — §11.1 reserved `folder:<address>` for the folder level, and a per-file one needs adding. A FOL-3 sub-ticket, filed when the shape is on production.

**Deferred past the week, and why.** Labels' UI (FOL-6) — the grant lands on day 1, and eighty-plus Folders on production (peek#192) make it real rather than polish, but not this week. DMs — DMS-2 is a half-day probe gating ten tickets and is orthogonal to all of the above; first thing the following week, so DM work can be estimated honestly. Remove Convex — shrinks with every step above and cannot go first. Private folders — nothing on production is private. COM-2 — the Leaf-shaped payoff, and nothing waits on it.

### Ready now, and independent of the sequence

`RIC-10`'s Peek half (Ship's merged 2026-09-04) and `RIC-2` finish the inline-mention work. `RIC-13` gives a description field prose and blocks wherever it is drawn, Cmd+K included. `INT-11` (Edge shows Ask rows that can never work). `SHI-4` (refs are not unique) is worth more than its size suggests — it is why every `ship` command takes an address. Then the bug lists in **Peek: Improvements**, **Peek: Feedback & Bugs** and **Ship: Feedback & Bugs**. **One coordination point**: if the conversation components are in the `@estiva-app/ui` migration queue, CON-5 extracts after that lands or the migration happens inside the package — otherwise the package ships the old primitives on day one.

### Blocked, and worth knowing why

- **INT-9's remaining half** — *Create project* and *Create topic* stay hidden until an action can create a container. That is PRO-18's unbuilt half. It used to wait on a folder model; there is one now (buzz#13), so it waits on step 4's turn and nothing else.
- **CON-11** — said *a Peek topic has no address*. It has one — `39000:<relay-pk>:<uuid>`, measured in RFC 0.4 §5.2. What it lacks is messages *addressed to it*: they carry `h` and no `a`. FOL-3's `1111` decision is exactly that, so CON-11 turns on with step 2–3 rather than waiting on anything of its own.
- **DMS-2** still gates the whole DM track, and still costs hours.

## What blocks what

Live dependencies only. Resolved ones moved to *Finished*; if a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| ~~**FOL-2** (folder implementation)~~ | ~~**FOL-1**~~ | **Both done.** FOL-1 decided fork on 2026-09-04 and §12.1 allocated `1852`/`30890`; the relay shipped them on 2026-09-08 (buzz#13) and buzz#15 fixed two silent bugs on 09-11 — every Folder's state shared one coordinate, so curating a second Folder soft-deleted the first, and a deleted Folder's state survived it. **Only the listed half**: private folders are their own placeholder now |
| **Labels**, and the sidebar being usable at all | *(nothing protocol-shaped)* | FOL-2 landed. `30852`'s grant rides step 1's seed change; the UI is deferred past the week, not blocked |
| **FOL-3** (topics become bare files) | *(nothing)* | **Unblocked, and next.** Its two decisions were made 2026-09-11 — bare file, `1111` — and the reading half it needed is on production: folder views in both apps, the aspects panel (peek#189), nesting (peek#190). It still touches what Peek publishes, which is why it keeps the no-migration rule |
| ~~**Sub-file roll-up into Activity**~~ | ~~**FOL-2**~~ | **Wrong, and shipped anyway 2026-09-06.** It assumed nothing nests until FOL-2 — but a Ship project's issues already do, so Ship's roll-up shows data that exists. Only *Peek's* waits, and on FOL-3 rather than FOL-2 |
| **CON-11** (mentions in Peek's Activity) | **FOL-3** | Said a topic has no address; it has one (RFC 0.4 §5.2). What it lacks is messages *addressed to it* — `h` and no `a` — and FOL-3's `1111` decision is exactly that. The surface is built and takes a second relation |
| **CON-5** (extract the package) | *(nothing)* | **Unblocked 2026-09-07.** CON-7 and CON-9 are done and the model has two consumers that pushed back on it, which is the condition SHA-7's lesson asks for |
| **INT-9**'s remaining half | **PRO-18**'s container half | An action still cannot create a container. It waited on a folder model; there is one now (buzz#13), so PRO-18 is step 4 and waits on nothing else. *Create topic* creates a bare file, per step 1 |
| all DM code | **DMS-2** | Verifies that `kind:41010` is accepted over the HTTP bridge. If not, the track changes shape |
| **Leaf starting** | *(nothing)* | §6 was answered in Ship (RIC-7). It is unblocked, and files nesting is what would make it cheap |
| ~~**SHA-7** (extract the socket plumbing)~~ | *(done)* | **Done 2026-09-08.** It created `@estiva-app/platform` 0.1.0 — which did not exist when this row was written, and which SHA-2's PWA export now adds to rather than creating. Refactored rather than moved: ADR 0002 §10 scored `liveTopics.ts` ❌ on two constraints, so `git mv` was never available |
| ~~**PER-3** (Ship's socket)~~ | ~~**LIV-2** (the grant)~~ | **Both done 2026-09-08.** Estiva ID refused `estiva-ship` a `22242` deliberately, with a test named after it; the grant reversed that and is scoped to the workspace relay and no other. Proved by a signature the relay accepted rather than by a database row |
| ~~**PER-3**~~ | ~~**SHA-7**~~ | **Both done.** The pair was the point and it paid: the second consumer did push back. `createChannelSubscriptions` is one REQ per channel, which a workspace read cannot afford against a budget that refuses the 51st unpaced REQ, so `watchFolders` was added. `live.ts` and `subscriptions.ts` are unchanged |
| ~~**PER-2** (incremental reads)~~ | ~~**PER-3**~~ | **Decided no, 2026-09-08.** Its answer did fall out of how a pushed event reaches the fold: a debounced full re-read, which keeps deletions and re-links correct for free. What it implies for Leaf — where the decision stops applying — is recorded on the project |

## Decisions that gate work

Open decisions first. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| ~~**How a named group of files is written down**~~ | RFC 0.5 §3.4 | **Decided 2026-09-05.** `kind:30852` Set — an addressable record listing its members, declaring a role of `facet`, `label` or `collection`. A role a reader does not recognise groups and never merges. Honoured for your file only when its signer is authorised by *your* file. One primitive under labels, cross-team references and facets |
| ~~**Accept or amend RFC 0.5 §1–§6**~~ | SHA-13 | **Accepted 2026-09-05**, with three corrections and §3.4 |
| ~~**What a Peek topic is**~~ | FOL-3 | **Decided 2026-09-11: a bare file** — the generic file kind, owned by no app, which the generic apps handle completely ([RFC 0.5 §10.7](protocol/RFC-0.5-ASSOCIATION.md)). Not its own kind: by the protocol's own rule custom kinds are for what is genuinely novel, and a topic's only novelty is an absence — no body. Not a Leaf document either: the document aspect belongs to every file, so no one app should own the bare one. This resolves the *two orphaned kinds* row below, and it is where COM-3 lands |
| ~~**What a message in a topic is**~~ | FOL-3 | **Decided 2026-09-11: a `kind:1111` comment on the topic.** The team's general conversation stays `kind:9` in the channel — chat is talking *in* a room, a comment is talking *about* a file. The alternative, `kind:9` with an `a` tag, made two kinds carry one concept and gave every affordance a third case |
| ~~**Two kinds of app**~~ | RFC 0.5 §10.7 | **Decided 2026-09-11.** Specialized apps own kinds and list only their own files; generic apps own none and render one aspect of every file. Navigation is by kind, nesting is by intent. Highlights are addressed at the file, like a comment, so a generic app derives them for any file without knowing its kind |
| **Accept or amend RFC 0.6** | COM-1 | **Open, with a window** — Ship began producing `attachment` blocks on 2026-09-10, and §3 fixes their shape. Gates the composition track the way SHA-10 gated projection. Cheaper than either predecessor: **no new kind, no Buzz change, nothing to migrate** — a pointer is an address that already exists ([SPEC §13.6](protocol/SPEC.md)) and the parts it names already have ids. What it settles is a vocabulary, and one conclusion has a closing window — see *Not filed* |
| ~~**The reaction horizon**~~ | CON-1 | **Decided 2026-09-07** — N is 100, in [SPEC §6.6](protocol/SPEC.md) as a rule rather than an observation, closing RFC 0.4 open question 10. The argument was interoperability, not performance: two apps with different N disagree about the count legitimately, and a reader cannot tell that from a bug |
| **What happens to Convex-only DMs** | DMS-7 | The relay's ±15 minute drift window means republished history cannot carry original timestamps |
| **What the product says about DM privacy** | DMS-11 | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
| ~~**How a pushed event reaches Ship's fold**~~ | PER-3 | **Decided 2026-09-08: trigger**, and built that way. Was: trigger a debounced re-read, or merge incrementally: Ship's fold is correct *because* it sees everything at once, and merging turns a stateless client into one with a cache — losing deletions and re-links, which an incremental reader never re-asks for. PER-1 made a full re-read 3 requests, which is what makes the cheap answer affordable. Decides PER-2 as a by-product |
| **Disclosure copy** | RFC 0.4 §12.6 | Two moments, both real: granting access discloses all history, and *listing* a team discloses its roster. Sharper now that a Folder is called a team — "who is in this channel" is mild, "who is on this team" is org structure |

**Settled 2026-09-05**, in one sitting, and recorded here because the RFCs do not yet say so:

- **Workspace = the relay. Team = a Folder. Files nest inside.** Teams never nest.
- **A file's description is the file**, not a document beneath it.
- **Nesting organises and never grants access.**
- **Labels are shared**, not per-person. No personal labels for now.
- **A team may point at another team's files.** A private team cannot be pointed *into*, and a reference to something the reader cannot see renders as **nothing** — not as "unavailable", which would leak the count. That is a deliberate divergence from upstream's NIP-MP, whose fold requires the opposite for public repositories.
- **Someone who should see one project and not the whole team gets their own team.** Nested teams stay unbuilt; Linear shipped sub-teams, so the demand is real and the answer can change.
- **Following is a subscription, not a permission tier** — RFC 0.4 §4.6 as written, per-user and private. No read-only stakeholder tier.
- **Open teams have public rosters, and that is desired.** Private teams hide theirs already.

> **One decision in RFC 0.6 has a deadline rather than a blocker.** §3 concludes
> that an attachment is a block and should keep the shape [SPEC §13.3](protocol/SPEC.md)
> gave it on 2026-09-10. Production held **zero** `attachment` blocks when that was
> written, so disagreeing is free now and expensive once people have attached files
> to descriptions. Nothing else in 0.6 has a window — the rest is additive.

## Not filed, and why

Held deliberately rather than forgotten. Most of what used to sit here is now the **Folders and facets** project — that is rule 2's amendment working.

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **`@onboarding-team` mentions** | the team already has a name and an address, so the *reference* works today; what is missing is fanning a notification to its members | nothing protocol-shaped. It is notification plumbing and wants a ticket once teams exist |
| **Association and facets** (RFC 0.5 §2, §3) | parked deliberately 2026-09-05, split from folders. §2 basic association is nearly free and may come earlier if a panel needs it | §3.4, then a decision to unpark |
| **The upstream NIP proposal** (RFC 0.4 §10.2) | **not happening** — FOL-1 chose fork | Kept as the list to propose if that is ever revisited |
| **The intelligence layer** — cross-app agent-invoked actions, and per-app harnesses deriving memories from raw events | the zero-implementations objection is spent; what it protected still holds, and it is the **persistence**, not the reasoning. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only, so any shape later changed is permanent. [SPEC §12.1](protocol/SPEC.md) puts an experiment in the replaceable layer or in the app's database | SPEC §12.1's first question flipping — the first time a second app's harness needs another app's memories |
| **Two orphaned kinds** — `30840 File`, `30841 Component` | published in `@estiva-app/protocol`, zero events in production, and the anchoring they were kept for was answered by block ids instead (RIC-5). **`30840` now has a use — it is the bare file** (decided 2026-09-11, above), which is the first option this row always offered. Whether it keeps the name *File*, and what happens to `30841`, is COM-3's to settle | COM-3, now that the decision it waited on is made |
| **Composition beyond the pointer** (RFC 0.6 §6, §7) | the RFC is a draft, and per rule 2 nothing is filed against its undecided parts — sync write-back, promotion to a standalone object, and the cycle bound all wait on it. What is *already decided* needs no RFC: SPEC §13.6's `(object, block)` address is accepted and in production, so transcluding **one** block is buildable today, and that is COM-2 | **RFC 0.6 accepted** (COM-1) |

## Finished — and what each one taught

Rule 3 is why these survive the pruning: the lesson, not the history. Detail is in the linked documents.

| shipped | what it taught |
| --- | --- |
| **Folders, listed** — buzz#13/#15, interop 0.15–0.18, peek#173/#189/#190/#192, ship#121 (2026-09-08/11) | **A placeholder nobody closes is a lie that compounds.** FOL-2 read *not ready to build* for three days after the relay shipped it, and PRO-18 and peek#180 were still saying "wait for the folder model" — an agent picking up INT-9 would have re-blocked on work that was on production. Check the merge log against the roadmap before sequencing anything, and close the marker in the same turn the work lands. **And the relay's silences came in pairs**: every Folder's state shared one coordinate because a `d` was written and never read, so curating a second Folder soft-deleted the first; and deleting a Folder swept three kinds by `channel_id`, which global state cannot match, so the deleted Folder stayed listed. Neither was observed — the first would have been, the moment "move a file" shipped |
| **The demo** — 2026-09-11, with Katerina | Its scope line — *nothing on screen needs a relay change* — held, and it was worth defending: everything the demo showed was the read side over data that already existed. **The one change on the way was not a relay change but a grant**, and "needs a Buzz change" and "needs an Estiva ID grant" have very different costs — separate them when scoping. The grant's re-seed did fail exactly as predicted: it ran before the box had pulled, wrote the old values back, and exited 0 |
| **Track 2** — Conversations (2026-09-06/07) | **Two apps agreeing needs a rule, not a convention.** Every defect here was two implementations each self-consistent: a reaction made in Ship discarded by Peek's import filter; a reply reaction that rendered, never left the browser, and had no persistence path despite one being built; a horizon each app picked for itself, where different values would make the two disagree about a count legitimately and unfixably. **And a withdrawn rule propagates**: SPEC §6.5 said deletion was author-scoped, it was not, and both apps plus `@estiva-app/protocol` had built controls to it — the wrong rule reached third-party adopters before anyone noticed |
| **Cross-app read state** | **Seven defects, none caught by review or a green suite** — every one in the seam between correct code and whatever was meant to invoke it. Hence `window.__readState()` in both apps. And **observing read state changes it**: opening a topic to look at an indicator advances the container and clears what you were measuring. [READ-STATE.md](operations/READ-STATE.md) |
| **Track A** — Peek real-time | **A two-window test of one account proves nothing.** Both windows share one deployment, so a reply arrives by reactivity alone. Verify a live path from a different identity |
| **Track F** — Buzz catch-up · **REW-11 / CAT-9 / SHI-7** | A green image build is not a deploy, and the relay refuses in a shape that reads as success — `200 {"accepted": false}`. **Measure the defect a design change is justified by, before the change**: REW-11's was measured after and did not say what the ticket assumed. Do not squash-merge an upstream catch-up |
| **Gate 1** — Estiva ID capabilities | **A grant has two halves.** `allowed_kinds` can contain a kind and read as correct while every use is refused, because the deployment half lives in `.env` |
| **Gate 2** — [ADR 0002](decisions/0002-foundation-packages.md) | Releases go through OIDC; GitHub holds no npm credential. A package's *first* publish is manual. **npm publishes asynchronously** — the registry served the old version for three minutes after a green release, twice |
| **SHA-3** — `@estiva-app/protocol` | **The drift was real and nothing had failed.** Two copies of one function, self-consistent, emitting different bytes. A red build was never going to be the signal |
| **SHA-4** — `@estiva-app/identity` | **A second consumer proves the package is not shaped like the first app. It does not prove the first app handed everything over.** Wiring Ship found the storage seam, exactly as the ticket predicted — and *two of the five behaviours the ticket called incidents never moved*, because they lived in Peek's Convex adapter, the one file deliberately left out. So Peek kept them and Ship silently had neither. Worse where a copy had merely drifted: `POST /sign` signs as the token's subject whatever it is handed, and of three implementations **only Peek's checked the author** — the missing one being Ship's, through which every issue, comment and status change passes. Extracting found four defects live in production, none visible from the code being extracted |
| **SHA-9** · **RFC 0.3 → 0.4** | Two of four research topics were **already built** and an RFC listed one as an unsolved gap. The inventory was stale, not the system — check the document against the running code before believing it |
| **RFC 0.5** — the association work | **A relay-signed object cannot declare anything.** That single constraint forced one-sided declaration, and it is the reason a facet, a label and a folder-of-folders all need the same shape. It turned out to *solve* authorization rather than complicate it |
| **Intelligence in Peek** | Shipped and verified. Its own suite was entirely negative assertions — *this must not publish* — which pass just as happily against a feature that can never publish. **A suite of negative assertions cannot tell "correctly does nothing yet" from "does nothing ever."** |
| **Rich text and blocks** (MS2) | Two content models, one inline vocabulary. And: two surfaces meant to match cannot be kept matching by care — share the styles, or one quietly grows a feature the other lacks |

Two documents sit under all of it:

| document | what it settles |
| --- | --- |
| [ADR 0001](decisions/0001-relay-canonical-by-default.md) | **accepted** — relay-canonical by default; a database is a per-feature exception; Estiva ID excluded |
| [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) | **accepted, and current.** Containment (§1–§12), the projection layer (§13), messages vs rich text (§14), the third-app checklist (§15) |
| [RFC 0.5](protocol/RFC-0.5-ASSOCIATION.md) | **§7 accepted and implemented; §1–§6 draft, reviewed 2026-09-04.** How files relate, and what a link looks like |

> **The RFC numbers are not a version sequence.** 0.3→0.4 was supersession; everything after 0.4 is not. Each takes a *topic* the previous left open, and the earlier document stays current for what it covers. Somebody has already edited the wrong one on this reasoning.

Failure shapes worth reading before building anything: [SILENT-FAILURES.md](operations/SILENT-FAILURES.md).

---

## Still unverified

The short list. Everything else claimed in this programme has been read from a live system rather than inferred — see [SPEC §9](protocol/SPEC.md) and RFC 0.4 §5.2/§5.3 for the measurements that matter.

- **Whether `kind:41010` is accepted over the HTTP bridge.** Estiva ID will *sign* one, which says nothing about ingest. This is DMS-2, and it gates ten tickets.
- **The private-channel refusal.** That a non-member is refused a private channel's `39000` follows from reading the relay's `UNION`, not from measurement — production has no private channel to be refused from. RFC 0.4 §5.2. Closing it needs a private channel and a second relay-member identity. **This moved up the list on 2026-09-05:** the whole HR scenario rests on it, and so does the rule that a reference to something unreadable renders as nothing. Both are currently believed rather than measured.
- ~~**Whether `SIGN_RELAY_AUTH_ALLOWED_URLS` is non-empty in production.**~~ **Read 2026-09-08: `wss://estiva.estiva.app`.** Non-empty, and exactly one relay — so the inference from Peek's working socket was right, and it also settled how to scope Ship, since mirroring Peek resolves to that one origin and nothing else. Gate 1's lesson still stands and was worth acting on: had it been empty, LIV-2 would have added `22242`, read as correct, and been refused for every relay there is.
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. The catch-up left a production-shaped database to test against.
