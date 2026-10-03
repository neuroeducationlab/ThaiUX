"use client";

import { useId, useRef } from "react";
import { Stage, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

const CHAIN = [58, 50, 43, 37, 31, 26];
/** Resting blobs, as fractions of the stage. */
const RESTING = [
  { x: 0.2, y: 0.32, r: 34 },
  { x: 0.8, y: 0.28, r: 26 },
  { x: 0.74, y: 0.74, r: 40 },
  { x: 0.28, y: 0.76, r: 22 },
];

export default function Gooey() {
  const env = useEffectEnv();
  const filterId = `goo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stageRef = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const chain = useRef(CHAIN.map(() => ({ x: -100, y: -100 })));
  const press = useRef({ scale: 1 });
  const clock = useRef(0);

  const pointer = useStagePointer(stageRef);
  const scale = env.full ? 1.3 : 1;

  useRaf((dt) => {
    const stage = stageRef.current;
    if (!stage) return;
    const p = pointer.current;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    clock.current += dt / 1000;
    // when nobody is playing, the lead blob drifts in a slow figure-eight
    const tx = p.inside ? p.x : w / 2 + Math.sin(clock.current * 0.9) * w * 0.3;
    const ty = p.inside ? p.y : h / 2 + Math.sin(clock.current * 1.8) * h * 0.22;
    const c = chain.current;
    if (c[0].x < -50) c.forEach((d) => Object.assign(d, { x: tx, y: ty }));
    press.current.scale = lerp(press.current.scale, p.down ? 1.4 : 1, 0.2);
    c.forEach((d, i) => {
      const lead = i === 0 ? { x: tx, y: ty } : c[i - 1];
      const k = 0.35 - i * 0.04;
      d.x = lerp(d.x, lead.x, k);
      d.y = lerp(d.y, lead.y, k);
      const el = dots.current[i];
      if (el) el.style.transform = `translate(${d.x}px, ${d.y}px) scale(${i === 0 ? press.current.scale : 1})`;
    });
  }, env.active);

  return (
    <Stage ref={stageRef} className="cursor-none bg-[linear-gradient(140deg,#1b1f4b,#2a2f7a_55%,#3b2a6e)]">
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div aria-hidden className="absolute inset-0" style={{ filter: `url(#${filterId})` }}>
        {RESTING.map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[linear-gradient(135deg,#ff7eb3,#a78bfa)] animate-breathe"
            style={{
              left: `${b.x * 100}%`,
              top: `${b.y * 100}%`,
              width: b.r * 2 * scale,
              height: b.r * 2 * scale,
              marginLeft: -b.r * scale,
              marginTop: -b.r * scale,
              animationDelay: `${i * -1.1}s`,
            }}
          />
        ))}
        {CHAIN.map((size, i) => (
          <span
            key={i}
            ref={(el) => {
              dots.current[i] = el;
            }}
            className="absolute top-0 left-0 rounded-full bg-[linear-gradient(135deg,#7af0ff,#8f9bff)]"
            style={{ width: size * scale, height: size * scale, marginLeft: (-size * scale) / 2, marginTop: (-size * scale) / 2, transform: "translate(-200px, -200px)" }}
          />
        ))}
      </div>
    </Stage>
  );
}
