# An app that owns a "New …" declares a create link in its manifest, and a launcher opens it

- Date: 2026-10-19
- Status: Accepted
- Decided by: Miky, 2026-10-19, in the conversation of the Ship issue `30851:b38fd2687b17bbde2e8079577cba601936acfe1b731d2d2ba7cdef29a063db46:2726532e-ac9d-481a-96b9-e40826d9d64d`, asked as: when a launcher offers another app's "New …" on a Folder, how does it know where to send the person
- Area: Apps & agents

## Who it affects

Miky and Katerina pick New document, or New project, on a Folder in Peek's
launcher and land in the owning app (Leaf, Ship) on a new, empty file already in
that Folder, signed by that app. An outside company gets the same both ways: its
app declares where its own "New …" opens, any launcher can offer it, and its
launcher can offer everyone else's, with nothing to guess. It came up while
building the previous record ([An app may offer another app's "New …"](another-apps-new-file-is-made-by-that-app.md)):
that record says a launcher opens the owning app, and left open how the
launcher finds the place to open.

## Context

- The previous record decides that the owning app makes the file and the
  launcher signs nothing. It does not say how the launcher learns the address
  to open.
- A manifest already carries link templates for opening a Folder or a file in an
  app, written with a bech32 address (SPEC §7.6, §7.8). Every launcher already
  reads them.
- SPEC §7.3 says a consumer builds an action's event "from the declaration
  alone", which only fits an action the consumer may sign.
- Leaf has a live link, `/new?folder=<uuid>` (leaf#33), which names the Folder
  by its internal id and appears in no manifest.
- Peek does not open Ship to make a project today: Peek signs Ship's project
  kind (`30850`) itself, because it is in Peek's allowed kinds in Estiva ID
  (`estiva-id src/db/seed.ts`).

## Decision

**The owning app's manifest declares a "create here" link for its create
action**: a web link template that names the Folder by its address, in the same
addressing as every other app link template (a bech32 address, SPEC §7.6, §7.8).

- A launcher, Peek's or an outside company's, lists the action from the
  manifest and opens that link with the Folder's address filled in. The owning
  app opens, makes the file, and signs it.
- SPEC §7.3 changes: a consumer builds the event from the declaration alone,
  **or opens the owning app's declared create link**. SPEC §7 defines the
  manifest field, and interop reads it.
- Leaf's `/new?folder=<uuid>` link moves to the address form and is declared in
  Leaf's manifest.
- Ship declares one for New project too, and Peek's launcher stops making Ship
  projects itself and opens Ship's link. Peek's Estiva ID allowed kinds can then
  drop Ship's project kind (`30850`); that is a separate step.
- No app's signing limits widen.

## Rejected alternatives

- **A fixed web path every app must serve** (for example `<site>/new?folder=`),
  with no manifest field. Rejected: it is an unwritten convention an outside
  company would miss, and a launcher cannot tell which apps support it.
- **No hand-over: the launcher only opens the Folder in the owning app and the
  person presses New there.** Rejected: it costs an extra step and makes "New …"
  in a launcher meaningless.

## Consequences

- A SPEC change (§7.3, plus the new manifest field in §7) and a change in
  interop to read it. Leaf and Ship each declare a link; Peek's launcher builds
  every other app's "New …" from it.
- An outside company's app can offer its own "New …" in any launcher by
  declaring a link, and a launcher that reads manifests needs no per-app code.
- Leaf's `/new?folder=<uuid>` link is replaced by the address form.
- Two-way: a manifest field can be added, changed or removed, and nothing
  already on the relay depends on it.
