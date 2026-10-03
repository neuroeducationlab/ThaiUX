"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, useEffectEnv } from "../engine";

const copy = {
  en: { items: ["Explore", "Learn", "Build", "Share"], label: "Menu" },
  th: { items: ["สำรวจ", "เรียนรู้", "ลงมือทำ", "แบ่งปัน"], label: "เมนู" },
  zh: { items: ["探索", "学习", "构建", "分享"], label: "菜单" },
  ja: { items: ["さがす", "まなぶ", "つくる", "わかちあう"], label: "メニュー" },
};

const POOLS: Record<string, string> = {
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?<>/",
  th: "กขคงจฉชซญดตถทนบปผพฟภมยรลวสหอฮ",
  zh: "的一是不了人我在有他这中大来上国个到说们为子和你地出道也时年",
  ja: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ",
};

function graphemes(text: string, locale: string) {
  return Array.from(new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(text), (s) => s.segment);
}

/** One menu item; its letters scramble on hover/focus and settle left to right. */
function ScrambleItem({ word, pool, active, onPlay }: { word: string; pool: string; active: boolean; onPlay: () => void }) {
  const { locale } = useI18n();
  const letters = graphemes(word, locale);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef(0);

  // fix each letter's box to its final width, so random characters never shift the layout
  useEffect(() => {
    document.fonts.ready.then(() => {
      spans.current.forEach((el) => {
        if (!el) return;
        el.style.width = "";
        el.style.width = `${el.getBoundingClientRect().width}px`;
      });
    });
  }, [word]);

  const settle = () => {
    window.clearInterval(timer.current);
    spans.current.forEach((el, i) => {
      if (el) el.textContent = letters[i];
    });
  };

  const play = () => {
    if (!active) return;
    onPlay();
    window.clearInterval(timer.current);
    const ends = letters.map((_, i) => 3 + i * 2 + Math.floor(Math.random() * 3));
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame += 1;
      spans.current.forEach((el, i) => {
        if (!el) return;
        if (frame >= ends[i]) el.textContent = letters[i];
        else if (Math.random() < 0.6) el.textContent = pool[Math.floor(Math.random() * pool.length)];
      });
      if (frame > ends[ends.length - 1]) window.clearInterval(timer.current);
    }, 32);
  };

  useEffect(() => () => window.clearInterval(timer.current), []);

  return (
    <li>
      <button
        type="button"
        aria-label={word}
        onPointerEnter={play}
        onFocus={play}
        onPointerLeave={settle}
        onBlur={settle}
        className="group flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-1.5 text-left text-[#e8e8f2] transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
      >
        <span className="size-1.5 rounded-full bg-[#7af0ff] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
        <span aria-hidden className="font-mono text-[clamp(1.375rem,1.1rem+1.2vw,2rem)] font-semibold tracking-wide uppercase">
          {letters.map((g, i) => (
            <span
              key={i}
              ref={(el) => {
                spans.current[i] = el;
              }}
              className="inline-block text-center"
            >
              {g}
            </span>
          ))}
        </span>
      </button>
    </li>
  );
}

export default function TextScramble() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const { locale } = useI18n();
  const plays = useRef(0);

  return (
    <Stage focusable={false} className="bg-[radial-gradient(circle_at_20%_10%,#1c2147,#0c0c14_60%)]">
      <nav aria-label={t.label} className="absolute inset-0 flex items-center px-4 sm:px-8">
        <ul className="w-full space-y-0.5">
          {t.items.map((word) => (
            <ScrambleItem
              key={word}
              word={word}
              pool={POOLS[locale] ?? POOLS.en}
              active={env.active}
              onPlay={() => {
                plays.current += 1;
                if (plays.current === 3) env.tried();
              }}
            />
          ))}
        </ul>
      </nav>
    </Stage>
  );
}
