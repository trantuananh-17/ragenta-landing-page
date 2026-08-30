import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { PricingFAQ } from "@/components/sections/PricingFAQ";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import {
  jsonLdGraph,
  faqPageNode,
  breadcrumbListNode,
  softwareApplicationNode,
} from "@/lib/structured-data";
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

/**
 * The dictionary holds a localized display price ("$29" in en, "29$" in vi)
 * because the symbol's position differs per language, while structured data
 * needs a number. The digits are identical in both, so the amount is read back
 * out of the string the page renders rather than kept as a second copy that can
 * drift away from it. Plans quoted as "Custom" / "Liên hệ" carry no digits and
 * produce no offer, which is correct — an unpriced plan has nothing to offer.
 */
function monthlyPrice(display: string): number | null {
  const digits = display.replace(/[^\d.]/g, "");
  if (digits === "") return null;
  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : null;
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
  const plans = Object.values(dict.pricing.plans).flatMap((plan) => {
    const monthly = monthlyPrice(plan.price.monthly);
    return monthly === null
      ? []
      : [{ name: plan.name, monthlyPrice: monthly }];
  });

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <JsonLd
          data={jsonLdGraph(
            softwareApplicationNode({
              locale: lang,
              description: dict.metadata.default.description,
              plans,
            }),
            faqPageNode(faqItems),
            breadcrumbListNode(lang, [
              { name: dict.footer.pricing, path: "/pricing" },
            ]),
          )}
        />
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
