# Production

Everything runs on **one Hetzner box**, `167.233.252.136`, under `/opt/<service>`,
behind the `estiva-prod` Cloudflare Tunnel.

| Service | Public URL | Local port | Auto-updates? |
| --- | --- | --- | --- |
| Buzz relay | `https://estiva.estiva.app` | — | **No — deploy by hand** |
| Estiva ID | `https://id.estiva.app` | 8787 | Yes, `estiva-id-update.timer` |
| Estiva Peek | `https://peek.estiva.app` | 8082 | Yes, `estiva-peek-update.timer` |
| Estiva Ship | `https://ship.estiva.app` | 8081 | Yes, `estiva-ship-update.timer` |

CI cannot SSH to the box — the firewall allows TCP 22 from one address — so
deployment is pull-based: CI builds an image to `ghcr.io/estiva-app/<svc>`, a
systemd timer on the box polls every 2 minutes and runs `update.sh`.

**Every unit is prefixed `estiva-`**, including Peek's and Ship's, and this
table said otherwise until 2026-09-08. It is worth more than a typo: a
`systemctl is-active ship-update.timer` returns `inactive` for a unit that does
not exist, and `systemctl list-unit-files "ship-update*"` says *"0 unit files
listed"* — which reads as **"auto-deploy is broken"** rather than *"you asked
about the wrong name"*. That cost a wrong conclusion, reported out loud, during
PER-3's deploy. `systemctl list-timers --all | grep estiva` is the check that
cannot be fooled this way, because it lists what exists rather than answering
about what you named.

Note also that the image repository is `ghcr.io/estiva-app/ship`, not
`estiva-app/estiva-ship` — the same trap one layer down. `docker manifest
inspect` on the wrong name returns nothing, and piping nothing to `sha256sum`
yields `e3b0c442…`, the hash of the empty string, which looks like a digest.

Peek additionally has a Convex backend. **Its Convex deployment is
`honorable-guineapig-592`, which Convex labels a *Development* deployment.**
`--prod` resolves somewhere else entirely and will report a reassuring nothing
about a database nobody is using. Name the target explicitly.

---

## The relay is the exception

**Buzz has no update timer.** The other three do, which is exactly what makes
this easy to forget — a merged relay change sits in the registry while the box
keeps serving the old image, healthy the whole time.

```bash
cd /opt/buzz && docker compose pull relay && ./run.sh restart
```

Pull `relay` only. `run.sh pull` also pulls postgres, redis and minio.

**Verify by comparing the running image id to `:nfb`.** Health tells you
nothing here — a healthy relay serving a stale image is precisely the state this
produces.

Relay images are built from the **`nfb-demo-kinds`** branch by `relay-image.yml`,
not from `main`. Only that one workflow is enabled in `estiva-app/buzz`; the
other 12 upstream workflows are `DISABLED_MANUALLY` to save minutes. That is a
repo setting, so it survives upstream merges. Re-enable with
`gh workflow enable <file>`.

---

## Deploy order, when a change spans services

```
merge → wait for the image pull → re-seed if needed → verify the state
```

The verify step is not optional. A production re-seed that ran **before** the
new image had been pulled wrote the old values back and exited 0.

`update.sh` runs `migrate`. It does **not** run `seed`. A seed-only change
deploys into the image and then does nothing. Re-seed by hand and check the row:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds from app_credentials"
```

### Adding a kind to a ceiling is a seed change for two rows and a psql change for three

This used to say adding a kind to an app's ceiling *is* the seed-only case. It
is, for `estiva-peek` and `estiva-ship` — and **those are the only two rows
`SEED_APPS` holds**. Production has five:

```
claude-agent    the CLI, the Desktop extension and the Claude Code plugin
estiva-peek     seeded
estiva-ship     seeded
pc-0a4935       a self-service credential
vscode-604525   a self-service credential
```

The other three were created outside the seed, so **no seed change and no
re-seed will ever touch them**, and a green `seed.test.ts` says nothing about
what they hold — its `claude-agent` assertions are guarded with `if (agent)` and
are no-ops. Granting one of those a kind is a `psql` update, written so a re-run
is a no-op:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id <<'SQL'
update app_credentials set allowed_kinds = allowed_kinds || 40003, updated_at = now()
 where client_id = 'claude-agent' and not (40003 = any(allowed_kinds))
returning client_id, allowed_kinds;
SQL
```

