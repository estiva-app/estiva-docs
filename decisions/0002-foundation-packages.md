# ADR 0002 — Foundation packages: one repo, public npm, built ESM, and a named owner for a break

- **Status:** accepted
- **Date:** 2026-08-26
- **Applies to:** `@estiva-app/protocol`, `@estiva-app/platform`, `@estiva-app/identity`, `@estiva-app/ui`, and every repo that consumes them — `peek`, `ship`, `estiva-agent`, and the scaffold REW-1 produces
- **Supersedes:** nothing. This is the first decision about the shared layer

---

## 1. Context

Four apps are meant to inherit one implementation of the wire format, identity,
platform concerns and UI. Today they inherit it by copying: `estiva-agent`
vendors Ship's `src/` and `lib/nostr/` at identical paths, and `diff -r` is the
mechanism keeping them honest. That was the right call when it was made (see
b990b57) and it does not survive a fourth consumer.

SHA-1 is a gate rather than a feature because the failure it prevents is
expensive and late: an extraction that lands as a path dependency or a git
submodule is not inheritance, and has to be redone. So the plumbing gets decided
and *proved* before any real code moves.

This ADR records four decisions. The second was made by Miky and is recorded
here rather than reasoned to; the other three were open.

## 2. Decision 1 — one repo, `estiva-foundation`, npm workspaces

All four packages live in **one repository** at `~/estiva-foundation`
(`estiva-app/estiva-foundation`), joining the sibling layout under `$HOME` that
`README.md` documents. Each package versions and releases independently.

**The objection, which is real.** b990b57 moved the agent out of Ship for a
reason that appears to apply here verbatim:

> this repository contained Peek's kinds, and this repository's CI had an
> opinion about Peek's wire format. An issue tracker should not.

A single foundation repo means `@estiva-app/ui`'s CI has an opinion about
`@estiva-app/protocol`. That is the same shape.

**Why it is nonetheless one repo.** The rule b990b57 actually established is
narrower than "one repo per unit of code": a repository should not contain
things outside its remit. Ship's remit is issue tracking, and Peek's kinds were
outside it. A foundation repo's remit *is* the shared layer — all four packages
are the same thing seen from four angles, and three of them will depend on
`protocol`. Splitting them means either publishing a version to test a
cross-package change, or a chain of `npm link`s, for a team this size.

Three concrete costs of four repos that one repo does not pay: a protocol change
plus its identity consumer cannot land atomically; four release toolchains drift
independently; and a new person clones four things to change one.

**What is done about the objection**, because it is not dismissed:

1. **CI is per-package jobs with path filters**, not one job over the repo. A
   change under `packages/protocol/**` does not run `ui`'s jsdom tests, so a
   flaky UI test cannot block a wire-format release.
2. **No app code, ever.** The remit is the shared layer. The moment something
   app-specific is proposed for this repo, the answer is no — that is the
   b990b57 line, and it is the line that matters.
3. **A written split trigger.** A package moves out when it acquires a *different
   consumer set or release cadence* from the rest, or the second time a CI run
   for one package blocks a release of another. Splitting later costs a repo
   move and a redirect; it does not cost a rewrite.

## 3. Decision 2 — public npm, scope `@estiva-app` (already decided)

**Made by Miky, recorded here.** Packages publish to the **public npm registry**
under the **`@estiva-app`** scope.

Nothing in these packages is secret — they speak a public protocol to a public
relay. A private registry would pay a permanent tax in every build, on every
machine, for every future app, to protect something that is not secret. SHA-1
names the consuming-side token as the thing that "breaks silently and at the
worst moment", and public removes that failure mode rather than managing it. It
also makes this repo's README literally true: apps interoperate "exactly as a
third party's app would", and a third party can now install what they install.

The scope is **`@estiva-app`, not `@estiva`**: `@estiva` is a registered npm
scope belonging to someone else. `@estiva-app` matches the GitHub org exactly,
which is a bonus rather than a compromise. Verified free on 2026-08-26 — the
registry 404s for `@estiva-app/hello`, `/protocol`, `/platform`, `/identity` and
`/ui`.

