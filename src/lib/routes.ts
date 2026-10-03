import { locales, type Locale } from "@/i18n/config";

/** Every internal URL is built here, so the IA lives in one place. */
export const routes = {
  home: (l: Locale) => `/${l}`,
  learn: (l: Locale) => `/${l}/learn`,
  module: (l: Locale, id: string) => `/${l}/learn/${id}`,
  glossary: (l: Locale) => `/${l}/glossary`,
  concept: (l: Locale, id: string) => `/${l}/glossary/${id}`,
  lab: (l: Locale) => `/${l}/lab`,
  experiment: (l: Locale, id: string) => `/${l}/lab/${id}`,
  effects: (l: Locale) => `/${l}/effects`,
  effect: (l: Locale, id: string) => `/${l}/effects/${id}`,
  about: (l: Locale) => `/${l}/about`,
  caseStudy: (l: Locale) => `/${l}/about/case-study`,
  designSystem: (l: Locale) => `/${l}/design-system`,
};

/** Swap the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if ((locales as readonly string[]).includes(parts[1] ?? "")) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}

/** Path without the locale prefix, e.g. "/th/glossary/hover" → "/glossary/hover". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if ((locales as readonly string[]).includes(parts[1] ?? "")) {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "/" ? "" : rest.replace(/\/$/, "");
  }
  return pathname;
}
