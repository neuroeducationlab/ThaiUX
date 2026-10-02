import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { pick } from "@/i18n/localized";
import { routes } from "@/lib/routes";
import type { SearchItem } from "@/components/search/rank";
import { glossary } from "./glossary";
import { modules } from "./modules";
import { experiments } from "./lab";

/** Suggestions shown before anyone types — the most useful first steps. */
export const popularSearchIds = [
  "concept:feedback",
  "concept:affordance",
  "concept:hover",
  "module:what-is-ux",
  "lab:ux-detective",
];

/** A compact, localised index built at render time and handed to the client palette. */
export function buildSearchIndex(locale: Locale): SearchItem[] {
  const dict = getDictionary(locale);

  const concepts: SearchItem[] = glossary.map((c) => ({
    id: `concept:${c.id}`,
    kind: "concept",
    title: c.term,
    titleLang: "en",
    subtitle: locale === "en" ? pick(c.short, locale) : pick(c.localTerm, locale),
    href: routes.concept(locale, c.id),
    keywords: [
      ...Object.values(c.localTerm),
      pick(c.short, locale),
      ...(c.aliases ?? []),
    ].join(" "),
  }));

  const learning: SearchItem[] = modules.map((m) => ({
    id: `module:${m.id}`,
    kind: "module",
    title: pick(m.title, locale),
    subtitle: pick(m.summary, locale),
    href: routes.module(locale, m.id),
    keywords: [m.title.en, ...m.topics.map((t) => `${pick(t.title, locale)} ${t.title.en}`)].join(" "),
  }));

  const lab: SearchItem[] = experiments.map((e) => ({
    id: `lab:${e.id}`,
    kind: "lab",
    title: pick(e.title, locale),
    subtitle: pick(e.question, locale),
    href: routes.experiment(locale, e.id),
    keywords: [e.title.en, pick(e.summary, locale)].join(" "),
  }));

  const pages: SearchItem[] = [
    { id: "page:learn", kind: "page", title: dict.nav.learn, href: routes.learn(locale), keywords: "learn modules path" },
    { id: "page:glossary", kind: "page", title: dict.nav.glossary, href: routes.glossary(locale), keywords: "glossary terms dictionary" },
    { id: "page:lab", kind: "page", title: dict.lab.title, href: routes.lab(locale), keywords: "lab experiments playground" },
    { id: "page:about", kind: "page", title: dict.nav.about, href: routes.about(locale), keywords: "about molly project" },
    { id: "page:case-study", kind: "page", title: dict.footer.caseStudy, href: routes.caseStudy(locale), keywords: "case study portfolio process" },
    { id: "page:design-system", kind: "page", title: dict.footer.designSystem, href: routes.designSystem(locale), keywords: "design system tokens components colour typography" },
  ];

  return [...concepts, ...learning, ...lab, ...pages];
}
