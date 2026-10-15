# @, !@, [ and / are one shared kit for every app's composer, not built inside an app

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, on CON-26
- Area: Messages

## Who it affects

Miky typed `[` while writing in Ship and in Peek, expecting to reference a
file, and found it in neither. Since this call, writing works the same in
every app: `@` mentions a person, `!@` mentions them urgently, `[` references a
file or a message, and `/` opens formatting and insert commands. An outside
company's app gets the same triggers, writing the same wire, by taking the
shared packages.

## Context

"`[` stopped working" was not a regression. Peek's `[` listed only the messages
on screen (it lost topics in FOL-23), and Ship never had `[` or `@`: each app
had built, or not built, its own. Miky, 2026-10-02: "Both @ and [ should be
part of the conversation standard package so all apps can use it. Also / for
the command."

## Decision

- What a pick writes, the `nostr:` text and the `p`, `q` and `urgent` tags,
  lives in `@estiva-app/conversation`, which stays framework-free.
- The triggers and their menus live in `@estiva-app/ui/editor`, beside
  `suggestionPopup`. This is the same split as the block editor kit (wire
  translation in the protocol package, nodes in `ui/editor`).
- `/` has a shared Format section; each app adds only the Insert rows it can
  perform.
- A person can reference anything they can read, even if the recipient cannot
  open it.
- No trigger is built inside one app again.

Carried out in CON-27 (Peek moves to the shared kit, no visible change), CON-25
(Ship adopts it) and PEE-21 (`[` ranking, a product call recorded on that
issue).

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- One place decides what a mention, an urgent mention or a reference writes, so
  apps cannot drift apart on the wire.
- A change to a trigger is a package release that every app takes, not an edit
  in one app.
