import "server-only";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { CATALOGUE_SEED } from "@/content/fixtures/catalogue";
import { fromApi } from "@/content/source";
import type {
  CatalogueItem,
  CatalogueItemDetail,
  CatalogueResult,
  CatalogueSpec,
} from "@/content/types";

export const CATALOGUE_PAGE_SIZE = 12;

/**
 * The API caps a page at 100. Asked for on the routes that need the whole list
 * at once — the index page's tag filter and the sitemap — rather than paging
 * through it, because the catalogue is a curated list of dozens, not thousands.
 */
export const CATALOGUE_MAX_PAGE_SIZE = 100;

type RawItem = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  tags?: unknown;
  featured?: unknown;
};

type RawDetail = RawItem & {
  body?: unknown;
  specs?: unknown;
  related?: unknown;
};

type RawResponse = {
  data?: unknown;
  pagination?: { total?: unknown; page?: unknown; totalPages?: unknown };
};

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (typeof value === "string") {
    return value
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseSpecs(value: unknown): CatalogueSpec[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const spec = entry as Record<string, unknown>;
    if (typeof spec?.label !== "string" || typeof spec?.value !== "string") {
      return [];
    }
    return [{ label: spec.label, value: spec.value }];
  });
}

function normalizeItem(raw: RawItem): CatalogueItem | null {
  if (typeof raw.id !== "string" || typeof raw.name !== "string") return null;
  return {
    id: raw.id,
    name: raw.name,
    desc: typeof raw.description === "string" ? raw.description : "",
    tags: parseTags(raw.tags),
    featured: raw.featured === true,
  };
}

function normalizeDetail(raw: RawDetail): CatalogueItemDetail | null {
  const item = normalizeItem(raw);
  if (!item) return null;
  return {
    ...item,
    body: typeof raw.body === "string" ? raw.body : "",
    specs: parseSpecs(raw.specs),
    related: Array.isArray(raw.related)
      ? raw.related.flatMap((entry) => {
          const related = normalizeItem(entry as RawItem);
          return related ? [related] : [];
        })
      : [],
  };
}

function normalizeResponse(body: RawResponse): CatalogueResult | null {
  if (!Array.isArray(body?.data)) return null;
  const pagination = body.pagination;
  if (
    typeof pagination?.total !== "number" ||
    typeof pagination?.page !== "number" ||
    typeof pagination?.totalPages !== "number"
  ) {
    return null;
  }
  return {
    items: body.data
      .map((entry) => normalizeItem(entry as RawItem))
      .filter((item): item is CatalogueItem => item !== null),
    total: pagination.total,
    totalPages: pagination.totalPages,
    page: pagination.page,
  };
}

function seedToItem(
  seed: (typeof CATALOGUE_SEED)[number],
  locale: Locale,
): CatalogueItem {
  return {
    id: seed.slug,
    name: seed.name,
    desc: seed.desc[locale],
    tags: seed.tags[locale],
    featured: seed.featured,
  };
}

/** Featured items first, then seed order — the same ordering the API uses. */
function localCatalogue(
  locale: Locale,
  search: string | undefined,
  page: number,
  limit: number,
): CatalogueResult {
  const query = search?.trim().toLowerCase() ?? "";

  const all = CATALOGUE_SEED.map((seed) => seedToItem(seed, locale));

  const matched = query
    ? all.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    : all;

  const ordered = [
    ...matched.filter((item) => item.featured),
    ...matched.filter((item) => !item.featured),
  ];

  const total = ordered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * limit;

  return {
    items: ordered.slice(offset, offset + limit),
    total,
    totalPages,
    page: safePage,
  };
}

function localCatalogueItem(
  locale: Locale,
  slug: string,
): CatalogueItemDetail | null {
  const seed = CATALOGUE_SEED.find((entry) => entry.slug === slug);
  if (!seed) return null;

  const groupTag = seed.tags[defaultLocale][0];
  const related = CATALOGUE_SEED.filter(
    (entry) =>
      entry.slug !== seed.slug &&
      groupTag !== undefined &&
      entry.tags[defaultLocale].includes(groupTag),
  ).slice(0, 3);

  return {
    ...seedToItem(seed, locale),
    body: seed.body[locale],
    specs: seed.specs[locale],
    related: related.map((entry) => seedToItem(entry, locale)),
  };
}

/**
 * The models, agent tools and connectors shown in the "Models and tools"
 * section, listed on `/catalogue`, and searched from the browser through
 * `/api/catalogue`.
 */
export async function fetchCatalogue({
  locale,
  search,
  page = 1,
  limit = CATALOGUE_PAGE_SIZE,
}: {
  locale: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CatalogueResult> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  const remote = await fromApi<RawResponse>("/v1/public/catalogue", {
    locale: safeLocale,
    search,
    page,
    limit,
  });
  const normalized = remote ? normalizeResponse(remote) : null;

  return normalized ?? localCatalogue(safeLocale, search, page, limit);
}

/**
 * One catalogue item, or `null` when there is no such slug.
 *
 * `null` here is a 404, not a degradation: the fixtures answer for a slug they
 * carry, so a missing item means the URL is wrong rather than that the backend
 * is down.
 */
export async function fetchCatalogueItem({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}): Promise<CatalogueItemDetail | null> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  const remote = await fromApi<RawDetail>(
    `/v1/public/catalogue/${encodeURIComponent(slug)}`,
    { locale: safeLocale },
  );
  const normalized = remote ? normalizeDetail(remote) : null;

  return normalized ?? localCatalogueItem(safeLocale, slug);
}
