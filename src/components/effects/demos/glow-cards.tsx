"use client";

import { useRef } from "react";
import { Accessibility, Languages, Lock, Sparkles, WifiOff, Zap, type LucideIcon } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, useEffectEnv, useStagePointer } from "../engine";

const copy = {
  en: { fast: "Fast", a11y: "Accessible", private: "Private", languages: "4 languages", offline: "Works offline", delight: "Delightful" },
  th: { fast: "เร็ว", a11y: "ทุกคนใช้ได้", private: "เป็นส่วนตัว", languages: "4 ภาษา", offline: "ใช้ได้แม้ออฟไลน์", delight: "น่าเล่น" },
  zh: { fast: "快速", a11y: "无障碍", private: "注重隐私", languages: "4 种语言", offline: "离线可用", delight: "有趣" },
  ja: { fast: "速い", a11y: "誰でも使える", private: "プライベート", languages: "4 言語", offline: "オフライン対応", delight: "楽しい" },
};

const CARDS: { key: keyof typeof copy.en; icon: LucideIcon }[] = [
  { key: "fast", icon: Zap },
  { key: "a11y", icon: Accessibility },
  { key: "private", icon: Lock },
  { key: "languages", icon: Languages },
  { key: "offline", icon: WifiOff },
  { key: "delight", icon: Sparkles },
];

export default function GlowCards() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  const light = (x: number, y: number, on: boolean) => {
    const grid = gridRef.current;
    const stage = stageRef.current;
    if (!grid || !stage) return;
    grid.dataset.glow = on ? "on" : "off";
    const sr = stage.getBoundingClientRect();
    for (const card of Array.from(grid.children) as HTMLElement[]) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${x - (r.left - sr.left)}px`);
      card.style.setProperty("--y", `${y - (r.top - sr.top)}px`);
    }
  };

  useStagePointer(stageRef, {
    onMove: (p) => light(p.x, p.y, true),
    onDown: (p) => light(p.x, p.y, true),
    onLeave: (p) => light(p.x, p.y, false),
  });

  const cards = env.full ? CARDS : CARDS.slice(0, 4);

  return (
    <Stage ref={stageRef} className="bg-[#0b0b12]">
      <ul
        ref={gridRef}
        data-glow="off"
        className={`absolute inset-0 grid gap-3 p-4 sm:p-5 ${env.full ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
      >
        {cards.map(({ key, icon: Icon }) => (
          <li key={key} className="glow-card flex flex-col justify-between rounded-[16px] border border-white/[0.08] bg-[#13131c] p-3.5 sm:p-4">
            <Icon className="size-5 text-[#b9c1ff]" aria-hidden />
            <span className="text-[0.9375rem] font-semibold text-[#ececf4]">{t[key]}</span>
          </li>
        ))}
      </ul>
    </Stage>
  );
}
