# A team is today's Folder, with members, followers and its own chat, and it is called a team

- Date: 2026-11-02
- Status: Proposed
- Area: Folders

## Who it affects

Miky and Katerina would see Peek's rail, Ship's Move control, Leaf's page
header, Claude and the CLI call the place a file lives a team, on the same day.
Each of the nine Folders would become a team with the same name, and Estiva HQ
would become the Company team. Katerina joins Peek's team, and from then on a
new conversation in its chat lights for her.

An outside company would learn one object. A team is where a file lives, who
can read it, and who is told about it, as in Notion's teamspaces or Linear's
teams.

This came up on 2 Nov while shaping the project "Teams and following", the
Teams stage of the Initiative "Re-architecting Osnova protocol". The draft took
it as given that "a team is a Folder with people", and no record says so.

## Context

- A Folder is a NIP-29 group with a relay-signed listing of its files (SPEC
  §3). The relay lets someone read a file only if they can read its Folder.
  Production has nine Folders, all open to everyone in the company, and each
  has one person on its roster (read on 2 Nov).
- On 25 Sep, Miky ruled that the word is Folder, and that "team" is not a
  second name for it
  ([a-folder-is-called-a-folder-never-a-team](a-folder-is-called-a-folder-never-a-team.md)).
  That ruling was about the word only, when a Folder was a box of files.
- Since 28 Oct, Miky's own words in the navigation rework speak of teams:
  "Teams is where the file lives. There is default team - whole company" (28
  Oct); "the team decides who can see what", and "a team holds a private group
  and a public group… People see one team, never the groups" (29 Oct); "The
  file still lives in Folder (in future we will rename to Team)" (30 Oct,
  quoted in
  [a-topic-keeps-its-own-list-of-files](a-topic-keeps-its-own-list-of-files.md)).
  These were Decided lines on the Navigation project, not records.
- [every-workspace-has-one-company-folder-the-relay-marks-and-keeps](every-workspace-has-one-company-folder-the-relay-marks-and-keeps.md)
  left "there is always a Company team" to "that rework decides it".
- [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)
  gives a team members, followers and spaces, but does not say what object a
  team is.
- Every app gets the label "folder" for a Folder from the shared interop
  package, so the word does reach the wire as a label.

## Decision

Proposed, as the brief "What a team is" recommends (option A):

- A team is today's Folder: the same group, with the same id and the same
  listing. It now also has members (its roster, which a person joins and
  leaves), followers (each keeps a private list of the teams they follow), and
  its own chat. Its spaces are the topics its listing names. No file moves.
- It is called a team everywhere: in every app, in Claude and the CLI, in SPEC
  and on docs.estiva.app. Folder is quoted only when citing old text. CLI
  flags, tool names and links keep "folder" for now.
- The Company Folder becomes the Company team, with the same mark.
- How a team's private part attaches to it is left to the private stage.

## Rejected alternatives

None rejected yet. These are the other options on the brief, as they stand:

- **B · A Folder gains people and stays a Folder.** This is the same object as
  A, but the 25 Sep record stands, and people "join a Folder" and "follow a
  Folder". It contradicts the prototype Miky chose on 29 Oct and his "in future
  we will rename to Team". The rename would come later, as a second round of
  renaming.
- **C · A team is a new object, and today's Folder becomes its public group.**
  This builds the 29 Oct "two groups" now. It adds a new kind of object to the
  relay, written for each of the nine Folders, and keeps the members twice: once
  on the team, and once on each group's roster, which is what the relay
  enforces. The two copies can disagree, and it is one-way once written.
- Not offered: **teams beside the Folders**, a list of people next to a list of
  files. Miky's "Teams is where the file lives" (28 Oct) and "people see one
  team" (29 Oct) rule it out.

## Consequences

- Would supersede
  [a-folder-is-called-a-folder-never-a-team](a-folder-is-called-a-folder-never-a-team.md)
  and amend the Company Folder record's naming. It would close
  [folders-are-labels](folders-are-labels.md) as Rejected, citing Miky's 29 Oct
  "the team decides". The team stays what a read is checked against.
- SPEC §3 and §3.2 change their noun, and so does the interop label. Every app
  renames on the same day.
- Two-way on the relay. A team object, as in C, could still be added later
  around an existing team as its public part, with no file moving.
