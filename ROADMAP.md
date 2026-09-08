# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-08. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

**The near-term shape, agreed 2026-09-05.** Four levels, and only one of them is new:

| level | what it is | exists? |
| --- | --- | --- |
| **Workspace** | the relay — one per company | yes, unnamed as such |
| **Team** | a Folder: people, permissions, one conversation space. **Teams never nest** | designed (RFC 0.4 §4), unbuilt |
| **File** | anything addressable — project, issue, document, topic. **Files nest inside files** | files yes; nesting is the new idea |
| **Block** | an addressable paragraph inside a file | shipped |

A file's **description is the file**, not a document beneath it — which is already how it is published. Nesting **organises and never grants access**: everything in a team is visible to that team. Depth comes from files, permissions stay flat, and that combination is what keeps "who can see this?" answerable.

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
| **Intelligence in Peek** | Cmd+K: every action an app declares, offered where the conversation is. **Built and deployed** — what is left is verification, see below |
| **Ship: Feedback & Bugs** | |
| **Peek: Feedback & Bugs** | |
| **Conversation standard** | Comments the third app adopts rather than rebuilds |
| **Rich text and blocks** | *Thin on purpose — see the format decision below* |
| **Folders and facets** | Navigation — teams, files that nest, and labels. **The near-term centre of the programme.** Facets, meaning *two files are the same thing*, is parked inside it as a placeholder rather than worked on |
| **Other** | `estiva-docs` tooling and one-offs belonging to no track. Unarchived 2026-09-01 — it was hidden while holding open issues |
| **Agent / Steer** | The CLI, MCP server and Claude Code plugin |
| **Performance and efficiency** | What a read and a write actually cost, before Leaf is built on it. **PER-1 shipped 2026-09-08**: a Ship workspace read is 3 requests where it was 39, and the poll went back to 10 s |
| **Live delivery** | Ship subscribes instead of polling, and the package a second app needs in order to. **Complete 2026-09-08**, all five issues: a change from another pubkey reaches Ship in under two seconds against a ten-second poll, and the poll now runs only while the socket is not live. Created the same day by centralising a socket that had a package half in *Shared foundation packages* and a Ship half in *Performance and efficiency* — and a blocker in neither, which is what the centralising found |

**Both gates are closed.** Gate 1 (Estiva ID capabilities) closed 2026-08-25; Gate 2 (where packages live and how they publish, [ADR 0002](decisions/0002-foundation-packages.md)) closed 2026-08-27. **Nothing in the programme is gate-blocked any more.**

---

## Demo target — 2026-09-10, with Katerina

Two things on screen, and **neither needs a relay change**. That is the scope line, and it is the one worth defending.

1. **Folders working as navigation, in Peek and Ship.**
2. ~~**Ship's conversation at Peek's level, and Conversations + Activity in both.**~~ **Done 2026-09-07** — see Track 2. Reactions, delete, edit and drafts in Ship; both lists in both apps. **One demo caveat**: Peek's Activity shows sub-file conversations only, because a topic has no address for a message to mention (CON-11).

**One thing did change on the way, and it was not a relay change.** Editing a comment needed `kind:40003`, which Buzz has carried for longer than this programme has existed — but **no identity was allowed to sign it**, so it took an Estiva ID seed change and a re-seed rather than a relay deploy. Worth separating, because "needs a Buzz change" and "needs a grant" have very different costs and only one of them is the thing the scope line protects against.

**Why no relay change.** A Folder *is* a Buzz channel today: Peek's topics are folders, a Ship project carries `buzz-channel`, its issues carry `h`. So *"everything in this folder"* is a query that works against production right now, across both apps' kinds, resolved through the projection layer already shipped. What FOL-2's new kinds buy is **multi-writer folder state** — a contents list several people may edit, and folder metadata. The demo needs the read side, which exists.

**Explicitly out of scope for the demo**, and starting any of them puts it at risk:

