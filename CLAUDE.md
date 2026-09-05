# CLAUDE.md

Guidance for Claude Code working in `ragenta-landing-page`.

## What this is

Ragenta's public marketing site. Next.js 16 App Router, React 19 (React
Compiler on), Tailwind v4, TypeScript strict, package manager **pnpm**. pnpm
settings live in `pnpm-workspace.yaml` — pnpm 11 no longer reads the `pnpm`
field in package.json.

    pnpm dev     # Turbopack on :3000
    pnpm build   # production build; also the TypeScript gate
    pnpm start   # serve the build on :8020
    pnpm lint    # React Compiler + hooks rules

There is no test suite. `pnpm build` and `pnpm lint` are the whole gate, and
both are green — keep them that way.

## Start of a session

| Read | When |
| --- | --- |
| `.claude/docs/STATE.md` | **First.** What exists, what is stubbed, what is assumed, how to verify a change |
| `.claude/docs/DECISIONS.md` | Before changing anything that cuts across the codebase |
| `.claude/rules/functions.md` | Before writing any function or component |
| `.claude/rules/content.md` | Before adding copy, a listing, or anything an admin would edit |
| `.claude/rules/theming.md` | Before writing a colour |
| `.claude/rules/i18n.md` | Before writing a user-facing string or a link |
| `.claude/rules/git-safety.md` | Before any Git operation |
| `README.md` | Architecture overview for a human |

If you change how something works, update `STATE.md` in the same commit.

## The four rules that are easiest to break

1. **No colour literals in sections.** Every colour is a semantic token
   (`bg-card`, `text-ink-muted`, `border-line`, `text-brand-600`). A `slate-500`
   or `#fff` silently breaks dark mode.
2. **Copy a backend will own goes in `src/content/`**, not in a component.
   Static UI copy goes in the dictionaries. Neither goes in JSX.
3. **Every user-facing string is a dictionary key**, added to **both**
   `en.json` and `vi.json` in the same change.
4. **`LocaleLink`, never `next/link`**, for internal navigation.

## Things that will bite you

- `src/proxy.ts` must keep a **named** `export function proxy`. Next 16 silently
  ignores a default export, which disables locale detection with no error.
- Effects that call `setState` synchronously fail lint. Derive during render, or
  read external state with `useSyncExternalStore` (see `lib/ThemeContext.tsx`).
- Anything theme-dependent that renders differently on server and client
  mismatches on hydration under the `system` preference. Swap with the `dark:`
  variant, not a `mounted` flag.
- Space Grotesk has no Vietnamese subset; `globals.css` routes `--font-heading`
  back to Inter under `html[lang="vi"]`. Satori ships none either, so
  `og-image.tsx` fetches the subset it needs. Do not remove either.
- Do not drop `turbopack.root` / `outputFileTracingRoot` from `next.config.ts` —
  this repo sits inside a multi-repo workspace and Next would otherwise infer a
  parent directory as the root.
- The browser must not call an upstream service directly. Client reads go
  through `/api/*`.

## Adding a page

Create `src/app/[lang]/<route>/page.tsx`, add a `metadata.<key>` entry to both
dictionaries, export `generateMetadata` using
`pageMetadata(lang, "<key>", "/<route>")`, wrap the tree in `SignupFlowProvider`
with `Navbar` and `Footer`, and add the route to `src/app/sitemap.ts` — and to
`llms.txt/route.ts` if it belongs there.
