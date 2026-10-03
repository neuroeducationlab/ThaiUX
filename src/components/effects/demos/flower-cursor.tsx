"use client";

import { useRef, useState } from "react";
import { useCopy } from "@/components/demos/use-copy";
import { cn } from "@/lib/cn";
import { Stage, lerp, useEffectEnv, useFinePointer, useRaf, useStagePointer } from "../engine";

const copy = {
  en: { button: "Bloom", done: "Hello, flower!" },
  th: { button: "ให้ดอกไม้บาน", done: "สวัสดีดอกไม้!" },
  zh: { button: "让花绽放", done: "你好，小花！" },
  ja: { button: "咲かせる", done: "こんにちは、お花！" },
};

const PETALS = ["#ff8fab", "#ffb3c6", "#ffc8dd", "#f7a1c4", "#ffafcc"];
const POOL = 28;

function Flower({ open }: { open: boolean }) {
  return (
    <svg viewBox="-20 -20 40 40" className="size-full overflow-visible" aria-hidden>
      <g className={cn("origin-center transition-transform duration-300 ease-spring", open ? "rotate-45" : "rotate-0")}>
        {[0, 72, 144, 216, 288].map((a, i) => (
          <ellipse key={a} cx="0" cy="-9" rx="6.5" ry="9.5" fill={PETALS[i]} transform={`rotate(${a})`} stroke="#fff" strokeOpacity="0.7" strokeWidth="0.8" />
        ))}
      </g>
      <circle r="5" fill="#ffd166" stroke="#f4a259" strokeWidth="1" />
    </svg>
  );
}

export default function FlowerCursor() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const fine = useFinePointer();
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const petalRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, scale: 1, shown: false, travel: 0, next: 0 });
  const [overButton, setOverButton] = useState(false);
  const [hello, setHello] = useState(false);

  const dropPetal = (x: number, y: number, burst = false) => {
    const s = state.current;
    const el = petalRefs.current[s.next];
    s.next = (s.next + 1) % POOL;
    if (!el) return;
    const angle = Math.random() * Math.PI * 2;
    const reach = burst ? 50 + Math.random() * 50 : 0;
    const dx = burst ? Math.cos(angle) * reach : (Math.random() - 0.5) * 30;
    const dy = burst ? Math.sin(angle) * reach : 40 + Math.random() * 40;
    const spin = (Math.random() - 0.5) * 540;
    el.style.background = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.animate(
      [
        { transform: `translate(${x}px, ${y}px) rotate(0deg) scale(0.6)`, opacity: 0.95 },
        { transform: `translate(${x + dx * 0.5}px, ${y + dy * 0.4}px) rotate(${spin * 0.5}deg) scale(1)`, opacity: 0.9, offset: 0.35 },
        { transform: `translate(${x + dx}px, ${y + dy}px) rotate(${spin}deg) scale(0.8)`, opacity: 0 },
      ],
      { duration: burst ? 750 : 950, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "forwards" },
    );
  };

  useStagePointer(stageRef, {
    onMove: (p) => {
      const s = state.current;
      s.tx = p.x;
      s.ty = p.y;
      if (!s.shown) {
        s.x = p.x;
        s.y = p.y;
        s.shown = true;
      }
      if (!env.active) return;
      s.travel += Math.hypot(p.vx, p.vy);
      if (s.travel > 22) {
        s.travel = 0;
        dropPetal(s.x, s.y);
      }
    },
    onDown: (p) => {
      if (!env.active) return;
      for (let i = 0; i < 10; i++) dropPetal(p.x, p.y, true);
    },
    onLeave: () => {
      state.current.shown = false;
    },
  });

  useRaf(() => {
    const s = state.current;
    const f = flowerRef.current;
    if (!f) return;
    s.x = lerp(s.x, s.tx, 0.22);
    s.y = lerp(s.y, s.ty, 0.22);
    s.scale = lerp(s.scale, overButton ? 1.7 : 1, 0.18);
    f.style.opacity = s.shown ? "1" : "0";
    f.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
  }, env.active);

  return (
    <Stage ref={stageRef} className={cn("demo-canvas", fine && env.motion && "cursor-none")}>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onPointerEnter={() => setOverButton(true)}
          onPointerLeave={() => setOverButton(false)}
          onFocus={() => setOverButton(true)}
          onBlur={() => setOverButton(false)}
          onClick={() => {
            setHello(true);
            env.tried();
          }}
          className={cn(
            "relative z-10 inline-flex min-h-12 items-center rounded-full bg-[#c2255c] px-6 text-[1rem] font-semibold text-white shadow-md transition-transform duration-200 active:scale-95",
            fine && env.motion && "cursor-none",
          )}
        >
          {hello ? t.done : t.button}
        </button>
      </div>
      {Array.from({ length: POOL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            petalRefs.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 -mt-2 -ml-2 size-4 rounded-[0_100%_0_100%] opacity-0 shadow-[0_1px_2px_rgb(190_40_90/0.25)]"
        />
      ))}
      <div
        ref={flowerRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 -mt-4 -ml-4 size-8 opacity-0 transition-opacity duration-200"
      >
        <Flower open={overButton} />
      </div>
    </Stage>
  );
}
