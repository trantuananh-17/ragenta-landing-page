# CLAUDE.md

Guidance for Claude Code when working in `ragenta-landing-page`.

Read `README.md` first — it documents the architecture. This file only records
the rules that are easy to break.

## What this is

Ragenta's public marketing site. Next.js 16 App Router, React 19 (React
Compiler on), Tailwind v4, TypeScript strict, package manager **pnpm**. pnpm
settings live in `pnpm-workspace.yaml` — pnpm 11 no longer reads the `pnpm`
field in package.json.

Verify a change with `pnpm build` (TypeScript) and `pnpm lint` (React Compiler
and hooks rules, including `react-hooks/set-state-in-effect`). Both are green;
keep them that way.

## Non-negotiable rules

1. **`vecura-landing-page/` is read-only reference code** (ADR-012). Never
   edit, stage, commit, lint, format or install inside it. It is gitignored and
   excluded from tsconfig, eslint and Docker. If you ever see it staged, stop
   and report.
2. **No colour literals in sections.** Every colour is a semantic token
   (`bg-card`, `text-ink-muted`, `border-line`, `text-brand-600`). A
   `slate-500` or `#fff` in a section silently breaks dark mode. The only
   exceptions already in the tree are the terminal/code mockups and the macOS
   traffic-light dots.
3. **Copy that a backend will own goes in `src/content/`, not in a component.**
   Fixtures live in `src/content/fixtures/`; the fetchers return API-shaped
   payloads and degrade to the fixtures when `RAGENTA_CONTENT_API_URL` is unset.
   Static UI copy is different — that belongs in the i18n dictionaries.
4. **Every user-facing string goes through the dictionaries**, and a new key
   must be added to **both** `en.json` and `vi.json`. `en.json` defines the
   `Dictionary` type; `vi.json` mirrors it.
5. **Use `LocaleLink`, never `next/link`**, for internal navigation. For
   non-link hrefs use `localizedHref(locale, path)`.
6. `src/proxy.ts` must keep a **named** `export function proxy` — Next 16
   silently ignores a default export, which would disable locale detection.
7. The browser must not call the content backend directly. Client-side reads go
   through `/api/*` (`src/content/client.ts` → `src/app/api/[[...route]]/route.ts`),
   so upstream URLs and credentials stay server-side.
8. Don't remove `turbopack.root` / `outputFileTracingRoot` from
   `next.config.ts`, or the vecura clone's lockfile breaks root inference.

## Adding things

**A new page**: create `src/app/[lang]/<route>/page.tsx`, add a
`metadata.<key>` entry to both dictionaries, export `generateMetadata` using
`pageMetadata(lang, "<key>", "/<route>")`, wrap the tree in
`<SignupFlowProvider>` with `<Navbar />` / `<Footer />`, and add the route to
`src/app/sitemap.ts` (and `llms.txt/route.ts` if it belongs there).

**A new section**: compose it from `Container` and `WindowChrome`/`AppWindow`,
read its copy from a `useTranslations("<namespace>")` namespace, and keep
non-textual data (status flags, coordinates, chart values) in code beside the
component with a comment saying it is merged into the dictionary text by index.

**A new locale**: add it to `src/i18n/config.ts` + `localeLabels`, add the
dictionary and its loader in `dictionaries.ts`, update `LOCALE_PATTERN` in
`next.config.ts`, and check the font subsets in `src/app/[lang]/layout.tsx`.

## Things that will bite you

- Effects that call `setState` synchronously fail lint. Derive during render,
  or read external state with `useSyncExternalStore` (see `ThemeContext`).
- Anything theme-dependent that renders differently on server and client will
  mismatch on hydration under the `system` preference. Swap with the `dark:`
  variant instead of a `mounted` flag.
- Space Grotesk has no Vietnamese subset; `globals.css` routes `--font-heading`
  back to Inter under `html[lang="vi"]`. Don't undo that.
- Satori (OG images) ships no Vietnamese glyphs — `og-image.tsx` fetches the
  exact subset it needs from Google Fonts. Don't drop that fetch.
