# Designing across apps

Six situations where one piece of work lives in more than one app at once —
what the person is trying to do, what breaks, and the states you have to draw.

Most design systems assume one app owns its screen. Here, a screen routinely
holds objects your app did not create, cannot fully understand, and does not
control the lifecycle of — while the same conversation continues somewhere
else. That changes what you have to design, and mostly it changes the
**states**.

<div class="dg-key">
  <b>Throughout</b>
  <span class="dg-sw"><span class="dg-dot dg-dot--h"></span> the app you are designing</span>
  <span class="dg-sw"><span class="dg-dot dg-dot--g"></span> something that came from another app</span>
</div>

## 1. One conversation, two apps

A discussion about a project happens in the project tracker and in the chat app
at the same time. It is one thread, not two.

> **What actually happened.** Katerina was testing whether a comment posted from
> Ship would appear in Peek. It did, mid-conversation, and she kept going
> without switching back: *"I read our conversations and sending this now from
> Ship. Was thinking about testing it only and forgot how it looks in real
> conversation."*

The good news is that this needs almost no design. The person did not think
about which app they were in — they thought about the conversation. **That is
the target: the seam should be invisible while things are going well.**

It stops being invisible the moment the two apps have different abilities.

<figure class="dg">
  <div class="dg-mock">
    <div class="dg-row">
      <div class="dg-av"></div>
      <div class="dg-grow">
        <div class="dg-head"><span class="dg-name">Katerina</span><span class="dg-stamp dg-stamp--h">written here</span></div>
        <div class="dg-line" style="width:88%"></div>
        <div class="dg-line" style="width:64%"></div>
        <div class="dg-react">👍 2</div>
      </div>
    </div>
    <div class="dg-row">
      <div class="dg-av"></div>
      <div class="dg-grow">
        <div class="dg-head"><span class="dg-name">Miky</span><span class="dg-stamp">from another app</span></div>
        <div class="dg-line" style="width:76%"></div>
        <div class="dg-raw">**bold** and `code` shown raw — this app cannot render what that one wrote</div>
      </div>
    </div>
  </div>
  <figcaption>The failure is not that the message is missing. It arrives, and it is subtly wrong — which is harder to notice and harder to report.</figcaption>
</figure>

### The design problems

- **Unequal formatting.** One app has a rich composer, the other renders plain
  text. Today 41% of real messages carry formatting that one app shows and the
  other prints literally.
- **Unequal affordances.** Reactions exist in one app and not the other. A
  person reacts, and the colleague reading elsewhere never sees it — and is
  never told there is something they are not seeing.
- **Unequal editing.** If one app can edit and the other cannot, the second
  shows stale text with no indication it is stale.

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>Do not label which app a message came from.</strong> It is not what the reader needs and it makes a seam out of something that should be invisible. Label the <em>capability gap</em> instead — say "reactions aren't shown here yet", not "sent from Ship". The person can act on the first and can do nothing with the second.</p>
</div>

### States to draw

- A message containing formatting this app cannot render
- A message with reactions this app does not display
- A message edited elsewhere after you loaded the page
- A reply whose parent was deleted in the other app

## 2. Something from another app, inside yours

A project board inside a document. A chat thread inside an issue. A candidate
profile inside a planning doc. It stays live, and you did not build it.

> **The goal.** *"You will be able to paste project widget from Ship to Leaf
> document and it will be always up to date. So you can create a doc with your
> project board."*

The rule that makes this work, and it is the single most important rule in this
guide: **the app that owns the object declares what matters about it. The app
that displays it decides how it looks.**

So you are not designing "the Ship widget". You are designing *how objects from
anywhere look in your app* — including from apps that do not exist yet. You
will receive a title, some secondary values, a status, maybe an image or a list
of children. You will not receive layout, and you should not want it: an owner
who could specify layout would be designing your product.

<figure class="dg">
  <div class="dg-ladder">
    <div class="dg-rung">
      <div class="dg-t">Inline — in a sentence</div>
      <div class="dg-inline">blocked on <span class="dg-chip">◆ Payments API</span> until Friday</div>
    </div>
    <div class="dg-rung">
      <div class="dg-t">Card — referenced</div>
      <div class="dg-card">
        <div class="dg-ct">Payments API</div>
        <div class="dg-sub" style="width:80%"></div>
        <div class="dg-meta">IN PROGRESS · Ana</div>
      </div>
    </div>
    <div class="dg-rung">
      <div class="dg-t">Card with children</div>
      <div class="dg-card">
        <div class="dg-ct">Payments API</div>
        <div class="dg-meta">IN PROGRESS</div>
        <div class="dg-list">
          <div class="dg-li"><span class="dg-tick"></span> Handle refunds</div>
          <div class="dg-li"><span class="dg-tick"></span> Retry on timeout</div>
          <div class="dg-li"><span class="dg-tick"></span> Rate limits</div>
        </div>
      </div>
    </div>
  </div>
  <figcaption>One object, three densities. The host app picks the rung from context — not the owning app, and not the person pasting it.</figcaption>
