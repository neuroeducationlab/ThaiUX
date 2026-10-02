"use client";

import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { ProgressBar } from "@/components/ui/controls";
import { useHydrated, useProgress } from "./store";

/** A quiet progress line — motivating without gamifying. Hidden until storage is read. */
export function ProgressSummary({
  kind,
  total,
  className,
}: {
  kind: "concepts" | "modules" | "labs";
  total: number;
  className?: string;
}) {
  const { dict } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const done = kind === "concepts" ? state.experienced.length : kind === "modules" ? state.completed.length : state.labs.length;
  const template =
    kind === "concepts" ? dict.progress.conceptsExperienced : kind === "modules" ? dict.progress.modulesCompleted : dict.progress.labsCompleted;
  const text = format(template, { done: Math.min(done, total), total });

  return (
    <div className={cn("transition-opacity duration-300", hydrated ? "opacity-100" : "opacity-0", className)} aria-hidden={!hydrated}>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[0.875rem]">
        <span className="font-medium text-ink">{text}</span>
      </div>
      <ProgressBar value={Math.min(done, total)} max={total} label={text} />
      <p className="type-caption mt-2 text-[0.75rem]">{dict.progress.deviceOnly}</p>
    </div>
  );
}
