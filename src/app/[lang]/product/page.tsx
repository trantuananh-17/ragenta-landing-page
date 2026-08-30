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
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

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
  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
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
