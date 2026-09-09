# Adding a new event kind

Shipping a new kind touches three repos, and **every gate refuses in a way that
looks like success from the layer above it.** This page exists so nobody spends
another four rounds of live debugging on it.

Established the hard way on 2026-08-18 with `kind:9101` (PEEK-128). None of the
four failures were reported by the app.

---

## The three gates, in the order they refuse

```
   your app
      │  builds an unsigned event
      ▼
┌──────────────────────────────────────────────┐
│ GATE 1 — Estiva ID /sign                     │
│ app_credentials.allowed_kinds                │
│ refuses: 422 policy_violation                │
│          / kind_not_allowed                  │
└──────────────────────────────────────────────┘
      │  signed event
      ▼
┌──────────────────────────────────────────────┐
│ GATE 2 — Buzz relay ingest                   │
│ required_scope_for_kind()                    │
│ refuses: 400 restricted: unknown event kind  │
│          (AFTER signing already succeeded)   │
└──────────────────────────────────────────────┘
      │  accepted event
      ▼
┌──────────────────────────────────────────────┐
│ GATE 3 — the deployed relay image            │
│ buzz has NO update timer. The code can be    │
│ merged and the running relay still refuses.  │
│ refuses: identically to gate 2               │
└──────────────────────────────────────────────┘
```

---

## Gate 1 — Estiva ID must be allowed to sign it

`SEED_APPS` in `estiva-id/src/db/seed.ts` caps each app's `allowedKinds`.

**Deploying this change needs a manual re-seed.** `update.sh` on the box runs
`migrate` and never `seed`, so a seed-only change deploys into the image and
then does nothing. The deploy log will say `seeded N app credential(s)` on a run
that changed nothing.

Verify the row, never the log line:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds from app_credentials"
```

Deploy order is **merge → wait for the image pull → re-seed → verify**. A
re-seed that runs before the pull writes the old values back and exits 0.

### Only two of the five credentials are seeded at all

`SEED_APPS` holds `estiva-peek` and `estiva-ship`. Production also has
`claude-agent` — the CLI, the Desktop extension and the Claude Code plugin — and
the self-service credentials `pc-0a4935` and `vscode-604525`, all three created
outside the seed. **For those, a seed change is a no-op and re-seeding grants
nothing.** Their `seed.test.ts` assertions are guarded with `if (agent)`, so a
green suite says nothing about what they hold either.

Granting one of them a kind is a `psql` update, written so a re-run is a no-op:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id <<'SQL'
update app_credentials set allowed_kinds = allowed_kinds || 40003, updated_at = now()
 where client_id = 'claude-agent' and not (40003 = any(allowed_kinds))
returning client_id, allowed_kinds;
SQL
```

Read every row before and after and compare them, not only the one being
changed. **The unseeded three drift apart from each other silently**, and
nothing reconciles them: AGE-3's first grant went to `claude-agent` alone, which
would have left the same feature working in one surface of the agent and
refused in the others until somebody hit it. Decide for all three in the same
change, or write down why one is being left out.

**A new ceiling arrives on the client's next `/token`**, not on a restart — it is
read off the token response. A process holding an hour-long token keeps the old
one until it renews, which is worth knowing before concluding a grant did not
land.

## Gate 2 — the relay must know the kind

Buzz keeps an explicit kind→scope allowlist. Unknown kinds are rejected at
ingest *after* signing already succeeded, which is what makes this one confusing
— the app holds a validly signed event and still cannot publish it.

Two files in `~/buzz`:

| File | Change |
| --- | --- |
| `crates/buzz-core/src/kind.rs` | a `pub const` plus an `ALL_KINDS` entry |
| `crates/buzz-relay/src/handlers/ingest.rs` | one `required_scope_for_kind` arm |

Then `cargo build -p buzz-relay` and restart.

**This applies to ratified NIPs too.** NIP-89 and NIP-22 are standards and Buzz
still rejected them until they were registered.

Decide two things beyond the number itself:

- **Global or channel-scoped?** Discovery kinds (`31989`/`31990`) must be global
  — they have to work before you are a member of anything.
- **Is `h` required at ingest?** For any object several apps write, yes.
  One app forgetting would put an unreachable object into the shared space that
  nobody can unpublish.

### Buzz changes go to `nfb-demo-kinds`, never `main`

That branch is what `relay-image.yml` builds `ghcr.io/estiva-app/buzz:nfb` from.
Two traps:

- `main` carries a `Revert` that `nfb-demo-kinds` does not. Branching from
  `main` and rebasing silently proposes **deleting the members API and the
  relay-image workflow**.
- `nfb-demo-kinds` is not rustfmt-clean, so `cargo fmt` reflows unrelated
  comments. Restore them by hand.

There are prior patches on that branch to copy the shape from — one for ratified
kinds, one for provisional ones.

## Gate 3 — deploy the relay by hand

**The relay has no update timer.** `estiva-id`, `peek` and `ship` each have a
`*-update.timer`; buzz does not. On the box:

```bash
cd /opt/buzz && docker compose pull relay && ./run.sh restart
```

Pull `relay` only — `run.sh pull` also pulls postgres, redis and minio.

**Verify by comparing the running image id to `:nfb`, not by health.** A healthy
relay serving the old image is exactly the state this gate produces.

---

## Verifying, end to end

Ask the relay what it actually accepts rather than reasoning about it:

```bash
cd ~/estiva-ship && npm run probe
```

Then publish one real event from the app and read it back. The failure mode this
page exists to prevent is every local signal agreeing while nothing reached the
relay — in PEEK-128 the database row said resolved, the card rendered resolved,
and `/sign` was refusing in a console line nobody was watching.
