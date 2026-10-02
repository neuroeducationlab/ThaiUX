"use client";

import Link from "next/link";
import { BookmarkCheck, CircleCheck } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { DifficultyDots, Tag } from "@/components/ui/layout";
import { useHydrated, useProgress } from "@/components/progress/store";
import type { Category, Difficulty } from "@/content/types";

export type ConceptSummary = {
  id: string;
  term: string;
  localTerm: string;
  short: string;
  categories: Category[];
  difficulty: Difficulty;
  href: string;
};

export function ConceptCard({ item, headingLevel = 3 }: { item: ConceptSummary; headingLevel?: 2 | 3 }) {
  const { dict, locale } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const experienced = hydrated && state.experienced.includes(item.id);
  const saved = hydrated && state.saved.includes(item.id);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const level = item.difficulty === 1 ? dict.difficulty.beginner : item.difficulty === 2 ? dict.difficulty.intermediate : dict.difficulty.advanced;

  return (
    <Link
      href={item.href}
      className={cn(
        "squircle group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-xs",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md",
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-2">
        <Tag tone="neutral">{dict.categories[item.categories[0]]}</Tag>
        <span className="flex items-center gap-1.5">
          {saved ? (
            <BookmarkCheck className="size-4 text-accent" aria-label={dict.progress.saved} />
          ) : null}
          {experienced ? (
            <span className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-success">
              <CircleCheck className="size-4" aria-hidden />
              {dict.progress.experienced}
            </span>
          ) : null}
        </span>
      </div>
      <Heading lang="en" className="type-serif text-[2.125rem] leading-none text-ink">
        {item.term}
      </Heading>
      {locale !== "en" ? <p className="mt-2 text-[0.875rem] font-medium text-accent-ink">{item.localTerm}</p> : null}
      <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-2">{item.short}</p>
      <div className="mt-auto pt-5">
        <DifficultyDots level={item.difficulty} label={level} />
      </div>
    </Link>
  );
}
