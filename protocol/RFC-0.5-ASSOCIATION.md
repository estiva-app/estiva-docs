# RFC 0.5 — Association: how files in different apps relate

- **Status:** draft — **§7 (Addressing) accepted 2026-09-03**; **§3 (Facets) withdrawn 2026-09-08 in favour of §10**

  §7 is separable and was accepted on its own: it answers *how is a file
  addressed*, which the rest of this document does not depend on, and it is the
  only part with an implementation. Peek has served §7.2's grammar since PEE-14.
  The association tiers are a larger question and stay open.

  **§1–§6 accepted 2026-09-05**, reviewed under SHA-13 with three corrections
  and one addition. The corrections: §4's enforcement was stated over the Folder
  rather than over the access boundary and contradicted §3.3; §3.1's constraint
  is temporary and said so nowhere; §6.2's operational note was factually wrong.
  The addition is **§3.4**, which answers the question the document asserted and
  never specified — where a set's identity is written — and allocates
  `kind:30852` for it.
- **Date:** 2026-08-31
- **Builds on:** [RFC 0.4](RFC-0.4-WORKSPACE.md), which is accepted and unchanged by this document
- **Supersedes:** *nothing.* A higher number here does not retire 0.4 — see the
  note in its header. Containment and projection are still specified there; this
  document covers how files **relate** and how they are **addressed**


