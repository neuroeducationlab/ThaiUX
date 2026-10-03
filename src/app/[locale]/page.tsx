import Link from "next/link";
import { ArrowRight, Clock, HeartHandshake, Shapes, Sparkles } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { localeMeta, locales } from "@/i18n/config";
import { format, pick } from "@/i18n/localized";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { HeroStage } from "@/components/home/hero-stage";
import { ConceptDemo } from "@/components/demos/registry";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { LabThumb } from "@/components/lab/lab-thumb";
import { LabDoneBadge } from "@/components/lab/lab-done-badge";
import { PlaygroundProvider } from "@/components/effects/provider";
import { EffectsRail, type RailItem } from "@/components/effects/effects-rail";
import { categoryOrder, conceptsIn, getConcept, glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
import { experiments } from "@/content/lab";
import { effectCategories, effects, getEffect } from "@/content/effects";
import { effectsCopy } from "@/content/effects-copy";
import { home } from "@/content/home";

/**
 * Home — the brief’s sections in order: hero, the Effects library (promoted
 * right after the hero so people find it), what is UX, explore concepts,
 * interactive preview, the Lab, learning path, about (+ footer from the
 * layout). Every section ends in one clear next step.
 */
export default async function Home() {
  const { locale, dict } = await getI18n();
  const h = home;
  const featured = getConcept("affordance");

  const railItems: RailItem[] = h.effects.featured
    .map((id) => getEffect(id))
    .filter((e): e is NonNullable<typeof e> => !!e)
    .map((e) => ({
      id: e.id,
      name: e.name,
      categoryLabel: pick(effectCategories.find((c) => c.id === e.category)!.label, locale),
      href: routes.effect(locale, e.id),
      prompt: e.prompt,
    }));

  const stats = [
    { n: glossary.length, label: pick(h.hero.stats.concepts, locale) },
    { n: modules.length, label: pick(h.hero.stats.modules, locale) },
    { n: experiments.length, label: pick(h.hero.stats.experiments, locale) },
    { n: locales.length, label: pick(h.hero.stats.languages, locale) },
  ];

  return (
    <>
      {/* 1 · Hero */}
      <section aria-labelledby="hero-h">
        <Container size="wide" className="grid items-center gap-12 pt-10 pb-12 md:pt-16 md:pb-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16 lg:pt-20 lg:pb-20">
          <div>
            <Link
              href={routes.effects(locale)}
              className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3.5 pl-1 text-[0.8125rem] font-medium text-ink shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-accent/40 hover:shadow-sm"
            >
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide text-on-accent uppercase">
                {pick(h.effects.badge, locale)}
              </span>
              <span className="truncate">{format(pick(h.effects.announce, locale), { n: effects.length })}</span>
              <ArrowRight className="size-3.5 shrink-0 text-accent-ink transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
            <h1 id="hero-h" className="type-display text-[clamp(2.5rem,1.5rem+3.6vw,4.75rem)]">
              {locale === "en" ? (
                <>
                  Learn UX by <span className="type-serif-accent text-accent-ink">experiencing</span> it.
                </>
              ) : (
                pick(h.hero.title, locale)
              )}
            </h1>
            {locale !== "en" ? (
              <p lang="en" className="type-serif-accent mt-4 text-[clamp(1.5rem,1.2rem+1.1vw,2.25rem)] leading-tight text-accent-ink">
                {h.hero.serifLine}
              </p>
            ) : null}
            <p className="type-lead mt-6 max-w-[36rem]">{pick(h.hero.lead, locale)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={routes.glossary(locale)} size="lg">
                {pick(h.hero.primary, locale)} <ArrowRight className="size-[1.125rem]" aria-hidden />
              </ButtonLink>
              <ButtonLink href={routes.lab(locale)} size="lg" variant="secondary">
                {pick(h.hero.secondary, locale)}
              </ButtonLink>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-4 gap-4 border-t border-line pt-6">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="text-[0.8125rem] text-ink-2">{s.label}</dt>
                  <dd className="tabular text-[1.75rem] leading-none font-semibold tracking-tight text-ink">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroStage />
        </Container>
      </section>

      {/* 2 · Effects library — promoted right after the hero */}
      <PlaygroundProvider>
        <Section aria-labelledby="effects-h" className="border-t border-line pt-12 md:pt-16">
          <Container size="wide">
            <SectionHeader
              id="effects-h"
              eyebrow={
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4" aria-hidden /> {pick(h.effects.eyebrow, locale)}
                </span>
              }
              title={pick(h.effects.title, locale)}
              lead={format(pick(h.effects.lead, locale), { n: effects.length })}
              action={
                <ButtonLink href={routes.effects(locale)}>
                  {format(pick(h.effects.cta, locale), { n: effects.length })} <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              }
            />
            <EffectsRail
              items={railItems}
              labels={{
                hintMouse: pick(h.effects.hintMouse, locale),
                hintTouch: pick(h.effects.hintTouch, locale),
                pause: pick(h.effects.pause, locale),
                play: pick(h.effects.play, locale),
                prev: pick(h.effects.prev, locale),
                next: pick(h.effects.next, locale),
                region: pick(h.effects.region, locale),
                howToBuild: pick(effectsCopy.howToBuild, locale),
              }}
            />
          </Container>
        </Section>
      </PlaygroundProvider>

      {/* 3 · What is UX? */}
      <Section aria-labelledby="what-h" className="border-t border-line">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div>
              <Eyebrow>{pick(h.what.eyebrow, locale)}</Eyebrow>
              <h2 id="what-h" className="type-h1">{pick(h.what.title, locale)}</h2>
              <p className="type-lead mt-6 max-w-[40rem]">{pick(h.what.body, locale)}</p>
              <Link
                href={routes.module(locale, modules[0].id)}
                className="group mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-ink underline-offset-4 hover:underline"
              >
                {pick(h.what.cta, locale)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 self-center sm:gap-4">
              {(
                [
                  { label: h.what.uxLabel, items: h.what.ux, Icon: HeartHandshake },
                  { label: h.what.uiLabel, items: h.what.ui, Icon: Shapes },
                ] as const
              ).map(({ label, items, Icon }) => (
                <div key={pick(label, "en")} className="squircle rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-xs sm:p-6">
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent-ink sm:size-10" aria-hidden>
                    <Icon className="size-[1.125rem] sm:size-5" />
                  </span>
                  <h3 className="mt-3 text-[1rem] leading-snug font-semibold sm:mt-4 sm:text-[1.125rem]">{pick(label, locale)}</h3>
                  <ul className="mt-2 space-y-1.5 text-[0.8125rem] text-ink-2 sm:mt-3 sm:space-y-2 sm:text-[0.9375rem]">
                    {pick(items, locale).map((q) => (
                      <li key={q} className="flex gap-2">
                        <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-ink-3" aria-hidden />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* One inline row instead of a card grid: shorter, and the arrow is the diagram. */}
          <div className="mt-14">
            <p className="type-label mb-3">{pick(h.what.pathTitle, locale)}</p>
            <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.9375rem] text-ink-2 sm:text-[1rem]">
              {h.what.path.map((step, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  {i > 0 ? <ArrowRight className="size-3.5 self-center text-ink-3" aria-hidden /> : null}
                  <span className="font-semibold text-ink">{pick(step.title, locale)}</span>
                  <span className="text-ink-2">{pick(step.desc, locale)}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* 4 · Explore concepts */}
      <Section aria-labelledby="explore-h" className="pt-0 md:pt-0">
        <Container size="wide">
          <SectionHeader
            id="explore-h"
            eyebrow={pick(h.explore.eyebrow, locale)}
            title={format(pick(h.explore.title, locale), { n: glossary.length })}
            lead={pick(h.explore.lead, locale)}
            action={
              <ButtonLink href={routes.glossary(locale)} variant="secondary">
                {pick(h.explore.all, locale)} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryOrder.map((cat) => {
              const items = conceptsIn(cat);
              return (
                <li
                  key={cat}
                  className="squircle group relative flex flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-xs sm:p-6 transition-[box-shadow,transform,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus motion-reduce:hover:translate-y-0"
                >
                  <p className="tabular text-[0.8125rem] font-semibold text-ink-2">{format(dict.glossary.count, { n: items.length })}</p>
                  <h3 className="type-h3 mt-1">
                    <Link href={`${routes.glossary(locale)}?category=${cat}`} className="outline-none after:absolute after:inset-0">
                      {dict.categories[cat]}
                    </Link>
                  </h3>
                  <p className="mt-2 hidden text-[0.9375rem] text-ink-2 sm:block">{dict.categories[`${cat}Desc` as const]}</p>
                  <p lang="en" className="type-serif mt-auto pt-3 text-[1.1875rem] leading-snug text-ink sm:pt-6 sm:text-[1.375rem]" aria-hidden>
                    {items.slice(0, 4).map((c, i, all) => (
                      <span key={c.id}>
                        <span className="whitespace-nowrap">
                          {c.term}
                          {i < all.length - 1 ? <span className="text-ink-2"> ·</span> : null}
                        </span>{" "}
                      </span>
                    ))}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* 5 · Interactive preview */}
      {featured ? (
        <Section tone="tinted" aria-labelledby="preview-h">
          <Container size="wide" className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>{pick(h.preview.eyebrow, locale)}</Eyebrow>
              <h2 id="preview-h" className="type-h2">{pick(h.preview.title, locale)}</h2>
              <div className="mt-8 border-l-2 border-accent pl-5">
                <p lang="en" className="type-serif text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none">{featured.term}</p>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{pick(featured.localTerm, locale)}</p>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink">{pick(featured.short, locale)}</p>
                <p className="mt-3 text-[0.9375rem] text-ink-2">
                  <span className="font-semibold text-ink">{dict.glossary.problem}:</span> {pick(featured.problem, locale)}
                </p>
                <Link
                  href={routes.concept(locale, featured.id)}
                  className="group mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-ink underline-offset-4 hover:underline"
                >
                  {pick(h.preview.open, locale)}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </div>
            </div>
            <ConceptDemo demo={featured.demo} conceptId={featured.id} term={featured.term} instruction={pick(featured.instruction, locale)} />
          </Container>
        </Section>
      ) : null}

      {/* 6 · Molly’s UX Lab */}
      <Section aria-labelledby="lab-h">
        <Container size="wide">
          <SectionHeader
            id="lab-h"
            eyebrow={pick(h.lab.eyebrow, locale)}
            title={dict.lab.title}
            lead={dict.lab.subtitle}
            action={
              <ButtonLink href={routes.lab(locale)}>
                {pick(h.hero.secondary, locale)} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            }
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {experiments.map((e) => (
              <li
                key={e.id}
                className="squircle group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-xs transition-[box-shadow,transform,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus motion-reduce:hover:translate-y-0"
              >
                <div className="aspect-[4/3] border-b border-line bg-surface-2 sm:aspect-[16/10]">
                  <LabThumb id={e.id} />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex min-h-6 flex-wrap items-center justify-between gap-1.5">
                    <p className="text-[0.8125rem] font-semibold text-accent-ink">{format(dict.lab.experiment, { letter: e.letter })}</p>
                    <LabDoneBadge id={e.id} label={dict.progress.completed} />
                  </div>
                  <h3 className="type-title mt-1">
                    <Link href={routes.experiment(locale, e.id)} className="outline-none after:absolute after:inset-0">
                      {pick(e.title, locale)}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.8125rem] text-ink-2 sm:text-[0.9375rem]">{pick(e.question, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 7 · Learning path */}
      <Section tone="tinted" aria-labelledby="path-h">
        <Container size="wide" className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <Eyebrow>{pick(h.path.eyebrow, locale)}</Eyebrow>
            <h2 id="path-h" className="type-h2">{pick(h.path.title, locale)}</h2>
            <p className="type-lead mt-5">{pick(h.path.lead, locale)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.module(locale, modules[0].id)}>
                {pick(h.path.start, locale)} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={routes.learn(locale)} variant="secondary">
                {dict.common.seeAll}
              </ButtonLink>
            </div>
            <ProgressSummary kind="modules" total={modules.length} className="mt-10 max-w-xs" />
          </div>
          <ol className="grid self-start overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface sm:grid-cols-2">
            {modules.map((m, i) => (
              <li key={m.id} className={cn("border-line", i > 0 && "border-t", i === 1 && "sm:border-t-0", i % 2 === 1 && "sm:border-l")}>
                <Link href={routes.module(locale, m.id)} className="group flex h-full gap-4 p-5 transition-colors hover:bg-surface-2">
                  <span className="tabular w-7 shrink-0 pt-0.5 text-[0.9375rem] font-semibold text-accent-ink">{String(m.number).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{pick(m.title, locale)}</span>
                    <span className="mt-1 flex items-center gap-1 text-[0.8125rem] text-ink-2">
                      <Clock className="size-3.5" aria-hidden /> {format(dict.common.minutes, { n: m.minutes })}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 8 · About the project */}
      <Section aria-labelledby="about-h">
        <Container size="narrow" className="text-center">
          <Eyebrow>{pick(h.about.eyebrow, locale)}</Eyebrow>
          <h2 id="about-h" className="type-h2">{pick(h.about.title, locale)}</h2>
          <p className="type-lead mt-6 text-pretty">{pick(h.about.body, locale)}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={routes.about(locale)} variant="secondary">
              {pick(h.about.more, locale)}
            </ButtonLink>
            <ButtonLink href={routes.caseStudy(locale)} variant="ghost">
              {pick(h.about.caseStudy, locale)} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[0.9375rem]">
            <span className="mr-2 text-ink-2">{pick(h.about.languages, locale)}</span>
            {locales.map((l) => (
              <Link
                key={l}
                href={routes.home(l)}
                lang={localeMeta[l].htmlLang}
                hrefLang={localeMeta[l].hreflang}
                aria-current={l === locale ? "true" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-full px-4 transition-colors",
                  l === locale ? "bg-surface-3 font-semibold text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )}
              >
                {localeMeta[l].label}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
