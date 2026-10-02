"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CircleCheck, MousePointerClick, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { progress, useProgress } from "@/components/progress/store";

/**
 * DemoFrame — the core teaching pattern of ThaiUX.
 *   1. Tell people what to try (instruction).
 *   2. Let them interact (the demo).
 *   3. Name what they just felt: “You just experienced ‘Hover’.”
 * Demos call `experience()` from useDemo() when the key interaction happens.
 */
type DemoApi = { experience: () => void; experienced: boolean };

const DemoContext = createContext<DemoApi>({ experience: () => {}, experienced: false });

export function useDemo() {
  return useContext(DemoContext);
}

export function DemoFrame({
  conceptId,
  term,
  instruction,
  label,
  children,
  className,
  canvasClassName,
}: {
  /** When set, experiencing the demo is saved to progress. */
  conceptId?: string;
  term: string;
  instruction: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  canvasClassName?: string;
}) {
  const { dict } = useI18n();
  const saved = useProgress();
  const [experienced, setExperienced] = useState(false);
  const [round, setRound] = useState(0);

  const experience = useCallback(() => {
    setExperienced(true);
    if (conceptId) progress.markExperienced(conceptId);
  }, [conceptId]);

  const seenBefore = !!conceptId && saved.experienced.includes(conceptId) && !experienced;

  return (
    <section
      aria-label={label ?? dict.glossary.tryIt}
      className={cn("squircle overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-sm", className)}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden>
            <MousePointerClick className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="type-label text-accent-ink">{label ?? dict.glossary.tryIt}</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink">{instruction}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setRound((r) => r + 1);
            setExperienced(false);
          }}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">{dict.glossary.resetDemo}</span>
          <span className="sr-only sm:hidden">{dict.glossary.resetDemo}</span>
        </button>
      </div>

      <DemoContext.Provider value={{ experience, experienced }}>
        <div className={cn("demo-canvas relative px-4 py-8 sm:px-8 sm:py-10", canvasClassName)} key={round}>
          {children}
        </div>
      </DemoContext.Provider>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex min-h-14 items-center gap-2.5 border-t border-line px-5 py-3 text-[0.9375rem] transition-colors duration-300 sm:px-6",
          experienced ? "bg-success-soft text-success" : "text-ink-2",
        )}
      >
        {experienced ? (
          <>
            <CircleCheck className="animate-pop size-5 shrink-0" aria-hidden />
            <span className="font-semibold">
              {format(dict.glossary.youExperienced, { term })}
            </span>
          </>
        ) : seenBefore ? (
          <>
            <CircleCheck className="size-5 shrink-0 text-ink-3" aria-hidden />
            <span>{dict.glossary.experiencedBefore}</span>
          </>
        ) : (
          <>
            <span className="relative flex size-2.5 shrink-0" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-40 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-[0.875rem]">{dict.progress.notYet}</span>
          </>
        )}
      </div>
    </section>
  );
}
