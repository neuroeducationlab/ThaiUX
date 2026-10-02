"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    a: "A · No active state",
    b: "B · With active state",
    pay: "Pay ฿249",
    state: "State",
    idle: "default",
    pressed: "active",
    explain: "B shrank, darkened and lost its shadow the instant you pressed — like a real button. A gave you nothing until it was too late to know.",
  },
  th: {
    a: "A · ไม่มีสถานะขณะกด",
    b: "B · มีสถานะขณะกด",
    pay: "จ่าย ฿249",
    state: "สถานะ",
    explain: "ปุ่ม B ยุบลง เข้มขึ้น และเงาหายไปทันทีที่กด เหมือนปุ่มจริง ส่วนปุ่ม A ไม่บอกอะไรคุณเลย",
  },
  zh: {
    a: "A · 没有按下状态",
    b: "B · 有按下状态",
    pay: "支付 ฿249",
    state: "状态",
    explain: "按下的瞬间，B 缩小、变深、阴影消失——就像真实的按钮。A 则什么都没告诉你。",
  },
  ja: {
    a: "A · 押下状態なし",
    b: "B · 押下状態あり",
    pay: "฿249 を支払う",
    state: "状態",
    explain: "B は押した瞬間に縮み、色が濃くなり、影が消えました。本物のボタンのように。A は何も教えてくれませんでした。",
  },
};

export default function ActiveStateDemo() {
  const t = useCopy(copy);
  const { experience, experienced } = useDemo();
  const [aDown, setADown] = useState(false);
  const [bDown, setBDown] = useState(false);

  const press = (set: (v: boolean) => void, isB: boolean) => ({
    onPointerDown: () => {
      set(true);
      if (isB) {
        experience();
        navigator.vibrate?.(8);
      }
    },
    onPointerUp: () => set(false),
    onPointerLeave: () => set(false),
    onPointerCancel: () => set(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        set(true);
        if (isB) experience();
      }
    },
    onKeyUp: () => set(false),
  });

  return (
    <div className="mx-auto max-w-xl">
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { label: t.a, down: aDown, handlers: press(setADown, false), b: false },
          { label: t.b, down: bDown, handlers: press(setBDown, true), b: true },
        ].map((col) => (
          <div key={col.label} className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5">
            <p className="type-label">{col.label}</p>
            <button
              type="button"
              {...col.handlers}
              className={cn(
                "h-12 w-full max-w-52 rounded-full bg-accent text-[0.9375rem] font-semibold text-on-accent select-none",
                col.b
                  ? "shadow-md transition-[transform,box-shadow,background-color] duration-100 ease-out"
                  : "shadow-md active:scale-100",
                col.b && col.down && "scale-[0.95] bg-accent-press shadow-none",
              )}
            >
              {t.pay}
            </button>
            <p className="font-mono text-[0.8125rem] text-ink-2" aria-hidden>
              {t.state}: <span className={cn("font-semibold", col.b && col.down ? "text-accent-ink" : "text-ink")}>{col.b && col.down ? t.pressed : t.idle}</span>
            </p>
          </div>
        ))}
      </div>
      {experienced ? <p className="animate-fade-up mt-5 text-center text-[0.875rem] text-ink-2">{t.explain}</p> : null}
    </div>
  );
}
