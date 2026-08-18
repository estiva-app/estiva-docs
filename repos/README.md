# The repos, and which of their docs are worth reading

Five sibling checkouts. See the canon table in [../README.md](../README.md).

Per-repo `CLAUDE.md` files cover their own repo. This page covers **which
documents in each repo are load-bearing**, because two of these repos contain
far more documentation than is relevant.

---

## buzz — the relay

**2,408 markdown files, almost all upstream.** Do not read that tree as a guide
to the Estiva suite; most of it describes upstream Buzz features we do not ship,
and pointing a coding agent at it produces confident answers about things that
are not in play here.

The six that matter:

| File | Why |
| --- | --- |
| `ARCHITECTURE.md` §1, §3 | How a community is resolved from the request host — the basis for "the relay URL is the workspace" |
| `NOSTR.md` | Buzz's event model |
| `crates/buzz-core/src/kind.rs` | The kind registry. Gate 2 |
| `crates/buzz-relay/src/handlers/ingest.rs` | `required_scope_for_kind`. Gate 2 |
| `docs/multi-tenant-relay.md` | Per-workspace hosting, which is the multi-workspace path |
| `deploy/compose/README.md` | What the containers are |

**Our fork differs from upstream in three ways:**

1. Work goes to **`nfb-demo-kinds`**, never `main`. That branch is what builds
   `ghcr.io/estiva-app/buzz:nfb`.
2. `main` carries a `Revert` that `nfb-demo-kinds` does not. Branching from
   `main` and rebasing silently proposes deleting the members API and the
   relay-image workflow.
3. `nfb-demo-kinds` is not rustfmt-clean. `cargo fmt` reflows unrelated
   comments; restore them by hand.

## estiva-id — identity

Small and entirely relevant. Read `docs/ARCHITECTURE.md` first; it is written to
be read *instead of* re-deriving the design.

| File | Why |
| --- | --- |
| `docs/ARCHITECTURE.md` | The key/admission/attestation split, the `/sign` seam, why not NIP-46, why custody is accepted in Stage 1 |
| `docs/API.md` | Endpoints, token claims, signing policy |
| `docs/KEY-CUSTODY.md` | The at-rest envelope format, designed for escrow before escrow exists |
| `docs/OFFBOARDING.md` | The runbook, including the operator-offboarding incident |
| `docs/OPEN-SEAMS.md` | The two decisions held open and then decided — `nip05` domains, admission |
| `src/db/seed.ts` | `SEED_APPS` — the per-app kind ceilings. Gate 1 |

`deploy/README.md` contains one known error: it says logs are "held only by the
local journal". They are in `docker logs`. See
[../operations/PRODUCTION.md](../operations/PRODUCTION.md).

## peek-app — Estiva Peek

| File | Why |
| --- | --- |
| `CLAUDE.md` | Working rules, and the Convex deployment warnings |
| `convex/nostr/` | Event builders, publish, sync, projection |
| `docs/buzz-compat/` | The original analysis corpus — see below |
| `PRODUCTION-PLAN.md` | The phase plan; still the progress record |

`README.md` is the unmodified Vite template. Ignore it.

⚠️ **`HOW-TO-RUN.md` and `docs/buzz-compat/RUNNING.md` are stale.** Both describe
a Convex Auth email/password sign-in deleted by PEEK-41. Use
[../local-dev/RUNNING.md](../local-dev/RUNNING.md).

### `docs/buzz-compat/` — the analysis corpus

Fifteen documents written during the compatibility investigation. They are the
source material this repo was distilled from, and several are still the only
place a thing is written down:

| Still authoritative | Superseded by |
| --- | --- |
| `FRICTION.md` — what broke in practice | — |
| `FILES_ARCHITECTURE.md` — the File/Component design | — |
| `PEEK_DATA_MODEL.md` — Peek's tables and the durable/local split | — |
| `BUZZ_PROTOCOL_MODEL.md` — Buzz's model, cited to code | — |
| `INTEROP_PROOF.md` — real recorded output | — |
| `LINEAR_LITE_SPEC.md` | [../protocol/SPEC.md](../protocol/SPEC.md) |
| `RFC_UPDATES.md` | [../protocol/SPEC.md](../protocol/SPEC.md) |
| `RUNNING.md` | [../local-dev/RUNNING.md](../local-dev/RUNNING.md) |
| `NIP_SURVEY.md`, `COMPATIBILITY_GAP_ANALYSIS.md` | partly — both predate implementation |

## estiva-ship — Estiva Ship

The reference implementation of a consuming app. `README.md` is good and
current.

| Path | Why |
| --- | --- |
| `lib/nostr/` | Protocol library. **Read the comments** — they record behaviours that cost real debugging time |
| `src/kinds.ts` | Kinds and the published status vocabularies |
| `src/manifest.ts` | The projection manifest. The genuinely new protocol |
| `src/fold.ts` | The fold. Read the comment on `orderingMs` before touching it |
| `scripts/probe-kinds.ts` | Asks a live relay which kinds it accepts |
| `scripts/verify.ts` | The end-to-end cross-identity check |

⚠️ Its README points at `~/peek-app/docs/buzz-compat/…` — absolute paths from one
developer's machine. Those pointers should move to this repo.

---

## Not a repo, and at risk

**`~/nfb-demos` has no git remote.** It exists only on one machine, and
`estiva-ship/README.md` names it as the source `lib/nostr/` was copied from. It
should be pushed somewhere before it is lost.
