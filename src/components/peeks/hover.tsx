"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { Readout } from "./kit";

const copy = {
  en: {
    dish: "Mango sticky rice",
    view: "View dish",
    state: "state",
    outside: "default",
    over: "hover",
    touch: "Touch screens have no hover — tap instead. That’s why hover is only ever a bonus.",
  },
  th: {
    dish: "ข้าวเหนียวมะม่วง",
    view: "ดูเมนูนี้",
    state: "สถานะ",
    touch: "จอสัมผัสไม่มี Hover ลองแตะแทน นี่คือเหตุผลที่ Hover เป็นได้แค่ของแถม",
  },
  zh: {
    dish: "芒果糯米饭",
    view: "查看菜品",
    state: "状态",
    outside: "默认",
    over: "悬停",
    touch: "触屏没有悬停——请直接点按。所以悬停只能是附加提示。",
  },
  ja: {
    dish: "マンゴーもち米",
    view: "メニューを見る",
    state: "状態",
    outside: "デフォルト",
    over: "ホバー",
    touch: "タッチ画面にホバーはありません。タップしてみて。だからホバーは「おまけ」なのです。",
  },
};

function useCanHover() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: hover)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: hover)").matches,
    () => true,
  );
}

export default function HoverPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const canHover = useCanHover();
  const [over, setOver] = useState(false);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!canHover) experience();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          setOver(true);
          experience();
        }}
        onPointerLeave={() => setOver(false)}
        className={cn(
          "flex w-full max-w-[16rem] items-center gap-3 rounded-[var(--radius-md)] border bg-surface p-2 pr-3 transition-[transform,box-shadow,border-color] duration-200 ease-out-soft",
          over ? "-translate-y-1 border-accent/60 shadow-lg" : "border-line-strong shadow-sm",
        )}
      >
        <span
          aria-hidden
          className="size-14 shrink-0 rounded-[var(--radius-sm)] bg-[radial-gradient(circle_at_30%_40%,#ffd36b,transparent_45%),radial-gradient(circle_at_70%_60%,#fff4d6,transparent_50%),linear-gradient(135deg,#f6b13b,#f7e3b5)]"
        />
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[0.875rem] font-semibold text-ink decoration-2 underline-offset-4", over && "underline")}>
            {t.dish}
          </span>
          <span className="block text-[0.75rem] text-ink-2">฿120</span>
          <span
            className={cn(
              "mt-0.5 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-accent-ink transition-transform duration-200",
              over && "translate-x-1",
            )}
          >
            {t.view}
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </span>
      </a>
      {canHover ? (
        <Readout label={t.state} value={over ? t.over : t.outside} active={over} />
      ) : (
        <p className="max-w-[16rem] text-center text-[0.75rem] leading-snug text-warning">{t.touch}</p>
      )}
    </div>
  );
}
