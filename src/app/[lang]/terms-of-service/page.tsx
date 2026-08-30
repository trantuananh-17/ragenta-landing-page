import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { getDictionary } from "@/i18n/dictionaries";
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
  const dict = await getDictionary(lang);
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbListNode(lang, [
            { name: dict.footer.termsOfService, path: "/terms-of-service" },
          ]),
        )}
      />
      <LegalDocumentPage slug="terms-of-service" lang={lang} />
    </>
  );
}
