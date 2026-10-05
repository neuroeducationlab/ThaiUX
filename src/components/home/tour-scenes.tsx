"use client";

import { Award, Bot, Check, CircleCheck, Copy, Download, FlaskConical, Heart, Lock, Play, Send, Sparkles } from "lucide-react";
import type { PromptParts } from "@/content/effects";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { buildPrompt, promptIntro, stackLabels } from "@/components/effects/prompt";
import { usePlayground } from "@/components/effects/provider";

/**
 * The tour’s four parts. Each is a pure picture of one beat: the tour
 * engine (value-tour.tsx) owns the clock and hands in `beat`. Elements
 * marked data-ghost="2 3" are where the ghost pointer goes on those beats;
 * data-press="3" makes it press there. Everything here is a picture
 * (aria-hidden) except the real Copy prompt button.
 */
export type TourLabels = {
  region: string;
  kicker: string;
  title: string;
  cta: string;
  ctaAgain: string;
  ctaSub: string;
  steps: string[];
  stepsLong: string[];
  captions: [string, string][];
  chapter: string;
  pause: string;
  play: string;
  close: string;
  replay: string;
  paused: string;
  copiedPaused: string;
  goTo: string;
  mockCta: string;
  nothing: string;
  effectsBadge: string;
  copyPrompt: string;
  copied: string;
  copiedToast: string;
  copyFailed: string;
  aiTitle: string;
  aiPlaceholder: string;
  aiReply: string;
  like: string;
  liked: string;
  youExperienced: string;
  experienced: string;
  tryIt: string;
  cert: { kicker: string; title: string; presented: string; name: string; completed: string; download: string; saved: string };
  doneKicker: string;
  doneTitle: string;
  startModule: string;
  seeEffects: string;
};

export type TourData = {
  /** Effect names switched on in part 1, in order. */
  chips: string[];
  /** The effect whose prompt part 2 copies. */
  effect: { name: string; prompt: PromptParts };
  /** Glossary cards in part 3; the last one opens. */
  concepts: { id: string; term: string; local: string; short: string }[];
  stats: string[];
  lab: { badge: string; prompt: string; done: string; href: string };
  counts: { effects: number; modules: number };
  hrefs: { steps: string[]; module1: string; effects: string; lab: string };
};

type SceneProps = { beat: number; labels: TourLabels; data: TourData };
type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/** Confetti pieces: where each one flies (px), its spin and colour. */
const CONFETTI: [number, number, number, string][] = [
  [-46, -38, 220, "#6f7cff"],
  [38, -44, -160, "#ff6fcf"],
  [-62, -8, 300, "#ffc95c"],
  [58, -12, -260, "#5ee0c0"],
  [-30, -58, 140, "#ff8a5b"],
  [24, -62, -120, "#6f7cff"],
  [-54, 22, 260, "#ff6fcf"],
  [50, 24, -220, "#ffc95c"],
  [-14, -70, 90, "#5ee0c0"],
  [12, -50, -300, "#ff8a5b"],
  [-38, 40, 200, "#6f7cff"],
  [36, 42, -200, "#ff6fcf"],
  [-70, -30, 330, "#5ee0c0"],
  [68, -34, -330, "#ffc95c"],
];
const SPARKS = [0, 60, 120, 180, 240, 300];

/* ------------------------------------------------------------------
 * Part 1 — a plain page; four effects bring it to life.
 * Beats: 1 point at the button · 2 press, nothing happens · 3 chips arrive
 * 4–11 switch on each effect · 12 point (it pulls) · 13 press, confetti · 14 badge
 * ---------------------------------------------------------------- */
