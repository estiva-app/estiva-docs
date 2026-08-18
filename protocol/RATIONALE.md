# Why the protocol is shaped this way

Non-normative. [SPEC.md](SPEC.md) says what to implement; this says why, and
what the alternatives cost. Most of these were decided by something breaking,
not by argument.

---

## Why there is no workspace object

The obvious design gives every app an index — a root object listing the
workspace's projects. Every app that tried it would invent its own, and each
would be invisible to the others.

Buzz already answers "what is the organisation", and the answer is not an event:
a community is resolved from the request `Host` **before a connection is
authenticated**. So the relay URL is the workspace, for free, in every app at
once.

An index object would be a second, app-private notion of the same thing —
precisely the failure this ecosystem exists to argue against. The cost is that
objects must be **discovered** by querying a kind with no `#h` and letting
access control filter, rather than enumerated from a list. That is a real cost,
and it is the right one to pay.

## Why the Folder is a NIP-29 group

It needed to be something the relay already enforces membership on. NIP-29
groups are that, and Buzz's access control is built around them — including a
formally verified admission fence.

Inventing a Folder kind would have meant inventing its access control too.

## Why a Peek topic and a Ship project are one Folder, not two linked objects

Linking is a state that can be wrong. Two objects with a pointer between them
can be created out of order, can point at a deleted target, and need a
reconciliation story when both change.

One container has none of that. A conversation on the project and a conversation
in the topic are **one event read twice**, not two records to reconcile. Ship's
threads appear in Peek with no code on Peek's side at all — that is the whole
integration, and it needed no new protocol.

The residue is that an event cannot change its own `h`. Re-pointing an existing
object therefore needs an explicit override field, and readers must take the
union of every Folder it has pointed at, or already-filed children vanish.

## Why status is not on the issue

NIP-33 addresses are `(pubkey, kind, d)`. Only an author can replace their own
event. Put status on the root and "Ana opens an issue, Ravi closes it" becomes
inexpressible — Ravi has no way to replace Ana's event.

So state is a stream of change events authored by **whoever acts**, and current
state is that stream folded. The activity feed is the same stream, unmodified;
it costs nothing extra.

**One field per change event**, because two fields in one event would need a
conflict rule for partial application and one field needs none.

## Why change events carry `ts`

This was expected to be the rare case — two people acting in the same second.
Measured against the live relay, **five sequential changes from a single client
all landed in one `created_at` second.** It is the common case.

Nothing relay-side recovers the order: a stored event is exactly the seven
signed fields, with no ingest sequence, and query order turns out to be
id-sorted. So the ordering has to be in the event or it does not exist.

`ts` is epoch-ms and is honoured **only when it agrees with `created_at` to the
second**. That constraint is what keeps it from being a new thing to trust — the
relay already bounds `created_at` to ±15 minutes of its own clock, and a `ts`
pinned inside an already-validated second can only refine ordering *within* it,
never move an event outside it.

An app that ignores `ts` still folds correctly, at one-second resolution.

## Why the manifest declares the fold

NIP-89 says how to *open* an object in its owning app. It says nothing about
rendering one inline or acting on one.

If status comes from folding change events, a consumer cannot fold without
knowing which kind carries changes and how to order them. Leaving that to
convention means every consumer invents its own rule — and they disagree the
first time two changes land in one second, which is the common case above.

So the fold rule is declared, not assumed. Three refinements came from actually
writing a consumer:

- A **mutable field must be a `fold`, never a `tag`.** Declaring status as a tag
  is faithful to the wire format and produces a consumer that renders an empty
  status forever, because the root deliberately has no status tag.
- A slot may be **both**. A project lead starts as a tag and is later overridden
  by change events. Tag alone goes stale the first time somebody reassigns; fold
  alone loses the value it was created with.
- Vocabularies carry **semantic colour names**, never hex. The consumer picks
  the actual colour, so a foreign object looks native rather than pasted in.

The principle: **the owner defines the projection.** The publishing app decides
which fields matter; the consuming app decides how they look. That inverts
normal integration, where every consumer picks fields itself and each gets it
wrong differently.

## Why acting on another app's object means signing that app's kind

An action on a Ship issue *is* a `kind:1851`. Peek does not choose the number —
it reads it from Ship's manifest.

The consequence is that an app's signing ceiling must be the union of what it
writes for itself and what every app it acts on declares. This is a ceiling, not
a grant of meaning: it says Peek may sign a 1851, not that Peek decides what one
means. The relay still applies membership and authorization.

