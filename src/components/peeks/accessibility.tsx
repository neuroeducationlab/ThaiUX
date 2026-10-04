"use client";

import { useId, useState } from "react";
import { CircleAlert, Flame, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Sim = "blur" | "colour" | "sun";

const copy = {
  en: {
    sims: { blur: "Blur", colour: "Colour blind", sun: "Sunlight" } as Record<Sim, string>,
    simsLabel: "Vision simulations",
    typical: "Typical",
    inclusive: "Inclusive",
    dish: "Green curry",
    price: "฿95",
    spicy: "Spicy",
    left: "2 left",
    add: "Add",
  },
  th: {
    sims: { blur: "ภาพเบลอ", colour: "ตาบอดสี", sun: "แดดจ้า" },
    simsLabel: "จำลองการมองเห็น",
    typical: "แบบทั่วไป",
    inclusive: "แบบครอบคลุม",
    dish: "แกงเขียวหวาน",
    price: "฿95",
    spicy: "เผ็ด",
    left: "เหลือ 2",
    add: "เพิ่ม",
  },
  zh: {
    sims: { blur: "模糊", colour: "色盲", sun: "强光" },
    simsLabel: "视觉模拟",
    typical: "常见设计",
    inclusive: "包容设计",
    dish: "绿咖喱",
    price: "฿95",
    spicy: "辣",
    left: "仅剩 2 份",
    add: "加入",
  },
  ja: {
    sims: { blur: "ぼやけ", colour: "色覚の違い", sun: "直射日光" },
    simsLabel: "見え方シミュレーション",
    typical: "よくある設計",
    inclusive: "インクルーシブ",
    dish: "グリーンカレー",
    price: "฿95",
    spicy: "辛い",
    left: "残り 2",
    add: "追加",
  },
};

export default function AccessibilityPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [sims, setSims] = useState<Record<Sim, boolean>>({ blur: false, colour: false, sun: false });
  const filterId = `cbp${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const filter = [sims.blur ? "blur(1.4px)" : "", sims.colour ? `url(#${filterId})` : "", sims.sun ? "contrast(0.45) brightness(1.18)" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex size-full flex-col justify-center gap-1.5">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id={filterId}>
          <feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <div role="group" aria-label={t.simsLabel} className="flex flex-wrap justify-center gap-1">
        {(Object.keys(sims) as Sim[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={sims[k]}
            onClick={() => {
              setSims((s) => ({ ...s, [k]: !s[k] }));
              if (!sims[k]) experience();
            }}
            className={cn(
              "inline-flex h-6 items-center rounded-full border px-2.5 text-[0.75rem] font-semibold transition-colors",
              sims[k] ? "border-ink bg-ink text-bg" : "border-line-strong bg-surface text-ink-2 hover:text-ink",
            )}
          >
            {t.sims[k]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1" style={{ filter: filter || undefined }}>
        {/* Typical: meaning by colour alone, a faint price, a tiny target (flawed on purpose — excluded from axe) */}
        <p className="text-[0.6875rem] leading-tight font-semibold text-ink-2">{t.typical}</p>
        <div data-intentionally-flawed className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-line bg-white px-2.5 py-1 text-[#222]">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] font-semibold" style={{ color: "#d92d20" }}>
              {t.dish}
            </span>
            <span className="block text-[0.6875rem]" style={{ color: "#3aa755" }}>
              {t.left}
            </span>
          </span>
          <span className="text-[0.6875rem]" style={{ color: "#c9c9c9" }}>
            {t.price}
          </span>
          <button type="button" aria-label={t.add} className="flex size-5 items-center justify-center rounded-[4px] bg-[#eee] text-[0.75rem]">
            +
          </button>
        </div>

        {/* Inclusive: icon + word, strong contrast, a comfortable target */}
        <p className="mt-0.5 text-[0.6875rem] leading-tight font-semibold text-ink-2">{t.inclusive}</p>
        <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-line-strong bg-white px-2.5 py-1 text-[#1a1a1e]">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] font-semibold">{t.dish}</span>
            <span className="mt-0.5 flex flex-wrap gap-1 text-[0.625rem] font-semibold">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fdecea] px-1.5 text-[#a1261d]">
                <Flame className="size-3" aria-hidden /> {t.spicy}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fff3d6] px-1.5 text-[#7a4a00]">
                <CircleAlert className="size-3" aria-hidden /> {t.left}
              </span>
            </span>
          </span>
          <span className="text-[0.8125rem] font-semibold">{t.price}</span>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#3343c4] px-3 text-[0.75rem] font-semibold text-white"
          >
            <Plus className="size-3.5" aria-hidden /> {t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
