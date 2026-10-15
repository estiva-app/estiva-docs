# Peek keeps a plain copy of what it read on the device, until you sign out

- Date: 2026-10-14
- Status: Accepted
- Decided by: Miky, in the shaping of "Peek opens instantly" on 2026-10-12, and again in the workflow review session of 2026-10-14 on the brief "Messages on the device"
- Supersedes: peek-keeps-nothing-after-a-reload.md
- Area: Devices & sessions

## Who it affects

Miky and Katerina open Peek and Desk is there at once, on a reload or in a new
tab, drawn from what Peek kept on their computer; anything that changed meanwhile
updates in place. What Peek kept, direct messages included, stays on that
computer in plain text until they sign out of Peek there, or until someone else
signs in to Peek in that browser. On a borrowed laptop, the person is the
safeguard: they must remember to sign out.

An outside company builds whatever copy its own clients need. The protocol
asks nothing of it here yet.

## Context

Peek took about 1.6 s to show Desk after a reload, because it kept nothing
([Peek keeps no copy after a reload](peek-keeps-nothing-after-a-reload.md)).
On 12 Oct Miky asked for Peek to open at once and chose a copy on the device,
kept until sign-out, on the understanding that direct messages stay encrypted.
That premise was false: in Estiva a direct message is a members-only group, as
private as a private Folder's topic on the relay, and travels and is stored as
plain text. On 13 Oct the promise came out of the project. On 14 Oct the call
was asked again, as a brief, knowing that.

## Decision

- Peek keeps a copy on the device of what it has read for the person,
  direct messages included, as the relay sent it, and draws from it at once.
- The copy is removed when the person signs out of Peek, in any tab, or when
  someone else signs in to Peek in that browser.
- The session is kept across tabs, as Ship and Leaf do.

Carried out by the project "Peek opens instantly" (Peek, and
`@estiva-app/platform`).

## Rejected alternatives

- **Seal the copy to the session.** The copy is unreadable once the session
  that read it has ended, with a key from Estiva ID, so a borrowed or stolen
  laptop goes dark when the session ends or an admin ends it. The brief
  recommended it; Miky kept the plain copy. Its costs, as the brief put them: a
  new tab or a restarted browser waits for the key before message text shows,
  and it is real work in Estiva ID, the shared package and every app.
- **Ask "is this a shared computer?" at sign-in.** Nothing kept when the
  person says yes. Miky sent it to a later review of sign-in (12 Oct), which
  has no project yet.
- **Keep only direct messages off the device.** Not offered: on the relay a
  direct message is protected exactly like a private Folder's topic, so it
  would guard one kind of private text and not the other, and Desk would move
  as DM rows arrived late.
- **No copy after a reload** (the 7 Oct call). Peek could not open at once.

## Consequences

- Peek opens at once from the copy (Desk in about 100 ms on production).
- Signing out of Peek is what removes the copy, and Peek draws from it only for
  the person signed in. Until then it stays on the device.
- Ship and Leaf are to adopt the same copy, so this becomes the rule for all
  three apps.
- Two-way on devices: a release can wipe or seal every copy the next time it
  opens. If the protocol ever says what a client may keep, a loose rule is
  harder to tighten once outside clients build to it.
