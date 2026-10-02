"use client";

import { useId, useState } from "react";
import { CircleAlert, Flame, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Sim = "blur" | "colour" | "contrast";

const copy = {
  en: {
    sims: { blur: "Blurred vision", colour: "Colour blindness (deuteranopia)", contrast: "Low-contrast screen (sunlight)" } as Record<Sim, string>,
    simulations: "Simulations",
    typical: "Typical design",
    inclusive: "Inclusive design",
    dish: "Green curry",
    price: "฿95",
    spicy: "Spicy",
    soldOut: "Only 2 left",
    add: "Add",
    qty: "Quantity",
    lesson: "With the simulations on, the typical card loses its meaning: spiciness and stock were shown by colour alone, the price was faint, and the buttons were tiny. The inclusive card survives — icons and words carry the meaning.",
  },
  th: {
    sims: { blur: "สายตาพร่ามัว", colour: "ตาบอดสี (Deuteranopia)", contrast: "จอคอนทราสต์ต่ำ (กลางแดด)" },
    simulations: "ตัวจำลอง",
    typical: "ดีไซน์ทั่วไป",
    inclusive: "ดีไซน์ที่ทุกคนใช้ได้",
    dish: "แกงเขียวหวาน",
    price: "฿95",
    spicy: "เผ็ด",
    soldOut: "เหลือ 2 ที่",
    add: "เพิ่ม",
    qty: "จำนวน",
    lesson: "เมื่อเปิดตัวจำลอง การ์ดแบบทั่วไปสื่อความหมายไม่ได้ ความเผ็ดและจำนวนที่เหลือใช้แค่สีบอก ราคาจางเกินไป และปุ่มเล็กมาก ส่วนการ์ดที่ออกแบบเพื่อทุกคนยังใช้ได้ เพราะไอคอนและข้อความช่วยสื่อความหมาย",
  },
  zh: {
    sims: { blur: "视力模糊", colour: "色盲（绿色弱）", contrast: "低对比度屏幕（强光下）" },
    simulations: "模拟效果",
    typical: "常见设计",
    inclusive: "包容性设计",
    dish: "绿咖喱",
    price: "฿95",
    spicy: "辣",
    soldOut: "仅剩 2 份",
    add: "添加",
    qty: "数量",
    lesson: "打开模拟效果后，常见设计的卡片就失去了意义：辣度和库存只靠颜色表示，价格太淡，按钮也太小。包容性设计的卡片依然可用——图标和文字承载了含义。",
  },
  ja: {
    sims: { blur: "視界のぼやけ", colour: "色覚の違い（2 型色覚）", contrast: "低コントラストの画面（直射日光）" },
    simulations: "シミュレーション",
    typical: "よくあるデザイン",
    inclusive: "インクルーシブなデザイン",
    dish: "グリーンカレー",
    price: "฿95",
    spicy: "辛口",
    soldOut: "残り 2 食",
    add: "追加",
    qty: "数量",
    lesson: "シミュレーションをオンにすると、よくあるデザインのカードは意味を失います。辛さと在庫は色だけで表され、価格は薄く、ボタンはとても小さいからです。インクルーシブなカードは生き残ります。アイコンと言葉が意味を運んでいるからです。",
  },
};

export default function AccessibilityDemo() {
  const t = useCopy(copy);
  const { experience, experienced } = useDemo();
  const [sims, setSims] = useState<Record<Sim, boolean>>({ blur: false, colour: false, contrast: false });
  const [qty, setQty] = useState(1);
  const filterId = `cb${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const filter = [
    sims.blur ? "blur(1.6px)" : "",
    sims.colour ? `url(#${filterId})` : "",
    sims.contrast ? "contrast(0.45) brightness(1.18)" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="mx-auto max-w-2xl">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id={filterId}>
          <feColorMatrix
            type="matrix"
            values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"
          />
        </filter>
      </svg>

      <fieldset className="mb-6 rounded-[var(--radius-lg)] border border-line bg-surface px-4 py-2">
        <legend className="type-label px-1">{t.simulations}</legend>
        <div className="divide-y divide-line">
          {(Object.keys(sims) as Sim[]).map((k) => (
            <Switch
              key={k}
              className="py-2.5"
              label={t.sims[k]}
              checked={sims[k]}
              onChange={(v) => {
                setSims((s) => ({ ...s, [k]: v }));
                if (v) experience();
              }}
            />
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2" style={{ filter: filter || undefined }}>
        {/* Typical: colour-only meaning, faint price, tiny targets (intentionally flawed — excluded from axe) */}
        <div data-intentionally-flawed>
          <p className="type-label mb-2">{t.typical}</p>
          <div className="rounded-[var(--radius-md)] border border-line bg-white p-4 text-[#222]">
            <div className="mb-3 h-20 rounded-[8px] bg-[linear-gradient(135deg,#7fb36a,#3f7a3a)]" aria-hidden />
            <div className="flex items-start justify-between">
              <p className="font-semibold" style={{ color: "#d92d20" }}>{t.dish}</p>
              <span className="text-[0.75rem]" style={{ color: "#c9c9c9" }}>{t.price}</span>
            </div>
            <p className="mt-1 text-[0.75rem]" style={{ color: "#3aa755" }}>{t.soldOut}</p>
            <div className="mt-3 flex items-center justify-end gap-1">
              <button type="button" aria-label="−" className="size-5 rounded-[4px] bg-[#eee] text-[0.75rem]" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-5 text-center text-[0.75rem]">{qty}</span>
              <button type="button" aria-label="+" className="size-5 rounded-[4px] bg-[#eee] text-[0.75rem]" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* Inclusive: icon + text, strong contrast, 44px targets */}
        <div>
          <p className="type-label mb-2">{t.inclusive}</p>
          <div className="rounded-[var(--radius-md)] border border-line-strong bg-white p-4 text-[#1a1a1e]">
            <div className="mb-3 h-20 rounded-[8px] bg-[linear-gradient(135deg,#7fb36a,#3f7a3a)]" aria-hidden />
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{t.dish}</p>
              <span className="font-semibold">{t.price}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[0.75rem] font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fdecea] px-2 py-0.5 text-[#a1261d]">
                <Flame className="size-3.5" aria-hidden /> {t.spicy}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d6] px-2 py-0.5 text-[#7a4a00]">
                <CircleAlert className="size-3.5" aria-hidden /> {t.soldOut}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2" role="group" aria-label={t.qty}>
              <div className="flex items-center gap-1">
                <button type="button" aria-label={`${t.qty} −1`} onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex size-11 items-center justify-center rounded-full border border-[#8e8e98] text-[#1a1a1e]">
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="w-6 text-center font-semibold" aria-live="polite">{qty}</span>
                <button type="button" aria-label={`${t.qty} +1`} onClick={() => setQty((q) => q + 1)} className="flex size-11 items-center justify-center rounded-full border border-[#8e8e98] text-[#1a1a1e]">
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
              <button type="button" className="h-11 rounded-full bg-[#3343c4] px-5 text-sm font-semibold text-white">
                {t.add}
              </button>
            </div>
          </div>
        </div>
      </div>
      {experienced ? <p className={cn("animate-fade-up mt-5 text-center text-[0.875rem] text-ink-2")}>{t.lesson}</p> : null}
    </div>
  );
}