Read **every** row before and after and compare the two, not just the one being
changed — the point of the check is the rows you did not mean to touch.

Two things that follow, both easy to miss:

- **The three unseeded rows drift apart silently.** AGE-3 granted 40003 to
  `claude-agent` and not to `pc-0a4935` or `vscode-604525`, so the same feature
  works in one surface of the agent and is refused in the others. That is a
  decision, but it has to be a deliberate one.
- **The new ceiling reaches a client on its next `/token`**, not on a restart.
  It is read from the token response, so nothing needs redeploying — but a
  process holding an hour-long token keeps the old one until it renews.

---

## Logs

**Estiva ID's application logs are not in the journal.** They are held by
Docker's json-file driver:

```bash
docker logs --since 6h estiva-id-estiva-id-1
```

Filter `"path":"/(healthz|readyz)"` noise. The journal *does* hold
`estiva-id-update` (the deploy timer), which is what makes the mistake easy —
`journalctl -u estiva-id-update` works fine, so the journal looks like the right
place for everything. A `journalctl | grep -c` returning 0 proves nothing.

Two further limits:

- `docker logs` reaches back only to container start. Check
  `docker inspect -f '{{.State.StartedAt}}'` before concluding how long a bug
  has existed.
- Nothing ships these logs off the box. For anything older than the current
  container, `audit_events` in Postgres is the only durable record — and it
  holds only what the code deliberately audited.

---

## CORS

Ship and Peek's browser code talks to the relay directly, so the relay must name
every origin:

```
BUZZ_CORS_ORIGINS=https://estiva.estiva.app,https://peek.estiva.app,https://ship.estiva.app
```

in `/opt/buzz/.env`, followed by a relay restart. **Omit an origin and that app
loads fine and then fails every request** — a slow thing to diagnose.

---

## Session and offboarding timing

Convex validates JWTs statelessly against JWKS, so **offboarding does not
propagate to Peek immediately.** A leaver holding a live token keeps their Peek
session until it expires. The relay side is instant; the app side is not.

`JWT_TTL_SECONDS` is currently 3600. It was raised from 600 because no refresh
grant exists yet; until one does, that window is the cost of usable browser
sessions.

Offboarding the relay operator is refused outright — it would revoke its own
admission and disable the capability for the whole workspace. See
`estiva-id/docs/OFFBOARDING.md` for the runbook and the incident behind that
rule.

---

## Git access from the dev box

Two GitHub accounts are in play and **the transport decides which one gets the
commit**: the SSH key authenticates as `miky-btc`, `gh` is authenticated over
HTTPS as `HonzaMikula`.

`peek` and `ship` have SSH origins; `estiva-id` and `buzz` are HTTPS.

`SSH_AUTH_SOCK` goes stale when the agent restarts, and the failure is quiet —
a failed fetch leaves `origin/main` where it was, so a new branch is silently
cut from a stale commit. `ssh-add -l` distinguishes the two cases:

| Exit | Meaning | Fix |
| --- | --- | --- |
| 2 | Agent unreachable — stale `SSH_AUTH_SOCK` | Auto-repaired by the block at the top of `~/.bashrc` |
| 1 | Agent alive, no identities — after a reboot | `ssh-add ~/.ssh/id_ed25519`, once per boot. Not automatable, the key has a passphrase |

Check `ssh-add -l` succeeds before trusting any remote-tracking ref.
