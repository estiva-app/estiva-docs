# The copy on the device is the person's, shared by Peek, Ship and Leaf, so what one app fetched the others already have

- Date: 2026-11-04
- Status: Accepted
- Decided by: Miky, in the Initiative "Re-architecting Osnova protocol" (his Leaf comment of 2026-11-04 and the session that answered it), on the brief ["One copy on the device, for all three apps"](briefs/one-copy-for-all-apps.html)
- Area: Devices & sessions

## Who it affects

Miky and Katerina, who move between Peek, Ship and Leaf all day. Miky asked
(2026-11-04): when he was in Ship a minute ago and switches to Peek, why should
Peek download the same data again? With one copy, an issue Peek has shown is
already in Ship, the three apps agree on what a file says, and a change made in
one app shows in the others at once. An outside company is not affected: this is
how Estiva's own apps store what they read; its apps live on its own addresses.

## Context

- Peek, Ship and Leaf each run on their own address (`peek.`, `ship.`,
  `leaf.estiva.app`), and a browser gives each address its own storage.
- Only Peek keeps a copy (since 2026-10-13, record
  [peek-keeps-a-plain-copy-on-the-device-until-sign-out](peek-keeps-a-plain-copy-on-the-device-until-sign-out.md)).
  Its engine already lives in `@estiva-app/platform`. The Initiative planned for
  Ship and then Leaf to adopt it, each with its own copy.
- Peek fetches the Ship and Leaf cards it shows from the relay itself; it never
  reads another app's data.
- Every app a person has open shares one relay allowance of 50 requests per 5
  seconds. Peek keeps 42 of them.
- Tested 2026-11-04 in Playwright's browsers, with each browser's own storage
  fences switched on and an unrelated site as the control: a hidden page on a
  third estiva.app address, embedded by two sister apps, shares its storage
  between them in Chrome and Firefox. In WebKit, Safari's engine, its stored
  data is filed under the address of the page around it, so each app gets its
  own. The Safari app itself was not run.

## Decision

The copy on the device belongs to the person, not to an app. One hidden page on
an Estiva address holds it, and, where the browser allows, the relay connection.
Peek, Ship and Leaf read and write through it. The apps keep their own
addresses.

In Safari, and in any browser that fences the hidden page, each app keeps its
own copy, as Peek does today. Miky accepted that fallback.

It holds only what some app has asked for, never the whole workspace ahead of
time. Peek holds conversations and the few files embedded in them. Ship still
fetches the projects Peek never needed, and with
[a-copy-on-the-device-catches-up-with-nip-77](a-copy-on-the-device-catches-up-with-nip-77.md)
it fetches only those. Whether an app shows what it already has while it waits
for the rest is left to practice.

What the copy keeps, and when it is wiped, stays as in the Peek record. One
change follows: a sign-out or a different person signing in, in any of the
apps, now wipes the copy for all three.

## Rejected alternatives

- **Each app keeps its own copy** (the Initiative's plan until now). It costs
  the least to build, and each app ships alone. It was turned down because each
  app is instant only from its own second open, and the apps can disagree for a
  moment. Three connections also share one allowance. It remains the fallback in
  Safari.
- **The three apps move to one address** (`estiva.app/peek`, `/ship`, `/leaf`).
  Sharing would then work in every browser, Safari included. It was turned down
  because every pasted link, including links inside signed messages, would have
  to redirect forever. Miky accepted the Safari fallback instead.
- **One sign-in for all three apps through the hidden page** is not part of this
  record. It changes what signing out means, so it needs its own call.

## Consequences

- The "Ship opens instantly" and "Leaf opens instantly" stages adopt the shared
  copy rather than building their own. Peek's copy moves behind the hidden page.
- "Live across apps" largely comes with it: a change written through the copy is
  seen by every open app without a round trip to the relay.
- Harder:
  - a bug in the hidden page breaks all three apps;
  - the hidden page must keep working with app tabs of different ages, so how
    apps talk to it is versioned;
  - Safari's fallback path must stay working and tested;
  - the hidden page must answer only Estiva's own apps, or any site could embed
    it and read the copy;
  - Peek's Desk, drawn 13–20 ms after the page today, must stay there.
- Easy to undo: it is a cache. Dropping the hidden page returns each app to its
  own copy, and nothing on the relay changes.
