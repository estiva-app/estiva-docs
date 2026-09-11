# Event kind registry

Every Nostr event kind the Estiva Suite writes or reads, what it means here, and
which component owns it.

**This table is the one place to look before choosing a number.** The kinds are
spread across three repos and a non-default branch, and until this page existed
nobody held the whole list.

> **Verify before trusting.** A kind is only usable if *three* separate gates
> allow it, and each refuses in a way that looks like success from the layer
> above. Run `npm run probe` in `~/estiva-ship` to ask a live relay what it
> actually accepts. See [ADDING-A-KIND.md](ADDING-A-KIND.md).

---

## 1. What Estiva writes

### Identity — owned by Estiva ID

| Kind | Name | Notes |
| --- | --- | --- |
| `0` | Profile | **Estiva ID is the sole publisher.** `/sign` refuses kind:0 for every app, checked *before* the per-app allowlist so it cannot be granted by editing a database row |
| `9030` | Add member (admission) | NIP-43 relay admin command. Enrolment admits a pubkey |
| `9031` | Remove member | Offboarding revokes admission. This is the door, and it is separate from the key |
| `24242` | Blossom auth | BUD-11. Signs avatar uploads to the relay's media store |
| `27235` | NIP-98 HTTP auth | Authenticates every write to the relay's HTTP bridge. Constrained by URL prefix |

### Communication — written by Estiva Peek

| Kind | Name | Notes |
| --- | --- | --- |
| `9` | Stream message | NIP-29 group message. A Topic message, a DM, and a Ship project conversation are all this |
| `7` | Reaction | Emoji capped at 64 chars (`build_reaction`) |
| `5` | Deletion | NIP-09. A *request* — relays may decline. Accepted from the author **or** the author's NIP-OA owner, which no client can evaluate ([SPEC §6.5](SPEC.md)) |
| `9007` | Folder (NIP-29 create group) | The container. See §3 |
| `9101` | **Estiva assertion** | A statement *about* something in the channel rather than a message in it. `resolution` is the first and currently only subtype, named by the `t` tag. Estiva-specific |

### Issue tracking — written by Estiva Ship

| Kind | Name | Notes |
| --- | --- | --- |
| `30850` | Project | Addressable. Root event carries immutable facts only |
| `30851` | Issue | Addressable. **Status and assignee are not on it** — see §4 |
| `1851` | Change | Regular, append-only. Authored by whoever acts, not by the object's author |
| `1111` | Comment | NIP-22 |
| `31989` / `31990` | Handler recommendation / information | NIP-89 manifest. Global, not channel-scoped — discovery must work before you are a member of anything |

---

## 2. Kind number ranges, and why they matter

Nostr's ranges are not cosmetic — the relay's storage behaviour follows from
the number:

| Range | Behaviour | Consequence |
| --- | --- | --- |
| `1000`–`9999` | **Regular** — stored, append-only | Every event survives. History is preserved |
| `10000`–`19999` | Replaceable | One per pubkey+kind. Latest wins |
| `20000`–`29999` | Ephemeral | Not stored at all |
| `30000`–`39999` | Addressable | One per `(pubkey, kind, d)`. Latest wins |

Two live consequences:

- **`9101` sits in the regular range on purpose.** A replaceable kind would
  overwrite the previous assertion and destroy exactly the history it exists to
  keep. It clears NIP-29's `9000`–`9030` block deliberately.
- **`1851` Change must be regular, not addressable.** NIP-33 addresses are
  `(pubkey, kind, d)`, so only an author can replace their own event — and
  "Ana opens an issue, Ravi closes it" is otherwise inexpressible.

---

## 3. The Folder is a `kind:9007`, and `h` points at it

The single structural rule of this protocol. A Folder is a NIP-29 group. Every
object below it carries that Folder's id in an `h` tag.

| Event | `h` |
| --- | --- |
| `30850` Project | the project's Folder |
| `30851` Issue | the same Folder |
| `1851` change to either | the same Folder |
| `1111` comment / `9` message | the same Folder |

**There is no workspace object, deliberately.** Buzz resolves a *community*
from the request host before a connection is authenticated, so **the relay URL
is the workspace**. Everyone pointed at the same relay is in the same
workspace, in every app. An index object invented by one app would be a second,
app-private notion of the same thing — invisible to the others.

