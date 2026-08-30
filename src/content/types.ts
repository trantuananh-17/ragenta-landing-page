/**
 * Shapes returned by the content layer. They are deliberately written as the
 * shape the future HTTP API will return, not as the shape the local fixtures
 * happen to have — so switching `src/content/source.ts` to the real backend
 * changes no component and no page.
 */

export type CatalogueItem = {
  /** `null` while served locally: cards without an id are not clickable. */
  id: string | null;
  name: string;
  desc: string;
  tags: string[];
  featured: boolean;
};

export type CatalogueResult = {
  items: CatalogueItem[];
  total: number;
  totalPages: number;
  page: number;
};

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  heroImageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
};

export type Post = PostSummary & {
  bodyMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PostListResult = {
  items: PostSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type ChangelogEntryType =
  | "Release"
  | "Model"
  | "Integration"
  | "Improvement"
  | "Fix";

export type ChangelogSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type ChangelogEntry = {
  id: string;
  /** ISO date. Formatted for display in the component, per locale. */
  date: string;
  version: string | null;
  type: ChangelogEntryType;
  title: string;
  excerpt: string;
  bullets?: string[];
  sections?: ChangelogSection[];
};

export type Announcement = {
  enabled: boolean;
  badge: string;
  full: string;
  short: string;
  href: string;
  /** Bumps when the content changes; used to re-show a dismissed bar. */
  version: string;
};

export type LegalDocument = {
  slug: "privacy-policy" | "terms-of-service";
  title: string;
  updatedAt: string;
  bodyMd: string;
};
