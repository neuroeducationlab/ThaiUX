"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, BookmarkCheck, CircleCheck, Play, X } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { DifficultyDots, Tag } from "@/components/ui/layout";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { DemoProvider } from "@/components/demos/demo-frame";
import { peeks, preloadPeek } from "@/components/peeks/registry";
import { PeekBoundary, PeekSkeleton } from "@/components/peeks/kit";
import type { Category, DemoId, Difficulty } from "@/content/types";
import { msSinceScroll, peekStore, useOpenPeek, type PeekVia } from "./peek-store";

export type ConceptSummary = {
  id: string;
  term: string;
  localTerm: string;
  short: string;
  categories: Category[];
  difficulty: Difficulty;
  href: string;
  demo: DemoId;
  /** What to try in the card-sized demo. */
  peek: string;
};

/* Hover intent: the demo opens only once the pointer rests, so sweeping across the grid stays calm. */
const DWELL = 320; // ms on the card before the demo may open
const STILL = 90; // ms without movement that counts as resting…
const SLOW = 0.35; // …as does moving slower than this (px per ms)
const GRACE = 220; // ms a hover-opened demo waits after the pointer leaves, in case it comes back
const EXIT = 340; // ms of closing mist before the demo unmounts

/**
 * A glossary card that can turn into its own live demo (“peek”).
 * Rest the mouse on it: a faint mist gathers under the pointer, thickens,
 * and clears to show a card-sized demo you can play with right there.
 * Touch and keyboard get the same demo from the Try button. The term link
 * still opens the full concept page. Decision record: UXDR-27.
 */
