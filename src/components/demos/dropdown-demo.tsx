"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const SIZES = ["S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

const copy = {
  en: {
    a: "A · Dropdown",
    b: "B · Radio buttons",
    size: "T-shirt size",
    choose: "Choose a size",
    clicks: "{n} clicks",
    click: "1 click",
    result: "With only four options, radio buttons win: every choice is visible and it takes one click. Dropdowns earn their place around 5–15 options, or when space is tight.",
  },
  th: {
    a: "A · Dropdown",
    b: "B · Radio button",
    size: "ไซซ์เสื้อยืด",
    choose: "เลือกไซซ์",
    clicks: "{n} คลิก",
    click: "1 คลิก",
    result: "เมื่อมีแค่ 4 ตัวเลือก Radio button ชนะ: เห็นทุกตัวเลือกและใช้คลิกเดียว Dropdown คุ้มค่าเมื่อมีราว 5–15 ตัวเลือก หรือเมื่อพื้นที่จำกัด",
  },
  zh: {
    a: "A · 下拉菜单",
    b: "B · 单选按钮",
    size: "T 恤尺码",
    choose: "选择尺码",
    clicks: "{n} 次点击",
    click: "1 次点击",
    result: "只有四个选项时，单选按钮更胜一筹：所有选项一目了然，一次点击即可。下拉菜单适合 5–15 个选项，或空间紧张的时候。",
  },
  ja: {
    a: "A · ドロップダウン",
    b: "B · ラジオボタン",
    size: "T シャツのサイズ",
    choose: "サイズを選択",
    clicks: "{n} クリック",
    click: "1 クリック",
    result: "選択肢が 4 つだけなら、ラジオボタンの勝ちです。すべてが見えていて、1 クリックで済みます。ドロップダウンが活きるのは 5〜15 個程度のときや、スペースが限られるときです。",
  },
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
      <span id={`${id}-label`} className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">{label}</span>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => {
          onClick();
          setActive(value ? SIZES.indexOf(value) : 0);
          setOpen((o) => !o);
        }}
        className="flex h-11 w-full items-center justify-between rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-left text-[0.9375rem] hover:border-ink-2"
      >
        <span id={`${id}-value`} className={value ? "text-ink" : "text-ink-2"}>{value ?? placeholder}</span>
        <ChevronDown className={cn("size-4 text-ink-2 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(SIZES.length - 1, a + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
            if (e.key === "Home") { e.preventDefault(); setActive(0); }
            if (e.key === "End") { e.preventDefault(); setActive(SIZES.length - 1); }
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); select(SIZES[active]); }
            if (e.key === "Escape" || e.key === "Tab") { setOpen(false); buttonRef.current?.focus(); }
          }}
          onBlur={(e) => {
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setOpen(false);
          }}
          className="animate-pop absolute inset-x-0 top-full z-20 mt-1 rounded-[var(--radius-sm)] border border-line bg-surface p-1 shadow-lg outline-none"
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
              className={cn(
                "flex h-10 cursor-pointer items-center justify-between rounded-[6px] px-3 text-[0.9375rem]",
                i === active ? "bg-accent-soft text-ink" : "text-ink",
              )}
            >
              {s}
              {value === s ? <Check className="size-4 text-accent" aria-hidden /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function DropdownDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [a, setA] = useState<Size | null>(null);
  const [aClicks, setAClicks] = useState(0);
  const [b, setB] = useState<Size | null>(null);
  const [bClicks, setBClicks] = useState(0);
  const name = useId();

  useEffect(() => {
    if (a && b) experience();
  }, [a, b, experience]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
          <p className="type-label mb-3">{t.a}</p>
          <Listbox value={a} onChange={setA} onClick={() => setAClicks((c) => c + 1)} label={t.size} placeholder={t.choose} />
          <p className="tabular mt-3 text-[0.8125rem] text-ink-2">{aClicks === 1 ? t.click : t.clicks.replace("{n}", String(aClicks))}</p>
        </div>
        <fieldset className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
          <legend className="sr-only">{t.size}</legend>
          <p className="type-label mb-3" aria-hidden>{t.b}</p>
          <span className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2" aria-hidden>{t.size}</span>
          <div className="grid grid-cols-4 gap-1.5">
            {SIZES.map((s) => (
              <label
                key={s}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border text-[0.9375rem] font-semibold transition-colors",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                  b === s ? "border-accent bg-accent text-on-accent" : "border-line-input text-ink hover:border-ink-2",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={s}
                  checked={b === s}
                  onChange={() => setB(s)}
                  onClick={() => setBClicks((c) => c + 1)}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
          <p className="tabular mt-3 text-[0.8125rem] text-ink-2">{bClicks === 1 ? t.click : t.clicks.replace("{n}", String(bClicks))}</p>
        </fieldset>
      </div>
      {a && b ? <p className="animate-fade-up mt-5 text-center text-[0.875rem] text-ink-2">{t.result}</p> : null}
    </div>
  );
}
