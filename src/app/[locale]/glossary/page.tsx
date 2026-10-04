import type { Metadata } from "next";
import { Suspense } from "react";
import { getI18n } from "@/i18n/server";
import { format, pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/layout/page-header";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";
import { ProgressSummary } from "@/components/progress/progress-summary";
import type { ConceptSummary } from "@/components/glossary/concept-card";
import { glossary } from "@/content/glossary";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata(locale, "/glossary", dict.glossary.title, dict.glossary.subtitle);
}

export default async function GlossaryPage() {
  const { locale, dict } = await getI18n();

  const items: ConceptSummary[] = glossary.map((c) => ({
    id: c.id,
    term: c.term,
    localTerm: pick(c.localTerm, locale),
    short: pick(c.short, locale),
    categories: c.categories,
    difficulty: c.difficulty,
    href: routes.concept(locale, c.id),
    demo: c.demo,
    peek: pick(c.peek, locale),
  }));

  // Extra matching text (other languages’ names + aliases) so search works across scripts
  const keywords = Object.fromEntries(
    glossary.map((c) => [c.id, [...Object.values(c.localTerm), ...(c.aliases ?? [])].join(" ")]),
  );

  return (
    <Container size="wide">
      <PageHeader eyebrow={format(dict.glossary.count, { n: glossary.length })} title={dict.glossary.title} lead={dict.glossary.subtitle}>
        <ProgressSummary kind="concepts" total={glossary.length} className="mt-8 max-w-sm" />
      </PageHeader>
      <Suspense fallback={<GlossaryFallback items={items} />}>
        <GlossaryExplorer items={items} keywords={keywords} />
      </Suspense>
    </Container>
  );
}

/** Static list shown before the client explorer hydrates (and without JS). */
function GlossaryFallback({ items }: { items: ConceptSummary[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <a href={item.href} className="block rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <span lang="en" className="type-serif block text-[2.125rem] leading-none">{item.term}</span>
            <span className="mt-3 block text-ink-2">{item.short}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
