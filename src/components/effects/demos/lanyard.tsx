"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { format } from "@/i18n/localized";
import { effectIds } from "@/content/effect-ids";
import { useHydrated, useProgress } from "@/components/progress/store";
import { Stage, useEffectEnv, useRaf, useSize } from "../engine";

const copy = {
  en: { pass: "Learner pass", role: "Vibe coder", tried: "{n} of {total} effects tried", label: "Lanyard badge. Drag it, or press the arrow keys to swing it." },
  th: { pass: "บัตรผู้เรียน", role: "Vibe coder", tried: "ลองแล้ว {n} จาก {total} เอฟเฟกต์", label: "ป้ายห้อยคอ ลากได้ หรือกดปุ่มลูกศรเพื่อแกว่ง" },
  zh: { pass: "学习者通行证", role: "Vibe coder", tried: "已体验 {n} / {total} 个特效", label: "挂绳工牌。可以拖动，或按方向键让它摆动。" },
  ja: { pass: "ラーナーパス", role: "Vibe coder", tried: "{total} 個中 {n} 個を体験", label: "ストラップ付きバッジ。ドラッグするか、矢印キーで揺らしてみて。" },
};

const N = 14; // rope points (the badge's centre is one more)
const GRAVITY = 0.45; // px per step²
const DAMPING = 0.985;
const PASSES = 10;
const STEP = 1000 / 60;

type Pt = { x: number; y: number; px: number; py: number };

