import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { ContactForm } from "@/components/sections/ContactForm";
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
  return params.then(({ lang }) => pageMetadata(lang, "contact", "/contact"));
}

export default async function ContactPage({
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
              { name: dict.footer.contactUs, path: "/contact" },
            ]),
          )}
        />
        <Navbar />
        <ContactForm />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
