import { SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";
import type { Locale } from "@/i18n/config";

// Stable @id anchors so multiple schema nodes reference ONE entity (e.g. the
// WebSite's publisher points at the Organization) and search engines merge
// them into a single knowledge-graph node rather than duplicating.
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;

// Every plan is quoted in USD in both locales — only the symbol's position
// changes — so the currency is a constant rather than a per-locale value.
const PRICE_CURRENCY = "USD";

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
 * SoftwareApplication node — the product itself, carrying one Offer per plan
 * with a published price. Deliberately no aggregateRating: the site shows
 * testimonials but collects no ratings, and a rating asserted in markup that
 * nothing on the page backs up is what Google issues manual actions over.
 */
export function softwareApplicationNode(input: {
  locale: Locale;
  description: string;
  plans: { name: string; monthlyPrice: number }[];
}): SchemaNode {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: input.description,
    publisher: { "@id": ORG_ID },
    offers: input.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.monthlyPrice,
      priceCurrency: PRICE_CURRENCY,
      category: "subscription",
      url: `${SITE_URL}/${input.locale}/pricing`,
    })),
  };
}

/**
 * BreadcrumbList node — the trail a result can show in place of the raw URL.
 * The home crumb is prepended here so every page emits the same first item, and
 * the current page stays in the list: Google expects the full path including
 * the page itself, not just its ancestors.
 */
export function breadcrumbListNode(
  locale: Locale,
  trail: { name: string; path: string }[],
): SchemaNode {
  const crumbs = [{ name: SITE_NAME, path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}/${locale}${crumb.path === "/" ? "" : crumb.path}`,
    })),
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