export default function Lanyard() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const state = useProgress();
  const hydrated = useHydrated();
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const shineRef = useRef<SVGPathElement>(null);
  const size = useSize(stageRef);
  const sim = useRef({ pts: [] as Pt[], seg: 10, half: 70, drag: false, gx: 0, gy: 0, acc: 0, kicked: false });

  const draw = () => {
    const s = sim.current;
    const badge = badgeRef.current;
    if (!s.pts.length || !badge) return;
    const pts = s.pts;
    const end = pts[N - 1];
    const centre = pts[N];
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < N - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    d += ` L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    strapRef.current?.setAttribute("d", d);
    shineRef.current?.setAttribute("d", d);
    const angle = -Math.atan2(centre.x - end.x, centre.y - end.y);
    badge.style.opacity = "1";
    badge.style.transform = `translate(${(end.x - badge.offsetWidth / 2).toFixed(1)}px, ${(end.y - 6).toFixed(1)}px) rotate(${angle.toFixed(4)}rad)`;
  };

  // (re)build the rope, hanging straight down from the top centre
  useEffect(() => {
    const badge = badgeRef.current;
    if (!size.w || !size.h || !badge) return;
    const s = sim.current;
    s.half = badge.offsetHeight / 2;
    const rope = Math.max(36, size.h - badge.offsetHeight - 34);
    s.seg = rope / (N - 1);
    const x = size.w / 2;
    s.pts = Array.from({ length: N + 1 }, (_, i) => {
      const y = i < N ? -4 + i * s.seg : -4 + rope + s.half;
      return { x, y, px: x, py: y };
    });
    draw();
  }, [size.w, size.h]);

  const step = () => {
    const s = sim.current;
    const pts = s.pts;
    for (let i = 1; i <= N; i++) {
      const p = pts[i];
      if (i === N && s.drag) continue;
      const vx = (p.x - p.px) * DAMPING;
      const vy = (p.y - p.py) * DAMPING;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAVITY;
    }
    if (s.drag) {
      const c = pts[N];
      c.px = c.x;
      c.py = c.y;
      c.x = s.gx;
      c.y = s.gy;
    }
    for (let k = 0; k < PASSES; k++) {
      for (let i = 0; i < N; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const len = i === N - 1 ? s.half : s.seg;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const diff = (dist - len) / dist;
        const aFixed = i === 0;
        const bFixed = i + 1 === N && s.drag;
        if (aFixed && bFixed) continue;
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
        const wb = bFixed ? 0 : aFixed ? 1 : 0.5;
        a.x += dx * diff * wa;
        a.y += dy * diff * wa;
        b.x -= dx * diff * wb;
        b.y -= dy * diff * wb;
      }
    }
  };

  useRaf((dt) => {
    const s = sim.current;
    if (!s.pts.length) return;
    if (!s.kicked) {
      // a little swing the first time it wakes up, so it reads as a real object
      s.kicked = true;
      s.pts[N].px -= 9;
    }
    s.acc = Math.min(s.acc + dt, STEP * 4);
    while (s.acc >= STEP) {
      step();
      s.acc -= STEP;
    }
    draw();
  }, env.active);

  const toStage = (e: React.PointerEvent) => {
    const r = stageRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const total = effectIds.length;
  const tried = hydrated ? Math.min(state.effects.length, total) : 0;

  return (
    <Stage ref={stageRef} focusable={false} className="demo-canvas">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path ref={strapRef} fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={shineRef} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
      </svg>
      <span aria-hidden className="absolute top-0 left-1/2 -mt-1 h-3 w-8 -translate-x-1/2 rounded-b-md bg-ink-2" />
      <button
        ref={badgeRef}
        type="button"
        aria-label={t.label}
        onPointerDown={(e) => {
          if (!env.active) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const s = sim.current;
          const p = toStage(e);
          const c = s.pts[N];
          s.drag = true;
          s.gx = c.x;
          s.gy = c.y;
          // keep the grab point under the finger
          (e.currentTarget as HTMLButtonElement).dataset.ox = String(p.x - c.x);
          (e.currentTarget as HTMLButtonElement).dataset.oy = String(p.y - c.y);
          env.tried();
        }}
        onPointerMove={(e) => {
          const s = sim.current;
          if (!s.drag) return;
          const p = toStage(e);
          s.gx = p.x - Number(e.currentTarget.dataset.ox ?? 0);
          s.gy = p.y - Number(e.currentTarget.dataset.oy ?? 0);
        }}
        onPointerUp={() => {
          sim.current.drag = false;
        }}
        onPointerCancel={() => {
          sim.current.drag = false;
        }}
        onKeyDown={(e) => {
          const push: Record<string, [number, number]> = { ArrowLeft: [14, 0], ArrowRight: [-14, 0], ArrowUp: [0, 14], ArrowDown: [0, -6] };
          const v = push[e.key];
          if (!v || !sim.current.pts.length) return;
          e.preventDefault();
          const c = sim.current.pts[N];
          c.px += v[0];
          c.py += v[1];
          env.tried();
        }}
        className="absolute top-0 left-0 w-[7.5rem] origin-top cursor-grab touch-none overflow-hidden rounded-[14px] border border-black/10 bg-surface text-center opacity-0 shadow-xl select-none active:cursor-grabbing"
      >
        <span aria-hidden className="mx-auto mt-2 block h-2 w-6 rounded-full bg-surface-3 shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)]" />
        <span aria-hidden className="mt-2 flex items-center justify-between bg-accent px-2.5 py-1 text-[0.625rem] font-bold tracking-wider text-on-accent uppercase">
          <span>UXLab</span>
          <span>Pass</span>
        </span>
        <span aria-hidden className="flex flex-col items-center px-2.5 pt-2.5 pb-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#8f9bff,#f9a8d4,#fcd34d,#8f9bff)]">
            <Sparkles className="size-5 text-[#1b1f4b]" />
          </span>
          <span lang="en" className="mt-1.5 text-[0.875rem] leading-tight font-bold text-ink">
            {t.role}
          </span>
          <span className="text-[0.625rem] text-ink-2">{t.pass}</span>
          <span className="mt-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[0.625rem] leading-snug font-semibold text-success">
            {format(t.tried, { n: tried, total })}
          </span>
        </span>
      </button>
    </Stage>
  );
}