export function EffectsScene({ beat, labels, data }: SceneProps) {
  const on = (b: number) => beat >= b;
  return (
    <div aria-hidden className="tour-in flex min-h-0 flex-1 flex-col gap-2.5">
      <div
        data-bg={on(5) || undefined}
        data-glow={on(7) || undefined}
        data-magnet={on(9) || undefined}
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface shadow-md"
      >
        <div className="flex h-6 shrink-0 items-center gap-1 border-b border-line bg-surface-2 px-2.5">
          <i className="size-2 rounded-full bg-[#ff5f57]" />
          <i className="size-2 rounded-full bg-[#febc2e]" />
          <i className="size-2 rounded-full bg-[#28c840]" />
          <span lang="en" className="ml-2 truncate rounded-full bg-surface px-2 text-[0.625rem] leading-4 text-ink-2">
            your-site.com
          </span>
        </div>

        <div className="relative min-h-0 flex-[1.4] overflow-hidden px-3 pt-2.5 pb-2.5">
          <div className="tour-blobs absolute inset-0 bg-[linear-gradient(135deg,#3343c4,#7b3fe4)]">
            <i className="tour-blob -top-[35%] -left-[10%] aspect-square w-[46%] bg-[#6f7cff]" style={{ "--bx": "22px", "--by": "12px" } as Vars} />
            <i className="tour-blob -top-[30%] -right-[8%] aspect-square w-[40%] bg-[#ff6fcf]" style={{ "--bx": "-18px", "--by": "14px" } as Vars} />
            <i className="tour-blob -bottom-[75%] left-[42%] aspect-square w-[34%] bg-[#ffc95c] opacity-80" style={{ "--bx": "-14px", "--by": "-12px" } as Vars} />
            <i className="tour-blob -bottom-[70%] left-[8%] aspect-square w-[30%] bg-[#5ee0c0] opacity-70" style={{ "--bx": "16px", "--by": "-10px" } as Vars} />
          </div>
          <div className="relative flex items-center justify-between">
            <span className="tour-ink h-2 w-10 rounded-full" />
            <span className="flex gap-1.5">
              <span className="tour-ink tour-ink-soft h-1.5 w-6 rounded-full" />
              <span className="tour-ink tour-ink-soft h-1.5 w-6 rounded-full" />
              <span className="tour-ink tour-ink-soft h-1.5 w-6 rounded-full" />
            </span>
          </div>
          <span className="tour-ink relative mt-2.5 block h-2.5 w-[72%] rounded-full" />
          <span className="tour-ink relative mt-1 block h-2.5 w-[48%] rounded-full" />
          <span className="tour-ink tour-ink-soft relative mt-1.5 block h-1.5 w-[60%] rounded-full" />
          <div className="relative mt-2.5 flex items-center gap-2">
            <span
              data-ghost="1 2 12 13"
              data-press="2 13"
              data-pulled={beat === 12 || beat === 13 || undefined}
              className="tour-cta-mock relative inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-3.5 text-[0.6875rem] font-semibold"
            >
              {on(13) ? <Check className="animate-pop size-3" strokeWidth={3} /> : null}
              {labels.mockCta}
              {on(13) ? (
                <span className="tour-confetti pointer-events-none absolute inset-0">
                  {CONFETTI.map(([dx, dy, r, c], i) => (
                    <i key={i} style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--r": `${r}deg`, "--c": c } as Vars} />
                  ))}
                </span>
              ) : null}
            </span>
            {beat === 2 ? (
              <span className="animate-pop truncate rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-medium text-bg">{labels.nothing}</span>
            ) : null}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 px-3 pt-1 pb-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="tour-card flex min-h-0 flex-col gap-1 overflow-hidden rounded-[0.5rem] p-1.5" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="h-[45%] min-h-3 rounded-[0.3rem] bg-surface-3" />
              <span className="h-1.5 w-3/4 shrink-0 rounded-full bg-line-strong" />
              <span className="h-1.5 w-1/2 shrink-0 rounded-full bg-line-strong" />
            </span>
          ))}
        </div>

        {on(14) ? (
          <span className="animate-pop absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[0.75rem] font-semibold whitespace-nowrap text-bg shadow-lg">
            <Sparkles className="size-3.5" /> {format(labels.effectsBadge, { n: data.counts.effects })}
          </span>
        ) : null}
      </div>

      <div className={cn("flex flex-wrap justify-center gap-1.5 transition-[opacity,transform] duration-500", on(3) ? "opacity-100" : "translate-y-2 opacity-0")}>
        {data.chips.map((name, i) => {
          const press = 5 + 2 * i;
          return (
            <span
              key={name}
              lang="en"
              data-ghost={`${press - 1} ${press}`}
              data-press={`${press}`}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[0.75rem] font-semibold whitespace-nowrap transition-colors duration-300",
                on(press) ? "border-transparent bg-accent text-on-accent" : "border-line-strong bg-surface text-ink",
              )}
            >
              {on(press) ? <Check className="size-3.5" strokeWidth={3} /> : <Sparkles className="size-3.5 text-accent-ink" />}
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Part 2 — copy the prompt, paste it into an AI, get the effect.
 * Beats: 1 point at Copy · 2 press · 3 the chat arrives · 4 paste
 * 5 the AI types · 6 reply with the result · 7 point at it (it pulls)
 * ---------------------------------------------------------------- */
export function PromptScene({ beat, labels, data, copied, onCopy }: SceneProps & { copied: boolean; onCopy: () => void }) {
  const { stack } = usePlayground();
  const ticked = copied || beat >= 2;
  return (
    <div className="tour-in relative min-h-0 flex-1">
      <div className="tour-window absolute top-0 left-0 z-10 w-[90%] overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface shadow-md @lg:w-[84%]">
        <div aria-hidden className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
          <span className="flex min-w-0 items-center gap-1.5 text-[0.75rem] font-semibold text-ink">
            <Sparkles className="size-3.5 shrink-0 text-accent-ink" />
            <span lang="en" className="truncate">
              {data.effect.name}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[0.625rem] font-medium text-ink-2">{stackLabels[stack]}</span>
        </div>
        <p aria-hidden lang="en" className="line-clamp-3 px-3 pt-2 font-mono text-[0.6875rem] leading-[1.45] text-ink-2">
          {buildPrompt(data.effect.prompt, stack)}
        </p>
        <div className="relative flex items-center justify-end gap-2 px-3 pt-1.5 pb-2.5">
          {ticked ? (
            <span aria-hidden className="animate-pop text-[0.6875rem] font-semibold text-success">
              ✓ {labels.copied}
            </span>
          ) : null}
          <button
            type="button"
            data-ghost="1 2"
            data-press="2"
            onClick={onCopy}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-[0.75rem] font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover active:scale-[0.97]"
          >
            {ticked ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {labels.copyPrompt}
          </button>
          {beat === 2 || beat === 3 ? (
            <span aria-hidden className="tour-fly pointer-events-none absolute right-8 bottom-3 rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[0.625rem] text-accent-ink">
              prompt
            </span>
          ) : null}
        </div>
      </div>

      <div
        aria-hidden
        className={cn(
          "tour-window absolute right-0 bottom-0 z-20 flex w-[90%] flex-col overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface shadow-lg @lg:w-[84%]",
          beat >= 3 ? "opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink">
          <Bot className="size-3.5 text-accent-ink" /> {labels.aiTitle}
        </div>
        <div className="flex min-h-[6.75rem] flex-col justify-end gap-1.5 px-3 py-2">
          {beat >= 4 ? (
            <p lang="en" className="animate-pop ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-accent px-2.5 py-1.5 text-[0.6875rem] leading-snug text-on-accent">
              <span className="line-clamp-2">{promptIntro(data.effect.prompt.build, stack)}</span>
            </p>
          ) : null}
          {beat === 5 ? (
            <span className="tour-typing flex w-fit gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-2.5 py-2">
              <i />
              <i />
              <i />
            </span>
          ) : null}
          {beat >= 6 ? (
            <div className="animate-pop w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-surface-2 px-2.5 py-2">
              <p className="text-[0.6875rem] leading-snug text-ink">{labels.aiReply}</p>
              <span
                data-ghost="7"
                data-pulled={beat >= 7 || undefined}
                className="tour-cta-mock tour-cta-live mt-1.5 inline-flex h-6 items-center rounded-full px-3 text-[0.625rem] font-semibold"
              >
                {labels.mockCta}
              </span>
            </div>
          ) : null}
        </div>
        <div className="px-2.5 pb-2.5">
          <div data-ghost="3 4" data-press="4" className="flex h-8 items-center justify-between gap-2 rounded-full border border-line-strong bg-surface px-3 text-[0.6875rem] text-ink-2">
            <span className="truncate">{beat >= 4 ? "" : labels.aiPlaceholder}</span>
            <Send className="size-3.5 shrink-0 text-accent-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Part 3 — point at a glossary card: mist, then a demo you can play.
 * Then a Lab experiment card slides in — the glossary is where you learn,
 * the Lab is where you practise.
 * Beats: 1 point at the card · 2 mist · 3 the demo appears · 4 point
 * 5 press (feedback) · 6 “you just experienced…” and what’s inside
 * 7 Lab card slides in · 8 ghost moves to Lab · 9 press Lab, 5/5 complete
 * ---------------------------------------------------------------- */
export function LearnScene({ beat, labels, data }: SceneProps) {
  const last = data.concepts.length - 1;
  const phase = beat >= 3 ? "open" : beat === 2 ? "mist" : "idle";
  const showLab = beat >= 7;
  return (
    <div aria-hidden className="tour-in flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "grid min-h-0 grid-cols-2 gap-2 transition-[flex,opacity] duration-500 @md:grid-cols-3",
          showLab ? "flex-[0.6]" : "flex-1",
        )}
      >
        {data.concepts.map((c, i) => {
          const target = i === last;
          return (
            <div
              key={c.id}
              data-peek={target ? phase : "idle"}
              data-ghost={target ? "1 2" : undefined}
              className={cn(
                "peek-card relative flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-md)] border bg-surface p-3 shadow-xs transition-colors duration-300",
                target && beat >= 1 ? "border-accent/40" : "border-line",
                i === 1 && "@max-md:hidden",
              )}
              style={{ "--mx": "62%", "--my": "58%" } as Vars}
            >
              <div className="peek-face flex min-h-0 flex-col">
                <p lang="en" className="type-serif text-[1.25rem] leading-tight text-ink">
                  {c.term}
                </p>
                <p className="mt-0.5 truncate text-[0.6875rem] font-medium text-ink">{c.local}</p>
                <p className="mt-2 line-clamp-4 text-[0.75rem] leading-snug text-ink">{c.short}</p>
              </div>
              <span className="peek-face mt-auto inline-flex h-7 w-fit items-center gap-1 rounded-full border border-line-strong px-2.5 text-[0.6875rem] font-semibold text-ink">
                <Play className="size-3 fill-current text-accent-ink" /> {labels.tryIt}
              </span>
              {target ? (
                <span className="peek-fog">
                  <span className="peek-haze" />
                </span>
              ) : null}
              {target && beat >= 3 ? (
                <div className="peek-live absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-surface p-2">
                  <p lang="en" className="text-[0.75rem] font-semibold text-ink">
                    {c.term}
                  </p>
                  <span
                    data-ghost="4 5"
                    data-press="5"
                    className={cn(
                      "relative inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] font-semibold transition-colors duration-200",
                      beat >= 5 ? "border-transparent bg-[#ffe4e6] text-[#1a1a1e]" : "border-line-strong bg-surface text-ink",
                    )}
                  >
                    <Heart className={cn("size-4", beat >= 5 && "animate-pop fill-[#c2185b] text-[#c2185b]")} />
                    {beat >= 5 ? labels.liked : labels.like}
                    {beat >= 5 ? <span className="tour-plus absolute -top-3.5 right-1 rounded-full bg-[#ffe4e6] px-1.5 py-0.5 text-[0.75rem] font-bold leading-none text-[#8a1a24]">+1</span> : null}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p
        className={cn(
          "mt-2.5 flex min-h-5 items-center gap-1.5 text-[0.8125rem] font-semibold text-success transition-opacity duration-300",
          beat >= 6 ? "opacity-100" : "opacity-0",
        )}
      >
        <CircleCheck className="size-4 shrink-0" /> {format(labels.youExperienced, { term: data.concepts[last].term })}
      </p>
      {/* The Lab card slides in from below, taking over the stats slot */}
      <div
        className={cn(
          "tour-lab mt-2 flex items-stretch gap-3 overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface p-3 shadow-sm transition-[opacity,translate,height,padding,margin] duration-500 ease-out-soft",
          showLab ? "opacity-100 translate-y-0" : "pointer-events-none h-0 translate-y-4 border-transparent bg-transparent p-0 opacity-0 shadow-none",
        )}
      >
        <div
          data-ghost="8 9"
          data-press="9"
          className={cn(
            "relative flex size-14 shrink-0 items-center justify-center rounded-[0.5rem] text-white transition-colors duration-300",
            beat >= 9 ? "bg-success" : "bg-accent",
          )}
        >
          {beat >= 9 ? <Check className="animate-pop size-7" strokeWidth={3} /> : <FlaskConical className="size-6" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-[0.6875rem] font-semibold text-accent-ink">{data.lab.badge}</p>
          <p className="truncate text-[0.9375rem] font-semibold text-ink">{data.lab.prompt}</p>
          {beat >= 9 ? (
            <p className="animate-fade-up mt-0.5 flex items-center gap-1 text-[0.75rem] font-semibold text-success">
              <CircleCheck className="size-3.5" /> {data.lab.done}
            </p>
          ) : (
            <div className="mt-1 flex gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <span
                    className={cn("block h-full rounded-full bg-accent transition-[width] duration-500", beat >= 9 ? "w-full" : "w-0")}
                    style={{ transitionDelay: `${80 + i * 60}ms` }}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "mt-2 flex min-h-7 flex-wrap gap-1.5 transition-opacity duration-300",
          showLab ? "opacity-0" : "",
        )}
      >
        {data.stats.map((s, i) => (
          <span
            key={s}
            className={cn("rounded-full bg-accent-soft px-2.5 py-1 text-[0.75rem] font-semibold text-accent-ink", beat >= 6 && !showLab ? "animate-pop" : "opacity-0")}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Part 4 — eight modules tick off; a certificate arrives with your name.
 * Beats: 1 all ticked · 2 the certificate · 3 your name · 4 the seal
 * 5 point at Download · 6 press
 * ---------------------------------------------------------------- */
export function CertificateScene({ beat, labels, data }: SceneProps) {
  const total = data.counts.modules;
  return (
    <div aria-hidden className="tour-in flex min-h-0 flex-1 flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="tour-tick flex size-6 items-center justify-center rounded-full" style={{ "--i": i } as Vars}>
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ))}
        <span className="tabular ml-1.5 text-[0.8125rem] font-semibold text-ink">
          <span className="tour-count" style={{ "--total": total } as Vars} />/{total}
        </span>
      </div>

      <div className="relative min-h-0 w-full max-w-[22rem] flex-1">
        <div
          data-locked={beat < 2 || undefined}
          className="tour-cert relative flex h-full flex-col items-center justify-center rounded-[0.625rem] bg-[#fbf8f1] px-5 py-4 text-center text-[#1a1a1e] shadow-lg ring-1 ring-black/5"
        >
          <span className="pointer-events-none absolute inset-1.5 rounded-[0.4rem] border-2 border-[#3343c4]" />
          <span className="pointer-events-none absolute inset-[0.6rem] rounded-[0.25rem] border border-[#b8862b]" />
          <span lang="en" className="absolute top-4 left-5 text-[0.6875rem] font-bold">
            UXLab
          </span>
          <span lang="en" className="relative text-[0.5625rem] font-semibold tracking-[0.16em] text-[#2b379f] uppercase">
            {labels.cert.kicker}
          </span>
          <span className="relative mt-0.5 text-[1.25rem] leading-tight font-bold">{labels.cert.title}</span>
          <span className="relative mt-1 text-[0.6875rem] text-[#5c5c66]">{labels.cert.presented}</span>
          <span data-on={beat >= 3 || undefined} className="tour-typed relative mt-0.5 text-[1.25rem] leading-snug font-semibold text-[#2b379f]">
            {labels.cert.name}
          </span>
          <span className="relative mt-0.5 h-px w-3/5 bg-[#b8862b]" />
          <span className="relative mt-1.5 max-w-[16rem] text-[0.625rem] leading-snug text-[#3a3a42]">{labels.cert.completed}</span>
          <span
            data-ghost="5 6"
            data-press="6"
            className={cn(
              "relative mt-2.5 inline-flex h-7 items-center gap-1 rounded-full px-3 text-[0.6875rem] font-semibold text-white transition-colors",
              beat >= 6 ? "bg-[#1d7348]" : "bg-[#3343c4]",
            )}
          >
            {beat >= 6 ? <Check className="size-3.5" strokeWidth={3} /> : <Download className="size-3.5" />}
            {beat >= 6 ? labels.cert.saved : labels.cert.download}
          </span>
          <span
            data-on={beat >= 4 || undefined}
            className="tour-seal absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-[#3343c4] text-white shadow-md ring-2 ring-[#b8862b] ring-offset-2 ring-offset-[#fbf8f1]"
          >
            <Award className="size-5" />
          </span>
          {beat >= 4 ? (
            <span className="pointer-events-none absolute right-[2.375rem] bottom-[2.375rem]">
              {SPARKS.map((a) => (
                <i key={a} className="tour-spark absolute -mt-[3px] -ml-[3px] block size-1.5 rounded-full bg-[#ffc95c]" style={{ "--a": `${a}deg` } as Vars} />
              ))}
            </span>
          ) : null}
        </div>
        {beat < 2 ? (
          <span className="tour-lock absolute inset-0 z-10 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-ink text-bg shadow-lg">
              <Lock className="size-5" />
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
