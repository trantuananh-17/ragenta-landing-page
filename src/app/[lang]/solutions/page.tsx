import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { SolutionsScrollDemo } from "@/components/solutions/SolutionsScrollDemo";
import { SolutionsClosing } from "@/components/solutions/SolutionsClosing";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogHighlights } from "@/components/sections/BlogHighlights";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) =>
    pageMetadata(lang, "solutions", "/solutions"),
  );
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd
          data={jsonLdGraph(
            breadcrumbListNode(lang, [
              { name: dict.footer.solutions, path: "/solutions" },
            ]),
          )}
        />
        <Navbar />
        <SolutionsHero />
        <SolutionsScrollDemo />
        <Testimonials />
        <BlogHighlights lang={lang} />
        <SolutionsClosing />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
