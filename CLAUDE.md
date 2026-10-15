## estiva-docs

The specification, guides and working documents of the Estiva suite. This
repository is public; `docs.estiva.app` publishes only what `site/nav.mjs` lists
in `NAV` and the `Dockerfile` copies.

- **Read `decisions/` before proposing a shape.** It holds why things are the
  way they are, including ideas that were turned down: a Rejected record means
  do not rebuild it without new facts. A Proposed record binds nobody and is
  never built. An assumption that no Accepted record states is a question to
  ask, not a fact to build on.
- **Stop and ask when a task goes against an Accepted record.** Name the
  record, say what the task would change, and ask the person you are working
  with; do not write around it. Changing a decided call is a new record that
  supersedes it, written as Proposed.
- **The app repositories point here.** Their CLAUDE.md files tell their
  sessions to read records from GitHub, and their code points to a record with
  `why: https://github.com/estiva-app/estiva-docs/blob/main/decisions/<name>.md`.
  Renaming or deleting a record breaks those links; supersede it instead.
- **Writing a record:** copy `decisions/template.md`, follow the rules in
  `decisions/README.md`, and list it there under its Area. An agent writes
  records as Proposed and never fills in `Decided by` for itself; only Miky (or
  Katerina, for how a screen looks) accepts one. Writing down an answer Miky
  has already given is not accepting it: that record is Accepted, and its
  `Decided by` says where he gave it. `npm test` checks the folder,
  and CI runs it on every pull request.
- **Never merge a pull request that changes `decisions/`.** Review it, then give
  Miky the link: only his merge puts a record on `main` (DEC-7).
- **`decisions/` stays off the site.** Do not add it to the `Dockerfile` or to
  `NAV`, and do not list records in the root `README.md`, which is published.
- **Never describe a security gap that is not fixed yet,** here or anywhere in
  this public repository. Link its issue instead.
- `npm run build` is the site's check: a published page that links to a
  document neither published nor internal fails it.
