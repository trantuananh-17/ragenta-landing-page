import "server-only";
import { fromApi } from "@/content/source";

/**
 * Small admin-editable values that are not worth a dedicated endpoint each:
 * the community invite link, the status-page URL, and so on.
 */
const LOCAL_METADATA: Record<string, string> = {
  community_url: "https://discord.gg/ragenta",
  status_url: "https://status.ragenta.ai",
  docs_url: "https://docs.ragenta.ai",
};

export type SiteMetadataKey = keyof typeof LOCAL_METADATA;

export async function fetchSiteMetadata(key: string): Promise<string | null> {
  const remote = await fromApi<{ value?: unknown }>(
    `/v1/public/site-metadata/${encodeURIComponent(key)}`,
  );
  if (typeof remote?.value === "string" && remote.value.length > 0) {
    return remote.value;
  }
  return LOCAL_METADATA[key] ?? null;
}
