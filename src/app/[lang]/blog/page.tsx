import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { BlogHero } from "@/components/blog/BlogHero";
import { PostList } from "@/components/blog/PostList";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { getPostPage, POSTS_PAGE_SIZE } from "@/content/posts";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo";

export const revalidate = 300;

const BASE_PATH = "/blog";

type SearchParams = {
  page?: string | string[];
  search?: string | string[];
};

function getCurrentPage(pageParam: string | string[] | undefined): number {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function getSearchQuery(searchParam: string | string[] | undefined): string {
  const value = Array.isArray(searchParam) ? searchParam[0] : searchParam;
  return value?.trim() ?? "";
}

function pageHref(page: number, searchQuery: string): string {
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
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
  const currentPage = getCurrentPage(resolved?.page);
  const searchQuery = getSearchQuery(resolved?.search);
  const dict = await getDictionary(lang);
  const seo = dict.metadata.blog;

  // Search-filtered listings are thin, duplicate views — keep them out of the
  // index (and the hreflang cluster) rather than emit conflicting tags.
  if (searchQuery) {
    return {
      title: seo.title,
      description: seo.description,
      robots: { index: false, follow: true },
    };
  }

  const pageSuffix = currentPage > 1 ? `?page=${currentPage}` : "";
  const ogImage = `/${lang}/opengraph-image`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: hreflangAlternates(BASE_PATH, lang, currentPage),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/${lang}${BASE_PATH}${pageSuffix}`,
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

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<SearchParams>;
}) {
  const { lang } = await params;
  const resolved = await searchParams;
  const currentPage = getCurrentPage(resolved?.page);
  const searchQuery = getSearchQuery(resolved?.search);
  const dict = await getDictionary(lang);

  const result = await getPostPage({
    locale: lang,
    limit: POSTS_PAGE_SIZE,
    offset: (currentPage - 1) * POSTS_PAGE_SIZE,
    search: searchQuery,
  });

  // A page number past the end (a stale link, a shrunken feed) lands on the
  // last real page rather than an empty grid.
  if (currentPage > 1 && result.items.length === 0 && result.total > 0) {
    redirect(pageHref(Math.ceil(result.total / POSTS_PAGE_SIZE), searchQuery));
  }

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd
          data={jsonLdGraph(
            breadcrumbListNode(lang, [
              { name: dict.footer.blog, path: BASE_PATH },
            ]),
          )}
        />
        <Navbar />
        <BlogHero />
        <section className="pb-16 md:pb-24">
          <Container>
            <PostList
              result={result}
              pageSize={POSTS_PAGE_SIZE}
              searchQuery={searchQuery}
              lang={lang}
              t={dict.blogIndex}
            />
          </Container>
        </section>
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
