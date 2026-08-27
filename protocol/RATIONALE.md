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

## Why every app used to reimplement NIP-01 serialization, and no longer does

**Superseded 2026-08-27 by SHA-3.** The original argument is kept because it was
half right, and which half matters.

It said: shared branding makes the pull towards a shared package strong, and the
moment it happens, "apps sharing no code and no database work on the same data"
stops being true. **The duplication is the architecture** — kept honest by every
implementation pinning its event ids to ids Buzz's own Rust crates produced.

The claim was right. The mechanism was wrong, and the third copy is what settled
it. A second hand-written event-id hash is not a demonstration of independence,
it is a divergence the relay notices and we do not — and it had already happened:
one app's message builder grew an `a`-tag parameter and another's did not, so the
same logical message produced different bytes depending on which app sent it.
Nothing failed. Each copy was self-consistent. Between two of the three copies,
the only safety mechanism was a `diff -r` somebody had to remember to run.

What makes the interop claim true is that the apps share **no interpretation and
no database**, which is still exactly the case. The fold is where apps are
supposed to differ, and no shared package contains one. They now agree on the
wire format on purpose rather than by coincidence, and the event ids are still
pinned to Buzz's Rust output — that test moved into the package with the code it
covers.

The two-layer story is unchanged and is the part to hold onto: **Buzz is the
neutral protocol layer; Estiva is a vendor suite on top of it.** The suite
interoperates exactly as a third party's app would — and now a third party can
install precisely what the suite installs, which makes the claim testable rather
than rhetorical.

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

## Why the container read context is a bare uuid rather than a namespaced one

The obvious design is `h:<channel-uuid>` — self-describing, and it cannot be
confused with the `thread:` and `msg:` keys beside it. It was the filed decision.
It is the wrong one, and the reason is not aesthetic.

NIP-RS declines to specify context identifiers, but it does grandfather one:
"a bare channel identifier remains the channel context." The reference clients
write exactly that. So a prefix does not add a namespace to an empty space — it
creates a *second* convention for an object the ecosystem already agrees about.
The failure is not an error message. One app marks a container read, another
still shows it unread, and both are behaving correctly.

A lowercase UUID v4 also cannot collide with anything: every other scheme in §11
is prefixed, so the bare form is unambiguous by construction. The prefix buys
self-description and costs interoperability on the one key everybody shares.

**Why the folder model does not change this.** A folder holding several files is
a real divergence from one-channel-one-topic, and it was the strongest argument
for namespacing. But conversations stay on the folder's channel — one channel per
folder, not one per file — so the container context still identifies the same
object it identifies upstream. What the folder model actually adds is two things,
neither of which is the container: the finer grain matters more, which `thread:`
already covers with the same spelling; and "everything in this folder" becomes a
distinct frontier, which is why §11.5 reserves `folder:` for it.

The principle: **add a scheme for the new idea, never relabel the shared one.**

## Why a person's app state belongs on the relay rather than in an app's database

"You own your data" was true of content and quietly false of everything else. A
person's starred containers and curated queues sat in a database they could not
read, export or take with them; a relay-wide export by author did not include
them, and NIP-09 could not delete them.

The reflex that produced that is reasonable and wrong: *only this app reads it,
so it belongs in this app's backend.* Readership is not ownership. The question
that decides the layer is whether the **person** would expect to keep the thing,
not whether another program needs to see it.

`kind:30078` costs nothing to adopt — it is a standard kind the relay already
classifies as user-owned global state, and the pattern has a precedent in the
relay's own code, which keeps its mesh member status in a generic addressable
kind under a namespaced `d` tag. So the gap closed without a protocol change,
which is why it took a convention rather than a project.

**What the convention is careful not to claim.** A blob is not a table: no
queries, no indexes, no server-side compute, whole-blob writes, and
last-write-wins at one-second resolution. Layer 3 still exists and is still
correct for anything needing those. The convention's value is that reaching for
layer 3 now requires answering a question, and the question is on the record.

And the encryption is not optional in practice. The relay serves any `kind:30078`
by author, so an unencrypted blob is readable by every app the person signs into.
"App-private" without NIP-44 is a misnomer, not a weaker guarantee.
