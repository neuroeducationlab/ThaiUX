"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type StepId = "research" | "define" | "design" | "prototype" | "test";
const CORRECT: StepId[] = ["research", "define", "design", "prototype", "test"];
const START: StepId[] = ["design", "research", "test", "define", "prototype"];

const copy = {
  en: {
    steps: { research: "Research", define: "Define", design: "Design", prototype: "Prototype", test: "Test" } as Record<StepId, string>,
    up: "Move {item} up",
    down: "Move {item} down",
    moved: "{item} moved to position {n} of 5",
    correct: "Correct order! Research → Define → Design → Prototype → Test. (In real projects the loop repeats.)",
    hint: "Grab the ⋮⋮ handle to drag — or use the arrows. Both are first-class.",
  },
  th: {
    steps: { research: "วิจัย", define: "ระบุปัญหา", design: "ออกแบบ", prototype: "ทำต้นแบบ", test: "ทดสอบ" } as Record<StepId, string>,
    up: "เลื่อน {item} ขึ้น",
    down: "เลื่อน {item} ลง",
    moved: "ย้าย {item} ไปลำดับที่ {n} จาก 5",
    correct: "ถูกต้อง! วิจัย → ระบุปัญหา → ออกแบบ → ทำต้นแบบ → ทดสอบ (ในงานจริง วงจรนี้จะวนซ้ำ)",
    hint: "จับที่จุด ⋮⋮ เพื่อลาก หรือใช้ปุ่มลูกศรก็ได้ ทั้งสองวิธีสำคัญเท่ากัน",
  },
  zh: {
    steps: { research: "研究", define: "定义", design: "设计", prototype: "原型", test: "测试" } as Record<StepId, string>,
    up: "将{item}上移",
    down: "将{item}下移",
    moved: "{item}已移到第 {n} 位（共 5 位）",
    correct: "顺序正确！研究 → 定义 → 设计 → 原型 → 测试。（在真实项目中，这个循环会不断重复。）",
    hint: "按住 ⋮⋮ 把手拖动——或使用箭头按钮。两种方式同样重要。",
  },
  ja: {
    steps: { research: "リサーチ", define: "定義", design: "デザイン", prototype: "プロトタイプ", test: "テスト" } as Record<StepId, string>,
    up: "{item}を上へ移動",
    down: "{item}を下へ移動",
    moved: "{item}を 5 つ中 {n} 番目に移動しました",
    correct: "正解！ リサーチ → 定義 → デザイン → プロトタイプ → テスト。（実際のプロジェクトでは、このループを繰り返します。）",
    hint: "⋮⋮ のハンドルをつかんでドラッグ。矢印ボタンでも操作できます。どちらも同じくらい大切です。",
  },
};

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

export default function DragDropDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [order, setOrder] = useState<StepId[]>(START);
  const [dragging, setDragging] = useState<StepId | null>(null);
  const [offset, setOffset] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const listRef = useRef<HTMLOListElement>(null);
  const drag = useRef<{ id: StepId; startY: number; rowH: number; startIndex: number; moved: boolean } | null>(null);

  const solved = order.join() === CORRECT.join();

  const move = (id: StepId, to: number) => {
    const from = order.indexOf(id);
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, id);
    setOrder(next);
    setAnnouncement(fill(t.moved, { item: t.steps[id], n: to + 1 }));
  };

  const onPointerDown = (e: React.PointerEvent, id: StepId) => {
    const row = (e.currentTarget as HTMLElement).closest("li");
    if (!row) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, startY: e.clientY, rowH: row.getBoundingClientRect().height + 8, startIndex: order.indexOf(id), moved: false };
    setDragging(id);
    setOffset(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 6) d.moved = true;
    const steps = Math.round(dy / d.rowH);
    const target = Math.max(0, Math.min(order.length - 1, d.startIndex + steps));
    setOffset(dy - (target - d.startIndex) * d.rowH);
    if (order.indexOf(d.id) !== target) move(d.id, target);
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragging(null);
    setOffset(0);
    if (d.moved) experience();
  };

  return (
    <div className="mx-auto max-w-md">
      <ol ref={listRef} className="flex flex-col gap-2">
        {order.map((id, i) => {
          const isDragging = dragging === id;
          return (
            <li
              key={id}
              style={isDragging ? { transform: `translateY(${offset}px) scale(1.02)`, zIndex: 10 } : undefined}
              className={cn(
                "relative flex items-center gap-2 rounded-[var(--radius-md)] border bg-surface p-1.5 pr-2 transition-[box-shadow,border-color,background-color]",
                isDragging ? "border-accent shadow-lg" : "border-line-strong shadow-xs",
                solved && "border-success/50 bg-success-soft",
              )}
            >
              <span
                role="presentation"
                onPointerDown={(e) => onPointerDown(e, id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={cn(
                  "flex h-11 w-9 shrink-0 touch-none items-center justify-center rounded-[var(--radius-sm)] text-ink-2",
                  isDragging ? "cursor-grabbing bg-accent-soft text-accent-ink" : "cursor-grab hover:bg-surface-2",
                )}
              >
                <GripVertical className="size-5" aria-hidden />
              </span>
              <span className="tabular w-5 text-center text-[0.8125rem] text-ink-2">{i + 1}</span>
              <span className="flex-1 font-medium text-ink">{t.steps[id]}</span>
              <button
                type="button"
                onClick={() => {
                  move(id, i - 1);
                  experience();
                }}
                disabled={i === 0}
                aria-label={fill(t.up, { item: t.steps[id] })}
                className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  move(id, i + 1);
                  experience();
                }}
                disabled={i === order.length - 1}
                aria-label={fill(t.down, { item: t.steps[id] })}
                className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-30"
              >
                <ArrowDown className="size-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ol>
      <p className={cn("mt-4 text-center text-[0.875rem]", solved ? "animate-fade-up font-medium text-success" : "text-ink-2")}>
        {solved ? t.correct : t.hint}
      </p>
      <p className="sr-only" aria-live="assertive">
        {announcement}
      </p>
    </div>
  );
}
