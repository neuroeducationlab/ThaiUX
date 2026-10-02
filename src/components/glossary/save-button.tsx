"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { toast } from "@/components/ui/toast";

/** Save (bookmark) a concept. A toggle button: aria-pressed + visible label + toast feedback. */
export function SaveButton({ conceptId, className }: { conceptId: string; className?: string }) {
  const { dict } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const saved = hydrated && state.saved.includes(conceptId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => {
        const now = progress.toggleSaved(conceptId);
        toast(now ? dict.progress.savedToast : dict.progress.unsavedToast, now ? "success" : "info");
      }}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
        saved
          ? "border-accent/40 bg-accent-soft text-accent-ink hover:bg-accent-soft/70"
          : "border-line-strong bg-surface text-ink hover:bg-surface-2",
        className,
      )}
    >
      {saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
      {saved ? dict.progress.saved : dict.progress.save}
    </button>
  );
}
