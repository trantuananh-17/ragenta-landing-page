import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import { CatalogueList } from "@/components/catalogue/CatalogueList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { CATALOGUE_MAX_PAGE_SIZE, fetchCatalogue } from "@/content/catalogue";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo";

export const revalidate = 300;

const BASE_PATH = "/catalogue";

type SearchParams = {
  search?: string | string[];
  tag?: string | string[];
};

function firstParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const { lang } = await params;
  const resolved = await searchParams;
  const dict = await getDictionary(lang);
  const seo = dict.metadata.catalogue;

  // A filtered view is a thin duplicate of the full list — reachable and
  // linkable, but kept out of the index and out of the hreflang cluster.
  if (firstParam(resolved?.search) || firstParam(resolved?.tag)) {
    return {
      title: seo.title,
      description: seo.description,
      robots: { index: false, follow: true },
    };
  }

  const ogImage = `/${lang}/opengraph-image`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: hreflangAlternates(BASE_PATH, lang),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/${lang}${BASE_PATH}`,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}

export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<SearchParams>;
}) {
  const { lang } = await params;
  const resolved = await searchParams;
  const searchQuery = firstParam(resolved?.search);
  const tagQuery = firstParam(resolved?.tag);
  const dict = await getDictionary(lang);

  // One request for the whole catalogue: the tag list has to be derived from
  // every item, not from the page the reader happens to be on.
  const result = await fetchCatalogue({
    locale: lang,
    search: searchQuery || undefined,
    limit: CATALOGUE_MAX_PAGE_SIZE,
  });

  const tags = Array.from(
    new Set(result.items.flatMap((item) => item.tags)),
  ).sort((a, b) => a.localeCompare(b, lang));

  const activeTag = tags.includes(tagQuery) ? tagQuery : null;
  const items = activeTag
    ? result.items.filter((item) => item.tags.includes(activeTag))
    : result.items;

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd
          data={jsonLdGraph(
            breadcrumbListNode(lang, [
              { name: dict.catalogue.eyebrow, path: BASE_PATH },
            ]),
          )}
        />
        <Navbar />
        <CatalogueHero />
        <CatalogueList
          items={items}
          tags={tags}
          activeTag={activeTag}
          searchQuery={searchQuery}
          lang={lang}
          t={dict.catalogue}
        />
        <FinalCTA />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
