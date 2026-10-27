# Nobody deletes a whole DM; each person deletes only their own messages

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the session landing Ship issue fd9fd483 on 2026-10-27, on the brief "Agents, Folders, deletes"
- Area: Messages

## Who it affects

A direct-message conversation between Miky and Katerina belongs to the two of
them. Neither of them, and no workspace owner or admin, can delete it as a
whole. Each deletes their own messages, as before.

For an outside company, the first question about DMs has a plain answer:
admins cannot erase their people's private conversations.

## Context

Deleting a whole group is allowed for its owner and for a workspace owner or
admin, so a Folder whose owner is gone can still be removed, and a group that
still holds files cannot be deleted by anyone. That rule was written for
Folders. Messages are not files, so whether it should reach DMs came out of the
security review of the relay catch-up and was asked as a brief with three
options.

## Decision

The relay refuses a group delete whose group is a DM, whoever signs it. Each
person's own message deletes are unchanged, and so is moderation of single
messages.

It is carried out by the Ship issue
[Our relay runs current upstream Buzz](https://ship.estiva.app/issue/fd9fd483-08f8-4ede-ad4c-790189f4160b).

## Rejected alternatives

- **Either person in the DM deletes it, for both.** One person would erase the
  other's words and the record of what was said to them.
- **Workspace admins may delete any DM, as moderation.** An invisible power
  that no app shows, over conversations the admin could not read. Slack and
  Google Chat do not give ordinary admins it either; retention there is a
  separate, visible policy.

## Consequences

- An admin cleaning up abuse in a DM cannot wipe it in one step; they can
  still ban the person and moderate single messages.
- If a company needs retention or legal deletion of DMs, it comes as its own
  visible policy, decided then.
