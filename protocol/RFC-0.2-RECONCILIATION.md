# RFC 0.2, and what happened to it

Two documents preceded the implementation:

| Document | Written | What it is |
| --- | --- | --- |
| [RFC 0.2](https://linear.app/peek-app/document/rfc-02-f8995f7fa90c) | 2026-07-07 | The architecture proposal. Three layers: Data, Identity, Discoverability |
| [Buzz architecture vs RFC 0.2](https://linear.app/peek-app/document/buzz-architecture-vs-rfc-02-e1690bd93367) | 2026-07-22 | A gap analysis: what Buzz already solved, what was left to invent |

Neither is superseded wholesale. RFC 0.2 is still the **product thesis** and the
comparison note is still the **build strategy**. What has changed is that one of
the three layers is now built, one is partly built, and one was never started —
and the implementation diverged from the design in two structural ways worth
recording, because both divergences are load-bearing.

[SPEC.md](SPEC.md) describes what runs. This page is the diff.

---

## 1. Scorecard

| RFC 0.2 | Status | Where |
| --- | --- | --- |
| §1.1 Folder | **Built** | The `h` tag, a NIP-29 group |
| §1.1 Files | **Not built** | `kind:30840` registered, written by nothing |
| §1.1 Components | **Not built** | `kind:30841` registered, written by nothing |
| §1.2 Collaboration + revision | **Built** | Event-sourced change stream + fold |
| §1.3 Cross-org collaboration | **Not built** | See §3 below |
| §1.4 Highlights + raw memory | **Not built** | `kind:9802` exists in Buzz, unused here |
| §2.1 Identity — users, apps | **Built** | Estiva ID |
| §2.1 Identity — teams, orgs, agents | **Not built** | Deliberately deferred |
| §2.2 Authentication | **Built, differently** | NIP-98, not NIP-42. See §4 |
| §2.3 Permissions | **Built** | Relay membership + per-app signing ceilings |
| §3.1 App manifest | **Built, as specified** | [SPEC.md §7](SPEC.md#7-cross-app-interoperability-the-projection-manifest) |
| §3.2 Agent manifest | **Not built** | — |
| Harness direction | **Not built** | Headless harness, Claude Code as thin client |

One of the four areas the comparison note nominated for "original effort" —
portable objects, cross-relay replication, manifests, memory — actually shipped.
It was manifests, and it shipped close to the sketch.

---

## 2. The structure collapsed from three levels to two

**RFC 0.2 §1.1:**

> * Folder — A local organizational container for files.
> * Files — The primary shared business object.
> * Components — The smallest structured unit inside a file.

**What was built:** Folder → objects. There is no File layer and no Component
layer. A Ship Project, a Ship Issue and a Peek Topic all hang directly off a
Folder, each carrying that Folder in its `h`.

This was not an omission — it is the design the apps converged on. **The Folder
*is* the project.** A Peek topic and a Ship project are one Folder rendered
twice, which is what makes a conversation on the project and a conversation in
the topic *one event read twice* rather than two records to reconcile.

Inserting a File between the Folder and the object would have re-introduced the
reconciliation problem the Folder identity removes.

**What this costs.** RFC 0.2's Files were doing two jobs, and only one survived:

| File's job in RFC 0.2 | Where it went |
| --- | --- |
| The unit of shared business data | Absorbed by the object (Project, Issue, Topic) |
| The unit that is **portable across orgs** | **Nowhere.** See §3 |

A trace of the portable-File idea does survive: an event cannot change its own
`h`, so an object re-pointed at another Folder carries an explicit override, and
readers take the **union** of every Folder it has pointed at. That is
"one object, more than one container" — the RFC's property, at the object level
rather than the File level, and within one relay rather than across two.

`FILES_ARCHITECTURE.md` in `peek-app/docs/buzz-compat/` still holds the File and
Component design. It is not dead, it is unbuilt.

## 3. Cross-org replication: correctly flagged, never closed

RFC 0.2 §1.3 is the most ambitious commitment in the document — a File existing
on *each* participating org's relay, signed events replicating between them, no
host database, DNS-anchored trust.

The comparison note called this correctly in July: *"Buzz does not appear to
solve that. Its architecture document explicitly says there is no peer-to-peer
exchange or relay-to-relay replication."*

**It is still true.** `federat*` appears once in the whole Buzz repository, in a
Helm README, unimplemented. Nothing in the Estiva suite replicates anything
between relays.

So this is not a case of the analysis being wrong. The gap was identified,
nominated as "one of the most strategically important original technical
problems", and then not worked on. Multi-workspace remains the product goal;
Stage 1 is single-workspace, one relay, one community.

**The invariant that keeps the eventual split cheap is that a pubkey must
survive it.** Buzz resolves the community per request and is built for
multi-tenancy — but profiles do not inherit across community domains, so a
pubkey reposts its profile in each. Authentication staying centralised at one
origin is what lets a contractor at two client companies remain one person.

## 4. Authentication went to NIP-98, not NIP-42

The comparison note graded authentication a **strong match** on the basis that
*"NIP-42 auth and relay-enforced access are already there."* That was true about
Buzz and turned out not to be the road taken.

The suite authenticates to the relay with **NIP-98** HTTP auth over the relay's
HTTP bridge. NIP-42 has a challenge/response handshake that needs a held socket,
and Peek's backend is Convex, whose functions are request-scoped and cannot hold
one — its sync already polls for exactly this reason.

The same constraint shaped remote signing: `/sign` is NIP-46's property (secrets
never leave the signer) over HTTPS rather than relay transport, because NIP-46
needs a socket for `kind:24133` and signing latency in seconds would be unusable
on every click.

**The generalisable lesson:** the transport assumptions in a NIP are as
load-bearing as its data model, and a serverless backend rules several NIPs out
before the design starts.

## 5. Where the comparison note was wrong

One claim did not survive contact, and it cost real time.

> **"feature extension via new event kinds rather than schema entanglement"**
> — listed as a reusable property of Buzz's signed-event model.

Adding a kind to a Buzz relay is **not** free. Ingest carries an explicit
kind→scope allowlist and rejects anything unknown, so a new kind requires
patching two Rust files and redeploying the relay. This applies to **ratified
NIPs too** — NIP-89 and NIP-22 are standards and both had to be registered by
hand.

And the registration is only one of three gates, each of which refuses in a way
that looks like success from the layer above it. See
[ADDING-A-KIND.md](ADDING-A-KIND.md).

The rest of the note's assessment held up well. Relay-as-system-of-record,
key-based identity, server-derived tenancy, and membership-based access control
were all reusable as described.

## 6. What §3.1 got right

RFC 0.2 §3.1 is one paragraph:

> Defines how link from the app can be displayed in other apps and what actions
> are available. E.g. Linear ticket (title, description, changing status,
> changing assignee)

That is, almost exactly, what shipped — and the reference implementation is
literally a Linear-lite. The manifest declares how an object renders in another
app and what actions that app may take, and Peek changes the status and
assignee of a Ship issue through it.

Three things the one-paragraph sketch could not have anticipated, all of which
surfaced from writing a *consumer* rather than from reading the spec:

1. A mutable field must be declared as a **fold**, not a tag. The root event
   deliberately carries no status, so a consumer following the obvious reading
   renders an empty status forever.
2. The consumer cannot fold without being told the **fold rule** — which kind
   carries changes, and how to order them. Left to convention, every consumer
   invents its own and they disagree the first time two changes land in one
   second, which is the common case.
3. Acting on another app's object means **signing that app's kind**, so an
   app's signing ceiling is the union of what it writes and what the apps it
   acts on declare.

## 7. Still on the table

Nothing here has been decided against. In rough order of how much the rest
depends on it:

| | Why it matters |
| --- | --- |
| **Cross-org replication** (§1.3) | The largest unbuilt claim, and the one that most distinguishes this from a single-tenant workspace product |
| **Agent manifest** (§3.2) | The manifest layer exists; agents are the second consumer of it |
| **Highlights + raw memory** (§1.4) | `kind:9802` is registered in Buzz already |
| **Files and Components** (§1.1) | Kinds registered, design written, unbuilt. Revisit only if something needs a level between Folder and object |
| **Teams, orgs, agent identities** (§2.1) | Deliberately deferred in Estiva ID |
| **The headless harness** | An entire product direction in RFC 0.2's second half, untouched |
