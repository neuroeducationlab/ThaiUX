"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Hand, MousePointer2, Pause, Play } from "lucide-react";
import type { EffectId, PromptParts } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { useI18n } from "@/i18n/client";
import { format, pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { progress } from "@/components/progress/store";
import { EffectEnvProvider, useFinePointer, useRaf, type EffectEnv } from "./engine";
import { Placeholder, useInView } from "./effect-card";
import { CopyPromptButton } from "./prompt-block";
import { usePlayground } from "./provider";
import { effectDemos } from "./registry";

export type RailItem = {
  id: EffectId;
  name: string;
  categoryLabel: string;
  href: string;
  prompt: PromptParts;
};

type RailLabels = {
  hintMouse: string;
  hintTouch: string;
  pause: string;
  play: string;
  prev: string;
  next: string;
  region: string;
  howToBuild: string;
};

/** ≈35 px a second: slow enough to read, fast enough to notice it’s alive. */
const SPEED = 0.035;

function RailTile({
  item,
  near,
  railVisible,
  current,
  onActivate,
  howToBuild,
}: {
  item: RailItem;
  near: boolean;
  railVisible: boolean;
  current: boolean;
  onActivate: (touch: boolean) => void;
  howToBuild: string;
}) {
  const { locale } = useI18n();
  const { motion } = usePlayground();
  const Demo = effectDemos[item.id];
  const env = useMemo<EffectEnv>(
    () => ({
      id: item.id,
      full: false,
      rail: true,
      motion,
      // only the card you’re pointing at moves; the rest wait as still frames
      active: motion && railVisible && current,
      label: format(pick(C.stageHint, locale), { name: item.name }),
      tried: () => progress.markEffect(item.id),
    }),
    [item.id, item.name, motion, railVisible, current, locale],
  );

  return (
    <li
      data-current={current}
      className="group/tile w-[17rem] shrink-0 sm:w-[19rem]"
      onPointerEnter={(e) => e.pointerType !== "touch" && onActivate(false)}
      onPointerDown={(e) => onActivate(e.pointerType === "touch")}
      onFocus={() => onActivate(false)}
    >
      <article
        aria-labelledby={`rail-${item.id}`}
        className={cn(
          "squircle overflow-hidden rounded-[var(--radius-xl)] border bg-surface transition-[box-shadow,border-color,transform] duration-300 ease-out-soft",
          current ? "border-accent/50 shadow-lg" : "border-line shadow-xs",
        )}
      >
        <div className="relative h-52 sm:h-56">
          {near ? (
            <EffectEnvProvider value={env}>
              <Demo />
            </EffectEnvProvider>
          ) : (
            <Placeholder />
          )}
          {/* Actions appear when you point at the card (always shown on touch screens and with the keyboard) */}
          <div
            className={cn(
              "absolute right-2 bottom-2 z-30 flex gap-1.5 transition-[opacity,translate] duration-200 ease-out",
              "[@media(hover:hover)]:translate-y-1.5 [@media(hover:hover)]:opacity-0",
              "group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-focus-within/tile:translate-y-0 group-focus-within/tile:opacity-100",
            )}
          >
            <CopyPromptButton parts={item.prompt} size="sm" />
            <Link
              href={item.href}
              className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line-strong bg-surface px-3.5 text-[0.8125rem] font-semibold text-ink shadow-md transition-colors hover:bg-surface-2"
            >
              {howToBuild}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-3">
          <h3 id={`rail-${item.id}`} className="min-w-0 truncate">
            <Link href={item.href} lang="en" className="type-serif text-[1.375rem] leading-tight text-ink underline-offset-4 hover:underline">
              {item.name}
            </Link>
          </h3>
          <span className="shrink-0 text-[0.75rem] font-semibold text-accent-ink">{item.categoryLabel}</span>
        </div>
      </article>
    </li>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
    >
      {children}
    </button>
  );
}

/**
 * A slowly drifting row of live effects for the homepage.
 * Pointing at it stops the drift and wakes up the card under the cursor;
 * a Pause button stops it for good (WCAG 2.2.2), it never moves on its own
 * with reduced motion, and touch screens can swipe it like any rail.
 */
export function EffectsRail({ items, labels }: { items: RailItem[]; labels: RailLabels }) {
  const { locale } = useI18n();
  const { motion, setMotion, reduced } = usePlayground();
  const fine = useFinePointer();
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const { near, visible } = useInView(wrapRef);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [current, setCurrent] = useState<EffectId | null>(null);
  const drift = useRef({ pos: 0, dir: 1, hold: 0, last: -1 });

  const auto = motion && !paused && !engaged && visible;

  // when the drift restarts, pick up from wherever the rail was left
  useEffect(() => {
    if (!auto) drift.current.last = -1;
  }, [auto]);

  useRaf((dt) => {
    const el = railRef.current;
    if (!el) return;
    const d = drift.current;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) return;
    if (d.last < 0) d.pos = el.scrollLeft;
    else if (Math.abs(el.scrollLeft - d.last) > 1.5) {
      // someone scrolled by hand: follow them, then wait a moment
      d.pos = el.scrollLeft;
      d.hold = 2500;
    }
    if (d.hold > 0) {
      d.hold -= dt;
      d.last = el.scrollLeft;
      return;
    }
    d.pos += d.dir * dt * SPEED;
    if (d.pos >= max) {
      d.pos = max;
      d.dir = -1;
      d.hold = 1800;
    } else if (d.pos <= 0) {
      d.pos = 0;
      d.dir = 1;
      d.hold = 1800;
    }
    el.scrollLeft = d.pos;
    d.last = el.scrollLeft;
  }, auto);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const step = (el.querySelector("li")?.clientWidth ?? 300) + 16;
    el.scrollBy({ left: dir * step, behavior: motion ? "smooth" : "auto" });
    drift.current.dir = dir;
  };

  return (
    <div ref={wrapRef}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 text-[0.875rem] text-ink-2 sm:text-[0.9375rem]">
          {fine ? <MousePointer2 className="size-4 shrink-0 text-accent-ink" aria-hidden /> : <Hand className="size-4 shrink-0 text-accent-ink" aria-hidden />}
          {fine ? labels.hintMouse : labels.hintTouch}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {/* touch screens swipe; arrows are for mouse and keyboard */}
          {fine ? (
            <ControlButton label={labels.prev} onClick={() => nudge(-1)}>
              <ChevronLeft className="size-[1.125rem]" aria-hidden />
            </ControlButton>
          ) : null}
          {motion ? (
            <ControlButton label={paused ? labels.play : labels.pause} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </ControlButton>
          ) : null}
          {fine ? (
            <ControlButton label={labels.next} onClick={() => nudge(1)}>
              <ChevronRight className="size-[1.125rem]" aria-hidden />
            </ControlButton>
          ) : null}
        </div>
      </div>

      {reduced && !motion ? (
        <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-md)] bg-accent-soft px-4 py-3 text-[0.9375rem] text-ink">
          {pick(C.motionReduced, locale)}
          <button type="button" onClick={() => setMotion(true)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[0.8125rem] font-semibold text-on-accent hover:bg-accent-hover">
            <Play className="size-3.5" aria-hidden /> {pick(C.playOne, locale)}
          </button>
        </p>
      ) : null}

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <ul
          ref={railRef}
          aria-label={labels.region}
          className="rail flex gap-4 overflow-x-auto px-4 pt-1 pb-4 sm:px-6 lg:px-8"
          onPointerEnter={(e) => e.pointerType !== "touch" && setEngaged(true)}
          onPointerLeave={(e) => {
            if (e.pointerType === "touch") return;
            setEngaged(false);
            setCurrent(null);
          }}
          onFocus={() => setEngaged(true)}
          onBlur={(e) => {
            if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
            setEngaged(false);
            setCurrent(null);
          }}
        >
          {items.map((item) => (
            <RailTile
              key={item.id}
              item={item}
              near={near}
              railVisible={visible}
              current={current === item.id}
              howToBuild={labels.howToBuild}
              onActivate={(touch) => {
                setCurrent(item.id);
                // a tap is a deliberate choice: stop drifting until they press Play
                if (touch) setPaused(true);
              }}
            />
          ))}
        </ul>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-bg to-transparent sm:w-8" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg to-transparent sm:w-20" />
      </div>
    </div>
  );
}
