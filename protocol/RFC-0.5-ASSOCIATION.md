# RFC 0.5 — Association: how files in different apps relate

- **Status:** draft — **§7 (Addressing) accepted 2026-09-03**, §1–§6 still draft

  §7 is separable and was accepted on its own: it answers *how is a file
  addressed*, which the rest of this document does not depend on, and it is the
  only part with an implementation. Peek has served §7.2's grammar since PEE-14.
  The association tiers are a larger question and stay open.

  **§1–§6 reviewed 2026-09-04 (SHA-13) and not yet accepted.** Three
  corrections are made below — §4's enforcement was stated over the Folder
  rather than over the access boundary and contradicted §3.3, §3.1's constraint
  is temporary and said so nowhere, and §6.2's operational note was factually
  wrong. **One thing blocks acceptance**
  and is now §3.4: the document asserts a facet set has one identity and never
  specifies how that identity is written, and the mechanism it does specify
  cannot express one for a relay-signed member. Every way out has a cost, and
  one of them would break the "no new kind, no Buzz change" claim that makes
  accepting this cheap.
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

**It is a tag on a replaceable record, deliberately.** The alternative — a separate link event — cannot be taken back: `kind:5` is author-scoped, and this workspace already carries permanent artefacts created that way. A tag on a replaceable record can be edited away by the same person who added it.

**It is not symmetric and does not need to be.** A topic naming a project says nothing about what the project names.

## 3. Facets

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

### 3.4 Open — how a set is identified on the wire

**This is what blocks acceptance of §3** (SHA-13, 2026-09-04). §3.2 asserts *a facet set has n members and one identity*, §1's table says the mechanism is *a tag on the file*, and nothing anywhere says what that tag is or where the identity lives. The two statements are not obviously compatible.

**The tension, stated plainly.** §3.1 says *a facet holds if any member declares it, and it binds every member's view.* §3.2 says the result is a set and explicitly not a transitive graph. A tag on one file can only name *other files*, and a reader given "A names B" and "B names C" must choose:

- close it transitively — every member sees the same thing, and §3.2's objection lands: one careless declaration merges three conversations, with no bound on the chain
- do not close it — the set is different depending on which member you are looking at, and §3.1's *binds every member's view* is false

Neither is what §3.2 describes. A set with one identity needs that identity to be written down somewhere.

**Four ways out, and none is free.**

1. **A shared set id on each member** — `["facet", "<uuid>"]`, minted by whoever creates the set, resolved with one query (`{"#facet": ["<uuid>"]}`), no index and nothing to go down. Clean, non-transitive, symmetric — and **a relay-signed member can never carry the tag**, which is the case §3.1 says forced the whole design. Becomes available for topics once RFC 0.4 §11.1 lands.
2. **An address list, closed transitively.** Works today for every member including relay-signed ones. Takes §3.2's rejected behaviour, in full.
3. **An address list, one hop, not closed.** Works today; gives each member a different view, contradicting §3.1.
4. **A separate replaceable facet-set record**, naming its members with `a` tags. One identity, non-transitive, symmetric, editable by its author, and it works for a relay-signed member because members are *named* rather than tagging. Two costs: it is **a new kind**, which is exactly the claim that makes accepting this document cheap — *no new kind and no Buzz change* — and its author speaks for objects they do not own, which §3.1's authorization argument was built to avoid.

**Not decided here.** Option 1 is the cleanest and is unavailable for the one case that matters most today; option 4 is the most capable and is the most expensive. The choice is worth making deliberately, because a facet declaration is a tag on a published record and the shape is permanent once anything writes one.

**A scoping note, now smaller than it was.** Under §4's original wording the only representable facets were between files already sharing a channel — a Ship project paired with a Peek topic (§9, example F) — which made the enforcement mechanism container-shaped in a document written to stop the container being the relationship. §4 has been restated over the access boundary, so any two files in equally readable channels may be faceted, which today is any two files at all. §3.4's question is unaffected either way: it is about how the set is written down, not about which sets are permitted.

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
| **Mentions** | an address referenced inside a message | *Mentioned in*, secondary and collapsed |

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
| **Who may create a facet, beyond "you can sign the file"** | signing already gives a defensible rule at zero cost, and the invariant in §4 removes the risk that would make a permission model urgent | the first cross-boundary facet somebody actually wants, or the first complaint about an unwanted one. **§3.4's option 4 would force this early** — a separate set record has an author who speaks for objects they do not own |
| **Enforcing §4 at the relay** | a read rule covers every case a client can evaluate — two open channels — and a Buzz change is expensive to land | **partially fired 2026-09-04**: cross-*Folder* facets are wanted now, and §4's restatement admits them without the relay. What still needs the relay is a facet whose members sit in channels a client cannot compare, which means the first private channel |
| **Whether a merged view labels which facet a comment was written against** | the default is not to, following the design guide; the exception is facets with differing access, which §4 currently forbids | §4 being relaxed |

## 9. Worked examples

**Illustrative, not evidence.** These are worked cases for reasoning about the design, in the way a specification uses examples. They are not reports of things that happened and must not be cited as demand.

**A · Two sections.** An issue has four comments — two written in the tracker, two in chat — and below them, collapsed: *Mentioned in 2 conversations*. One is a release thread that wrote "blocked on this"; the other a design review that named it in passing. Neither belongs in the comments.

**B · Retroactive attachment.** A twenty-message hiring conversation mentions the issue on message twenty-one. The whole thread appears under *Mentioned in*. Acceptable only because that section is secondary (§5.1).

**C · Two people, two counts.** The issue is mentioned in three conversations, one of them a private huddle. One reader sees *Mentioned in 2*; another sees *3*. Neither is told the number is theirs. That is the privacy rule working, and its cost stated (§4).

**D · Organising for everyone.** A Folder holds three topics and two projects. Somebody pins one project into a topic's panel; everybody sees it tomorrow (§2).

**E · Suggested, not automatic.** A first message mentions a project. The app offers to pin it. Accepting writes D's tag (§5.3).

**F · One conversation, two views.** A topic and a project are facets. A comment written in chat appears among the project's comments, ordered by time, unlabelled — and is still anchored to the topic. Nothing was copied (§3).

**G · Three facets, one block.** A document, a topic and a project are one facet set. A comment on a paragraph of the document appears in all three views, still identified as being on that paragraph rather than flattened to the document (§3.2).

**H · The facet that must be refused.** Making a private huddle a facet of a public project would collapse context for the one person who can see both. Refused by §4.

**I · The subject is deleted.** A faceted project is deleted. The other views lose its card and keep every comment (§6.2).

**J · The third app.** An HR tool publishes a job position and writes no chat-app code. Comments anchor to the position, the chat app groups them under the job title, and somebody later facets it with an existing topic. If this needs HR-side code about the chat app, the design is wrong.
