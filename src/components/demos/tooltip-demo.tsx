"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bold, Italic, Link2, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    toolbar: "Text formatting",
    bold: "Bold",
    italic: "Italic",
    link: "Add link",
    undo: "Undo",
    showLabels: "Show text labels",
    showLabelsDesc: "The touch-friendly alternative",
    note: "Tooltips appear on hover and on keyboard focus, stay while you move onto them, and close with Esc. On phones there’s no hover — visible labels work everywhere.",
  },
  th: {
    toolbar: "จัดรูปแบบข้อความ",
    bold: "ตัวหนา",
    italic: "ตัวเอียง",
    link: "เพิ่มลิงก์",
    undo: "เลิกทำ",
    showLabels: "แสดงป้ายข้อความ",
    showLabelsDesc: "ทางเลือกที่เหมาะกับจอสัมผัส",
    note: "ทูลทิปแสดงทั้งตอนชี้เมาส์และตอนโฟกัสด้วยคีย์บอร์ด ไม่หายเมื่อเลื่อนเมาส์ไปบนมัน และปิดได้ด้วย Esc บนมือถือไม่มี Hover ป้ายข้อความที่มองเห็นได้จึงใช้ได้ทุกที่",
  },
  zh: {
    toolbar: "文本格式",
    bold: "加粗",
    italic: "斜体",
    link: "添加链接",
    undo: "撤销",
    showLabels: "显示文字标签",
    showLabelsDesc: "适合触屏的替代方式",
    note: "工具提示在悬停和键盘聚焦时都会出现，移到提示上时不会消失，按 Esc 即可关闭。手机没有悬停——可见的文字标签在任何地方都有效。",
  },
  ja: {
    toolbar: "テキストの書式",
    bold: "太字",
    italic: "斜体",
    link: "リンクを追加",
    undo: "元に戻す",
    showLabels: "テキストラベルを表示",
    showLabelsDesc: "タッチ操作に向いた代替手段",
    note: "ツールチップはホバーでもキーボードフォーカスでも表示され、ポインターを重ねても消えず、Esc で閉じます。スマホにはホバーがないので、見えるラベルならどこでも機能します。",
  },
};

function TipButton({ icon: Icon, label, showLabel, onShown }: { icon: LucideIcon; label: string; showLabel: boolean; onShown: () => void }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    onShown();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onShown]);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = (delay = 120) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), delay);
  };

  return (
    <span className="relative inline-flex" onPointerEnter={(e) => e.pointerType === "mouse" && show(350)} onPointerLeave={() => hide()}>
      <button
        type="button"
        aria-label={showLabel ? undefined : label}
        aria-describedby={open && !showLabel ? id : undefined}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(0)}
        onBlur={() => hide(0)}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink",
          showLabel ? "px-3 text-[0.8125rem] font-medium" : "w-10",
        )}
      >
        <Icon className="size-[1.125rem]" aria-hidden />
        {showLabel ? label : null}
      </button>
      {open && !showLabel ? (
        <span
          id={id}
          role="tooltip"
          className="animate-pop absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-[6px] bg-ink px-2.5 py-1.5 text-[0.75rem] font-medium whitespace-nowrap text-bg shadow-md"
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}

export default function TooltipDemo() {
  const t = useCopy(copy);
  const { experience, experienced } = useDemo();
  const [labels, setLabels] = useState(false);

  const tools = [
    { icon: Bold, label: t.bold },
    { icon: Italic, label: t.italic },
    { icon: Link2, label: t.link },
    { icon: Undo2, label: t.undo },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <div
        role="toolbar"
        aria-label={t.toolbar}
        className="flex flex-wrap items-center justify-center gap-1 rounded-[var(--radius-md)] border border-line-strong bg-surface p-1.5 shadow-sm"
      >
        {tools.map((tool) => (
          <TipButton key={tool.label} icon={tool.icon} label={tool.label} showLabel={labels} onShown={experience} />
        ))}
      </div>
      <div className="h-6" />
      <div className="w-full rounded-[var(--radius-md)] bg-surface px-4 py-3">
        <Switch
          label={t.showLabels}
          description={t.showLabelsDesc}
          checked={labels}
          onChange={(v) => {
            setLabels(v);
            if (v) experience();
          }}
        />
      </div>
      {experienced ? <p className="animate-fade-up text-center text-[0.875rem] text-ink-2">{t.note}</p> : null}
    </div>
  );
}
