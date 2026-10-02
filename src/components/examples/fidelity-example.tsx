"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const LEVELS = ["sketch", "wireframe", "mockup", "prototype"] as const;
type Level = (typeof LEVELS)[number];

const copy = {
  en: {
    levels: { sketch: "Sketch", wireframe: "Wireframe", mockup: "Mock-up", prototype: "Prototype" } as Record<Level, string>,
    notes: {
      sketch: "Minutes to make, easy to throw away. Tests the idea: does a seat-booking screen even need these parts?",
      wireframe: "Structure and priority, no styling. Tests layout and flow — where does the time picker go?",
      mockup: "Real colours, type and content — but static. Tests visual details and reactions to the look.",
      prototype: "Looks and behaves like the real thing. Tests the interaction itself — try booking a seat.",
    } as Record<Level, string>,
    slider: "Fidelity",
    movie: "The Lantern Festival",
    times: ["14:30", "17:15", "20:00"],
    seats: "Choose seats",
    book: "Book 1 seat",
    booked: "Booked!",
    staticNote: "Static image — nothing is clickable yet",
  },
  th: {
    levels: { sketch: "ภาพสเก็ตช์", wireframe: "Wireframe", mockup: "ม็อกอัป", prototype: "Prototype" },
    notes: {
      sketch: "ใช้เวลาไม่กี่นาที ทิ้งได้ง่าย ทดสอบไอเดีย: หน้าจองที่นั่งต้องมีส่วนเหล่านี้จริงไหม?",
      wireframe: "โครงสร้างและลำดับความสำคัญ ยังไม่มีสไตล์ ทดสอบเลย์เอาต์และขั้นตอน ตัวเลือกรอบฉายควรอยู่ตรงไหน?",
      mockup: "สี ตัวอักษร และเนื้อหาจริง แต่ยังกดไม่ได้ ทดสอบรายละเอียดภาพและความรู้สึกต่อหน้าตา",
      prototype: "หน้าตาและการทำงานเหมือนของจริง ทดสอบการโต้ตอบเอง ลองจองที่นั่งดูสิ",
    },
    slider: "ระดับ Fidelity",
    movie: "เทศกาลโคมไฟ",
    seats: "เลือกที่นั่ง",
    book: "จอง 1 ที่นั่ง",
    booked: "จองแล้ว!",
    staticNote: "เป็นภาพนิ่ง ยังกดอะไรไม่ได้",
  },
  zh: {
    levels: { sketch: "草图", wireframe: "线框图", mockup: "视觉稿", prototype: "原型" },
    notes: {
      sketch: "几分钟就能画好，扔掉也不心疼。测试想法本身：选座页面真的需要这些部分吗？",
      wireframe: "只有结构和优先级，没有样式。测试布局和流程——场次选择应该放在哪里？",
      mockup: "真实的颜色、字体和内容——但是静态的。测试视觉细节以及人们对外观的反应。",
      prototype: "外观和行为都像真的一样。测试交互本身——试着订一个座位。",
    },
    slider: "保真度",
    movie: "灯笼节",
    seats: "选择座位",
    book: "预订 1 个座位",
    booked: "已预订！",
    staticNote: "静态图片——还不能点击",
  },
  ja: {
    levels: { sketch: "スケッチ", wireframe: "ワイヤーフレーム", mockup: "モックアップ", prototype: "プロトタイプ" },
    notes: {
      sketch: "数分で描けて、すぐ捨てられる。アイデアを試す段階。座席予約の画面に、本当にこの要素が必要？",
      wireframe: "構造と優先順位だけで、装飾はなし。レイアウトと流れを試す。上映時間の選択はどこに置く？",
      mockup: "本物の色、文字、コンテンツ。でも静止画。見た目の細部と印象を試す。",
      prototype: "見た目も動きも本物そっくり。インタラクションそのものを試す。座席を予約してみましょう。",
    },
    slider: "フィデリティ",
    movie: "ランタン・フェスティバル",
    seats: "座席を選ぶ",
    book: "1 席を予約",
    booked: "予約しました！",
    staticNote: "静止画です。まだ何も押せません",
  },
};

const SEATS = 18;

