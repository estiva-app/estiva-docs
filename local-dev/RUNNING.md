# Running the Estiva Suite locally

Every command on this page was run on a Windows 11 + WSL Ubuntu box on
2026-08-18 and produced the output shown. Where something does **not** work
yet, it says so rather than describing what it would do.

> **Do not follow `peek-app/HOW-TO-RUN.md` or
> `peek-app/docs/buzz-compat/RUNNING.md`.** Both predate PEEK-41 and describe a
> Convex Auth email/password sign-in (`demo@peek.dev` / `Peek-demo-1`) that was
> deleted. Following them gets you stuck on a `JWT_PRIVATE_KEY` step for an auth
> system that no longer exists, and the failure reads as a broken environment.

---

## TL;DR

```bash
~/estiva-docs/scripts/estiva-up.sh
```

```bash
~/estiva-docs/scripts/estiva-doctor.sh
```

`up` starts everything in dependency order and waits for each service to
actually answer. `doctor` tells you what is working — including the four things
that are broken while every service reports healthy.

---

## What runs, and where

| # | Service | Port | Started by | Needed for |
| --- | --- | --- | --- | --- |
| 1 | Buzz Postgres / Redis / MinIO | 5432, 6379, 9000 | `docker compose` in `~/buzz` | everything |
| 1 | Estiva ID Postgres | **5433** | `pnpm db:up` in `~/estiva-id` | Estiva ID |
| 2 | **Buzz relay** | 3000 | `./bin/just relay` | all publishing |
| 3 | **Estiva ID** | 8787 | `pnpm dev` | sign-in, signing, profiles |
| 4 | **Convex** (Peek's backend) | 3210 | `npx convex dev` | Peek |
| 5 | **Peek** | 5173 | `npm run dev` | — |
| 6 | **Ship** | 5190 | `npm run serve` | — |

Estiva ID's Postgres is on **5433 deliberately**, so it cannot collide with the
relay's on 5432.

The relay's first compile is ~1,000 Rust crates. Budget 20 minutes and use
`estiva-bootstrap.sh`, not `estiva-up.sh`, for it.

---

## The scripts

| Command | What it does |
| --- | --- |
| `estiva-up.sh` | Start everything, in order, waiting for readiness at each step |
| `estiva-up.sh relay id` | Start only those |
| `estiva-doctor.sh` | One line per service, plus the silent-failure checks |
| `estiva-doctor.sh --deep` | Also asks the relay, with a signed probe, which kinds it accepts |
| `estiva-down.sh` | Stop the processes, keep all data |
| `estiva-down.sh --deps` | Also stop the containers (volumes survive) |
| `estiva-down.sh --wipe` | Delete the volumes. Every locally published event is gone |

Each service gets a tmux window in the `estiva` session:

```bash
tmux attach -t estiva
```

Logs are also written to `~/estiva-docs/.run/logs/<service>.log`.

### Why a script rather than six terminals

Not to save typing. Four of the five things that break here are silent: the
service starts, answers `200`, and does nothing. `doctor` exists to name them
out loud, and `up` exists so a service never starts against a dependency that is
still booting.

---

## What is broken locally right now

`doctor` reports these. All four are real, and none of them show up as an error
in any app.

### 1. The sign-in blocker — local Estiva ID cannot sign you into Peek

`peek-app/convex/auth.config.ts:20` hardcodes the trusted issuer:

```js
domain: 'https://id.estiva.app',
applicationID: 'estiva-peek',
```

Convex requires a token's `iss` to equal that **exactly**. A local Estiva ID
issues `iss: http://localhost:8787` (its `ISSUER_URL`), so Convex rejects every
locally-issued token. `peek-app/convex/users.ts:30` pins the same string again,
with a test asserting it.

The frontend half *is* overridable — `VITE_ESTIVA_ID_ORIGIN` — which makes this
easy to misread as configurable. It is not; the backend half is the one that
decides.

**Consequence:** the local suite runs, publishes, and syncs, but you cannot sign
into local Peek against local Estiva ID.

**The fix is a code change, not configuration** — make the issuer and
`applicationID` env-driven with the production values as defaults. Until then,
develop Peek's UI against the local Convex without sign-in, or point local Peek
at production Estiva ID.

### 2. `NOSTR_RELAY_URL` unset — Peek publishes nothing

`convex/nostr/publish.ts` **no-ops silently by design** when it is unset. Peek
works perfectly and nothing ever reaches the relay.

```bash
cd ~/peek-app && CONVEX_AGENT_MODE=anonymous CONVEX_DEPLOYMENT=anonymous:anonymous-agent npx convex env set NOSTR_RELAY_URL http://localhost:3000
```

### 3. Estiva ID's three fail-closed env vars

All three default to empty, and empty turns a feature **off** rather than
erroring. The service starts and `/readyz` returns `ok` with all three blank.

| Variable | Empty means | Local value |
| --- | --- | --- |
| `SIGN_NIP98_ALLOWED_URL_PREFIXES` | `/sign` refuses **all** kind:27235 — no app can authenticate to the relay bridge at all | `http://localhost:3000` |
| `RELAY_BRIDGE_URL` | Profile publishing is off — `kind:0` never reaches anyone | `http://localhost:3000` |
| `COMMUNITY_HOST` | Handles claim no community, and Buzz **silently discards** a `kind:0` that disagrees | the relay's community host |

The first one is the nastiest: an app can hold a correctly signed event and
still be unable to publish it, because it cannot mint the HTTP credential.

### 4. Seed drift — the database ceiling is not what `seed.ts` says

`doctor` compares them. On this box it reported:

```
seed.ts has kind 9101 that the database does not
```

`pnpm migrate` does not seed. A seed-only change deploys into the image and then
does nothing. **The database is the ceiling that actually applies**; `seed.ts` is
only what the next re-seed *would* write.

```bash
cd ~/estiva-id && pnpm seed
```

---

## Two traps in the Convex setup

**`.env.local` names a cloud deployment.** `CONVEX_DEPLOYMENT=dev:hallowed-stork-966`
wins over `CONVEX_AGENT_MODE=anonymous`, so a bare `npx convex dev` stops on an
interactive *"You don't have access to the selected project — create a new
project?"* prompt. Under a launcher that looks exactly like a hang.

`estiva-up.sh` reads the local deployment name out of
`.convex/local/*/config.json` and passes it in the environment, which overrides
the file without editing it. The cloud pointer is left alone.

**`.env.local` is a hint, never the answer.** It has pointed at a different
deployment than the live one more than once, and has misled work here
repeatedly. Name the target explicitly.

---

## First run on a new machine

```bash
cd ~ && for r in buzz estiva-id peek-app estiva-ship estiva-docs; do
  [ -d "$r" ] || echo "missing: $r"
done
```

The five repos must be siblings — the scripts resolve paths from `$ESTIVA_ROOT`,
default `$HOME`. See the canon table in [../README.md](../README.md).

Then, once:

```bash
cd ~/estiva-id && cp .env.example .env
sed -i "s/^KEY_ENCRYPTION_KEK=.*/KEY_ENCRYPTION_KEK=$(openssl rand -hex 32)/" .env
pnpm install && pnpm db:up && pnpm migrate && pnpm seed
```

The service refuses to start without a real `KEY_ENCRYPTION_KEK`, because
silently defaulting it would be worse than failing.

Then set the three fail-closed variables from §3 above, and run
`estiva-up.sh`. Expect ~20 minutes on the relay's first compile.

---

## Checking it by hand

```bash
for p in 3000 3210 5173 5190 8787; do printf '%-6s ' $p; curl -s -o /dev/null -m 2 -w '%{http_code}\n' http://localhost:$p/; done
```

`000` means nothing is listening. Note that Estiva ID answers `404` on `/` and
is perfectly healthy — use `/readyz`:

```bash
curl -s localhost:8787/readyz
```

A caution learned writing `doctor`: `curl -w '%{http_code}'` already prints
`000` on a failed connection *and* exits non-zero, so an `|| echo 000` fallback
appends a second one and yields `000000`. That compares unequal to `000` and
reads as success. It reported a dead relay as healthy for two runs.

---

## Turning the Nostr side off

```bash
cd ~/peek-app && CONVEX_AGENT_MODE=anonymous npx convex env remove NOSTR_RELAY_URL
```

Peek then behaves as it did before the Nostr work. Nothing else changes.
