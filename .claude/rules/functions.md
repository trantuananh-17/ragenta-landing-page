# Writing Functions and Components

Read the file you are about to change and two of its neighbours first. These are
the defaults for when nothing nearby settles the question.

## Shape

- **One job per function.** If you need "and" to describe it, it is two.
- **Name it after what it answers, not how.** `getPostPage`, `hreflangAlternates`,
  `localizedHref`. Not `handleData`, `processItems`, `doFetch`.
- **Arguments**: up to two positional, then switch to a single options object.
  Every call site in this repo that takes three or more takes an object
  (`getPostPage({ locale, limit, offset, search })`) — the labels at the call
  site are the documentation.
- **Return the value, do not mutate the argument.** The only place we mutate is
  the DOM, in an effect.
- **No boolean parameters that select behaviour.** `render(post, true)` tells
  the reader nothing. Two functions, or a named field in an options object.

## Types

- Strict TypeScript. **Never `any` to silence the compiler** — model the type.
  `unknown` plus a narrowing function is the correct move for external data.
- Derive, don't duplicate. `Dictionary` comes from `typeof en`; `PublicEnv` is
  declared once and imported. A second hand-written copy of a shape drifts.
- `as` is a claim you are making to the compiler. It is acceptable for
  `vi.json as Dictionary` (structure enforced by review) and for the narrowing
  helpers in `src/content/`. Everywhere else, prove it with a type guard.
- Export the types a caller needs, keep the rest local.

## Boundaries

Anything crossing into this process is untrusted until it is checked:

- **HTTP request bodies** → a zod schema in `src/lib/validators.ts`, validated by
  `zValidator` at the route. Never read `body.email` unvalidated.
- **Content backend responses** → a `normalize*` function in `src/content/*.ts`
  that returns `null` on anything malformed, so the caller degrades to the
  fixture instead of half-rendering. Throwing there takes a page down; returning
  `null` does not.
- **Environment variables** → read once, in `src/lib/site.ts`,
  `src/lib/constants.ts` or `src/lib/public-env.ts`, and imported from there. No
  scattered `process.env` in a component or a section.
- **Route params and search params** → they are strings or arrays of strings and
  may be absent. `getCurrentPage` / `getSearchQuery` in the blog page are the
  pattern: coerce, validate, fall back.

## Errors

- **No silent catch.** A `catch {}` with an empty body must carry a comment
  saying what it is deliberately ignoring and why (see `fromApi`, which logs and
  returns `null` on purpose).
- Log identifiers and outcomes, never payloads. `console.error("[contact]
  webhook rejected:", response.status)` — not the body, which echoes back what
  the visitor submitted.
- What a client sees is generic; the detail stays in the server log.

## React

- **Server component by default.** Add `"use client"` only when the file needs
  state, an effect, an event handler or a browser API — and push it to the
  smallest leaf that needs it. `BlogHighlights` and `ProductChangelog` are
  server components that read the content layer directly; the interactive
  sections around them are client leaves.
- **Never call `setState` synchronously inside an effect.** Lint fails, and it
  is a signal the value should be derived during render or read with
  `useSyncExternalStore`. `ThemeContext` and the Navbar's dismissal state are
  the two worked examples in this repo.
- Effects are for synchronising with something outside React: the DOM, a media
  query, a scroll listener, a timer. Each one returns its cleanup.
- Handlers are named for the event's meaning (`handleFormStart`,
  `dismissAnnouncement`), not `onClick2`.
- **Do not extract a component to avoid repetition alone.** `ProductCard` exists
  because nine sections need the identical shell; `WindowChrome` because a dozen
  do. Two similar blocks stay two blocks.

## Comments

Explain **why**, never what. A comment that restates the line below it is noise
that will go stale.

Worth a comment: a business constraint, an external-system quirk, a security
reason, a non-obvious ordering, a fix whose absence caused a real bug. The
`umask 077` note in the deploy template and the "`grep` exits 1 when it filters
everything out" note are the standard to aim at.

Not worth a comment: `// set the state`, `// map over items`, a JSDoc block that
repeats the signature.

## Things that are wrong here even though they are fine elsewhere

- A raw Tailwind palette class in a section (`text-slate-500`) — see
  `theming.md`.
- A user-facing string in JSX — see `i18n.md`.
- `next/link` for an internal route — use `LocaleLink`.
- Copy a backend will own, written into a component — see `content.md`.
- A `fetch` from a client component straight to an upstream service — it goes
  through this site's own `/api/*`.
