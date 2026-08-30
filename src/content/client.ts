import type { Announcement, CatalogueResult } from "@/content/types";

/**
 * Browser-side reads. They go to this site's own `/api/*` routes, which resolve
 * through `src/content/*` on the server — so the client never needs to know
 * whether the answer came from a fixture or from the content backend, and no
 * upstream URL or credential reaches the bundle.
 */

export async function fetchAnnouncementClient(
  locale: string,
): Promise<Announcement> {
  const res = await fetch(`/api/announcement?locale=${locale}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Announcement request failed: ${res.status}`);
  return (await res.json()) as Announcement;
}

export async function fetchCatalogueClient({
  locale,
  search,
  page,
  signal,
}: {
  locale: string;
  search?: string;
  page: number;
  signal?: AbortSignal;
}): Promise<CatalogueResult> {
  const params = new URLSearchParams({ locale, page: String(page) });
  const trimmed = search?.trim();
  if (trimmed) params.set("search", trimmed);

  const res = await fetch(`/api/catalogue?${params.toString()}`, {
    headers: { accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Catalogue request failed: ${res.status}`);
  return (await res.json()) as CatalogueResult;
}

export async function fetchSiteMetadataClient(key: string): Promise<string | null> {
  const res = await fetch(`/api/site-metadata/${encodeURIComponent(key)}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Site metadata request failed: ${res.status}`);
  const data = (await res.json()) as { value?: unknown };
  return typeof data.value === "string" ? data.value : null;
}
