"use client";

import { useRef } from "react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, useEffectEnv, useStagePointer } from "../engine";

const copy = {
  en: { hint: "Paint with pictures" },
  th: { hint: "วาดด้วยรูปภาพ" },
  zh: { hint: "用图片作画" },
  ja: { hint: "写真で描こう" },
};

/** Poster-like tiles: a gradient and a Thai consonant, no image files to download. */
const TILES = [
  { letter: "ก", bg: "linear-gradient(135deg,#3343c4,#8f9bff)" },
  { letter: "ข", bg: "linear-gradient(135deg,#ff7a59,#ffc46b)" },
  { letter: "ค", bg: "linear-gradient(135deg,#0f766e,#5eead4)" },
  { letter: "ง", bg: "linear-gradient(135deg,#be185d,#f9a8d4)" },
  { letter: "จ", bg: "linear-gradient(135deg,#7c3aed,#c4b5fd)" },
  { letter: "ฉ", bg: "linear-gradient(135deg,#b45309,#fcd34d)" },
  { letter: "ช", bg: "linear-gradient(135deg,#1d4ed8,#7dd3fc)" },
  { letter: "ซ", bg: "linear-gradient(135deg,#15803d,#bef264)" },
  { letter: "ฌ", bg: "linear-gradient(135deg,#9f1239,#fb7185)" },
  { letter: "ญ", bg: "linear-gradient(135deg,#334155,#94a3b8)" },
  { letter: "ฎ", bg: "linear-gradient(135deg,#c2410c,#fdba74)" },
  { letter: "ฏ", bg: "linear-gradient(135deg,#4338ca,#f0abfc)" },
];

export default function ImageTrail() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const trail = useRef({ travel: 0, next: 0, z: 1 });

  const spawn = (x: number, y: number, vx: number, vy: number) => {
    const s = trail.current;
    const el = tiles.current[s.next];
    s.next = (s.next + 1) % TILES.length;
    if (!el) return;
    s.z += 1;
    el.style.zIndex = String(s.z);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = (Math.random() - 0.5) * 16;
    const at = (dx: number, dy: number, scale: number, rot: number) =>
      `translate(${x - w / 2 + dx}px, ${y - h / 2 + dy}px) rotate(${rot}deg) scale(${scale})`;
    el.animate(
      [
        { transform: at(0, 0, 0.55, r), opacity: 0 },
        { transform: at(0, 0, 1.06, r), opacity: 1, offset: 0.14 },
        { transform: at(vx, vy, 1, r), opacity: 1, offset: 0.55 },
        { transform: at(vx * 2.5, vy * 2.5 + 14, 0.86, r), opacity: 0 },
      ],
      { duration: 1100, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" },
    );
  };

  useStagePointer(stageRef, {
    onMove: (p) => {
      if (!env.active) return;
      const s = trail.current;
      s.travel += Math.hypot(p.vx, p.vy);
      const gap = env.full ? 80 : 62;
      if (s.travel > gap) {
        s.travel = 0;
        spawn(p.x, p.y, p.vx * 1.2, p.vy * 1.2);
      }
    },
    onDown: (p) => {
      if (env.active) spawn(p.x, p.y, 0, 0);
    },
  });

  return (
    <Stage ref={stageRef} className="@container bg-surface">
      <p aria-hidden className="type-serif-accent absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(1.75rem,9cqw,3rem)] text-ink-3">
        {t.hint}
      </p>
      {TILES.map((tile, i) => (
        <div
          key={tile.letter}
          ref={(el) => {
            tiles.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 flex h-28 w-[5.5rem] items-end justify-start overflow-hidden rounded-[var(--radius-md)] p-2.5 opacity-0 shadow-lg sm:h-32 sm:w-24"
          style={{ background: tile.bg }}
        >
          <span lang="th" className="text-[2.75rem] leading-none font-bold text-white/95 drop-shadow-sm">
            {tile.letter}
          </span>
        </div>
      ))}
    </Stage>
  );
}
