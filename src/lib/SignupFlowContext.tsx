"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { usePostHog } from "@posthog/next";
import { locales } from "@/i18n/config";
import { usePublicEnv } from "@/lib/runtime-env";
import { buildAppUrl, getAttributionProps } from "@/lib/attribution";

export type SignupCTAOptions = {
  cta_text: string;
  cta_location: string;
  newTab?: boolean;
};

interface SignupFlowContextValue {
  openSignup: (opts: SignupCTAOptions) => void;
}

const SignupFlowContext = createContext<SignupFlowContextValue>({
  openSignup: () => {},
});

export function useSignupFlow() {
  return useContext(SignupFlowContext);
}

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

function derivePageType(pathname: string | null): string {
  if (!pathname) return "home";
  const stripped = pathname.replace(LOCALE_PREFIX, "") || "/";
  if (stripped === "/") return "home";
  if (stripped === "/blog") return "blog_index";
  if (stripped.startsWith("/blog/")) return "blog_post";
  return stripped.replace(/^\//, "").replace(/\//g, "_") || "home";
}

/**
 * Every signup CTA on the site goes through here: one place that records the
 * click with page/attribution context and then sends the visitor to the app.
 */
export function SignupFlowProvider({ children }: { children: ReactNode }) {
  const posthog = usePostHog();
  const pathname = usePathname();
  const { appUrl } = usePublicEnv();

  const openSignup = useCallback(
    (opts: SignupCTAOptions) => {
      const destination = buildAppUrl(`${appUrl}/signup`);
      posthog?.capture("cta_click", {
        cta_text: opts.cta_text,
        cta_location: opts.cta_location,
        page_type: derivePageType(pathname),
        destination_url: destination,
        form_id: "app_signup",
        ...getAttributionProps(),
      });
      if (opts.newTab) {
        window.open(destination, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = destination;
      }
    },
    [posthog, pathname, appUrl],
  );

  return (
    <SignupFlowContext.Provider value={{ openSignup }}>
      {children}
    </SignupFlowContext.Provider>
  );
}
