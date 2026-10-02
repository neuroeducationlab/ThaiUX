"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, MousePointerClick } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format, pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { home } from "@/content/home";

/**
 * The homepage’s first lesson: one button that teaches four terms.
 * Pointing, pressing, tabbing and clicking each light up the concept
 * you just felt — the site’s core loop (experience → name it) in miniature.
 */
type Exp = "hover" | "active" | "focus" | "feedback";
const ORDER: Exp[] = ["hover", "active", "focus", "feedback"];
const TERMS: Record<Exp, { term: string; id: string }> = {
  hover: { term: "Hover", id: "hover" },
  active: { term: "Active", id: "active-state" },
  focus: { term: "Focus", id: "focus-state" },
  feedback: { term: "Feedback", id: "feedback" },
};

function subscribeHover(cb: () => void) {
  const m = window.matchMedia("(hover: none)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export function HeroStage() {
  const { locale, dict } = useI18n();
  const s = home.stage;
  const [done, setDone] = useState<Exp[]>([]);
  const [latest, setLatest] = useState<Exp | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // Touch screens can’t hover, and focus rings need a keyboard —
  // don’t count what people can’t do on their device.
  const noHover = useSyncExternalStore(subscribeHover, () => window.matchMedia("(hover: none)").matches, () => false);
  const touchOnly = (e: Exp) => noHover && (e === "hover" || e === "focus");

  const available = ORDER.filter((e) => !touchOnly(e));
  const count = done.filter((e) => available.includes(e)).length;
  const complete = count === available.length;

  const mark = (e: Exp) => {
    setDone((d) => (d.includes(e) ? d : [...d, e]));
    setLatest(e);
  };

  return (
    <div className="squircle relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-lg">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <p className="type-label flex items-center gap-2 text-accent-ink">
          <MousePointerClick className="size-4" aria-hidden /> {pick(s.label, locale)}
        </p>
        <p className="tabular text-[0.8125rem] font-medium text-ink-2">{format(pick(s.progress, locale), { n: count, total: available.length })}</p>
      </div>

      <div className="flex h-52 items-center justify-center bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] [background-size:18px_18px] sm:h-60">
        <button
          type="button"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") mark("hover");
          }}
          onPointerDown={() => mark("active")}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") mark("active");
          }}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) mark("focus");
          }}
          onClick={() => {
            mark("feedback");
            setConfirmed(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setConfirmed(false), 1600);
          }}
          className={cn(
            "inline-flex h-14 min-w-44 items-center justify-center gap-2 rounded-full px-8 text-[1.0625rem] font-semibold shadow-md",
            "transition-[background-color,transform,box-shadow] duration-200 ease-out-soft active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
            "focus-visible:outline-[3px] focus-visible:outline-offset-4",
            confirmed ? "bg-success text-white dark:text-[#0b1f14]" : "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-lg active:bg-accent-press",
          )}
        >
          {confirmed ? (
            <>
              <Check className="animate-pop size-5" strokeWidth={2.75} aria-hidden /> {pick(s.done, locale)}
            </>
          ) : (
            pick(s.button, locale)
          )}
        </button>
      </div>

      <div className="border-t border-line px-5 py-4">
        <div aria-live="polite" className="min-h-[3.25rem]">
          {latest ? (
            <div key={latest} className="animate-fade-up">
              <p className="font-semibold text-ink">{format(dict.glossary.youExperienced, { term: TERMS[latest].term })}</p>
              <p className="text-[0.9375rem] text-ink-2">{pick(s.explain[latest], locale)}</p>
            </div>
          ) : (
            <p className="text-[0.9375rem] text-ink-2">{pick(noHover ? s.touchPrompt : s.prompt, locale)}</p>
          )}
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {ORDER.map((e) => {
            const lit = done.includes(e);
            const off = touchOnly(e) && !lit;
            return (
              <li key={e}>
                <Link
                  href={routes.concept(locale, TERMS[e].id)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.875rem] font-medium transition-colors duration-200",
                    lit ? "border-transparent bg-accent-soft text-accent-ink" : "border-line-strong text-ink-2 hover:text-ink",
                    off && "line-through decoration-ink-3",
                  )}
                >
                  {lit ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
                  <span lang="en">{TERMS[e].term}</span>
                  <span className="sr-only">{lit ? ` — ${dict.progress.experienced}` : ` — ${dict.progress.notYet}`}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {noHover ? <p className="mt-3 text-[0.8125rem] text-ink-2">{pick(s.touch, locale)}</p> : null}
        {complete ? <p className="animate-fade-up mt-3 text-[0.875rem] font-medium text-success">{pick(s.complete, locale)}</p> : null}
      </div>
    </div>
  );
}