This is why a Peek topic and a Ship project are not "linked": they are **one
Folder**, from the first event.

---

## 4. What the relay does with each kind

Buzz maps every accepted kind to a required scope in
`crates/buzz-relay/src/handlers/ingest.rs` (`required_scope_for_kind`).
**A kind with no arm returns `Err` and is rejected at ingest** — this is gate 2
of the three.

| Scope | Meaning | Estiva kinds |
| --- | --- | --- |
| `UsersWrite` | User-owned global state | `0`, `31989`, `31990` |
| `MessagesWrite` | A write into a channel | `5`, `7`, `9`, `1111`, `1851`, `30850`, `30851` |
| `AdminChannels` | Channel administration | `9007` |
| `AdminUsers` | Membership administration | `9030`, `9031` |

`MessagesWrite` on `1851` is doing real work: it is what lets one member set a
field on another member's object, which is the normal case in a tracker.

`30850` / `30851` / `1851` **require `h` at ingest.** The Folder is not
optional — several apps write these kinds, and one of them forgetting would put
an unreachable object into the shared space that nobody can unpublish.

---

## 5. Per-app signing ceilings

Gate 1 of three. Estiva ID's `/sign` refuses any kind not in the calling app's
`allowed_kinds`, returning `422 policy_violation / kind_not_allowed`.

Source of truth: `SEED_APPS` in `estiva-id/src/db/seed.ts`, stored in the
`app_credentials` table.

| App | `client_id` | Allowed kinds |
| --- | --- | --- |
| Estiva Peek | `estiva-peek` | `9, 7, 5, 9007, 27235, 1851, 9101` |
| Estiva Ship | `estiva-ship` | `30850, 30851, 1851, 9, 5, 9007, 31989, 27235` |

Two things this table teaches:

- **Peek is allowed to sign `1851`, which is Ship's kind.** Acting on another
  app's object means writing that app's kind — Peek takes the number from the
  target app's published manifest, not from its own vocabulary. Any further
  cross-app action needs the same treatment: the list is the union of what an
  app writes for itself and what the apps it acts on declare.
- **The same number means different things to different apps.** `9007` is a
  huddle for Peek and a Folder for Ship. That is fine: this list says what an
  app may *sign*, not what a kind *means*.

Read the live values rather than trusting this page, because a seed change only
reaches production through a manual re-seed:

```bash
docker compose exec -T postgres psql -U estiva_id -d estiva_id -tAc "select client_id, allowed_kinds from app_credentials"
```

---

## 6. Buzz kinds we do not write

Buzz's registry (`crates/buzz-core/src/kind.rs`) is much larger than what
Estiva uses — forum posts, agent personas, moderation commands, DM visibility,
push leases, stream message variants. **Do not read that file as a menu.** Most
of it belongs to upstream Buzz features the Estiva suite does not ship, and
picking a number out of it will produce an event no Estiva app renders.

Two that were registered *for* NfB and then not used — one of which now has a
use:

| Kind | Name | Status |
| --- | --- | --- |
| `30840` | **Bare file** | **The file no app owns — SPEC §6.7, decided 2026-09-11.** A Peek topic is one. Registered on `nfb-demo-kinds` as `KIND_FILE`, `MessagesWrite`; `h` is SHOULD at ingest and MUST in SPEC. Granted to `estiva-peek` (estiva-id#66). Built by `buildBareFile` in `@estiva-app/protocol` 0.20.0; resolved without a manifest by `@estiva-app/interop` 0.19.0 |
| `30841` | Component | Registered, unused, and **deprecated**: blocks carry ids (§13.3) and attachments are blocks (RFC 0.6 §3). COM-3 decides whether it is retired or repurposed |

---

## 7. Choosing a new number

Provisional Estiva numbers are taken from ranges unused in the NIP index:
**`30820`–`30899`** for addressable objects and **`185x`** for regular ones.
`9101` is outside both — it was chosen to sit in the regular range while
clearing NIP-29's admin block.

Before you take a number, read [ADDING-A-KIND.md](ADDING-A-KIND.md). Registering
the number is the easy part; three gates have to open, and each one refuses
silently.
