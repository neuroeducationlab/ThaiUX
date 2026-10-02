import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Telescope } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { alternatesFor } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { Tag } from "@/components/ui/layout";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { LabThumb } from "@/components/lab/lab-thumb";
import { LabDoneBadge } from "@/components/lab/lab-done-badge";
import { experiments, realWorld } from "@/content/lab";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.lab.title, description: dict.lab.subtitle, alternates: alternatesFor(locale, "/lab") };
}

export default async function LabPage() {
  const { locale, dict } = await getI18n();

  return (
    <Container>
      <PageHeader eyebrow={dict.nav.lab} title={dict.lab.title} lead={dict.lab.subtitle}>
        <ProgressSummary kind="labs" total={experiments.length} className="mt-8 w-full max-w-xs" />
      </PageHeader>

      <ul className="grid gap-5 md:grid-cols-2">
        {experiments.map((e) => (
          <li
            key={e.id}
            className="squircle group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-xs transition-[box-shadow,transform,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus motion-reduce:hover:translate-y-0"
          >
            <div className="aspect-[16/8] border-b border-line bg-surface-2">
              <LabThumb id={e.id} />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex min-h-6 items-center justify-between gap-3">
                <p className="text-[0.8125rem] font-semibold text-accent-ink">{format(dict.lab.experiment, { letter: e.letter })}</p>
                <LabDoneBadge id={e.id} label={dict.progress.completed} />
              </div>
              <h2 className="type-h3 mt-2">
                <Link href={routes.experiment(locale, e.id)} className="outline-none after:absolute after:inset-0">
                  {pick(e.title, locale)}
                </Link>
              </h2>
              <p className="mt-1 text-[1.0625rem] font-medium text-ink">{pick(e.question, locale)}</p>
              <p className="mt-3 text-ink-2">{pick(e.summary, locale)}</p>
              <div className="mt-5">
                <p className="sr-only">{dict.lab.skills}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {pick(e.skills, locale).map((s) => (
                    <li key={s}>
                      <Tag>{s}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-[0.875rem]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-accent-ink" aria-hidden>
                  {dict.lab.startExperiment}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
                <span className="inline-flex items-center gap-1 text-ink-2">
                  <Clock className="size-4" aria-hidden /> {format(dict.common.minutes, { n: e.minutes })}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="real-world-h" className="mt-24">
        <div className="measure-wide mb-8">
          <p className="type-label mb-3 flex items-center gap-2 text-accent-ink">
            <Telescope className="size-4" aria-hidden /> {dict.common.comingSoon}
          </p>
          <h2 id="real-world-h" className="type-h2">{dict.lab.realWorldTitle}</h2>
          <p className="type-lead mt-4">{dict.lab.realWorldBody}</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {realWorld.map((r) => (
            <li key={r.id} className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-6">
              <p className="font-semibold text-ink">{pick(r.title, locale)}</p>
              <p className="mt-2 text-[0.9375rem] text-ink-2">{pick(r.question, locale)}</p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
