import "server-only";
import { defaultLocale, isLocale } from "@/i18n/config";
import { LEGAL_SEED } from "@/content/fixtures/legal";
import { fromApi } from "@/content/source";
import type { LegalDocument } from "@/content/types";

function normalize(
  slug: LegalDocument["slug"],
  raw: Record<string, unknown>,
): LegalDocument | null {
  if (typeof raw?.title !== "string" || typeof raw?.bodyMd !== "string") {
    return null;
  }
  return {
    slug,
    title: raw.title,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
    bodyMd: raw.bodyMd,
  };
}

export async function fetchLegalDocument(
  slug: LegalDocument["slug"],
  locale: string,
): Promise<LegalDocument> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  const remote = await fromApi<Record<string, unknown>>(
    `/v1/public/legal/${slug}`,
    { locale: safeLocale },
  );
  return (
    (remote ? normalize(slug, remote) : null) ?? LEGAL_SEED[slug][safeLocale]
  );
}
