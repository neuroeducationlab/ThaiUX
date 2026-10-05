"use client";

import Link from "next/link";
import { forwardRef, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Award, Check, Pause, Play, RotateCcw, Sparkles, X } from "lucide-react";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useReducedMotion } from "@/components/effects/engine";
import { copyText } from "@/components/effects/prompt-block";
import { buildPrompt } from "@/components/effects/prompt";
import { usePlayground } from "@/components/effects/provider";
import { CertificateScene, EffectsScene, LearnScene, PromptScene, type TourData, type TourLabels } from "./tour-scenes";

export type { TourData, TourLabels } from "./tour-scenes";

/**
 * Each part of the tour: its beats (ms from the start of the part), when it
 * ends, and the beat where its caption turns from the problem to the answer.
 * About 32 seconds in all — quick enough to feel exciting, slow enough to read.
 */
const PARTS = [
  { beats: [0, 800, 1500, 2700, 3300, 3800, 4400, 4850, 5450, 5900, 6500, 6950, 7550, 8100, 8800], end: 10400, answer: 3 },
  { beats: [0, 800, 1400, 2400, 3100, 3800, 4900, 5600], end: 8000, answer: 3 },
  { beats: [0, 700, 1300, 2000, 2800, 3300, 4000], end: 7000, answer: 6 },
  { beats: [0, 1500, 2000, 2600, 3500, 4400, 4900], end: 7000, answer: 2 },
];

type Mode = "idle" | "playing" | "paused" | "done";

/** Where an element rests in the stage, ignoring transforms (so a window still sliding in is aimed at correctly). */
function restingPoint(el: HTMLElement, stage: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== stage) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  if (!n) {
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    x = r.left - s.left;
    y = r.top - s.top;
  }
  return { x: x + Math.min(el.offsetWidth * 0.62, el.offsetWidth - 6), y: y + el.offsetHeight * 0.6 };
}

/**
 * The hero’s right side: one clear call to action, then a quick tour of what
 * people get — effects that bring a page to life, a prompt to paste into
 * their own AI, learning by playing, and a certificate — told as the four
 * steps of one easy journey. A ghost pointer shows every move.
 *
 * It only moves after a press, can be paused or closed at any time (and
 * pauses itself when scrolled away), and never counts as progress.
 */
