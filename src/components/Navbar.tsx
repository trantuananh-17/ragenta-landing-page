"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSignupFlow } from "@/lib/SignupFlowContext";
import { fetchAnnouncementClient, fetchSiteMetadataClient } from "@/content/client";
import type { Announcement } from "@/content/types";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { RagentaWordmark } from "@/components/brand/RagentaLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocaleLink } from "@/i18n/LocaleLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "@/i18n/useTranslations";

// `metadataKey` items resolve their destination from the content API; the rest
// are internal routes handled by LocaleLink.
const RESOURCE_LINKS = [
  { key: "blog", href: "/blog", metadataKey: null },
  { key: "changelog", href: "/changelog", metadataKey: null },
  { key: "docs", href: null, metadataKey: "docs_url" },
  { key: "community", href: null, metadataKey: "community_url" },
] as const;

const ANNOUNCEMENT_DEFAULT_HEIGHT = 40;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);
  const [announcementHeight, setAnnouncementHeight] = useState(
    ANNOUNCEMENT_DEFAULT_HEIGHT,
  );
  const announcementRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesTriggerRef = useRef<HTMLButtonElement>(null);
  const { openSignup } = useSignupFlow();
  const { t, locale } = useTranslations("nav");
  const { t: tc } = useTranslations("common");
  const { t: ta } = useTranslations("announcement");

  // Content-managed bar. On fetch failure fall back to the bundled dictionary
  // text so the announcement never silently disappears when the API is down.
  const { data, isError } = useQuery({
    queryKey: ["announcement", locale],
    queryFn: () => fetchAnnouncementClient(locale),
    staleTime: 5 * 60 * 1000,
  });
  const announcement: Announcement | undefined = isError
    ? {
        enabled: true,
        badge: ta("badge"),
        full: ta("full"),
        short: ta("short"),
        href: "/changelog",
        version: "fallback",
      }
    : data;

  // Destinations that live outside this site (docs, community). One query for
  // all of them keeps the nav to a single extra request.
  const { data: externalLinks } = useQuery({
    queryKey: ["nav-external-links"],
    queryFn: async () => {
      const [docs, community] = await Promise.all([
        fetchSiteMetadataClient("docs_url"),
        fetchSiteMetadataClient("community_url"),
      ]);
      return { docs_url: docs, community_url: community };
    },
    staleTime: 5 * 60 * 1000,
  });

  const resolveHref = (link: (typeof RESOURCE_LINKS)[number]) =>
    link.metadataKey ? (externalLinks?.[link.metadataKey] ?? null) : link.href;

  // Dismissal is remembered by the version that was dismissed rather than by a
  // boolean, so an edit that bumps the version brings the bar back on its own.
  const showAnnouncement =
    Boolean(announcement?.enabled) && dismissedVersion !== announcement?.version;

  useEffect(() => {
    if (!showAnnouncement || !announcementRef.current) return;
    const el = announcementRef.current;
    setAnnouncementHeight(el.offsetHeight);
    const observer = new ResizeObserver(() =>
      setAnnouncementHeight(el.offsetHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showAnnouncement]);

  const openResources = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsResourcesOpen(true);
  };
  const closeResources = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsResourcesOpen(false), 120);
  };

  // The menu used to open on hover alone, which left every destination inside
  // it unreachable by keyboard. Escape closes it, and focus leaving the group
  // closes it too — `relatedTarget` is the element focus is moving *to*, so a
  // Tab from the trigger into the menu keeps it open.
  const handleResourcesKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && isResourcesOpen) {
      event.stopPropagation();
      setIsResourcesOpen(false);
      resourcesTriggerRef.current?.focus();
    }
  };

  const handleResourcesBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsResourcesOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50">
        {showAnnouncement && announcement && (
          <AnnouncementBar
            ref={announcementRef}
            badge={announcement.badge}
            full={announcement.full}
            short={announcement.short}
            href={announcement.href}
            dismissLabel={ta("dismiss")}
            onDismiss={() => setDismissedVersion(announcement.version)}
          />
        )}
        <nav
          className={`border-b transition-all duration-300 ${
            isScrolled
              ? "border-line bg-page/85 py-4 shadow-sm backdrop-blur-md"
              : "border-transparent py-6"
          }`}
        >
          <Container className="relative flex items-center justify-between">
            <LocaleLink href="/" className="flex items-center" aria-label="Ragenta">
              <RagentaWordmark />
            </LocaleLink>

            {/* Desktop nav — centered */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 text-sm font-medium text-ink-subtle md:flex">
              <LocaleLink
                href="/product"
                className="transition-colors hover:text-brand-600"
              >
                {t("product")}
              </LocaleLink>
              <LocaleLink
                href="/solutions"
                className="transition-colors hover:text-brand-600"
              >
                {t("solutions")}
              </LocaleLink>
              <LocaleLink
                href="/pricing"
                className="transition-colors hover:text-brand-600"
              >
                {t("pricing")}
              </LocaleLink>

              {/* Resources — the label goes to the blog; the list beside it is
                  opened by hover, by focus, or by the disclosure button. The
                  link cannot carry `aria-haspopup` itself: it navigates, and a
                  keyboard user pressing Enter on it would leave the page rather
                  than open the menu. So the two jobs are two elements. */}
              <div
                className="relative flex items-center gap-1"
                onMouseEnter={openResources}
                onMouseLeave={closeResources}
                onFocus={openResources}
                onBlur={handleResourcesBlur}
                onKeyDown={handleResourcesKeyDown}
              >
                <LocaleLink
                  href="/blog"
                  className="rounded-sm transition-colors hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => setIsResourcesOpen(false)}
                >
                  {t("resources")}
                </LocaleLink>
                <button
                  ref={resourcesTriggerRef}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isResourcesOpen}
                  aria-label={t("resources")}
                  className="rounded-sm p-0.5 text-ink-faint transition-colors hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => setIsResourcesOpen((open) => !open)}
                >
                  <ChevronDown
                    className={`size-3.5 transition-transform motion-reduce:transition-none ${
                      isResourcesOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {isResourcesOpen && (
                    <motion.div
                      className="absolute top-full left-1/2 w-48 origin-top -translate-x-1/2 pt-3"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{
                        opacity: { duration: 0.2, ease: "easeOut" },
                        y: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                      }}
                    >
                      <div className="overflow-hidden rounded-xl border border-line bg-card/95 p-1.5 shadow-lg backdrop-blur-sm">
                        {RESOURCE_LINKS.map((link) => {
                          const href = resolveHref(link);
                          const label = t(`resourceLinks.${link.key}.label`);
                          if (link.metadataKey) {
                            if (!href) return null;
                            return (
                              <a
                                key={link.key}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
                                onClick={() => setIsResourcesOpen(false)}
                              >
                                <span>{label}</span>
                                <ArrowUpRight
                                  size={12}
                                  className="text-ink-faint"
                                  aria-hidden="true"
                                />
                              </a>
                            );
                          }
                          return (
                            <LocaleLink
                              key={link.key}
                              href={href!}
                              className="block rounded-lg px-3 py-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
                              onClick={() => setIsResourcesOpen(false)}
                            >
                              {label}
                            </LocaleLink>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop right — controls + CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <ThemeToggle />
              <LanguageSwitcher />
              <LocaleLink
                href="/contact"
                className="text-sm font-medium text-ink-subtle transition-colors hover:text-brand-600"
              >
                {tc("contactUs")}
              </LocaleLink>
              <Button
                size="md"
                onClick={() =>
                  openSignup({
                    cta_text: "Start for free",
                    cta_location: "navbar_desktop",
                    newTab: true,
                  })
                }
              >
                {tc("tryRagenta")}
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              className="text-ink md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </Container>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div
              id="mobile-navigation"
              className="absolute top-full right-0 left-0 z-10 flex flex-col gap-4 border-b border-line bg-page px-6 py-4 shadow-lg md:hidden"
            >
              {(["product", "solutions", "pricing"] as const).map((key) => (
                <LocaleLink
                  key={key}
                  href={`/${key}`}
                  className="border-b border-line-soft py-2 text-base font-medium text-ink-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(key)}
                </LocaleLink>
              ))}
              <div className="border-b border-line-soft pb-2">
                <p className="py-2 text-xs font-semibold tracking-wider text-ink-faint uppercase">
                  {t("resources")}
                </p>
                {RESOURCE_LINKS.map((link) => {
                  const href = resolveHref(link);
                  const label = t(`resourceLinks.${link.key}.label`);
                  if (link.metadataKey) {
                    if (!href) return null;
                    return (
                      <a
                        key={link.key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 py-2 pl-3 text-base font-medium text-ink-muted"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                        <ArrowUpRight
                          size={14}
                          className="text-ink-faint"
                          aria-hidden="true"
                        />
                      </a>
                    );
                  }
                  return (
                    <LocaleLink
                      key={link.key}
                      href={href!}
                      className="block py-2 pl-3 text-base font-medium text-ink-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </LocaleLink>
                  );
                })}
              </div>
              <LocaleLink
                href="/contact"
                className="border-b border-line-soft py-2 text-base font-medium text-ink-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {tc("contactUs")}
              </LocaleLink>
              <ThemeToggle variant="mobile" />
              <LanguageSwitcher variant="mobile" />
              <Button
                className="w-full"
                onClick={() => {
                  openSignup({
                    cta_text: "Start for free",
                    cta_location: "navbar_mobile",
                    newTab: true,
                  });
                  setIsMobileMenuOpen(false);
                }}
              >
                {tc("tryRagenta")}
              </Button>
            </div>
          )}
        </nav>
      </div>
      {showAnnouncement && (
        <div aria-hidden="true" style={{ height: `${announcementHeight}px` }} />
      )}
    </>
  );
}
