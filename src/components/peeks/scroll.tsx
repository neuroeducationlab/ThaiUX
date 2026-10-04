"use client";

import { useRef, useState } from "react";
import { ArrowUp, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    title: "Night market tips",
    progress: "Reading progress",
    tips: [
      "Arrive around 6 pm, before the crowds and the heat.",
      "Bring small notes — many stalls can’t change a ฿1,000 bill.",
      "Try one bite from many stalls instead of one big meal.",
      "Carry a cloth bag; you’ll leave with more than you planned.",
      "You reached the end — the bar above kept count the whole way.",
    ],
    end: "The end",
    top: "Top",
  },
  th: {
    title: "เคล็ดลับเดินตลาดนัดกลางคืน",
    progress: "ความคืบหน้าการอ่าน",
    tips: [
      "ไปถึงราวหกโมงเย็น ก่อนคนเยอะและก่อนอากาศร้อน",
      "พกแบงก์ย่อยไว้ หลายร้านทอนแบงก์พันไม่ได้",
      "ชิมร้านละคำหลาย ๆ ร้าน ดีกว่ากินร้านเดียวจนอิ่ม",
      "พกถุงผ้าไปด้วย เพราะจะได้ของกลับมาเยอะกว่าที่คิด",
      "อ่านมาถึงข้อสุดท้ายแล้ว แถบด้านบนนับให้ตลอดทาง",
    ],
    end: "จบแล้ว",
    top: "ขึ้นบนสุด",
  },
  zh: {
    title: "夜市小贴士",
    progress: "阅读进度",
    tips: [
      "傍晚六点左右到，避开人潮和暑热。",
      "带些零钱——很多摊位找不开一千泰铢。",
      "每家尝一口，比在一家吃到饱更有趣。",
      "带个布袋，你买的会比计划的多。",
      "读到最后一条了——上面的进度条一路都在计数。",
    ],
    end: "读完了",
    top: "回到顶部",
  },
  ja: {
    title: "ナイトマーケットのコツ",
    progress: "読んだ量",
    tips: [
      "混雑と暑さを避けて、夕方 6 時ごろに行こう。",
      "小銭を用意して。1,000 バーツ札をくずせない屋台も多い。",
      "1 軒で満腹になるより、いろんな屋台で一口ずつ。",
      "布のバッグを持参。予定より買い物が増えるはず。",
      "最後のコツまで来ました。上のバーがずっと数えていました。",
    ],
    end: "おしまい",
    top: "先頭へ",
  },
};

export default function ScrollPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const boxRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const atEnd = pct > 0.97;

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-line-strong bg-surface shadow-sm">
      <div
        role="progressbar"
        aria-label={t.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct * 100)}
        className="h-1 shrink-0 bg-surface-3"
      >
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="relative min-h-0 flex-1">
        <div
          ref={boxRef}
          tabIndex={0}
          aria-label={t.title}
          onScroll={() => {
            const el = boxRef.current;
            if (!el) return;
            const max = el.scrollHeight - el.clientHeight;
            const p = max > 0 ? Math.min(1, el.scrollTop / max) : 1;
            setPct(p);
            if (p > 0.97) experience();
          }}
          className="size-full overflow-y-auto px-3 py-2.5"
        >
          <p className="mb-1.5 text-[0.875rem] font-semibold text-ink">{t.title}</p>
          <ol className="space-y-2 text-[0.8125rem] leading-snug text-ink-2">
            {t.tips.map((tip, i) => (
              <li key={i} className={cn("flex gap-2", i === t.tips.length - 1 && "font-medium text-ink")}>
                <span className="tabular shrink-0 text-ink-3" aria-hidden>
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent transition-opacity duration-300",
            atEnd && "opacity-0",
          )}
        />
      </div>
      <div className="flex h-8 shrink-0 items-center justify-between border-t border-line px-3 text-[0.75rem]">
        <span className={cn("inline-flex items-center gap-1", atEnd ? "font-semibold text-success" : "tabular text-ink-2")}>
          {atEnd ? (
            <>
              <Check className="size-3.5" aria-hidden /> {t.end}
            </>
          ) : (
            `${Math.round(pct * 100)}%`
          )}
        </span>
        {pct > 0.4 ? (
          <button
            type="button"
            onClick={() => boxRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="animate-fade-up inline-flex h-6 items-center gap-1 rounded-full px-2 font-semibold text-accent-ink hover:bg-surface-2"
          >
            <ArrowUp className="size-3.5" aria-hidden /> {t.top}
          </button>
        ) : null}
      </div>
    </div>
  );
}
