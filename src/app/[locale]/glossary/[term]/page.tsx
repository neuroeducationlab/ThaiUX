import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CircleAlert, Volume2 } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/config";
import { format, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container, DifficultyDots, Tag } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ConceptDemo } from "@/components/demos/registry";
import { SaveButton } from "@/components/glossary/save-button";
import { Takeaway } from "@/components/content/takeaway";
import { SourceList } from "@/components/content/source-list";
import { getConcept, glossary, neighbours } from "@/content/glossary";
import { modulesForConcept } from "@/content/modules";

export const dynamicParams = false;

export function generateStaticParams() {
  return glossary.map((c) => ({ term: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/glossary/[term]">): Promise<Metadata> {
  const { term } = await params;
  const { locale } = await getI18n();
  const c = getConcept(term);
  if (!c) return {};
  const local = locale === "en" ? "" : ` · ${pick(c.localTerm, locale)}`;
  return pageMetadata(locale, `/glossary/${c.id}`, `${c.term}${local}`, pick(c.short, locale));
}

export default async function ConceptPage({ params }: PageProps<"/[locale]/glossary/[term]">) {
  const { term } = await params;
  const { locale, dict } = await getI18n();
  const c = getConcept(term);
  if (!c) notFound();

  const index = glossary.findIndex((x) => x.id === c.id);
  const { prev, next } = neighbours(c.id);
  const related = c.related.map((id) => getConcept(id)).filter(Boolean) as typeof glossary;
  const taughtIn = modulesForConcept(c.id);
  const level =
    c.difficulty === 1 ? dict.difficulty.beginner : c.difficulty === 2 ? dict.difficulty.intermediate : dict.difficulty.advanced;

  return (
    <article>
      <Container className="pt-8 md:pt-12">
        <Breadcrumbs
          label={dict.a11y.breadcrumb}
          items={[
            { href: routes.home(locale), label: dict.common.home },
            { href: routes.glossary(locale), label: dict.glossary.title },
            { href: `${routes.glossary(locale)}?category=${c.categories[0]}`, label: dict.categories[c.categories[0]] },
            { label: c.term, lang: "en" },
          ]}
        />

        {/* 1-minute version: name → meaning → experience → remember */}
        <header className="mb-10 md:mb-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Tag tone="accent">{dict.categories[c.categories[0]]}</Tag>
              <DifficultyDots level={c.difficulty} label={level} />
              <span className="tabular text-[0.8125rem] text-ink-2">
                {format(dict.glossary.conceptOf, { n: index + 1, total: glossary.length })}
              </span>
            </div>
            <SaveButton conceptId={c.id} />
          </div>

          <h1 lang="en" className="type-headword text-ink">
            {c.term}
          </h1>

          <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem]">
            {c.ipa ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">{dict.glossary.pronunciation}</dt>
                <Volume2 className="size-4 text-ink-3" aria-hidden />
                <dd lang="en" className="font-mono text-ink-2" title={dict.glossary.pronunciation}>
                  {c.ipa}
                </dd>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <dt className="text-ink-2">{locale === "en" ? dict.glossary.localName : localeMeta[locale].label}:</dt>
              <dd className="font-semibold text-accent-ink">{pick(c.localTerm, locale)}</dd>
            </div>
          </dl>

          <p className="mt-6 max-w-3xl text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-normal font-medium text-ink text-pretty">
            {pick(c.short, locale)}
          </p>
        </header>

        <ConceptDemo
          demo={c.demo}
          conceptId={c.id}
          term={c.term}
          instruction={pick(c.instruction, locale)}
          label={dict.glossary.tryIt}
        />

        <Takeaway label={dict.glossary.takeaway} className="mt-10">
          {pick(c.takeaway, locale)}
        </Takeaway>
      </Container>

      {/* Depth for those who want it */}
      <Container className="mt-20">
        <h2 className="type-h2 mb-10">{dict.glossary.goDeeper}</h2>
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
          <section>
            <h3 className="type-label mb-3">{dict.glossary.problem}</h3>
            <p className="text-[1.125rem] leading-relaxed text-ink">{pick(c.problem, locale)}</p>
          </section>
          <section>
            <h3 className="type-label mb-3">{dict.glossary.how}</h3>
            <div className="prose-thaiux text-ink-2">
              {pick(c.how, locale).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
          <section>
            <h3 className="type-label mb-3">{dict.glossary.inPractice}</h3>
            <ul className="prose-thaiux text-ink-2">
              {pick(c.inPractice, locale).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-[var(--radius-lg)] border border-warning/25 bg-warning-soft p-6">
            <h3 className="type-label mb-3 flex items-center gap-2 text-warning">
              <CircleAlert className="size-4" aria-hidden />
              {dict.glossary.mistake}
            </h3>
            <p className="text-ink">{pick(c.mistake, locale)}</p>
          </section>
        </div>
      </Container>

      <Container className="mt-20 grid gap-14 lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="type-h3 mb-5">{dict.glossary.related}</h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={routes.concept(locale, r.id)}
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface pr-3 pl-4 transition-colors hover:border-accent/50 hover:bg-accent-soft"
                >
                  <span lang="en" className="type-serif text-[1.125rem]">{r.term}</span>
                  {locale !== "en" ? <span className="text-[0.8125rem] text-ink-2">{pick(r.localTerm, locale).split(" · ")[0]}</span> : null}
                  <ArrowRight className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          {taughtIn.length ? (
            <div className="mt-10">
              <h2 className="type-h3 mb-5">{dict.glossary.taughtIn}</h2>
              <ul className="space-y-2">
                {taughtIn.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={routes.module(locale, m.id)}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
                    >
                      <BookOpen className="size-4 text-accent-ink" aria-hidden />
                      <span className="text-[0.8125rem] text-ink-2">{format(dict.learn.module, { n: m.number })}</span>
                      <span className="font-medium text-ink">{pick(m.title, locale)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="type-h3 mb-5">{dict.glossary.sources}</h2>
          <SourceList ids={c.sources} note={dict.glossary.synthesis} newTab={dict.a11y.newTab} />
        </section>
      </Container>

      <Container className="mt-20">
        <nav aria-label={dict.common.next} className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={routes.concept(locale, prev.id)} className="group flex flex-col rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
              <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {dict.common.previous}
              </span>
              <span lang="en" className="type-serif mt-1 text-2xl">{prev.term}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={routes.concept(locale, next.id)} className="group flex flex-col items-end rounded-[var(--radius-lg)] border border-line p-5 text-right transition-colors hover:bg-surface">
              <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                {dict.common.next} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span lang="en" className="type-serif mt-1 text-2xl">{next.term}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </article>
  );
}
