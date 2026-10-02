"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/button";

/** Replays each motion token so it can be judged in context. */
export function MotionDemo({ replay }: { replay: string }) {
  const [run, setRun] = useState(0);
  const items = [
    { name: "fade-up", spec: "360 ms · ease-out-soft", el: <div className="animate-fade-up size-12 rounded-[var(--radius-md)] bg-accent" /> },
    { name: "pop", spec: "260 ms · ease-spring", el: <div className="animate-pop size-12 rounded-full bg-success" /> },
    { name: "shake", spec: "360 ms · ease-in-out", el: <div className="animate-shake h-10 w-20 rounded-[var(--radius-sm)] border-2 border-error bg-error-soft" /> },
    { name: "spin-slow", spec: "1.1 s · linear", el: <Spinner className="size-8 text-accent" /> },
  ];
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((it) => (
          <li key={it.name} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div key={run} className="flex h-16 items-center justify-center" aria-hidden>
              {it.el}
            </div>
            <p className="mt-3 font-mono text-[0.8125rem] font-semibold text-ink">{it.name}</p>
            <p className="text-[0.8125rem] text-ink-2">{it.spec}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-accent-ink hover:bg-surface-2"
      >
        <RotateCcw className="size-4" aria-hidden /> {replay}
      </button>
    </div>
  );
}