export function ConceptCard({ item, headingLevel = 3 }: { item: ConceptSummary; headingLevel?: 2 | 3 }) {
  const { dict, locale } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  const open = useOpenPeek();
  const isOpen = open?.id === item.id;
  const via: PeekVia | null = isOpen ? open.via : null;
  const [present, setPresent] = useState(false); // demo mounted (kept through the closing mist)
  const [mist, setMist] = useState(false); // pointer resting on the closed card
  const cardRef = useRef<HTMLElement>(null);
  const tryRef = useRef<HTMLButtonElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const live = useRef({ inside: false, moved: false, x: 0, y: 0, t: 0, speed: 0, since: 0, intent: 0, leave: 0, focusPeek: false, restore: false });
  const uid = useId();
  const peekId = `${uid}-peek`;
  const shortId = `${uid}-short`;

  const experienced = hydrated && state.experienced.includes(item.id);
  const saved = hydrated && state.saved.includes(item.id);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const level = item.difficulty === 1 ? dict.difficulty.beginner : item.difficulty === 2 ? dict.difficulty.intermediate : dict.difficulty.advanced;
  const phase = isOpen ? "open" : present ? "closing" : mist ? "mist" : "idle";

  // Unmount the demo once the closing mist has played
  useEffect(() => {
    if (isOpen || !present) return;
    const id = window.setTimeout(() => setPresent(false), EXIT);
    return () => window.clearTimeout(id);
  }, [isOpen, present]);

  // Focus follows the person: into the demo when they asked for it, back to the Try button when they close it
  useEffect(() => {
    const s = live.current;
    if (isOpen && s.focusPeek) {
      s.focusPeek = false;
      // no scroll: the card is already in view, and a jump would slide another card under the mouse
      peekRef.current?.focus({ preventScroll: true });
    }
    if (!isOpen && s.restore) {
      s.restore = false;
      tryRef.current?.focus();
    }
  }, [isOpen]);

  // Dismiss: Esc from anywhere (WCAG 1.4.13); a pinned demo also closes on a press outside the card
  useEffect(() => {
    if (!isOpen) return;
    const s = live.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return; // demos claim Esc for their own menus and dialogs
      s.restore = !!cardRef.current?.contains(document.activeElement);
      peekStore.close(item.id);
    };
    const onDown = (e: PointerEvent) => {
      if (via === "pin" && !cardRef.current?.contains(e.target as Node)) peekStore.close(item.id);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [isOpen, via, item.id]);

  // A card filtered out of the grid takes its demo with it
  useEffect(() => {
    const s = live.current;
    return () => {
      window.clearTimeout(s.intent);
      window.clearTimeout(s.leave);
      peekStore.close(item.id);
    };
  }, [item.id]);

  const openPeek = (how: PeekVia) => {
    const s = live.current;
    window.clearTimeout(s.intent);
    window.clearTimeout(s.leave);
    // Move focus in when asked to — or when it would otherwise be stranded on the hidden card face
    const face = cardRef.current?.querySelector(".peek-face");
    s.focusPeek = how === "pin" || !!face?.contains(document.activeElement);
    preloadPeek(item.demo);
    setPresent(true);
    setMist(false);
    peekStore.open(item.id, how);
  };

  const close = () => {
    live.current.restore = true;
    peekStore.close(item.id);
  };

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const s = live.current;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    e.currentTarget.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    const dt = e.timeStamp - s.t;
    if (s.t && dt > 0) s.speed = s.speed * 0.5 + (Math.hypot(e.clientX - s.x, e.clientY - s.y) / dt) * 0.5;
    s.x = e.clientX;
    s.y = e.clientY;
    s.t = e.timeStamp;
  };

  const enter = () => {
    const s = live.current;
    s.inside = true;
    s.moved = false;
    window.clearTimeout(s.leave);
    if (!isOpen) preloadPeek(item.demo);
  };

  // Intent starts with real movement: a page scrolling under a still mouse is not a choice
  const arm = (e: React.PointerEvent<HTMLElement>) => {
    const s = live.current;
    s.moved = true;
    s.t = 0;
    s.speed = 0;
    track(e);
    s.since = e.timeStamp;
    setMist(true);
    window.clearTimeout(s.intent);
    const check = () => {
      if (!s.inside || peekStore.get()?.id === item.id) return;
      const now = performance.now();
      const resting = now - s.t > STILL || s.speed < SLOW;
      if (resting && now - s.since >= DWELL && msSinceScroll() > 250) openPeek("hover");
      else s.intent = window.setTimeout(check, 70);
    };
    s.intent = window.setTimeout(check, DWELL);
  };

  return (
    <article
      ref={cardRef}
      data-peek={phase}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") enter();
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || isOpen) return;
        const s = live.current;
        if (!s.inside) enter();
        if (s.moved) track(e);
        else if (e.movementX || e.movementY) arm(e);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        const s = live.current;
        s.inside = false;
        window.clearTimeout(s.intent);
        setMist(false);
        if (!isOpen || via !== "hover") return;
        // Stay for someone working from the keyboard or typing; a mouse click inside doesn’t pin it
        const active = document.activeElement;
        const busy = !!active && e.currentTarget.contains(active) && active.matches(":focus-visible, input, textarea, select");
        if (!busy) s.leave = window.setTimeout(() => peekStore.close(item.id), GRACE);
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (!isOpen || (next && e.currentTarget.contains(next))) return;
        // A pinned demo closes when focus moves on; a hover demo once the pointer has gone too
        if (via === "pin" ? next !== null : !live.current.inside) peekStore.close(item.id);
      }}
      className={cn(
        "peek-card squircle group relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-xs",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md",
        "has-[.peek-link:focus-visible]:outline-2 has-[.peek-link:focus-visible]:outline-offset-2 has-[.peek-link:focus-visible]:outline-focus",
      )}
    >
      <div className="peek-face flex flex-1 flex-col p-5" inert={isOpen}>
        <div className="mb-5 flex items-center justify-between gap-2">
          <Tag tone="neutral">{dict.categories[item.categories[0]]}</Tag>
          <span className="flex items-center gap-1.5">
            {saved ? <BookmarkCheck className="size-4 text-accent" aria-label={dict.progress.saved} /> : null}
            {experienced ? (
              <span className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-success">
                <CircleCheck className="size-4" aria-hidden />
                {dict.progress.experienced}
              </span>
            ) : null}
          </span>
        </div>
        <Heading lang="en" className="type-serif text-[2.125rem] leading-none text-ink">
          {/* The link stretches over the whole card; the Try button sits above it */}
          <Link
            href={item.href}
            aria-describedby={shortId}
            className="peek-link outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
          >
            {item.term}
          </Link>
        </Heading>
        {locale !== "en" ? <p className="mt-2 text-[0.875rem] font-medium text-accent-ink">{item.localTerm}</p> : null}
        <p id={shortId} className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-2">
          {item.short}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <DifficultyDots level={item.difficulty} label={level} />
          <button
            ref={tryRef}
            type="button"
            aria-label={`${dict.glossary.peekTry}: ${item.term}`}
            aria-expanded={isOpen}
            aria-controls={peekId}
            onClick={(e) => {
              // the mist blooms from the button that asked for it
              const card = cardRef.current;
              if (card) {
                const c = card.getBoundingClientRect();
                const b = e.currentTarget.getBoundingClientRect();
                card.style.setProperty("--mx", `${Math.round(b.left + b.width / 2 - c.left)}px`);
                card.style.setProperty("--my", `${Math.round(b.top + b.height / 2 - c.top)}px`);
              }
              openPeek("pin");
            }}
            className="relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 text-[0.8125rem] font-semibold text-ink-2 transition-colors group-hover:border-accent/40 group-hover:text-accent-ink hover:bg-accent-soft"
          >
            <Play className="size-3 fill-current" aria-hidden />
            {dict.glossary.peekTry}
          </button>
        </div>
      </div>

      {present ? (
        <div
          id={peekId}
          ref={peekRef}
          role="group"
          aria-label={format(dict.glossary.peekLabel, { term: item.term })}
          tabIndex={-1}
          inert={!isOpen}
          className="peek-live absolute inset-0 z-10 flex flex-col bg-surface p-3 outline-none"
        >
          <PeekBody item={item} onClose={close} />
        </div>
      ) : null}

      <span aria-hidden className="peek-fog">
        <span className="peek-haze" />
      </span>
    </article>
  );
}

