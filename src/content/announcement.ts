import "server-only";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { fromApi } from "@/content/source";
import type { Announcement } from "@/content/types";

// The announcement bar is admin-controlled once a backend exists. Until then
// it is content the repo owns, exactly like the API will return it.
const LOCAL_ANNOUNCEMENT: Record<Locale, Announcement> = {
  en: {
    enabled: true,
    badge: "New",
    full: "Describe an agent in one sentence and the canvas drafts the whole flow",
    short: "Draft a flow from a sentence",
    href: "/changelog",
    version: "2026-09-09",
  },
  vi: {
    enabled: true,
    badge: "Mới",
    full: "Mô tả agent bằng một câu, canvas phác ra trọn cả flow",
    short: "Phác flow từ một câu",
    href: "/changelog",
    version: "2026-09-09",
  },
};

function normalize(raw: Record<string, unknown>): Announcement | null {
  if (typeof raw?.full !== "string") return null;
  return {
    enabled: raw.enabled === true,
    badge: typeof raw.badge === "string" ? raw.badge : "",
    full: raw.full,
    short: typeof raw.short === "string" ? raw.short : raw.full,
    href:
      typeof raw.linkUrl === "string" && raw.linkUrl.length > 0
        ? raw.linkUrl
        : "/pricing",
    version: typeof raw.updatedAt === "string" ? raw.updatedAt : "default",
  };
}

export async function fetchAnnouncement(locale: string): Promise<Announcement> {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  const remote = await fromApi<Record<string, unknown>>(
    "/v1/public/announcement",
    { locale: safeLocale },
  );
  return (remote ? normalize(remote) : null) ?? LOCAL_ANNOUNCEMENT[safeLocale];
}
