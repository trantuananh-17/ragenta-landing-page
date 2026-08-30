import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { PricingFAQ } from "@/components/sections/PricingFAQ";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { jsonLdGraph, faqPageNode } from "@/lib/structured-data";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) => pageMetadata(lang, "pricing", "/pricing"));
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  // The same FAQ content PricingFAQ renders — mirrored into a FAQPage node so
  // the Q&A is eligible for FAQ rich results.
  const faqItems = dict.pricing.faq.items;

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd data={jsonLdGraph(faqPageNode(faqItems))} />
        <Navbar />
        <PricingPlans />
        <Testimonials />
        <PricingFAQ />
        <FinalCTA />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
