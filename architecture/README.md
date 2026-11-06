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

- [Topics: level up the topic experience](topics-level-up-the-topic-experience.html)
  — Shaped, 2026-11-06. Peek, Ship and Leaf order your topics by one shared
  rule, the newest thing anyone did in the topic, and each file on a topic
  gets a place and a row or card look of its own, kept on the topic and the
  same for everyone. Read at
  `https://docs.estiva.app/architecture/topics-level-up-the-topic-experience.html`.
- [Topics: Main and All](topics-main-and-all.html) — Shaped, 2026-11-06.
  In Peek, a topic followed at All reads the conversations of every file it
  lists through one new read in the shared package, and the shared
  conversation draws each thread under its file's name; a reply goes on the
  file it is about, and nothing new is written to the relay. Read at
  `https://docs.estiva.app/architecture/topics-main-and-all.html`.
- [Leaf's Topics navigation](leaf-topics-navigation.html) — Shaped,
  2026-11-04. Leaf's sidebar gains a Topics section between Home and the
  Folders tree (your five topics you worked in last, each folding to the
  pages, projects and issues it lists), and a topic gets its own page in Leaf;
  both draw from the topics read Ship already shares, and nothing new is
  written to the relay. Read at
  `https://docs.estiva.app/architecture/leaf-topics-navigation.html`.
- [Ship's Topics navigation](ship-topics-navigation.html) — Shaped,
  2026-11-02. Ship gains a new sidebar (Home, Topics, Projects, Issues, then
  each Folder's own Topics, Projects and Issues), a Topics page with your topics first and a page per
  topic, all drawn from one read of every topic and what it lists in the
  shared package; nothing new is written to the relay. Read at
  `https://docs.estiva.app/architecture/ship-topics-navigation.html`.
- [Teams and following](teams-and-following.html) — Shaped, 2026-11-02. A
  Folder becomes a team with members and followers and three kinds of place
  (its chat, its spaces, the topics it leads); each person sets one level on a
  place (Not following, Important or All), only they set it, and one shared
  rule in every app works out what is in what you follow. Read at
  `https://docs.estiva.app/architecture/teams-and-following.html`.
- [Each company sets its own statuses](each-company-sets-its-own-statuses.html)
  — Shaped, 2026-10-30. Every status change carries its stage beside the
  value, read and written through the shared packages by every app, Ship
  included; the SPEC says where a company's own statuses will live and which
  fields search reads. Read at
  `https://docs.estiva.app/architecture/each-company-sets-its-own-statuses.html`.
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