export function ValueTour({ labels, data }: { labels: TourLabels; data: TourData }) {
  const { stack } = usePlayground();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("idle");
  const [part, setPart] = useState(0);
  const [beat, setBeat] = useState(0);
  const [copied, setCopied] = useState(false);
  const [watched, setWatched] = useState(false);

  const regionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const clock = useRef({ t: 0, last: 0, beat: 0 });
  const focusTo = useRef<"pause" | "cta" | "done" | null>(null);
  const pressTimer = useRef(0);

  const running = mode === "playing" || mode === "paused";
  const focusInside = () => !!regionRef.current?.contains(document.activeElement);

  const goTo = (i: number) => {
    clock.current = { t: 0, last: 0, beat: 0 };
    if (i >= PARTS.length) {
      if (focusInside()) focusTo.current = "done";
      setMode("done");
      setWatched(true);
      return;
    }
    setPart(i);
    setBeat(0);
    setMode("playing");
  };

  const start = (i = 0) => {
    // the button that started it is about to disappear: hand focus to Pause
    if (mode === "idle" || (mode === "done" && stageRef.current?.contains(document.activeElement))) focusTo.current = "pause";
    setCopied(false);
    goTo(i);
  };

  const close = () => {
    if (focusInside()) focusTo.current = "cta";
    clock.current = { t: 0, last: 0, beat: 0 };
    setMode("idle");
    setPart(0);
    setBeat(0);
    setCopied(false);
  };

  const pause = () => setMode((m) => (m === "playing" ? "paused" : m));
  const resume = () => setMode((m) => (m === "paused" ? "playing" : m));

  // The clock: time only passes while playing; beats and the progress bar follow it
  const tick = useEffectEvent((now: number) => {
    const c = clock.current;
    if (c.last) c.t += Math.min(64, now - c.last); // a background tab doesn't skip ahead
    c.last = now;
    const p = PARTS[part];
    fills.current[part]?.style.setProperty("--p", String(Math.min(1, c.t / p.end)));
    let b = c.beat;
    while (b + 1 < p.beats.length && c.t >= p.beats[b + 1]) b++;
    if (b !== c.beat) {
      c.beat = b;
      setBeat(b);
    }
    if (c.t < p.end) return true;
    goTo(part + 1);
    return false;
  });

  useEffect(() => {
    if (mode !== "playing") return;
    let raf = requestAnimationFrame(function loop(now) {
      if (tick(now)) raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      clock.current.last = 0;
    };
  }, [mode, part]);

  // The ghost pointer glides to this beat’s target, and presses it if asked
  useLayoutEffect(() => {
    if (!running) return;
    const stage = stageRef.current;
    const ghost = ghostRef.current;
    if (!stage || !ghost) return;
    const target = stage.querySelector<HTMLElement>(`[data-ghost~="${beat}"]`);
    if (!target) return;
    const { x, y } = restingPoint(target, stage);
    ghost.style.transform = `translate(${x}px, ${y}px)`;
    if (!(target.dataset.press ?? "").split(" ").includes(String(beat))) return;
    ghost.dataset.press = "";
    const ripple = rippleRef.current;
    if (ripple) {
      ripple.classList.remove("tour-ripple");
      void ripple.offsetWidth; // restart the ripple
      ripple.classList.add("tour-ripple");
    }
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => ghost.removeAttribute("data-press"), 220);
  }, [running, part, beat]);

  useEffect(() => () => window.clearTimeout(pressTimer.current), []);

  // Focus follows the tour when it was inside it: Pause on start, the recap at the end, the button on close
  useEffect(() => {
    const f = focusTo.current;
    if (!f) return;
    focusTo.current = null;
    const el = f === "pause" ? pauseRef.current : f === "cta" ? ctaRef.current : doneRef.current;
    el?.focus({ preventScroll: true });
  }, [mode]);

  // Scrolled out of view? Pause, so nobody misses a part
  useEffect(() => {
    const el = regionRef.current;
    if (mode !== "playing" || !el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio < 0.2) setMode((m) => (m === "playing" ? "paused" : m));
    }, { threshold: [0, 0.2] });
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const copyPrompt = async () => {
    const ok = await copyText(buildPrompt(data.effect.prompt, stack));
    toast(ok ? labels.copiedToast : labels.copyFailed, ok ? "success" : "info");
    if (!ok) return;
    setCopied(true);
    pause(); // give them time to go and paste it
  };

  const caption = running ? labels.captions[part][beat >= PARTS[part].answer ? 1 : 0] : "";
  const chapter = format(labels.chapter, { n: part + 1, total: PARTS.length });
  const announce = running ? `${chapter} · ${labels.steps[part]}: ${caption}` : mode === "done" ? labels.doneTitle : "";

  return (
    <section
      ref={regionRef}
      aria-label={labels.region}
      onKeyDown={(e) => {
        if (e.defaultPrevented) return;
        if (e.key === "Escape" && mode !== "idle") {
          e.preventDefault();
          close();
        } else if (running && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
          e.preventDefault();
          goTo(Math.max(0, part + (e.key === "ArrowRight" ? 1 : -1)));
        }
      }}
      className="squircle relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-lg"
    >
      <div
        ref={stageRef}
        data-mode={mode}
        data-paused={mode === "paused" || undefined}
        className="tour-stage @container relative h-[29rem] overflow-hidden select-none sm:h-[27.5rem]"
        onPointerMove={(e) => {
          if (mode !== "idle" || reduced || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          e.currentTarget.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.removeProperty("--px");
          e.currentTarget.style.removeProperty("--py");
        }}
        onClick={(e) => {
          // a tap on the picture pauses it, like a video (a click, so scrolling past never does); real buttons and links still work
          if (mode === "playing" && !(e.target as Element).closest("button, a")) pause();
        }}
      >
        {mode === "idle" ? (
          <Poster ref={ctaRef} labels={labels} data={data} watched={watched} onStart={() => start(0)} />
        ) : mode === "done" ? (
          <Finale ref={doneRef} labels={labels} data={data} onReplay={() => start(0)} />
        ) : (
          <div className="flex h-full flex-col">
            <div aria-hidden className="shrink-0 px-4 pt-4 @md:px-5">
              <p className="text-[0.75rem] font-semibold text-accent-ink">
                {chapter} · {labels.steps[part]}
              </p>
              <p key={`${part}-${caption}`} className="animate-fade-up mt-1 min-h-[2.75em] text-[1.0625rem] leading-snug font-semibold text-balance text-ink [word-break:auto-phrase] @md:text-[1.1875rem]">
                {caption}
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 pb-4 @md:px-5 @md:pb-5">
              {part === 0 ? (
                <EffectsScene key="effects" beat={beat} labels={labels} data={data} />
              ) : part === 1 ? (
                <PromptScene key="prompt" beat={beat} labels={labels} data={data} copied={copied} onCopy={copyPrompt} />
              ) : part === 2 ? (
                <LearnScene key="learn" beat={beat} labels={labels} data={data} />
              ) : (
                <CertificateScene key="certificate" beat={beat} labels={labels} data={data} />
              )}
            </div>

            <div
              aria-hidden
              ref={(el) => {
                ghostRef.current = el;
                // enter from the bottom-right corner
                if (el && !el.style.transform && stageRef.current) {
                  el.style.transform = `translate(${stageRef.current.clientWidth - 44}px, ${stageRef.current.clientHeight - 30}px)`;
                }
              }}
              className="tour-ghost pointer-events-none absolute top-0 left-0 z-50"
            >
              <svg width="26" height="30" viewBox="0 0 26 30" className="drop-shadow-md">
                <path d="M3 2 L3 24 L9 18.5 L13 27.5 L17 25.8 L13.2 17 L21.5 17 Z" fill="var(--ink)" stroke="var(--bg)" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <span ref={rippleRef} className="absolute top-0 left-0 -mt-3 -ml-3 size-6 rounded-full border-2 border-accent opacity-0" />
            </div>

            {mode === "paused" ? (
              <div className="animate-fade-up absolute inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center gap-3 bg-surface/70 px-6 text-center backdrop-blur-[2px]" onClick={resume}>
                <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg">
                  <Play className="size-6 translate-x-0.5 fill-current" />
                </span>
                <p className="max-w-[19rem] text-[0.9375rem] font-medium text-ink">{copied ? labels.copiedPaused : labels.paused}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* The journey: four steps that are also the tour’s progress */}
      <div className="flex items-start gap-2 border-t border-line px-3 pt-2 pb-2.5 sm:px-4">
        <ol className="grid min-w-0 flex-1 grid-cols-4 gap-2">
          {labels.steps.map((name, i) => {
            const state = mode === "done" ? "past" : !running ? "idle" : i < part ? "past" : i === part ? "now" : "next";
            const inner = (
              <>
                <span className="relative block h-1 overflow-hidden rounded-full bg-surface-3">
                  <span
                    ref={(el) => {
                      fills.current[i] = el;
                    }}
                    className="tour-fill absolute inset-0 rounded-full bg-accent"
                    style={state === "now" ? undefined : ({ "--p": state === "past" ? 1 : 0 } as React.CSSProperties)}
                  />
                </span>
                <span className="mt-1.5 flex min-h-[2.5em] items-start gap-1 text-left text-[0.75rem] leading-tight">
                  <span className={cn("tabular shrink-0 font-semibold", state === "idle" || state === "next" ? "text-ink-2" : "text-accent-ink")}>{i + 1}</span>
                  <span className={cn("min-w-0 font-medium", state === "now" ? "text-ink" : "text-ink-2")}>{name}</span>
                </span>
              </>
            );
            return (
              <li key={i} className="min-w-0">
                {mode === "idle" ? (
                  <div className="py-1.5">{inner}</div>
                ) : (
                  <button
                    type="button"
                    onClick={() => start(i)}
                    aria-label={format(labels.goTo, { n: i + 1, name })}
                    aria-current={state === "now" ? "step" : undefined}
                    className="-mx-1 block w-[calc(100%+0.5rem)] rounded-[var(--radius-xs)] px-1 py-1.5 transition-colors hover:bg-surface-2"
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        {mode !== "idle" ? (
          <div className="flex shrink-0 items-center gap-1 self-center">
            {running ? (
              <ControlButton ref={pauseRef} label={mode === "playing" ? labels.pause : labels.play} onClick={() => (mode === "playing" ? pause() : resume())}>
                {mode === "playing" ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 fill-current" aria-hidden />}
              </ControlButton>
            ) : null}
            <ControlButton label={labels.close} onClick={close}>
              <X className="size-4" aria-hidden />
            </ControlButton>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}

const ControlButton = forwardRef<HTMLButtonElement, { label: string; onClick: () => void; children: React.ReactNode }>(function ControlButton(
  { label, onClick, children },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
    >
      {children}
    </button>
  );
});

/* ------------------------------------------------------------------
 * Before the tour: a poster with one button. The corner cards are a
 * glimpse of what’s inside; they drift a little with the mouse.
 * ---------------------------------------------------------------- */
const Poster = forwardRef<HTMLButtonElement, { labels: TourLabels; data: TourData; watched: boolean; onStart: () => void }>(function Poster(
  { labels, data, watched, onStart },
  ref,
) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* an effect */}
        <div className="tour-float absolute top-[6%] -left-[4%] w-[10.5rem] -rotate-6 overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface shadow-md [--depth:14px] @max-md:w-[8.5rem]">
          <div className="flex h-4 items-center gap-1 border-b border-line bg-surface-2 px-2">
            <i className="size-1.5 rounded-full bg-[#ff5f57]" />
            <i className="size-1.5 rounded-full bg-[#febc2e]" />
            <i className="size-1.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="relative h-[4.5rem] overflow-hidden bg-[linear-gradient(135deg,#3343c4,#7b3fe4)] p-2 @max-md:h-14">
            <i className="absolute -top-4 -left-3 size-14 rounded-full bg-[#6f7cff] blur-md" />
            <i className="absolute -right-3 -bottom-6 size-14 rounded-full bg-[#ff6fcf] blur-md" />
            <span className="relative block h-1.5 w-3/4 rounded-full bg-white/90" />
            <span className="relative mt-1 block h-1.5 w-1/2 rounded-full bg-white/60" />
            <span className="relative mt-2 inline-flex h-4 items-center rounded-full bg-white px-2 text-[0.5rem] font-bold text-[#3343c4]">{labels.mockCta}</span>
          </div>
        </div>
        {/* a prompt */}
        <div className="tour-float absolute top-[8%] -right-[5%] w-[11rem] rotate-[5deg] rounded-[var(--radius-md)] border border-line-strong bg-surface p-2.5 text-left shadow-md [--depth:-10px] @max-md:w-[9rem]">
          <p lang="en" className="flex items-center gap-1 text-[0.625rem] font-semibold text-ink">
            <Sparkles className="size-3 text-accent-ink" /> {data.effect.name}
          </p>
          <p lang="en" className="mt-1 line-clamp-2 font-mono text-[0.5625rem] leading-snug text-ink-2">
            Create {data.effect.prompt.build}…
          </p>
          <span className="mt-1.5 inline-flex h-5 items-center gap-1 rounded-full bg-accent px-2 text-[0.5625rem] font-semibold text-on-accent">{labels.copyPrompt}</span>
        </div>
        {/* a concept you can feel */}
        <div className="tour-float absolute bottom-[7%] -left-[3%] w-[9.5rem] rotate-[4deg] rounded-[var(--radius-md)] border border-line-strong bg-surface p-2.5 text-left shadow-md [--depth:-12px] @max-md:w-[8rem]">
          <p lang="en" className="type-serif text-[1.125rem] leading-none text-ink">
            {data.concepts[data.concepts.length - 1].term}
          </p>
          <p className="mt-1 truncate text-[0.5625rem] text-ink-2">{data.concepts[data.concepts.length - 1].local}</p>
          <span className="mt-1.5 inline-flex h-5 items-center gap-1 rounded-full bg-success-soft px-2 text-[0.5625rem] font-semibold text-success">
            <Check className="size-3" strokeWidth={3} /> {labels.experienced}
          </span>
        </div>
        {/* a certificate */}
        <div className="tour-float absolute -right-[4%] bottom-[5%] w-[10rem] -rotate-[5deg] rounded-[0.5rem] bg-[#fbf8f1] p-1.5 shadow-md ring-1 ring-black/5 [--depth:12px] @max-md:w-[8.5rem]">
          <div className="flex flex-col items-center rounded-[0.3rem] border border-[#b8862b] px-2 py-2.5 text-center">
            <span className="text-[0.75rem] leading-none font-bold text-[#1a1a1e]">{labels.cert.title}</span>
            <span className="mt-1.5 block h-1 w-3/5 rounded-full bg-[#2b379f]/70" />
            <span className="mt-1 block h-1 w-4/5 rounded-full bg-[#1a1a1e]/15" />
            <span className="mt-2 flex size-5 items-center justify-center rounded-full bg-[#3343c4] text-white ring-1 ring-[#b8862b] ring-offset-1 ring-offset-[#fbf8f1]">
              <Award className="size-3" />
            </span>
          </div>
        </div>
        {/* keeps the words readable over the cards */}
        <span className="absolute inset-0 bg-[radial-gradient(closest-side,var(--surface)_58%,transparent)] bg-[length:78%_60%] bg-center bg-no-repeat" />
      </div>

      <div className="relative max-w-[19.5rem]">
        <p className="text-[0.9375rem] font-medium text-ink-2">{labels.kicker}</p>
        <h2 className="mt-1 text-[1.875rem] leading-tight font-semibold tracking-tight text-ink @md:text-[2.125rem]">{labels.title}</h2>
        <button
          ref={ref}
          type="button"
          onClick={onStart}
          className={cn(
            "mt-6 inline-flex h-14 items-center gap-3 rounded-full bg-accent pr-6 pl-2 text-[1rem] font-semibold text-on-accent shadow-lg",
            "transition-[background-color,translate,box-shadow,scale] duration-200 ease-out-soft hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl",
            "focus-visible:outline-[3px] focus-visible:outline-offset-4 active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0",
            !watched && "tour-cta",
          )}
        >
          <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-on-accent/15">
            <Play className="size-[1.125rem] translate-x-px fill-current" />
          </span>
          {watched ? labels.ctaAgain : labels.cta}
        </button>
        <p className="mt-3 text-[0.8125rem] text-ink-2">{labels.ctaSub}</p>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------
 * After the tour: the journey, ticked off, and where to start.
 * ---------------------------------------------------------------- */
const Finale = forwardRef<HTMLHeadingElement, { labels: TourLabels; data: TourData; onReplay: () => void }>(function Finale({ labels, data, onReplay }, ref) {
  return (
    <div className="tour-in flex h-full flex-col justify-center px-4 py-4 @md:px-7">
      <p className="type-label flex items-center gap-1.5 text-accent-ink">
        <Sparkles className="size-4" aria-hidden /> {labels.doneKicker}
      </p>
      <h2 ref={ref} tabIndex={-1} className="mt-1 text-[1.625rem] leading-tight font-semibold tracking-tight text-ink outline-none @md:text-[1.875rem]">
        {labels.doneTitle}
      </h2>
      <ol className="mt-3 space-y-0.5">
        {labels.stepsLong.map((s, i) => (
          <li key={i}>
            <Link href={data.hrefs.steps[i]} className="group -mx-2 flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-2 py-1 transition-colors hover:bg-surface-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <svg viewBox="0 0 24 24" className="tour-check size-4" style={{ "--i": i } as React.CSSProperties} aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 text-[0.875rem] leading-snug text-ink">{s}</span>
              <ArrowRight className="size-4 shrink-0 text-ink-2 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ButtonLink href={data.hrefs.module1}>
          {labels.startModule} <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <ButtonLink href={data.hrefs.effects} variant="secondary">
          {labels.seeEffects}
        </ButtonLink>
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[0.875rem] font-semibold text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <RotateCcw className="size-4" aria-hidden /> {labels.replay}
        </button>
      </div>
    </div>
  );
});
