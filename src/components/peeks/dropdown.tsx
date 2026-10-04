"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const SIZES = ["S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

const copy = {
  en: { a: "A · Dropdown", b: "B · Radio buttons", size: "T-shirt size", choose: "Choose a size", clicks: "{n} clicks", click: "1 click", result: "Only 4 options? Radio buttons win." },
  th: { a: "A · Dropdown", b: "B · Radio button", size: "ไซซ์เสื้อ", choose: "เลือกไซซ์", clicks: "{n} คลิก", click: "1 คลิก", result: "มีแค่ 4 ตัวเลือก Radio button ชนะ" },
  zh: { a: "A · 下拉菜单", b: "B · 单选按钮", size: "T 恤尺码", choose: "选择尺码", clicks: "{n} 次点击", click: "1 次点击", result: "只有 4 个选项？单选按钮胜出。" },
  ja: { a: "A · ドロップダウン", b: "B · ラジオボタン", size: "T シャツのサイズ", choose: "サイズを選択", clicks: "{n} クリック", click: "1 クリック", result: "選択肢が 4 つならラジオボタンの勝ち。" },
};

function Listbox({ value, onChange, onClick, label, placeholder }: {
  value: Size | null;
  onChange: (s: Size) => void;
  onClick: () => void;
  label: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const select = (s: Size) => {
    onChange(s);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value ?? placeholder}`}
        onClick={() => {
          onClick();
          setActive(value ? SIZES.indexOf(value) : 0);
          setOpen((o) => !o);
        }}
        className="flex h-9 w-full items-center justify-between rounded-[6px] border border-line-input bg-surface px-2.5 text-left text-[0.875rem] hover:border-ink-2"
      >
        <span className={value ? "text-ink" : "text-ink-2"}>{value ?? placeholder}</span>
        <ChevronDown className={cn("size-4 text-ink-2 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(SIZES.length - 1, a + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
            if (e.key === "Home") { e.preventDefault(); setActive(0); }
            if (e.key === "End") { e.preventDefault(); setActive(SIZES.length - 1); }
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); select(SIZES[active]); }
            if (e.key === "Escape" || e.key === "Tab") {
              // Escape closes the list, not the whole card
              if (e.key === "Escape") e.preventDefault();
              setOpen(false);
              buttonRef.current?.focus();
            }
          }}
          onBlur={(e) => {
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setOpen(false);
          }}
          className="animate-pop absolute inset-x-0 top-full z-20 mt-1 rounded-[6px] border border-line bg-surface p-0.5 shadow-lg outline-none"
        >
          {SIZES.map((s, i) => (
            <li
              key={s}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={value === s}
              onMouseMove={() => setActive(i)}
              onClick={() => {
                onClick();
                select(s);
              }}
              className={cn("flex h-6 cursor-pointer items-center justify-between rounded-[4px] px-2.5 text-[0.8125rem] text-ink", i === active && "bg-accent-soft")}
            >
              {s}
              {value === s ? <Check className="size-3.5 text-accent" aria-hidden /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function DropdownPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const name = useId();
  const [a, setA] = useState<Size | null>(null);
  const [aClicks, setAClicks] = useState(0);
  const [b, setB] = useState<Size | null>(null);
  const [bClicks, setBClicks] = useState(0);
  const count = (n: number) => (n === 1 ? t.click : format(t.clicks, { n }));

  useEffect(() => {
    if (a && b) experience();
  }, [a, b, experience]);

  return (
    <div className="flex size-full flex-col justify-center gap-2">
      <div>
        <p className="mb-1 flex items-baseline justify-between gap-2 text-[0.6875rem] font-semibold text-ink-2">
          <span className="truncate">{t.a}</span>
          <span className="tabular shrink-0 font-normal">{count(aClicks)}</span>
        </p>
        <Listbox value={a} onChange={setA} onClick={() => setAClicks((c) => c + 1)} label={t.size} placeholder={t.choose} />
      </div>
      <fieldset>
        <legend className="sr-only">{t.size}</legend>
        <p className="mb-1 flex items-baseline justify-between gap-2 text-[0.6875rem] font-semibold text-ink-2" aria-hidden>
          <span className="truncate">{t.b}</span>
          <span className="tabular shrink-0 font-normal">{count(bClicks)}</span>
        </p>
        <div className="grid grid-cols-4 gap-1">
          {SIZES.map((s) => (
            <label
              key={s}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-center rounded-[6px] border text-[0.8125rem] font-semibold transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                b === s ? "border-accent bg-accent text-on-accent" : "border-line-input bg-surface text-ink hover:border-ink-2",
              )}
            >
              <input type="radio" name={name} value={s} checked={b === s} onChange={() => setB(s)} onClick={() => setBClicks((c) => c + 1)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="min-h-4 text-center text-[0.75rem] font-medium text-ink">
        {a && b ? <span className="animate-fade-up inline-block">{t.result}</span> : null}
      </p>
    </div>
  );
}
