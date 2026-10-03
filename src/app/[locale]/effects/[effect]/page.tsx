import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Ban, Info, Lightbulb, Target } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { isTranslated, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container, DifficultyDots, Tag } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PlaygroundProvider } from "@/components/effects/provider";
import { EffectShowcase } from "@/components/effects/effect-card";
import { PromptBlock } from "@/components/effects/prompt-block";
import { effectCategories, effectNeighbours, effects, getEffect } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { getConcept } from "@/content/glossary";

export const dynamicParams = false;

export function generateStaticParams() {
  return effects.map((e) => ({ effect: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/effects/[effect]">): Promise<Metadata> {
  const { effect: id } = await params;
  const { locale } = await getI18n();
  const e = getEffect(id);
  if (!e) return {};
  return pageMetadata(locale, `/effects/${e.id}`, `${e.name} · ${pick(C.metaTitle, locale)}`, pick(e.tagline, locale));
}

export default async function EffectPage({ params }: PageProps<"/[locale]/effects/[effect]">) {
  const { effect: id } = await params;
  const { locale, dict } = await getI18n();
  const e = getEffect(id);
  if (!e) notFound();

  const { prev, next } = effectNeighbours(e.id);
  const category = effectCategories.find((c) => c.id === e.category)!;
  const levels = [dict.difficulty.beginner, dict.difficulty.intermediate, dict.difficulty.advanced];
  const related = e.related.map((cid) => getConcept(cid)).filter((c): c is NonNullable<typeof c> => !!c);
  const lang = (v: Parameters<typeof isTranslated>[0]) => (isTranslated(v, locale) ? undefined : "en");
  const englishDetails = !isTranslated(e.why, locale) && pick(C.englishNote, locale);

  const notes = [
    { key: "why", icon: Lightbulb, title: pick(C.why, locale), body: e.why },
    { key: "use", icon: Target, title: pick(C.use, locale), body: e.use },
    { key: "avoid", icon: Ban, title: pick(C.avoid, locale), body: e.avoid },
  ];

  return (
    <PlaygroundProvider>
      <article>
        <Container size="wide" className="pt-8 md:pt-12">
          <Breadcrumbs
            label={dict.a11y.breadcrumb}
            items={[
              { href: routes.home(locale), label: dict.common.home },
              { href: routes.effects(locale), label: dict.nav.effects },
              { label: e.name },
            ]}
          />
          <header className="max-w-4xl pb-8 md:pb-10">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.875rem]">
              <span className="font-semibold text-accent-ink">{pick(category.label, locale)}</span>
              <DifficultyDots level={e.level} label={levels[e.level - 1]} />
              <span className="sr-only">{pick(C.builtWith, locale)}:</span>
              <span className="flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <Tag key={t} lang="en">
                    {t}
                  </Tag>
                ))}
              </span>
            </p>
            <h1 lang="en" className="type-headword mt-4">
              {e.name}
            </h1>
            {locale !== "en" ? <p className="mt-3 text-[1.25rem] font-medium text-ink-2">{pick(e.localName, locale)}</p> : null}
            <p className="type-lead mt-4 measure-wide">{pick(e.tagline, locale)}</p>
          </header>

          <EffectShowcase id={e.id} name={e.name} tryText={pick(e.try, locale)} />

          {englishDetails ? (
            <p className="mt-10 flex max-w-3xl items-start gap-2 rounded-[var(--radius-md)] bg-accent-soft p-4 text-[0.9375rem] text-ink">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden /> {englishDetails}
            </p>
          ) : null}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {notes.map(({ key, icon: Icon, title, body }) => (
              <section key={key} aria-labelledby={`${key}-h`} className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
                <h2 id={`${key}-h`} className="flex items-center gap-2 text-[1rem] font-semibold text-ink">
                  <Icon className="size-4 text-accent-ink" aria-hidden /> {title}
                </h2>
                <p lang={lang(body)} className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                  {pick(body, locale)}
                </p>
              </section>
            ))}
          </div>

          <section id="prompt" aria-labelledby="prompt-h" className="mt-16 scroll-mt-20">
            <h2 id="prompt-h" className="type-h2">{pick(C.promptTitle, locale)}</h2>
            <p className="type-lead measure-wide mt-4">{pick(C.promptLead, locale)}</p>
            <PromptBlock parts={e.prompt} className="mt-8" />
            {locale !== "en" ? <p className="type-caption mt-3 max-w-3xl">{pick(C.promptEnglish, locale)}</p> : null}
          </section>

          <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <section aria-labelledby="related-h">
              <h2 id="related-h" className="type-h3 mb-4">{pick(C.related, locale)}</h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={routes.concept(locale, c.id)}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 transition-colors hover:border-accent/50 hover:bg-accent-soft"
                    >
                      <span lang="en" className="type-serif text-[1.125rem]">{c.term}</span>
                      <ArrowRight className="size-4 text-ink-2" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <nav aria-label={dict.nav.effects} className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              {prev ? (
                <Link href={routes.effect(locale, prev.id)} className="group block rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                  <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {pick(C.prev, locale)}
                  </span>
                  <span lang="en" className="type-title mt-1 block">{prev.name}</span>
                </Link>
              ) : null}
              {next ? (
                <Link href={routes.effect(locale, next.id)} className="group block rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                  <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                    {pick(C.next, locale)} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                  <span lang="en" className="type-title mt-1 block">{next.name}</span>
                </Link>
              ) : null}
              <Link
                href={routes.effects(locale)}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-semibold text-accent-ink transition-colors hover:bg-surface-2"
              >
                <ArrowLeft className="size-4" aria-hidden /> {pick(C.allEffects, locale)}
              </Link>
            </nav>
          </div>
        </Container>
      </article>
    </PlaygroundProvider>
  );
}
