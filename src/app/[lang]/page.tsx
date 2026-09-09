import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { Providers } from "@/components/sections/Providers";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FeatureOrchestration } from "@/components/sections/FeatureOrchestration";
import { FeatureCanvas } from "@/components/sections/FeatureCanvas";
import { FeatureKnowledge } from "@/components/sections/FeatureKnowledge";
import { FeatureCatalogue } from "@/components/sections/FeatureCatalogue";
import { FeatureWidget } from "@/components/sections/FeatureWidget";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogHighlights } from "@/components/sections/BlogHighlights";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import {
  jsonLdGraph,
  organizationNode,
  webSiteNode,
} from "@/lib/structured-data";
import { fetchCatalogue } from "@/content/catalogue";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

// Rendered at request time so server-only content env (RAGENTA_CONTENT_API_URL)
// is read at runtime. It is not available at Docker build time, so a static
// prerender would bake the fixture answers in and never recover. Document
// responses are already no-store.
export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const [dict, catalogue] = await Promise.all([
    getDictionary(lang),
    fetchCatalogue({ locale: lang, page: 1 }),
  ]);

  // Organization + WebSite structured data on the home page (the site's most
  // authoritative page) — feeds Google's knowledge graph and is a Lighthouse
  // SEO win. Description is localized from the page metadata dictionary.
  const structuredData = jsonLdGraph(
    organizationNode(dict.metadata.default.description),
    webSiteNode(lang),
  );

  return (
    <main className="min-h-screen bg-page">
      <JsonLd data={structuredData} />
      <Navbar />
      <HeroSection />
      <Providers />
      <TrustStrip />
      <FeatureOrchestration />
      <FeatureCanvas />
      <FeatureKnowledge />
      <FeatureCatalogue initial={catalogue} />
      <FeatureWidget />
      <Testimonials />
      <BlogHighlights lang={lang} />
      <FinalCTA />
      <Footer />
    </main>
  );
}