**Three footguns, each of which reads as something else when it fires:**

- **Scoped packages default to `restricted`.** Without `--access public` or
  `publishConfig.access: "public"`, the first publish fails in a way that reads
  like a permissions bug. Every package here carries the `publishConfig` field,
  so the flag can never be forgotten. *(Verified: the 0.0.2 publish below passed
  no flag and the registry still recorded public access.)*
- **`--provenance` stays off.** It attests to a *public* source commit, and
  `estiva-foundation` is private like the other five repos. Turn it on if and
  when the repo is public; do not add the flag hopefully.
- **Publishing a package publishes its source.** All six repos are private
  today. A published tarball ships `dist/`, `src/` and source maps, so the
  foundation's code becomes public even though its repo is not. That is
  consistent with the decision — the protocol is public — but it is a real change
  in posture and it should be a surprise to nobody. It also means the packages
  need a **license**; the throwaway used MIT and the real ones are an open
  question (§8).

## 4. Decision 3 — versioning, release, and what is in the tarball

### 4a. The packages ship **built ESM plus `.d.ts`**, not TypeScript source

Every package emits to `dist/` with `tsc`: ES2022, ESM only, `declaration`,
`declarationMap`, `sourceMap`, and `src/` in the tarball so stepping in lands on
TypeScript.

This was **measured, not reasoned**. The same trivial package was published
twice to a local registry — once built, once as raw `.ts` with `exports.types`
and `exports.default` both pointing at `src/index.ts` — and installed into clean
checkouts of all three consumers:

| consumer | command CI runs | built `dist/` | raw `.ts` source |
| --- | --- | --- | --- |
| Ship | `npm run typecheck` (`tsc --noEmit`) | exit 0 | **exit 2** |
| Ship | `npm run build` (esbuild) | exit 0 | exit 0 |
| Peek | `npm run build` (`tsc -b && vite build`) | exit 0 | exit 0 |
| agent | `npm run typecheck`, then `tsx` | exit 0 | *(not reached)* |

The raw-TypeScript failure is the whole argument:

```
node_modules/@estiva-app/hello-raw/src/index.ts(9,9):
  error TS6133: 'unusedLocal' is declared but its value is never read.
```

Ship's `noUnusedLocals: true` is being applied to a library Ship does not own.
`skipLibCheck` does not save you — it skips `.d.ts`, and these are `.ts`. **The
same package version is green in Peek and red in Ship**, and the only difference
is a compiler flag in the consumer's tsconfig. That is b990b57's failure mode
exactly, relocated into a typecheck: with raw source, every consumer's tsconfig
holds an opinion about the foundation's code.

Note the second row too. Ship's **esbuild build passes** on the package that
fails its typecheck, so a bundler proves nothing here — only the typecheck
catches it, and only in one of the two apps.

Two constraints follow, and they are in `tsconfig.base.json` with the reasoning
inline:

- **`target`/`lib` are ES2022** — Ship's target, the lower of the two, so no
  consumer has to downlevel.
- **No `lib: ["dom"]` and no `types: ["node"]` in a published package.** Peek's
  app config sets `types: ["vite/client"]`; Ship's sets `types: ["node"]`. A
  `.d.ts` reaching for an ambient global from either one compiles in one repo and
  fails in the other. Anything DOM- or Node-shaped is a parameter, not a global.
- **Relative imports inside a package carry `.js` extensions.** `tsc` copies the
  specifier through untouched, so an extensionless one emits an import Node
  cannot resolve and only some bundlers forgive. The throwaway is two files on
  purpose, so this is exercised rather than assumed.

### 4b. Semver, with a wire rule for `@estiva-app/protocol`

Independent semver per package. Packages start at `0.x` and stay there until two
apps consume them in production; within `0.x`, **MINOR carries the break**, which
is what `^0.1.0` already means to npm.

