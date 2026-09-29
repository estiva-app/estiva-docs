# Running the Estiva Suite locally

Every command on this page was run on a Windows 11 + WSL Ubuntu box on
2026-08-18 and produced the output shown. Where something does **not** work
yet, it says so rather than describing what it would do.

> **Do not follow `peek-app/docs/buzz-compat/RUNNING.md`.** It describes a
> backend and a sign-in Peek no longer has, and following it gets you stuck on
> steps for systems that do not exist — a failure that reads as a broken
> environment.

---

## TL;DR

```bash
~/estiva-docs/scripts/estiva-up.sh
```

```bash
~/estiva-docs/scripts/estiva-doctor.sh
```

`up` starts everything in dependency order and waits for each service to
actually answer. `doctor` tells you what is working — including the things
that are broken while every service reports healthy.

---

## What runs, and where

| # | Service | Port | Started by | Needed for |
| --- | --- | --- | --- | --- |
| 1 | Buzz Postgres / Redis / MinIO | 5432, 6379, 9000 | `docker compose` in `~/buzz` | everything |
| 1 | Estiva ID Postgres | **5433** | `pnpm db:up` in `~/estiva-id` | Estiva ID |
| 2 | **Buzz relay** | 3000 | `./bin/just relay` | all publishing |
| 3 | **Estiva ID** | 8787 | `pnpm dev` | sign-in, signing, profiles |
| 4 | **Peek** | 5173 | `npm run dev` | — |
| 5 | **Ship** | 5190 | `npm run serve` | — |

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

### Why a script rather than five terminals

Not to save typing. Most of what breaks here is silent: the
service starts, answers `200`, and does nothing. `doctor` exists to name them
out loud, and `up` exists so a service never starts against a dependency that is
still booting.

---

## What is broken locally right now

`doctor` reports these. Both are real, and neither shows up as an error
in any app.

### 1. Estiva ID's three fail-closed env vars

All three default to empty, and empty turns a feature **off** rather than
erroring. The service starts and `/readyz` returns `ok` with all three blank.

| Variable | Empty means | Local value |
| --- | --- | --- |
| `SIGN_NIP98_ALLOWED_URL_PREFIXES` | `/sign` refuses **all** kind:27235 — no app can authenticate to the relay bridge at all | `http://localhost:3000` |
| `RELAY_BRIDGE_URL` | Profile publishing is off — `kind:0` never reaches anyone | `http://localhost:3000` |
| `COMMUNITY_HOST` | Handles claim no community, and Buzz **silently discards** a `kind:0` that disagrees | the relay's community host |

The first one is the nastiest: an app can hold a correctly signed event and
still be unable to publish it, because it cannot mint the HTTP credential.

### 2. Seed drift — the database ceiling is not what `seed.ts` says

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

Then set the three fail-closed variables from §1 above, and run
`estiva-up.sh`. Expect ~20 minutes on the relay's first compile.

---

## Checking it by hand

```bash
for p in 3000 5173 5190 8787; do printf '%-6s ' $p; curl -s -o /dev/null -m 2 -w '%{http_code}\n' http://localhost:$p/; done
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

## Running Peek without the relay

With `VITE_RELAY_URL` unset or empty, Peek runs on its built-in mock data and
nothing reaches the relay (`peek-app/src/api/relayUrl.ts`, `hasRelay`). Nothing
else changes.
