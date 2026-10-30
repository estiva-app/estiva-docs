# Architecture pages

One page per project: drawn diagrams of what the project touches and how it
changes it, today and after. The rules are in
[`process/ARCHITECTURE.md`](../process/ARCHITECTURE.md); a new page starts as a
copy of [`template.html`](template.html).

Each page is also listed in `DRAWINGS` in `site/nav.mjs` and is read at
`https://docs.estiva.app/architecture/<project-slug>.html`.

A page says under its title whether it is **Shaped** (the intent, before the
build) or **As built** (redrawn when the project closed).

**The base page:** [`estiva.html`](estiva.html) — the whole suite as it runs;
every project's "today" starts from it.

Project pages, newest first:

- [Topics group files](topics-group-files.html) — Shaped, 2026-10-30. A topic
  keeps its own list of files from any Folder, Peek gets a Topics screen of your
  topics with their files and moves today's Topics to Folders, and Ship and Leaf
  show a file's topics. Read at
  `https://docs.estiva.app/architecture/topics-group-files.html`.
- [One conversation in every app](one-conversation-in-every-app.html) —
  Shaped, 2026-10-28. A conversation becomes one shared piece that Peek, Ship
  and Leaf each place and colour, and Ship joins the apps that resolve a
  thread. Read at
  `https://docs.estiva.app/architecture/one-conversation-in-every-app.html`.
- [Leaf works for everyday documents](leaf-works-for-everyday-documents.html) —
  Shaped, 2026-10-27. Leaf gets pictures, a fixed tree, and the move, archive,
  delete and members Peek already has. Read at
  `https://docs.estiva.app/architecture/leaf-works-for-everyday-documents.html`.
