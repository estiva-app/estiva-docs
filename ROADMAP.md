# Roadmap — what is left, and what blocks what

**Working reference. Living document.** [Estiva Ship](https://ship.estiva.app) is the source of truth for ticket detail; this is the map between them — what depends on what, what can run in parallel, and what is deliberately still undecided.

Last updated 2026-09-02. Not published to the docs site (`site/nav.mjs` is opt-in) because it changes often and carries operational detail.

**Everything here serves one goal: making the third major app cheap enough to build.** Leaf is that app ([ADR 0001](decisions/0001-relay-canonical-by-default.md)). When a piece of work is hard to prioritise, that is the question to ask of it.

---

## How this document is meant to be used

1. **Aim for high-level architectural clarity.** Know the shape before building the parts. [ADR 0001](decisions/0001-relay-canonical-by-default.md) and [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) exist for that.

2. **Do not force a decision that does not need making yet.** Where something is risky or genuinely unclear, name it, name the *latest responsible moment* to decide, and move on. A deferred decision with a trigger is a plan. A guessed decision is debt with interest. **In practice: if a piece of work needs a decision we have deliberately deferred, it does not get tickets yet.** Filing implementation tickets against an undecided design produces a backlog that looks like progress and is not.

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
| **Other** | `estiva-docs` tooling and one-offs belonging to no track. Unarchived 2026-09-01 — it was hidden while holding open issues |
| **Agent / Steer** | The CLI, MCP server and Claude Code plugin |

**Both gates are closed.** Gate 1 (Estiva ID capabilities) closed 2026-08-25; Gate 2 (where packages live and how they publish, [ADR 0002](decisions/0002-foundation-packages.md)) closed 2026-08-27. **Nothing in the programme is gate-blocked any more.**

---

## What to do next

### First — the cheap things that unblock or de-risk the rest

**Three of the four are done, and only DMS-2 is left.** The struck rows stay because rule 3 is why they are readable at all.

| do | why now |
| --- | --- |
| ~~**SHA-10**~~ — accept RFC 0.4 | **Done 2026-08-28.** [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) is accepted, with one amendment: a consumer MUST ignore a slot it does not implement and still render the rest. **§10.1 was deliberately left open** — its trigger has fired but its *latest* responsible moment has not |
| ~~**RIC-1**~~ — decide the content format | **Done 2026-09-02.** [SPEC §13](protocol/SPEC.md) takes RFC 0.4 §14.5's split: messages stay marker text, a rich text field becomes a JSON block document, one inline vocabulary shared by both in `@estiva-app/protocol`. It was the widest gate, and closing it filed the four tickets rule 2 had been holding back — RIC-4, 5, 6, 7. **The corpus was re-measured at 731 bodies, not 487** |
| **DMS-2** — probe DM open and send | Hours of work that decides the *shape* of nine other tickets. A cheap probe that can invalidate a plan must never sit behind that plan |
| ~~**SHA-11**~~ — ADR 0002 amendment | **Done 2026-08-31**, as [ADR 0002](decisions/0002-foundation-packages.md) §10. Cite that rather than restating the four constraints, so there is one copy to amend |

### Then — two long chains that barely touch

They share no gate and can run concurrently with different people.

**Chain 1 — the third app's foundation.** This is the critical path to Leaf.

```
SHA-2 (platform) ─→ SHA-6 (scaffold) ─→ SHA-7 (socket plumbing lands in platform)   none started

PRO-1 (extract runtime) ─→ PRO-2 (slots) ─┬─→ PRO-3, PRO-4, PRO-5
                                          └─→ PRO-6 (Peek publishes) ─→ PRO-7 (Ship renders)
                                                                             └─→ PRO-9 (publish the package)
    all of it done except PRO-2 and PRO-9, both in progress

RIC-1 (done) ─→ RIC-5 (block model) ─→ RIC-7 (§6 anchoring in Ship's description) ─→ Leaf can start
```

**Chain 2 — Peek's data model.**

```
CRO-4 ─→ CRO-5 ─→ CRO-6 ─→ CRO-7 ─→ CRO-8 ─→ CRO-9        all done
              └─→ CRO-10 (the Convex decision)               unblocked, parked

DMS-2 ─→ DMS-3, DMS-4 ─→ DMS-5, DMS-6 ─→ DMS-7 ─→ DMS-9, DMS-10, DMS-11
                                                        └─→ DMS-8 (last)

CON-1 ─→ CON-2 (Ship gets reactions) ─→ the package
CON-3 (independent)
```

The only real contact between the chains is **CON's package**, which is not complete until read state exists — unread is what a third-party builder most wants and least wants to build.

### Where Intelligence in Peek sits

**Built and deployed on 2026-09-02, the day PRO-4 unblocked it.** MS2 and MS3 both shipped: the launcher publishes, leaves the new object's reference in the composer, finds topics, people and messages, changes an object the thread already refers to, and prefills a create form from the conversation using an on-device model.

**What remains is verification, not building.** Four of the six tickets are deployed and unproven, because the last leg of each needs a signed-in browser: passkey sign-in is not scriptable against production without enrolling an orphan credential in a real account. Ship carries which is which — do not infer it from here.

It was the cheapest thing in the programme and it turned out cheaper than that: its **MS1 was already built** (Katerina's launcher prototype drew every object-creating action from a manifest declaration), and two more halves turned out to exist already. `ForeignObjectWidget` was already applying field-setting actions in a thread, so PEE-3 was only ever about reaching the same object from Cmd+K without hunting up the thread; and `MessageBody` already rendered a `nostr:naddr…` reference, so PEE-2 was one half of a round trip rather than two.

Three things argued for taking it early, and all three held:

- **It is the demo.** The stated business goals are recruiting and a grant, and *"Cmd+K → create the issue → it appears in the thread as a live widget"* is the cross-app moment that reads as unusual. PRO-10 exists to record exactly this.
- **It is a second consumer of the action half**, the way PRO-7 is of the rendering half. Two different halves, both needed before the interop package is published.
- **The team feels it daily** — deciding in Peek and filing in Ship is what this workspace does all day.

**What it taught, and what to read before building on it:** the relay's NIP-50 search matches **whole tokens** — `"Cla"` finds nothing where `"Claude"` finds two — which is why the launcher matches topics and people locally and leaves only messages to the relay. Measured before the UI was designed, which is the only reason the design is shaped for it. Both that and the way an ignored `search` field is indistinguishable from an honoured one are in [SILENT-FAILURES.md](operations/SILENT-FAILURES.md).

**MS3 did not wait for a demo after all.** It was sequenced by when a demo needs to impress rather than by dependency, and shipped alongside MS2 because it was small: a manifest action's declaration is already a JSON Schema and Chrome's Prompt API takes one as its constraint, so no mapping layer was needed. It stays Chrome-desktop-only and can never be more than an enhancement — and the model is never asked for a parent or a pubkey, since the first would pick a destination silently and the second invents a key the relay would accept.

This narrowed a standing product decision rather than ignoring it: Peek's *"no AI features"* rule (2026-07-08) now reads **on-device only**, with cloud still an open question rather than an implementation.

### Bugs and tooling, independent of everything

PEE-7 · SHI-1, 2, 3, 4, 12 · AGE-3 · OTH-3, 4. None blocks or is blocked by the above. (`PEE-1`–`PEE-6` are **Intelligence in Peek** tickets rather than bugs — one prefix serves both projects, which is SHI-4 in miniature.) **SHI-4 (issue refs are not unique) is worth doing sooner than its size suggests** — it is why every `ship` command must be addressed by `30851:<pubkey>:<d>` rather than by ref.

---

## What blocks what

Every real dependency, and nothing else. If a pair is not here, they are independent.

| blocked | by | why |
| --- | --- | --- |
| PRO-2 … PRO-8 | **SHA-10** | They implement RFC 0.4 §13. If it is amended, they change |
| PRO-6 | **PRO-2** | A Topic projection needs the `list` slot |
| PRO-7 | **PRO-1, PRO-6** | Needs the extracted runtime *and* something of Peek's to render |
| ~~Intelligence in Peek, all of MS2~~ | ~~**PRO-4**, **PRO-1**'s publish path~~ | **Unblocked 2026-09-02** — PRO-1 done 08-31, PRO-4 done 09-02. The forms are no longer inert: `CommandLauncher.submitAction` resolves the manifest from the addressed parent, publishes through `applyAction`, and surfaces the runtime's own refusal text. Verified by a person creating a Ship issue from Peek's launcher, which is in the Intelligence project as an untitled-ref row |
| publishing the interop package | **PRO-7** | SHA-7's lesson: never publish a layer with one consumer that has never pushed back |
| ~~PRO-8~~ | ~~**RIC-1**~~ | **Done 2026-08-31, without the format.** And the interim fix was not the one written here: removing the `truncate` is not enough, because `{ field: 'content' }` with no cap projects the whole blob. The `subtitle` slot was dropped outright, which §13.3 makes safe by obliging a consumer to ignore what it cannot use |
| RIC-6, RIC-7 | **RIC-5** | The block model is the thing they are both written against. RIC-7 additionally needs RIC-5 to persist block ids |
| §6 component anchoring | **RIC-5** | A block *is* a component, so the block model is the answer. It is RIC-7 |
| **Leaf starting** | §6 answered | RFC 0.4 §11.3. It is answered in Ship, at one-tenth of Leaf's scale |
| CRO-10 | *(nothing)* | **Every prerequisite is done** — CRO-5, PEE-8 and CRO-11. It is parked by choice, not blocked: four of its five measurements need a browser profiler against a real workspace, and the client-side fold it would measure does not exist yet |
| all DM code | **DMS-2** | Verifies the assumption the whole track's independence rests on: that `kind:41010` is accepted over the HTTP bridge. If it is not, track C needs the WebSocket path and changes shape |
| DMS-8 | CRO-3 *(done)* | Do it last in the DM track regardless — it uses the read-context convention |
| the conversation package | **CON-2** | CON-2 is the second consumer that shows which parts of Peek's model are the model. **The read-state half is no longer a blocker** — CRO shipped, and Ship's unread surface (CRO-13) is the reference implementation to copy |
| SHA-7 | **SHA-2** | `@estiva-app/platform` is where the per-tab / credential / online plumbing belongs. It does not exist yet |

**No longer blocking, and worth knowing:** REW is complete, so **CRO-8 is now cheaper than when it was filed** — it said "if the rewrite is underway it belongs there", and there is now one Ship app rather than two. SHA-4's package is published and consumed by both apps; what remains is verification, not integration. SHA-7 was "after REW-8", which has happened.

---

## Decisions that gate work

| decision | ticket | note |
| --- | --- | --- |
| ~~**Accept or amend RFC 0.4**~~ | SHA-10 | **Accepted 2026-08-28.** Settles the containment model, the projection vocabulary and the two content models. Settles none of §12 — the open questions survive acceptance, four of them with tickets |
| **Accept or amend RFC 0.5** | SHA-13 | Gates every association and facet ticket, the same way SHA-10 gated the projection work. Cheaper than 0.4's was — 0.5 needs no new kind and no Buzz change, because a facet is a tag on a file its own author signs |
| **Does a facet merge comments** | RFC 0.5 §3 | **Yes** — decided 2026-08-31. Ordered by time, origin unlabelled. The competing integration merges by *copying*; every limitation it documents follows from the copy, and a read-time union has none of them |
| ~~**Which content format**~~ | RIC-1 | **Decided 2026-09-02** — [SPEC §13](protocol/SPEC.md). Two models, one shared inline vocabulary. The compatibility story is `alsoRead`-shaped and **permanent rather than a closing window**: the corpus re-measured at **731 bodies** on the day of the decision, up from 487 five days earlier, and the growth is itself the argument for a permanent reader |
| **Upstream proposal or fork** | RFC 0.4 §10.1 | Trigger **fired** — upstream shipped `kind:30621`, global-only, single-writer. Latest responsible moment is the first line of folder command/state code. **Now the only thing between the accepted design and folder tickets**, since §12.1 makes the kind numbers its tail. Left open at acceptance on purpose: the trigger firing makes it *easier*, not yet *forced* |
| **The reaction horizon** | CON-1 | Currently decided by an undocumented constant of 100 |
| Who may register a widget type | RFC 0.4 §13.3 | No longer *blocking* — the fallback chain means an unknown widget always renders |
| What happens to Convex-only DMs | DMS-7 | The relay's ±15 minute drift window means republished history cannot carry original timestamps, so migration is not free |
| What the product says about DM privacy | DMS-11 | "Private" is accurate for membership-scoped; whether to say more is product and possibly legal |

---

## Not filed, and why

Held deliberately rather than forgotten.

| work | why not yet | what unblocks it |
| --- | --- | --- |
| **Folder implementation** (RFC 0.4 §4) | the design is now accepted, but the kind numbers are deliberately unassigned and §12.1 says they should be allocated upstream *if* this goes upstream — so the numbers are the tail of §10.1 rather than a separate decision | **§10.1 decided.** That is now the only thing between here and folder tickets |
| **The upstream NIP proposal** (RFC 0.4 §10.1/10.2) | deferred on purpose, though its trigger has now fired | the first line of folder command/state code |
| **Association and facets** (RFC 0.5 §2, §3) | the RFC is a draft, and per rule 2 nothing is filed against its undecided parts. What is *decided* — the three tiers, facets as a tag its own author signs, the access-compatibility invariant — produced two tickets that do not depend on the rest: PRO-11 and CON-7 | **RFC 0.5 accepted** (SHA-13) |
| **The URL grammar** (RFC 0.5 §7) | added 2026-08-31, and gated the same way §2/§3 are: the RFC is a draft. What is *decided* and independent is filed — Peek has no URL for any object, which is true regardless of which grammar wins. The rest — `<type>/<slug>-<d>` paths, manifest-declared `urls`, client-side resolution — waits, because filing against an unaccepted grammar is the backlog rule 2 forbids | **RFC 0.5 accepted** (SHA-13) |
| **Peek's `topic = channel` → `topic = file` migration** (RFC 0.4 §11.1) | depends on folders existing. Plausibly larger than the Ship rewrite | folders shipped; sequence after the third app has proven the foundation |
| **The intelligence layer** — per-app AI harnesses deriving "memories" from raw events, and cross-app agent-invoked actions | Designing it now means designing against **zero** implementations — no app has a harness, which is worse than SHA-7's single-consumer problem. The one piece that looked ready to measure is the least settled: Peek's highlights are an experiment. **They must not be published to `kind:9802` while the model is unsettled** — 9802 is in the regular range, so it is append-only and any shape later changed is permanent. [SPEC §12.1](protocol/SPEC.md)'s test puts an experiment in the replaceable layer (`kind:30078`, versioned `d`) or leaves it in the app's database. Two seams are taken now because they are fields rather than designs: an action's `description` and `effect` (RFC 0.4 §13.4) | **SPEC §12.1's first question flipping** — the first time a second app's harness needs to read another app's memories |
| **Live project-panel updates** | found while building PEE-2. Ship's project panel polls on a 30s timer because `liveProjection` routes only message-shaped kinds. The socket already delivers `30850`/`30851` — the subscription is kindless — so routing them into a panel refresh would close it | nothing. Smaller than a ticket and nobody has decided it is worth one |

---

## Finished — and what each one taught

Detail lives in the linked documents; this is the index. Rule 3 is why these lines survive the pruning.

| shipped | what it taught |
| --- | --- |
| **Gate 1** — Estiva ID capabilities | **A grant has two halves.** `allowed_kinds` can contain a kind and read as correct while every use is refused, because the deployment half lives in `.env`. A column per capability, or you cannot grant one without the other. Deploy order and the verify step are in [PRODUCTION.md](operations/PRODUCTION.md) |
| **Gate 2** — [ADR 0002](decisions/0002-foundation-packages.md) | Publishing raw `.ts` ships a package green in one app and red in another. A token in CI was never going to work — releases go through OIDC and GitHub holds no npm credential. A package's *first* publish must be manual |
| **Track A** — Peek real-time (11) | **A two-window test of one account proves nothing** — both windows share one Convex deployment, so a reply arrives by reactivity alone. Verify a live path by publishing from a *different* app or identity. Also: a status signal must earn the screen by persisting, or it cries wolf |
| **Track F** — Buzz catch-up (11) | A green image build is not a deploy. **Do not squash-merge an upstream catch-up** — it collapses the merge commit and leaves `git merge-base` stale. Cost: ~303 ms of migration, 13.71 s of downtime, dominated by a conformance probe rather than by schema |
| **Ship rewrite** (12) | React + Vite, no backend, cut over and the old app removed |
| **SHA-3** — `@estiva-app/protocol` | **The drift was real and nothing had failed.** Peek's `buildMessage` grew an `about` parameter; Ship's copy could not emit one. Same logical message, different bytes, both copies self-consistent. A red build was never going to be the signal. [SPEC §10](protocol/SPEC.md) argued the opposite until this amended it |
| **REW-11 / CAT-9 / SHI-7** | Making a record global is one line in the relay and expensive to land. **Measure the defect a design change is justified by, before the change** — REW-11's was measured after and did not say what the ticket assumed. The real fix was SHI-7: 13 unreachable issues → 0 |
| **SHA-9** — the research | Two of its four topics were **already built**; RFC 0.3 listed one as an unsolved gap. The inventory was stale, not the system. See RFC 0.4 §13 |
| **RFC 0.5** — the association brainstorm | **A relay-signed object cannot declare anything**, so symmetric linking is impossible and the effect has to be one-sided-declaration / two-sided-effect. That turned out to *solve* authorization rather than complicate it — you may only declare on a file you can sign — which is why the hard permission question could be deferred instead of guessed. Also: working two edge cases before writing changed the text twice |
| **AGE-7** | A listing that filters must say what it filtered. `ship projects` now reports its archived count instead of silently returning nine |
| **Cross-app read state** | **Seven defects, none caught by review or a green suite** — every one in the seam between correct code and whatever was meant to invoke it: a hook exported and never mounted, a 5s poll into a rate limit, a rate-limited decrypt read as an empty slot, five flush paths that rescheduled nothing, two slot-bloat bugs, and a debug panel with no button. That is why both apps now ship `window.__readState()`. Also: **observing read state changes it** — opening a topic to look at an indicator advances the container and clears what you were measuring, which cost three of four attempts at CRO-9. [READ-STATE.md](operations/READ-STATE.md) |

Two documents sit under all of it:

| document | what it settles |
| --- | --- |
| [ADR 0001](decisions/0001-relay-canonical-by-default.md) | **accepted** — relay-canonical by default; a database is a per-feature exception; Estiva ID excluded |
> **The RFC numbers are not a version sequence.** 0.3→0.4 was supersession;
> everything after 0.4 is not. Each takes a *topic* the previous left open, and
> the earlier document stays current for what it covers. Containment and
> projection are RFC 0.4; association and addressing are RFC 0.5. Somebody has
> already edited the wrong one on this reasoning.

| [RFC 0.5](protocol/RFC-0.5-ASSOCIATION.md) | **draft** — how files in different apps relate. Three tiers (none / basic / facet), facets as an n-member set declared by a file's own author, and the invariant that a facet may not merge conversations across an access boundary. Written because RFC 0.4 lets a Folder hold several files of one kind, so **the container can no longer be the relationship**. §7 adds **addressing** — what a link looks like — because people copy the address bar rather than a button, which makes an app's URL wire-visible and therefore protocol |
| [RFC 0.4](protocol/RFC-0.4-WORKSPACE.md) | **accepted 2026-08-28, and current** — supersedes 0.3, and is **not** superseded by 0.5 despite the lower number. Containment (§1–§12), the projection layer (§13), messages vs rich text (§14), the third-app checklist (§15). Acceptance settles the design and settles none of §12's open questions; SPEC absorbs each part as it is implemented, so it keeps describing a protocol that exists |

Failure shapes worth reading before building anything: [SILENT-FAILURES.md](operations/SILENT-FAILURES.md).

---

## Still unverified

The short list. Everything else claimed in this programme has been read from a live system rather than inferred — see [SPEC §9](protocol/SPEC.md) and RFC 0.4 §5.2/§5.3 for the measurements that matter.

- **Whether `kind:41010` is accepted over the HTTP bridge.** Estiva ID will *sign* one, which says nothing about ingest. This is DMS-2, and it gates ten tickets.
- **The private-channel refusal.** That a non-member is refused a private channel's `39000` follows from reading the relay's `UNION`, not from measurement — production has no private channel to be refused from. RFC 0.4 §5.2. Closing it needs a private channel and a second relay-member identity.
- **Whether one folder channel holds every file's conversation at scale.** RFC 0.4 open question 4. The catch-up left a production-shaped database to test against.
