"use client";

import { useRef, useState } from "react";
import { useCopy } from "@/components/demos/use-copy";
import { cn } from "@/lib/cn";
import { Stage, useEffectEnv, useRaf, useStagePointer } from "../engine";

const copy = {
  en: { button: "Let’s go", caught: "Caught it!", field: "magnet range" },
  th: { button: "ไปกันเลย", caught: "จับได้แล้ว!", field: "ระยะแม่เหล็ก" },
  zh: { button: "出发吧", caught: "抓到了！", field: "磁吸范围" },
  ja: { button: "はじめよう", caught: "つかまえた！", field: "磁力の範囲" },
};

type Spring = { x: number; y: number; vx: number; vy: number };

/** One step of a damped spring toward a target (frame-based, feels like stiffness 0.12 / damping 0.74). */
function springTo(s: Spring, tx: number, ty: number, k = 0.12, damping = 0.74) {
  s.vx = (s.vx + (tx - s.x) * k) * damping;
  s.vy = (s.vy + (ty - s.y) * k) * damping;
  s.x += s.vx;
  s.y += s.vy;
}

export default function Magnetic() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const fieldRef = useRef<HTMLSpanElement>(null);
  const body = useRef<Spring>({ x: 0, y: 0, vx: 0, vy: 0 });
  const label = useRef<Spring>({ x: 0, y: 0, vx: 0, vy: 0 });
  const [caught, setCaught] = useState(false);
  const radius = env.full ? 150 : 95;

  const pointer = useStagePointer(stageRef, {
    onDown: (p) => {
      if (p.kind === "key") buttonRef.current?.click();
    },
  });

  useRaf(() => {
    const p = pointer.current;
    const stage = stageRef.current;
    const btn = buttonRef.current;
    if (!stage || !btn) return;
    const cx = stage.clientWidth / 2;
    const cy = stage.clientHeight / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const near = p.inside && Math.hypot(dx, dy) < radius;
    springTo(body.current, near ? dx * 0.3 : 0, near ? dy * 0.3 : 0);
    springTo(label.current, near ? dx * 0.16 : 0, near ? dy * 0.16 : 0, 0.14, 0.72);
    btn.style.transform = `translate(${body.current.x}px, ${body.current.y}px)`;
    if (labelRef.current) labelRef.current.style.transform = `translate(${label.current.x}px, ${label.current.y}px)`;
    if (fieldRef.current) fieldRef.current.style.opacity = near ? "1" : "0.35";
  }, env.active);

  return (
    <Stage ref={stageRef} className="demo-canvas">
      <span
        ref={fieldRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border-2 border-dashed border-accent/50 bg-accent/5 opacity-35 transition-opacity duration-300"
        style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap text-accent-ink uppercase"
        style={{ top: `calc(50% - ${radius + 22}px)` }}
      >
        {t.field}
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            setCaught(true);
            env.tried();
            window.setTimeout(() => setCaught(false), 1400);
          }}
          className={cn(
            "relative inline-flex min-h-14 items-center rounded-full bg-accent px-8 text-[1.0625rem] font-semibold text-on-accent shadow-lg transition-colors hover:bg-accent-hover",
            caught && "bg-success hover:bg-success",
          )}
        >
          <span ref={labelRef} className="inline-block">
            {caught ? t.caught : t.button}
          </span>
        </button>
      </div>
    </Stage>
  );
}
