import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { CatalogueDetail } from "@/components/catalogue/CatalogueDetail";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { fetchCatalogueItem } from "@/content/catalogue";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const item = await fetchCatalogueItem({ locale: lang, slug });
  if (!item) return {};

  const dict = await getDictionary(lang);
  const title = dict.catalogue.detailTitle.replace("{name}", item.name);
  const path = `/catalogue/${slug}`;
  const ogImage = `/${lang}/opengraph-image`;

  return {
    title,
    description: item.desc,
    alternates: hreflangAlternates(path, lang),
    openGraph: {
      title,
      description: item.desc,
      url: `${SITE_URL}/${lang}${path}`,
      siteName: SITE_NAME,
      type: "website",
      locale: lang,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: item.desc,
      images: [ogImage],
    },
  };
}

export default async function CatalogueItemPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const item = await fetchCatalogueItem({ locale: lang, slug });
  if (!item) notFound();

  const dict = await getDictionary(lang);

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd
          data={jsonLdGraph(
            breadcrumbListNode(lang, [
              { name: dict.catalogue.eyebrow, path: "/catalogue" },
              { name: item.name, path: `/catalogue/${slug}` },
            ]),
          )}
        />
        <Navbar />
        <CatalogueDetail item={item} lang={lang} t={dict.catalogue} />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
