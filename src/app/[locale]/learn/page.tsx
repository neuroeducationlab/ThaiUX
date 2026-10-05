import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/layout/page-header";
import { LearningLoop } from "@/components/learn/learning-loop";
import { ModulePath, type ModuleSummary } from "@/components/learn/module-path";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { modules } from "@/content/modules";
import { certificate } from "@/content/certificate";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata(locale, "/learn", dict.learn.title, dict.learn.subtitle);
}

export default async function LearnPage() {
  const { locale, dict } = await getI18n();
  const items: ModuleSummary[] = modules.map((m) => ({
    id: m.id,
    number: m.number,
    title: pick(m.title, locale),
    summary: pick(m.summary, locale),
    minutes: m.minutes,
    topics: m.topics.map((t) => pick(t.title, locale)),
    href: routes.module(locale, m.id),
  }));

  return (
    <Container>
      <PageHeader eyebrow={dict.nav.learn} title={dict.learn.title} lead={dict.learn.subtitle} />

      <section aria-labelledby="loop-heading" className="mb-16">
        <h2 id="loop-heading" className="type-label mb-4">{dict.learn.loopTitle}</h2>
        <LearningLoop dict={dict} />
      </section>

      <section aria-labelledby="path-heading">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="path-heading" className="type-h2">{dict.learn.pathTitle}</h2>
          <div className="w-full max-w-xs">
            <ProgressSummary kind="modules" total={modules.length} />
            <Link
              href={routes.certificate(locale)}
              className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-accent-ink underline-offset-4 hover:underline"
            >
              <Award className="size-[1.125rem] shrink-0" aria-hidden />
              {pick(certificate.learnHub, locale)}
              <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
          </div>
        </div>
        <ModulePath modules={items} />
      </section>
    </Container>
  );
}
