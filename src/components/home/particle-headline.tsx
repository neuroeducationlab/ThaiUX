"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion, useFinePointer } from "@/components/effects/engine";

/**
 * A big headline rendered as particles: drag the mouse through it and the
 * letters shatter into dots, revealing the detail text underneath. Walk
 * away and the dots settle back into the words. Inspired by the Effects
 * library’s particle demo, but tuned for a quiet editorial section:
 *   - letters drift gently when idle, not actively animated;
 *   - the detail text is a real paragraph in the DOM (readable without JS
 *     and for screen readers), with opacity driven by how scattered the
 *     particles are;
 *   - reduced motion keeps the headline still and skips the swarm;
 *   - touch devices get a single tap to shatter and tap-anywhere-to-reform.
 *
 * The particles are drawn to a canvas; the heading sits above as text for
 * SEO + a11y, and fades out as the dots take over.
 */
export function ParticleHeadline({
  text,
  detail,
  action,
  hint,
  className,
  particleColors,
}: {
  text: string;
  detail: React.ReactNode;
  action?: React.ReactNode;
  hint?: string;
  className?: string;
  particleColors?: string[];
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scattered, setScattered] = useState(0); // 0 = assembled, 1 = fully scattered
  const [ready, setReady] = useState(false);

  const colors = useMemo(() => particleColors ?? ["#3343c4", "#4f3fe4", "#7b3fe4", "#c084fc", "#e879d4"], [particleColors]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const g = canvas.getContext("2d", { willReadFrequently: true });
    if (!g) return;
    if (reduced) {
      // defer so this effect finishes before React re-renders
      queueMicrotask(() => setReady(true));
      return; // no swarm; the heading stays as plain text
    }

    type Pt = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; c: number };
    let particles: Pt[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, inside: false, down: false, lastT: 0, vx: 0, vy: 0 };
    const state = { scatter: 0 }; // smoothed “how scattered” (0..1)
    let raf = 0;
    let needRebuild = true;

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    /** Rasterise the text on a scratch canvas and sample its pixels. */
    const build = () => {
      const fontFamily = getComputedStyle(canvas).fontFamily;
      const scratch = document.createElement("canvas");
      scratch.width = W;
      scratch.height = H;
      const sg = scratch.getContext("2d", { willReadFrequently: true });
      if (!sg) return;
      // Fit the text to the box: shrink until it fits.
      let size = Math.min(H * 0.5, W * 0.16, 220);
      const render = () => {
        sg.clearRect(0, 0, W, H);
        sg.fillStyle = "#fff";
        sg.textAlign = "center";
        sg.textBaseline = "middle";
        sg.font = `800 ${size}px ${fontFamily}`;
      };
      render();
      // split into words. Intl.Segmenter knows Thai, Chinese and Japanese boundaries;
      // for scripts without it, we fall back to whitespace splitting.
      let tokens: string[];
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        tokens = Array.from(new Intl.Segmenter(undefined, { granularity: "word" }).segment(text), (seg) => seg.segment);
      } else {
        tokens = text.split(/(\s+)/);
      }
      const lines: string[] = [];
      let line = "";
      const maxW = W * 0.9;
      for (const token of tokens) {
        const next = line + token;
        if (line.trim() && sg.measureText(next).width > maxW) {
          lines.push(line.trim());
          line = token.trimStart();
        } else {
          line = next;
        }
      }
      if (line.trim()) lines.push(line.trim());
      // shrink until all lines fit the height AND the width
      let lineH = size * 1.08;
      while ((lineH * lines.length > H * 0.95 || lines.some((l) => sg.measureText(l).width > maxW)) && size > 24) {
        size -= 2;
        lineH = size * 1.08;
        render();
      }
      const top = H / 2 - ((lines.length - 1) * lineH) / 2;
      lines.forEach((l, i) => sg.fillText(l, W / 2, top + i * lineH));
      const data = sg.getImageData(0, 0, W, H).data;
      // sampling step: more pixels on big stages, capped so phones stay smooth
      const target = Math.min(4800, Math.max(1600, Math.round((W * H) / 260)));
      const samples: number[] = [];
      for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (data[(y * W + x) * 4 + 3] > 140) samples.push(x, y);
      const count = Math.min(target, samples.length / 2);
      const step = samples.length / 2 / Math.max(1, count);
      particles = Array.from({ length: Math.round(count) }, (_, i) => {
        const j = Math.floor(i * step) * 2;
        const hx = samples[j];
        const hy = samples[j + 1];
        return { hx, hy, x: hx, y: hy, vx: 0, vy: 0, c: Math.floor((hx / Math.max(1, W)) * colors.length) };
      });
      needRebuild = false;
      setReady(true);
    };

    const draw = () => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      // group by colour for fewer fillStyle changes
      for (let c = 0; c < colors.length; c++) {
        g.fillStyle = colors[c];
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].c === c) g.fillRect(particles[i].x - 1.5, particles[i].y - 1.5, 3.2, 3.2);
        }
      }
    };

    let totalDisp = 0;
    const frame = () => {
      if (needRebuild) build();
      if (!particles.length) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const radius = Math.max(90, Math.min(W, H) * 0.28);
      const push = pointer.inside ? 2.6 + Math.min(5, Math.hypot(pointer.vx, pointer.vy) * 0.15) : 0;
      totalDisp = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (pointer.inside) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / radius) * push;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        // spring back
        p.vx = (p.vx + (p.hx - p.x) * 0.045) * 0.86;
        p.vy = (p.vy + (p.hy - p.y) * 0.045) * 0.86;
        p.x += p.vx;
        p.y += p.vy;
        const dx = p.x - p.hx;
        const dy = p.y - p.hy;
        totalDisp += dx * dx + dy * dy;
      }
      // scatter metric: average displacement, mapped 0..1
      const avg = Math.sqrt(totalDisp / particles.length);
      const next = Math.min(1, avg / 42);
      state.scatter = state.scatter * 0.82 + next * 0.18;
      // the heading fades out as the dots take over, under 5 s of change
      setScattered((prev) => (Math.abs(prev - state.scatter) > 0.01 ? state.scatter : prev));
      draw();
      // damp pointer velocity so it ebbs when the user holds still
      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      raf = requestAnimationFrame(frame);
    };

    const locate = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      const dt = Math.max(1, e.timeStamp - pointer.lastT);
      const k = 16 / dt;
      if (pointer.inside) {
        pointer.vx = pointer.vx * 0.5 + (nx - pointer.x) * k * 0.5;
        pointer.vy = pointer.vy * 0.5 + (ny - pointer.y) * k * 0.5;
      }
      pointer.x = nx;
      pointer.y = ny;
      pointer.lastT = e.timeStamp;
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.vx = 0;
      pointer.vy = 0;
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      // a tap scatters nearby dots harder (touch devices need a kick)
      const radius = Math.max(90, Math.min(W, H) * 0.3);
      for (const p of particles) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < radius) {
          const f = (1 - d / radius) * 10;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
    };

    measure();
    build();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      measure();
      needRebuild = true;
    });
    ro.observe(wrap);
    const onFontsReady = () => (needRebuild = true);
    document.fonts.ready.then(onFontsReady).catch(() => {});

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, [text, colors, reduced]);

  // When the dots are scattered, the detail text goes brighter.
  const detailOpacity = Math.min(1, 0.6 + scattered * 0.6);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrapRef}
        aria-hidden={reduced ? undefined : "true"}
        className="relative mx-auto flex min-h-[clamp(14rem,26vw,24rem)] w-full items-center justify-center overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        {/* The heading as real text, for SEO and screen readers.
           * Once the canvas is ready it becomes invisible and the particles
           * are the only visible headline — the canvas lays the text out itself,
           * so the HTML and canvas don't fight over wrapping. */}
        <h2
          className={cn(
            "type-display pointer-events-none px-4 text-center text-balance text-ink transition-opacity duration-500",
            !reduced && ready && "sr-only",
          )}
          style={reduced || !ready ? undefined : { opacity: 0 }}
        >
          {text}
        </h2>
        {!reduced ? (
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" style={{ opacity: ready ? 1 : 0, transition: "opacity 400ms ease" }} />
        ) : null}
        {!reduced && ready && scattered < 0.08 ? (
          <p
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5 text-[0.75rem] font-medium text-ink-2 opacity-70",
              fine ? "" : "hidden",
            )}
          >
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-accent" />
            {hint ?? "Drag across the words"}
          </p>
        ) : null}
      </div>
      {/* Detail that appears as the dots scatter */}
      <div
        className="mx-auto mt-6 max-w-[42rem] text-center transition-opacity duration-200"
        style={reduced ? undefined : { opacity: detailOpacity }}
      >
        {detail}
      </div>
      {action ? (
        <div className="mt-9 flex flex-wrap justify-center gap-3" style={reduced ? undefined : { opacity: Math.min(1, 0.7 + scattered * 0.3) }}>
          {action}
        </div>
      ) : null}
      {!reduced && !ready ? null : null}

    </div>
  );
}
