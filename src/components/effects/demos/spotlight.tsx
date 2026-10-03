"use client";

import { useRef, useState } from "react";
import { Gem, Rocket, Star, type LucideIcon } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { Stage, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

const copy = {
  en: { message: "The best things are hidden", found: "Found {n} of 3", all: "All found — curiosity pays off!" },
  th: { message: "สิ่งดี ๆ มักซ่อนอยู่", found: "เจอแล้ว {n} จาก 3", all: "เจอครบแล้ว ความอยากรู้ได้รางวัล!" },
  zh: { message: "最好的东西总是藏起来的", found: "已找到 {n} / 3", all: "全部找到——好奇心有回报！" },
  ja: { message: "いいものは隠れている", found: "{n} / 3 個 発見", all: "全部見つけた！好奇心のごほうび" },
};

const HIDDEN: { icon: LucideIcon; x: number; y: number; color: string }[] = [
  { icon: Star, x: 0.16, y: 0.3, color: "#ffd166" },
  { icon: Gem, x: 0.83, y: 0.24, color: "#7af0ff" },
  { icon: Rocket, x: 0.7, y: 0.8, color: "#ff8fab" },
];

export default function Spotlight() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const light = useRef({ x: -1, y: -1, r: 0 });
  const [found, setFound] = useState<number[]>([]);
  const foundRef = useRef<number[]>([]);

  const pointer = useStagePointer(stageRef, {
    onMove: (p) => {
      HIDDEN.forEach((h, i) => {
        if (foundRef.current.includes(i) || Math.hypot(p.x - h.x * p.w, p.y - h.y * p.h) > 42) return;
        foundRef.current = [...foundRef.current, i];
        setFound(foundRef.current);
        if (foundRef.current.length === HIDDEN.length) env.tried();
      });
    },
  });

  useRaf(() => {
    const p = pointer.current;
    const stage = stageRef.current;
    const shade = shadeRef.current;
    if (!stage || !shade) return;
    const l = light.current;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const tx = p.inside ? p.x : w / 2;
    const ty = p.inside ? p.y : h / 2;
    if (l.x < 0) {
      l.x = tx;
      l.y = ty;
    }
    l.x = lerp(l.x, tx, 0.18);
    l.y = lerp(l.y, ty, 0.18);
    l.r = lerp(l.r, p.inside ? (env.full ? 150 : 110) : 70, 0.1);
    shade.style.background = `radial-gradient(circle ${l.r.toFixed(0)}px at ${l.x.toFixed(1)}px ${l.y.toFixed(1)}px, transparent 0%, rgb(4 4 10 / 0.55) 55%, rgb(4 4 10 / 0.97) 100%)`;
  }, env.active);

  const done = found.length === HIDDEN.length;

  return (
    <Stage ref={stageRef} className="cursor-none bg-[#07070c]">
      {/* what the light reveals */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.16)_1px,transparent_0)] bg-[length:22px_22px]" />
      <p aria-hidden className="type-serif-accent absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-[clamp(1.75rem,1.2rem+2.5vw,3rem)] leading-tight text-[#e9e6ff]">
        {t.message}
      </p>
      {HIDDEN.map(({ icon: Icon, x, y, color }, i) => (
        <Icon
          key={i}
          aria-hidden
          className={cn("absolute size-8 -translate-x-1/2 -translate-y-1/2 transition-[filter,transform] duration-500", found.includes(i) && "z-20 scale-110")}
          style={{ left: `${x * 100}%`, top: `${y * 100}%`, color, filter: found.includes(i) ? `drop-shadow(0 0 10px ${color})` : undefined }}
        />
      ))}
      {/* the darkness, with a hole of light */}
      <div
        ref={shadeRef}
        aria-hidden
        className="absolute inset-0 z-10"
        style={{ background: "radial-gradient(circle 70px at 50% 50%, transparent 0%, rgb(4 4 10 / 0.55) 55%, rgb(4 4 10 / 0.97) 100%)" }}
      />
      <p
        aria-live="polite"
        className={cn(
          "absolute top-3 left-3 z-30 rounded-full px-3 py-1 text-[0.75rem] font-semibold",
          done ? "bg-[#ffd166] text-[#3d2a00]" : "bg-white/10 text-white",
        )}
      >
        {done ? t.all : format(t.found, { n: found.length })}
      </p>
    </Stage>
  );
}
