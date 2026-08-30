import { getAllPosts } from "@/content/posts";
import { CONTENT_REVALIDATE_SECONDS, DEFAULT_SEO, SITE_NAME, SITE_URL } from "@/lib/site";
import { defaultLocale } from "@/i18n/config";

// Rendered per request so absolute URLs reflect the runtime SITE_URL.
export const dynamic = "force-dynamic";

export async function GET() {
  let postLinks = "";
  try {
    const posts = await getAllPosts(defaultLocale);
    postLinks = posts
      .map(
        (post) =>
          `- [${post.title}](${SITE_URL}/${defaultLocale}/blog/${post.slug})`,
      )
      .join("\n");
  } catch (error) {
    console.error("[llms.txt] Failed to load posts.", error);
  }

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${DEFAULT_SEO.description}`,
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/${defaultLocale})`,
    `- [Product](${SITE_URL}/${defaultLocale}/product)`,
    `- [Solutions](${SITE_URL}/${defaultLocale}/solutions)`,
    `- [Pricing](${SITE_URL}/${defaultLocale}/pricing)`,
    `- [Changelog](${SITE_URL}/${defaultLocale}/changelog)`,
    `- [Blog](${SITE_URL}/${defaultLocale}/blog)`,
    "",
    "## Articles",
    "",
    postLinks || `- Articles are listed at ${SITE_URL}/${defaultLocale}/blog.`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, s-maxage=${CONTENT_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
