import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Noto_Sans_Thai } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { I18nProvider } from "@/i18n/client";
import { site } from "@/lib/site";
import { alternatesFor } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { themeScript } from "@/components/layout/theme-script";
import { SearchPalette } from "@/components/search/search-palette";
import { Toaster } from "@/components/ui/toast";
import { buildSearchIndex, popularSearchIds } from "@/content/search-index";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

const thai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
});

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.defaultTitle, template: `%s · ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.author }],
    alternates: alternatesFor(locale, ""),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: localeMeta[locale].og,
      title: dict.meta.defaultTitle,
      description: dict.meta.description,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${inter.variable} ${thai.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <a href="#main" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} dict={dict} />
          <MobileTabBar />
          <SearchPalette items={buildSearchIndex(locale)} popular={popularSearchIds} />
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
