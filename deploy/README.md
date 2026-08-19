# Deploying the docs site

Target: `https://docs.estiva.app`, through the `estiva-prod` Cloudflare Tunnel,
on the same box as everything else.

Shape is identical to Estiva Ship's — CI builds an image, a systemd timer on the
box pulls it every two minutes — with **one deliberate difference**: the
container refuses to start without a password.

---

## What the password does, and does not, cover

**It gates the website, not the content.**

The GHCR package is public, like ship's and peek's, so the box needs no registry
credentials. But this image contains the documents themselves, which means
anyone who knows to try `docker pull ghcr.io/estiva-app/estiva-docs:main` gets
the whole site without ever meeting the password.

That was accepted on 2026-08-19, deliberately. What is published here is the
protocol specification, which is intended to become public anyway; the gate
exists because the docs are unfinished, not because they are confidential, and
obscurity is a fair match for "not ready yet". The alternative — a private
package — costs a standing registry credential on the box, which this deploy
posture otherwise avoids entirely.

**What would invalidate that trade:** anything genuinely confidential being
added to `site/nav.mjs`. If that happens, the package must go private and the
box needs a fine-grained PAT with `read:packages` only, scoped to `estiva-app`,
plus a rotation reminder. Nothing else about this deploy changes.

## The container refuses to start without a password

`deploy/entrypoint.sh` exits rather than serving unauthenticated, and the
healthcheck asserts an anonymous request gets **401**, not merely that nginx is
answering. A dropped gate would otherwise report perfectly healthy while the
site was open, which is the one mistake here that cannot be taken back.

---

## First deploy, by hand

### 1. Add the tunnel hostname

https://one.dash.cloudflare.com → **Networks** → **Tunnels** → **estiva-prod** →
**Published application routes**:

| Field | Value |
| -- | -- |
| Subdomain | `docs` |
| Domain | `estiva.app` |
| Path | *(empty)* |
| Type | `HTTP` |
| URL | `localhost:8083` |

`HTTP`, not `HTTPS`: that is the hop from `cloudflared` to the local container,
which has no certificate. The public side is HTTPS regardless. Adding the
hostname creates the DNS record automatically.

Do **not** set `HTTP Host Header`.

### 2. Create the GitHub repo and push

```bash
gh repo create estiva-app/estiva-docs --private --source=. --remote=origin --push
```

The first push runs the workflow and produces the image.

### 3. Make the image pullable

A new GHCR package is private by default even when created from a private repo:

> GitHub → `estiva-app` → **Packages** → `estiva-docs` → **Package settings** →
> **Change visibility** → Public.

The box then needs no registry credentials. Read the section above on what this
costs before doing it.

### 4. Lay out the deploy directory

```bash
ssh root@167.233.252.136 'mkdir -p /opt/estiva-docs'
scp deploy/docker-compose.yml deploy/update.sh \
    deploy/estiva-docs-update.service deploy/estiva-docs-update.timer \
    root@167.233.252.136:/opt/estiva-docs/
ssh root@167.233.252.136 'chmod +x /opt/estiva-docs/update.sh'
```

### 5. Set the password

```bash
ssh root@167.233.252.136
cd /opt/estiva-docs
printf 'DOCS_USER=estiva\nDOCS_PASSWORD=%s\n' "$(openssl rand -base64 18)" > .env
chmod 600 .env
cat .env    # this is what you send to invited readers
```

Generated rather than chosen: a shared password that somebody picked is a
password somebody reuses.

### 6. Start it

```bash
cd /opt/estiva-docs
docker compose pull
docker compose up -d
docker compose logs | head -3     # should say: auth: enabled for user 'estiva'
```

### 7. Verify through the tunnel

Check **both** halves. A 200 without credentials is the failure that matters,
and it is invisible if you only ever test the working case:

```bash
curl -s -o /dev/null -w 'anonymous: %{http_code}\n' https://docs.estiva.app/
curl -s -o /dev/null -w 'with pw:   %{http_code}\n' -u estiva:<password> https://docs.estiva.app/spec/
```

Expect `401` then `200`. If the first returns `200`, stop and fix it before
sending the link to anyone.

### 8. Turn on automatic deploys

```bash
cp estiva-docs-update.service estiva-docs-update.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now estiva-docs-update.timer
```

---

## Taking the password off, when the site goes public

Two steps, and the second is not optional.

**1.** Set `DOCS_PUBLIC=true` in `/opt/estiva-docs/.env` and
`docker compose up -d --force-recreate`. The entrypoint drops the `auth_basic`
directives and the `noindex` headers, and the healthcheck switches to expecting
200.

`DOCS_PUBLIC` is explicit rather than inferred from an empty password, because
"we decided to be public" and "somebody forgot to set the variable" must not
look the same to this container.

**2. Re-read `site/nav.mjs` first.** Everything listed there becomes world
readable and search-indexed the moment step 1 lands. The split was made on the
assumption that this day would come — that is why `operations/` was never
published and is not even copied into the image — but anything added to the nav
since then deserves one more look.

---

## Considering Cloudflare Access instead

Basic Auth is one shared password: it cannot be revoked for one person, it
cannot tell you who read what, and it travels by whatever channel somebody
pasted it into.

The tunnel is already in place, so **Cloudflare Access** is a dashboard task
rather than new infrastructure: add an Access application for
`docs.estiva.app`, policy `emails in <list>`, and readers get a one-time-code
email instead of a password. Revoking someone is removing a line. The free tier
covers 50 users.

That is the better answer for "only people we invite", and the two compose fine
— Access at the edge, Basic Auth still on the origin, so a tunnel
misconfiguration does not expose anything.

Not done here because you asked for a simple password, and this is one.

---

## Operating it

**Watch a deploy:** `journalctl -u estiva-docs-update -f`

**Deploy now:** `systemctl start estiva-docs-update`

**Rotate the password:** edit `.env`, then
`docker compose up -d --force-recreate`. No rebuild — the credential is never in
the image.

**A rotation does not un-share what the old password reached.** The package is
public, so anyone who pulled the image still has that copy of the docs. Rotating
stops future website access, nothing more.

**Roll back:** every build is tagged with its commit sha. Stop the timer first,
or it will pull `main` over the rollback within two minutes.

```bash
systemctl stop estiva-docs-update.timer
ESTIVA_DOCS_IMAGE=ghcr.io/estiva-app/estiva-docs:<sha> docker compose up -d --force-recreate
```

## Testing the image locally

```bash
docker build -t estiva-docs:local .
docker run -d --name docs-verify -e DOCS_PASSWORD=verify-me estiva-docs:local
docker exec docs-verify wget -q -S -O /dev/null http://127.0.0.1/ 2>&1 | head -1
docker exec docs-verify wget -q -S -O /dev/null \
  --header="Authorization: Basic $(printf 'estiva:verify-me' | base64)" \
  http://127.0.0.1/spec/ 2>&1 | head -1
```

`401` then `200`. Check from *inside* the container: on Docker Desktop under
WSL, ports published to `127.0.0.1` are not forwarded into the WSL loopback, so
`curl localhost:8083` fails even when the container is healthy.

One failure worth recognising: an anonymous request correctly returning **401**
while a *correct* password returns **500** means nginx cannot read
`/etc/nginx/.htpasswd`. Issuing the challenge needs no file; checking the
password does. The entrypoint chowns it to `nginx` for exactly this reason.
