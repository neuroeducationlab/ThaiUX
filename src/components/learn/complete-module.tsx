"use client";

import { CircleCheck, Circle } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { toast } from "@/components/ui/toast";

/** Explicit “I’m done” — a small commitment that makes progress feel earned. */
export function CompleteModule({ moduleId }: { moduleId: string }) {
  const { dict } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const done = hydrated && state.completed.includes(moduleId);

  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-line bg-surface px-6 py-8 text-center">
      <p className="type-title">{dict.learn.finished}</p>
      <button
        type="button"
        aria-pressed={done}
        title={done ? dict.progress.undoComplete : undefined}
        onClick={() => {
          progress.setCompleted(moduleId, !done);
          if (!done) toast(dict.progress.markedComplete);
        }}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold transition-colors",
          done ? "bg-success-soft text-success hover:bg-success-soft/70" : "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
        )}
      >
        {done ? <CircleCheck className="size-5" aria-hidden /> : <Circle className="size-5" aria-hidden />}
        {done ? dict.progress.completed : dict.progress.markComplete}
      </button>
    </div>
  );
}
