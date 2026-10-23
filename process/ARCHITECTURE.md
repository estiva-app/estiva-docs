# Architecture pages

Every project shaped since 2026-10-23 gets an **architecture page**: drawn
diagrams of what the project touches and how it changes it, so Miky can reason
about the shape before anything is built, and anyone can see later how the
pieces fit (Miky, 2026-10-23: "I would like to see more architecture diagrams
as documentation, so I can better reason about it").

`/shape-project` draws it with the draft and shows it to Miky beside the
draft. It is kept in this repository as documentation, linked from the
project's description, and redrawn as built when the project closes.

## Where it lives

- `architecture/<project-slug>.html`, one page per project, copied from
  [`architecture/template.html`](../architecture/template.html). The slug is
  the project's title in lower-case words (`widgets-2`, `sign-in-stage-1`).
- Listed in [`architecture/README.md`](../architecture/README.md), newest first.
- The project's description links it under `## Architecture` in Solution
  ([PROJECT.md](PROJECT.md)), with one sentence on what changes.
- It is not on `docs.estiva.app`; open it from the repository or ask the agent
  to show it.

## What it draws

Each view is a **today / after** pair, stacked, so the change is what the eye
lands on. When the change is small, one picture will do: what is new in green,
what goes away in red. Draw a view whenever the project changes what it
shows; the Map is always drawn.

1. **Map** — always. The apps, services and stores the project touches
   (Peek, Ship, Leaf, Estiva ID, the relay, the agent, a box on the server)
   and the arrows between them. What the project adds or changes is
   highlighted; untouched parts are drawn faint, or left out when they say
   nothing. Each changed box or arrow carries the milestone that changes it
   (`M1`, `M2`), so the milestones can be read off the picture.
2. **Objects** — when what a thing *is* changes. The objects a person meets
   (a Folder, a file, a message, a comment, a card), who owns or signs each,
   and how they point at each other.
3. **Flow** — when something moves between apps or people. One real usage
   scenario from the project as a sequence, left to right in time: who does
   what, which app writes, where it is stored, what checks it, who reads it
   and when they see it.
4. **Access** — when who can read or change something changes. Who can see
   and who can change each object, and where that is checked (the app, the
   relay, nobody). A table reads better than boxes here.

## How it is drawn

- **Product words first.** Every box and arrow is labelled in words Miky and
  Katerina use ("Ship writes the comment", "the relay checks membership"). A
  technical name — a kind number, a tag, a repo, a package — may go on a muted
  second line under the label, never as the label.
- **One idea per diagram.** Five to twelve boxes. A diagram that needs more is
  two diagrams.
- **Under each diagram, one or two sentences** saying what to notice, and
  anything it leaves out on purpose.
- **What is undecided is marked.** A box or arrow whose shape waits on a
  decision is drawn dashed, labelled with the question, and the question goes
  to Miky as a brief (`/shape-project`, step 4b); the page is redrawn with his
  answer.
- **Only what is checked.** Each box and arrow in "today" is verified in code,
  SPEC or production, like a brief's premises. A **Checked** section at the end
  says where, and names what could not be verified.
- The page follows the brief page's rules: one self-contained HTML file, inline
  SVG using the CSS variables, light and dark, readable at phone width, a
  `<title>` inside each SVG. The template carries the styles and an example of
  each view; redraw the examples, do not keep them.
- **Never describe a security gap that is not fixed yet** — this repository is
  public. Draw the shape, and link the issue for the gap.

## Keeping it true

- **At kickoff**, a ticket whose approach changes a box or arrow the page does
  not show says so in its sketch. A change to an object, a flow or access that
  the page did not foresee is a question for Miky before the code; a smaller
  one is noted in the PR description under "Architecture", for the as-built
  redraw.
- **When the project closes**, `/wrap-project` redraws the "after" pictures as
  built, and marks the page `As built, <date>` under its title. A page that
  still says `Shaped` describes intent, not what runs.
- A later project that changes the same parts gets its own page and links the
  earlier one under its title; the earlier page is not rewritten.