</figure>

### The states, and this is where the work is

A foreign object has more failure states than anything else on your screen,
because you control none of its lifecycle. Draw all six before you draw the
happy path.

<figure class="dg">
  <div class="dg-states">
    <div class="dg-st"><div class="dg-sl">Loading</div><div class="dg-ghost" style="width:70%"></div><div class="dg-ghost" style="width:45%"></div></div>
    <div class="dg-st"><div class="dg-sl">Resolved</div><div class="dg-card dg-card--sm"><div class="dg-ct">Payments API</div><div class="dg-meta">IN PROGRESS</div></div></div>
    <div class="dg-st"><div class="dg-sl">Changed since load</div><div class="dg-card dg-card--sm"><div class="dg-ct">Payments API</div><div class="dg-meta">DONE · updated</div></div></div>
    <div class="dg-st dg-st--bad"><div class="dg-sl">No access</div><div class="dg-stx">You can't see this — ask the owner for access</div></div>
    <div class="dg-st dg-st--bad"><div class="dg-sl">Deleted</div><div class="dg-stx">This was removed by its author</div></div>
    <div class="dg-st dg-st--bad"><div class="dg-sl">Unknown type</div><div class="dg-stx">From an app this one doesn't know yet</div></div>
  </div>
  <figcaption>The three on the right are the ones that get skipped, and they are the ones people actually hit.</figcaption>
</figure>

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>"No access" and "empty" must never look the same.</strong> A gated read returns nothing at all — the same nothing as a thing with no content. If you draw one state for both, you have built a screen that quietly lies, and the reader has no way to tell which one they are looking at.</p>
</div>

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>An unknown object type must still render.</strong> Apps update on their own schedules, so you will always eventually receive something newer than your code. Show the title and a link, always — never an error, and never nothing. A blank card reads as "that app is broken" when nothing is broken.</p>
</div>

## 3. Acting on it without leaving

You are reading a document, you see a task is still open, and you close it —
without going to the tracker.

The owning app declares which actions it permits and what each one needs: a
value from a list, a person, some text. Your app draws the control in its own
language. You are not building an integration with a specific app; you are
building the four or five controls that any declared action can be drawn with.

| What the owner declares | What you draw |
| --- | --- |
| **A value from a fixed list** — with labels and a colour meaning | A select. The colours are semantic names, not hex — **you** decide what "blue" looks like here |
| **A person** | A people picker in your app's style |
| **Free text** | A comment field |
| **A new object** — with required and optional fields | A small form, inline. See scenario 4 |

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>Confirm against what happened, not against what you sent.</strong> A write can be refused after it looks accepted, so an action that flips a control optimistically and never checks will show the person a change that did not occur — until they reload. Draw the pending state, and draw the refusal with the reason in it.</p>
</div>

### States to draw

- Action available · action not permitted for this person · action unknown to this app
- Pending, and long-pending — a write goes to a relay, not to your server
- Refused, with a reason a person can act on

## 4. Creating something elsewhere, from here

A conversation reaches a decision. Someone makes it a task — without leaving the
conversation, and with the context carried over.

<figure class="dg">
  <div class="dg-mock">
    <div class="dg-row">
      <div class="dg-av"></div>
      <div class="dg-grow">
        <div class="dg-head"><span class="dg-name">Ana</span></div>
        <div class="dg-line" style="width:82%"></div>
        <div class="dg-line" style="width:58%"></div>
      </div>
    </div>
    <div class="dg-form">
      <div class="dg-t dg-t--g">New task · in the tracker</div>
      <div class="dg-input">Retry payments on timeout</div>
      <div class="dg-hint">from this conversation</div>
    </div>
  </div>
  <figcaption>The form is drawn by the app you are in, from fields the tracker declared. Only the required field is shown; the rest stay behind "more".</figcaption>
</figure>

### The design problems

- **Where does it go?** The person is in a conversation, not a project.
  Something has to choose the destination container, and the honest default is
  the one this conversation already belongs to.
- **How much of the form?** The owner declares required and optional fields.
  Show the required ones; a full form pulled into someone else's app is a worse
  version of the real thing.
- **What comes back?** After creating it, the conversation should show the
  object — which is scenario 2, and the same widget.

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>Never silently pick a destination.</strong> Creating something in another app on someone's behalf, somewhere they did not look, is the fastest way to make a shared workspace feel untrustworthy. Show where it will go, before it goes.</p>
</div>