It also fails at the worst possible moment if you forget: the manifest agrees,
the UI renders, and `/sign` refuses at the last step.

## Why identity is a separate service, and custodial for now

The same human was two people — Peek minted a custodied key per account, the
tracker generated a throwaway key per browser. Nothing connected them, so
someone who filed an issue and commented on it appeared twice.

**Three concerns are kept apart:** the key (identity service), admission (the
relay's roster), attestation (the `nip05` handle). Collapsing any two is how the
design goes wrong — because **a leaver keeps their keypair.** You cannot take a
private key back. What you can take back is the door and the badge, neither of
which is the key. If identity were only "who holds a key", offboarding would be
impossible.

Worth stating plainly: **custody adds nothing to offboarding.** It works
identically whether or not the service holds the key — which is why moving to
user-held keys later does not cost the org its ability to remove somebody.

Custody is accepted for now because it is what makes one pubkey across apps
possible at all, and what makes account recovery possible. Nobody can recover a
lost non-custodial identity, so **escrow has to exist before custody goes.**

Two consequences that are decisions, not bugs:

- Nothing signed under custody may be presented to users as cryptographic proof
  of authorship. A signature proves the event came from the service.
- Stage 1 relay data is, in that sense, throwaway.

The argument for accepting custody is not that misuse will not happen, but that
it cannot happen unseen — which is why the audit log is Stage 1 and not later.

## Why `/sign` over HTTP rather than NIP-46

NIP-46 needs a socket for `kind:24133` traffic. Convex functions are
request-scoped and cannot hold one — Peek's sync already polls for exactly this
reason. And signing latency measured in seconds would be unusable on every
click.

`/sign` has NIP-46's property — secrets never leave the signer — over HTTPS
instead of relay transport. **This is the seam that gets re-pointed at a local
signer** when keys move out of custody, so the request/response contract matters
more than what is behind it today. Keep it clean; resist adding convenience.

## Why no app may publish `kind:0`

An app that can publish a profile can undo the identity service's ownership of
it. The check is ordered *before* the per-app allowlist so it cannot be granted
by editing a database row — the row being precisely what an attacker with
database access would edit.

The related decision: email and role live in a bearer-authenticated **private
directory**, looked up by pubkey and never returned as a list, while `kind:0`
carries only what the world may see. An email on a shared relay cannot be taken
back, and a token scoped to one app should not be able to export the staff
directory.

## Why every app reimplements NIP-01 serialization

Shared branding makes the pull towards a shared package much stronger than it
was when these looked like strangers' apps. The moment it happens, "apps sharing
no code and no database work on the same data" stops being true.

**The duplication is the architecture.** It is kept honest by every
implementation pinning its event ids to ids Buzz's own Rust crates produced — a
test that fails when the implementations drift. Independence without divergence.

The two-layer story to hold onto: **Buzz is the neutral protocol layer; Estiva
is a vendor suite on top of it.** The suite interoperates exactly as a third
party's app would. That is the commercial claim, and it is stronger than the
research-demo version.

## What the earlier RFC drafts got wrong

Both prior drafts predate implementation, and most of their analysis held up.
Two things did not, and a third was never in view.

- **Cross-org replication (RFC 0.2 §1.3)** was correctly flagged as unbuilt in
  Buzz by the comparison note, nominated as one of the most important original
  problems — and then never worked on. `federat*` appears once repo-wide, in a
  Helm README. This is a gap that was identified and left open, not an analysis
  error.
- **"Feature extension via new event kinds rather than schema entanglement"**
  was listed as a reusable property of Buzz. It is not one. Ingest allowlists
  kinds and rejects unknown ones — including **ratified NIPs**; NIP-89 and
  NIP-22 both had to be registered by hand in Rust.
- **Ordering by `created_at`** is insufficient at the resolution the protocol
  actually operates at. Neither draft addressed ordering at all, which is fair —
  it is not visible until you fold a real change stream.

The full layer-by-layer reconciliation, including why the RFC's three-level
Folder/File/Component structure collapsed to two levels in practice, is in
[RFC-0.2-RECONCILIATION.md](RFC-0.2-RECONCILIATION.md).

Multi-workspace remains the product goal and Stage 1 is single-workspace. Buzz
is built for it — it resolves the community per request — but profiles do not
inherit across community domains, so a pubkey reposts its profile in each. The
invariant that keeps the eventual split cheap is that **a pubkey must survive
it.**
