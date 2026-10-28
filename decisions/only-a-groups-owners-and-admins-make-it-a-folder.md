# Only a group's owners and admins make it a Folder; DMs and workflow channels never become one

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the session landing Ship issue fd9fd483 on 2026-10-27, on the brief "Agents, Folders, deletes"
- Area: Folders

## Who it affects

A group becomes a Folder the first time something is filed into it, and from
then on it is drawn as a Folder in Peek, Ship and Leaf. Only someone who can
rename or archive the group, its owners and admins, can take that first step.
After it, any member files into the Folder as before. A DM or a workflow
channel never becomes a Folder.

Nothing changes for Miky or Katerina, who create their Folders and so own
them. An app that lets someone file into another person's group that is not
yet a Folder is refused, and should be.

## Context

[A Folder is a group the relay keeps a listing for](a-folder-is-a-group-the-relay-lists.md),
and the relay starts that listing on the first Folder command in a group. A
listing the relay has signed cannot be taken back by any app or person, so a
wrong one stays. Renaming and archiving a Folder are already an owner's or
admin's act ([Only a Folder's owners and admins can rename or archive
it](only-owners-and-admins-rename-or-archive-a-folder.md)). The question came
out of the security review of the relay catch-up and was asked as a brief with
three options.

## Decision

The relay refuses a Folder command that would start a group's listing unless
it is signed by someone allowed to rename the group. Once the listing exists,
any member who may write in the group sends Folder commands. A Folder command
in a DM, a workflow channel or a system channel is always refused.

It is carried out by the Ship issue
[Our relay runs current upstream Buzz](https://ship.estiva.app/issue/fd9fd483-08f8-4ede-ad4c-790189f4160b).

## Rejected alternatives

- **Any member who writes in the group, workflow channels refused.** Anyone
  in an old conversation channel, or an app with a bug, could make it a Folder
  in everyone's list, and nobody could undo it.
- **Only at birth, by the group's creator.** The relay would have to define
  "when it is made", and an existing group that should be a Folder could never
  become one.

## Consequences

- One role rule covers a Folder's name, its archive and whether it is a Folder
  at all.
- Apps need nothing new: whoever creates a Folder owns it.
- It is a relay rule and can be loosened later; each listing it prevents is a
  stray Folder nobody has to live with.