## 5. The same thing, seen from two apps

A project in the tracker and a topic in the chat app are, to the people using
them, one piece of work. The discussion should be one discussion — not two that
have to be reconciled by whoever reads both.

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>Merge the comments, and do not label where each was written.</strong> Order by time. The person is reading a conversation, not an audit log of which app was open — and labelling turns an invisible seam into a visible one, which is scenario 1's rule again.</p>
</div>

The competing product does this by **copying**: a chat reply becomes a tracker
comment, a second record of the same sentence. Every limitation it ships follows
from that — a bot has to be invited to private channels, direct messages are
unsupported, attachments are lost in transit, and the two copies can disagree.
**Here there is no copy.** One comment, two views. That difference is worth
protecting in the design: anything that reintroduces a second record
reintroduces the whole list.

### Two states that only exist because of this

<figure class="dg">
  <div class="dg-states">
    <div class="dg-st"><div class="dg-sl">Merged view</div><div class="dg-stx">Comments from both, in time order, unlabelled</div></div>
    <div class="dg-st dg-st--bad"><div class="dg-sl">Link removed</div><div class="dg-stx">Half the threads leave the page — say so, never silently</div></div>
    <div class="dg-st dg-st--bad"><div class="dg-sl">Subject deleted</div><div class="dg-stx">The card goes; every comment stays and still belongs to its author</div></div>
  </div>
  <figcaption>Unlinking splits the list of threads. It never splits a thread — a reply follows the conversation it belongs to, not the app it was typed in.</figcaption>
</figure>

- **Unlinking is not destructive, and must not look destructive.** Threads
  redistribute; nothing is lost. But content leaving the page while somebody
  reads it needs to be announced, the way any changed-since-load state does.
- **Deleting one side keeps the conversation.** The subject's card disappears
  and the comments remain, because they were written by other people and are
  theirs. A design that removes them is deleting somebody else's words to tidy
  up a card.

### The rule that makes this safe

**Two things may only be shown as one when they are equally readable.** Merging
a private conversation into a public-looking page does not leak it to outsiders
— they still cannot fetch it — but it misleads the one person who *can* see
both into answering privately in what looks like a public place.

That is the failure to design against: not disclosure, but somebody being given
the wrong idea of who is listening.

## 6. Is any of this new?

You read it in one app. It should not be bold in the other one, or on your
laptop after you read it on your phone.

> **What actually happened.** Two people in a conversation, neither able to say
> whether an automated message would show up as unread. The answer was only
> discoverable by running an experiment: *"Yes I think so. Just do one more test
> to be sure."*

Unread is not a property of an app. It is a property of a person, and if it
lives in one app's database it is wrong the moment anything else touches the
same conversation.

<div class="dg-call">
  <span class="dg-l">The call</span>
  <p><strong>Unread is not activity.</strong> An activity feed shows what happened. Unread shows what <em>you</em> have not seen. Designs that merge them show people things they have already read, which trains everyone to ignore the badge.</p>
</div>

### The states nobody draws

- **Read somewhere else just now** — the badge clears while the person is
  looking at it
- **Older than the app looks back** — read markers have a horizon, and beyond it
  an app cannot tell read from unread. It must not guess "unread", or every
  quiet corner lights up at once
- **Read on a device that has not synced**

## Five constraints behind all of it

Everything above is a consequence of five properties of the shared substrate.
You do not need to understand the protocol to design here, but these five will
find you.

| Property | Why it reaches your screen |
| --- | --- |
| **Published things are permanent** | Edit is a new version, not a rewrite. Delete only works for the author, and only as a request — so never offer it to anyone else |
| **No access reads as nothing** | Empty and forbidden are the same response. Three states, always |
| **Apps update separately** | You will receive things newer than your code, forever. Degrade, never refuse |
| **A name is not an identity** | Names are self-set and not unique. Design for someone who has not set one |
| **Privacy is membership, not encryption** | Access is by who belongs. Never draw a padlock that implies more than that |

The normative versions live in the [Specification](../protocol/SPEC.md) — §6 for objects and
conversations, §7 for how one app renders another's.

## What this guide does not cover yet

Stated plainly, because a guide that hides its gaps is not one worth trusting.

- **The component and pattern library.** The design system exists and is
  published; the reasoning behind it is not written down. A component without
  its argument is an artifact, not guidance.
- **Reference designs.** Five app archetypes are planned — a tracker, a
  conversation surface, a document editor, a domain app, an agent surface. Four
  exist or are being built.
- **The quickstart.** Waiting on a scaffold still being built.

The thing that would prove all of this is an app built by somebody outside this
team. That has not happened yet, and this guide will say so until it does.
