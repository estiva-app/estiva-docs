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
  opens or draws a named type: `records`, `projections`, `urls` and a
  `kind:31990`'s claims are keyed by kind number, and every named type shares
  `30852`. That is specified with apps declaring their types to the relay." So
  today no app can say it opens Insights, and nothing tells Peek that Ship
  does.
- *Claude's:* the claim in an app's listing, which app opens and draws a
  type, is separate from what an app declares to the relay about a type,
  which changes how files are found and ranked and never what is accepted
  ([a-types-declaration-changes-how-files-are-found-never-what-is-accepted](a-types-declaration-changes-how-files-are-found-never-what-is-accepted.md)).
- An app counts only once the workspace has added it
  ([an-app-counts-only-once-the-workspace-adds-it](an-app-counts-only-once-the-workspace-adds-it.md)).
- *Claude's:* giving Insights, Journal entries and Risks three kinds of their
  own, so that today's kind-keyed listings could claim them, was not an
  option: every new type starts with one named first record
  ([osnovas-base-types-keep-their-records-and-every-new-type-starts-named](osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md)).

## Decision

- **An app names the types it opens and draws in its own listing**, the way it
  names kinds today. A named type is claimed as a kind is.
- **Any app declares its own types the same way**, Estiva's and an outside
  company's alike, with no entry in Estiva's directory needed to be opened.
- *Claude's:* **only the listings of apps the workspace has added count**
  ([an-app-counts-only-once-the-workspace-adds-it](an-app-counts-only-once-the-workspace-adds-it.md)).
- *Claude's:* **naming a type you open does not redefine it.** A shared type's
  core stays the directory's; an app's own fields are its own.
- *Claude's, for the SPEC PR:* the exact shape of the claim is left to the
  SPEC PR, for example a `k` value naming the type alongside `30852`, as §6.1
  already filters a named type's files. In it, an app's `records` adds only
  that app's own fields, never a shared type's core fold.
- **Not decided here:** how a company picks between two added apps that both
  name a type, including whether both are offered.

## Rejected alternatives

- **B · "Estiva's public list of shared types names each one's default app,
  and apps hard-code it".** Turned down: an outside company's own type could
  not say which app opens it, and Estiva would become the gatekeeper of which
  app opens what, which the directory record keeps it from being: it helps
  builders agree and forces no one.

## Consequences

- SPEC §7 gains a way to key by named type, and §6.1's "until §7 can name a
  type" is answered; the build of "Insights, Journal and Risks" carries it,
  with Ship's listing naming the three types.
- Peek, and any app, finds the app that opens a marked message's item by
  reading the listings, as it does for a kind.
- An outside company's types can be found from the listings, once the
  workspace has added its app, with nothing to register in Estiva's
  directory.
- A company with two added apps naming the same type needs a rule for which
  opens; that is open, and shaped when it first happens.
