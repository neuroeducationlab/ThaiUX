import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, FlaskConical, MessageCircleQuestion, Quote } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionNav } from "@/components/learn/section-nav";
import { CompleteModule } from "@/components/learn/complete-module";
import { ModuleExample } from "@/components/examples/registry";
import { Takeaway } from "@/components/content/takeaway";
import { SourceList } from "@/components/content/source-list";
import { getModule, moduleNeighbours, modules } from "@/content/modules";
import { getConcept } from "@/content/glossary";
import { getExperiment } from "@/content/lab";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/learn/[module]">): Promise<Metadata> {
  const { module: id } = await params;
  const { locale, dict } = await getI18n();
  const m = getModule(id);
  if (!m) return {};
  const title = `${format(dict.learn.module, { n: m.number })} · ${pick(m.title, locale)}`;
  return pageMetadata(locale, `/learn/${m.id}`, title, pick(m.summary, locale));
}

export default async function ModulePage({ params }: PageProps<"/[locale]/learn/[module]">) {
  const { module: id } = await params;
  const { locale, dict } = await getI18n();
  const m = getModule(id);
  if (!m) notFound();
  const { prev, next } = moduleNeighbours(m.id);
  const title = pick(m.title, locale);

  const toc = [
    { id: "scenario", label: dict.learn.scenario },
    { id: "what", label: dict.learn.what },
    { id: "why", label: dict.learn.why },
    ...m.topics.map((t, i) => ({ id: `topic-${i + 1}`, label: pick(t.title, locale) })),
    { id: "example", label: dict.learn.example },
    { id: "takeaway", label: dict.learn.takeaway },
    { id: "reflect", label: dict.learn.reflect },
    { id: "further", label: dict.learn.sources },
  ];

  const concepts = m.concepts.map((cid) => getConcept(cid)).filter((c): c is NonNullable<typeof c> => !!c);
  const labs = m.lab.map((lid) => getExperiment(lid)).filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <article>
      <Container size="wide" className="pt-8 md:pt-12">
        <Breadcrumbs
          label={dict.a11y.breadcrumb}
          items={[
            { href: routes.home(locale), label: dict.common.home },
            { href: routes.learn(locale), label: dict.learn.title },
            { label: format(dict.learn.module, { n: m.number }) },
          ]}
        />
        <header className="max-w-3xl pb-12">
          <p className="flex items-center gap-3 text-[0.875rem]">
            <span className="font-semibold text-accent-ink">{format(dict.learn.module, { n: m.number })}</span>
            <span className="flex items-center gap-1 text-ink-2">
              <Clock className="size-4" aria-hidden /> {format(dict.common.minutes, { n: m.minutes })}
            </span>
          </p>
          <h1 className="type-h1 mt-3">{title}</h1>
          <p className="type-lead mt-5">{pick(m.summary, locale)}</p>
        </header>
      </Container>

      <Container size="wide" className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block">
          <SectionNav items={toc} label={dict.learn.inThisModule} />
        </aside>

        <div className="min-w-0 space-y-16">
          <section id="scenario" aria-labelledby="scenario-h" className="scroll-mt-24">
            <div className="squircle relative rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
              <Quote className="mb-4 size-6 text-accent" aria-hidden />
              <h2 id="scenario-h" className="type-label mb-3">{dict.learn.scenario}</h2>
              <p className="text-[clamp(1.125rem,1.05rem+0.4vw,1.375rem)] leading-relaxed text-ink">{pick(m.scenario, locale)}</p>
            </div>
          </section>

          <section id="what" aria-labelledby="what-h" className="measure-wide scroll-mt-24">
            <h2 id="what-h" className="type-h2 mb-5">{dict.learn.what}</h2>
            <div className="prose-uxlab text-[1.0625rem] text-ink-2">
              {pick(m.what, locale).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section id="why" aria-labelledby="why-h" className="measure-wide scroll-mt-24">
            <h2 id="why-h" className="type-h2 mb-5">{dict.learn.why}</h2>
            <div className="prose-uxlab text-[1.0625rem] text-ink-2">
              {pick(m.why, locale).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            {m.topics.map((t, i) => (
              <section
                key={i}
                id={`topic-${i + 1}`}
                aria-labelledby={`topic-${i + 1}-h`}
                className="scroll-mt-24 rounded-[var(--radius-lg)] border border-line bg-surface p-6"
              >
                <span className="tabular text-[0.8125rem] font-semibold text-accent-ink" aria-hidden>
                  0{i + 1}
                </span>
                <h3 id={`topic-${i + 1}-h`} className="type-h3 mt-1 mb-3">{pick(t.title, locale)}</h3>
                <p className="text-ink-2">{pick(t.body, locale)}</p>
              </section>
            ))}
          </div>

          <section id="example" aria-label={dict.learn.example} className="scroll-mt-24">
            <ModuleExample id={m.example.id} title={title} caption={pick(m.example.caption, locale)} label={dict.learn.example} />
          </section>

          <section id="takeaway" aria-label={dict.learn.takeaway} className="scroll-mt-24">
            <Takeaway label={dict.learn.takeaway}>{pick(m.takeaway, locale)}</Takeaway>
          </section>

          <section id="reflect" aria-labelledby="reflect-h" className="scroll-mt-24">
            <div className="rounded-[var(--radius-xl)] border border-accent/25 bg-accent-soft p-6 sm:p-8">
              <h2 id="reflect-h" className="type-label mb-3 flex items-center gap-2 text-accent-ink">
                <MessageCircleQuestion className="size-4" aria-hidden /> {dict.learn.reflect}
              </h2>
              <p className="text-[1.1875rem] leading-relaxed font-medium text-ink">{pick(m.reflect, locale)}</p>
              <p className="mt-3 text-[0.875rem] text-ink-2">{dict.learn.reflectHint}</p>
            </div>
          </section>

          <div className="grid gap-10 md:grid-cols-2">
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
            <section aria-labelledby="lab-h">
              <h2 id="lab-h" className="type-h3 mb-4">{dict.learn.practice}</h2>
              <ul className="space-y-2">
                {labs.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={routes.experiment(locale, e.id)}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface-2"
                    >
                      <FlaskConical className="size-4 text-accent-ink" aria-hidden />
                      <span className="text-[0.8125rem] text-ink-2">{format(dict.lab.experiment, { letter: e.letter })}</span>
                      <span className="font-medium text-ink">{pick(e.title, locale)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section id="further" aria-labelledby="further-h" className="scroll-mt-24">
            <h2 id="further-h" className="type-h3 mb-4">{dict.learn.sources}</h2>
            <SourceList ids={m.sources} note={dict.learn.synthesis} newTab={dict.a11y.newTab} />
          </section>

          <CompleteModule moduleId={m.id} allIds={modules.map((x) => x.id)} certificateHref={routes.certificate(locale)} />

          <nav aria-label={dict.learn.allModules} className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={routes.module(locale, prev.id)} className="group rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {dict.learn.prevModule}
                </span>
                <span className="type-title mt-1 block">{pick(prev.title, locale)}</span>
              </Link>
            ) : (
              <Link href={routes.learn(locale)} className="group rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:bg-surface">
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
                  <ArrowLeft className="size-4" aria-hidden /> {dict.learn.allModules}
                </span>
                <span className="type-title mt-1 block">{dict.learn.pathTitle}</span>
              </Link>
            )}
            {next ? (
              <Link href={routes.module(locale, next.id)} className="group rounded-[var(--radius-lg)] border border-line p-5 text-right transition-colors hover:bg-surface">
                <span className="flex items-center justify-end gap-1.5 text-[0.8125rem] text-ink-2">
                  {dict.learn.nextModule} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="type-title mt-1 block">{pick(next.title, locale)}</span>
              </Link>
            ) : (
              <Link href={routes.lab(locale)} className="group rounded-[var(--radius-lg)] border border-line p-5 text-right transition-colors hover:bg-surface">
                <span className="flex items-center justify-end gap-1.5 text-[0.8125rem] text-ink-2">
                  {dict.nav.lab} <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="type-title mt-1 block">{dict.lab.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </article>
  );
}
