import { SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";
import type { Locale } from "@/i18n/config";

// Stable @id anchors so multiple schema nodes reference ONE entity (e.g. the
// WebSite's publisher points at the Organization) and search engines merge
// them into a single knowledge-graph node rather than duplicating.
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type SchemaNode = Record<string, unknown>;

/** Organization node — describes the brand behind the site. */
export function organizationNode(description: string): SchemaNode {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/ragenta-horizontal.svg`,
    },
    description,
    sameAs: SOCIAL_PROFILES,
  };
}

/** WebSite node — the site itself, published by the Organization. */
export function webSiteNode(locale: Locale): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** FAQPage node — question/answer pairs eligible for FAQ rich results. */
export function faqPageNode(
  items: { question: string; answer: string }[],
): SchemaNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** BlogPosting node — one article, attributed to the Organization. */
export function blogPostingNode(post: {
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  updatedAt: string;
  imageUrl: string | null;
}): SchemaNode {
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    url: post.url,
    datePublished: post.publishedAt ?? post.updatedAt,
    dateModified: post.updatedAt,
    ...(post.imageUrl ? { image: post.imageUrl } : {}),
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
  };
}

/**
 * Wrap one or more nodes in a single `@graph` document. Emitting related nodes
 * in one graph (rather than separate script tags) lets their `@id` cross-
 * references resolve within the same document.
 */
export function jsonLdGraph(...nodes: SchemaNode[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
