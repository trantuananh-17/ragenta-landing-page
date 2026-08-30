import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk } from "next/font/google";
import { PostHogPageView, PostHogProvider } from "@posthog/next";
import "../globals.css";
import { BackToTopButton } from "@/components/BackToTopButton";
import { LenisProvider } from "@/components/LenisProvider";
import { QueryProvider } from "@/lib/QueryProvider";
import { SignupFlowProvider } from "@/lib/SignupFlowContext";
import { RuntimeEnvProvider } from "@/lib/runtime-env";
import { ThemeProvider } from "@/lib/ThemeContext";
import { getPublicEnv } from "@/lib/public-env";
import { cn } from "@/lib/utils";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import {
  THEME_COOKIE,
  THEME_INIT_SCRIPT,
  isThemePreference,
  type ThemePreference,
} from "@/lib/theme";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { hreflangAlternates } from "@/lib/seo";

// Inter carries the `vietnamese` subset, so Vietnamese diacritics render from
// the primary stack rather than falling back to a system font mid-paragraph.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

// Display face for headings. It has no Vietnamese subset — globals.css routes
// `--font-heading` back to the body stack under html[lang="vi"].
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const seo = dict.metadata.default;
  const ogImage = {
    url: `/${lang}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: DEFAULT_OG_IMAGE.alt,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: "%s",
    },
    description: seo.description,
    alternates: hreflangAlternates("/", lang),
    icons: { icon: "/favicon.svg" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/${lang}`,
      siteName: SITE_NAME,
      images: [ogImage],
      type: "website",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage.url],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const publicEnv = getPublicEnv();
  const posthogKey = publicEnv.posthogKey;

  // An explicit light/dark choice is known on the server, so the markup ships
  // with the right class and there is nothing to correct after hydration. The
  // "system" case can only be resolved in the browser — THEME_INIT_SCRIPT does
  // that before first paint, which is why it runs in <head>.
  const cookieStore = await cookies();
  const stored = cookieStore.get(THEME_COOKIE)?.value;
  const preference: ThemePreference =
    stored && isThemePreference(stored) ? stored : "system";
  // Only an explicit "dark" choice can be resolved server-side; "system" is
  // settled before paint by THEME_INIT_SCRIPT.
  const initialTheme = preference === "dark" ? "dark" : "light";

  const content = (
    <QueryProvider>
      <SignupFlowProvider>
        <LenisProvider>
          {children}
          <BackToTopButton />
        </LenisProvider>
      </SignupFlowProvider>
    </QueryProvider>
  );

  return (
    <html
      lang={locale}
      className={cn(
        inter.variable,
        spaceGrotesk.variable,
        initialTheme === "dark" && "dark",
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="overflow-x-hidden">
        <RuntimeEnvProvider value={publicEnv}>
          <ThemeProvider initialPreference={preference}>
            <I18nProvider locale={locale} dict={dict}>
              {posthogKey ? (
                <PostHogProvider
                  apiKey={posthogKey}
                  clientOptions={{
                    api_host: "/ingest",
                    cross_subdomain_cookie: true,
                    persistence: "localStorage+cookie",
                  }}
                >
                  <PostHogPageView />
                  {content}
                </PostHogProvider>
              ) : (
                content
              )}
            </I18nProvider>
          </ThemeProvider>
        </RuntimeEnvProvider>
      </body>
    </html>
  );
}
