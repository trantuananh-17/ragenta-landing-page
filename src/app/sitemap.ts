import type { MetadataRoute } from "next";
import { CATALOGUE_MAX_PAGE_SIZE, fetchCatalogue } from "@/content/catalogue";
import { getAllPosts } from "@/content/posts";
import { SITE_URL } from "@/lib/site";
import { locales, defaultLocale } from "@/i18n/config";

// Rendered per request so absolute URLs reflect the runtime SITE_URL rather
// than a value frozen at build (same image, different environments).
export const dynamic = "force-dynamic";

/** hreflang alternates map for an un-prefixed path. */
function languagesFor(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${clean}`;
  }
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${clean}`;
  return languages;
}

/** One entry per locale for a given path, each carrying the alternates. */
function entriesForPath(
  path: string,
  opts: {
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  },
): MetadataRoute.Sitemap {
  const clean = path === "/" ? "" : path;
  const languages = languagesFor(path);
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${clean}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    ...entriesForPath("/", { lastModified: now, changeFrequency: "monthly", priority: 1 }),
    ...entriesForPath("/product", { lastModified: now, changeFrequency: "monthly", priority: 0.9 }),
    ...entriesForPath("/solutions", { lastModified: now, changeFrequency: "monthly", priority: 0.9 }),
    ...entriesForPath("/pricing", { lastModified: now, changeFrequency: "monthly", priority: 0.9 }),
    ...entriesForPath("/blog", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    ...entriesForPath("/catalogue", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    ...entriesForPath("/changelog", { lastModified: now, changeFrequency: "weekly", priority: 0.6 }),
    ...entriesForPath("/contact", { lastModified: now, changeFrequency: "monthly", priority: 0.7 }),
    ...entriesForPath("/privacy-policy", { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
    ...entriesForPath("/terms-of-service", { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
  ];

  // Slugs are shared across locales, so listing the default locale's posts and
  // expanding each into every locale keeps the hreflang cluster complete.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts(defaultLocale);
    postRoutes = posts.flatMap((post) =>
      entriesForPath(`/blog/${post.slug}`, {
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );
  } catch (error) {
    console.error("[sitemap] Failed to load posts.", error);
  }

  // Slugs are shared across locales here too — an item's id is its slug, not a
  // translated name — so one locale's listing expands into the full cluster.
  let catalogueRoutes: MetadataRoute.Sitemap = [];
  try {
    const catalogue = await fetchCatalogue({
      locale: defaultLocale,
      limit: CATALOGUE_MAX_PAGE_SIZE,
    });
    catalogueRoutes = catalogue.items.flatMap((item) =>
      item.id
        ? entriesForPath(`/catalogue/${item.id}`, {
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
          })
        : [],
    );
  } catch (error) {
    console.error("[sitemap] Failed to load the catalogue.", error);
  }

  return [...staticRoutes, ...postRoutes, ...catalogueRoutes];
}
