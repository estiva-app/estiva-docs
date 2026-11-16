# An app names the types of file it opens and draws in its own listing, a named type as well as a kind, so an outside company's app declares its own types the same way

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the shaping session of 16 November 2026 for the project "Insights, Journal and Risks", asked "When Katerina clicks a marked message in Peek, or an outside company's app meets an Insight, how does it know Ship is the app that opens and draws it?", choosing option A over a default app per type in Estiva's directory: "Who opens a type: apps name the types they open in their own listing". Lines marked as Claude's are not his words; his merge of this record accepts them
- Area: Files

## Who it affects

Katerina clicks a message in Peek that someone marked as an Insight. Peek has
to know which app opens an Insight and draws it: Ship. An outside company's
app that meets an Insight on the relay has the same question, and so does
Ship when it meets an outside company's `acme.invoice`. Under this call each
of them finds the answer in the apps' own listings, and an outside company
says which of its types its app opens without asking Estiva.

## Context

- Every type other than the four base types starts with one named first
  record, `kind:30852`, whose `k` names its type
  ([osnovas-base-types-keep-their-records-and-every-new-type-starts-named](osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md);
  SPEC §6.1). Insights, Journal entries and Risks are such types
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)).
- A type and its properties are defined by an app's listing, or later by a
  person's database
  ([an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)).
- Estiva curates the shared types in a public directory any builder starts
  from, and forces no one
  ([estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md)).
- SPEC §6.1 says: "Until §7 can name a type, a manifest cannot say which app
  opens or draws a named type": `records`, `projections`, `urls`, `aspect` and
  a `kind:31990`'s claims (§7) are keyed by kind number, and every named type
  shares `30852`. So today no app can say it opens Insights, and nothing tells
  Peek that Ship does.

## Decision

- **An app names the types it opens and draws in its own listing**, the way it
  names kinds today. A named type is claimed as a kind is.
- **Any app declares its own types the same way**, Estiva's and an outside
  company's alike, with no entry in Estiva's directory needed to be opened.
- **Two apps may both name one type.** Both are offered; neither is the
  type's owner by declaring it.
- *Claude's encoding, for the record:* wherever §7 keys by kind, a named type
  is keyed by the pair `{"kind": 30852, "type": "osnova.insight"}`: in
  `records`, `projections`, `urls`, and a `kind:31990`'s `k` claims. The type
  name `osnova.insight` is itself the build's to settle.
- **Not decided here:** how a company picks between two apps that both name a
  type.

## Rejected alternatives

- **B · Estiva's public directory names one default app per type,
  hard-coded.** Turned down: an outside company's own type could not say
  which app opens it, and Estiva would become the gatekeeper of which app
  opens what, which the directory record keeps it from being: it helps
  builders agree and forces no one.
- **Three kinds of their own**, one each for Insight, Journal entry and Risk,
  so that today's kind-keyed listings could claim them. Turned down: it goes
  against the Accepted record that every new type starts with one named first
  record (osnovas-base-types-keep-their-records-and-every-new-type-starts-named),
  and an outside company's types would still have no way to be claimed.

## Consequences

- SPEC §7 gains a way to key by named type, and §6.1's "until §7 can name a
  type" is answered; the build of "Insights, Journal and Risks" carries it,
  with Ship's listing naming the three types.
- Peek, and any app, finds the app that opens a marked message's item by
  reading the listings, as it does for a kind.
- An outside company's types open in its own app from every Estiva app, with
  nothing to register.
- A company with two apps naming the same type needs a rule for which opens;
  that is open, and shaped when it first happens.