RFC 0.4 settled *containment* (what holds what) and *projection* (how one app renders another's objects). It left one thing unspecified that turns out to carry most of the product weight: **how two files in different apps relate to each other.**

That question became urgent for a specific reason. Under 0.4 a Folder may hold several files of the same kind — three topics and two projects — so the old answer, where a Ship project's conversation *was* a Peek topic because they shared one channel, stops working. **The container can no longer be the relationship.**

## 1. Three tiers, and only the third is new protocol

| tier | what it means | mechanism | who may |
| --- | --- | --- | --- |
| **none** | the files do not know about each other | — | — |
| **basic** | one file shows another in its panel — "these are related" | a tag on the file | whoever may write that file |
| **facet** | the files are perspectives on **one thing**; their conversations merge | a tag on the file, honoured under §4 | whoever may write that file |

The tiers are cumulative in strength, not in mechanism: basic and facet are both **a tag on a file record**, and they differ in what a reader does with them.

**Mentions are not a tier.** A mention is something a person typed in a message; it may *suggest* an association (§5.3) but it never creates one.

## 2. Basic association

A file may name other files that belong beside it. A reader renders them in a panel, using each one's own projection ([RFC 0.4 §13](RFC-0.4-WORKSPACE.md)).

**It is shared, not personal.** Pinning a project beside a topic is somebody organising the workspace for everyone, not setting a preference. A per-person version would be app-private storage ([SPEC §12](SPEC.md)) and is a different feature; this is not that.

**It is a tag on a replaceable record, deliberately.** The alternative — a separate link event — is hard to take back: a `kind:5` is a request the relay accepts only from the event's author or that author's NIP-OA owner ([SPEC §6.5](SPEC.md), corrected 2026-09-06), so anyone else who wants the link gone has no move at all. A tag on a replaceable record can be edited away by the same person who added it.

The conclusion is unchanged by that correction; the premise is narrower than it was written. This workspace does carry permanent artefacts created the other way.

**It is not symmetric and does not need to be.** A topic naming a project says nothing about what the project names.

## 3. Facets

> **Withdrawn 2026-09-08. Superseded by [§10](#10-aspects-why-facets-were-never-needed).**
>
> Kept in full rather than deleted, because the reasoning below is what
> produced §4, and §4 is what proves the mechanism unnecessary. A reader who
> deletes this section loses the argument that retired it.
>
> Nothing implemented it. `kind:30852` (§3.4) was allocated and never published;
> it is now free for labels ([RFC 0.4](RFC-0.4-WORKSPACE.md) §4, FOL-5/FOL-6),
> which is a different use of the same "a named set of files" idea.

A **facet set** is a group of files that are perspectives on one thing. A Ship project, a Peek topic and a Leaf document may all be facets of the same work.

**What it does:** a reader viewing any member shows the comments anchored to *every* member, merged and ordered by time.

**What it does not do:** copy anything. A comment stays anchored to the file it was written against, permanently. The merge is a read-time union.

> That distinction is the whole advantage over the integration this resembles. Linear's Slack sync produces the same experience by **copying** — a Slack reply *becomes* a Linear comment — and every limitation it documents follows from the copy: a bot must be invited to private channels, direct messages are unsupported, files lost in transit cannot be attached, and two records of one conversation can disagree about a duplicate. None of that applies to a union of one set of events.

### 3.1 Declaration is one-sided; the effect is two-sided

A **`kind:39000` Peek topic is signed by the relay**, so Peek cannot add a tag to it. Symmetric declaration is therefore impossible, not merely inconvenient.

So: **a facet holds if any member declares it**, and it binds every member's view.

> **The constraint is temporary; the design should not be** — noted 2026-09-04.
> A topic is relay-signed *because a topic is a channel*, and [RFC 0.4
> §11.1](RFC-0.4-WORKSPACE.md) makes a topic a **file inside** a Folder, at
> which point Peek signs it and symmetric declaration becomes possible. One
> sidedness is still the right answer — it is simpler, and it makes the
> declaration the authorization at no cost — but it must stand on that argument
> rather than on impossibility, or it gets reopened the first time somebody
> notices the premise expired. It also means the hardest case for §3.4 below is
> the one that goes away first.

The consequence is that the declaration is also the authorization. **You may only declare a facet on a file you can sign**, which means nobody can speak for an object they do not own — and no new permission model is required to get that.

The residual risk is noise rather than disclosure: somebody may attach their object's conversation to yours without asking. Inside a shared access boundary (§4) they could already read all of it, so nothing is revealed. **This is deliberately deferred** — see §7.

### 3.2 A set, never pairwise links

A facet set has *n* members and one identity. It is not a graph of pairwise links.

Pairwise forces a choice between two bad answers. **Transitive** means one careless link silently merges three conversations and the chain has no bound. **Non-transitive** means a three-way relationship is a triangle maintained by hand, which drifts the moment one edge is forgotten.

A set has neither problem, and the three-way case — a Leaf document, a Peek topic and a Ship project as one thing (§9, example G) — is an ordinary three-member set rather than a special case.

### 3.3 A facet set is not a Folder

They are structurally similar — a named thing listing addresses under access rules — and they must stay semantically distinct.

**A Folder holds files that belong together. A facet set holds files that are the same thing.**

They answer different questions and should not constrain each other. **A Folder organises — it is where a file lives and how somebody navigates to it. A facet joins — it says two files are one thing.** Faceted files usually will share a Folder, because things that are the same thing usually are filed together; that is a tendency and must not become a rule.

If the two ever merge, every Folder unions the conversations of everything inside it, which is precisely the container-is-the-relationship behaviour this document exists to replace.

> **Amended 2026-09-04.** §4's enforcement contradicted this section in practice, by making every representable facet Folder-shaped. §4 now states its rule over the access boundary instead, which is what it was always a proxy for.

### 3.4 How a set is identified on the wire

**This is the one thing §3 did not specify, and it is what acceptance waits on** (SHA-13, 2026-09-04). §3.2 asserts *a facet set has n members and one identity*, §1's table says the mechanism is *a tag on the file*, and nothing anywhere said what that tag is or where the identity lives. The two statements are not compatible as written.

**The tension, stated plainly.** §3.1 says *a facet holds if any member declares it, and it binds every member's view.* §3.2 says the result is a set and explicitly not a transitive graph. A tag on one file can only name *other files*, so a reader given "A names B" and "B names C" must choose:

- **close it transitively** — every member sees the same thing, and §3.2's objection lands: one careless declaration merges three conversations, with no bound on the chain. Worse than the modelling objection, computing the closure means iterative queries to unbounded depth against a relay
- **do not close it** — the set differs by which member you are viewing, and §3.1's *binds every member's view* is false

Neither is what §3.2 describes. A set with one identity needs that identity written down.

#### The four candidates

| | one identity | same view for every member | a member whose app knows nothing of facets | undoing it |
| --- | --- | --- | --- | --- |
| **1 · Shared set id** — `["facet","<uuid>"]` on each member | yes, by construction | yes — one query, `{"#facet": ["<uuid>"]}` | **no** — a member must tag itself, so its app must implement facets | remove your own tag |
| **2 · Address list, closed transitively** | derived, never named | yes | yes | others' declarations still bind you |
| **3 · Address list, one hop** | no | **no** | yes | your own tag |
| **4 · A replaceable facet-set record** naming members with `a` tags | yes — the record's address | yes | yes — members are named, not tagging | one edit, by its author |

**Option 3 is disqualified rather than costed.** It breaks §3.1 outright: viewing A gives `{A,B}` while viewing B gives `{A,B,C}`. It is listed because it is what a naive implementation produces by accident.

#### Why the cheapest option is not the cheapest

Option 1 is the most elegant on paper and has one problem: **a member must tag itself, so it cannot include an object whose app has never heard of facets.** Today that is a relay-signed `kind:39000` topic, which is the flagship case — a Ship project and a Peek topic as one thing. It is also §9's example J, the test this document sets itself: *an HR tool publishes a job position and writes no chat-app code… if this needs HR-side code about the chat app, the design is wrong.* Under option 1 the HR tool must implement facet tags to participate at all.

Two ways out of that, and both cost more than they look:

- **Wait for [RFC 0.4 §11.1](RFC-0.4-WORKSPACE.md)**, which makes a topic a file its app signs. That fixes the topic and not example J, and it puts facets behind the topic migration — the largest and last piece of the folder work.
- **Let a member name another object into the set** — a second tag, `["facet-member","<uuid>","<address>"]`. This works today and fixes example J, and **it concedes the principle that made option 1 elegant.** §3.1's appeal is that *the declaration is the authorization*: you may only declare on a file you can sign, so nobody speaks for an object they do not own. Naming another object into a set is exactly speaking for an object you do not own.

So the real comparison is not *keep the clean authorization model or break it*. It is **break it quietly and scattered across member records, or break it openly in one record.**

#### Decided 2026-09-05 — option 4, with one rule

Once the principle is conceded either way, option 4 is better on every remaining axis: the set has an address, so it can be linked to, named and versioned where a bare uuid has nowhere to put a name; removal is one edit rather than §3.1's *withdrawing every standing declaration* across records owned by several people; and there is one membership model rather than a permanent split between members that tag themselves and members that get named.

Its cost is an inbox problem option 1 does not have — anyone may assert membership for objects they own none of — which makes §8's deferred *who may create a facet* urgent.

**Upstream has already solved this, for the same shape, and their rule is better than the obvious one.** Buzz's NIP-MP defines `kind:30621`, an addressable record grouping NIP-34 repositories by coordinate, and reaches option 4 by the same route this section did:

> *Per-repository tags cannot express cross-owner grouping. If membership lived in each `kind:30617`, a project spanning Alice's and Bob's repositories would require both Alice and Bob to publish a tag naming the group. Alice cannot enroll Bob's repository; she cannot sign for his key.*

Its answer to the inbox problem is **not** a restriction on who may publish one. It is a per-member read rule, which NIP-MP calls *claim authority*: anyone may publish a project naming anyone's repository, and it renders — cross-owner grouping works, which is the point of the kind. What an unauthorized grouping cannot do is **change what the member's own surface looks like**; the repository still renders as its own card as well. *"A signed assertion silently becoming control over another owner's discovery surface"* is the failure the rule exists to prevent.

Adopted here, per member rather than per set:

> **Anyone may publish a facet set naming any object. A member's own view merges a set's conversations only when the set's signer is authorized by that member** — the member's author, or someone the member's own record names as able to write it.

That is strictly better than restricting who may create a set. A rule like *the author must be able to sign at least one member* would still let somebody who owns one member bind every other object in the set unilaterally, while blocking a legitimate third-party grouping outright. Reading authority from each member's own content gives §3.1's property back exactly where it mattered — **nobody's grouping rewrites your object's conversation without your record saying so** — and leaves the grouping itself visible to whoever wants it.

Example J still passes: the chat app owns the topic and names the position, the grouping renders, and the HR tool writes nothing. The position's own surface merges the topic's conversation only if the position's record says the chat app may write it, which is the honest answer to a claim its owner never made.

**What it costs, stated rather than minimised.** It is a new kind, which is a Buzz change, and *"no new kind and no Buzz change"* was the claim that made accepting this document cheap. Two things make that smaller than it first reads: a facet-set record is a plain addressable record rather than relay-maintained state — closer to Ship's `kind:30850`, which §10.1's research found was *"one line to change"*, than to the folder command and state kinds it warns will not be; and if the folder kinds go upstream (FOL-1), adding this one to that proposal is marginal rather than a second ask.

#### The kind

`kind:30852` — a **Set**: an addressable record listing files that belong together, signed by whoever assembled it.

| kind | name | signer | class | purpose |
| --- | --- | --- | --- | --- |
| `30852` | Set | user | addressable | A named group of files, addressed by `(pubkey, 30852, d)` |

**One primitive, three readings.** The set declares its own role, and a reader does something different with each — which is [§1](#1-three-tiers-and-only-the-third-is-new-protocol)'s pattern, not a new one:

- `facet` — the members are **the same thing**; merge their conversations (§3).
- `label` — the members **belong together**; group them in navigation. This is what makes many flat teams usable.
- `collection` — one file gathering others, for a panel (§2's basic association, given a name).

**A role a reader does not recognise groups and never merges.** Merging is the only reading with a disclosure consequence, so it is the one an unknown value must never reach — the same fallback discipline the widget chain uses, and for the same reason.

**Allocated in Estiva's own block**, following FOL-1's decision to fork and RFC 0.4 §12.1's convention: `3089x` is reserved for relay-signed state, and a Set is user-signed, so it sits with the other user-signed records.

| registry | checked | result |
| --- | --- | --- |
| Upstream nostr NIPs kind table | `30850`–`30899` | Unassigned. Parse validated against seven known assignments before any absence was believed |
| nostrbook.dev | `30852`, `30853` | HTTP 404 — no entry. Control: `30617` returns 200, so a 404 distinguishes *unregistered* from *unreachable* |
| `buzz-core/src/kind.rs`, upstream `main` | `30840`–`30899` | Nothing assigned |

Both external registries are advisory rather than authoritative. A future upstream assignment is absorbed the way NIP-MP absorbs its own: **interoperability rests on the member files**, which stay standard and readable by anything, not on the grouping.

**Still to decide, and deliberately not decided here:** the tag names; and how a member's record says who may write it — NIP-34 has a `maintainers` tag doing this job, and Estiva's records have no equivalent, so the authorized set reduces to the author until one exists.

**Worth reading before implementing:** NIP-MP's fold, which is ten numbered steps and a table of required cases. Several are not obvious and each is a branch somebody would otherwise find in production — a member that resolves to nothing must render as explicitly unavailable rather than be dropped, because *"silence makes a project look smaller than its author declared"*; hiding a grouping must never hide its members; and one authorized claim among several is enough. The facet equivalents are the same shape.

## 4. The invariant: facets may not cross an access boundary

**A facet set MUST NOT merge conversations that are not equally readable.**

This is [RFC 0.4 §4.4](RFC-0.4-WORKSPACE.md) — *the relay must refuse a private folder whose channel is not private* — one level up, and for the same reason.

**What fails without it is not disclosure to outsiders.** The relay still gates content: a reader who is not a member fetches nothing. What fails is **context collapse for the person who can see both sides.** Somebody with access to a private huddle opens a public project, sees the private discussion merged into a public-feeling view, and answers there. Nothing leaked; somebody was misled into leaking.

That is why it is enforced at write time rather than trusted to every reader's UI, now and in every app not yet written.

**Enforced today as a read rule.** This said: *honour a facet only when its members share a Folder.* **Restated 2026-09-04, over the access boundary rather than over the Folder** — honour a facet only when its members are **equally readable**, which today means their **channels** are.

Three reasons the original wording was wrong rather than merely coarse.

- **It names the wrong noun.** [RFC 0.4 §4.2](RFC-0.4-WORKSPACE.md) is explicit that *"the channel stays and keeps doing access and conversation; the folder becomes a layer above it."* Access is a property of the channel. A rule about readability stated over Folders is a rule stated over the layer that does not carry the thing it is protecting.
- **It is ambiguous in a way that can leak.** [§5.1](RFC-0.4-WORKSPACE.md) gives a file *one home, many references* — a file may be listed in a Folder that is not its home. Read as "listed in the same Folder", two members can share a Folder and live in different channels with different access, which is the exact failure this invariant exists to prevent. Read as "same home Folder" it is sound, and it is then just a longer way of saying *same channel*.
- **It forbids everything and protects against nothing, here, today.** RFC 0.4 §4.2 records that **all 50 of production's channels are `open`**. Equally readable is therefore true of every pair of them, and the same-Folder rule refuses every cross-Folder facet in a workspace where no facet could collapse any context.

**What a reader can actually evaluate.** Two open channels are equally readable and any client can see that. Where a channel is private a client may not be able to compare membership at all — it cannot read a channel it is not in — so that case falls back to *same channel* until the relay enforces the invariant at write time (§8). This is deliberately incremental: it unblocks every facet that is safe today without weakening the invariant by a single case.

**The invariant itself is unchanged.** A facet set MUST NOT merge conversations that are not equally readable. What changed is that the enforcement no longer borrows a container's shape to express it — §3.3.

## 5. Comments, mentions, and what attaches to what

### 5.1 Two relationships, two sections

An object's page has **two** lists, and merging them is the mistake this section exists to prevent.

| | in the data | shown as |
| --- | --- | --- |
| **Comments** | uppercase `A` at the thread root — the thread *is* about this object | the object's discussion |
| **Mentions** | an `a` tag on the root that is not its `A`, or an address in a body — [SPEC §6.4](SPEC.md) has the per-tag rule | *Mentioned in*, secondary and collapsed |

[SPEC §6.4](SPEC.md) already states the attaching rule: *a thread belongs to whatever anyone in it referenced, at any point, and the whole thread attaches.* That rule is correct **and it is only defensible because the two are separated.** A twenty-message thread that name-drops an issue on message twenty-one belongs under *Mentioned in*; putting it in the issue's comments would be indefensible.

### 5.2 A mention cannot be withdrawn, and does not need to be

Message content is immutable, so an accidental mention attaches permanently. That is acceptable **because mentions are secondary**. It would not be acceptable for comments, which is another reason the two must not merge.

### 5.3 A mention may suggest an association; it must never create one

An app seeing a mention MAY offer to add a basic association (§2). It MUST NOT write one automatically. Mentions arrive retroactively and by accident (§5.2), and a shared page must not silently reorganise itself because somebody typed a reference.

## 6. What happens when things change

The two cases that catch design errors.

### 6.1 A facet is removed

**Un-facet splits the thread list. It never splits a thread.**

A reply carries its thread's root, not the object the author happened to be looking at ([SPEC §6.4](SPEC.md)). So a reply written in Ship to a thread rooted on a topic is anchored to the topic. When the facet is removed, every thread leaves whole, following its root; only the collection divides.

**Removal means withdrawing every standing declaration**, since a facet holds if any member declares it (§3.1). In the common case one member is the only declarer and removal is a single act.

**A reader MUST NOT silently drop content.** With a live connection the record replaces and threads leave the view mid-read. That is the *changed since load* state, and it has to be shown.

### 6.2 A member is deleted, or archived

**Deleting an object does not delete its comments.** SPEC §6.5: it removes the record, not the work — children are separate events with their own authors.

Two consequences, and the first is a property worth keeping:

- **Deletion cannot destroy another party's conversation.** Delete a project faceted with somebody's topic and their view loses the project card and keeps every comment. If it were otherwise, accepting a facet would be dangerous.
- **Orphaned comments are correct**, and need the *deleted* state from RFC 0.4 §13.3's set: a comment anchored to an address that no longer resolves still belongs to whoever wrote it.

**Archive is not delete, and must not behave like it.** An archived member is hidden as an object; its conversation stays. Hiding the discussion when somebody tidies the subject is editing history by accident — and SPEC §6.5 already forbids offering the two as styles of one control.

**One operational note, corrected 2026-09-04.** This read: *an identity without `kind:5` — the agent, today — can only ever archive; anything it creates as a facet member is permanent.* **The premise was wrong.** The agent's `allowedKinds`, read from its Estiva ID token on 2026-08-30, are `[5, 9, 1111, 1851, 9007, 27235, 30850, 30851]` — `kind:5` is permitted, and a deletion from that identity was published, accepted and honoured, with the surrounding conversation still readable as a negative control.

The conclusion survives for a different reason, which is the one to cite: **archive rather than delete**, because deleting a project record orphans its issues and NIP-09 deletion is a *request* to relays rather than a reversal. Nothing a facet member creates is permanent for want of a credential.

## 7. Addressing: what a link looks like

Association (§2–§3) says which files relate. This says how a person *gets to*
one, which turned out to be a protocol question rather than a per-app choice.

### 7.1 The scenario that decides it

**People copy the address bar.** Not a "Copy reference" button — the URL of the
page they are looking at. Any design that only works when somebody uses the
right affordance is a design for the case that does not happen.

So the URL an app puts in the address bar has to be resolvable by another app.
That makes it wire-visible under [SPEC §10](SPEC.md)'s test — two apps can
disagree about it and a user sees the difference — and therefore something this
document should settle rather than each app.

### 7.2 The grammar

```
https://<app>.estiva.app/<type>s                        a directory of that kind
https://<app>.estiva.app/<type>/<slug>-<d>              one object
```

```
ship.estiva.app/projects
ship.estiva.app/project/peek-intelligence-9c69f247-be6a-4ae7-9703-71cb971f5f93
peek.estiva.app/topic/design-review-925897ad-796e-4bc6-999c-ca19df26c4aa
```

Three properties, in the order they matter:

**The `d` is the whole identity, and it is not truncated.** A consumer resolves
`{kinds: [<type>], "#d": ["<uuid>"]}` — one query, no index, no service to keep
alive. The worst failure is a link that does not expand; never one that cannot
be resolved at all.

**The kind comes from the path segment**, which is why `<type>` is part of the
grammar rather than decoration. `/project/` means `30850` to the app serving it.

**The slug is decorative and load-bearing for humans only.** Renaming the object
changes the slug and the link still resolves, which is the property that keeps
old links working. A consumer MUST ignore **the slug** — that is, everything
between the `<type>` segment and the final uuid.

*Amended at acceptance.* This read "MUST ignore everything before the final
uuid", which contradicts the paragraph above it: the host and the `<type>`
segment are exactly what select the app and the kind, and a consumer that
ignored them would resolve `evil.example.com/issue/<uuid>` as a Ship issue. The
sentence meant the slug. It is worth being exact, because the parser a reader
writes from the loose wording is the insecure one, and §7.5's matching depends
on the host being significant.

### 7.3 Why not the naddr, which is the obvious first answer

An `naddr` is bech32 over `(kind, pubkey, d, relay hints)` **plus a checksum
computed across the whole string.** Two consequences, and both are fatal to
using it — or a slice of it — as a URL suffix:

- **A slice of it means nothing.** The tail is checksum bytes, not the `d`. You
  cannot resolve from it without a suffix→object index, which is a service that
  can go down and take every link with it.
- **It is not stable for one object.** Relay hints are part of the encoding, so
  the same object encoded with a hint and without produces two different naddrs.
  Both are live in this workspace today: Ship's `referenceFor` passes a hint and
  the projection runtime's `buildObject` passes none.

The full naddr in a URL would be self-contained but carries a 32-byte pubkey for
no benefit — §7.4 removes the need for it.

### 7.4 The pubkey does not belong in the URL

An addressable object is `(kind, pubkey, d)`, so dropping the pubkey looks
lossy. It is not, because **`d` is a v4 uuid** ([RFC 0.4](RFC-0.4-WORKSPACE.md)
§4.3) and a uuid does not collide.

Measured on production, 2026-08-31:

| kind | events | distinct `d` | non-uuid `d` | `(kind, d)` shared by more than one author |
| --- | --- | --- | --- | --- |
| `30850` Project | 15 | 15 | 0 | **0** |
| `30851` Issue | 156 | 156 | 0 | **0** |
| `39000` Topic | 64 | 64 | 0 | **0** |

Re-measured 2026-09-03, at acceptance, with the corpus 25% larger:

| kind | events | distinct `d` | non-uuid `d` | `(kind, d)` shared by more than one author |
| --- | --- | --- | --- | --- |
| `30850` Project | 15 | 15 | 0 | **0** |
| `30851` Issue | **195** | 195 | 0 | **0** |
| `39000` Topic | 70 | 70 | 0 | **0** |

So a `#d` query returns exactly one object, and the URL is 36 characters shorter
than it would otherwise be. Verified directly rather than inferred:
`{kinds: [30851], "#d": ["<uuid>"]}` against production returns one event.

**One property beyond what this section claims**, measured at the same time and
worth recording because it bounds the damage from a malformed link: **no `d` is
reused under two different kinds** — 0 across all 280 records. So a link whose
`<type>` segment is wrong resolves to nothing rather than to a different
object.

**This adds a second reason to a rule that already exists, and the rule is now
load-bearing in a new place.** §4.3 requires a uuid `d` so that a rename cannot
change an address. Addressing now depends on it for *uniqueness*: an app that
used a readable `d` — the obvious thing to reach for when writing a slug — would
not fail loudly, it would collide with another app's object and resolve to the
wrong one. The MUST stays; what changes is that violating it now has a second,
quieter failure.

### 7.5 A consumer resolves an app it has never met

An app declares the URL shapes it uses in its manifest, alongside the `web`
template that says how to *open* an object:

```jsonc
["web",  "https://ship.estiva.app/o/<bech32>", "naddr"]
["urls", "https://ship.estiva.app/project/<slug>-<d>", "30850"]
["urls", "https://ship.estiva.app/issue/<slug>-<d>",   "30851"]
["urls", "https://ship.estiva.app/#/issue/<d>",        "30851"]
```

*Amended at implementation.* This was drafted as manifest **content**; it is a
**tag** on the `kind:31990` event, beside `web`, because that is where NIP-89
puts the outbound half and a consumer reads both from the same place.

**The third element is the kind**, and it is what makes this work for an app the
consumer has never met. §7.2 says the kind comes from the path segment — true of
the app *serving* the URL, and useless to a consumer, which has never heard of
"issue". An app MAY omit it and a consumer then falls back to the kinds the
manifest declares it handles, which is sound only because §7.4's measurement
holds; naming it is cheaper and says what was meant.

**The last line is not clutter.** Ship served fragment routes until SHI-16 and
still declares them, so links already sitting in other people's messages resolve
rather than rendering as plain text for ever. That is the same argument as
`emits.alsoRead`, one layer up: an app that changes its routes still has to read
what it already published.

`web` is outbound — given an object, build a link. `urls` is inbound — given a
link, recover the object. They are usually the same strings and are separate
fields because they answer different questions, and because an app that changes
its routes still has to read the links it published under the old ones.

**A consumer matches a pasted URL against the patterns from every published
`kind:31990`.** Those are global and queryable ([SPEC §7](SPEC.md)), so this
works for an app the consumer has never heard of, with no per-app integration,
no central registry and no server. It is §13.1's inversion again: the owner
declares, the consumer decides.

A URL matching no published pattern renders as a plain link. That is the honest
outcome — it is a link, and nothing claims otherwise.

### 7.6 What this requires, and what it does not solve

**Paths, not hashes.** Ship used hash routing because it is served as static
files with `try_files … =404`; a real path 404s on reload. Path URLs need an
`index.html` fallback in each app's nginx config. This is small and it is
infrastructure, so it is named rather than assumed.

*Done, 2026-09-03 (SHI-16).* Ship serves `/project/<slug>-<d>` and
`/issue/<slug>-<d>`, the fallback is in `deploy/nginx.conf`, and a deep path
returns 200 on reload rather than 404. Links published under the old hash shape
still resolve, and are declared in `urls` so consumers resolve them too. **Both
apps now implement §7**, which is what moved this section from a proposal to a
description.

**Peek is the reference implementation.** *Corrected at acceptance.* This read
"Peek has no object URLs at all… the prerequisite rather than a later polish",
which was true when it was written and is not now: PEE-14 shipped
`/topic/<slug>-<channel-uuid>`, which is §7.2's grammar, with the Peek-private
`/topics/<id>` links redirecting to it once the topic resolves.

That changes this document's standing more than any other correction here. §7 is
not an unimplemented proposal — half of it is deployed, and the deployed half is
what the grammar was checked against. What remains is Ship, whose blocker is the
nginx fallback named above rather than anything in this section.

**A message is named by its event id, and that is an identity this grammar
carries.** A `kind:9` has no `d`, so §7.2's `<d>` cannot name one. The path
takes the event id instead:

```
https://<app>.estiva.app/<type>/<slug>-<id>          64 hex, an event id
https://<app>.estiva.app/<type>/<slug>-<d>           36 chars, a uuid
```

*Amended 2026-09-04, after PEE-17 needed a link to one.* This section twice said
a message had **no place** in the grammar — first as "deliberately not solved
here", then as "addressed by `nevent`, outside this grammar". Both were the same
mistake in different words: an `nevent` is bech32, and putting bech32 in a URL is
what §7.3 argues against. Its two objections apply to `nevent` exactly as they do
to `naddr` — a slice of it is checksum bytes rather than the identity, and relay
hints are part of the encoding, so one object has more than one spelling.

**A raw event id has neither problem.** It is the whole identity of an event with
no `d`, nothing optional is encoded into it, and it resolves with
`{ids: ["<id>"]}` — one query, no index, which is the property §7.2 chose the
bare uuid for in the first place. So the rule generalises rather than gaining an
exception: **the identity goes in the path, unencoded, and everything before it
is decoration.**

**A manifest declares which identity a shape carries**, by writing `<id>` or
`<d>` in the pattern (§7.5). A consumer reads it from the declaration rather than
from the value: a uuid and a 64-character hex string are distinguishable today,
and a consumer relying on that would be inferring an app's addressing model from
a character class. `<id>` resolves with `ids`, `<d>` with `#d`.

An id MUST be all 64 characters. A shorter run is a truncated id, and it either
resolves to nothing or to something nobody intended.

`web` is unaffected: it still names an `nevent` for a message, because it is
handed to NIP-19 machinery rather than pasted by a person, and §7.3's objections
are about URLs.

## 8. Deliberately deferred

Per the roadmap's rule 2, with triggers rather than guesses.

| deferred | why | trigger |
| --- | --- | --- |
| ~~**Who may create a facet, beyond "you can sign the file"**~~ **— answered by §3.4** | signing gave a defensible rule at zero cost, and §4's invariant removed the risk that would make a permission model urgent | **no longer deferred.** §3.4's recommended shape has an author who names objects they do not own, so it carries its own rule: a set record is honoured only if its author can sign at least one member. What stays deferred is whether a named member may opt *out* |
| **Enforcing §4 at the relay** | a read rule covers every case a client can evaluate — two open channels — and a Buzz change is expensive to land | **partially fired 2026-09-04**: cross-*Folder* facets are wanted now, and §4's restatement admits them without the relay. What still needs the relay is a facet whose members sit in channels a client cannot compare, which means the first private channel |
| **Whether a merged view labels which facet a comment was written against** | the default is not to, following the design guide; the exception is facets with differing access, which §4 currently forbids | §4 being relaxed |

## 9. Worked examples

**Illustrative, not evidence.** These are worked cases for reasoning about the design, in the way a specification uses examples. They are not reports of things that happened and must not be cited as demand.

**A · Two sections.** An issue has four comments — two written in the tracker, two in chat — and below them, collapsed: *Mentioned in 2 conversations*. One is a release thread that wrote "blocked on this"; the other a design review that named it in passing. Neither belongs in the comments.

**B · Retroactive attachment.** A twenty-message hiring conversation mentions the issue on message twenty-one. The whole thread appears under *Mentioned in*. Acceptable only because that section is secondary (§5.1).

**C · Two people, two counts.** The issue is mentioned in three conversations, one of them a private huddle. One reader sees *Mentioned in 2*; another sees *3*. Neither is told the number is theirs. That is the privacy rule working, and its cost stated (§4).

**D · Organising for everyone.** A Folder holds three topics and two projects. Somebody pins one project into a topic's panel; everybody sees it tomorrow (§2).

**E · Suggested, not automatic.** A first message mentions a project. The app offers to pin it. Accepting writes D's tag (§5.3).

**F · One conversation, two views.** *Rewritten 2026-09-08 — this was the case facets existed for, and it is why they are not needed.* There is no topic standing in for the project. The project is one file; Peek draws its conversation and Ship draws its properties. A comment written in Peek is a comment on the project, and appears in Ship because it is the same conversation, not a merged one (§10).

**G · One file, three aspects, one block.** A file has a document, properties and a conversation. A comment anchored to a paragraph shows wherever that file's conversation is drawn — in Leaf beside the paragraph, in Peek and in Ship as a comment that names it — still identified as being on that paragraph rather than flattened to the file (§10.2).

**H · The context collapse that must still be refused.** With no merge there is nothing to refuse *here* — but the risk did not vanish, it moved. Listing a file into a Folder whose readers are not the file's readers puts a private discussion in a public-feeling view for the one person who can see both. That is now governed where access lives: [RFC 0.4 §4.2](RFC-0.4-WORKSPACE.md) and §5.1's *one home, many references*. §4's reasoning survives its mechanism.

**I · The file is deleted.** A project is deleted. Its conversation is not copied anywhere, so there are no other views to keep it — the comments are anchored to a file that is gone, exactly as any file's are (§6.2, which now applies to one file rather than to a set).

**J · The third app.** An HR tool publishes a job position and writes no chat-app code. Comments anchor to the position, and the chat app lists it in its Folder and draws its conversation under the job title — because that is what it does for every file, not because anyone paired anything. **The clause about later faceting it with a topic is gone, and its absence is the point:** under §10 there is nothing to pair. If this needs HR-side code about the chat app, the design is wrong.

## 10. Aspects: why facets were never needed

**Decided 2026-09-08.** Facets are withdrawn. Nothing replaces them, because the
thing they were built to do turns out not to need a mechanism.

### 10.1 The mistake, stated plainly

A facet existed so that a Ship project and a Peek topic could be *"perspectives
on one thing"* whose conversations merge. But they were only ever two things
because **Peek could not render a project's conversation.** A topic was created
to stand in for the project, and then a mechanism was needed to glue the stand-in
back to the thing it stood for.

Remove the limitation and the pairing has nothing to do. There is one file — the
project — and Peek shows its conversation directly.

**A facet was a workaround for a missing view, promoted to protocol.**

### 10.2 The model

A file has three parts, and each app renders the ones it owns:

| part | what it is | who draws it |
| --- | --- | --- |
| **document** | the content of the file | Leaf |
| **properties** | status, assignee, dates — what a *type* adds | Ship |
| **conversation** | the discussion attached to it | Peek |

An app shows every file in a Folder and renders **its own aspect** of each. Peek
lists a Ship project beside a Peek topic and a Leaf document, and draws the
conversation of all three. It does not render the document; that is Leaf's
aspect, and a link takes you there.

**A Peek topic is then a file whose document is empty.** It carries only the
conversation every other file already has. That is not a special kind of thing —
it is the degenerate case of the general one.

### 10.3 Why this is not a smaller facet

A facet merged *several files'* conversations into one view. Aspects merge
nothing: there is **one file** and one conversation, shown by whichever app you
happen to be in. No union, no ordering question, no read-time merge, and no rule
about what happens when a member leaves the set — §6 stops applying rather than
being reimplemented.

### 10.4 §4 is what proves facets redundant

The invariant already accepted in §4 is the argument, and it was in the document
before this section was written:

> **A facet set MUST NOT merge conversations that are not equally readable.**

So a facet could only ever join files **inside one access boundary**. And inside
one access boundary the two structures RFC 0.4 already has — a Folder that holds
files, and a file that holds sub-files — express every relationship a facet
could:

- Two things that are *the same thing* are one file with several aspects.
- Two things that are *related* are a file and its sub-file, or two files in one
  Folder, which is §2's basic association.

Facets were therefore redundant **given their own invariant**, not merely
replaceable. That is the strongest form of this argument and it is worth stating
in exactly those terms, because it means nothing was lost by withdrawing them.

### 10.5 What this costs, and the one thing it requires

Not free, and the cost is concentrated in one place: **a Peek topic must become
an ordinary addressable file whose conversation is scoped to it.**

> **Decided 2026-09-11, the shape of that file and that conversation.** A topic
> is a **bare file** (§10.7), and a message in a topic is a **`kind:1111`
> comment on it** — `h` the team's channel, `a` the topic's address — which is
> byte-for-byte the shape Ship's issue comments already have. The team's general
> conversation stays `kind:9` in the channel: chat is talking *in* a room, a
> comment is talking *about* a file, and the line between them is the kind. The
> alternative — `kind:9` carrying an `a` tag — was rejected because it makes one
> kind mean two things, told apart only by a tag's presence, and hands every
> affordance (reaction, edit, delete, thread) a third case. **No migration**: an
> existing channel becomes a team and its messages that team's general
> conversation; new topics are files inside it.

Today a topic *is* a channel — a relay-signed `kind:39000` whose `d` is the
channel uuid, with `kind:9` messages carrying `h` and no `a`. So a topic's
conversation is *the container's* conversation. That is exactly why a topic
cannot sit beside a project as a peer today, and it is
[RFC 0.4 §11.1](RFC-0.4-WORKSPACE.md), which already warns the change is
plausibly larger than the Ship rewrite.

Everything else in §10 follows from work that already exists:

- **A consumer can already find another app's conversation.** `commentKindsOf`
  reads the comment kind off the owning app's manifest, so Peek does not need to
  learn what Ship is to show a project's discussion.
- **A Folder can already list files of any kind as peers.** Built and running:
  `resolveFolderContents` in `@estiva-app/interop` 0.15.0, drawn in both apps.
- **Following stays per-file** and needs no new kind — RFC 0.4 §4.6's private
  `kind:30078` list, pointed at files as well as Folders.

### 10.6 What is deliberately *not* concluded

**"The type only adds properties" does not mean one file kind.** It is tempting
to read §10.2 as arguing for a single `kind:file` with a `type` property. It does
not, and that reading would be expensive to reverse: **NIP-89 ownership is keyed
by kind** ([RFC 0.4 §13](RFC-0.4-WORKSPACE.md)), so one kind means one app owns
every file and the projection layer has nothing left to resolve. Many kinds
stays; §10.2 is a claim about what a person sees, not about the wire.

~~**Whether a Topic survives as a distinct type is open.**~~ If a topic is a
document with no content, it may be a degenerate Leaf document rather than a kind
of its own. Left open deliberately rather than settled here, because the answer
depends on what Leaf turns out to be, and "almost the same as" is how two things
stay nearly identical for ever.

> **Closed 2026-09-11 — it does not, and the answer did not need Leaf.** See
> §10.7. The paragraph above it still stands: many kinds stays, because
> specialized apps own theirs.

### 10.7 Two kinds of app, and the bare file — decided 2026-09-11

**An app is generic or specialized.** A specialized app owns kinds, renders every
aspect of them, and its navigation lists only its own files. A generic app owns
no kinds and renders *one aspect of every file in the workspace* — Peek the
conversation, Leaf the document. Ship is specialized; an HR tool owning
*candidate* and *job description* is specialized; Peek and Leaf are generic.

Three things follow, and the third is the one that closes §10.6.

**A specialized app gets conversation and editing without building either.** A
candidate's discussion happens in Peek and its job description is edited in
Leaf, and the HR app builds only what its properties need — pipeline stage,
interviewer. RFC 0.4 §15's checklist is therefore shorter than it says: the
third app builds its properties, not its comments.

**Navigation is by kind; nesting is by intent.** Ship's tree lists folders and,
inside them, projects and issues. But a foreign file somebody deliberately placed
*under* a project or an issue — a Leaf document that is its technical
documentation, a Peek topic that is a sub-discussion of it — appears on that
file's detail as *Related*, whatever its kind. The placement was a person saying
"this belongs here", and a specialized app may not ignore it. A generic app
lists everything, because in Peek you can talk about any file and in Leaf you
can edit any editable one; the folder tree is therefore one shared view, not a
per-app one.

**A subject no specialized app claims is a bare file**, and the generic apps
handle it completely. A bare file is the generic file kind — `kind:30840`, which
`@estiva-app/protocol` has carried unused — owned by no app: the fallback chain
(RFC 0.4 §13.3) draws it, and each generic app renders its own aspect of it.
Typed kinds add properties on top; a bare file adds none.

**A Peek topic is a bare file.** Not its own kind: by the protocol's own rule
(RFC 0.4 §10, from upstream) a custom kind is for what is genuinely novel, and a
topic's only novelty is an absence — it has no body. Making it a type would
re-create at creation time the problem this section exists to end: a person
choosing "topic or page?" for one subject, and ending up with two things about
it. Not a Leaf document either: §10.2 says the document aspect belongs to
*every* file, so no single app should own the bare one — the same mistake as
Peek owning it. So "new topic" in Peek and "new page" in Leaf make the same
thing, a file's icon derives from its state (empty body, a chat icon; a body, a
page icon), and when a topic wants a pinned brief somebody types one and nothing
"converts". The cost is real and it is a rule rather than a type: channel-like
behaviour (sort by last message, follow by default) versus page-like (sort by
last edit) has to be a per-file setting or derived from content.

**Highlights do not change this; they depend on it.** A highlight — what
mattered in a conversation, for a person catching up and for an AI that should
read the distilled memory rather than every event — is derived from the
*conversation*, and every file has one. A design review on a project's
description wants highlights as much as a topic does. So a highlight is
addressed at the file, like a comment, and a generic app derives them for any
file without knowing its kind. Which kind a highlight is *published as* is still
open (the roadmap's note on `kind:9802` being append-only stands); where it
hangs is not. A topic with no body may show its highlights where the body would
be — a rendering rule, and when a body is written the highlights remain beside
it as a third thing.

**Manifests need one more field.** Today a manifest says which kinds an app owns.
It must also say which *aspect* it renders for everyone else's — the
conversation, the document — or a consumer cannot tell a generic app from a
specialized one that happens to draw a card. That is the one protocol change
this section asks for, and it is additive.
