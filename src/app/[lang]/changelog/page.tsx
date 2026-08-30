import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { ChangelogHero } from "@/components/changelog/ChangelogHero";
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  return params.then(({ lang }) =>
    pageMetadata(lang, "changelog", "/changelog"),
  );
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <Navbar />
        <ChangelogHero />
        <ChangelogTimeline lang={lang} />
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
