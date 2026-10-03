# Quickstart

From nothing to your own app running on your machine: signed in with Estiva ID,
connected to our hosted relay, and listing a project's issues from Ship. Once
you have access, it takes about fifteen minutes.

Every app on Nostr for Business uses the same two services: **Estiva ID**
(`https://id.estiva.app`), which signs you in and signs events for you, and
**the relay** (`https://estiva.estiva.app`), which stores them. We host both.
Running your own is not supported.

You need Node.js and npm, and a browser that can use a passkey.

## 1. Ask us for access

Before you start, you need two things, and only we can set them up today:

- **An Estiva ID account.** Accounts are by invitation.
- **Your app registered with Estiva ID.** Estiva ID signs only for apps it
  knows. We register yours with the event kinds it may sign, and with
  `http://localhost:5173/` as the address it returns to after sign-in.

Email **hello@estiva.app** with:

- your name, and the email address to send the invite to
- your app's name: lower-case letters, digits and dashes, starting with a letter
  (for example `my-app`)
- a sentence on what you are building

Each request is handled by hand, so we cannot promise how quickly you will hear
back. You receive:

- **An invite link.** Open it to create your Estiva ID account with a passkey.
  It works once and expires after seven days. If it expires, ask again.
- **Your app's client id.** It may differ from the name you sent.

We register `http://localhost:5173/` only. When you want to run your app
somewhere else, ask again. That address has to be added to both Estiva ID and
the relay.

> **What an invite opens.** There is one workspace on the relay, and it is
> ours. With an Estiva ID account you are a member of it, through your own app
> and through Peek and Ship. A member can read everything in every Folder, post
> in any of them, and change or move anything there: rename an issue, change
> its status, move a file. Only managing Folders themselves is kept for their
> owners. Anything you post, everyone in the workspace can read. This is why
> we invite people one by one.

## 2. Make the app

```sh
npx -p @estiva-app/ui create-estiva-app my-app
cd my-app
npm install
```

`create-estiva-app` comes with `@estiva-app/ui`. It makes a React and Vite app
with a sidebar frame, sign-in with Estiva ID, one connection to the relay, and
the UI checks every Estiva app runs. `npm run lint`, `npm test` and
`npm run build` all pass on what it makes.

Run `npm run dev` now and you get the app **running alone**: no sign-in is
offered and nothing is sent anywhere. The home page says
"Running alone: no relay is set."

## 3. Point it at Estiva ID and the relay

Copy `.env.example` to `.env.local` and fill it in:

```sh
VITE_ESTIVA_ID_ORIGIN=https://id.estiva.app
VITE_ESTIVA_ID_CLIENT_ID=<the client id we sent you>
VITE_RELAY_URL=https://estiva.estiva.app
```

Vite reads `.env.local` only when it starts. Restart `npm run dev` after any
change to it.

## 4. Sign in

```sh
npm run dev
```

Open **`http://localhost:5173`**, exactly that. `127.0.0.1:5173` is a different
address, and both Estiva ID and the relay refuse it. The app first asks Estiva
ID whether you are already signed in. If you are not, it shows **Continue with
passkey**. Use the passkey you made from your invite, and you come back signed
in, with your name at the top right.

The home page then says **"Connected to estiva.estiva.app as <your name>."**
You are reading the workspace's live relay.

The app always runs on port 5173. If another program is already using it,
`npm run dev` stops with "Port 5173 is already in use" rather than moving to
another port that sign-in would refuse. Stop the other program and try again.

## 5. List a project's issues

