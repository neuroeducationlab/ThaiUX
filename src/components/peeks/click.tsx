"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: { small: "Small", big: "Big", hit: "Hit me", done: "Done", missed: "missed", result: "The big one was quicker — that’s Fitts’s Law." },
  th: { small: "เป้าเล็ก", big: "เป้าใหญ่", hit: "กดฉัน", done: "ครบแล้ว", missed: "พลาด", result: "เป้าใหญ่กดได้เร็วกว่า นี่คือกฎของ Fitts" },
  zh: { small: "小目标", big: "大目标", hit: "点我", done: "完成", missed: "失误", result: "大目标点得更快——这就是费茨定律。" },
  ja: { small: "小さい的", big: "大きい的", hit: "押して", done: "完了", missed: "ミス", result: "大きいほうが速く押せた。これがフィッツの法則。" },
};

const GOAL = 3;
// Deterministic spots (percent of the arena), kept away from the edges
const SPOTS = [
  [50, 50], [28, 30], [72, 70], [32, 72], [70, 30], [26, 54], [74, 48], [48, 28], [56, 72],
] as const;

type Score = { hits: number; misses: number; spot: number };

function Arena({ size, label, score, onHit, onMiss }: { size: number; label: string; score: Score; onHit: () => void; onMiss: () => void }) {
  const t = useCopy(copy);
  const done = score.hits >= GOAL;
  const [x, y] = SPOTS[score.spot % SPOTS.length];
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <p className="flex items-baseline justify-between gap-1 text-[0.75rem]">
        <span className="truncate font-semibold text-ink">{label}</span>
        <span className="tabular shrink-0 text-ink-2">
          {Math.min(score.hits, GOAL)}/{GOAL}
          {score.misses ? ` · ${t.missed} ${score.misses}` : ""}
        </span>
      </p>
      <div
        onPointerDown={(e) => {
          if (!done && e.target === e.currentTarget) onMiss();
        }}
        className={cn("relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-sm)] border border-line-strong bg-surface", done && "bg-success-soft")}
      >
        {done ? (
          <span className="animate-pop absolute inset-0 flex items-center justify-center text-[0.8125rem] font-semibold text-success">✓ {t.done}</span>
        ) : (
          <button
            type="button"
            onClick={onHit}
            aria-label={`${t.hit} — ${label}`}
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-md transition-transform active:scale-90"
          />
        )}
      </div>
    </div>
  );
}

export default function ClickPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [small, setSmall] = useState<Score>({ hits: 0, misses: 0, spot: 1 });
  const [big, setBig] = useState<Score>({ hits: 0, misses: 0, spot: 4 });
  const both = small.hits >= GOAL && big.hits >= GOAL;

  useEffect(() => {
    if (both) experience();
  }, [both, experience]);

  const hit = (s: Score) => ({ ...s, hits: s.hits + 1, spot: s.spot + 2 });
  const miss = (s: Score) => ({ ...s, misses: s.misses + 1 });

  return (
    <div className="flex size-full flex-col gap-2">
      <div className="flex min-h-0 flex-1 gap-2.5">
        <Arena size={16} label={t.small} score={small} onHit={() => setSmall(hit)} onMiss={() => setSmall(miss)} />
        <Arena size={44} label={t.big} score={big} onHit={() => setBig(hit)} onMiss={() => setBig(miss)} />
      </div>
      <p className="min-h-4 text-center text-[0.75rem] leading-tight font-medium text-ink">
        {both ? <span className="animate-fade-up inline-block">{t.result}</span> : null}
      </p>
    </div>
  );
}
