export const SITE_NAME = "Ragenta";

// Every canonical, hreflang and OG URL is built from this, so a plausible but
// wrong value indexes the site under a host nobody owns. There is no production
// domain yet — staging is the only live environment and sets SITE_URL itself —
// so the fallback is the local one. An environment that forgets to set it then
// produces obviously broken URLs rather than quietly convincing ones.
export const SITE_URL =
  process.env.SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const CONTENT_REVALIDATE_SECONDS = 300;

export const DEFAULT_SEO = {
  title: "Ragenta | AI Agents and RAG Chat on Your Own Knowledge",
  description:
    "Ragenta turns your documents, apps and databases into a grounded knowledge base, then puts AI agents on top of it. Answers with citations, no AI infrastructure to build.",
};

export const DEFAULT_OG_IMAGE = {
  url: "/en/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Ragenta — AI agents and RAG chat on your own knowledge",
};

/** Official profiles — the `sameAs` cluster for the Organization entity. */
export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/ragenta",
  "https://x.com/ragenta_ai",
  "https://github.com/ragenta",
];
