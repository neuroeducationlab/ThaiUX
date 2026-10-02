"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck, Clock } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { useHydrated, useProgress } from "@/components/progress/store";

export type ModuleSummary = {
  id: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  topics: string[];
  href: string;
};

/** The learning path as a numbered vertical journey with progress. */
export function ModulePath({ modules }: { modules: ModuleSummary[] }) {
  const { dict } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const done = (id: string) => hydrated && state.completed.includes(id);
  const nextUp = modules.find((m) => !done(m.id))?.id;

  return (
    <ol className="relative">
      {modules.map((m, i) => {
        const complete = done(m.id);
        const isNext = hydrated && m.id === nextUp;
        return (
          <li key={m.id} className="relative pb-4 pl-14 last:pb-0 sm:pl-20">
            {i < modules.length - 1 ? (
              <span aria-hidden className={cn("absolute top-12 bottom-0 left-[1.4rem] w-px sm:left-[1.9rem]", complete ? "bg-success/50" : "bg-line-strong")} />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "tabular absolute top-3 left-0 flex size-11 items-center justify-center rounded-full border text-sm font-bold sm:size-[3.75rem] sm:text-base",
                complete ? "border-success bg-success text-white dark:text-[#0b2a18]" : isNext ? "border-accent bg-accent text-on-accent" : "border-line-strong bg-surface text-ink-2",
              )}
            >
              {complete ? <CircleCheck className="size-5" /> : String(m.number).padStart(2, "0")}
            </span>
            <Link
              href={m.href}
              className={cn(
                "squircle group block rounded-[var(--radius-lg)] border bg-surface p-5 transition-[box-shadow,border-color,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-md sm:p-6",
                isNext ? "border-accent/40 shadow-sm" : "border-line hover:border-line-strong",
              )}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
                <span className="font-semibold text-accent-ink">{format(dict.learn.module, { n: m.number })}</span>
                <span className="flex items-center gap-1 text-ink-2">
                  <Clock className="size-3.5" aria-hidden />
                  {format(dict.common.minutes, { n: m.minutes })}
                </span>
                {complete ? <span className="font-semibold text-success">{dict.progress.completed}</span> : null}
                {isNext && !complete && i === 0 ? <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent-ink">{dict.learn.startHere}</span> : null}
              </div>
              <h3 className="type-h3 mt-2">{m.title}</h3>
              <p className="mt-1.5 text-ink-2">{m.summary}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5" aria-label={dict.learn.topics}>
                  {m.topics.map((topic) => (
                    <li key={topic} className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] font-medium text-ink-2">
                      {topic}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-ink">
                  {complete ? dict.learn.reviewModule : dict.learn.startModule}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
