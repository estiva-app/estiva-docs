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

## 2. Decision 1 — one repo for three packages, and `ui` outside it

**`protocol`, `platform` and `identity` live in one repository** at
`~/estiva-foundation` (`estiva-app/estiva-foundation`), npm workspaces, each
versioned and released independently. **`ui` stays its own repository**,
`estiva-app/estiva-ui`. Both join the sibling layout under `$HOME` that
`README.md` documents.

**This changed on 2026-08-26, the day it was written**, and the reasoning is
kept rather than tidied away. The first version of this ADR put all four in one
repo and defined a split trigger: *a package moves out when it acquires a
different consumer set or release cadence from the rest.* Within hours the
trigger fired for `ui`, on three counts at once and none of them hypothetical:

- **Nothing in the foundation depends on it.** `ui` needs React, clsx and
  tailwind-merge, and nothing of ours. `identity` and `platform` will both
  depend on `protocol` — those three genuinely want one repo, and `ui` gains
  nothing from being beside them.
- **It carries a toolchain the others have no use for.** Storybook, Tailwind,
  jsdom, React: 269 packages. In one repo, `npm ci` for a one-line `protocol`
  change installs all of it.
- **It has a different maintainer and will churn fastest**, because design
  churns fastest, while `protocol` should change rarely and carefully.

The cost, and it is real: two mental models instead of one, and "why is `ui`
different?" is a question every newcomer will ask. That is a documentation cost,
which this section is paying.

**What would fold `ui` back in:** `identity` or `platform` coming to depend on
it — sign-in screens shipping real components would do it — because every auth
change would then become a two-repo release. Worth watching during SHA-4.

**The objection, which is real.** b990b57 moved the agent out of Ship for a
reason that appears to apply here verbatim:

> this repository contained Peek's kinds, and this repository's CI had an
> opinion about Peek's wire format. An issue tracker should not.

A single foundation repo means `@estiva-app/ui`'s CI has an opinion about
`@estiva-app/protocol`. That is the same shape.

**Why the remaining three are nonetheless one repo.** The rule b990b57 actually
established is narrower than "one repo per unit of code": a repository should not
contain things outside its remit. Ship's remit is issue tracking, and Peek's
kinds were outside it. The foundation's remit *is* the shared protocol layer, and
`identity` and `platform` both build on `protocol`. Splitting those three means
either publishing a version to test a cross-package change, or a chain of
`npm link`s, for a team this size.

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
   move and a redirect; it does not cost a rewrite. The npm name does not change
   when a package moves, which is what makes this cheap.

**One cost that four repos would not pay, recorded because it is real.** Access
is granted per repository, so write on `ui` is write on `protocol`. With SHA-5
starting under a second pair of hands, that is not hypothetical. The mitigation
is `CODEOWNERS` — a package's owner reviews its changes — not a repo boundary,
because a boundary that exists to express permissions will express them badly
the moment somebody needs to change two packages at once.

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
  in posture and it should be a surprise to nobody.

**The licence is MIT**, decided 2026-08-26, and it is the default for every
`@estiva-app` package. `UNLICENSED` — which is what `@estiva-app/ui` carried —
means all rights reserved, and on public npm that reads as *anyone may download
this and nobody may use it*. A `LICENSE` file ships inside each tarball rather
than living only in the repo, because the tarball is what a consumer actually
receives.

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

### 4c. Releases are cut from CI, on a tag, and CI holds no token

The version bump is a PR — `package.json` plus a CHANGELOG entry. On merge, push
the tag `<package>@<version>`; a workflow on that tag builds and publishes.
Nobody publishes from a laptop, with exactly one exception below.

**This subsection originally said "a granular access token in `NPM_TOKEN`". That
was wrong, and the first real release proved it in the only way that counts.**
The tag went up, the workflow ran, the tarball was built, and npm answered:

```
npm error code EOTP
npm error This operation requires a one-time password.
```

The token authenticates; the account requires 2FA for writes; the token is not
permitted to bypass it. And npm's own notice says where this is going:

> npm tokens that bypass 2FA are being restricted for account changes and direct
> publishing.

