import "server-only";
import { cache } from "react";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { POST_SEED, type PostSeed } from "@/content/fixtures/posts";
import { fromApi } from "@/content/source";
import type { Post, PostListResult, PostSummary } from "@/content/types";

export const POSTS_PAGE_SIZE = 9;

function summaryFromSeed(seed: PostSeed, locale: Locale): PostSummary {
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title[locale],
    excerpt: seed.excerpt[locale],
    heroImageUrl: null,
    tags: seed.tags[locale],
    publishedAt: seed.publishedAt,
    updatedAt: seed.updatedAt,
    readingMinutes: seed.readingMinutes,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Anything malformed is rejected rather than half-rendered — the caller
 * degrades to the local fixtures, which is better than a page of empty cards.
 */
function normalizeSummary(value: unknown): PostSummary | null {
  const item = value as Record<string, unknown>;
  if (
    typeof item?.id !== "string" ||
    typeof item?.slug !== "string" ||
    typeof item?.title !== "string" ||
    typeof item?.updatedAt !== "string"
  ) {
    return null;
  }
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: typeof item.excerpt === "string" ? item.excerpt : null,
    heroImageUrl:
      typeof item.heroImageUrl === "string" && item.heroImageUrl
        ? item.heroImageUrl
        : null,
    tags: isStringArray(item.tags) ? item.tags : [],
    publishedAt: typeof item.publishedAt === "string" ? item.publishedAt : null,
    updatedAt: item.updatedAt,
    readingMinutes:
      typeof item.readingMinutes === "number" ? item.readingMinutes : 5,
  };
}

function normalizeList(value: unknown): PostListResult | null {
  const data = value as Record<string, unknown>;
  if (
    !Array.isArray(data?.items) ||
    typeof data?.total !== "number" ||
    typeof data?.limit !== "number" ||
    typeof data?.offset !== "number"
  ) {
    return null;
  }
  const items = data.items.map(normalizeSummary);
  if (items.some((item) => item === null)) return null;
  return {
    items: items as PostSummary[],
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

function normalizePost(value: unknown): Post | null {
  const data = value as Record<string, unknown>;
  const summary = normalizeSummary(data);
  if (!summary || typeof data.bodyMd !== "string") return null;
  return {
    ...summary,
    bodyMd: data.bodyMd,
    seoTitle: typeof data.seoTitle === "string" ? data.seoTitle : null,
    seoDescription:
      typeof data.seoDescription === "string" ? data.seoDescription : null,
  };
}

/** Newest first, matching the ordering the API will apply. */
function sortedSeed(locale: Locale, search?: string): PostSummary[] {
  const query = search?.trim().toLowerCase() ?? "";
  return POST_SEED.map((seed) => summaryFromSeed(seed, locale))
    .filter(
      (post) =>
        !query ||
        post.title.toLowerCase().includes(query) ||
        (post.excerpt?.toLowerCase().includes(query) ?? false) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
    .sort((a, b) =>
      (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt),
    );
}

export async function getPostPage({
  locale,
  limit = POSTS_PAGE_SIZE,
  offset = 0,
  search,
}: {
  locale: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<PostListResult> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  const remote = await fromApi<unknown>("/v1/public/posts", {
    locale: safeLocale,
    limit,
    offset,
    search,
  });
  const normalized = remote ? normalizeList(remote) : null;
  if (normalized) return normalized;

  const all = sortedSeed(safeLocale, search);
  return {
    items: all.slice(offset, offset + limit),
    total: all.length,
    limit,
    offset,
  };
}

export const getAllPosts = cache(
  async (locale: string): Promise<PostSummary[]> => {
    const page = await getPostPage({ locale, limit: 100, offset: 0 });
    return page.items;
  },
);

export const getPost = cache(
  async (locale: string, slug: string): Promise<Post | null> => {
    const safeLocale = isLocale(locale) ? locale : defaultLocale;

    const remote = await fromApi<unknown>(
      `/v1/public/posts/${encodeURIComponent(slug)}`,
      { locale: safeLocale },
    );
    const normalized = remote ? normalizePost(remote) : null;
    if (normalized) return normalized;

    const seed = POST_SEED.find((entry) => entry.slug === slug);
    if (!seed) return null;
    return {
      ...summaryFromSeed(seed, safeLocale),
      bodyMd: seed.bodyMd[safeLocale],
      seoTitle: null,
      seoDescription: seed.excerpt[safeLocale],
    };
  },
);

/** Same-tag posts first, then most recent. Never includes `current`. */
export async function getRelatedPosts(
  locale: string,
  current: PostSummary,
  limit = 3,
): Promise<PostSummary[]> {
  const all = await getAllPosts(locale);
  const currentTags = new Set(current.tags);
  return all
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.post.publishedAt ?? b.post.updatedAt).localeCompare(
        a.post.publishedAt ?? a.post.updatedAt,
      );
    })
    .slice(0, limit)
    .map(({ post }) => post);
}
