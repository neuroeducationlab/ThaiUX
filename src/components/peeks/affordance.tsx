"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Id = "button" | "link" | "bold" | "badge";
const ITEMS: { id: Id; real: boolean }[] = [
  { id: "button", real: true },
  { id: "bold", real: false },
  { id: "badge", real: false },
  { id: "link", real: true },
];

const copy = {
  en: {
    labels: { button: "Book now", link: "Read the terms", bold: "Free cancellation", badge: "Best price" } as Record<Id, string>,
    why: { button: "fill + shape", link: "underline", bold: "just bold", badge: "fake button" } as Record<Id, string>,
    yes: "Clickable",
    no: "Not clickable",
    ask: "“{item}”: clickable? Reveal",
    score: "Signifiers decide what people try.",
  },
  th: {
    labels: { button: "จองเลย", link: "อ่านเงื่อนไข", bold: "ยกเลิกฟรี", badge: "ราคาดีที่สุด" },
    why: { button: "มีพื้น มีรูปทรง", link: "มีเส้นใต้", bold: "แค่ตัวหนา", badge: "ปุ่มปลอม" },
    yes: "กดได้",
    no: "กดไม่ได้",
    ask: "“{item}” กดได้ไหม? เฉลย",
    score: "สัญญาณบนหน้าจอเป็นตัวตัดสินว่าคนจะลองกดอะไร",
  },
  zh: {
    labels: { button: "立即预订", link: "阅读条款", bold: "免费取消", badge: "最低价" },
    why: { button: "有填充和形状", link: "有下划线", bold: "只是加粗", badge: "假按钮" },
    yes: "可点击",
    no: "不可点击",
    ask: "“{item}”能点吗？揭晓",
    score: "意符决定了人们会去点什么。",
  },
  ja: {
    labels: { button: "今すぐ予約", link: "規約を読む", bold: "無料キャンセル", badge: "最安値" },
    why: { button: "塗りと形", link: "下線", bold: "太字だけ", badge: "ニセのボタン" },
    yes: "押せる",
    no: "押せない",
    ask: "「{item}」は押せる？答えを見る",
    score: "人が何を押すかは、シグニファイアで決まる。",
  },
};

function Visual({ id, label }: { id: Id; label: string }) {
  switch (id) {
    case "button":
      return <span className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-on-accent shadow-sm">{label}</span>;
    case "link":
      return <span className="text-[0.8125rem] font-medium text-accent-ink underline decoration-2 underline-offset-4">{label}</span>;
    case "bold":
      return <span className="text-[0.8125rem] font-bold text-ink">{label}</span>;
    default:
      return <span className="inline-flex h-7 items-center rounded-[6px] bg-success-soft px-2.5 text-[0.75rem] font-semibold text-success">{label}</span>;
  }
}

export default function AffordancePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [shown, setShown] = useState<Id[]>([]);
  const all = shown.length === ITEMS.length;

  useEffect(() => {
    if (shown.length >= 2) experience();
  }, [shown.length, experience]);

  return (
    <div className="flex size-full flex-col justify-center gap-2">
      <ul className="grid grid-cols-2 gap-1.5">
        {ITEMS.map(({ id, real }) => {
          const open = shown.includes(id);
          return (
            <li key={id}>
              <button
                type="button"
                aria-label={format(t.ask, { item: t.labels[id] })}
                aria-pressed={open}
                onClick={() => setShown((s) => (s.includes(id) ? s : [...s, id]))}
                className={cn(
                  "flex h-[4.25rem] w-full flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] border bg-surface px-1.5 transition-colors",
                  open ? (real ? "border-success/50" : "border-error/40") : "border-line hover:border-line-strong",
                )}
              >
                <span aria-hidden>
                  <Visual id={id} label={t.labels[id]} />
                </span>
                <span aria-live="polite" className="flex flex-col items-center text-[0.6875rem] leading-tight">
                  {open ? (
                    <>
                      <span className={cn("inline-flex items-center gap-0.5 font-semibold", real ? "text-success" : "text-error")}>
                        {real ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
                        {real ? t.yes : t.no}
                      </span>
                      <span className="text-ink-2">{t.why[id]}</span>
                    </>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="min-h-4 text-center text-[0.75rem] font-medium text-ink">{all ? <span className="animate-fade-up inline-block">{t.score}</span> : null}</p>
    </div>
  );
}
