import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { PostDetail } from "@/components/blog/PostDetail";
import { JsonLd } from "@/components/JsonLd";
import {
  blogPostingNode,
  breadcrumbListNode,
  jsonLdGraph,
} from "@/lib/structured-data";
import { getAllPosts, getPost, getRelatedPosts } from "@/content/posts";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (lang) => {
      const posts = await getAllPosts(lang);
      return posts.map((post) => ({ lang, slug: post.slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? "";
  const path = `/blog/${post.slug}`;
  const ogImage = `/${lang}/opengraph-image`;

  return {
    title,
    description,
    alternates: hreflangAlternates(path, lang),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}${path}`,
      siteName: SITE_NAME,
      type: "article",
      locale: lang,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);
  if (!post) notFound();

  const [dict, related] = await Promise.all([
    getDictionary(lang),
    getRelatedPosts(lang, post),
  ]);

  const structuredData = jsonLdGraph(
    blogPostingNode({
      title: post.title,
      description: post.seoDescription ?? post.excerpt ?? "",
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      imageUrl: post.heroImageUrl,
    }),
    breadcrumbListNode(lang, [
      { name: dict.footer.blog, path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  );

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd data={structuredData} />
        <Navbar />
        <PostDetail
          post={post}
          related={related}
          lang={lang}
          t={dict.blogIndex}
        />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
