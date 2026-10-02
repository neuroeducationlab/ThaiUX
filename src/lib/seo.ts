import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/config";

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
