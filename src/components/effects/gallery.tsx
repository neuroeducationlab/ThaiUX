"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Info } from "lucide-react";
import type { EffectCategory } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { useI18n } from "@/i18n/client";
import { format, pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { EffectCard, type EffectSummary } from "./effect-card";
import { StackPicker } from "./prompt-block";
import { usePlayground } from "./provider";

type Filter = "all" | EffectCategory;

export function EffectGrid({ items }: { items: EffectSummary[] }) {
  // with an odd count, the last card spans both columns in the two-column layout, so rows always end complete
  const odd = items.length % 2 === 1;
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.id} className={cn("flex", odd && i === items.length - 1 && "md:col-span-2 xl:col-span-1")}>
          <EffectCard item={item} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Category filter (kept in the URL, like the glossary), the prompt stack
 * and the motion switch, above the grid of live effects.
 */
export function EffectsGallery({ items, categories }: { items: EffectSummary[]; categories: { id: EffectCategory; label: string }[] }) {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { motion, setMotion, reduced } = usePlayground();

  const ids: Filter[] = ["all", ...categories.map((c) => c.id)];
  const raw = params.get("category");
  const filter: Filter = ids.includes(raw as Filter) ? (raw as Filter) : "all";

  const setFilter = (f: Filter) => {
    const next = new URLSearchParams(params.toString());
    if (f === "all") next.delete("category");
    else next.set("category", f);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const label = (f: Filter) => (f === "all" ? pick(C.all, locale) : categories.find((c) => c.id === f)!.label);
  const count = (f: Filter) => (f === "all" ? items.length : items.filter((i) => i.category === f).length);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.875rem] font-medium text-ink-2">{pick(C.stackLabel, locale)}</span>
          <StackPicker />
        </div>
        <Switch checked={motion} onChange={setMotion} label={pick(C.motionLabel, locale)} className="gap-3 text-[0.9375rem]" />
      </div>

      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-line bg-[var(--header-bg)] px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div role="group" aria-label={pick(C.filterLabel, locale)} className="rail -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {ids.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "border-ink bg-ink text-bg" : "border-line-strong bg-surface text-ink-2 hover:border-ink/30 hover:text-ink",
                )}
              >
                {label(f)}
                <span className={cn("tabular text-[0.75rem]", active ? "text-bg/80" : "text-ink-2")}>{count(f)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {reduced ? (
        <p className="mb-6 flex items-start gap-2 rounded-[var(--radius-md)] bg-accent-soft px-4 py-3 text-[0.9375rem] text-ink">
          <Info className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
          {pick(motion ? C.motionOn : C.motionReduced, locale)}
        </p>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {format(pick(C.showing, locale), { n: visible.length, total: items.length })}
      </p>

      <EffectGrid items={visible} />
    </div>
  );
}
