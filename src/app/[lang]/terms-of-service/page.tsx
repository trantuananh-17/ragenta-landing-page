import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) =>
    pageMetadata(lang, "terms", "/terms-of-service"),
  );
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <LegalDocumentPage slug="terms-of-service" lang={lang} />;
}
