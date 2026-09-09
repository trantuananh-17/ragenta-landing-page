"use client";

import { useQuery } from "@tanstack/react-query";
import { Linkedin, Github, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RagentaMark } from "@/components/brand/RagentaLogo";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useTranslations } from "@/i18n/useTranslations";
import { fetchSiteMetadataClient } from "@/content/client";

const INTERNAL_SECTIONS = [
  {
    heading: "product",
    links: [
      { key: "overview", href: "/product" },
      { key: "solutions", href: "/solutions" },
      { key: "pricing", href: "/pricing" },
      { key: "catalogue", href: "/catalogue" },
      { key: "changelog", href: "/changelog" },
    ],
  },
  {
    heading: "company",
    links: [
      { key: "blog", href: "/blog" },
      { key: "contactUs", href: "/contact" },
    ],
  },
  {
    heading: "legal",
    links: [
      { key: "privacyPolicy", href: "/privacy-policy" },
      { key: "termsOfService", href: "/terms-of-service" },
    ],
  },
] as const;

const EXTERNAL_LINKS = [
  { key: "docs", metadataKey: "docs_url" },
  { key: "community", metadataKey: "community_url" },
  { key: "status", metadataKey: "status_url" },
] as const;

export function Footer() {
  const { t } = useTranslations("footer");

  const { data: external } = useQuery({
    queryKey: ["footer-external-links"],
    queryFn: async () => {
      const entries = await Promise.all(
        EXTERNAL_LINKS.map(async (link) => [
          link.metadataKey,
          await fetchSiteMetadataClient(link.metadataKey),
        ]),
      );
      return Object.fromEntries(entries) as Record<string, string | null>;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <footer className="border-t border-line bg-card py-16 text-ink-subtle">
      <Container className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-8">
        {/* Brand */}
        <div className="space-y-6 md:col-span-1">
          <LocaleLink href="/" className="flex items-center" aria-label="Ragenta">
            <RagentaMark className="h-11 w-11" />
          </LocaleLink>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.linkedin.com/company/ragenta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followLinkedin")}
              className="transition-colors hover:text-brand-600"
            >
              <Linkedin aria-hidden="true" className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/ragenta_ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followX")}
              className="transition-colors hover:text-brand-600"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/ragenta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followGithub")}
              className="transition-colors hover:text-brand-600"
            >
              <Github aria-hidden="true" className="h-5 w-5" />
            </a>
          </div>
        </div>

        {INTERNAL_SECTIONS.map((section) => (
          <div key={section.heading} className="space-y-4">
            <h2 className="mb-4 font-semibold text-ink">{t(section.heading)}</h2>
            <ul className="space-y-3 text-sm">
              {section.links.map((link) => (
                <li key={link.key}>
                  <LocaleLink
                    href={link.href}
                    className="transition-colors hover:text-brand-600"
                  >
                    {t(link.key)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-4">
          <h2 className="mb-4 font-semibold text-ink">{t("resources")}</h2>
          <ul className="space-y-3 text-sm">
            {EXTERNAL_LINKS.map((link) => {
              const href = external?.[link.metadataKey];
              if (!href) return null;
              return (
                <li key={link.key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-brand-600"
                  >
                    {t(link.key)}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <Container className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm md:flex-row">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ok" />
          {t("systemsOperational")}
        </span>
      </Container>
    </footer>
  );
}
