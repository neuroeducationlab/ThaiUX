"use client";

import { useId, useRef } from "react";
import { Stage, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

/** How far each layer travels at full deflection, as a share of the stage width (far → near). */
const DEPTH = [0.01, 0.018, 0.032, 0.05, 0.078, 0.11];

/* Deterministic shapes, built once at module load (no randomness while rendering). */
const GRASS = (() => {
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 74 }, (_, i) => {
    const x = i * 14 - 10 + rand() * 8;
    const h = 26 + rand() * 58;
    const lean = (rand() - 0.5) * 22;
    return `M${x - 3} 612 Q${x + lean * 0.4} ${600 - h * 0.6} ${x + lean} ${600 - h} Q${x + lean * 0.3 + 2} ${600 - h * 0.5} ${x + 4} 612 Z`;
  }).join(" ");
})();

const STARS = [
  [80, 60, 1.6], [190, 120, 1.1], [260, 40, 1.3], [380, 95, 1], [470, 30, 1.5], [560, 140, 1],
  [700, 70, 1.4], [790, 40, 1], [870, 110, 1.6], [950, 60, 1.1], [130, 180, 1], [620, 200, 1.2],
] as const;

/** A sugar palm (ต้นตาล): slim trunk and a round, spiky crown. */
function palm(x: number, base: number, h: number, s: number) {
  const top = base - h;
  const trunk = `M${x - 4 * s} ${base} Q${x + 5 * s} ${base - h * 0.55} ${x - 1 * s} ${top} L${x + 3 * s} ${top} Q${x + 10 * s} ${base - h * 0.55} ${x + 4 * s} ${base} Z`;
  const spikes = 18;
  const crown = Array.from({ length: spikes * 2 }, (_, k) => {
    const a = (k / (spikes * 2)) * Math.PI * 2;
    const r = (k % 2 ? 15 : 36) * s;
    const droop = Math.sin(a) > 0 ? Math.sin(a) * 10 * s : 0;
    return `${k ? "L" : "M"}${(x + Math.cos(a) * r).toFixed(1)} ${(top + Math.sin(a) * r * 0.78 + droop).toFixed(1)}`;
  }).join(" ");
  return `${trunk} ${crown} Z`;
}

/** A Thai chedi: stepped base, bell, small box and a slender spire. */
function chedi(x: number, base: number, s: number) {
  return [
    `M${x - 30 * s} ${base} h${60 * s} v${-8 * s} h${-6 * s} v${-7 * s} h${-48 * s} v${7 * s} h${-6 * s} Z`,
    `M${x - 22 * s} ${base - 15 * s} C ${x - 22 * s} ${base - 40 * s}, ${x - 8 * s} ${base - 54 * s}, ${x} ${base - 56 * s} C ${x + 8 * s} ${base - 54 * s}, ${x + 22 * s} ${base - 40 * s}, ${x + 22 * s} ${base - 15 * s} Z`,
    `M${x - 6 * s} ${base - 56 * s} h${12 * s} v${-8 * s} h${-12 * s} Z`,
    `M${x - 4 * s} ${base - 64 * s} L${x} ${base - 122 * s} L${x + 4 * s} ${base - 64 * s} Z`,
  ].join(" ");
}

/* Sky lanterns (โคมลอย), placed low enough to stay in view when a wide stage crops the sky. */
const LANTERNS = [
  [170, 268, 1], [330, 236, 0.8], [520, 300, 0.7], [760, 250, 0.9], [890, 300, 0.75], [430, 330, 0.6],
] as const;

export default function Parallax() {
  const env = useEffectEnv();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const stageRef = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const view = useRef({ x: 0, y: 0 });

  const pointer = useStagePointer(stageRef, {}, { step: 30 });

  useRaf(() => {
    const p = pointer.current;
    const stage = stageRef.current;
    if (!stage) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const tx = p.inside && p.w ? (p.x / p.w - 0.5) * 2 : 0;
    const ty = p.inside && p.h ? (p.y / p.h - 0.5) * 2 : 0;
    const v = view.current;
    v.x = lerp(v.x, tx, 0.08);
    v.y = lerp(v.y, ty, 0.08);
    layers.current.forEach((el, i) => {
      if (el) el.style.transform = `translate3d(${(-v.x * DEPTH[i] * w).toFixed(2)}px, ${(-v.y * DEPTH[i] * h * 0.45).toFixed(2)}px, 0)`;
    });
  }, env.active);

  const layer = (i: number, children: React.ReactNode) => (
    <div
      key={i}
      ref={(el) => {
        layers.current[i] = el;
      }}
      aria-hidden
      className="absolute -inset-x-[12%] -inset-y-[6%]"
      style={{ willChange: env.active ? "transform" : undefined }}
    >
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" className="size-full">
        {children}
      </svg>
    </div>
  );

  return (
    <Stage ref={stageRef} className="bg-[#1b1f4b]">
      {layer(
        0,
        <>
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#171a45" />
              <stop offset="0.42" stopColor="#4a3a8e" />
              <stop offset="0.72" stopColor="#e9876a" />
              <stop offset="1" stopColor="#ffd7a6" />
            </linearGradient>
          </defs>
          <rect width="1000" height="600" fill={`url(#${uid}-sky)`} />
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.75" />
          ))}
        </>,
      )}
      {layer(
        1,
        <>
          <defs>
            <radialGradient id={`${uid}-sun`}>
              <stop offset="0" stopColor="#ffe3b8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffb07a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="640" cy="372" r="170" fill={`url(#${uid}-sun)`} />
          <circle cx="640" cy="372" r="74" fill="#ffdcae" />
        </>,
      )}
      {layer(
        2,
        <path
          d="M0 430 L70 372 L140 400 L230 330 L320 392 L410 342 L505 402 L600 350 L690 392 L790 322 L890 380 L1000 340 L1000 612 L0 612 Z"
          fill="#8f7cc4"
          opacity="0.85"
        />,
      )}
      {layer(
        3,
        <>
          <defs>
            <radialGradient id={`${uid}-glow`}>
              <stop offset="0" stopColor="#ffc078" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ffc078" stopOpacity="0" />
            </radialGradient>
          </defs>
          {LANTERNS.map(([x, y, s], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={20 * s} fill={`url(#${uid}-glow)`} />
              <rect x={x - 5 * s} y={y - 7 * s} width={10 * s} height={14 * s} rx={3 * s} fill="#ffd28f" />
            </g>
          ))}
          <path d="M0 482 C 120 432, 230 452, 330 462 C 430 474, 530 428, 650 438 C 770 448, 870 480, 1000 452 L1000 612 L0 612 Z" fill="#5c4b8f" />
          <path d={`${chedi(300, 462, 1)} ${chedi(372, 466, 0.62)} ${chedi(700, 440, 0.8)}`} fill="#4a3c7a" />
        </>,
      )}
      {layer(
        4,
        <>
          <path d="M0 548 C 200 526, 400 552, 600 536 C 800 520, 900 546, 1000 536 L1000 612 L0 612 Z" fill="#2f2759" />
          <path d={`${palm(140, 560, 190, 1)} ${palm(205, 556, 140, 0.8)} ${palm(820, 552, 230, 1.15)} ${palm(905, 560, 165, 0.9)}`} fill="#2f2759" />
        </>,
      )}
      {layer(5, <path d={GRASS} fill="#17142f" />)}
    </Stage>
  );
}