function PeekBody({ item, onClose }: { item: ConceptSummary; onClose: () => void }) {
  const { dict } = useI18n();
  const [felt, setFelt] = useState(false);
  const marked = useRef(false);
  const experience = useCallback(() => {
    if (marked.current) return;
    marked.current = true;
    setFelt(true);
    progress.markExperienced(item.id);
  }, [item.id]);
  const Demo = peeks[item.demo];

  return (
    <>
      <div className="flex h-8 shrink-0 items-center gap-1 pl-1.5">
        <p lang="en" aria-hidden className="type-serif min-w-0 flex-1 truncate text-[1.375rem] leading-none text-ink">
          {item.term}
        </p>
        <Link
          href={item.href}
          aria-label={`${dict.glossary.peekLesson}: ${item.term}`}
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[0.8125rem] font-semibold text-accent-ink transition-colors hover:bg-accent-soft"
        >
          {dict.glossary.peekLesson}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.glossary.peekClose}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="demo-canvas @container relative mt-2 min-h-0 flex-1 overflow-hidden rounded-[var(--radius-md)] p-2.5">
        <PeekBoundary fallback={<p className="flex size-full items-center justify-center px-4 text-center text-[0.8125rem] text-ink-2">{dict.glossary.peekFailed}</p>}>
          <Suspense fallback={<PeekSkeleton />}>
            <DemoProvider value={{ experience, experienced: felt }}>
              <Demo />
            </DemoProvider>
          </Suspense>
        </PeekBoundary>
      </div>

      <p
        role="status"
        className={cn(
          "mt-2 flex min-h-6 shrink-0 items-center gap-1.5 pl-1.5 text-[0.8125rem] leading-tight",
          felt ? "font-semibold text-success" : "text-ink-2",
        )}
      >
        {felt ? (
          <>
            <CircleCheck className="animate-pop size-4 shrink-0" aria-hidden />
            <span className="line-clamp-2">{format(dict.glossary.youExperienced, { term: item.term })}</span>
          </>
        ) : (
          <>
            <span className="relative flex size-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-40 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="line-clamp-2">{item.peek}</span>
          </>
        )}
      </p>
    </>
  );
}
