# Signing in to Estiva ID is plain OAuth 2.0 with PKCE, and Estiva's own request format is retired

- Date: 2026-10-16
- Status: Accepted
- Decided by: Miky, in the kickoff session of "Your sign-in lasts while you use it: 7 days unused, 14 days at most"
- Area: Devices & sessions

## Who it affects

A builder at an outside company signs people in to their app with Estiva ID
using the OAuth library they already use (oauth4webapi, openid-client, AppAuth
or their platform's own), configured from the discovery document, with no
Estiva-specific client code. Miky and Katerina see no change: Peek, Ship and
Leaf sign in and renew as before.

It came up while the Specification's new section on signing in and staying
signed in was being written for the "Sign-in and auth, polished across the
apps" project. Miky: "I'm always bit worried if we are using something on our
own that is not standard across industry."

## Context

Estiva ID's flows are already OAuth 2.0's: the authorization code grant with
PKCE (S256), rotating refresh tokens, `prompt=none`, a discovery document and
RP-initiated logout. The `/token` endpoint, though, reads only a JSON body with
camelCase fields (`grantType`, `refreshToken`, `clientId`) and answers refusals
in Estiva's own error shape, where RFC 6749 asks for a form-encoded body and a
`{"error": "invalid_grant"}` answer. A standard library's request was refused
without a usable error.

Nothing chose that format. `/token` started on 4 Aug 2026 as Peek's same-origin
"session cookie in, token out" call, written in JSON. The code grant
(9 Aug) and the refresh grant later copied its style.

The Specification states what an identity service must do
([estiva-hosts-the-only-deployment](estiva-hosts-the-only-deployment.md)), so
the format written into it becomes the contract every outside app implements.

## Decision

- The sign-in contract in the Specification is plain OAuth 2.0 with PKCE
  (RFC 6749, RFC 7636, with RFC 9700's rules for browser apps): form-encoded
  token requests and standard error answers.
- Estiva ID accepts the standard format from the ticket that writes the
  contract.
- Estiva's own JSON format stays only until Estiva's shared sign-in package
  sends the standard format and Peek, Ship and Leaf run that release. Then it
  is removed, and Estiva's apps sign in the way an outside app does.

## Rejected alternatives

- **The Specification states today's JSON format.** No build, but every
  outside company hand-writes its sign-in client against a format no library
  speaks, and that format is hard to take back once they have.
- **Both formats, for good.** An outside company could use any library, but
  Estiva would keep a second, home-made way in to its most sensitive endpoint,
  and its own apps would stay off the standard.
- **Standard only, at once.** The same end state, but Estiva's sign-in package
  and all three apps would have to switch before the contract ships. The
  removal is staged instead, within the same project.

## Consequences

- An outside app needs nothing from Estiva beyond a registered `client_id`
  and redirect URIs to sign people in and keep them signed in.
- Every later change to sign-in is measured against the OAuth RFCs: a
  departure from them is a new decision, not an implementation detail.
- For a few weeks `/token` reads two formats. The removal is the last step of
  the project's final issue, "Leaf keeps you signed in, and asks on the page
  when it must".
- Estiva ID still issues no ID token: who signed in is the token's `sub` and
  the response's `pubkey`. That is allowed by OAuth 2.0, and the discovery
  document stops advertising one.
