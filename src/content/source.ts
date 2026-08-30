import "server-only";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/site";

/**
 * The single seam between "content we ship in the repo" and "content a backend
 * serves".
 *
 * Ragenta has no content backend yet, so every fetcher in `src/content/*`
 * currently resolves from the fixtures under `src/content/fixtures/`. They are
 * still written as async functions returning API-shaped payloads, and every
 * page and API route already goes through them.
 *
 * To go live: set `RAGENTA_CONTENT_API_URL`. `fromApi` then answers, the
 * fixtures become the graceful-degradation path, and nothing else changes.
 */
export function contentApiBase(): string | null {
  const url = process.env.RAGENTA_CONTENT_API_URL;
  if (!url) return null;
  return url.replace(/\/$/, "");
}

export function isContentApiEnabled(): boolean {
  return contentApiBase() !== null;
}

/**
 * GET a JSON payload from the content API.
 *
 * Returns `null` — never throws — when the API is not configured, is
 * unreachable, or answers with a non-2xx. Callers fall back to the local
 * fixtures on `null`, which is what keeps every page rendering while the
 * backend is missing or down.
 */
export async function fromApi<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T | null> {
  const base = contentApiBase();
  if (!base) return null;

  const url = new URL(`${base}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: CONTENT_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`[content] ${path} answered ${response.status}.`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[content] ${path} request failed.`, error);
    return null;
  }
}
