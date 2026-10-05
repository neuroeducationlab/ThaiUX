import type { MetadataRoute } from "next";
import { localeMeta, locales } from "@/i18n/config";
import { site } from "@/lib/site";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
import { experiments } from "@/content/lab";
import { effects } from "@/content/effects";

/** Every page in every language, with hreflang alternates for each. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/learn",
    ...modules.map((m) => `/learn/${m.id}`),
    "/learn/certificate",
    "/glossary",
    ...glossary.map((c) => `/glossary/${c.id}`),
    "/lab",
    ...experiments.map((e) => `/lab/${e.id}`),
    "/effects",
    ...effects.map((e) => `/effects/${e.id}`),
    "/about",
    "/about/case-study",
    "/design-system",
  ];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, `${site.url}/${l}${path}`]));
    return locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
      alternates: { languages: { ...languages, "x-default": `${site.url}/en${path}` } },
    }));
  });
}
