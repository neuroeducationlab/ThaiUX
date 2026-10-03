"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, clamp, lerp, useEffectEnv, useRaf, useStagePointer } from "../engine";

const copy = {
  en: { overlay: "Overlay", nav: "Navigation", content: "Content", background: "Background", saved: "Saved" },
  th: { overlay: "ชั้นลอย", nav: "แถบนำทาง", content: "เนื้อหา", background: "พื้นหลัง", saved: "บันทึกแล้ว" },
  zh: { overlay: "浮层", nav: "导航", content: "内容", background: "背景", saved: "已保存" },
  ja: { overlay: "オーバーレイ", nav: "ナビゲーション", content: "コンテンツ", background: "背景", saved: "保存しました" },
};

const LAYER_TINT = ["#c4b5fd", "#93c5fd", "#86efac", "#fda4af"];

export default function ExplodedView() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const legend = useRef<(HTMLLIElement | null)[]>([]);
  const state = useRef({ t: 0.62, tilt: 0 });

  const pointer = useStagePointer(stageRef, {}, { step: 30 });

  const apply = () => {
    const s = state.current;
    const stack = stackRef.current;
    if (!stack) return;
    const e = s.t;
    stack.style.transform = `rotateX(${(58 * e).toFixed(2)}deg) rotateZ(${(-38 * e + s.tilt).toFixed(2)}deg)`;
    const gap = (env.full ? 62 : 46) * e;
    layers.current.forEach((el, i) => {
      if (el) el.style.transform = `translateZ(${(i * gap).toFixed(1)}px)`;
    });
    legend.current.forEach((el) => {
      if (el) el.style.opacity = e > 0.3 ? "1" : "0.45";
    });
  };

  useRaf(() => {
    const p = pointer.current;
    const s = state.current;
    const target = p.inside && p.w ? clamp((p.x / p.w - 0.15) / 0.7, 0, 1) : 0.62;
    const tilt = p.inside && p.h ? (p.y / p.h - 0.5) * 16 : 0;
    s.t = lerp(s.t, target, 0.12);
    s.tilt = lerp(s.tilt, tilt, 0.12);
    apply();
  }, env.active);

  const names = [t.background, t.content, t.nav, t.overlay];
  const rest = (i: number) => ({ transform: `translateZ(${(i * (env.full ? 62 : 46) * 0.62).toFixed(1)}px)` });

  return (
    <Stage ref={stageRef} className="demo-canvas">
      <div className="absolute inset-0 grid grid-cols-[1fr_auto] items-center gap-2 pr-4 pl-2 sm:pr-6">
        <div className="flex h-full items-center justify-center [perspective:1000px]">
          <div
            ref={stackRef}
            aria-hidden
            className="relative aspect-[9/17] h-[54%] [transform-style:preserve-3d]"
            style={{ transform: "rotateX(36deg) rotateZ(-23.6deg)" }}
          >
            {/* 0 background */}
            <div
              ref={(el) => {
                layers.current[0] = el;
              }}
              style={rest(0)}
              className="absolute inset-0 rounded-[14px] border border-white/60 bg-[linear-gradient(160deg,#c7d2fe,#fbcfe8)] shadow-[0_10px_30px_-10px_rgb(30_30_80/0.4)]"
            />
            {/* 1 content */}
            <div
              ref={(el) => {
                layers.current[1] = el;
              }}
              style={rest(1)}
              className="absolute inset-0 flex flex-col gap-[6%] px-[9%] pt-[24%]"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-[8px] bg-white/95 p-[7%] shadow-[0_6px_16px_-6px_rgb(30_30_80/0.35)]">
                  <div className="h-[0.32rem] w-3/4 rounded-full bg-[#1e1b4b]/70" />
                  <div className="mt-1 h-[0.26rem] w-1/2 rounded-full bg-[#1e1b4b]/25" />
                </div>
              ))}
            </div>
            {/* 2 navigation */}
            <div
              ref={(el) => {
                layers.current[2] = el;
              }}
              style={rest(2)}
              className="absolute inset-0"
            >
              <div className="absolute inset-x-0 top-0 h-[13%] rounded-t-[14px] bg-[#1e1b4b]/90 shadow-[0_6px_14px_-6px_rgb(0_0_0/0.5)]" />
              <div className="absolute inset-x-0 bottom-0 flex h-[11%] items-center justify-around rounded-b-[14px] bg-white shadow-[0_-6px_14px_-6px_rgb(0_0_0/0.3)]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`size-[18%] max-h-3 max-w-3 rounded-full ${i === 0 ? "bg-[#3343c4]" : "bg-[#1e1b4b]/25"}`} />
                ))}
              </div>
            </div>
            {/* 3 overlay */}
            <div
              ref={(el) => {
                layers.current[3] = el;
              }}
              style={rest(3)}
              className="absolute inset-x-[10%] bottom-[16%] flex h-[9%] items-center justify-center gap-1 rounded-full bg-[#111827] text-[0.5625rem] font-semibold text-white shadow-[0_12px_24px_-8px_rgb(0_0_0/0.6)]"
            >
              <Check className="size-2.5 text-[#86efac]" strokeWidth={3} />
              {t.saved}
            </div>
          </div>
        </div>
        <ol className="space-y-2 text-[0.75rem] sm:text-[0.8125rem]">
          {[3, 2, 1, 0].map((i) => (
            <li
              key={i}
              ref={(el) => {
                legend.current[i] = el;
              }}
              className="flex items-center gap-2 transition-opacity duration-300"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: LAYER_TINT[i] }} aria-hidden />
              <span className="font-semibold text-ink">{names[i]}</span>
              <span className="tabular font-mono text-ink-2">z{i}</span>
            </li>
          ))}
        </ol>
      </div>
    </Stage>
  );
}
