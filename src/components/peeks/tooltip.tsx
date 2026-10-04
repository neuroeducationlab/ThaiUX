"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bold, Italic, Link2, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: { toolbar: "Text formatting", bold: "Bold", italic: "Italic", link: "Add link", undo: "Undo", labels: "Show text labels" },
  th: { toolbar: "จัดรูปแบบข้อความ", bold: "ตัวหนา", italic: "ตัวเอียง", link: "แทรกลิงก์", undo: "เลิกทำ", labels: "แสดงชื่อปุ่ม" },
  zh: { toolbar: "文本格式", bold: "加粗", italic: "斜体", link: "添加链接", undo: "撤销", labels: "显示文字标签" },
  ja: { toolbar: "テキストの書式", bold: "太字", italic: "斜体", link: "リンクを追加", undo: "元に戻す", labels: "ラベルを表示" },
};

function TipButton({ icon: Icon, label, showLabel, onShown }: { icon: LucideIcon; label: string; showLabel: boolean; onShown: () => void }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    onShown();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault(); // close the tooltip, not the whole card
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onShown]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = (delay = 120) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), delay);
  };

  return (
    <span className="relative inline-flex" onPointerEnter={(e) => e.pointerType === "mouse" && show(250)} onPointerLeave={() => hide()}>
      <button
        type="button"
        aria-label={showLabel ? undefined : label}
        aria-describedby={open && !showLabel ? id : undefined}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(0)}
        onBlur={() => hide(0)}
        className={cn(
          "inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink",
          showLabel ? "px-2.5 text-[0.75rem] font-medium" : "w-9",
        )}
      >
        <Icon className="size-4" aria-hidden />
        {showLabel ? label : null}
      </button>
      {open && !showLabel ? (
        <span
          id={id}
          role="tooltip"
          className="animate-pop absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-[6px] bg-ink px-2 py-1 text-[0.75rem] font-medium whitespace-nowrap text-bg shadow-md"
        >
          {label}
          <span aria-hidden className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-ink" />
        </span>
      ) : null}
    </span>
  );
}

export default function TooltipPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [labels, setLabels] = useState(false);
  const tools = [
    { icon: Bold, label: t.bold },
    { icon: Italic, label: t.italic },
    { icon: Link2, label: t.link },
    { icon: Undo2, label: t.undo },
  ];

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 pt-6">
      <div role="toolbar" aria-label={t.toolbar} className="flex flex-wrap items-center justify-center gap-0.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-1 shadow-sm">
        {tools.map((tool) => (
          <TipButton key={tool.label} icon={tool.icon} label={tool.label} showLabel={labels} onShown={experience} />
        ))}
      </div>
      <div className="w-full max-w-[16rem] rounded-[var(--radius-sm)] bg-surface px-3 py-1.5 text-[0.8125rem]">
        <Switch
          label={t.labels}
          checked={labels}
          onChange={(v) => {
            setLabels(v);
            if (v) experience();
          }}
        />
      </div>
    </div>
  );
}
