"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Option = "solid" | "ghost" | "outline";

const copy = {
  en: {
    question: "Which “Continue” looks most clickable — before you touch anything?",
    label: "Continue",
    names: { solid: "A", ghost: "B", outline: "C" } as Record<Option, string>,
    explain: {
      solid: "A has a solid fill, strong contrast and a clear shape — it signals “press me” from its default state alone. That’s the job of a default state.",
      ghost: "B is pale grey text with no shape. In its default state it reads as disabled, or as a label. Many people would never try it.",
      outline: "C has a shape, but a faint border and low contrast make it look secondary or inactive. Fine for a secondary action — weak for the main one.",
    } as Record<Option, string>,
    pick: "Pick",
  },
  th: {
    question: "ปุ่ม “ดำเนินการต่อ” อันไหนดูกดได้ชัดที่สุด ก่อนที่คุณจะแตะอะไรเลย?",
    label: "ดำเนินการต่อ",
    explain: {
      solid: "A มีพื้นทึบ คอนทราสต์สูง และรูปทรงชัด บอกว่า “กดฉันสิ” ได้ตั้งแต่สถานะปกติ นี่คือหน้าที่ของ Default state",
      ghost: "B เป็นตัวอักษรสีเทาอ่อนไม่มีรูปทรง ในสถานะปกติมันดูเหมือนปุ่มที่ใช้ไม่ได้หรือแค่ป้ายข้อความ หลายคนจะไม่ลองกดเลย",
      outline: "C มีรูปทรง แต่ขอบจางและคอนทราสต์ต่ำทำให้ดูเป็นปุ่มรองหรือใช้งานไม่ได้ ใช้เป็นปุ่มรองได้ แต่อ่อนเกินไปสำหรับการกระทำหลัก",
    },
    pick: "เลือก",
  },
  zh: {
    question: "在你碰任何东西之前，哪个“继续”看起来最像可以点击？",
    label: "继续",
    explain: {
      solid: "A 有实心填充、强对比和清晰的形状——仅凭默认状态就在说“按我”。这正是默认状态的职责。",
      ghost: "B 是没有形状的浅灰色文字。在默认状态下，它看起来像被禁用了，或只是一个标签。很多人根本不会去点。",
      outline: "C 有形状，但边框很淡、对比度低，看起来像次要或不可用的按钮。用作次要操作可以——作为主要操作就太弱了。",
    },
    pick: "选择",
  },
  ja: {
    question: "何も触る前の状態で、いちばん押せそうに見える「続ける」はどれ？",
    label: "続ける",
    explain: {
      solid: "A は塗りがあり、コントラストが強く、形がはっきりしています。デフォルト状態だけで「押して」と伝えています。それがデフォルト状態の役割です。",
      ghost: "B は形のない薄いグレーの文字。デフォルト状態では無効か、ただのラベルに見えます。押してみない人も多いでしょう。",
      outline: "C には形がありますが、枠が薄くコントラストが低いため、サブの操作か無効に見えます。サブのアクションなら良いですが、メインには弱すぎます。",
    },
    pick: "選ぶ",
  },
};

export default function DefaultStateDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [picked, setPicked] = useState<Option | null>(null);
  const options: Option[] = ["solid", "ghost", "outline"];

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-5 text-center font-medium text-ink">{t.question}</p>
      <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t.question}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={picked === o}
            onClick={() => {
              setPicked(o);
              experience();
            }}
            className={cn(
              "flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border-2 bg-surface px-4 pt-6 pb-4 transition-colors",
              picked === o ? "border-accent" : "border-transparent hover:border-line-strong",
            )}
          >
            {/* Visual only: these are pictures of buttons in their default state */}
            <span aria-hidden data-intentionally-flawed={o === "ghost" || undefined}>
              {o === "solid" ? (
                <span className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-semibold text-on-accent shadow-sm">{t.label}</span>
              ) : o === "ghost" ? (
                <span className="inline-flex h-11 items-center px-6 text-sm text-[#b8b8be]">{t.label}</span>
              ) : (
                <span className="inline-flex h-11 items-center rounded-full border border-[#dcdce0] px-6 text-sm text-[#9a9aa2]">{t.label}</span>
              )}
            </span>
            <span className="text-[0.8125rem] font-semibold text-ink-2">
              {t.names[o]}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 min-h-16 text-center text-[0.875rem] text-ink-2" aria-live="polite">
        {picked ? <span className="animate-fade-up block">{t.explain[picked]}</span> : null}
      </p>
    </div>
  );
}
