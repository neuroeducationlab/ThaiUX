"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CircleCheck, MousePointer2, Pause, Play, RotateCcw } from "lucide-react";
import type { EffectCategory, EffectId, PromptParts } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { useI18n } from "@/i18n/client";
import { format, pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { DifficultyDots } from "@/components/ui/layout";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { EffectEnvProvider, type EffectEnv } from "./engine";
import { CopyPromptButton } from "./prompt-block";
import { usePlayground } from "./provider";
import { effectDemos } from "./registry";

/** Everything a card needs, already in the reader’s language. */
export type EffectSummary = {
  id: EffectId;
  name: string;
  localName?: string;
  tagline: string;
  try: string;
  category: EffectCategory;
  categoryLabel: string;
  level: 1 | 2 | 3;
  levelLabel: string;
  tech: string[];
  href: string;
  prompt: PromptParts;
};

/** Mount just before the stage scrolls into view; know when it’s visible. */
export function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return { near, visible };
}

function useEnv(id: EffectId, name: string, full: boolean, visible: boolean): EffectEnv {
  const { locale } = useI18n();
  const { motion } = usePlayground();
  return useMemo(
    () => ({
      id,
      full,
      motion,
      active: motion && visible,
      label: format(pick(C.stageHint, locale), { name }),
      tried: () => progress.markEffect(id),
    }),
    [id, name, full, motion, visible, locale],
  );
}

function PausedOverlay() {
  const { locale } = useI18n();
  const { setMotion } = usePlayground();
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/70 p-4 backdrop-blur-[3px]">
      <div className="flex flex-col items-center gap-2.5 rounded-[var(--radius-lg)] border border-line bg-surface px-5 py-4 text-center shadow-md">
        <span className="flex items-center gap-1.5 text-[0.875rem] font-semibold text-ink">
          <Pause className="size-4" aria-hidden /> {pick(C.paused, locale)}
        </span>
        <button
          type="button"
          onClick={() => setMotion(true)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-[0.875rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          <Play className="size-3.5" aria-hidden /> {pick(C.playOne, locale)}
        </button>
      </div>
    </div>
  );
}

function TriedBadge({ id }: { id: EffectId }) {
  const { locale } = useI18n();
  const state = useProgress();
  const hydrated = useHydrated();
  if (!hydrated || !state.effects.includes(id)) return null;
  return (
    <span className="animate-pop pointer-events-none absolute top-3 right-3 z-30 inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[0.75rem] font-semibold text-success shadow-sm">
      <CircleCheck className="size-3.5" aria-hidden /> {pick(C.tried, locale)}
    </span>
  );
}

function Hint({ text, hidden }: { text: string; hidden: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-3 left-3 z-30 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[0.75rem] leading-snug font-medium text-bg shadow-md transition-opacity duration-500",
        hidden && "opacity-0",
      )}
    >
      <MousePointer2 className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{text}</span>
    </span>
  );
}

export function Placeholder() {
  return <div aria-hidden className="demo-canvas size-full" />;
}

/** A gallery card: live stage on top, name, why-in-a-line and the prompt below. */
export function EffectCard({ item }: { item: EffectSummary }) {
  const { locale } = useI18n();
  const { motion } = usePlayground();
  const stageRef = useRef<HTMLDivElement>(null);
  const { near, visible } = useInView(stageRef);
  const env = useEnv(item.id, item.name, false, visible);
  const [engaged, setEngaged] = useState(false);
  const Demo = effectDemos[item.id];

  return (
    <article
      aria-labelledby={`fx-${item.id}`}
      className="squircle flex w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-xs transition-shadow duration-300 hover:shadow-md"
    >
      <div
        ref={stageRef}
        className="relative h-64 border-b border-line sm:h-72"
        onPointerEnter={() => setEngaged(true)}
        onFocus={() => setEngaged(true)}
      >
        {near ? (
          <EffectEnvProvider value={env}>
            <Demo />
          </EffectEnvProvider>
        ) : (
          <Placeholder />
        )}
        {motion ? <Hint text={item.try} hidden={engaged} /> : <PausedOverlay />}
        <TriedBadge id={item.id} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
          <span className="font-semibold text-accent-ink">{item.categoryLabel}</span>
          <DifficultyDots level={item.level} label={item.levelLabel} />
        </p>
        <h3 id={`fx-${item.id}`} className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <Link href={item.href} lang="en" className="type-serif text-[1.75rem] leading-tight text-ink underline-offset-4 hover:underline">
            {item.name}
          </Link>
          {item.localName ? <span className="text-[0.9375rem] font-medium text-ink-2">{item.localName}</span> : null}
        </h3>
        <p className="mt-1.5 text-[0.9375rem] text-ink-2">{item.tagline}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <CopyPromptButton parts={item.prompt} variant="quiet" />
          <Link
            href={item.href}
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-semibold text-accent-ink transition-colors hover:bg-accent-soft"
          >
            {pick(C.howToBuild, locale)}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** The big stage on an effect’s own page. */
export function EffectShowcase({ id, name, tryText }: { id: EffectId; name: string; tryText: string }) {
  const { locale } = useI18n();
  const { motion, setMotion } = usePlayground();
  const stageRef = useRef<HTMLDivElement>(null);
  const { near, visible } = useInView(stageRef);
  const env = useEnv(id, name, true, visible);
  const [round, setRound] = useState(0);
  const Demo = effectDemos[id];

  return (
    <section
      aria-label={name}
      className="squircle overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="flex min-w-0 items-center gap-2 text-[0.9375rem] text-ink">
          <MousePointer2 className="size-4 shrink-0 text-accent-ink" aria-hidden />
          {tryText}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMotion(!motion)}
            aria-pressed={motion}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {motion ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
            {pick(C.motionLabel, locale)}
          </button>
          <button
            type="button"
            onClick={() => setRound((r) => r + 1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <RotateCcw className="size-3.5" aria-hidden /> {pick(C.reset, locale)}
          </button>
        </div>
      </div>
      <div ref={stageRef} className="relative h-[24rem] sm:h-[30rem]">
        {near ? (
          <EffectEnvProvider value={env}>
            <Demo key={round} />
          </EffectEnvProvider>
        ) : (
          <Placeholder />
        )}
        {motion ? null : <PausedOverlay />}
        <TriedBadge id={id} />
      </div>
    </section>
  );
}
