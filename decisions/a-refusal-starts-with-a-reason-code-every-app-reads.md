# When the server refuses a change, it says why with a short code every app reads, before its sentence

- Date: 2026-11-03
- Status: Accepted
- Decided by: Miky, in the TEA-3 session (2026-11-03), on the brief "Why the server says no" ([page](briefs/why-the-server-says-no.html)), question 1: A, as recommended
- Area: Protocol

## Who it affects

Katerina moves a topic out of a team that is archived. Peek tells her
"Nothing was moved: one of the Folders is archived." It knows that because
the server's answer starts with a code for "archived", not because Peek
recognised a word in an English sentence. A topic that may go only to its
home team says so, instead of "Try again", which could never work.

An outside company that runs its own server sends the same codes and gets the
right messages in our apps. An outside app reads the codes instead of copying
our word list.

## Context

- When the server refuses a move, it answers with a sentence, such as "team
  … is archived; its list does not change". Peek, Ship, Leaf and the agent
  find the reason through one shared helper in interop that matches words in
  that sentence, and fall back to "Nothing was moved. Try again." when no word
  matches.
- Two refusals from the TEA-3 relay rules (a topic going somewhere other than
  its home team, and a topic taken off a team without a move) matched no word,
  so the apps told people to try again, which cannot succeed.
- The SPEC promised "a reason" but named no sentence, so a server built by
  someone else could not know what to send.
- Nostr already starts a refusal with a fixed word (`invalid:`,
  `restricted:`, `rate-limited:`) followed by free text. Slack's API answers
  with an error code, Matrix with an `errcode` beside a sentence.

## Decision

- **A refusal carries a short reason code before its sentence.** The SPEC
  lists the codes; the first are: archived, not a member, changed since you
  looked, not its home team, leaves only by moving.
- **Apps read the code and say it in their own words.** The sentence stays,
  for people reading logs and for apps that predate the code.
- **An app that meets a code it does not know** says only that nothing
  changed ("Nothing was moved." for a move), without guessing why.
- The relay's codes, the SPEC's list and the shared helper are built in the
  TEA issue "When the server says no, every app knows why".

## Rejected alternatives

- **Name the exact sentences in the SPEC.** Nothing new on the wire, but the
  English becomes the contract: rewording a sentence for clarity becomes a
  protocol change, an outside server must copy our words exactly, and
  translating one breaks every app.
- **Leave it as it is.** Our apps keep matching words, an outside server gets
  the generic "Try again" for every refusal, and each new rule adds another
  word to match.

## Consequences

- A new rule on the server comes with its code, and the list in the SPEC has
  to be kept tidy as it grows.
- Two-way: a code sits beside the sentence, so old apps keep working and
  nothing stored on the relay changes. Undoing it means apps go back to
  reading words.
