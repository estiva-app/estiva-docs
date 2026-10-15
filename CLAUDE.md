## estiva-docs

The specification, guides and working documents of the Estiva suite. This
repository is public; `docs.estiva.app` publishes only what `site/nav.mjs` lists
in `NAV` and the `Dockerfile` copies.

- **Read `decisions/` before proposing a shape.** It holds why things are the
  way they are, including ideas that were turned down: a Rejected record means
  do not rebuild it without new facts. A Proposed record binds nobody and is
  never built.
- **Writing a record:** copy `decisions/template.md`, follow the rules in
  `decisions/README.md`, and list it there under its Area. An agent writes
  records as Proposed and never fills in `Decided by` for itself; only Miky (or
  Katerina, for how a screen looks) accepts one. `npm test` checks the folder,
  and CI runs it on every pull request.
- **`decisions/` stays off the site.** Do not add it to the `Dockerfile` or to
  `NAV`, and do not list records in the root `README.md`, which is published.
- **Never describe a security gap that is not fixed yet,** here or anywhere in
  this public repository. Link its issue instead.
- `npm run build` is the site's check: a published page that links to a
  document neither published nor internal fails it.
