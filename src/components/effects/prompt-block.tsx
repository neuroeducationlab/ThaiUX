"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { PromptParts } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { useI18n } from "@/i18n/client";
import { pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/controls";
import { toast } from "@/components/ui/toast";
import { usePlayground, type Stack } from "./provider";
import { buildPrompt, promptIntro, promptLines, stackLabels } from "./prompt";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copy button shared by cards, the detail page and the prompt builder. */
export function CopyPromptButton({
  parts,
  variant = "primary",
  className,
  onCopied,
}: {
  parts: PromptParts;
  variant?: "primary" | "quiet";
  className?: string;
  onCopied?: () => void;
}) {
  const { locale } = useI18n();
  const { stack } = usePlayground();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(buildPrompt(parts, stack));
        toast(pick(ok ? C.copied : C.copyFailed, locale), ok ? "success" : "info");
        if (ok) {
          setDone(true);
          onCopied?.();
          window.setTimeout(() => setDone(false), 1800);
        }
      }}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 active:scale-[0.97]",
        variant === "primary" ? "bg-accent text-on-accent hover:bg-accent-hover" : "border border-line-strong bg-surface text-ink hover:bg-surface-2",
        className,
      )}
    >
      {done ? <Check className="size-4" aria-hidden strokeWidth={2.5} /> : <Copy className="size-4" aria-hidden />}
      {pick(C.copyPrompt, locale)}
    </button>
  );
}

export function StackPicker({ size = "sm", className }: { size?: "sm" | "md"; className?: string }) {
  const { locale } = useI18n();
  const { stack, setStack } = usePlayground();
  return (
    <SegmentedControl<Stack>
      value={stack}
      onChange={setStack}
      label={pick(C.stackLabel, locale)}
      size={size}
      className={className}
      options={(Object.keys(stackLabels) as Stack[]).map((s) => ({ value: s, label: stackLabels[s] }))}
    />
  );
}

/** A prompt shown as its five labelled parts — the formula made visible. */
export function PromptBlock({ parts, className }: { parts: PromptParts; className?: string }) {
  const { locale } = useI18n();
  const { stack } = usePlayground();

  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-xs", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-label">{pick(C.stackLabel, locale)}</span>
          <StackPicker />
        </div>
        <CopyPromptButton parts={parts} />
      </div>
      <div lang="en" className="space-y-3 px-4 py-5 text-[0.9375rem] leading-relaxed sm:px-5">
        <p className="font-medium text-ink">{promptIntro(parts.build, stack)}</p>
        <ol className="space-y-3">
          {promptLines(parts).map(([key, value], i) => (
            <li key={key} className="grid gap-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4">
              <span className="flex items-center gap-2 self-start">
                <span className="tabular flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.75rem] font-bold text-accent-ink">
                  {i + 1}
                </span>
                <span className="font-semibold text-ink">{key}</span>
              </span>
              <span className="text-ink-2">{value}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
