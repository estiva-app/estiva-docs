# When Peek, Ship or Leaf opens a page, it sends how long the person waited, built only from a fixed list of fields and naming the person, through our own server to Sentry; a company's own deployment sends timings only where it names a place for them

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, on 17 November ("we should definitely do it") and in the session shaping "Real page-open timings", 19 November: the first job is what each of us waited per kind of screen, not an alarm after a deploy; a timing names the person by their public key; Katerina is told, not asked, before the first app sends one; a company's own deployment sends timings only where it names a place for them, apart from errors; in Peek the wait runs until the live page is there
- Area: Infrastructure

> Supersedes in part
> [error-reports-go-to-hosted-sentry-built-from-an-allowed-list](error-reports-go-to-hosted-sentry-built-from-an-allowed-list.md):
> "tracing" in "No session replay, tracing or logs". Page-open timings are
> allowed as this record says; session replay and logs stay off. Everything
> else in it stands, and what an error report may contain does not change.

## Who it affects

Miky and Katerina: every page they open in Peek, Ship and Leaf is timed, and
Sentry keeps a log of when each of them opened which kind of screen and how
long it took. Katerina is told before the first app sends one. In return, a
speed project starts from what each of them really waited, not only from a QA
account on a near-empty workspace: in October a Peek page passed on QA-1's
workspace and took 5–10 seconds on Miky's (PEE-2), and Katerina's tabs have
never been measured, because the speed kit signs in only as a QA account or
as Miky.

An outside company running its own deployment gets no timings unless it names
a place to send them. Turning on crash reports never brings a named log of its
staff's opens with it.

## Context

- Every speed number came from the speed kit: a QA account, or Claude signed
  in as Miky, opening a few fixed pages from one machine. Nothing measured
  the opens a person really makes.
- The Accepted error record says "No session replay, tracing or logs". A
  page-open timing is what Sentry calls tracing.
- With two people, a timing without the person's key cannot say whose
  workspace is slow, and a workspace's size is what made a fast page slow
  before.
- Sentry's free plan, read from the account on 19 November: 5,000,000 spans a
  month, counted apart from the 5,000 errors; spans are kept 30 days (the
  plan's headline says 90, but what it keeps spans for is 30). Two people
  opening about 150 pages a day each send about ten thousand a month.
- On 19 November a timing sent by hand to the Ship project, through the same
  envelope address Estiva ID's server sends errors to, was stored as a span
  and read back with Claude's read-only token: the kind of screen, how it was
  opened, the wait, the account and the person's key. An IP address sent with
  it was not stored.

## Decision

- **What is timed:** every page open in Peek, Ship and Leaf, from the click
  or the new tab until no loading placeholder is left on the page. In Peek
  the wait runs until the live page is there, because only the live page says
  what is new; the time its saved picture showed is a second number, never
  the wait. An open in a tab nobody is looking at is thrown away.
- **What a timing holds:** only fields from a fixed list — the app and its
  version, the kind of screen (the same kinds error reports name), how it was
  opened (a new tab, a reload, a click inside the app), how long until the
  page was ready and, in Peek, until its saved picture showed, when, the
  browser, the person's public key, and whether they are a person, a QA
  account or an agent. Never titles, file names, page addresses, which issue,
  page or conversation was opened, any text, what the relay was asked, or the
  person's IP address. The timing is built from the list, not filtered
  afterwards.
- **It names the person,** by their public key. Katerina is told before the
  first app sends one.
- **How it travels:** as error reports do — the app sends it to Estiva ID's
  server, signed in; the server builds it again from its own list and passes
  it to Sentry. Nothing is sent before sign-in. Timings have their own limits,
  in the browser and on the server, apart from the error allowance, so they
  never crowd out an error. A timing is sent after the page is ready, adds no
  read from the relay, and is dropped if it fails to send.
- **A company's own deployment** sends timings only where it names a place
  for them, a setting apart from where errors go.
- **Kept** 30 days, in the Sentry projects the errors already use. Miky reads
  them in Sentry and Claude with its read-only token; Claude prints, per
  person and kind of screen, how many opens, the typical wait and the worst,
  at a sweep and when a speed project starts or closes. Nothing runs on a
  timer, and nothing alarms after a deploy.

The project [Real page-open timings](https://docs.estiva.app/architecture/real-page-open-timings.html)
carries it out.

## Rejected alternatives

- **Timings without the person's key, people as one group.** With two people
  it cannot say whose workspace is slow, which is the job (Miky, 19
  November).
- **Send nothing: the speed kit opens the pages signed in as Katerina.** It
  measures her workspace's size from the QA machine, and misses her laptop,
  her network and what she really opens.
- **An alarm after each deploy as the first job.** With two people the hours
  after a deploy hold a handful of opens; the speed kit's before and after
  run in `/land` is the steadier alarm (Miky chose what each of us waits, 19
  November).
- **The browser's own page measures only.** They count a placeholder as the
  page having drawn, and do not see a click inside the app, which is most
  opens.
- **Each screen says when it is ready.** Every screen wired by hand, and a new
  screen is missed until someone remembers; the placeholder check covers
  every screen that shows one.
- **Sentry's standard library.** Turned down for errors already: it collects
  page addresses by default, and it is a new dependency in every app.
- **Timings follow wherever a deployment sends its errors.** A company that
  wanted crash reports would get a named log of its staff's opens without
  asking for it (Miky, 19 November).

## Consequences

- Each speed project can start from, and close on, what Miky and Katerina
  each waited; Miky checks by hand only when the numbers show no change, or
  one he doubts.
- Sentry holds a log of when each of us opened which kind of screen, for 30
  days. Removing the key later stops it for new timings at once; the old ones
  age out.
- Every new field in a timing is a change to the list, reviewed as one.
- Free-plan limits: 5,000,000 spans a month and 30 days kept; our own limits
  keep timings from crowding out errors. A paid plan or another host later
  changes only where the server sends.
