export const SITE_NAME = "Ragenta";

export const SITE_URL =
  process.env.SITE_URL?.replace(/\/$/, "") ?? "https://ragenta.ai";

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
