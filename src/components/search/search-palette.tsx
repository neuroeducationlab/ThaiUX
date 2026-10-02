"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, BookA, BookOpen, CornerDownLeft, FlaskConical, Search, X, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/layout";
import { OPEN_SEARCH_EVENT } from "./events";
import { rankResults, type SearchItem, type SearchKind } from "./rank";

const icons: Record<SearchKind, LucideIcon> = {
  concept: BookA,
  module: BookOpen,
  lab: FlaskConical,
  page: ArrowRight,
};

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

/**
 * Command-palette search (⌘K / Ctrl+K / "/").
 * Combobox + listbox pattern: focus stays in the input, arrow keys move
 * the active option (aria-activedescendant), Enter opens it.
 */
export function SearchPalette({ items, popular }: { items: SearchItem[]; popular: string[] }) {
  const { dict } = useI18n();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    const open = () => {
      setQuery("");
      setActive(0);
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !isTypingTarget(e.target) && !dialogRef.current?.open) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return popular.map((id) => items.find((i) => i.id === id)).filter(Boolean) as SearchItem[];
    }
    return rankResults(items, query).slice(0, 12);
  }, [items, popular, query]);

  const groups = useMemo(() => {
    const order: SearchKind[] = ["concept", "module", "lab", "page"];
    return order
      .map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  // Flattened order for keyboard navigation
  const flat = groups.flatMap((g) => g.items);
  const activeItem = flat[Math.min(active, flat.length - 1)];

  const close = () => dialogRef.current?.close();
  const go = (item: SearchItem) => {
    close();
    router.push(item.href);
  };

  const groupLabel: Record<SearchKind, string> = {
    concept: dict.search.groupConcept,
    module: dict.search.groupModule,
    lab: dict.search.groupLab,
    page: dict.search.groupPage,
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={dict.search.label}
      className="m-0 mx-auto mt-[8vh] max-h-[80vh] w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-0 shadow-lg backdrop:bg-[var(--overlay)]"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-5 shrink-0 text-ink-2" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
          aria-label={dict.search.label}
          placeholder={dict.search.placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (flat.length ? (a + 1) % flat.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0));
            } else if (e.key === "Enter" && activeItem) {
              e.preventDefault();
              go(activeItem);
            }
          }}
          className="h-14 w-full bg-transparent text-[1.0625rem] text-ink outline-none placeholder:text-ink-2 [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="button"
          onClick={close}
          aria-label={dict.a11y.close}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
        >
          <X className="size-[1.125rem]" aria-hidden />
        </button>
      </div>

      <div className="max-h-[min(28rem,60vh)] overflow-y-auto p-2">
        <div role="listbox" id={listId} aria-label={dict.search.label}>
          {groups.map((group) => (
            <div key={group.kind} role="group" aria-labelledby={`${listId}-g-${group.kind}`} className="mb-1">
              <div id={`${listId}-g-${group.kind}`} className="type-label px-3 pt-3 pb-1.5">
                {query.trim() ? groupLabel[group.kind] : dict.search.suggestions}
              </div>
              {group.items.map((item) => {
                const index = flat.indexOf(item);
                const selected = index === active;
                const Icon = icons[item.kind];
                return (
                  <div
                    key={item.id}
                    id={`${listId}-${item.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5",
                      selected ? "bg-accent-soft" : "hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line",
                        selected ? "bg-surface text-accent-ink" : "bg-surface-2 text-ink-2",
                      )}
                      aria-hidden
                    >
                      <Icon className="size-[1.125rem]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink" lang={item.titleLang}>
                        {item.title}
                      </span>
                      {item.subtitle ? (
                        <span className="block truncate text-[0.8125rem] text-ink-2">{item.subtitle}</span>
                      ) : null}
                    </span>
                    {selected ? <CornerDownLeft className="size-4 shrink-0 text-accent-ink" aria-hidden /> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {query.trim() && flat.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="font-medium text-ink">{format(dict.search.emptyTitle, { query: query.trim() })}</p>
            <p className="type-caption mt-1.5">{dict.search.emptyHint}</p>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {query.trim() ? format(dict.search.results, { n: flat.length }) : ""}
      </p>

      <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-[0.75rem] text-ink-2 sm:flex" aria-hidden>
        <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd>{dict.search.keyNavigate}</span>
        <span className="flex items-center gap-1.5"><Kbd>↵</Kbd>{dict.search.keyOpen}</span>
        <span className="flex items-center gap-1.5"><Kbd>esc</Kbd>{dict.search.keyClose}</span>
      </div>
    </dialog>
  );
}
