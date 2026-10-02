import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { site } from "./site";

/**
 * Canonical + hreflang alternates for a path that exists in every locale.
 * `path` is the part after the locale, e.g. "/glossary/hover" (or "" for home).
 */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].hreflang] = `/${l}${path}`;
  // Visitors whose language we don't offer get English (see proxy.ts)
  languages["x-default"] = `/en${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/**
 * Full metadata for a page: title, description, canonical + hreflang, and
 * Open Graph / X cards that keep the per-language share image (a page-level
 * `openGraph` object would otherwise replace the layout’s image).
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: `${site.name} — Learn UX by experiencing it` };
  const shareTitle = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: { type: "website", siteName: site.name, locale: localeMeta[locale].og, url: `/${locale}${path}`, title: shareTitle, description, images: [image] },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image.url] },
  };
}
