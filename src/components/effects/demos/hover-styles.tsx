"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { Stage, useEffectEnv } from "../engine";

const copy = {
  en: { lift: "Lift", fill: "Fill", underline: "Underline", nudge: "Nudge", pick: "Your pick: {name}", choose: "Click your favourite" },
  th: { lift: "ยกขึ้น", fill: "เติมสี", underline: "ขีดเส้นใต้", nudge: "ขยับลูกศร", pick: "คุณเลือก: {name}", choose: "กดเลือกสไตล์ที่ชอบ" },
  zh: { lift: "浮起", fill: "填充", underline: "下划线", nudge: "箭头移动", pick: "你选了：{name}", choose: "点选你最喜欢的" },
  ja: { lift: "浮く", fill: "塗る", underline: "下線", nudge: "矢印", pick: "あなたの選択：{name}", choose: "好きなものをクリック" },
};

type Style = "lift" | "fill" | "underline" | "nudge";

const CSS: Record<Style, string> = {
  lift: "transform + box-shadow",
  fill: "background-position",
  underline: "scale on ::after",
  nudge: "translate on the icon",
};

export default function HoverStyles() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const [pick, setPick] = useState<Style | null>(null);
  const hovered = useRef(new Set<Style>());

  const seen = (s: Style) => {
    hovered.current.add(s);
    if (hovered.current.size >= 3) env.tried();
  };

  const base =
    "relative inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-semibold outline-offset-2 transition-[transform,box-shadow,background-position,color,border-color] duration-200 ease-out active:scale-[0.97]";

  const buttons: { style: Style; className: string; content: React.ReactNode }[] = [
    {
      style: "lift",
      className: "border border-line-strong bg-surface text-ink shadow-sm hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg",
      content: t.lift,
    },
    {
      style: "fill",
      className:
        "border-2 border-accent bg-[linear-gradient(to_right,var(--accent)_50%,transparent_50%)] bg-[length:202%_100%] bg-[position:100%_0] text-accent-ink duration-300 hover:bg-[position:0_0] hover:text-on-accent focus-visible:bg-[position:0_0] focus-visible:text-on-accent",
      content: t.fill,
    },
    {
      style: "underline",
      className: "group text-ink",
      content: (
        <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-200 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
          {t.underline}
        </span>
      ),
    },
    {
      style: "nudge",
      className: "group bg-ink text-bg",
      content: (
        <>
          {t.nudge}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden />
        </>
      ),
    },
  ];

  return (
    <Stage focusable={false} className="demo-canvas">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
        <div className="grid w-full max-w-sm grid-cols-2 gap-x-3 gap-y-3">
          {buttons.map((b) => (
            <div key={b.style} className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-pressed={pick === b.style}
                onPointerEnter={() => seen(b.style)}
                onFocus={() => seen(b.style)}
                onClick={() => {
                  setPick(b.style);
                  env.tried();
                }}
                className={cn(base, b.className, pick === b.style && "ring-2 ring-success ring-offset-2 ring-offset-surface-2")}
              >
                {b.content}
              </button>
              <span lang="en" className="font-mono text-[0.6875rem] text-ink-2">
                {CSS[b.style]}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[0.8125rem] font-medium text-ink-2" aria-live="polite">
          {pick ? format(t.pick, { name: t[pick] }) : t.choose}
        </p>
      </div>
    </Stage>
  );
}
