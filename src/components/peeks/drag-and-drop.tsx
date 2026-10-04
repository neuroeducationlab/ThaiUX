"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Step = 0 | 1 | 2;
const START: Step[] = [2, 0, 1];

const copy = {
  en: {
    steps: ["Boil the water", "Add the noodles", "Wait 3 minutes"],
    solved: "Right order — dinner’s ready!",
    up: "Move “{item}” up",
    down: "Move “{item}” down",
    moved: "“{item}” is now step {n}",
  },
  th: {
    steps: ["ต้มน้ำให้เดือด", "ใส่เส้นบะหมี่", "รอ 3 นาที"],
    solved: "เรียงถูกแล้ว ได้เวลากิน!",
    up: "เลื่อน “{item}” ขึ้น",
    down: "เลื่อน “{item}” ลง",
    moved: "“{item}” อยู่ขั้นที่ {n} แล้ว",
  },
  zh: {
    steps: ["把水烧开", "放入面饼", "等 3 分钟"],
    solved: "顺序正确——开饭啦！",
    up: "将“{item}”上移",
    down: "将“{item}”下移",
    moved: "“{item}”现在是第 {n} 步",
  },
  ja: {
    steps: ["お湯を沸かす", "麺を入れる", "3 分待つ"],
    solved: "正しい順番！いただきます",
    up: "「{item}」を上へ",
    down: "「{item}」を下へ",
    moved: "「{item}」は {n} 番目になりました",
  },
};

export default function DragAndDropPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [order, setOrder] = useState<Step[]>(START);
  const [dragging, setDragging] = useState<Step | null>(null);
  const [offset, setOffset] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const drag = useRef<{ id: Step; startY: number; rowH: number; startIndex: number; moved: boolean } | null>(null);
  const solved = order.join() === "0,1,2";

  const move = (id: Step, to: number) => {
    const from = order.indexOf(id);
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, id);
    setOrder(next);
    setAnnouncement(format(t.moved, { item: t.steps[id], n: to + 1 }));
  };

  const end = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragging(null);
    setOffset(0);
    if (d.moved) experience();
  };

  return (
    <div className="flex size-full flex-col justify-center gap-2">
      <ol className="flex flex-col gap-1.5">
        {order.map((id, i) => {
          const isDragging = dragging === id;
          return (
            <li
              key={id}
              style={isDragging ? { transform: `translateY(${offset}px) scale(1.02)`, zIndex: 10 } : undefined}
              className={cn(
                "relative flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border bg-surface pr-1 pl-0.5 transition-[box-shadow,border-color,background-color]",
                isDragging ? "border-accent shadow-lg" : "border-line-strong shadow-xs",
                solved && "border-success/50 bg-success-soft",
              )}
            >
              <span
                role="presentation"
                onPointerDown={(e) => {
                  const row = e.currentTarget.closest("li");
                  if (!row) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = { id, startY: e.clientY, rowH: row.getBoundingClientRect().height + 6, startIndex: order.indexOf(id), moved: false };
                  setDragging(id);
                  setOffset(0);
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d) return;
                  const dy = e.clientY - d.startY;
                  if (Math.abs(dy) > 6) d.moved = true;
                  const target = Math.max(0, Math.min(order.length - 1, d.startIndex + Math.round(dy / d.rowH)));
                  setOffset(dy - (target - d.startIndex) * d.rowH);
                  if (order.indexOf(d.id) !== target) move(d.id, target);
                }}
                onPointerUp={end}
                onPointerCancel={end}
                className={cn(
                  "flex h-9 w-7 shrink-0 touch-none items-center justify-center rounded-[6px] text-ink-2",
                  isDragging ? "cursor-grabbing bg-accent-soft text-accent-ink" : "cursor-grab hover:bg-surface-2",
                )}
              >
                <GripVertical className="size-4" aria-hidden />
              </span>
              <span className="tabular w-4 text-center text-[0.75rem] text-ink-2">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-ink">{t.steps[id]}</span>
              <button
                type="button"
                onClick={() => {
                  move(id, i - 1);
                  experience();
                }}
                disabled={i === 0}
                aria-label={format(t.up, { item: t.steps[id] })}
                className="inline-flex size-7 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  move(id, i + 1);
                  experience();
                }}
                disabled={i === order.length - 1}
                aria-label={format(t.down, { item: t.steps[id] })}
                className="inline-flex size-7 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" aria-hidden />
              </button>
            </li>
          );
        })}
      </ol>
      <p className="min-h-4 text-center text-[0.75rem] font-medium text-success">
        {solved ? <span className="animate-fade-up inline-block">✓ {t.solved}</span> : null}
      </p>
      <p className="sr-only" aria-live="assertive">
        {announcement}
      </p>
    </div>
  );
}
