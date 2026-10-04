"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: { a: "A · No active state", b: "B · With active state", pay: "Pay ฿249", state: "state", idle: "default", pressed: "active" },
  th: { a: "A · ไม่มี Active state", b: "B · มี Active state", pay: "จ่าย ฿249", state: "สถานะ" },
  zh: { a: "A · 无按下状态", b: "B · 有按下状态", pay: "支付 ฿249", state: "状态", idle: "默认", pressed: "按下" },
  ja: { a: "A · アクティブ状態なし", b: "B · アクティブ状態あり", pay: "฿249 を支払う", state: "状態", idle: "デフォルト", pressed: "アクティブ" },
};

function usePress(onPress?: () => void) {
  const [pressed, setPressed] = useState(false);
  const down = () => {
    setPressed(true);
    onPress?.();
  };
  const up = () => setPressed(false);
  return {
    pressed,
    handlers: {
      onPointerDown: down,
      onPointerUp: up,
      onPointerLeave: up,
      onPointerCancel: up,
      onKeyDown: (e: React.KeyboardEvent) => (e.key === " " || e.key === "Enter") && !e.repeat && down(),
      onKeyUp: up,
      onBlur: up,
    },
  };
}

export default function ActiveStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const a = usePress();
  const b = usePress(experience);

  const row = (label: string, pressed: boolean, button: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <p className="flex items-center justify-between gap-2 text-[0.6875rem] font-semibold text-ink-2">
        <span className="truncate">{label}</span>
        <span className="shrink-0 font-mono font-normal">
          {t.state}: <span className={cn("font-semibold", pressed ? "text-accent-ink" : "text-ink")}>{pressed ? t.pressed : t.idle}</span>
        </span>
      </p>
      {button}
    </div>
  );

  return (
    <div className="flex size-full flex-col justify-center gap-3">
      {row(
        t.a,
        a.pressed,
        <button type="button" {...a.handlers} className="h-10 w-full rounded-full bg-accent text-[0.875rem] font-semibold text-on-accent shadow-md select-none">
          {t.pay}
        </button>,
      )}
      {row(
        t.b,
        b.pressed,
        <button
          type="button"
          {...b.handlers}
          className={cn(
            "h-10 w-full rounded-full text-[0.875rem] font-semibold text-on-accent transition-[transform,background-color,box-shadow] duration-75 select-none",
            b.pressed ? "scale-[0.97] bg-accent-press shadow-none" : "bg-accent shadow-md hover:bg-accent-hover",
          )}
        >
          {t.pay}
        </button>,
      )}
    </div>
  );
}
