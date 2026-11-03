# A link opens in the app you are in when that app has a page made for that kind of file and can show what the link points at; otherwise it opens as written

- Date: 2026-11-03
- Status: Accepted
- Decided by: Miky, in the kickoff session of "A topic's page in Ship, and every topic link inside Ship opens it", on the brief "Which app a link opens" ([page](briefs/topic-links-inside-ship.html))
- Area: Links & widgets

> Supersedes in part
> [a-files-path-is-the-same-on-every-apps-host](a-files-path-is-the-same-on-every-apps-host.md):
> its "a click opens the address as written, in the app it names".

## Who it affects

Miky, browsing work in Ship by topic (project "Ship's Topics navigation", 2
Nov): "every click on a topic leaves Ship". He decided that every topic link
inside Ship opens Ship's new topic page, in a description or a comment too. A
topic link someone wrote is Peek's address, so under the 20 Oct rule it opened
Peek.

An outside company's app needs to know when a link to its file, clicked in
another app, reaches its own app.

## Context

- The 20 Oct record says every app answers every app's file address, and a
  click opens the address as written, in the app it names (SPEC §13.6.2,
  interop's `writtenOpenerOf`). Ship applied it: in Ship, a link to
  `peek.estiva.app/topic/…` opened Peek, and `leaf.estiva.app/issue/…` opened
  Leaf, not Ship's issue page.
- A topic is a file no app owns (KINDS, "Bare file"); Peek opens it because it
  shows every file's conversation.
- Peek can show every file as a conversation and Leaf every file as a page,
  so "stay in the app you are in whenever it can show the file" would keep
  every link inside Peek or Leaf.
- A Peek link to one message in a topic (`?thread=<id>`) names that message,
  which Ship's topic page does not show.

## Decision

1. **A click on a link written as a URL stays in the app you are in when that
   app has a page made for that kind of file** (a kind it owns, or, for a file
   no app owns, a page of its own for that kind; never a general view of every
   file, as Peek's conversation or Leaf's page) **and that page can show
   everything the link points at.** It opens there at its own path.
2. **Otherwise the link opens as written**, in the app its host names, as
   before. A link to one message or one block opens as written unless the
   app's page shows that message or block.
3. Each app applies this about itself. It declares nothing new in its
   manifest, so no app lists another app's types.
4. In Ship, a topic link opens Ship's topic page, except a **space** (a topic a
   team marks as one), which opens in Peek: Ship is for projects and issues,
   and a space is a conversation (Miky, same session).

## Rejected alternatives

- **A link opens as written (the 20 Oct rule stands).** No change and the
  simplest rule for an outside app, but in Ship the same topic opened Ship
  from the "Topics: …" line and Peek from the sentence above it, the "every
  click leaves Ship" this was for.
- **Stay in the app you are in whenever it can show the file.** Peek and Leaf
  would keep every Ship and outside link in their general views, an outside
  app would never be reached from them, and a link to one message would land
  on a page that cannot show it. Undoing it means changing every app's opener.

## Consequences

- In Ship: a written topic link opens Ship's topic page (SHIPS-4), and a Ship
  issue or project written with Leaf's address opens Ship's page, no longer
  Leaf. Peek and Leaf are unchanged: Peek opens topics itself, Leaf has no page
  made for issues or topics.
- SPEC §13.6.2's click rule carries the exception. An outside app asks itself
  one more question ("do I have a page made for this kind?"); an app that
  wrongly says yes keeps people from the file's own app.
- Nothing is written to the relay; links already in messages stay as written,
  and only where a click lands changes.
