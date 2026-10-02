import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container, Tag } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LabExperiment } from "@/components/lab/registry";
import { experimentNeighbours, experiments, getExperiment } from "@/content/lab";
import { getConcept } from "@/content/glossary";

export const dynamicParams = false;

export function generateStaticParams() {
  return experiments.map((e) => ({ experiment: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/lab/[experiment]">): Promise<Metadata> {
  const { experiment: id } = await params;
  const { locale, dict } = await getI18n();
  const e = getExperiment(id);
  if (!e) return {};
  const title = `${pick(e.title, locale)} · ${dict.lab.title}`;
  return pageMetadata(locale, `/lab/${e.id}`, title, pick(e.summary, locale));
}

export default async function ExperimentPage({ params }: PageProps<"/[locale]/lab/[experiment]">) {
  const { experiment: id } = await params;
  const { locale, dict } = await getI18n();
  const e = getExperiment(id);
  if (!e) notFound();
  const { next } = experimentNeighbours(e.id);
  const concepts = e.concepts.map((cid) => getConcept(cid)).filter((c): c is NonNullable<typeof c> => !!c);
  const label = format(dict.lab.experiment, { letter: e.letter });

  return (
    <article>
      <Container size="wide" className="pt-8 md:pt-12">
        <Breadcrumbs
          label={dict.a11y.breadcrumb}
          items={[
            { href: routes.home(locale), label: dict.common.home },
            { href: routes.lab(locale), label: dict.lab.title },
            { label },
          ]}
        />
        <header className="max-w-3xl pb-10 md:pb-14">
          <p className="flex items-center gap-3 text-[0.875rem]">
            <span className="font-semibold text-accent-ink">{label}</span>
            <span className="flex items-center gap-1 text-ink-2">
              <Clock className="size-4" aria-hidden /> {format(dict.common.minutes, { n: e.minutes })}
            </span>
          </p>
          <h1 className="type-h1 mt-3">{pick(e.title, locale)}</h1>
          <p className="mt-4 text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-snug font-medium text-ink">{pick(e.question, locale)}</p>
          <p className="type-lead mt-4">{pick(e.summary, locale)}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] font-semibold text-ink-2">{dict.lab.skills}</span>
            <ul className="flex flex-wrap gap-1.5">
              {pick(e.skills, locale).map((s) => (
                <li key={s}>
                  <Tag tone="accent">{s}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <LabExperiment id={e.id} />

        <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <section aria-labelledby="concepts-h">
            <h2 id="concepts-h" className="type-h3 mb-4">{dict.learn.concepts}</h2>
            <ul className="flex flex-wrap gap-2">
              {concepts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={routes.concept(locale, c.id)}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 transition-colors hover:border-accent/50 hover:bg-accent-soft"
                  >
                    <span lang="en" className="type-serif text-[1.125rem]">{c.term}</span>
                    <ArrowRight className="size-4 text-ink-3" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label={dict.lab.title} className="space-y-3">
            {next ? (
              <Link href={routes.experiment(locale, next.id)} className="group block rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                  {format(dict.lab.experiment, { letter: next.letter })}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </span>
                <span className="type-title mt-1 block">{pick(next.title, locale)}</span>
              </Link>
            ) : (
              <Link href={routes.learn(locale)} className="group block rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                  {dict.nav.learn}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </span>
                <span className="type-title mt-1 block">{dict.learn.pathTitle}</span>
              </Link>
            )}
            <Link
              href={routes.lab(locale)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-semibold text-accent-ink transition-colors hover:bg-surface-2"
            >
              <ArrowLeft className="size-4" aria-hidden /> {dict.lab.backToLab}
            </Link>
          </nav>
        </div>
      </Container>
    </article>
  );
}
