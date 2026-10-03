"use client";

import { useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, useEffectEnv, useRaf } from "../engine";

const copy = {
  en: { card: "Drag me", hint: "then let go", keys: "Spring card. Drag it, or use the arrow keys to fling it." },
  th: { card: "ลากฉันสิ", hint: "แล้วปล่อยมือ", keys: "การ์ดสปริง ลากได้ หรือกดปุ่มลูกศรเพื่อเหวี่ยง" },
  zh: { card: "拖我", hint: "然后松手", keys: "弹簧卡片。可以拖动，或用方向键把它甩出去。" },
  ja: { card: "ドラッグして", hint: "そして離して", keys: "バネのカード。ドラッグするか、矢印キーで投げてみて。" },
};

const STIFFNESS = 170;
const DAMPING = 18;
const LIMIT = 110;

/** iOS-style rubber band: the further you pull, the more it resists. */
function rubber(distance: number, dimension: number) {
  return (1 - 1 / ((distance * 0.55) / dimension + 1)) * dimension;
}

export default function SpringDrag() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const bandRef = useRef<SVGPathElement>(null);
  const s = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, ox: 0, oy: 0, lastX: 0, lastY: 0, lastT: 0, moving: false });

  const render = () => {
    const card = cardRef.current;
    const band = bandRef.current;
    const stage = stageRef.current;
    if (!card || !band || !stage) return;
    const st = s.current;
    const tiltDeg = Math.max(-14, Math.min(14, st.vx * 0.012));
    const speed = Math.min(1, Math.hypot(st.vx, st.vy) / 2600);
    card.style.transform = `translate(${st.x}px, ${st.y}px) rotate(${tiltDeg}deg) scale(${1 + speed * 0.06}, ${1 - speed * 0.04})`;
    const cx = stage.clientWidth / 2;
    const cy = stage.clientHeight / 2;
    const ex = cx + st.x;
    const ey = cy + st.y;
    const sag = Math.min(40, Math.hypot(st.x, st.y) * 0.15);
    band.setAttribute("d", `M ${cx} ${cy} Q ${(cx + ex) / 2} ${(cy + ey) / 2 + sag} ${ex} ${ey}`);
  };

  useEffect(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;
    const st = s.current;

    const onDown = (e: PointerEvent) => {
      card.setPointerCapture(e.pointerId);
      st.dragging = true;
      st.moving = true;
      st.ox = e.clientX - st.x;
      st.oy = e.clientY - st.y;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.lastT = e.timeStamp;
      st.vx = 0;
      st.vy = 0;
      env.tried();
    };
    const onMove = (e: PointerEvent) => {
      if (!st.dragging) return;
      const rx = e.clientX - st.ox;
      const ry = e.clientY - st.oy;
      const d = Math.hypot(rx, ry);
      const limit = Math.min(LIMIT, stage.clientHeight / 2 - 40);
      const k = d > limit ? (limit + rubber(d - limit, 160)) / d : 1;
      st.x = rx * k;
      st.y = ry * k;
      const dt = Math.max(1, e.timeStamp - st.lastT) / 1000;
      st.vx = st.vx * 0.5 + ((e.clientX - st.lastX) / dt) * 0.5;
      st.vy = st.vy * 0.5 + ((e.clientY - st.lastY) / dt) * 0.5;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.lastT = e.timeStamp;
      render();
    };
    const onUp = () => {
      st.dragging = false;
    };
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    return () => {
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
    };
    // env.tried is stable for the card's lifetime; render reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useRaf((dt) => {
    const st = s.current;
    if (st.dragging || !st.moving) return;
    const step = dt / 1000;
    const ax = -STIFFNESS * st.x - DAMPING * st.vx;
    const ay = -STIFFNESS * st.y - DAMPING * st.vy;
    st.vx += ax * step;
    st.vy += ay * step;
    st.x += st.vx * step;
    st.y += st.vy * step;
    if (Math.hypot(st.x, st.y) < 0.3 && Math.hypot(st.vx, st.vy) < 4) {
      Object.assign(st, { x: 0, y: 0, vx: 0, vy: 0, moving: false });
    }
    render();
  }, env.active);

  const fling = (e: React.KeyboardEvent) => {
    const impulse: Record<string, [number, number]> = {
      ArrowLeft: [-900, 0],
      ArrowRight: [900, 0],
      ArrowUp: [0, -900],
      ArrowDown: [0, 900],
    };
    const v = impulse[e.key];
    if (!v) return;
    e.preventDefault();
    const st = s.current;
    st.vx += v[0];
    st.vy += v[1];
    st.moving = true;
    env.tried();
  };

  return (
    <Stage ref={stageRef} focusable={false} className="demo-canvas">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <path ref={bandRef} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
      </svg>
      <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 rounded-full border-2 border-dashed border-accent/60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          ref={cardRef}
          type="button"
          aria-label={t.keys}
          onKeyDown={fling}
          className="relative flex h-24 w-36 cursor-grab touch-none flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] border border-line-strong bg-surface shadow-lg select-none active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-ink-2" aria-hidden />
          <span className="text-[1rem] font-semibold text-ink">{t.card}</span>
          <span className="text-[0.75rem] text-ink-2">{t.hint}</span>
        </button>
      </div>
    </Stage>
  );
}
