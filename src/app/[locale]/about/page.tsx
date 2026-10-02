import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { alternatesFor } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { about } from "@/content/about";
import { sources, type Source } from "@/content/sources";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return { title: pick(about.title, locale), description: pick(about.lead, locale), alternates: alternatesFor(locale, "/about") };
}

/** Group the source registry by publisher, largest first. */
function byPublisher(): [string, Source[]][] {
  const groups = new Map<string, Source[]>();
  for (const s of Object.values(sources) as Source[]) {
    groups.set(s.publisher, [...(groups.get(s.publisher) ?? []), s]);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

export default async function AboutPage() {
  const { locale, dict } = await getI18n();
  const a = about;
  const groups = byPublisher();
  const total = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <>
      <Container>
        <PageHeader eyebrow={dict.nav.about} title={pick(a.title, locale)} lead={pick(a.lead, locale)} />
      </Container>

      <Container className="grid gap-6 pb-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12">
        <h2 className="type-label pt-1.5">{pick(a.story.title, locale)}</h2>
        <div className="measure-wide space-y-5 text-[clamp(1.125rem,1.06rem+0.3vw,1.3125rem)] leading-relaxed text-ink">
          {pick(a.story.body, locale).map((p, i) => (
            <p key={i} className={i === 0 ? "font-medium" : "text-ink-2"}>
              {p}
            </p>
          ))}
        </div>
      </Container>

      <Section aria-labelledby="principles-h">
        <Container>
          <h2 id="principles-h" className="type-h2 mb-10">{pick(a.principles.title, locale)}</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {a.principles.items.map((item, i) => (
              <li key={i} className="squircle rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-xs">
                <span className="tabular text-[0.8125rem] font-semibold text-accent-ink" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="type-title mt-1">{pick(item.title, locale)}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{pick(item.body, locale)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="tinted" aria-labelledby="process-h">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="process-h" className="type-h2">{pick(a.process.title, locale)}</h2>
            <p className="type-lead mt-5">{pick(a.process.body, locale)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.caseStudy(locale)}>
                {pick(a.process.caseStudy, locale)} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={routes.designSystem(locale)} variant="secondary">
                {pick(a.process.designSystem, locale)}
              </ButtonLink>
            </div>
          </div>
          <ol className="grid gap-2 self-center sm:grid-cols-2">
            {a.process.steps.map((step, i) => (
              <li key={i} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3">
                <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.75rem] font-semibold text-accent-ink" aria-hidden>
                  {i + 1}
                </span>
                <span className="font-medium text-ink">{pick(step, locale)}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section aria-label={`${pick(a.languages.title, locale)} · ${pick(a.privacy.title, locale)}`}>
        <Container className="grid gap-4 md:grid-cols-2">
          {[a.languages, a.privacy].map((block) => (
            <section key={pick(block.title, "en")} className="rounded-[var(--radius-xl)] border border-line bg-surface p-7">
              <h2 className="type-h3">{pick(block.title, locale)}</h2>
              <p className="mt-3 text-ink-2">{pick(block.body, locale)}</p>
            </section>
          ))}
        </Container>
      </Section>

      <Section id="sources" aria-labelledby="sources-h" className="scroll-mt-20 border-t border-line">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <h2 id="sources-h" className="type-h2">{pick(a.sources.title, locale)}</h2>
              <div className="mt-6 space-y-4 text-ink-2">
                {pick(a.sources.body, locale).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <a
                href={`${site.repo}/issues`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-ink underline-offset-4 hover:underline"
              >
                {pick(a.sources.issue, locale)} <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">{dict.a11y.newTab}</span>
              </a>
            </div>
            <div>
              <h3 className="type-title">{pick(a.sources.readingList, locale)}</h3>
              <p className="type-caption mt-1">{format(pick(a.sources.count, locale), { n: total, p: groups.length })}</p>
              <div className="mt-6 space-y-3">
                {groups.map(([publisher, list]) => (
                  <details key={publisher} className="group rounded-[var(--radius-lg)] border border-line bg-surface">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-medium text-ink [&::-webkit-details-marker]:hidden">
                      <span lang="en">{publisher}</span>
                      <span className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                        <span className="tabular">{list.length}</span>
                        <ArrowRight className="size-4 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none" aria-hidden />
                      </span>
                    </summary>
                    <ul className="divide-y divide-line border-t border-line">
                      {list.map((s) => (
                        <li key={s.url}>
                          <a href={s.url} target="_blank" rel="noreferrer" className="group/link flex items-start justify-between gap-4 px-5 py-3 transition-colors hover:bg-surface-2">
                            <span className="min-w-0" lang="en">
                              <span className="block text-[0.9375rem] text-ink group-hover/link:underline group-hover/link:underline-offset-4">{s.title}</span>
                              {s.author ? <span className="block text-[0.8125rem] text-ink-2">{s.author}</span> : null}
                            </span>
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-3" aria-hidden />
                            <span className="sr-only">{dict.a11y.newTab}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
