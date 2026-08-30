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
    full: "Agent Skills are here — reusable playbooks your whole workspace can run",
    short: "Agent Skills are here",
    href: "/changelog",
    version: "2026-08-24",
  },
  vi: {
    enabled: true,
    badge: "Mới",
    full: "Agent Skills đã có — playbook dùng lại được cho cả workspace",
    short: "Agent Skills đã có mặt",
    href: "/changelog",
    version: "2026-08-24",
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
