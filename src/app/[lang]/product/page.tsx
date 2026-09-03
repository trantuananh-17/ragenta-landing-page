import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductSurfaces } from "@/components/product/ProductSurfaces";
import { ProductUnderstands } from "@/components/product/ProductUnderstands";
import { ProductLifecycle } from "@/components/product/ProductLifecycle";
import { ProductCapabilities } from "@/components/product/ProductCapabilities";
import { ProductExtend } from "@/components/product/ProductExtend";
import { ProductChangelog } from "@/components/product/ProductChangelog";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListNode, jsonLdGraph } from "@/lib/structured-data";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

// ProductChangelog reads the content layer, so this route carries the same
// window /blog and /changelog do. Today it changes nothing — the theme cookie
// read in the [lang] layout makes every route dynamic, and content freshness
// comes from the Data Cache in `fromApi`. It matters if that cookie read ever
// goes away: this route would then be prerenderable, and without a revalidate
// it would serve the build's changelog for the life of the container.
export const revalidate = 300;

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) => pageMetadata(lang, "product", "/product"));
}

export default async function ProductPage({
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
              { name: dict.footer.product, path: "/product" },
            ]),
          )}
        />
        <Navbar />
        <ProductHero />
        <ProductSurfaces />
        <ProductUnderstands />
        <ProductLifecycle />
        <ProductCapabilities />
        <ProductExtend />
        <Testimonials />
        <ProductChangelog lang={lang} />
        <FinalCTA />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
