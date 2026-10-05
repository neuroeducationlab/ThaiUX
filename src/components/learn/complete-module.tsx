"use client";

import Link from "next/link";
import { ArrowRight, Award, CircleCheck, Circle } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format, pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { toast } from "@/components/ui/toast";
import { certificate } from "@/content/certificate";

/**
 * Explicit “I’m done” — a small commitment that makes progress feel earned.
 * Once a module is done it shows how close the certificate is (UXDR-32).
 */
export function CompleteModule({ moduleId, allIds, certificateHref }: { moduleId: string; allIds: string[]; certificateHref: string }) {
  const { locale, dict } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const done = hydrated && state.completed.includes(moduleId);
  const left = allIds.filter((id) => !state.completed.includes(id)).length;

  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-line bg-surface px-6 py-8 text-center">
      <p className="type-title">{dict.learn.finished}</p>
      <button
        type="button"
        aria-pressed={done}
        title={done ? dict.progress.undoComplete : undefined}
        onClick={() => {
          progress.setCompleted(moduleId, !done);
          if (!done) toast(left === 1 ? pick(certificate.ready, locale) : dict.progress.markedComplete);
        }}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold transition-colors",
          done ? "bg-success-soft text-success hover:bg-success-soft/70" : "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
        )}
      >
        {done ? <CircleCheck className="size-5" aria-hidden /> : <Circle className="size-5" aria-hidden />}
        {done ? dict.progress.completed : dict.progress.markComplete}
      </button>
      {done ? (
        <Link
          href={certificateHref}
          className={cn(
            "animate-fade-up mt-1 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-semibold underline-offset-4",
            left === 0 ? "bg-accent-soft text-accent-ink hover:bg-accent-soft/70" : "text-accent-ink hover:underline",
          )}
        >
          <Award className="size-[1.125rem]" aria-hidden />
          {left === 0 ? pick(certificate.ready, locale) : format(pick(certificate.remaining, locale), { n: left })}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
