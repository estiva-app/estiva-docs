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

- [Our process skills live in git](our-process-skills-live-in-git.html)
  — Shaped, 2026-11-20. The folder of skills, reviewers, rules and hooks that
  tell Claude how we work becomes a git checkout at the same path, with a
  private repository on GitHub, so every change says why, can be undone, and
  reaches a second computer when a session starts. Read at
  `https://docs.estiva.app/architecture/our-process-skills-live-in-git.html`.

- [Documents and topics stop downloading every edit](documents-and-topics-stop-downloading-every-edit.html)
  — Shaped, 2026-11-19. Leaf pages and Peek topics are read as they are now
  and written in order at one announced moment, a delete marks only the file
  and can be undone, and after a hold the old way of reading and writing files
  is removed from the relay, the apps and the agent. Read at
  `https://docs.estiva.app/architecture/documents-and-topics-stop-downloading-every-edit.html`.

- [Real page-open timings](real-page-open-timings.html)
  — Shaped, 2026-11-19. Peek, Ship and Leaf time every page open until no
  placeholder is left and send a short timing, built from a fixed list and
  naming the person, through Estiva ID's server to Sentry; Claude prints what
  each of us waited per kind of screen. Read at
  `https://docs.estiva.app/architecture/real-page-open-timings.html`.
- [Smoke test after every deploy](smoke-test-after-every-deploy.html)
  — Shaped, 2026-11-19. After a deploy, one test signs in to Peek, Ship, Leaf
  and Estiva ID as test accounts and walks about ten core flows, half of them
  one app showing another app's file; each app says which version it serves.
- [Production errors reach us (Sentry)](production-errors-reach-us-sentry.html)
  — Shaped, 2026-11-17. Peek, Ship, Leaf, Estiva ID and the relay each send a
  short report to Sentry when something breaks, built from a fixed list of
  fields and never with what a person wrote; Claude reads Sentry after each
  deploy, at a sweep and when a project is wrapped. Read at
  `https://docs.estiva.app/architecture/production-errors-reach-us-sentry.html`.

- [Issues stop downloading every edit](issues-stop-downloading-every-edit.html)
  — Shaped, 2026-11-16. Ship, Leaf, Peek and the agent read each issue as it
  is now and write each change after the one it follows, as they do for
  projects; the relay starts refusing an unordered issue change and a
  permanent delete, and finds an issue by its words; a new file's text is its
  own change, never in its first record. Read at
  `https://docs.estiva.app/architecture/issues-stop-downloading-every-edit.html`.

- [Insights, Journal and Risks](insights-journal-and-risks.html)
  — Shaped, 2026-11-16. You mark a message in Peek, a block in Leaf or a
  comment in Ship as an Insight, a Journal entry or a Risk, and it appears on
  the project's tab of that name in Ship; each item is its own file in one
  team, about any file of any app, its sources pinned to the version marked,
  and the relay refuses one whose source some of its readers cannot read. Read at
  `https://docs.estiva.app/architecture/insights-journal-and-risks.html`.
- [Activity indicator on each topic and team](activity-indicator-on-each-topic-and-team.html)
  — As built, 2026-11-16 (shaped 2026-11-10). In Peek, the dot on a topic, a space, a team's chat
  and a DM says why it is lit when you hover it, turns orange when someone
  reacts to your message there, and each place keeps an Activity list; the
  rule lives in the shared package so any app can draw it, a reaction names
  the author of the message it reacts to, and your read state gains one
  "seen" mark per conversation. Read at
  `https://docs.estiva.app/architecture/activity-indicator-on-each-topic-and-team.html`.
- [Topics: level up the topic experience](topics-level-up-the-topic-experience.html)
  — Shaped, 2026-11-06. Peek, Ship and Leaf order your topics by one shared
  rule, where anything last moved in the topic or its files, and each file on a topic
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
- [Teams and following](teams-and-following.html) — As built, 2026-11-11 (shaped 2026-11-02). A
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