For `@estiva-app/protocol`, a MAJOR is not a TypeScript event, it is a
**protocol** event. Two rules, and the second is the one that gets missed:

1. A breaking TypeScript API is a MAJOR, as everywhere else — it breaks builds.
2. **A change to the bytes an app publishes is a MAJOR even when the TypeScript
   signature is identical.** Event id computation, serialization order, tag
   semantics, what goes into the signature input: a refactor that alters any of
   those is a protocol break wearing a patch's clothing, and the relay is what
   finds out.

Every `protocol` release note answers the wire question explicitly, including
when the answer is nothing:

> **Wire behaviour:** unchanged.

A missing line is what lets a bytes-changing release pass as a refactor, so
"unchanged" is written out rather than left implied.

### 4c. Releases are cut from CI, on a tag

The version bump is a PR — `package.json` plus a CHANGELOG entry. On merge, push
the tag `<package>@<version>`; a workflow on that tag runs the build and
publishes. Nobody publishes from a laptop.

CI authenticates with a **granular access token scoped to `@estiva-app`**, held
as the `NPM_TOKEN` repo secret. Not a personal classic token: a classic token is
a standing credential for everything its owner can publish, which is the same
objection the deploy workflows already make about SSH keys in GitHub.

## 5. Decision 4 — who owns a breaking change

**Whoever makes the break opens the upgrade PR in every consumer, and the major
does not publish until those PRs exist.**

Concretely:

- The foundation repo carries `CONSUMERS.md`: which repo depends on which
  package. "Every consumer" has to be a list somebody can read, not folklore.
- A MAJOR (or a `0.x` MINOR) is published only when every consumer in that list
  has an upgrade PR **open**, authored by the person making the change. Merged is
  better; open is the bar, because a consumer's reviewer should not be able to
  block a foundation release indefinitely.
- The author owns those PRs to merge. If a consumer cannot upgrade within a week,
  that blocker is filed as an issue on the foundation repo *before* the major
  ships — a silently stalled upgrade is the outcome this rule exists to prevent.
- **Prefer the two-step:** an additive MINOR that deprecates, then a MAJOR that
  removes. Consumers move between the two at their own pace, and the break stops
  being an event.
- Never publish a major "for adoption later". That is how an app ends up pinned
  to an old version forever, which is exactly what SHA-1 predicted.

## 6. What the throwaway proved, and what it did not

`@estiva-app/hello` exists to find out that the pipeline is broken before a real
extraction depends on it.

**Proved end to end against a real registry** (a local Verdaccio, which speaks
the npm protocol), from **fresh `gh repo clone` checkouts** of all three
consumers — not a linked path, not a local `node_modules`:

| step | result |
| --- | --- |
| `npm publish` 0.0.1 | published, public access |
| install into Peek, Ship, agent | resolved by name from the registry, lockfiles record the tarball |
| Ship `npm run typecheck && npm test && npm run build` | pass — 56 changes, 7 conversations, bundle built |
| Peek `npm run test:run` | pass — 42 files, 565 tests |
| Peek `npm run build` (`tsc -b && vite build`) | pass, `0.0.1` present in `dist/assets/*.js` |
| agent `npm run typecheck`, `tsx scripts/hello-check.ts` | pass, printed `hello@0.0.1` |
| bump to 0.0.2, adding a new export | published |
| upgrade all three, rebuild | all three at `0.0.2`; **`0.0.2` and only `0.0.2` in Peek's and Ship's built bundles**; the agent compiled and ran the new export |

The last row is the one worth insisting on. "The lockfile says 0.0.2" is not the
check — the built bundle carrying the new version string is, and that is why the
package exports a version constant at all.

**Not proved, and honestly so:**

- **Nothing has been published to the public npm registry.** There are no npm
  credentials on this machine (`~/.npmrc` absent, `npm whoami` → `ENEEDAUTH`) and
  the `@estiva-app` org does not exist yet. Everything above ran against a local
  registry, which exercises the client, the tarball, resolution and the upgrade —
  but not npm's auth, org permissions or scope creation. §7 is what remains.
