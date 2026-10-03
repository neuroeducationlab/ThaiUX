"use client";

import { useEffect, useRef } from "react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, useEffectEnv, useRaf, useSize, useStagePointer } from "../engine";

const copy = {
  en: { word: "WOW" },
  th: { word: "ว้าว" },
  zh: { word: "哇" },
  ja: { word: "ワオ" },
};

const COLORS = ["#8f9bff", "#a78bfa", "#c084fc", "#f472b6", "#fb7185", "#fdba74"];

type Swarm = {
  n: number;
  hx: Float32Array;
  hy: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  color: Uint8Array;
};

/** Sample the word's pixels into home positions for the particles. */
function buildSwarm(word: string, w: number, h: number, fontFamily: string): Swarm {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  let size = Math.min(h * 0.62, 260);
  g.font = `800 ${size}px ${fontFamily}`;
  const measured = g.measureText(word).width;
  if (measured > w * 0.82) size *= (w * 0.82) / measured;
  g.font = `800 ${size}px ${fontFamily}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff";
  g.fillText(word, w / 2, h / 2 + size * 0.04);

  const data = g.getImageData(0, 0, w, h).data;
  const gap = Math.max(3, Math.round(Math.sqrt((w * h) / 9000)));
  const points: number[] = [];
  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      if (data[(y * w + x) * 4 + 3] > 140) points.push(x, y);
    }
  }
  const n = Math.min(points.length / 2, 2200);
  const step = points.length / 2 / n;
  const s: Swarm = {
    n,
    hx: new Float32Array(n),
    hy: new Float32Array(n),
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    color: new Uint8Array(n),
  };
  for (let i = 0; i < n; i++) {
    const j = Math.floor(i * step) * 2;
    s.hx[i] = points[j];
    s.hy[i] = points[j + 1];
    s.x[i] = s.hx[i];
    s.y[i] = s.hy[i];
    s.color[i] = Math.min(COLORS.length - 1, Math.floor((points[j] / w) * COLORS.length));
  }
  return s;
}

export default function Particles() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swarm = useRef<Swarm | null>(null);
  const intro = useRef(false);
  const size = useSize(stageRef);

  const draw = () => {
    const canvas = canvasRef.current;
    const s = swarm.current;
    if (!canvas || !s) return;
    const g = canvas.getContext("2d")!;
    const dpr = canvas.width / Math.max(1, size.w);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size.w, size.h);
    for (let c = 0; c < COLORS.length; c++) {
      g.fillStyle = COLORS[c];
      for (let i = 0; i < s.n; i++) {
        if (s.color[i] === c) g.fillRect(s.x[i] - 1, s.y[i] - 1, 2.2, 2.2);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;
    let cancelled = false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    const family = getComputedStyle(canvas).fontFamily;
    document.fonts
      .load(`800 100px ${family}`, t.word)
      .catch(() => [])
      .then(() => {
        if (cancelled) return;
        swarm.current = buildSwarm(t.word, size.w, size.h, family);
        intro.current = false;
        draw();
      });
    return () => {
      cancelled = true;
    };
    // draw reads the latest refs; rebuilding only depends on size and word
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, t.word]);

  const pointer = useStagePointer(stageRef, {
    onDown: (p) => {
      const s = swarm.current;
      if (!s || !env.active) return;
      for (let i = 0; i < s.n; i++) {
        const dx = s.x[i] - p.x;
        const dy = s.y[i] - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const force = 9 + Math.random() * 14;
        s.vx[i] += (dx / d) * force;
        s.vy[i] += (dy / d) * force;
      }
    },
  });

  useRaf(() => {
    const s = swarm.current;
    if (!s) return;
    // first time it plays, the word assembles from a scatter
    if (!intro.current) {
      intro.current = true;
      for (let i = 0; i < s.n; i++) {
        s.x[i] = Math.random() * size.w;
        s.y[i] = Math.random() * size.h;
      }
    }
    const p = pointer.current;
    const radius = Math.max(56, Math.min(size.w, size.h) * 0.24);
    for (let i = 0; i < s.n; i++) {
      if (p.inside) {
        const dx = s.x[i] - p.x;
        const dy = s.y[i] - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / radius) * 3.2;
          s.vx[i] += (dx / d) * f;
          s.vy[i] += (dy / d) * f;
        }
      }
      s.vx[i] = (s.vx[i] + (s.hx[i] - s.x[i]) * 0.05) * 0.86;
      s.vy[i] = (s.vy[i] + (s.hy[i] - s.y[i]) * 0.05) * 0.86;
      s.x[i] += s.vx[i];
      s.y[i] += s.vy[i];
    }
    draw();
  }, env.active);

  return (
    <Stage ref={stageRef} className="cursor-crosshair bg-[#0b0d1f]">
      <span className="sr-only">{t.word}</span>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    </Stage>
  );
}
