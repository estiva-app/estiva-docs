# Production

Everything runs on **one Hetzner box**, `167.233.252.136`, under `/opt/<service>`,
behind the `estiva-prod` Cloudflare Tunnel.

| Service | Public URL | Local port | Auto-updates? |
| --- | --- | --- | --- |
| Buzz relay | `https://estiva.estiva.app` | — | **No — deploy by hand** |
| Estiva ID | `https://id.estiva.app` | 8787 | Yes, `estiva-id-update.timer` |
| Estiva Peek | `https://peek.estiva.app` | 8082 | Yes, `peek-update.timer` |
| Estiva Ship | `https://ship.estiva.app` | 8081 | Yes, `ship-update.timer` |

CI cannot SSH to the box — the firewall allows TCP 22 from one address — so
deployment is pull-based: CI builds an image to `ghcr.io/estiva-app/<svc>`, a
systemd timer on the box polls every 2 minutes and runs `update.sh`.

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

`update.sh` runs `migrate`. It does **not** run `seed`. A seed-only change —
which is what adding a kind to an app's ceiling is — deploys into the image and
then does nothing. Re-seed by hand and check the row:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds from app_credentials"
```

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