- **Peek's Vercel build no longer exists.** SHA-1's done-when names it
  specifically, because a private-registry token would break there first.
  Confirmed obsolete by Miky on 2026-08-26: `peek-develop.vercel.app` is a
  leftover, still serving a build four commits behind `main`, and the repo shows
  no Vercel check-runs and no GitHub deployments — only `github-actions`. **Peek's
  build gate is GitHub Actions**, `npm ci` → `npm run test:run` → `npx convex
  deploy --cmd 'npm run build'`, and the image build after it. That is the check
  the done-when's Vercel clause now means, and it passed here from a clean
  checkout: 42 test files, 565 tests, then `tsc -b && vite build` with the
  package resolved by name.

  Two loose ends this leaves in `peek-app`, both stale rather than harmful:
  `vercel.json` and the "Publishing them on Vercel" section of `HOW-TO-RUN.md`
  describe a deployment that is gone. `@vercel/analytics` is *not* stale — it
  runs in production on the Hetzner deploy.

- **The tag → publish path is unproven.** GitHub Actions has been in a major
  outage since 15:11 UTC on 2026-08-26 and queues nothing, org-wide. The first
  release will be published from a laptop out of necessity; the second one must
  go through `release.yml`, or §4c is a decision nobody has executed.

## 7. Setup this implies, and nobody has done it

In order, all of it human work that needs an npm account:

1. **Create the `@estiva-app` org on npm.** The scope and all five names were
   free on 2026-08-26; a scope is claimed by whoever gets there first.
2. **Decide who holds publish rights** — at least two people, or the bus factor
   is one.
3. **Mint a granular access token** scoped to `@estiva-app`, read-write, and put
   it in the `estiva-app/estiva-foundation` repo secrets as `NPM_TOKEN`. Not a
   personal classic token (§4c).
4. **Publish `@estiva-app/hello@0.0.1`, then `0.0.2`**, and re-run §6 against the
   public registry from clean checkouts. The commands are in the foundation
   repo's README.
5. **Retire the throwaway** once SHA-2 lands a real package: `npm deprecate
   '@estiva-app/hello@*'`. Note that **unpublishing is only possible within 72
   hours**; after that the name is permanent, so "unpublish or leave it as
   documentation" resolves to deprecate-and-leave unless it happens immediately.

## 8. Consequences

**Good:**

- One implementation of the wire format, which is the only thing the suite may
  not disagree about with itself. `diff -r` between two vendored copies stops
  being the safety mechanism.
- A consumer's tsconfig can no longer fail a foundation package's build, because
  a `.d.ts` is not typechecked with the consumer's flags. The measurement in §4a
  is what that sentence is worth.
- No registry auth anywhere: not on a laptop, not in three CI workflows, not in
  the scaffold REW-1 produces.
- A third party can install exactly what the suite installs, which is the interop
  claim made literal.

**Costs, accepted:**

- **A published package cannot be recalled** after 72 hours. Names are permanent
  and mistakes are visible.
- **The foundation's source becomes public** while its repo stays private (§3).
- **A monorepo's CI can still cross-block** if the path filters are written
  carelessly. That is the objection in §2 surviving the mitigation, and the split
  trigger is the answer to it.
- **A build step now stands between editing a package and seeing it in an app.**
  Raw TypeScript would have avoided that, and §4a is why it is not worth it.
- Publishing requires an npm org that does not exist yet, so the last leg of this
  ADR is unproven until someone with an npm account acts.

## 9. Related

- SHA-1 — this ADR's ticket. SHA-2…6 are what it unblocks
- [`0001-relay-canonical-by-default.md`](0001-relay-canonical-by-default.md) §8 —
  the README amendment about sharing packages but never interpretation
- b990b57 in `estiva-ship` — the agent's move out, and the reasoning §2 argues with
- `~/estiva-foundation/README.md` — the release runbook and the exact publish commands
