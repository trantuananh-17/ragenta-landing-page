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
    pageMetadata(lang, "privacy", "/privacy-policy"),
  );
}

export default async function PrivacyPolicyPage({
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
            { name: dict.footer.privacyPolicy, path: "/privacy-policy" },
          ]),
        )}
      />
      <LegalDocumentPage slug="privacy-policy" lang={lang} />
    </>
  );
}
