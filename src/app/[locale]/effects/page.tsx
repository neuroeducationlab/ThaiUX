import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container, Section } from "@/components/ui/layout";
import { PlaygroundProvider } from "@/components/effects/provider";
import { EffectsHero } from "@/components/effects/hero";
import { EffectGrid, EffectsGallery } from "@/components/effects/gallery";
import { PromptBuilder } from "@/components/effects/prompt-builder";
import type { EffectSummary } from "@/components/effects/effect-card";
import { effectCategories, effects } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { getConcept } from "@/content/glossary";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return pageMetadata(locale, "/effects", pick(C.metaTitle, locale), pick(C.lead, locale));
}

export default async function EffectsPage() {
  const { locale, dict } = await getI18n();
  const levels = [dict.difficulty.beginner, dict.difficulty.intermediate, dict.difficulty.advanced];

  const items: EffectSummary[] = effects.map((e) => ({
    id: e.id,
    name: e.name,
    localName: locale === "en" ? undefined : pick(e.localName, locale),
    tagline: pick(e.tagline, locale),
    try: pick(e.try, locale),
    category: e.category,
    categoryLabel: pick(effectCategories.find((c) => c.id === e.category)!.label, locale),
    level: e.level,
    levelLabel: levels[e.level - 1],
    tech: e.tech,
    href: routes.effect(locale, e.id),
    prompt: e.prompt,
  }));
  const categories = effectCategories.map((c) => ({ id: c.id, label: pick(c.label, locale) }));
  const concepts = C.concepts.ids.map((id) => getConcept(id)).filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <PlaygroundProvider>
      <EffectsHero
        eyebrow={format(pick(C.eyebrow, locale), { n: effects.length })}
        title={pick(C.title, locale)}
        lead={pick(C.lead, locale)}
        startLabel={pick(C.startCta, locale)}
        formulaLabel={pick(C.formulaCta, locale)}
        total={effects.length}
      />

      <Container size="wide" className="scroll-mt-16 pt-10 md:pt-14" id="effects">
        <h2 className="type-h2 mb-6">{pick(C.galleryTitle, locale)}</h2>
        <Suspense fallback={<EffectGrid items={items} />}>
          <EffectsGallery items={items} categories={categories} />
        </Suspense>
      </Container>

      <Section id="formula" aria-labelledby="formula-h" className="scroll-mt-16">
        <Container size="wide">
          <div className="measure-wide">
            <h2 id="formula-h" className="type-h2">{pick(C.formula.title, locale)}</h2>
            <p className="type-lead mt-4">{pick(C.formula.lead, locale)}</p>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {C.formula.parts.map((part, i) => (
              <li
                key={part.key}
                className={`flex flex-col rounded-[var(--radius-lg)] border p-5 ${i === 4 ? "border-accent/40 bg-accent-soft" : "border-line bg-surface"}`}
              >
                <span className="tabular flex size-8 items-center justify-center rounded-full bg-accent text-[0.875rem] font-bold text-on-accent" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-4 flex flex-wrap items-baseline gap-x-2">
                  <span lang="en" className="type-title">{part.key}</span>
                  <span className="text-[0.875rem] font-medium text-ink-2">{pick(part.label, locale)}</span>
                </h3>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{pick(part.desc, locale)}</p>
                <p lang="en" className="mt-auto pt-4 font-mono text-[0.75rem] text-accent-ink">“{part.example}”</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="builder" aria-labelledby="builder-h" tone="tinted" className="scroll-mt-16">
        <Container size="wide">
          <div className="measure-wide mb-10">
            <h2 id="builder-h" className="type-h2">{pick(C.builder.title, locale)}</h2>
            <p className="type-lead mt-4">{pick(C.builder.lead, locale)}</p>
          </div>
          <PromptBuilder />
        </Container>
      </Section>

      <Section aria-labelledby="concepts-h">
        <Container size="wide">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="measure-wide">
              <h2 id="concepts-h" className="type-h2">{pick(C.concepts.title, locale)}</h2>
              <p className="type-lead mt-4">{pick(C.concepts.lead, locale)}</p>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {concepts.map((c) => (
              <li key={c.id}>
                <Link
                  href={routes.concept(locale, c.id)}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 transition-colors hover:border-accent/50 hover:bg-accent-soft"
                >
                  <span lang="en" className="type-serif text-[1.25rem]">{c.term}</span>
                  <ArrowRight className="size-4 text-ink-2" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </PlaygroundProvider>
  );
}
