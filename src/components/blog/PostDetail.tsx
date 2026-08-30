import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/Markdown";
import { PostCard } from "@/components/blog/PostCard";
import { CtaButtons } from "@/components/sections/CtaButtons";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/i18n/links";
import { formatDate } from "@/lib/format";
import type { Post, PostSummary } from "@/content/types";

export function PostDetail({
  post,
  related,
  lang,
  t,
}: {
  post: Post;
  related: PostSummary[];
  lang: Locale;
  t: Dictionary["blogIndex"];
}) {
  const readingTimeLabel = t.readingTime.replace(
    "{count}",
    String(post.readingMinutes),
  );

  return (
    <>
      <article className="pt-32 pb-16">
        <Container width="narrow">
          <Link
            href={localizedHref(lang, "/blog")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.backToBlog}
          </Link>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mb-4 text-3xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>

          <div className="mb-10 flex items-center gap-2 font-mono text-xs text-ink-faint">
            {post.publishedAt && <span>{formatDate(post.publishedAt, lang)}</span>}
            <span className="text-ink-ghost">·</span>
            <span>{readingTimeLabel}</span>
          </div>

          <Markdown>{post.bodyMd}</Markdown>
        </Container>
      </article>

      <section className="pb-16">
        <Container width="narrow">
          <div className="rounded-2xl bg-card p-8 text-center md:p-10">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-ink">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mb-7 max-w-md text-ink-subtle">{t.ctaBody}</p>
            <CtaButtons location="blog_post_cta" />
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="pb-24">
          <Container>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
              {t.relatedPostsTitle}
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <PostCard
                  key={item.id}
                  post={item}
                  lang={lang}
                  readingTimeLabel={t.readingTime.replace(
                    "{count}",
                    String(item.readingMinutes),
                  )}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
