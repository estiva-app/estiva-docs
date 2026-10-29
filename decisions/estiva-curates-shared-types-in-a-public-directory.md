# Estiva curates the shared types in public, in a directory of types any builder starts from, and the optional App Store's review helps builders agree but forces no one

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the brief session of 26 October, on the brief "Files, Types, History" ([page](briefs/files-properties-schemas.html)), call 2: "Estiva in public with a directory of types, the optional App Store helping consensus"
- Area: Files

> Superseded in part, 2026-10-29: numbers and the kind registry are replaced
> by names, `osnova.*` in the Osnova directory, by
> [every-file-is-an-artifact-the-relay-keeps-in-order](every-file-is-an-artifact-the-relay-keeps-in-order.md);
> a directory entry also says what a type converts to. The rest of this record
> stands.

## Who it affects

The brief's example, from Miky's own: an HR expert at an outside company starts an HR app from Estiva's public
directory of types. Job position is there, so they reuse it and add their own
"Salary band". Candidate is not there yet, so it starts as their own record
type, and they propose it. They need no permission to build the app or to add
it to a workspace.

Miky, 26 October: it is an open ecosystem, and the App Store is optional. Its
review warns about clashing or skipped shared types and helps bring the
community to consensus, but it does not enforce anything. Spam is irrelevant
for enterprise.

## Context

- A file's type is a shared meaning with its own number, which any app extends
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)).
  Someone has to say no to a second "task", and yes to "candidate", and decide
  quickly; if nobody does, everything stays a record.
- In Nostr nobody hands out numbers. 281 kinds are registered, by pull request,
  in `nostr-protocol/registry-of-kinds`. Collisions happen: four were found,
  one of them with our Folder listing's number (`30890`/`30891`, also claimed
  by nips#2354 and #1815). Using names or namespaces instead of numbers was
  argued down twice (nips#511, #1974).
- Others curate shared vocabularies in public: schema.org (JobPosting, Person,
  Event) through a steering group that sites extend; AT Protocol's Lexicon
  Community, a volunteer group with a steering committee, for shared meanings
  such as calendar events.
- Nostr already has kinds for some shared meanings: comments on anything,
  git issues and their status, long-form articles, classified listings (whose
  text names "work opportunities"), calendar events. How closely the git-issue
  and listing kinds fit our issue and a job position is not checked yet.

## Decision

- **Estiva keeps a public directory of types in estiva-docs.** It says what
  each shared number means: its core properties, each with a fixed id and a
  label.
- **Any company may build an app and add it without us.** New builders start
  from the directory, and a record type that shows up in several apps gets a
  shared number.
- **The App Store is optional.** It lists verified apps that companies install
  and update in one place. Its review warns a builder whose app clashes with a
  shared type, or skips one that fits. It helps the community agree, and it
  forces no one. Outside the store nothing forces reuse, and a clash shows only
  in the directory.
- **Each number is registered in Nostr's kind registry.** An existing Nostr
  kind is reused where its shape fits, and when it doesn't, the directory says
  why.
- **A type is proposed upstream as a Nostr standard once a second company uses
  it.**
- **A steering group of adopters comes later**, as with schema.org and the
  Lexicon Community.
- **A shared type changes only compatibly**; a breaking change is a new number.

## Rejected alternatives

- **The Nostr community decides.** Each shared type is a Nostr standard,
  merged upstream before apps use it. The most aligned and the slowest, and the
  process is built around social clients. "Why not the git-issue kind for
  issues?" becomes a question for every type.
- **Nobody: the first app to register a meaning owns it.** The fastest. It is
  the first-come land grab Vitor warns about, and collisions follow.

## Consequences

- Curation is a job that never ends, and it is Estiva's until adopters share
  it. A slow yes or no leaves types as records, named for apps.
- A builder outside the App Store can still clash with a shared type or skip
  one; the directory is where it shows.
- Each new shared type adds a definition to the directory and a row to Nostr's
  registry, and a second company using it adds an upstream proposal.
- Two-way in itself: who curates can move to a steering group later. The
  numbers it hands out are one-way, as in all of Nostr.