export default function FidelityExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [level, setLevel] = useState(0);
  const [time, setTime] = useState(1);
  const [seat, setSeat] = useState<number | null>(null);
  const [booked, setBooked] = useState(false);
  const id = useId();
  const L: Level = LEVELS[level];
  const live = L === "prototype";

  return (
    <div className="mx-auto grid max-w-3xl items-center gap-8 md:grid-cols-[18rem_1fr]">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[18rem] overflow-hidden rounded-[2rem] border-2 p-4 transition-all duration-500",
          L === "sketch" && "rotate-[-1deg] border-dashed border-ink-3 bg-surface",
          L === "wireframe" && "border-line-strong bg-surface",
          (L === "mockup" || L === "prototype") && "border-line-strong bg-[#14141a] text-white shadow-lg",
        )}
      >
        {/* Poster */}
        <div
          className={cn(
            "mb-3 flex h-24 items-end rounded-[var(--radius-md)] p-3",
            L === "sketch" && "border-2 border-dashed border-ink-3",
            L === "wireframe" && "bg-surface-3",
            (L === "mockup" || L === "prototype") && "bg-[radial-gradient(circle_at_30%_30%,#ffcf6b,transparent_40%),linear-gradient(135deg,#7a2e8f,#2a1858)]",
          )}
        >
          {L === "sketch" ? <span className="h-2 w-24 rounded bg-ink-3/50" /> : L === "wireframe" ? <span className="text-[0.75rem] font-semibold text-ink-2">[ poster ]</span> : <span className="font-semibold">{t.movie}</span>}
        </div>

        {/* Times */}
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((i) => {
            const label = t.times[i];
            if (L === "sketch") return <span key={i} className="h-6 flex-1 rounded-full border-2 border-dashed border-ink-3" />;
            if (L === "wireframe") return <span key={i} className="flex h-7 flex-1 items-center justify-center rounded-full border border-line-strong text-[0.6875rem] text-ink-2">{label}</span>;
            return (
              <button
                key={i}
                type="button"
                tabIndex={live ? 0 : -1}
                aria-pressed={time === i}
                onClick={() => live && setTime(i)}
                className={cn(
                  "h-7 flex-1 rounded-full text-[0.75rem] font-semibold",
                  time === i ? "bg-[#ffcf6b] text-[#2a1858]" : "bg-white/10 text-white",
                  !live && "pointer-events-none",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Seats */}
        <div className="mb-3 grid grid-cols-6 gap-1.5" aria-label={live ? t.seats : undefined} role={live ? "group" : undefined}>
          {Array.from({ length: SEATS }).map((_, i) => {
            const taken = [2, 3, 8, 13].includes(i);
            if (L === "sketch") return <span key={i} className="aspect-square rounded-[4px] border border-dashed border-ink-3" />;
            if (L === "wireframe") return <span key={i} className={cn("aspect-square rounded-[4px]", taken ? "bg-surface-3" : "border border-line-strong")} />;
            return (
              <button
                key={i}
                type="button"
                tabIndex={live && !taken ? 0 : -1}
                disabled={taken}
                aria-pressed={seat === i}
                aria-label={`${t.seats} ${i + 1}`}
                onClick={() => live && !taken && setSeat(i)}
                className={cn(
                  "aspect-square rounded-[4px] transition-colors",
                  taken ? "bg-white/10" : seat === i ? "bg-[#ffcf6b]" : "bg-white/30",
                  live && !taken && "hover:bg-white/60",
                  !live && "pointer-events-none",
                )}
              />
            );
          })}
        </div>

        {/* CTA */}
        {L === "sketch" ? (
          <span className="block h-9 rounded-full border-2 border-dashed border-ink-3" />
        ) : L === "wireframe" ? (
          <span className="flex h-9 items-center justify-center rounded-full bg-surface-3 text-[0.75rem] font-semibold text-ink-2">[ {t.book} ]</span>
        ) : (
          <button
            type="button"
            tabIndex={live ? 0 : -1}
            disabled={live && seat === null}
            onClick={() => {
              if (!live) return;
              setBooked(true);
              experience();
            }}
            className={cn(
              "flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold",
              booked ? "bg-[#3ccf8e] text-[#08231a]" : "bg-[#ffcf6b] text-[#2a1858] disabled:opacity-50",
              !live && "pointer-events-none",
            )}
          >
            {booked ? (
              <>
                <Check className="size-4" aria-hidden /> {t.booked}
              </>
            ) : (
              t.book
            )}
          </button>
        )}
        {L === "mockup" ? <p className="mt-2 text-center text-[0.6875rem] text-white/60">{t.staticNote}</p> : null}
      </div>

      <div>
        <label htmlFor={`${id}-r`} className="type-label">
          {t.slider}: <span className="text-accent-ink">{t.levels[L]}</span>
        </label>
        <input
          id={`${id}-r`}
          type="range"
          min={0}
          max={3}
          step={1}
          value={level}
          aria-valuetext={t.levels[L]}
          onChange={(e) => {
            setLevel(Number(e.target.value));
            setBooked(false);
          }}
          className="mt-3 w-full accent-[var(--accent)]"
        />
        <div className="mt-1 grid grid-cols-4 text-[0.75rem] text-ink-2" aria-hidden>
          {LEVELS.map((l, i) => (
            <span key={l} className={cn(i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center", i === level && "font-semibold text-ink")}>
              {t.levels[l]}
            </span>
          ))}
        </div>
        <p className="mt-6 text-ink" aria-live="polite">{t.notes[L]}</p>
      </div>
    </div>
  );
}
