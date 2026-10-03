"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { VIRTUAL_POINTER } from "./engine";

/** Split into words, then grapheme clusters, so Thai vowels and tone marks stay on their consonant. */
function split(line: string, locale: string): string[][] {
  const seg = new Intl.Segmenter(locale, { granularity: "grapheme" });
  return line.split(" ").map((word) => Array.from(seg.segment(word), (s) => s.segment));
}

type Glyph = { el: HTMLSpanElement; x: number; y: number; p: number };

/**
 * Text whose letters get bolder (variable font weight), lift and take the
 * accent colour as the pointer comes close. Each line stays on one line,
 * so changing weights never re-wraps the text. Screen readers get the
 * plain text; the letters are aria-hidden.
 */
export function KineticText({
  lines,
  as: Tag = "p",
  className,
  lineClassName,
  track,
  active,
  radius = 160,
  min = 250,
  max = 900,
  sweep = false,
}: {
  lines: string[];
  as?: "p" | "h1" | "h2";
  className?: string;
  lineClassName?: string;
  /** Element whose pointer movement drives the effect (defaults to the text itself). */
  track?: React.RefObject<HTMLElement | null>;
  active: boolean;
  radius?: number;
  min?: number;
  max?: number;
  /** Sweep a gentle wave across once when it first becomes active. */
  sweep?: boolean;
}) {
  const { locale } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const glyphs = useRef<Glyph[]>([]);
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const swept = useRef(false);
  const text = lines.join(" ");

  const measure = useEffectEvent(() => {
    const root = rootRef.current;
    if (!root) return;
    const sx = window.scrollX;
    const sy = window.scrollY;
    glyphs.current = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-g]"), (el) => {
      const r = el.getBoundingClientRect();
      const prev = glyphs.current.find((g) => g.el === el);
      return { el, x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy, p: prev?.p ?? 0 };
    });
  });

  // measure after fonts load and whenever the layout changes size
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let alive = true;
    document.fonts.ready.then(() => alive && measure());
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [text]);

  // pointer tracking (page coordinates, so scrolling doesn't need a re-measure)
  useEffect(() => {
    const target = track?.current ?? rootRef.current;
    if (!target) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY, inside: true };
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };
    const onVirtual = (e: Event) => {
      const { on, x, y } = (e as CustomEvent<{ on: boolean; x: number; y: number }>).detail;
      const r = target.getBoundingClientRect();
      pointer.current = { x: r.left + x + window.scrollX, y: r.top + y + window.scrollY, inside: on };
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);
    target.addEventListener(VIRTUAL_POINTER, onVirtual);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener(VIRTUAL_POINTER, onVirtual);
    };
  }, [track]);

  useEffect(() => {
    if (!active) return;
    // intro wave: a virtual pointer travels across the text once
    const sweepStart = sweep && !swept.current ? performance.now() + 350 : 0;
    swept.current = swept.current || sweep;
    let id = 0;
    let idleFrames = 0;

    const loop = (now: number) => {
      const gs = glyphs.current;
      let { x: px, y: py, inside } = pointer.current;
      const sweeping = sweepStart > 0 && now >= sweepStart && now <= sweepStart + 1500;
      if (sweeping && !inside && gs.length) {
        const xs = gs.map((g) => g.x);
        const left = Math.min(...xs) - radius * 0.4;
        const right = Math.max(...xs) + radius * 0.4;
        px = left + (right - left) * ((now - sweepStart) / 1500);
        py = (gs[0].y + gs[gs.length - 1].y) / 2;
        inside = true;
      }
      let busy = inside || (sweepStart > 0 && now < sweepStart);
      for (const g of gs) {
        let target = 0;
        if (inside) {
          const d = Math.hypot(g.x - px, g.y - py);
          if (d < radius) target = (1 - d / radius) ** 1.6;
        }
        g.p += (target - g.p) * 0.16;
        if (Math.abs(g.p - target) > 0.002) busy = true;
        g.el.style.setProperty("--p", g.p.toFixed(3));
      }
      idleFrames = busy ? 0 : idleFrames + 1;
      if (idleFrames === 30) measure(); // re-measure once letters settle (weights change widths)
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active, sweep, radius]);

  return (
    <Tag
      ref={rootRef as React.RefObject<never>}
      className={cn("kinetic", className)}
      style={{ ["--kt-min" as string]: min, ["--kt-max" as string]: max }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {lines.map((line, li) => (
          <span key={li} className={cn("block whitespace-nowrap", lineClassName)}>
            {split(line, locale).map((word, wi) => (
              <span key={wi} className="inline-block">
                {wi > 0 ? <span className="inline-block w-[0.28em]" /> : null}
                {word.map((g, gi) => (
                  <span key={gi} data-g="" className="kinetic-g">
                    {g}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
