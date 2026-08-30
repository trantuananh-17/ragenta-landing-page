"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "./I18nProvider";
import { localizedHref } from "./links";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link that prepends the active locale to internal
 * string hrefs. External URLs and hash links pass through untouched.
 */
export function LocaleLink({ href, ...props }: LinkProps) {
  const { locale } = useI18n();
  const localized = typeof href === "string" ? localizedHref(locale, href) : href;
  return <Link href={localized} {...props} />;
}
