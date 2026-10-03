"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, clamp, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

const copy = {
  en: { pass: "Learner pass", level: "Effects explorer", no: "No." },
  th: { pass: "บัตรนักเรียนรู้", level: "นักสำรวจเอฟเฟกต์", no: "เลขที่" },
  zh: { pass: "学习者通行证", level: "特效探索者", no: "编号" },
  ja: { pass: "ラーナーパス", level: "エフェクト探検家", no: "No." },
};

export default function Tilt() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({ rx: 0, ry: 0, gx: 50, gy: 30, glow: 0 });

  const pointer = useStagePointer(stageRef);

  useRaf(() => {
    const p = pointer.current;
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;
    const s = tilt.current;
    let tx = 0;
    let ty = 0;
    let gx = 50;
    let gy = 30;
    if (p.inside) {
      const r = card.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      const px = clamp((p.x - (r.left - sr.left)) / r.width, -0.25, 1.25);
      const py = clamp((p.y - (r.top - sr.top)) / r.height, -0.25, 1.25);
      tx = (0.5 - py) * 28;
      ty = (px - 0.5) * 28;
      gx = px * 100;
      gy = py * 100;
    }
    const k = p.inside ? 0.2 : 0.08;
    s.rx = lerp(s.rx, tx, k);
    s.ry = lerp(s.ry, ty, k);
    s.gx = lerp(s.gx, gx, k);
    s.gy = lerp(s.gy, gy, k);
    s.glow = lerp(s.glow, p.inside ? 1 : 0.35, 0.1);
    card.style.setProperty("--rx", `${s.rx.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${s.ry.toFixed(2)}deg`);
    card.style.setProperty("--gx", `${s.gx.toFixed(1)}%`);
    card.style.setProperty("--gy", `${s.gy.toFixed(1)}%`);
    card.style.setProperty("--ga", `${(s.gx * 3.6 + s.gy * 1.2).toFixed(1)}deg`);
    card.style.setProperty("--glow", s.glow.toFixed(3));
  }, env.active);

  return (
    <Stage ref={stageRef} className="bg-[radial-gradient(circle_at_50%_30%,#262b5c,#0c0e1f_70%)] [perspective:900px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={cardRef}
          aria-hidden
          className="relative aspect-[5/7] h-[82%] overflow-hidden rounded-[18px] bg-[linear-gradient(145deg,#1d2257,#121433)] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] [transform-style:preserve-3d]"
          style={{
            transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
            ["--gx" as string]: "50%",
            ["--gy" as string]: "30%",
            ["--glow" as string]: "0.35",
          }}
        >
          {/* rainbow foil */}
          <span
            className="absolute inset-0 mix-blend-color-dodge"
            style={{
              opacity: "calc(0.2 + var(--glow) * 0.45)",
              maskImage: "radial-gradient(circle at var(--gx) var(--gy), #000 0%, rgb(0 0 0 / 0.35) 38%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at var(--gx) var(--gy), #000 0%, rgb(0 0 0 / 0.35) 38%, transparent 70%)",
              background:
                "conic-gradient(from var(--ga, 180deg) at var(--gx) var(--gy), #ff7eb3, #7af0ff, #b19cff, #ffe27a, #8cffb4, #ff7eb3)",
            }}
          />
          {/* foil texture */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgb(255_255_255/0.07)_0_2px,transparent_2px_7px)] mix-blend-overlay" />
          {/* glare */}
          <span
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              opacity: "var(--glow)",
              background: "radial-gradient(circle at var(--gx) var(--gy), rgb(255 255 255 / 0.85), transparent 48%)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-[9%] text-white [transform:translateZ(30px)]">
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] font-bold tracking-wide">
                UX<span className="text-[#b9c1ff]">Lab</span>
              </span>
              <Sparkles className="size-4 text-[#ffe27a]" />
            </div>
            <div>
              <p className="type-serif-accent text-[clamp(2rem,6vw,3.25rem)] leading-none">Wow</p>
              <p className="mt-2 text-[0.75rem] font-semibold tracking-[0.12em] text-white/85 uppercase">{t.pass}</p>
              <p className="text-[0.75rem] text-white/70">{t.level}</p>
            </div>
            <p className="tabular font-mono text-[0.6875rem] text-white/60">
              {t.no} 0019 · 2026
            </p>
          </div>
        </div>
      </div>
    </Stage>
  );
}