Find a project to list. Open [Ship](https://ship.estiva.app), open any project,
and copy the link from your browser's address bar. It looks like
`https://ship.estiva.app/project/<the project's name>-<its id>`.

Add `src/issues.ts`, and paste the link into `PROJECT`:

```ts
import { estivaIdSigner } from '@estiva-app/identity'
import { identifierFromRef, resolveForeignObject, type QueryFn } from '@estiva-app/interop'
import { addrToNaddr, Relay } from '@estiva-app/protocol'
import { useEffect, useState } from 'react'
import { currentToken } from './auth/estivaId'
import { ID_CONFIG, RELAY_URL } from './config'

/** The project to list: its link copied from Ship's address bar, or its address. */
export const PROJECT = ''

export interface Issue {
  address: string
  title: string
  status: string
}

export type Issues = { kind: 'loading' } | { kind: 'listed'; issues: Issue[] } | { kind: 'failed'; reason: string }

/**
 * Reads from the relay as whoever signed in. Every read is a POST to the
 * relay's /query, signed (NIP-98, kind 27235) by Estiva ID. `null` when this
 * build has no relay or nobody has signed in.
 */
export function relayQuery(): QueryFn | null {
  const token = currentToken()
  if (!RELAY_URL || !ID_CONFIG || !token) return null
  const signer = estivaIdSigner({ base: ID_CONFIG.base, pubkey: token.pubkey, token: () => currentToken()?.accessToken })
  const relay = new Relay(RELAY_URL, signer)
  return (filters) => relay.queryAll(filters)
}

/**
 * The project's address, `30850:<pubkey>:<id>`, from what was pasted: the
 * project's link from Ship (`https://ship.estiva.app/project/<name>-<id>`) or
 * the address itself. A link carries only the id, so the author is one read
 * away. `null` when no project has that id.
 */
export async function projectAddress(input: string, query: QueryFn): Promise<string | null> {
  const pasted = input.trim()
  if (/^30850:[0-9a-f]{64}:[^:]+$/.test(pasted)) return pasted
  const id = identifierFromRef(/\/project\/([^/?#]+)/.exec(pasted)?.[1] ?? '')
  if (!id) throw new Error(`Not a project's link or address: ${input}`)
  const [project] = await query([{ kinds: [30850], '#d': [id], limit: 1 }])
  return project ? `30850:${project.pubkey}:${id}` : null
}

/**
 * A project's issues, each with its current title and status. Ship's manifest
 * says how: issues are `kind:30851` events naming the project in an `a` tag,
 * and their titles and statuses are the `kind:1851` changes folded over them.
 * `@estiva-app/interop` reads the manifest and does both. The manifest lists
 * at most 200 issues.
 */
export async function listIssues(project: string, query: QueryFn): Promise<Issue[] | null> {
  const address = await projectAddress(project, query)
  if (!address) return null
  // The last argument looks people up by pubkey; this page shows no names, so it asks for none.
  const resolved = await resolveForeignObject(addrToNaddr(address), query, async () => ({}))
  if (!resolved || resolved.unreachable) return null
  return (resolved.children ?? []).map((issue) => ({
    address: issue.address ?? issue.ref,
    title: issue.slots.title?.value ?? 'Untitled',
    status: issue.slots.status?.value ?? '',
  }))
}

/** {@link listIssues} for a page: loading, then the list or why there is none. */
export function useIssues(project: string): Issues {
  const [read, setRead] = useState<{ project: string; issues: Issues } | null>(null)
  const [query] = useState(relayQuery)
  useEffect(() => {
    if (!query) return
    let live = true
    const settle = (issues: Issues) => live && setRead({ project, issues })
    listIssues(project, query).then(
      (found) => settle(found ? { kind: 'listed', issues: found } : { kind: 'failed', reason: 'No project at that address.' }),
      (error: unknown) => settle({ kind: 'failed', reason: error instanceof Error ? error.message : String(error) }),
    )
    return () => {
      live = false
    }
  }, [project, query])
  if (!query) return { kind: 'failed', reason: 'Sign in to read the relay.' }
  return read?.project === project ? read.issues : { kind: 'loading' }
}
```

Add the page that draws them, `src/pages/IssuesPage.tsx`:

```tsx
import { Chip, EmptyState } from '@estiva-app/ui'
import type { Issues } from '../issues'

export interface IssuesPageProps {
  /** What the read has come back with so far. */
  issues: Issues
}

/** A project's issues, one row each: the title, then the status. */
export function IssuesPage({ issues }: IssuesPageProps) {
  if (issues.kind === 'loading') return <EmptyState message="Reading the project…" />
  if (issues.kind === 'failed') return <EmptyState message={issues.reason} />
  if (issues.issues.length === 0) return <EmptyState message="This project has no issues." />
  return (
    <ul className="flex flex-col gap-1 p-6">
      {issues.issues.map((issue) => (
        <li key={issue.address} className="flex items-center justify-between gap-3 text-body-2 text-text-primary">
          <span className="truncate">{issue.title}</span>
          <span className="shrink-0">{issue.status && <Chip label={issue.status} />}</span>
        </li>
      ))}
    </ul>
  )
}
```

In `src/App.tsx`, import both:

```tsx
import { PROJECT, useIssues } from './issues'
import { IssuesPage } from './pages/IssuesPage'
```

Then show the issues in place of the home page once `PROJECT` is set and you
are signed in. Replace the `<HomePage … />` line with the first line below, and
add the small component at the end of the file:

```tsx
      {PROJECT && signedIn ? <ProjectIssues project={PROJECT} /> : <HomePage relay={RELAY_URL} state={relayState} name={me.name} />}
```

```tsx
function ProjectIssues({ project }: { project: string }) {
  return <IssuesPage issues={useIssues(project)} />
}
```

Save, and the app lists the project's issues, one row each: the title, and the
status as Ship shows it ("Todo", "In Progress", "Done"). It reads the project
when the page loads, so reload to see changes made since. Ship's manifest lists
at most 200 issues per project.

`npm run lint`, `npm test` and `npm run build` still pass. The tests run with
no sign-in, whatever `.env.local` holds.

### What just happened

Your app never learned how Ship stores its data. It asked
`@estiva-app/interop`, which read Ship's published manifest (a `kind:31990`
event) and followed it:

- **The project** is a `kind:30850` event. Its address is
  `30850:<author's pubkey>:<id>`. A Ship link carries only the id, so
  `projectAddress` reads the project once by its id (a `#d` filter) to learn
  its author.
- **Its issues** are the `kind:30851` events that name that address in an `a`
  tag. An issue does not carry its current title and status itself. Each rename
  or status change is a `kind:1851` event, and interop folds them in order.
- **Every read** is a POST to the relay's `/query`, signed with NIP-98
  (`kind:27235`) by Estiva ID, as you. The relay answers only members. This is
  why your app is registered for `27235`, and for `22242`, the relay's sign-in
  handshake on its live connection.

The [Specification](../protocol/SPEC.md) sets these rules out, and
[Event kinds](../protocol/KINDS.md) lists every kind.

## When something goes wrong

| What you see | Why | What to do |
| --- | --- | --- |
| Estiva ID shows `Unknown or disabled app` | The client id in `.env.local` is not one Estiva ID knows | Use the client id we sent you exactly, then restart `npm run dev` |
| Estiva ID shows `That redirect_uri is not registered for this app` | The app is not on `http://localhost:5173` | Open `http://localhost:5173`, not `127.0.0.1` or another port |
| `npm run dev` stops with `Port 5173 is already in use` | Another program holds the port | Stop it. The app will not move to another port, because sign-in would refuse it |
| "Running alone: no relay is set." | `VITE_RELAY_URL` is empty, or `.env.local` changed after Vite started | Fill it in and restart `npm run dev` |
| "Could not connect to estiva.estiva.app." | The relay refused the connection or could not be reached | Check you are on `http://localhost:5173` and signed in. If it persists, email us |
| "Not a project's link or address: …" | `PROJECT` holds something else, such as an issue's link | Copy the link again from Ship's address bar, while a project is open |
| "No project at that address." | Nothing is published at that address. The project may have been deleted | Open the project in Ship and copy its link again |

## Where next

- [Designing across apps](../design/DESIGNING-ACROSS-APPS.md): what changes
  when your screen holds objects another app made.
- [Specification](../protocol/SPEC.md): the protocol your app now speaks.
