import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";

/**
 * Build canonical + hreflang alternates for a locale-prefixed path.
 *
 *   hreflangAlternates("/pricing", "vi")
 *     canonical: https://ragenta.cloud/vi/pricing   (self-referencing)
 *     languages: { en, vi, x-default }
 *
 * The canonical is self-referencing per locale: each language version is
 * canonical for itself, with the locales tied together by the hreflang cluster.
 * This is required so the sitemap (which lists every locale) only contains
 * canonical URLs, and so /vi pages are indexable in their own language rather
 * than being collapsed into /en.
 *
 * For paginated listings, pass the 1-based `page`: pages beyond the first get a
 * `?page=N` suffix on both the canonical and every hreflang URL, so each
 * paginated page self-canonicalizes and self-references in hreflang (rather
 * than collapsing onto page 1, which Google flags as a hreflang/canonical
 * conflict now that rel=next/prev is deprecated).
 *
 * `path` is the un-prefixed route (use "/" for the home page).
 */
export function hreflangAlternates(
  path: string,
  locale: Locale,
  page?: number,
): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  const query = page && page > 1 ? `?page=${page}` : "";
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${clean}${query}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${clean}${query}`;

  return {
    canonical: `${SITE_URL}/${locale}${clean}${query}`,
    languages,
  };
}

/**
 * Build locale-aware Metadata for a page from a `metadata.<pageKey>` dictionary
 * entry, including hreflang alternates, OpenGraph, and Twitter.
 * `path` is the un-prefixed route (e.g. "/pricing", or "/" for home).
 */
export async function pageMetadata(
  lang: Locale,
  pageKey: Exclude<keyof Dictionary["metadata"], "ogTitle">,
  path: string,
): Promise<Metadata> {
  const dict = await getDictionary(lang);
  const seo = dict.metadata[pageKey];
  const clean = path === "/" ? "" : path;
  const ogImageUrl = `/${lang}/opengraph-image`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: hreflangAlternates(path, lang),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/${lang}${clean}`,
      type: "website",
      locale: lang,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImageUrl],
    },
  };
}
