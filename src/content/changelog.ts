import "server-only";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { CHANGELOG_SEED } from "@/content/fixtures/changelog";
import { fromApi } from "@/content/source";
import type { ChangelogEntry } from "@/content/types";

const ENTRY_TYPES = [
  "Release",
  "Model",
  "Integration",
  "Improvement",
  "Fix",
] as const;

function isEntryType(value: unknown): value is ChangelogEntry["type"] {
  return (ENTRY_TYPES as readonly unknown[]).includes(value);
}

function normalizeEntry(value: unknown): ChangelogEntry | null {
  const raw = value as Record<string, unknown>;
  if (
    typeof raw?.id !== "string" ||
    typeof raw?.date !== "string" ||
    typeof raw?.title !== "string" ||
    typeof raw?.excerpt !== "string" ||
    !isEntryType(raw?.type)
  ) {
    return null;
  }
  return {
    id: raw.id,
    date: raw.date,
    version: typeof raw.version === "string" ? raw.version : null,
    type: raw.type,
    title: raw.title,
    excerpt: raw.excerpt,
    bullets: Array.isArray(raw.bullets)
      ? raw.bullets.filter((b): b is string => typeof b === "string")
      : undefined,
    sections: Array.isArray(raw.sections)
      ? raw.sections.flatMap((section) => {
          const s = section as Record<string, unknown>;
          if (typeof s?.heading !== "string" || typeof s?.body !== "string") {
            return [];
          }
          return [
            {
              heading: s.heading,
              body: s.body,
              bullets: Array.isArray(s.bullets)
                ? s.bullets.filter((b): b is string => typeof b === "string")
                : undefined,
            },
          ];
        })
      : undefined,
  };
}

function localChangelog(locale: Locale): ChangelogEntry[] {
  return CHANGELOG_SEED.map((seed) => ({
    id: seed.id,
    date: seed.date,
    version: seed.version,
    type: seed.type,
    title: seed.title[locale],
    excerpt: seed.excerpt[locale],
    bullets: seed.bullets?.[locale],
    sections: seed.sections?.map((section) => ({
      heading: section.heading[locale],
      body: section.body[locale],
      bullets: section.bullets?.[locale],
    })),
  }));
}

/** Newest first. `limit` trims the list for the compact home/product strip. */
export async function fetchChangelog({
  locale,
  limit,
}: {
  locale: string;
  limit?: number;
}): Promise<ChangelogEntry[]> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  const remote = await fromApi<{ items?: unknown }>("/v1/public/changelog", {
    locale: safeLocale,
    limit,
  });
  const normalized = Array.isArray(remote?.items)
    ? remote.items.map(normalizeEntry)
    : null;

  const entries =
    normalized && !normalized.some((entry) => entry === null)
      ? (normalized as ChangelogEntry[])
      : localChangelog(safeLocale);

  return limit ? entries.slice(0, limit) : entries;
}
