import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og-image";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const dict = await getDictionary(locale);
  return renderOgImage({ title: dict.metadata.ogTitle });
}
