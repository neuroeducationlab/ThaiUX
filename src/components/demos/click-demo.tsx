"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    small: "Small target",
    big: "Comfortable target",
    hits: "Hits",
    misses: "Misses",
    avg: "Avg",
    hitMe: "Hit me",
    done: "Done",
    result:
      "Bigger targets were faster and harder to miss — that’s Fitts’s Law. Now imagine the small one on a bumpy bus.",
    keyboardNote: "Using a keyboard? Tab to a target and press Enter — keyboard users never miss, but they still need it to be focusable.",
  },
  th: {
    small: "เป้าเล็ก",
    big: "เป้าขนาดพอดีมือ",
    hits: "โดน",
    misses: "พลาด",
    avg: "เฉลี่ย",
    hitMe: "กดฉัน",
    done: "เสร็จแล้ว",
    result: "เป้าที่ใหญ่กว่ากดได้เร็วกว่าและพลาดยากกว่า นี่คือกฎของ Fitts ลองนึกภาพเป้าเล็ก ๆ ตอนนั่งรถเมล์ที่กระเด้งดูสิ",
    keyboardNote: "ใช้คีย์บอร์ดอยู่ใช่ไหม? กด Tab ไปที่เป้าแล้วกด Enter ผู้ใช้คีย์บอร์ดไม่มีวันกดพลาด แต่องค์ประกอบนั้นต้องรับโฟกัสได้ด้วย",
  },
  zh: {
    small: "小目标",
    big: "舒适的目标",
    hits: "命中",
    misses: "失误",
    avg: "平均",
    hitMe: "点我",
    done: "完成",
    result: "更大的目标点得更快、更不容易失误——这就是费茨定律。想象一下在颠簸的公交车上点那个小目标。",
    keyboardNote: "在用键盘？按 Tab 移到目标再按 Enter——键盘用户不会点偏，但元素必须能获得焦点。",
  },
  ja: {
    small: "小さいターゲット",
    big: "押しやすいターゲット",
    hits: "ヒット",
    misses: "ミス",
    avg: "平均",
    hitMe: "押して",
    done: "完了",
    result: "大きいターゲットのほうが速く、ミスしにくかったはず。これがフィッツの法則です。揺れるバスの中で小さいほうを押す場面を想像してみてください。",
    keyboardNote: "キーボードをお使いですか？ Tab でターゲットに移動して Enter。キーボードならミスはしませんが、フォーカスできることが前提です。",
  },
};

const GOAL = 5;
// Deterministic positions so server and client render the same first frame
const SPOTS = [
  [50, 50], [18, 30], [82, 70], [30, 78], [72, 22], [12, 62], [88, 35], [45, 20], [60, 80], [25, 45],
];

type Stats = { hits: number; misses: number; times: number[]; spot: number };

function Arena({
  size,
  label,
  stats,
  onHit,
  onMiss,
}: {
  size: number;
  label: string;
  stats: Stats;
  onHit: () => void;
  onMiss: () => void;
}) {
  const t = useCopy(copy);
  const done = stats.hits >= GOAL;
  const [x, y] = SPOTS[stats.spot % SPOTS.length];
  const avg = stats.times.length ? stats.times.reduce((a, b) => a + b, 0) / stats.times.length / 1000 : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-[0.8125rem]">
        <span className="font-semibold text-ink">{label}</span>
        <span className="tabular text-ink-2">
          {t.hits} {Math.min(stats.hits, GOAL)}/{GOAL} · {t.misses} {stats.misses}
          {avg ? ` · ${t.avg} ${avg.toFixed(2)}s` : ""}
        </span>
      </div>
      <div
        onPointerDown={(e) => {
          if (!done && e.target === e.currentTarget) onMiss();
        }}
        className={cn(
          "relative h-40 overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface",
          done && "opacity-70",
        )}
      >
        {done ? (
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-success">✓ {t.done}</span>
        ) : (
          <button
            type="button"
            onClick={onHit}
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent text-[0.625rem] font-bold text-on-accent shadow-md transition-transform active:scale-90"
            aria-label={`${t.hitMe} — ${label}`}
          >
            {size >= 40 ? t.hitMe : ""}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ClickDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const blank = (spot: number): Stats => ({ hits: 0, misses: 0, times: [], spot });
  const [small, setSmall] = useState<Stats>(blank(1));
  const [big, setBig] = useState<Stats>(blank(4));
  const last = useRef<{ small: number; big: number }>({ small: 0, big: 0 });

  const hit = (which: "small" | "big") => {
    const now = performance.now();
    const set = which === "small" ? setSmall : setBig;
    set((s) => {
      const dt = last.current[which] ? now - last.current[which] : 0;
      const next = { ...s, hits: s.hits + 1, spot: s.spot + 3, times: dt && dt < 5000 ? [...s.times, dt] : s.times };
      return next;
    });
    last.current[which] = now;
  };

  const bothDone = small.hits >= GOAL && big.hits >= GOAL;
  useEffect(() => {
    if (bothDone) experience();
  }, [bothDone, experience]);

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Arena size={18} label={t.small} stats={small} onHit={() => hit("small")} onMiss={() => setSmall((s) => ({ ...s, misses: s.misses + 1 }))} />
        <Arena size={52} label={t.big} stats={big} onHit={() => hit("big")} onMiss={() => setBig((s) => ({ ...s, misses: s.misses + 1 }))} />
      </div>
      <p className={cn("text-center text-[0.875rem]", bothDone ? "animate-fade-up text-ink" : "text-ink-2")}>
        {bothDone ? t.result : t.keyboardNote}
      </p>
    </div>
  );
}
