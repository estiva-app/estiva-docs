# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-05. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

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
| **Shared foundation packages** | The packages a third app installs |
| **Intelligence in Peek** | Cmd+K: every action an app declares, offered where the conversation is. **Built and deployed** — what is left is verification, see below |
| **Ship: Feedback & Bugs** | |
| **Peek: Feedback & Bugs** | |
| **Conversation standard** | Comments the third app adopts rather than rebuilds |
| **Rich text and blocks** | *Thin on purpose — see the format decision below* |
| **Folders and facets** | Navigation — teams, files that nest, and labels. **The near-term centre of the programme.** Facets, meaning *two files are the same thing*, is parked inside it as a placeholder rather than worked on |
| **Other** | `estiva-docs` tooling and one-offs belonging to no track. Unarchived 2026-09-01 — it was hidden while holding open issues |
| **Agent / Steer** | The CLI, MCP server and Claude Code plugin |

**Both gates are closed.** Gate 1 (Estiva ID capabilities) closed 2026-08-25; Gate 2 (where packages live and how they publish, [ADR 0002](decisions/0002-foundation-packages.md)) closed 2026-08-27. **Nothing in the programme is gate-blocked any more.**

---

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

Identity merges; relation aggregates. Two of the four pieces are already filed.

| do | state |
| --- | --- |
| **CON-7** — comments and mentions are two sections, not one list | filed. This *is* the model, filed before it had a name |
| **RIC-12** — a file shows the conversations that mention it | filed. The other half of Activity |
| **Sub-file roll-up into Activity** | not filed — waits on files nesting (FOL-2) |
| **CON-5** — extract `@estiva-app/conversation` | filed, and should come *after* the two lists exist in both apps, so the package extracts a settled model rather than a guess |

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
| **Sub-file roll-up into Activity** | **FOL-2** | Nothing to roll up until files nest |
| **CON-5** (extract the package) | **CON-7**, **RIC-12** | Extract a settled model, not a guess. SHA-7's lesson: never publish a layer with one consumer that has never pushed back |
| **INT-9**'s remaining half | **PRO-18**'s container half | An action still cannot create a container. Now wants the folder model rather than a guess at one |
| all DM code | **DMS-2** | Verifies that `kind:41010` is accepted over the HTTP bridge. If not, the track changes shape |
| **Leaf starting** | *(nothing)* | §6 was answered in Ship (RIC-7). It is unblocked, and files nesting is what would make it cheap |
| **SHA-7** | **SHA-2** | `@estiva-app/platform` does not exist yet |

## Decisions that gate work

Open decisions first. Everything settled is in *Finished* or in the RFC it amended.

| decision | ticket | note |
| --- | --- | --- |
| ~~**How a named group of files is written down**~~ | RFC 0.5 §3.4 | **Decided 2026-09-05.** `kind:30852` Set — an addressable record listing its members, declaring a role of `facet`, `label` or `collection`. A role a reader does not recognise groups and never merges. Honoured for your file only when its signer is authorised by *your* file. One primitive under labels, cross-team references and facets |
| ~~**Accept or amend RFC 0.5 §1–§6**~~ | SHA-13 | **Accepted 2026-09-05**, with three corrections and §3.4 |
| **The reaction horizon** | CON-1 | Currently an undocumented constant of 100 |
| **What happens to Convex-only DMs** | DMS-7 | The relay's ±15 minute drift window means republished history cannot carry original timestamps |
| **What the product says about DM privacy** | DMS-11 | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |
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
| **Cross-app read state** | **Seven defects, none caught by review or a green suite** — every one in the seam between correct code and whatever was meant to invoke it. Hence `window.__readState()` in both apps. And **observing read state changes it**: opening a topic to look at an indicator advances the container and clears what you were measuring. [READ-STATE.md](operations/READ-STATE.md) |
| **Track A** — Peek real-time | **A two-window test of one account proves nothing.** Both windows share one deployment, so a reply arrives by reactivity alone. Verify a live path from a different identity |
| **Track F** — Buzz catch-up · **REW-11 / CAT-9 / SHI-7** | A green image build is not a deploy, and the relay refuses in a shape that reads as success — `200 {"accepted": false}`. **Measure the defect a design change is justified by, before the change**: REW-11's was measured after and did not say what the ticket assumed. Do not squash-merge an upstream catch-up |
| **Gate 1** — Estiva ID capabilities | **A grant has two halves.** `allowed_kinds` can contain a kind and read as correct while every use is refused, because the deployment half lives in `.env` |
| **Gate 2** — [ADR 0002](decisions/0002-foundation-packages.md) | Releases go through OIDC; GitHub holds no npm credential. A package's *first* publish is manual. **npm publishes asynchronously** — the registry served the old version for three minutes after a green release, twice |
| **SHA-3** — `@estiva-app/protocol` | **The drift was real and nothing had failed.** Two copies of one function, self-consistent, emitting different bytes. A red build was never going to be the signal |
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
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. The catch-up left a production-shaped database to test against.
