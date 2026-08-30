import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { ContactForm } from "@/components/sections/ContactForm";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) => pageMetadata(lang, "contact", "/contact"));
}

export default function ContactPage() {
  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <Navbar />
        <ContactForm />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
