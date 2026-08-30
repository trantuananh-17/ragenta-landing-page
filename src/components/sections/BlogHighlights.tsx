import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { getPostPage } from "@/content/posts";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import type { Locale } from "@/i18n/config";

/**
 * Server component: reads through the content layer directly rather than going
 * back out through `/api`, the same way vecura's home page pulls its listings.
 * Renders nothing when there is no content, so a missing backend leaves a clean
 * page rather than an empty heading.
 */
export async function BlogHighlights({ lang }: { lang: Locale }) {
  const [dict, page] = await Promise.all([
    getDictionary(lang),
    getPostPage({ locale: lang, limit: 3 }),
  ]);

  if (page.items.length === 0) return null;

  const t = dict.home.blogHighlights;

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.title}
          </h2>
          <Link
            href={localizedHref(lang, "/blog")}
            className="shrink-0 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {page.items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              lang={lang}
              readingTimeLabel={dict.blogIndex.readingTime.replace(
                "{count}",
                String(post.readingMinutes),
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
