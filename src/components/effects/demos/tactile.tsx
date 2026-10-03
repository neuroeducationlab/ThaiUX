"use client";

import { useId, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { cn } from "@/lib/cn";
import { Stage, useEffectEnv } from "../engine";

const copy = {
  en: { wifi: "Wi-Fi", send: "Send", remember: "Remember me", sent: "Sent" },
  th: { wifi: "Wi-Fi", send: "ส่ง", remember: "จดจำฉันไว้", sent: "ส่งแล้ว" },
  zh: { wifi: "Wi-Fi", send: "发送", remember: "记住我", sent: "已发送" },
  ja: { wifi: "Wi-Fi", send: "送信", remember: "ログイン状態を保持", sent: "送信しました" },
};

export default function Tactile() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const id = useId();
  const [on, setOn] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [sent, setSent] = useState(false);
  const rippleHost = useRef<HTMLSpanElement>(null);
  const uses = useRef(new Set<string>());

  const used = (what: string) => {
    uses.current.add(what);
    if (uses.current.size >= 2) env.tried();
  };

  const ripple = (x: number, y: number) => {
    const host = rippleHost.current;
    if (!host || !env.active) return;
    const dot = document.createElement("span");
    const size = Math.max(host.clientWidth, host.clientHeight) * 2.4;
    dot.className = "pointer-events-none absolute rounded-full bg-white/45";
    Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px` });
    host.appendChild(dot);
    dot
      .animate([{ transform: "scale(0)", opacity: 1 }, { transform: "scale(1)", opacity: 0 }], { duration: 560, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" })
      .finished.finally(() => dot.remove());
  };

  return (
    <Stage focusable={false} className="demo-canvas">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
        {/* switch: the knob stretches while pressed */}
        <div className="flex items-center gap-3">
          <span id={`${id}-wifi`} className="w-14 text-right text-[0.9375rem] font-medium text-ink">
            {t.wifi}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={`${id}-wifi`}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setPressed(true)}
            onKeyUp={() => setPressed(false)}
            onClick={() => {
              setOn((v) => !v);
              used("switch");
            }}
            className={cn(
              "relative inline-flex h-9 w-[3.75rem] shrink-0 items-center rounded-full border p-[3px] transition-colors duration-200",
              on ? "border-transparent bg-success" : "border-line-input bg-surface-3",
            )}
          >
            <span
              aria-hidden
              className="block h-7 rounded-full bg-white shadow-md transition-all duration-300 ease-spring"
              style={{
                width: pressed ? 36 : 28,
                transform: `translateX(${on ? (pressed ? 16 : 24) : 0}px)`,
              }}
            />
          </button>
        </div>

        {/* button: squish + ripple from the press point */}
        <button
          type="button"
          onPointerDown={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            ripple(e.clientX - r.left, e.clientY - r.top);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              const el = e.currentTarget;
              ripple(el.clientWidth / 2, el.clientHeight / 2);
            }
          }}
          onClick={() => {
            setSent(true);
            used("button");
            window.setTimeout(() => setSent(false), 1400);
          }}
          className="relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-accent px-7 text-[1rem] font-semibold text-on-accent shadow-md transition-transform duration-150 ease-spring active:scale-[0.96]"
        >
          <span ref={rippleHost} aria-hidden className="pointer-events-none absolute inset-0" />
          <Send className="relative size-4" aria-hidden />
          <span className="relative">{sent ? t.sent : t.send}</span>
        </button>

        {/* checkbox: the tick draws itself */}
        <label className="flex cursor-pointer items-center gap-3 text-[0.9375rem] font-medium text-ink">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              used("checkbox");
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={cn(
              "flex size-7 items-center justify-center rounded-[8px] border-2 transition-[background-color,border-color,transform] duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-active:scale-90",
              checked ? "border-accent bg-accent" : "border-line-input bg-surface",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-5">
              <path
                d="M5 12.5 L10 17 L19 7.5"
                fill="none"
                stroke="var(--on-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                strokeDashoffset={checked ? 0 : 24}
                className="transition-[stroke-dashoffset] duration-200 ease-out"
              />
            </svg>
          </span>
          {t.remember}
        </label>
      </div>
    </Stage>
  );
}
