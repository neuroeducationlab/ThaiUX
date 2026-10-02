import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { pick } from "@/i18n/localized";
import { alternatesFor } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/layout/page-header";
import { LearningLoop } from "@/components/learn/learning-loop";
import { ModulePath, type ModuleSummary } from "@/components/learn/module-path";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { modules } from "@/content/modules";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.learn.title, description: dict.learn.subtitle, alternates: alternatesFor(locale, "/learn") };
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
          <ProgressSummary kind="modules" total={modules.length} className="w-full max-w-xs" />
        </div>
        <ModulePath modules={items} />
      </section>
    </Container>
  );
}
