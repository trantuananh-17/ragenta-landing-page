import "server-only";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { CATALOGUE_SEED } from "@/content/fixtures/catalogue";
import { fromApi } from "@/content/source";
import type { CatalogueItem, CatalogueResult } from "@/content/types";

export const CATALOGUE_PAGE_SIZE = 12;

type RawItem = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  tags?: unknown;
  featured?: unknown;
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

/** Featured items first, then seed order — the same ordering the API will use. */
function localCatalogue(
  locale: Locale,
  search: string | undefined,
  page: number,
): CatalogueResult {
  const query = search?.trim().toLowerCase() ?? "";

  const all: CatalogueItem[] = CATALOGUE_SEED.map((seed) => ({
    id: null,
    name: seed.name,
    desc: seed.desc[locale],
    tags: seed.tags[locale],
    featured: seed.featured,
  }));

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
  const totalPages = Math.max(1, Math.ceil(total / CATALOGUE_PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * CATALOGUE_PAGE_SIZE;

  return {
    items: ordered.slice(offset, offset + CATALOGUE_PAGE_SIZE),
    total,
    totalPages,
    page: safePage,
  };
}

/**
 * The models, agent tools and connectors shown in the "Models and tools"
 * section and searched from the browser through `/api/catalogue`.
 */
export async function fetchCatalogue({
  locale,
  search,
  page = 1,
}: {
  locale: string;
  search?: string;
  page?: number;
}): Promise<CatalogueResult> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  const remote = await fromApi<RawResponse>("/v1/public/catalogue", {
    locale: safeLocale,
    search,
    page,
    limit: CATALOGUE_PAGE_SIZE,
  });
  const normalized = remote ? normalizeResponse(remote) : null;

  return normalized ?? localCatalogue(safeLocale, search, page);
}
