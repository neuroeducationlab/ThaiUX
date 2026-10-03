"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { ProgressSummary } from "@/components/progress/progress-summary";
import { KineticText } from "./kinetic-text";
import { usePlayground } from "./provider";

/**
 * The first thing people see is itself an effect: the headline’s letters
 * respond to the cursor (kinetic type) and a spotlight lights up the dot
 * grid around it — wow first, explanation second.
 */
export function EffectsHero({
  eyebrow,
  title,
  lead,
  startLabel,
  formulaLabel,
  total,
}: {
  eyebrow: string;
  title: string[];
  lead: string;
  startLabel: string;
  formulaLabel: string;
  total: number;
}) {
  const { motion } = usePlayground();
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow || !motion) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
        glow.style.setProperty("--my", `${e.clientY - r.top}px`);
        glow.style.opacity = "1";
      });
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [motion]);

  const mask = "radial-gradient(circle 220px at var(--mx, 50%) var(--my, 50%), #000 0%, transparent 100%)";

  return (
    <section ref={sectionRef} className="demo-canvas relative overflow-hidden border-b border-line">
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--accent)_1.5px,transparent_0)] bg-[length:18px_18px] opacity-0 transition-opacity duration-500"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
      <Container size="wide" className="relative pt-12 pb-14 md:pt-20 md:pb-20">
        <Eyebrow className="flex items-center gap-2">
          <Sparkles className="size-4" aria-hidden /> {eyebrow}
        </Eyebrow>
        <KineticText
          as="h1"
          lines={title}
          track={sectionRef}
          active={motion}
          sweep
          min={560}
          max={900}
          radius={220}
          className="type-display text-[clamp(2.25rem,9vw,5.5rem)] text-ink"
        />
        <p className="type-lead measure-wide mt-6">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#effects"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-[1rem] font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover"
          >
            {startLabel} <ArrowDown className="size-4" aria-hidden />
          </a>
          <a
            href="#formula"
            className="inline-flex min-h-12 items-center rounded-full border border-line-strong bg-surface px-6 text-[1rem] font-semibold text-ink transition-colors hover:bg-surface-2"
          >
            {formulaLabel}
          </a>
        </div>
        <ProgressSummary kind="effects" total={total} className="mt-10 max-w-sm" />
      </Container>
    </section>
  );
}