Per [GitHub's changelog](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens/),
those restrictions took effect 2026-07-31 and **2FA-bypass tokens lose direct
publish entirely in January 2027**. A token in CI is therefore a decision with a
five-month shelf life, and choosing it would have meant discovering this again in
December with four packages depending on it.

**So: releases publish with trusted publishing (OIDC), and GitHub holds no npm
credential at all.** The workflow declares `id-token: write` and npm verifies the
run against a trusted publisher registered on the package — provider GitHub
Actions, org `estiva-app`, repo `estiva-foundation`, workflow `release.yml`. This
is the same posture the deploy workflows already argue for about SSH keys: the
objection to a standing credential in GitHub is not that it is hard to rotate, it
is that it exists.

**Two settings on the npm side, and neither is the default.** A trusted
publisher must be registered on each package — provider GitHub Actions, the org,
the repo, and the workflow *filename* — or npm falls back to token auth and
fails with `ENEEDAUTH` even though everything in the workflow is correct. Under
*Allowed actions*, `npm publish` alone is enough; `npm stage publish` is a
different flow nothing here uses. Under *Publishing access*, choose **"require
two-factor authentication and disallow bypass 2fa tokens"** — every option there
is compatible with OIDC, so the strict one is free, and it closes the door on
the exact credential class §4c already had to abandon.

**`registry-url` in `actions/setup-node` breaks OIDC, and lies about why.** With
it set, setup-node writes an `.npmrc` containing `_authToken=${NODE_AUTH_TOKEN}`
and, when no token secret is supplied, sets that variable to the literal
placeholder `XXXXX-XXXXX-XXXXX-XXXXX`. npm then authenticates with a nonsense
token instead of exchanging its OIDC assertion — and npm reports an unauthorised
write as **`404 Not Found`**, which reads as *the package does not exist* when
the package plainly does. Omit `registry-url` entirely.

Two consequences of that, both awkward and both better known now:

- **A package's *first* publish cannot use trusted publishing**, because the
  trusted publisher is configured on a package that already exists. Creating a
  package is therefore a deliberate manual act, from a laptop, with an
  interactive OTP — once per package, ever. Every release after it is CI.
- **Provenance is skipped, not refused.** This was the open question, and the
  answer is the mild one: `@estiva-app/hello@0.0.2` published from a **private**
  repo through trusted publishing, and npm simply recorded no attestations
  (`dist.attestations` is absent). It did not fail. So a private repo costs the
  provenance attestation and nothing else, and making the repo public is a
  choice about attestation rather than a precondition for releasing.

Delete the `NPM_TOKEN` secret once OIDC publishes successfully. A credential kept
"just in case" is a credential nobody rotates.

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

**Then proved again on the public registry, 2026-08-27, which is what closes
this ticket:**

| step | result |
| --- | --- |
| `0.0.1` published by hand, browser 2FA | live |
| installed into fresh clones of Peek, Ship, agent | resolved from `registry.npmjs.org` |
| each toolchain's own CI commands | pass — Peek 565 tests + `tsc -b && vite build`, Ship typecheck/test/build, agent typecheck + `tsx` |
| `0.0.2` published **by CI, through OIDC, with no credential in GitHub** | live |
| upgraded in all three, rebuilt | `0.0.2` in Peek's and Ship's built bundles; the agent compiled and ran an export that only exists in `0.0.2` |

**And the pipeline carried a real package the same day.** `@estiva-app/ui@0.1.0`
went out under these rules and is consumed by Peek and Ship from the registry —
so the rehearsal was overtaken by the thing it was rehearsing for.

**A propagation trap worth knowing.** A *new package name* is invisible on the
read path for minutes after a successful publish — `@estiva-app/hello` took
**204 seconds** to become installable, and `npm view` returns a flat `404` the
whole time while `npm access list packages` already lists it. A *new version* of
an existing package appeared in **1 second**. A 404 straight after publishing a
new name is not a failed publish.

**Not proved:**
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

- ~~**The tag → publish path is unproven.**~~ **This bullet was already false
  when it merged**, and the table above already said so — an internal
  contradiction worth recording rather than quietly deleting. The Actions outage
  it describes was real, but it had ended: `hello@0.0.2` published on its tag at
  07:37 UTC on 2026-08-27 (run `33048894123`), through the credential-free
  workflow, and the ADR merged later the same day. Written from the state of the
  world a few hours earlier and not re-checked before merging.

  **What was genuinely unproven until 14:25 UTC on 2026-08-27 is narrower, and it
  is the part that matters: a trusted publisher is registered per *package*.**
  `hello`'s success proved the workflow, the OIDC exchange and the tag parsing. It
  could say nothing about whether `@estiva-app/protocol` had a publisher
  registered, because that is a separate configuration on a separate package —
  and a missing one fails `ENEEDAUTH` in a way that looks like a workflow fault
  rather than a registry setting.

  `protocol@0.1.1` closed that (run `33082089732`), and it is the first time the
  path carried a package anything depends on rather than the throwaway. Two
  measurements from it:

  - **A new *version* of an existing package is readable in 1 second**, against
    the 243s the new *name* `@estiva-app/protocol` took. So a 404 after
    publishing a version — as opposed to a name — is a real failure, not
    propagation.
  - **Provenance is absent and nothing failed**, confirming §4c's finding on a
    second package: a private source repo costs the attestation only.

  The release also carried its own falsifiability. Its changelog says "Wire
  behaviour: unchanged", and that was checked rather than asserted — `diff -r`
  between 0.1.0's published tarball and 0.1.1's build was two lines, both the
  version string, and both versions compute an identical event id for identical
  input.

  **The lesson is about this document, not the pipeline.** A "not proved" list is
  a claim with a timestamp, and this one outlived its evidence by six hours
  because nobody re-ran the check between writing and merging.

## 7. Adding a package after this one

The org, the scope and the pipeline exist as of 2026-08-27. What follows is the
recipe, in the order the steps actually have to happen — the ordering is the part
that is not obvious, because two of these cannot be done in the other order.

1. **Write the package** against `tsconfig.base.json`: built ESM plus `.d.ts`,
   `publishConfig.access: "public"`, MIT, no ambient Node or DOM globals in the
   declarations (§4a).
2. **Publish the first version by hand**, from a maintainer's machine:

   ```bash
   npm publish --auth-type=web --browser=false
   ```

   It prints a URL, you authenticate in a browser, it completes. Passkeys work;
   there is no OTP to type. On WSL the browser is on the other side, so
   `--browser=false` prints the URL rather than failing to open one. **This step
   cannot be skipped or automated** — a trusted publisher is configured *on* a
   package, so the package has to exist first.
3. **Register the trusted publisher** on npmjs.com: provider GitHub Actions, the
   org, the repo, workflow filename `release.yml`, no environment. Allowed
   actions: `npm publish` only. Publishing access: *require two-factor
   authentication and disallow bypass 2fa tokens*.
4. **Every release after that is a tag.** Bump in a PR, then push
   `<name>@<version>` (or `v<version>` in a single-package repo). No credential
   goes near GitHub.
5. **Add it to `CONSUMERS.md`** in the same PR that gives it its first consumer,
   because §5's rule is only enforceable against a list somebody maintains.

**Still open, and it is the bus factor:** publish rights are held by one npm
account, `estiva-admin`. A second person should hold them before this matters.

**The throwaway stays.** `@estiva-app/hello` has done its job twice — once for
the manual first publish, once for the OIDC release — and it is the only thing
that can prove the pipeline again without risking a real package. Deprecate it
with `npm deprecate '@estiva-app/hello@*'` when it stops being useful; note that
**unpublishing is only possible within 72 hours**, so the name is permanent
either way.

## 8. Consequences

**Good:**

- One implementation of the wire format, which is the only thing the suite may
  not disagree about with itself. `diff -r` between two vendored copies stops
  being the safety mechanism.
- A consumer's tsconfig can no longer fail a foundation package's build, because
  a `.d.ts` is not typechecked with the consumer's flags. The measurement in §4a
  is what that sentence is worth.
- No registry auth anywhere: not on a laptop, not in three CI workflows, not in
  the scaffold REW-1 produces. And after §4c, no npm credential in GitHub either
  — the release workflow proves who it is rather than presenting a secret.
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
- The npm org, the packages and their licence are now real and public, and none
  of the three can be taken back cleanly: a name is permanent after 72 hours, and
  an MIT grant cannot be withdrawn from a version already published.

## 9. Related

> **One section follows this one**, despite Related reading as the end. §10 is
> new (SHA-11) and is numbered *after* the existing material so that every
> cross-reference into §1–§9 keeps resolving. [RFC 0.4](../protocol/RFC-0.4-WORKSPACE.md)
> §12 and [SPEC](../protocol/SPEC.md) carry the same quirk for the same reason.

- SHA-1 — this ADR's ticket. SHA-2…6 are what it unblocks
- [`0001-relay-canonical-by-default.md`](0001-relay-canonical-by-default.md) §8 —
  the README amendment about sharing packages but never interpretation
- b990b57 in `estiva-ship` — the agent's move out, and the reasoning §2 argues with
- `~/estiva-foundation/README.md` — the release runbook and the exact publish commands
- SHA-11 — §10's ticket, added 2026-08-31

---

## 10. Decision 5 — what makes an in-app implementation extractable

**Added 2026-08-31 (SHA-11).** §1–§9 decided where packages live, how they are
built, how they publish and who owns a break. They assume a package already
exists. This section is about the code *before* that — the period when a shared
implementation is still inside one app, which is where three of the programme's
next projects will spend most of their time.

### The rule, and why it is not "extract early"

**Functionality lands in a real app first and is packaged afterwards.**

Extraction with no consumer produces a package shaped like nothing. That is
SHA-7's outstanding bill: `createLiveRelay` went into `@estiva-app/protocol` as
a single implementation with a single caller, and no second consumer ever
pushed back on its API. §5 names an owner for a breaking change; it cannot name
one for an interface nobody has argued with.

But *"we will extract it later"* is precisely how `liveTopics.ts` became a
ticket. An intention held only in someone's head is not a plan, and by the time
the extraction is attempted the app has grown into every seam that was left
open. **So the intention has to be checkable while the code is being written**,
by someone reviewing a diff, without knowing whether extraction is imminent.

### The four constraints

Each one names the failure it prevents. A file that satisfies all four can be
moved by `git mv`; a file that fails one cannot be moved at all until it is
fixed.

1. **No imports from the app's data layer, store or config.** The dependency
   runs one way. *Prevents:* a module that needs the app's fixtures, directory
   or auth to run, and therefore cannot leave the building.

2. **Every environment touch is an injected parameter** — query function,
   signer, clock. Never a module-level global. *Prevents:* a singleton, a
   `window`, or a credential provider baked into module scope, each of which
   makes the module untestable without the environment it assumes and
   un-instantiable twice.

3. **Its tests run with no app.** If a test needs a deployment or a browser, the
   package cannot carry that test — and **untested code does not travel**.
   *Prevents:* an extraction that arrives in a second consumer with its safety
   net left behind in the first.

4. **Put it where it is going.** *Prevents:* the slowest failure of the four. A
   path that lies about what a file is, is how a thing quietly grows app-shaped
   — nothing breaks, and every later reader infers the wrong dependency
   direction from the directory name.

Constraints 1–3 are enforceable by a reviewer reading imports. Constraint 4 is
the one that needs deciding up front, because moving a file later is the change
nobody schedules.

### Three worked examples, all currently in the tree

Verified against `peek` `origin/main`, 2026-08-31.

| file | 1 imports | 2 injected | 3 tests alone | 4 path | verdict |
| --- | --- | --- | --- | --- | --- |
| `convex/nostr/projection.ts` | ✅ | ✅ | ✅ | ❌ | extractable today; only the path is wrong |
| `src/lib/textParsing.ts` | ❌ | — | — | ✅ | cannot leave the building |
| `src/nostr/liveTopics.ts` | ❌ | ❌ | — | ✅ | the bill SHA-7 is paying |

**`projection.ts` — the shape to copy.** 1,312 lines, and its entire import
list is two lines, both `@estiva-app/protocol`. Environment arrives as a
`QueryFn` type declared in the file itself: *"everything here takes a `query`
function rather than reaching for one. `foreign.ts` supplies the authenticated
bridge; a test supplies its own."* Its test file imports vitest, the module, and
a protocol type — nothing else, so it runs with neither Convex nor a browser.

It fails only constraint 4, and does so loudly: it sits under `convex/` while
its own header says *"Nothing in this file knows what Linear-lite is."*

> **Quote it accurately.** This header is widely cited in the programme as
> *"takes a query function and knows nothing about Convex"* — including in
> [RFC 0.4](../protocol/RFC-0.4-WORKSPACE.md) §15.2 and on PRO-1. That sentence
> is not in the file. The two real sentences are the ones above, and they say
> something slightly stronger: the file is ignorant of *the app it renders*, not
> merely of its own backend.

**`textParsing.ts` — constraint 1, failed three times over.** Its first three
lines import `PEOPLE`, `TOPICS` and `APP_FILES`/`DOCUMENT_FILES` from `@/data/`.
The parser needs Peek's own fixture directory to run. Note the direction of the
mistake: the logic is generic, and only its *inputs* are app-bound — which is
the version of this failure that looks harmless in review.

**`liveTopics.ts` — constraint 2, and constraint 1 as well.** `let instance:
Instance | null = null` at module scope; `window.navigator.onLine`; and
`validToken` imported from `@/auth/estivaId`, which is the app's credential
provider. The roadmap records this one as failing constraint 2; it fails 1 too,
and the pairing is typical — a module-level singleton is usually holding
something it reached for rather than received.

### What this section does not decide

- **When to extract.** That is per-project, and the answer is generally "after a
  second consumer has pushed back" — see §5 and SHA-7. This section governs how
  the code is written in the meantime, not the timing.
- **What goes in a package versus what stays in the app.** A package boundary is
  a design question; this is a hygiene rule that makes either answer cheap.
- **Whether a fold may live in a package.** It may, above `@estiva-app/protocol`,
  which deliberately contains none. That is a protocol-layering question, not an
  extractability one.

### Consequences

**Good:** an extraction becomes a `git mv` plus a `package.json`, which is a
reviewable change rather than a project. The four constraints are cheap while
writing and expensive to retrofit, and the asymmetry is the whole argument.

**Costs, accepted:**

- **Constraint 2 makes some code more verbose** than reaching for a global, and
  the verbosity lands on the app that has not yet asked for a package.
- **Constraint 4 forces a placement decision early**, sometimes before anyone
  knows whether the thing will be shared. The failure it prevents is silent, so
  it will occasionally be paid for nothing.
- **None of the four is machine-checked.** They are review discipline, and a
  lint rule for constraint 1 would be worth having if this is violated twice.

