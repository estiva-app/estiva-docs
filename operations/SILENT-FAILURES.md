# The silent failures

Every expensive debugging session in this project has had the same shape: **a
component reported success while the state it should have produced was never
written.** Each one was invisible from the tool that reported success.

This page is the catalogue. Read it before debugging anything, and before
calling anything done.

## The rule

> Verify the user-facing action, not the mechanism.

A green test suite, a green CI run, and a passing check of the mechanism you
believe implements a feature are all compatible with the feature being broken.
Go and look at the state that should have been produced: the stored event, the
Postgres row, `origin/main`, the bytes.

---

## Publishing

| What looked fine | What was actually wrong | How to check |
| --- | --- | --- |
| Peek works perfectly, nothing reaches the relay | `NOSTR_RELAY_URL` unset — `convex/nostr/publish.ts` **no-ops silently by design** | `npx convex env get NOSTR_RELAY_URL` |
| `/sign` returns, the app renders the change | The kind is not in the app's `allowed_kinds`; `/sign` refused with `kind_not_allowed` on a console line nobody was watching | Read `app_credentials` in Postgres |
| Signing succeeded, publish failed | The relay's kind allowlist rejects at ingest — *after* signing | `npm run probe` in `~/estiva-ship` |
| `HTTP 200` from `POST /events` | `{"accepted":false,"message":"duplicate: …"}`. **The status code is not the answer** | Read the `accepted` field |
| The kind is registered and `/sign` signed it, and the relay still says no | A *second* list. `requires_h_channel_scope` (`ingest.rs`) names kinds that must carry an `h`; being on the kind allowlist says nothing about it. Also a `200` with `accepted:false` | Publish the exact shape and read `accepted` |
| Old messages never appear on the relay | The relay rejects `created_at` outside ±`BUZZ_MAX_TIMESTAMP_DRIFT_SECS` (default 900 s) of its clock | Send a new message |
| You widened `BUZZ_MAX_TIMESTAMP_DRIFT_SECS` for an import and it still fails, with `500 internal server error` | **Widening only helps global kinds.** Migration 0021 arms a commit-time floor of 960 s on every writer-pool connection, so anything carrying an `h` tag is accepted at ingest and then **aborted at COMMIT**. Measured 2026-08-27 at ±2 years: a 120-day-old `kind:30851` refused with a 500, a 120-day-old global event accepted and readable | Relay log says `below the replica-fence floor`. Since CAT-11 the relay also warns about it at startup. See *Importing history* below |
| Profile edits reach nobody | `RELAY_BRIDGE_URL` empty → publishing off. `COMMUNITY_HOST` mismatched → Buzz **silently discards** the `kind:0` | `estiva-doctor.sh` |
| Every relay request fails after the app loads fine | The relay does not name the app's origin in `BUZZ_CORS_ORIGINS` | Check `/opt/buzz/.env`, restart the relay |

## Importing history that predates the relay

`BUZZ_MAX_TIMESTAMP_DRIFT_SECS` is **not** the answer for channel-scoped
history, and the relay will tell you so at startup. The floor exists to keep
the replica fence honest: once a read replica has replayed past a sampled
writer LSN, no transaction may later commit an `events` row older than
`clock_timestamp() - 960 s`. Widening the ingest window does not move that
floor, so the write is taken and then dropped at COMMIT.

**What works, per migration 0021's own header:**

| Kind of history | Route |
| --- | --- |
| Global events — `channel_id IS NULL`, e.g. profiles, discovery snapshots | Widen `BUZZ_MAX_TIMESTAMP_DRIFT_SECS`, import, set it back. This is the one case the knob was actually good for |
| Channel-scoped events — anything with an `h` tag: messages, issues, changes, comments | **Not through the relay.** Import on a connection *outside* the relay's writer pool (so the `buzz.created_at_floor` GUC is unset and the trigger is a no-op), and hold the replica breaker closed from before the transaction begins until its WAL is replayed on the replica |

Two things that make this safe rather than merely possible:

- The guard is armed **per session** by the writer pool's `after_connect`. A
  psql session the relay did not open has no `buzz.created_at_floor` set, and
  the trigger returns early. That is the intended escape hatch, not a loophole.
- `session_replication_role = replica` (what `pg_restore` uses) likewise
  bypasses triggers, and is likewise a breaker-closed operation.

Do **not** widen the floor constant to make an import work. It is subtracted by
the replica fence, so the two uses must never diverge — changing it means
re-examining that proof, which is a different piece of work.

## Deploying

| What looked fine | What was actually wrong |
| --- | --- |
| Deploy log says `seeded N app credential(s)` | `update.sh` runs `migrate`, never `seed`. A seed-only change ships into the image and does nothing |
| Re-seed ran and exited 0 | It ran **before** the new image was pulled, wrote the old values back, and exited 0. Order is **merge → wait for the pull → re-seed → verify** |
| Relay is healthy | Buzz has **no update timer**. A healthy relay serving last month's image is exactly what this produces. Compare the running image id to `:nfb`, not health |
| The relay-image CI run is green | The image exists in the registry; nothing pulled it. A probe run seconds after a successful build still got the pre-change behaviour. **A build is not a deploy** — the only check that separates them from outside the box is publishing the shape and reading `accepted` |
| PR reports **merged**, content never reached `main` | It was stacked on a branch that merged first, so the merge landed in a branch nothing feeds from. Never stack on a branch about to merge |

## Reading logs and state

| What looked fine | What was actually wrong |
| --- | --- |
| `journalctl … \| grep -c "…"` returns `0` | Estiva ID's app logs are in `docker logs estiva-id-estiva-id-1`, **not the journal**. The grep proved nothing |
| `docker logs` shows nothing before a date | It only reaches back to container start. Check `docker inspect -f '{{.State.StartedAt}}'` before concluding a bug is new |
| A Convex custody audit reported clean | `--prod` resolved to a deployment nobody uses. Name the target explicitly; `.env.local` is a hint, never the answer |
| Convex dashboard shows no arguments | It never shows arguments for successful calls. Absence is not evidence |
| `git checkout -b foo origin/main` | A **failed fetch is quiet**. `origin/main` stayed where it was and the branch was cut from a stale commit |
| Local export shows zero attachments | The local Convex backend's export **omits `_storage`**. Check `convex data _storage` |

## Tooling

| What looked fine | What was actually wrong |
| --- | --- |
| `curl -w '%{http_code}' … \|\| echo 000` | curl already prints `000` on failure *and* exits non-zero, so the fallback appends a second one. `"000000" != "000"` reads as success — this reported a dead relay as healthy |
| A tmux window exists for a service | A run that died on an interactive prompt leaves the window there forever. Existence is not readiness |
| `npx convex dev` appears to hang | `.env.local` names a cloud deployment, which beats `CONVEX_AGENT_MODE=anonymous`; it is sitting on an interactive prompt |
| Schema push succeeded locally | Nothing local runs Convex's module loader. **Push failures are discovered at deploy time** |
| Removing a field from a schema | Fails the **entire** push for every row still carrying it. Sweep first, confirm zero, then remove. Removing a whole *table* does not fail |

---

## What to do about it

**Make failure loud.** Once no app can sign locally, an identity-service outage
looks exactly like nothing happening. Conformance check C9 in
[../protocol/SPEC.md](../protocol/SPEC.md) exists for this: publish failures
belong in the UI, not only in `console.warn`.

**Run `estiva-doctor.sh`.** It exists because six services can all answer `200`
while four of these are true at once. It checks the state, not the health.
