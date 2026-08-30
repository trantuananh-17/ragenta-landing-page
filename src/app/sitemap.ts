import type { MetadataRoute } from "next";
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

  return [...staticRoutes, ...postRoutes];
}
