"use client";

import { forwardRef } from "react";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LocaleLink } from "@/i18n/LocaleLink";

interface AnnouncementBarProps {
  badge: string;
  full: string;
  short: string;
  href: string;
  dismissLabel?: string;
  onDismiss: () => void;
}

export const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(
  function AnnouncementBar(
    { badge, full, short, href, dismissLabel = "Dismiss", onDismiss },
    ref,
  ) {
    // External destinations (http/https/mailto/tel) must NOT get a locale
    // prefix and should open in a new tab; internal paths use LocaleLink.
    const isExternal = /^(https?:|mailto:|tel:)/i.test(href);
    const linkClassName =
      "text-sm text-center hover:underline underline-offset-2 decoration-current/60";
    const linkBody = (
      <>
        {badge && (
          <span className="mr-2 inline-flex items-center justify-center rounded-full bg-white/20 px-2 py-0.5 align-middle text-[11px] font-semibold tracking-wide uppercase">
            {badge}
          </span>
        )}
        <span className="hidden sm:inline">{full}</span>
        <span className="sm:hidden">{short}</span>
        <span aria-hidden="true" className="ml-1.5">
          →
        </span>
      </>
    );

    return (
      <div
        ref={ref}
        className="bg-gradient-to-r from-brand-800 to-brand-600 text-white"
      >
        <Container className="relative flex items-center justify-center py-2">
          {isExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {linkBody}
            </a>
          ) : (
            <LocaleLink href={href} className={linkClassName}>
              {linkBody}
            </LocaleLink>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </Container>
      </div>
    );
  },
);
