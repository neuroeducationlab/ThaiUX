"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Bookmark, Search, X } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { useHydrated, useProgress } from "@/components/progress/store";
import type { Category } from "@/content/types";
import { ConceptCard, type ConceptSummary } from "./concept-card";

type Filter = "all" | Category | "saved";
const FILTERS: Filter[] = ["all", "interaction", "component", "principle", "state", "saved"];

const norm = (s: string) => s.normalize("NFC").toLowerCase().replace(/[\s\-_.’']+/g, "");

/**
 * Search + category filter for the glossary.
 * Filter state lives in the URL (?category=…) so it’s shareable and the
 * Back button works — an IA decision, not just an implementation detail.
 */
export function GlossaryExplorer({ items, keywords }: { items: ConceptSummary[]; keywords: Record<string, string> }) {
  const { dict } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const state = useProgress();
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");

  const raw = params.get("category");
  const filter: Filter = FILTERS.includes(raw as Filter) ? (raw as Filter) : "all";

  const setFilter = (f: Filter) => {
    const next = new URLSearchParams(params.toString());
    if (f === "all") next.delete("category");
    else next.set("category", f);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const visible = useMemo(() => {
    const q = norm(query);
    return items.filter((item) => {
      if (filter === "saved" && !(hydrated && state.saved.includes(item.id))) return false;
      if (filter !== "all" && filter !== "saved" && !item.categories.includes(filter)) return false;
      if (!q) return true;
      return norm(`${item.term} ${item.localTerm} ${item.short} ${keywords[item.id] ?? ""}`).includes(q);
    });
  }, [items, keywords, query, filter, state.saved, hydrated]);

  const label = (f: Filter) =>
    f === "all" ? dict.glossary.all : f === "saved" ? dict.glossary.savedFilter : dict.categories[f];

  const count = (f: Filter) =>
    f === "all"
      ? items.length
      : f === "saved"
        ? hydrated
          ? state.saved.length
          : 0
        : items.filter((i) => i.categories.includes(f)).length;

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-line bg-[var(--header-bg)] px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative lg:w-80">
            <label htmlFor="glossary-filter" className="sr-only">
              {dict.glossary.filterLabel}
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[1.125rem] -translate-y-1/2 text-ink-2" aria-hidden />
            <input
              id="glossary-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.glossary.filterPlaceholder}
              className="h-11 w-full rounded-full border border-line-input bg-surface pr-10 pl-10 text-[0.9375rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={dict.glossary.clear}
                className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>

          <div role="group" aria-label={dict.glossary.categoryLabel} className="rail -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {FILTERS.map((f) => {
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
                  {f === "saved" ? <Bookmark className="size-3.5" aria-hidden /> : null}
                  {label(f)}
                  <span className={cn("tabular text-[0.75rem]", active ? "text-bg/80" : "text-ink-2")}>{count(f)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {format(dict.glossary.showing, { n: visible.length, total: items.length })}
      </p>

      {visible.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id}>
              <ConceptCard item={item} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto max-w-md rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-14 text-center">
          {filter === "saved" && !query ? (
            <>
              <Bookmark className="mx-auto mb-4 size-8 text-ink-3" aria-hidden />
              <p className="type-title">{dict.glossary.savedEmptyTitle}</p>
              <p className="mt-2 text-ink-2">{dict.glossary.savedEmptyBody}</p>
            </>
          ) : (
            <>
              <Search className="mx-auto mb-4 size-8 text-ink-3" aria-hidden />
              <p className="type-title">{format(dict.glossary.emptyTitle, { query })}</p>
              <p className="mt-2 text-ink-2">{dict.glossary.emptyBody}</p>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-6 h-11 rounded-full bg-ink px-5 text-sm font-semibold text-bg hover:opacity-90"
          >
            {dict.glossary.clear}
          </button>
        </div>
      )}
    </div>
  );
}
