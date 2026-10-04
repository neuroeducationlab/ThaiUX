"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Option = "solid" | "ghost" | "outline";
const OPTIONS: { id: Option; name: string }[] = [
  { id: "solid", name: "A" },
  { id: "ghost", name: "B" },
  { id: "outline", name: "C" },
];

const copy = {
  en: {
    label: "Continue",
    pick: "Option {x}",
    explain: {
      solid: "A — a solid fill and strong contrast say “press me” before you touch it.",
      ghost: "B — pale text with no shape reads as disabled. Many would never try it.",
      outline: "C — a faint outline looks secondary, or switched off.",
    } as Record<Option, string>,
  },
  th: {
    label: "ดำเนินการต่อ",
    pick: "ตัวเลือก {x}",
    explain: {
      solid: "A — พื้นทึบและตัดกันชัด บอกว่า “กดฉันสิ” ตั้งแต่ยังไม่แตะ",
      ghost: "B — ตัวอักษรจาง ไม่มีรูปทรง ดูเหมือนปุ่มที่ปิดอยู่ หลายคนจะไม่ลองกดเลย",
      outline: "C — เส้นขอบจาง ๆ ดูเป็นปุ่มรอง หรือดูเหมือนปิดใช้งาน",
    },
  },
  zh: {
    label: "继续",
    pick: "选项 {x}",
    explain: {
      solid: "A——实心填充、对比强烈，还没碰就在说“按我”。",
      ghost: "B——浅色文字、没有形状，看起来像被禁用了，很多人根本不会去点。",
      outline: "C——淡淡的描边，像次要按钮，或像关闭了一样。",
    },
  },
  ja: {
    label: "続ける",
    pick: "{x} 案",
    explain: {
      solid: "A — 塗りと強いコントラストで、触る前から「押して」と伝わる。",
      ghost: "B — 薄い文字で形がなく、無効に見える。押してみない人も多い。",
      outline: "C — 薄い枠線は、副次的か、オフのように見える。",
    },
  },
};

export default function DefaultStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [picked, setPicked] = useState<Option | null>(null);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <div className="grid w-full max-w-[19rem] grid-cols-3 gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={picked === o.id}
            aria-label={t.pick.replace("{x}", o.name)}
            onClick={() => {
              setPicked(o.id);
              experience();
            }}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] border px-1 pt-2 pb-1.5 transition-colors",
              picked === o.id ? "border-accent bg-accent-soft" : "border-transparent hover:border-line-strong",
            )}
          >
            <span
              aria-hidden
              data-intentionally-flawed={o.id !== "solid" || undefined}
              className={cn(
                "inline-flex h-8 w-full items-center justify-center truncate rounded-full px-2 text-[0.75rem] font-semibold",
                o.id === "solid" && "bg-accent text-on-accent shadow-sm",
                o.id === "ghost" && "text-ink-3/70",
                o.id === "outline" && "border border-line text-ink-3",
              )}
            >
              {t.label}
            </span>
            <span className="text-[0.6875rem] font-semibold text-ink-2" aria-hidden>
              {o.name}
            </span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className="min-h-[2.25rem] max-w-[19rem] text-center text-[0.75rem] leading-snug text-ink">
        {picked ? <span className="animate-fade-up inline-block">{t.explain[picked]}</span> : null}
      </p>
    </div>
  );
}
