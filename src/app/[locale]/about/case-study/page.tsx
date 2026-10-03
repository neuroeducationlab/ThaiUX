import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Info } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { locales } from "@/i18n/config";
import { isTranslated, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionNav } from "@/components/learn/section-nav";
import { caseStudy } from "@/content/case-study";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
import { experiments } from "@/content/lab";
import { sources } from "@/content/sources";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const title = pick(caseStudy.title, locale);
  return pageMetadata(locale, "/about/case-study", title, pick(caseStudy.question, locale));
}

export default async function CaseStudyPage() {
  const { locale, dict } = await getI18n();
  const cs = caseStudy;
  const L = cs.labels;
  // Chinese and Japanese readers get the English text, marked up as English
  // element by element (UI labels that are translated keep the page language).
  const translated = isTranslated(cs.title, locale);
  const langOf = <T,>(v: Parameters<typeof isTranslated<T>>[0]) => (isTranslated(v, locale) ? undefined : "en");
  const pagesPerLocale = 1 + 1 + modules.length + 1 + glossary.length + 1 + experiments.length + 3;

  const stats = [
    { n: glossary.length, label: L.stats.concepts },
    { n: modules.length, label: L.stats.modules },
    { n: experiments.length, label: L.stats.experiments },
    { n: locales.length, label: L.stats.languages },
    { n: pagesPerLocale * locales.length, label: L.stats.pages },
    { n: Object.keys(sources).length, label: L.stats.sources },
  ];

  return (
    <article>
      <Container size="wide" className="pt-8 md:pt-12">
        <Breadcrumbs
          label={dict.a11y.breadcrumb}
          items={[
            { href: routes.home(locale), label: dict.common.home },
            { href: routes.about(locale), label: dict.nav.about },
            { label: pick(cs.eyebrow, locale) },
          ]}
        />
        {!translated && cs.notice[locale] ? (
          <p className="mb-8 flex max-w-3xl items-start gap-2 rounded-[var(--radius-md)] bg-accent-soft p-4 text-[0.9375rem] text-ink">
            <Info className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden /> {cs.notice[locale]}
          </p>
        ) : null}
        <header className="max-w-4xl pb-10">
          <p lang="en" className="type-label mb-3 text-accent-ink">{pick(cs.eyebrow, locale)}</p>
          <h1 lang={langOf(cs.title)} className="type-h1">{pick(cs.title, locale)}</h1>
          <p lang={langOf(cs.question)} className="mt-6 text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-snug font-medium text-ink">{pick(cs.question, locale)}</p>
          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {cs.meta.map((m) => (
              <div key={pick(m.label, "en")}>
                <dt className="type-label">{pick(m.label, locale)}</dt>
                <dd lang={langOf(m.value)} className="mt-1.5 text-[0.9375rem] text-ink">{pick(m.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section aria-labelledby="tldr-h" className="mb-14 border-t border-line pt-6">
          <h2 id="tldr-h" className="type-label mb-5">{pick(L.tldr, locale)}</h2>
          <dl className="grid gap-6 md:grid-cols-3 md:gap-8">
            {cs.tldr.map((t) => (
              <div key={pick(t.label, "en")} className="min-w-0">
                <dt className="type-label text-accent-ink">{pick(t.label, locale)}</dt>
                <dd lang={langOf(t.text)} className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{pick(t.text, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>

      <Container size="wide" className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block">
          <div lang={translated ? undefined : "en"}>
            <SectionNav items={cs.sections.map((s) => ({ id: s.id, label: pick(s.title, locale) }))} label={pick(L.contents, locale)} />
          </div>
        </aside>

        <div className="min-w-0 space-y-10 md:space-y-14">
          {cs.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} lang={langOf(s.title)} className="scroll-mt-24">
              <p className="tabular text-[0.8125rem] font-semibold text-accent-ink" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 id={`${s.id}-h`} className="type-h2 mt-1">{pick(s.title, locale)}</h2>
              <div className="measure-wide mt-4 space-y-3 text-[1.0625rem] leading-relaxed text-ink-2">
                {pick(s.body, locale).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>

              {s.id === "users" ? (
                <ul className="mt-5 grid gap-3 md:grid-cols-3">
                  {cs.personas.map((p) => (
                    <li key={pick(p.name, "en")} className="rounded-[var(--radius-lg)] border border-line bg-surface p-4">
                      <p lang={langOf(p.name)} className="font-semibold text-ink">{pick(p.name, locale)}</p>
                      <p lang={langOf(p.note)} className="mt-1 text-[0.9375rem] text-ink-2">{pick(p.note, locale)}</p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {s.id === "ux" ? (
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {cs.decisions.map((d) => (
                    <li key={pick(d.title, "en")} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
                      <p className="type-label text-accent-ink">{pick(L.decision, locale)}</p>
                      <h3 className="type-title mt-1">{pick(d.title, locale)}</h3>
                      <p className="mt-2.5 text-[0.9375rem] text-ink">
                        <span className="font-semibold">{pick(L.why, locale)}: </span>
                        {pick(d.why, locale)}
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] text-ink-2">
                        <span className="font-semibold">{pick(L.tradeoff, locale)}: </span>
                        {pick(d.tradeoff, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {s.id === "iteration" ? (
                <ol className="mt-6 space-y-3">
                  {cs.iterations.map((it, j) => (
                    <li key={j} className="grid gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-5 md:grid-cols-2 md:gap-8">
                      <div>
                        <p className="type-label text-error">{pick(L.finding, locale)}</p>
                        <p className="mt-1 text-ink">{pick(it.finding, locale)}</p>
                      </div>
                      <div>
                        <p className="type-label text-success">{pick(L.fix, locale)}</p>
                        <p className="mt-1 text-ink">{pick(it.fix, locale)}</p>
                        <p className="mt-1.5 text-[0.8125rem] font-medium text-accent-ink">{pick(it.principle, locale)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}

              {s.id === "outcome" ? (
                <dl lang={langOf(L.stats.concepts)} className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-3">
                  {stats.map((st) => (
                    <div key={pick(st.label, "en")} className="flex flex-col-reverse bg-surface p-5">
                      <dt className="mt-1 text-[0.875rem] text-ink-2">{pick(st.label, locale)}</dt>
                      <dd className="tabular text-[2rem] leading-none font-semibold tracking-tight text-ink">{st.n}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ))}

          <div className="flex flex-col gap-3 border-t border-line pt-10 sm:flex-row sm:flex-wrap">
            <a
              href={`${site.repo}/tree/main/docs/process`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-ink underline-offset-4 hover:underline"
            >
              <span lang={langOf(L.process)}>{pick(L.process, locale)}</span> <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">{dict.a11y.newTab}</span>
            </a>
            <Link
              href={routes.designSystem(locale)}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-ink underline-offset-4 hover:underline sm:ml-auto"
            >
              {dict.footer.designSystem} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}
