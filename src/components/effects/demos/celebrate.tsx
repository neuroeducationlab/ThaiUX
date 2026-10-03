"use client";

import { useRef, useState } from "react";
import { GraduationCap, Heart, PartyPopper } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { cn } from "@/lib/cn";
import { Stage, useEffectEnv } from "../engine";

const copy = {
  en: { small: "Small moment", big: "Big moment", like: "Like", finish: "Finish course", done: "Course complete!", again: "Celebrate again", announce: "Course complete" },
  th: { small: "โมเมนต์เล็ก", big: "โมเมนต์ใหญ่", like: "ถูกใจ", finish: "เรียนจบแล้ว", done: "เรียนจบแล้ว เก่งมาก!", again: "ฉลองอีกครั้ง", announce: "เรียนจบคอร์สแล้ว" },
  zh: { small: "小时刻", big: "大时刻", like: "点赞", finish: "完成课程", done: "课程完成！", again: "再庆祝一次", announce: "课程已完成" },
  ja: { small: "小さな瞬間", big: "大きな瞬間", like: "いいね", finish: "コースを修了", done: "修了しました！", again: "もう一度お祝い", announce: "コースを修了しました" },
};

const CONFETTI = ["#3343c4", "#8f9bff", "#ff8fab", "#ffd166", "#5ccb8e", "#7af0ff", "#f97316"];

type Piece = { x: number; y: number; vx: number; vy: number; r: number; vr: number; w: number; h: number; color: string; round: boolean; life: number };

export default function Celebrate() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const burstRef = useRef<HTMLSpanElement>(null);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [complete, setComplete] = useState(false);
  const actions = useRef(0);

  const tried = () => {
    actions.current += 1;
    if (actions.current >= 2) env.tried();
  };

  const likeBurst = () => {
    const heart = heartRef.current;
    const burst = burstRef.current;
    if (!heart || !burst) return;
    heart.animate([{ transform: "scale(0.7)" }, { transform: "scale(1.25)", offset: 0.45 }, { transform: "scale(1)" }], {
      duration: 380,
      easing: "cubic-bezier(0.34, 1.4, 0.64, 1)",
    });
    burst.querySelectorAll("span").forEach((dot, i) => {
      const a = (i / 8) * Math.PI * 2;
      if (i === 8) {
        dot.animate([{ transform: "scale(0.2)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 420, easing: "ease-out" });
        return;
      }
      dot.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${Math.cos(a) * 26}px, ${Math.sin(a) * 26}px) scale(0.4)`, opacity: 0 },
        ],
        { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    });
  };

  const confetti = (fromEl: HTMLElement) => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const g = canvas.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sr = stage.getBoundingClientRect();
    const br = fromEl.getBoundingClientRect();
    const ox = br.left - sr.left + br.width / 2;
    const oy = br.top - sr.top + br.height / 2;
    const pieces: Piece[] = Array.from({ length: env.full ? 160 : 110 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 7 + Math.random() * 9;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        color: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
        round: Math.random() < 0.3,
        life: 0,
      };
    });
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.7);
      last = now;
      g.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.life += dt;
        p.vy += 0.25 * dt;
        p.vx *= 0.98 ** dt;
        p.vy *= 0.985 ** dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        if (p.y > h + 20) continue;
        alive += 1;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.r);
        g.scale(1, Math.cos(p.life * 0.2));
        g.fillStyle = p.color;
        if (p.round) {
          g.beginPath();
          g.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          g.fill();
        } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        g.restore();
      }
      if (alive > 0) requestAnimationFrame(tick);
      else g.clearRect(0, 0, w, h);
    };
    requestAnimationFrame(tick);
  };

  return (
    <Stage ref={stageRef} focusable={false} className="demo-canvas">
      <div className="absolute inset-0 grid grid-cols-2 divide-x divide-line">
        <div className="flex flex-col items-center justify-center gap-3 p-3">
          <p className="type-label">{t.small}</p>
          <button
            type="button"
            aria-pressed={liked}
            onClick={() => {
              const next = !liked;
              setLiked(next);
              setCount((c) => c + (next ? 1 : -1));
              if (next && env.active) likeBurst();
              tried();
            }}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 shadow-sm transition-transform active:scale-95"
          >
            <span className="relative flex size-6 items-center justify-center">
              <span ref={burstRef} aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="absolute size-1.5 rounded-full opacity-0" style={{ background: CONFETTI[i % CONFETTI.length] }} />
                ))}
                <span className="absolute size-7 rounded-full border-2 border-[#e11d48] opacity-0" />
              </span>
              <span ref={heartRef} className="inline-flex">
                <Heart className={cn("size-6 transition-colors", liked ? "fill-[#e11d48] text-[#e11d48]" : "text-ink-2")} aria-hidden />
              </span>
            </span>
            <span className="text-[0.9375rem] font-semibold text-ink">{t.like}</span>
            <span className="tabular text-[0.9375rem] text-ink-2">{count}</span>
          </button>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-3 p-3">
          <p className="type-label">{t.big}</p>
          <button
            type="button"
            onClick={(e) => {
              if (env.active) confetti(e.currentTarget);
              setComplete(true);
              tried();
            }}
            className={cn(
              "inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-center text-[0.9375rem] font-semibold shadow-md transition-[background-color,transform] active:scale-95",
              complete ? "bg-success text-on-accent" : "bg-accent text-on-accent hover:bg-accent-hover",
            )}
          >
            {complete ? <PartyPopper className="size-5" aria-hidden /> : <GraduationCap className="size-5" aria-hidden />}
            {complete ? t.again : t.finish}
          </button>
          <p className="absolute inset-x-2 top-[calc(50%+2.75rem)] text-center text-[0.8125rem] font-semibold text-success" aria-live="polite">
            {complete ? t.done : ""}
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full" />
    </Stage>
  );
}
