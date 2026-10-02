"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Hand } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    dish: "Mango sticky rice",
    desc: "Sweet coconut rice, ripe mango",
    view: "View dish",
    state: "State",
    outside: "default",
    over: "hover",
    touch: "You’re on a touch screen — there’s no hover here. Tap the card instead. This is exactly why hover can only ever be a bonus.",
    noticed: "Notice: the card lifted, its border darkened, the arrow moved and the pointer became a hand — all within a tenth of a second.",
  },
  th: {
    dish: "ข้าวเหนียวมะม่วง",
    desc: "ข้าวเหนียวมูน มะม่วงสุกหอม ๆ",
    view: "ดูเมนูนี้",
    state: "สถานะ",
    touch: "คุณกำลังใช้จอสัมผัส ซึ่งไม่มี Hover ลองแตะการ์ดแทน นี่แหละเหตุผลที่ Hover ต้องเป็นแค่ “ของแถม” เสมอ",
    noticed: "สังเกตไหม: การ์ดยกขึ้น ขอบเข้มขึ้น ลูกศรขยับ และเคอร์เซอร์กลายเป็นรูปมือ ทั้งหมดเกิดขึ้นภายในหนึ่งในสิบวินาที",
  },
  zh: {
    dish: "芒果糯米饭",
    desc: "椰香糯米，熟透的芒果",
    view: "查看菜品",
    state: "状态",
    outside: "默认",
    over: "悬停",
    touch: "你正在使用触屏——这里没有悬停。请直接点按卡片。这正是悬停只能当作“附加提示”的原因。",
    noticed: "注意到了吗：卡片浮起、边框加深、箭头移动、指针变成手形——都在十分之一秒内完成。",
  },
  ja: {
    dish: "マンゴーもち米",
    desc: "ココナッツ風味のもち米と完熟マンゴー",
    view: "メニューを見る",
    state: "状態",
    outside: "デフォルト",
    over: "ホバー",
    touch: "タッチスクリーンをお使いですね。ここにはホバーがありません。カードをタップしてみてください。だからこそ、ホバーはあくまで「おまけ」なのです。",
    noticed: "気づきましたか？ カードが浮き上がり、枠が濃くなり、矢印が動き、ポインターが手の形に。すべて 0.1 秒以内です。",
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

export default function HoverDemo() {
  const t = useCopy(copy);
  const { experience, experienced } = useDemo();
  const canHover = useCanHover();
  const [hovering, setHovering] = useState(false);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!canHover) experience();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse" || e.pointerType === "pen") {
            setHovering(true);
            experience();
          }
        }}
        onPointerLeave={() => setHovering(false)}
        className={cn(
          "group block w-full rounded-[var(--radius-lg)] border bg-surface p-3 transition-[transform,box-shadow,border-color] duration-200 ease-out-soft",
          hovering
            ? "-translate-y-1.5 border-accent/60 shadow-lg"
            : "border-line-strong shadow-sm",
        )}
      >
        <div
          aria-hidden
          className="flex aspect-[16/9] items-end justify-end overflow-hidden rounded-[var(--radius-md)] bg-[radial-gradient(circle_at_30%_40%,#ffd36b,transparent_45%),radial-gradient(circle_at_70%_60%,#fff4d6,transparent_50%),linear-gradient(135deg,#f6b13b,#f7e3b5)] p-3"
        >
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-[#5a3d00]">฿120</span>
        </div>
        <div className="flex items-end justify-between gap-3 px-1 pt-3 pb-1">
          <div>
            <p className={cn("font-semibold text-ink decoration-2 underline-offset-4", hovering && "underline")}>{t.dish}</p>
            <p className="text-[0.8125rem] text-ink-2">{t.desc}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-accent-ink transition-transform duration-200",
              hovering && "translate-x-1",
            )}
          >
            {t.view}
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
      </a>

      <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.8125rem] text-ink-2" aria-hidden>
        {t.state}:
        <span className={cn("font-semibold", hovering ? "text-accent-ink" : "text-ink")}>
          {hovering ? t.over : t.outside}
        </span>
      </p>

      {!canHover ? (
        <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-warning-soft px-4 py-3 text-[0.875rem] text-warning">
          <Hand className="mt-0.5 size-4 shrink-0" aria-hidden />
          {t.touch}
        </p>
      ) : experienced ? (
        <p className="animate-fade-up text-center text-[0.875rem] text-ink-2">{t.noticed}</p>
      ) : null}
    </div>
  );
}
