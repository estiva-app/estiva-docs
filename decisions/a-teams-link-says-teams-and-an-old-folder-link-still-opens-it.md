# A team's link says teams, and an old folder link still opens the same team

- Date: 2026-11-11
- Status: Accepted
- Decided by: Miky, in the session closing "Teams and following" (2026-11-11), on a tester's comment in that project's conversation
- Area: Folders

> Supersedes in part
> [a-team-is-the-folder-and-is-called-a-team](a-team-is-the-folder-and-is-called-a-team.md):
> its clause that links keep "folder" for now. Its CLI flags and tool names
> still keep "folder".

## Who it affects

Miky, Katerina and anyone they send a link to. Since 6 Nov every screen says
team, but the address bar on a team's page still read
`peek.estiva.app/app/folders/<id>` in Peek and `ship.estiva.app/app/folder/<id>`
in Ship, and a link copied into a message said folder too. A tester said so on
11 Nov in the project's conversation: "Feedback in Peek teams use in the URL
`folder` but it should be `team`."

An outside company reading a link sees the same word it sees on screen.

## Context

- [a-team-is-the-folder-and-is-called-a-team](a-team-is-the-folder-and-is-called-a-team.md)
  renamed the object to team everywhere a person reads it, and kept CLI flags,
  tool names and links on "folder" for now.
- Old links are already stored: inside messages, issue descriptions, Leaf
  pages and bookmarks. They are text on the relay, so they cannot be
  rewritten, and a link that stops opening is lost for whoever follows it.
- Ship moved its pages under `/app/` in PRO-22 and Peek did the same earlier;
  both apps already turn an old address into the new one on arrival.

## Decision

- A team's page opens at `/app/teams/<id>` in Peek and in Ship, with the same
  views under it as before (Peek's chat, Ship's Issues, Projects and Topics),
  and the list of teams at `/app/teams`.
- Every link an app or the agent builds for a team uses that address.
- Every old address (`/app/folders/…` and `/folders/…` in Peek,
  `/app/folder/…` and `/folder/…` in Ship) keeps opening the same view, and
  replaces itself with the new address once. These old addresses are kept for
  good.
- Names inside the code, kinds, CLI flags and tool names are not links and keep
  "folder".

## Rejected alternatives

- **Keep the folder links, as the team record said.** The address bar and
  every shared link would go on contradicting the screen, which is what the
  tester noticed.
- **Change the links and let the old ones stop opening.** Every link already in
  a message or a description would break, and those cannot be edited back.

## Consequences

- Both apps carry the old routes as redirects for good; removing one breaks
  links already on the relay.
- A tab open on an old bundle still builds folder links until it reloads; they
  open through the redirect.
- The team record's "links keep folder for now" no longer holds; its other
  parts stand.
