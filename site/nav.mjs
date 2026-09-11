/**
 * Which documents the site publishes, and how they are grouped in the sidebar.
 *
 * **Publication is opt-in, and that is the whole point of this file.** A doc
 * added to the repo is NOT published until it is listed here. The alternative —
 * publishing everything except a denylist — puts one forgotten entry between an
 * internal runbook and the public internet, and the password is scheduled to be
 * removed, so a mistake made now becomes permanent later rather than being
 * caught then.
 *
 * The test for adding something: **would this still be fine to serve on the day
 * the password comes off?** If the answer needs a caveat, leave it out.
 *
 * Deliberately absent, and not to be added without a decision:
 *
 *   operations/PRODUCTION.md      the box's address, its SSH accounts, deploy
 *                                 commands, JWT lifetimes, the offboarding
 *                                 levers. None of this belongs on a public host
 *   operations/SILENT-FAILURES.md internal debugging lore naming container
 *                                 names and paths on the box
 *   operations/READ-STATE.md      what shipped, what to watch, and the way back;
 *                                 names a deployed table and a devtools diagnostic
 *
 * Both stay in the repo, which is where the people who need them already are.
 */

export const SITE = {
  title: 'Estiva',
  tagline: 'Nostr for Business',
  /** Shown on every page while the site is gated. Set to null once it is public. */
  banner: 'Pre-release documentation. Shared with invited readers while the protocol settles.',
}

export const NAV = [
  {
    section: 'Introduction',
    items: [
      { file: 'README.md', slug: 'index', title: 'Overview' },
    ],
  },
  {
    section: 'Protocol',
    items: [
      { file: 'protocol/SPEC.md', slug: 'spec', title: 'Specification' },
      { file: 'protocol/KINDS.md', slug: 'kinds', title: 'Event kinds' },
      { file: 'protocol/ADDING-A-KIND.md', slug: 'adding-a-kind', title: 'Adding a kind' },
      { file: 'protocol/RATIONALE.md', slug: 'rationale', title: 'Rationale' },
      { file: 'protocol/RFC-0.2-RECONCILIATION.md', slug: 'rfc-0-2', title: 'RFC 0.2 reconciliation' },
    ],
  },
  {
    section: 'Design',
    items: [
      { file: 'design/DESIGNING-ACROSS-APPS.md', slug: 'designing-across-apps', title: 'Designing across apps' },
    ],
  },
  {
    section: 'Building on it',
    items: [
      { file: 'local-dev/RUNNING.md', slug: 'running', title: 'Running locally' },
      { file: 'repos/README.md', slug: 'repos', title: 'The repositories' },
    ],
  },
]

/** Flat list, in sidebar order — drives prev/next and the search index. */
export const PAGES = NAV.flatMap((s) => s.items.map((i) => ({ ...i, section: s.section })))

/**
 * Documents that exist in the repo and are deliberately NOT published.
 *
 * A link to one of these is rendered as plain text marked "internal" rather
 * than as a dead link — the reader is told the document exists and that they
 * need the repo, instead of clicking into a 404.
 *
 * Listing them here is also what makes the build's check meaningful: a link to
 * anything in neither this list nor NAV is a mistake (a typo, or a new doc
 * nobody decided about) and fails the build.
 */
export const INTERNAL = new Set([
  'operations/PRODUCTION.md',
  'operations/SILENT-FAILURES.md',
  // A cutover runbook: what people are told, the day-one checks, and the
  // rollback window. Names the deployed Convex table and a devtools diagnostic,
  // and is only meaningful for the weeks around the change.
  'operations/READ-STATE.md',
  // The site's own runbook — it names the box, its SSH account and the pull
  // token. Publishing the instructions for the gate alongside the gate would
  // be its own kind of funny.
  'deploy/README.md',
  // A living plan: ticket refs, gate ordering, and the psql that verifies a
  // re-seed. It changes weekly and would be stale on a public host within days.
  'ROADMAP.md',
  // The decision itself is stable and would be publishable; it is held back
  // because it cites the roadmap and the ticket tracker throughout, and a
  // decision record whose every reference is internal reads as half a document.
  'decisions/0001-relay-canonical-by-default.md',
  // Same reasoning, and it additionally names a registry scope, a token
  // layout and work nobody has done yet. Publishable once the packages are
  // real and the ticket references are gone.
  'decisions/0002-foundation-packages.md',
  // Design debate rather than specification — written as a response to a
  // proposal that is not restated, in the first person. The conclusion it
  // reaches (documents use relay git) belongs in the spec if it is ever wanted
  // publicly; this is the working out.
  'protocol/FILES_ARCHITECTURE.md',
  'protocol/nips/NIP-FC.md',
  // 0.4 was accepted 2026-08-28, so the first of the two reasons these were
  // held back is gone. The second stands: it cites ticket ids throughout and
  // names production measurements by ticket, so publishing it would leak a
  // trail of references nobody outside can follow. Publish once those are gone.
  // 0.3 is a pointer stub and follows whatever 0.4 does.
  'protocol/RFC-0.3-FOLDERS.md',
  'protocol/RFC-0.4-WORKSPACE.md',
  // 0.5 is a draft and cites ticket ids and production measurements, same as 0.4.
  'protocol/RFC-0.5-ASSOCIATION.md',
  // 0.6 likewise: a draft, and it cites production measurements by date.
  'protocol/RFC-0.6-COMPOSITION.md',
])

/**
 * Maps a repo-relative markdown path to its published slug, so cross-document
 * links keep working on the site.
 *
 * A link to a file that is NOT published must not silently 404, and `build.mjs`
 * enforces that in the render pass — there is no separate checker, and a
 * `check.mjs` naming this rule has never existed. A link to something in
 * INTERNAL becomes plain text with a marker; a link to something in neither
 * list fails the build. Otherwise the split above leaks as a trail of dead
 * links pointing at documents nobody outside can read.
 */
export const BY_FILE = new Map(PAGES.map((p) => [p.file, p]))
