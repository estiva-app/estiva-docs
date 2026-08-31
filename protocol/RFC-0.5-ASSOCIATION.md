# RFC 0.5 — Association: how files in different apps relate

- **Status:** draft, not accepted
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

The consequence is that the declaration is also the authorization. **You may only declare a facet on a file you can sign**, which means nobody can speak for an object they do not own — and no new permission model is required to get that.

The residual risk is noise rather than disclosure: somebody may attach their object's conversation to yours without asking. Inside a shared access boundary (§4) they could already read all of it, so nothing is revealed. **This is deliberately deferred** — see §7.

### 3.2 A set, never pairwise links

A facet set has *n* members and one identity. It is not a graph of pairwise links.

Pairwise forces a choice between two bad answers. **Transitive** means one careless link silently merges three conversations and the chain has no bound. **Non-transitive** means a three-way relationship is a triangle maintained by hand, which drifts the moment one edge is forgotten.

A set has neither problem, and the three-way case — a Leaf document, a Peek topic and a Ship project as one thing (§9, example G) — is an ordinary three-member set rather than a special case.

### 3.3 A facet set is not a Folder

They are structurally similar — a named thing listing addresses under access rules — and they must stay semantically distinct.

**A Folder holds files that belong together. A facet set holds files that are the same thing.**

If the two ever merge, every Folder unions the conversations of everything inside it, which is precisely the container-is-the-relationship behaviour this document exists to replace.

## 4. The invariant: facets may not cross an access boundary

**A facet set MUST NOT merge conversations that are not equally readable.**

This is [RFC 0.4 §4.4](RFC-0.4-WORKSPACE.md) — *the relay must refuse a private folder whose channel is not private* — one level up, and for the same reason.

**What fails without it is not disclosure to outsiders.** The relay still gates content: a reader who is not a member fetches nothing. What fails is **context collapse for the person who can see both sides.** Somebody with access to a private huddle opens a public project, sees the private discussion merged into a public-feeling view, and answers there. Nothing leaked; somebody was misled into leaking.

That is why it is enforced at write time rather than trusted to every reader's UI, now and in every app not yet written.

**Enforced today as a read rule:** honour a facet only when its members share a Folder. That costs nothing and makes cross-boundary facets unrepresentable. It becomes a write-time relay rule when somebody genuinely needs a cross-Folder facet — see §7.

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

**One operational note:** an identity without `kind:5` — the agent, today — can only ever archive. Anything it creates as a facet member is permanent.

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
old links working. A consumer MUST ignore everything before the final uuid.

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

So a `#d` query returns exactly one object, and the URL is 36 characters shorter
than it would otherwise be.

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
"web": "https://ship.estiva.app/project/<slug>-<d>",
"urls": [
  "https://ship.estiva.app/project/<slug>-<d>",
  "https://ship.estiva.app/issue/<slug>-<d>"
]
```

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

**Paths, not hashes.** Ship uses hash routing because it is served as static
files with `try_files … =404`; a real path 404s on reload. Path URLs need an
`index.html` fallback in each app's nginx config. This is small and it is
infrastructure, so it is named rather than assumed.

**Peek has no object URLs at all.** No routing, no per-topic path: selecting a
topic does not change the address bar. Everything above is unreachable for Peek
until it has them, which makes it the prerequisite rather than a later polish.

**Messages still have no URL.** A `kind:9` has no `d`, so it has no address and
no place in this grammar — the same gap [RFC 0.4](RFC-0.4-WORKSPACE.md) §13.6
records for projections. Linking to a message needs the `nevent` form and is
deliberately not solved here.

## 8. Deliberately deferred

Per the roadmap's rule 2, with triggers rather than guesses.

| deferred | why | trigger |
| --- | --- | --- |
| **Who may create a facet, beyond "you can sign the file"** | signing already gives a defensible rule at zero cost, and the invariant in §4 removes the risk that would make a permission model urgent | the first cross-boundary facet somebody actually wants, or the first complaint about an unwanted one |
| **Enforcing §4 at the relay** | a read rule makes cross-boundary facets unrepresentable today, and a Buzz change is expensive to land | the same trigger |
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
