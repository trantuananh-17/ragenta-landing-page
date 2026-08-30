import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/Markdown";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { fetchLegalDocument } from "@/content/legal";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import type { LegalDocument } from "@/content/types";

export async function LegalDocumentPage({
  slug,
  lang,
}: {
  slug: LegalDocument["slug"];
  lang: Locale;
}) {
  const [dict, document] = await Promise.all([
    getDictionary(lang),
    fetchLegalDocument(slug, lang),
  ]);

  return (
    <SignupFlowProvider>
      <main className="min-h-screen bg-page">
        <Navbar />
        <article className="pt-28 md:pt-36">
          <header className="pb-10 md:pb-14">
            <Container>
              <p className="mb-4 font-mono text-sm tracking-widest text-brand-600 uppercase">
                {dict.legal.eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
                {document.title}
              </h1>
              {document.updatedAt && (
                <p className="mt-4 text-sm text-ink-subtle">
                  {dict.legal.lastUpdated.replace(
                    "{date}",
                    formatDate(document.updatedAt, lang),
                  )}
                </p>
              )}
            </Container>
          </header>

          <div className="pb-16 md:pb-24">
            <Container>
              <div className="max-w-3xl">
                <Markdown>{document.bodyMd}</Markdown>
              </div>
            </Container>
          </div>
        </article>
        <Footer />
      </main>
    </SignupFlowProvider>
  );
}