- **FOL-2's Buzz change.** Cheap to write, expensive to land, no update timer, and a green image build is not a deploy.
- **FOL-5** `kind:30852`, and therefore **FOL-6 labels**. Labels matter when there are eighty teams; there are not yet.
- **FOL-3.** Topics already are folders — that is what makes the demo possible without it.
- **New nesting protocol (FOL-4).** Ship's project → issue nesting is data that already exists; the demo shows it rather than building it.
- **Anything in Live delivery.** It needs no relay change either, but it does need an Estiva ID grant and a new package, and the first is the same shape as the `kind:40003` grant above — a seed change and a re-seed against production two days before a demo. *(Held, then done after the demo. The grant's re-seed did fail exactly as this predicted: it ran before the box had pulled, wrote the old values back, and exited 0.)*

## What to do next

Two tracks, and they meet at the end. Everything else in this document is either finished, blocked on one of them, or independent enough to pick up any time.

### Track 1 — Navigation: folders become how you move around

This is the near-term centre. Each step unblocks the next.

| do | state | note |
| --- | --- | --- |
| **FOL-1** — decide upstream or fork | **decided 2026-09-04: fork**, awaiting merge | RFC 0.4 §12.1 allocates `1852` (folder command) and `30890` (folder state), reserving `1852`–`1859` and `3089x`. Upstream forked for the same class of thing and said why |
| **FOL-2** — the folder implementation | placeholder, unblocked once FOL-1 merges | Needs a Buzz change: relay-maintained state, because a shared container cannot be a single-signer event. §10.1's research is the estimate — read the ingest path rather than estimating it, and remember a green image build is not a deploy |
| **Labels** | unblocked 2026-09-05 — `kind:30852` with `role: label` | Shared, not personal. Flat teams mean *many* teams, so this is a prerequisite for the model being usable rather than a polish item |
| **FOL-3** — Peek's topics become files | placeholder, last | **No data migration.** Every existing topic becomes a team, its existing messages become that team's general conversation, and new topics are files inside a team. Read state survives untouched, because CRO-3 keyed containers on the bare channel uuid |

### Track 2 — Conversations: two lists, in both apps

The model agreed 2026-09-05 replaces a growing list of "modes" with two:

- **This file's conversation** — comments on the file, comments on its blocks, and comments on anything declared to be the same thing as it.
- **Activity** — conversations on files *related* to it: its sub-files, and places it was mentioned.

Identity merges; relation aggregates.

**Built 2026-09-06/07.** Both lists exist in both apps, and Ship's conversation reached Peek's level on the way: reactions, deletion, editing and drafts, each built to a rule written down rather than to whichever app happened to have one.

| do | state |
| --- | --- |
| **CON-7** — comments and mentions are two sections, not one list | **done.** This *is* the model, filed before it had a name |
| **CON-9** — the two lists, both apps | **done.** Ship and Peek both draw them; a mention renders `subdued`, because a mention and a sub-file's thread do not carry the same trust (RFC 0.5 §5.1) |
| **CON-1** — the reaction horizon | **done.** N is **100**, in [SPEC §6.6](protocol/SPEC.md) as a rule, and both apps' constants cite it rather than the reverse |
| **CON-2** — Ship gets reactions | **done**, verified from the relay rather than either UI |
| **CON-3** — delete, adjudicated by the relay | **done.** Neither app gates on an author check of its own |
| **CON-10** — drafts | **done** in both apps |
| **CON-4 / CON-8** — edit a comment | **model decided** (RFC 0.4 §7.2.1); Ship shipped, Peek in review |
| **Sub-file roll-up into Activity** | **done for Ship**, which needed no new nesting — a project's issues already nest, so the roll-up shows data that exists. Peek's waits on FOL-3 |
| **RIC-12** — a file shows the conversations that mention it | the other half of Activity, and the half **Peek cannot have yet** — see CON-11 below |
| **CON-5** — extract `@estiva-app/conversation` | **now the last piece**, and correctly sequenced: the model it extracts is settled and has two consumers that pushed back on it |

**One thing Track 2 handed to Track 1.** Peek's Activity carries sub-file conversations and **cannot carry mentions**, because a mention is an address written into a message body and *a Peek topic has no address*. The surface is built — `partitionByRelation` already splits by relation and labels each row — so making topics addressable turns a second relation on rather than starting one. That is **CON-11**, and it is a consumer of FOL-3 rather than a thing FOL-3 must design for.

### Ready now, and independent of both tracks

`RIC-10` and `RIC-2` finish the inline-mention work. `RIC-13` gives a description field prose and blocks wherever it is drawn. `SHI-4` (refs are not unique) is worth more than its size suggests — it is why every `ship` command takes an address. Then the bug lists in **Peek: Improvements**, **Peek: Feedback & Bugs** and **Ship: Feedback & Bugs**.

### Blocked, and worth knowing why

- **INT-9's remaining half** — Create project and Create topic stay hidden until an action can create a container. That is PRO-18's unbuilt half, which now wants the folder model rather than a guess at one.
- **DMS-2** still gates the whole DM track, and still costs hours.
- **Facets** — parked. §3.4 has a recommendation and it costs a new kind; nothing else waits on it now that labels have been separated out.

## What blocks what

Live dependencies only. Resolved ones moved to *Finished*; if a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| **FOL-2** (folder implementation) | **FOL-1** | §12.1 makes the kind numbers the tail of that decision. Decided; awaiting merge |
| **Labels**, and the sidebar being usable at all | **FOL-2** | Many flat teams is the model working as designed. Labels are what make it navigable |
| **FOL-3** (topics become files) | **FOL-2** | And sequenced last regardless: it is the only piece touching what Peek already publishes |
| ~~**Sub-file roll-up into Activity**~~ | ~~**FOL-2**~~ | **Wrong, and shipped anyway 2026-09-06.** It assumed nothing nests until FOL-2 — but a Ship project's issues already do, so Ship's roll-up shows data that exists. Only *Peek's* waits, and on FOL-3 rather than FOL-2 |
| **CON-11** (mentions in Peek's Activity) | **FOL-3** | A mention is an address written into a message body, and a Peek topic has no address — so the events cannot exist yet. The surface is built and takes a second relation |
| **CON-5** (extract the package) | *(nothing)* | **Unblocked 2026-09-07.** CON-7 and CON-9 are done and the model has two consumers that pushed back on it, which is the condition SHA-7's lesson asks for |
| **INT-9**'s remaining half | **PRO-18**'s container half | An action still cannot create a container. Now wants the folder model rather than a guess at one |
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

## Not filed, and why

Held deliberately rather than forgotten. Most of what used to sit here is now the **Folders and facets** project — that is rule 2's amendment working.

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **Labels** | the shape they need is RFC 0.5 §3.4, still open | §3.4 answered. Then it is a small ticket, and an important one |
| **Sub-file roll-up into Activity** | nothing nests yet | FOL-2 |
| **`@onboarding-team` mentions** | the team already has a name and an address, so the *reference* works today; what is missing is fanning a notification to its members | nothing protocol-shaped. It is notification plumbing and wants a ticket once teams exist |
| **Association and facets** (RFC 0.5 §2, §3) | parked deliberately 2026-09-05, split from folders. §2 basic association is nearly free and may come earlier if a panel needs it | §3.4, then a decision to unpark |
| **The upstream NIP proposal** (RFC 0.4 §10.2) | **not happening** — FOL-1 chose fork | Kept as the list to propose if that is ever revisited |
| **The intelligence layer** — cross-app agent-invoked actions, and per-app harnesses deriving memories from raw events | the zero-implementations objection is spent; what it protected still holds, and it is the **persistence**, not the reasoning. Peek's highlights are an experiment and must not be published to `kind:9802` while the model is unsettled — 9802 is append-only, so any shape later changed is permanent. [SPEC §12.1](protocol/SPEC.md) puts an experiment in the replaceable layer or in the app's database | SPEC §12.1's first question flipping — the first time a second app's harness needs another app's memories |
| **Two orphaned kinds** — `30840 File`, `30841 Component` | published in `@estiva-app/protocol`, zero events in production, and the anchoring they were kept for was answered by block ids instead (RIC-5). Either they become the generic file type for things nobody has built an app for, or they are retired | a decision. Leaving two published unused kinds is the one option that is not defensible |

## Finished — and what each one taught

Rule 3 is why these survive the pruning: the lesson, not the history. Detail is in the linked documents.

| shipped | what it taught |
| --- | --- |
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
