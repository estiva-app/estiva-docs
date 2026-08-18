# Estiva Suite — shared documentation

The cross-repo documentation for the Estiva Suite: what the protocol is, how to
run the whole thing on one machine, and how it is deployed.

**This repo holds only what is true across repos.** Anything that goes stale
when one repo's code changes belongs in that repo. The test:

> If I change code in repo X, does this document become wrong?
> Yes → it lives in X. No → it lives here.

That rule is why `estiva-id/docs/ARCHITECTURE.md` is *not* copied here, only
linked. A second copy of a design drifts from the first, and the drift is
invisible until someone builds against the wrong one.

---

## What the suite is

**Buzz is the neutral protocol layer. Estiva is a vendor suite on top of it.**
The apps interoperate through published Nostr events and NIP-89 manifests,
exactly as a third party's app would — there is no shared database, no shared
package, and no private channel between them.

| Repo | What it is | Language |
| --- | --- | --- |
| **buzz** | The relay. Forked from [block/buzz](https://github.com/block/buzz). Storage, access control, the HTTP bridge, the kind allowlist | Rust |
| **estiva-id** | Identity: passkeys, key custody, remote signing, the profile publisher, admission | Node + Hono + Postgres |
| **peek** | Team communication — DMs, Topics, Huddles, Screener, Desk | React + Vite + Convex |
| **ship** | A minimal issue tracker — projects, issues, comments | TypeScript, plain DOM |

Peek and Ship are the proof: two apps, built separately, sharing no code and no
database, working on the same objects in the same Folder.

## Naming, and where things live

Three naming schemes are in circulation. **This is the canon**, and the scripts
in this repo depend on it:

| Called | GitHub | Local path |
| --- | --- | --- |
| Buzz | `estiva-app/buzz` | `~/buzz` |
| Estiva ID | `estiva-app/estiva-id` | `~/estiva-id` |
| Estiva Peek | `estiva-app/peek` | `~/peek-app` |
| Estiva Ship | `estiva-app/ship` | `~/estiva-ship` |
| *(these docs)* | `estiva-app/estiva-docs` | `~/estiva-docs` |

All five are siblings. Cross-repo links in this repo are written relative to
that layout (`../peek-app/...`), never as absolute paths.

---

## Start here

| If you want to… | Read |
| --- | --- |
| **Get the whole suite running on your machine** | [local-dev/RUNNING.md](local-dev/RUNNING.md) |
| **Build an app that works with Estiva** | [protocol/SPEC.md](protocol/SPEC.md) |
| Look up an event kind | [protocol/KINDS.md](protocol/KINDS.md) |
| Add a *new* kind to the ecosystem | [protocol/ADDING-A-KIND.md](protocol/ADDING-A-KIND.md) |
| Understand *why* the protocol is shaped this way | [protocol/RATIONALE.md](protocol/RATIONALE.md) |
| Deploy, or debug production | [operations/PRODUCTION.md](operations/PRODUCTION.md) |
| Know which docs in each repo are worth reading | [repos/](repos/) |

## For Claude

Each repo's `CLAUDE.md` covers that repo. This one covers the seams between
them. If you are working in one repo and need to know how another behaves, read
the page here rather than reading the other repo's source — the pages here state
what is *guaranteed* across the boundary, which is a much smaller surface than
what the other repo happens to do today.

**Three things that have repeatedly cost hours, all the same shape:** a
component reported success while the state it should have produced was never
written. Before calling anything done, go and look at the state — the relay's
stored event, the Postgres row, `origin/main` — not at the tool that reported
success. See [operations/SILENT-FAILURES.md](operations/SILENT-FAILURES.md).
