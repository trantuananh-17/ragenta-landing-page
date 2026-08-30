import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/i18n/links";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/content/types";

export function PostCard({
  post,
  lang,
  readingTimeLabel,
}: {
  post: PostSummary;
  lang: Locale;
  /** Already interpolated, e.g. "7 min read". */
  readingTimeLabel: string;
}) {
  return (
    <Link
      href={localizedHref(lang, `/blog/${post.slug}`)}
      className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mb-2 text-lg leading-snug font-semibold text-ink transition-colors group-hover:text-brand-600">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-subtle">
          {post.excerpt}
        </p>
      )}

      <div className="flex items-center gap-2 font-mono text-[11px] text-ink-faint">
        {post.publishedAt && <span>{formatDate(post.publishedAt, lang)}</span>}
        <span className="text-ink-ghost">·</span>
        <span>{readingTimeLabel}</span>
      </div>
    </Link>
  );
}
