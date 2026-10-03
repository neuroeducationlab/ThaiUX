"use client";

import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { cn } from "@/lib/cn";
import { Stage, clamp, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

const ITEMS = ["Card", "Modal", "Toast", "Tabs"] as const;
type Item = (typeof ITEMS)[number];

const copy = {
  en: { Card: "a box that groups one thing", Modal: "a window that blocks the page", Toast: "a brief message that disappears", Tabs: "views that share one space" },
  th: { Card: "กล่องที่รวมเรื่องเดียวไว้ด้วยกัน", Modal: "หน้าต่างที่บังหน้าหลักไว้", Toast: "ข้อความสั้นที่หายไปเอง", Tabs: "หลายมุมมองในพื้นที่เดียว" },
  zh: { Card: "把一件事归在一起的盒子", Modal: "挡住页面的窗口", Toast: "会自动消失的简短消息", Tabs: "共用一个空间的多个视图" },
  ja: { Card: "ひとつの内容をまとめる箱", Modal: "ページをふさぐウィンドウ", Toast: "自然に消える短いメッセージ", Tabs: "同じ場所を共有する複数の画面" },
};

function Mock({ item }: { item: Item }) {
  if (item === "Card")
    return (
      <div className="flex h-full flex-col bg-white p-2.5">
        <div className="h-[48%] rounded-md bg-[linear-gradient(135deg,#f6b13b,#f7e3b5)]" />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-[#1a1a1e]/70" />
        <div className="mt-1 h-1.5 w-1/2 rounded-full bg-[#1a1a1e]/30" />
        <div className="mt-auto h-4 w-14 self-end rounded-full bg-[#3343c4]" />
      </div>
    );
  if (item === "Modal")
    return (
      <div className="relative h-full bg-[#1a1a1e]/45 p-3">
        <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-md bg-white p-2.5 shadow-lg">
          <div className="h-2 w-2/3 rounded-full bg-[#1a1a1e]/70" />
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#1a1a1e]/20" />
          <div className="mt-2 flex justify-end gap-1">
            <span className="h-3.5 w-8 rounded-full bg-[#1a1a1e]/10" />
            <span className="h-3.5 w-8 rounded-full bg-[#3343c4]" />
          </div>
        </div>
      </div>
    );
  if (item === "Toast")
    return (
      <div className="relative h-full bg-[#f3f3f1] p-3">
        <div className="h-1.5 w-2/3 rounded-full bg-[#1a1a1e]/20" />
        <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-[#1a1a1e]/15" />
        <div className="absolute inset-x-4 bottom-3 flex items-center gap-1.5 rounded-full bg-[#1a1a1e] px-2.5 py-1.5">
          <Check className="size-3 text-[#86efac]" strokeWidth={3} />
          <span className="h-1.5 flex-1 rounded-full bg-white/70" />
        </div>
      </div>
    );
  return (
    <div className="h-full bg-white p-2.5">
      <div className="flex gap-3 border-b border-[#1a1a1e]/10 pb-1.5">
        <span className="h-1.5 w-8 rounded-full bg-[#3343c4] shadow-[0_6px_0_-1px_#3343c4]" />
        <span className="h-1.5 w-8 rounded-full bg-[#1a1a1e]/25" />
        <span className="h-1.5 w-8 rounded-full bg-[#1a1a1e]/25" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-[#1a1a1e]/20" />
        <div className="h-1.5 w-5/6 rounded-full bg-[#1a1a1e]/20" />
        <div className="h-1.5 w-2/3 rounded-full bg-[#1a1a1e]/20" />
      </div>
    </div>
  );
}

export default function HoverPreview() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Item | null>(null);
  const [shownItem, setShownItem] = useState<Item>("Card");
  const uid = useId();
  const seen = useRef(new Set<Item>());
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, rot: 0, shown: 0 });

  const pointer = useStagePointer(stageRef, {
    onLeave: () => setActive(null),
  });

  const show = (item: Item) => {
    setActive(item);
    setShownItem(item);
    seen.current.add(item);
    if (seen.current.size >= 3) env.tried();
  };

  useRaf(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;
    const p = pointer.current;
    const s = pos.current;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    if (p.inside && p.kind !== "key") {
      s.tx = clamp(p.x + 22, 8, stage.clientWidth - w - 8);
      s.ty = clamp(p.y - h / 2, 8, stage.clientHeight - h - 8);
    }
    if (s.shown === 0) {
      s.x = s.tx;
      s.y = s.ty;
    }
    s.x = lerp(s.x, s.tx, 0.16);
    s.y = lerp(s.y, s.ty, 0.16);
    s.rot = lerp(s.rot, clamp(p.vx * 0.9, -12, 12), 0.12);
    s.shown = lerp(s.shown, active ? 1 : 0, 0.2);
    card.style.opacity = s.shown.toFixed(3);
    card.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${0.9 + s.shown * 0.1})`;
  }, env.active);

  return (
    <Stage ref={stageRef} focusable={false} className="bg-surface">
      <ul className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
        {ITEMS.map((item, i) => (
          <li key={item} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onPointerEnter={() => show(item)}
              onFocus={(e) => {
                show(item);
                const stage = stageRef.current;
                if (stage) {
                  const r = e.currentTarget.getBoundingClientRect();
                  const sr = stage.getBoundingClientRect();
                  pos.current.tx = Math.min(r.right - sr.left - 150, sr.width - 168);
                  pos.current.ty = r.top - sr.top - 30;
                }
              }}
              onBlur={() => setActive(null)}
              aria-describedby={`${uid}-${item}`}
              className={cn(
                "group flex w-full items-baseline gap-3 py-2 text-left transition-colors sm:py-2.5",
                active === item ? "text-accent-ink" : "text-ink",
              )}
            >
              <span className="tabular font-mono text-[0.75rem] text-ink-2">0{i + 1}</span>
              <span lang="en" className="type-serif text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-none transition-transform duration-300 group-hover:translate-x-1.5">
                {item}
              </span>
              <span id={`${uid}-${item}`} className="hidden truncate text-[0.8125rem] text-ink-2 sm:inline">
                {t[item]}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div
        ref={cardRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 h-[6.5rem] w-[9.5rem] overflow-hidden rounded-[var(--radius-md)] border border-black/10 opacity-0 shadow-xl sm:h-28 sm:w-40"
      >
        <Mock item={shownItem} />
      </div>
    </Stage>
  );
}
