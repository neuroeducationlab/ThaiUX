"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs } from "./kit";

type Version = "a" | "b";

const copy = {
  en: {
    a: "A · Disabled",
    b: "B · Explains",
    versions: "Choose a version",
    name: "Your name",
    book: "Book the class",
    nothing: "You pressed — nothing happened. Why? No clue.",
    missing: "Add your name to book.",
    booked: "Booked ✓",
  },
  th: {
    a: "A · ปิดปุ่มเงียบ ๆ",
    b: "B · บอกเหตุผล",
    versions: "เลือกแบบ",
    name: "ชื่อของคุณ",
    book: "จองคลาส",
    nothing: "กดแล้วไม่มีอะไรเกิดขึ้น ทำไมล่ะ? ไม่มีใบ้เลย",
    missing: "ใส่ชื่อก่อนนะ ถึงจะจองได้",
    booked: "จองแล้ว ✓",
  },
  zh: {
    a: "A · 直接禁用",
    b: "B · 说明原因",
    versions: "选择版本",
    name: "你的名字",
    book: "预订课程",
    nothing: "按了没反应。为什么？毫无提示。",
    missing: "填写名字后才能预订。",
    booked: "已预订 ✓",
  },
  ja: {
    a: "A · 黙って無効",
    b: "B · 理由を伝える",
    versions: "案を選ぶ",
    name: "お名前",
    book: "クラスを予約",
    nothing: "押しても何も起きない。なぜ？ 手がかりなし。",
    missing: "予約するには名前を入力してください。",
    booked: "予約しました ✓",
  },
};

type Note = "nothing" | "missing" | "booked" | null;

export default function DisabledStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState<Version>("a");
  const [name, setName] = useState("");
  const [note, setNote] = useState<Note>(null);
  const [tried, setTried] = useState<Partial<Record<Version, boolean>>>({});
  const filled = name.trim().length > 0;
  const disabled = version === "a" && !filled;

  const mark = (v: Version) => {
    const next = { ...tried, [v]: true };
    setTried(next);
    if (next.a && next.b) experience();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <MiniTabs
        label={t.versions}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setNote(null);
        }}
        options={[
          { value: "a", label: t.a },
          { value: "b", label: t.b },
        ]}
      />
      <div className="flex w-full max-w-[18rem] flex-col gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-2.5">
        <label htmlFor={`${id}-name`} className="text-[0.75rem] font-medium text-ink">
          {t.name}
        </label>
        <input
          ref={inputRef}
          id={`${id}-name`}
          value={name}
          autoComplete="off"
          aria-invalid={note === "missing" || undefined}
          aria-describedby={note === "missing" ? `${id}-note` : undefined}
          onChange={(e) => {
            setName(e.target.value);
            if (note === "missing") setNote(null);
          }}
          className={cn(
            "h-8 w-full rounded-[6px] border bg-surface px-2.5 text-[0.8125rem] text-ink outline-none focus:ring-2 focus:ring-accent/25",
            note === "missing" ? "border-error" : "border-line-input focus:border-accent",
          )}
        />
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              mark(version);
              if (filled) setNote("booked");
              else {
                setNote("missing");
                inputRef.current?.focus();
              }
            }}
            className="h-8 w-full rounded-full bg-accent text-[0.8125rem] font-semibold text-on-accent transition-opacity disabled:opacity-40"
          >
            {t.book}
          </button>
          {disabled ? (
            // A disabled button swallows presses; this layer notices them so the demo can react
            <span
              aria-hidden
              className="absolute inset-0 cursor-not-allowed rounded-full"
              onPointerDown={() => {
                mark("a");
                setNote("nothing");
              }}
            />
          ) : null}
        </div>
      </div>
      <p
        id={`${id}-note`}
        aria-live="polite"
        className={cn(
          "min-h-4 max-w-[18rem] text-center text-[0.75rem] leading-snug font-medium",
          note === "booked" ? "text-success" : note === "missing" ? "text-error" : "text-warning",
        )}
      >
        {note ? <span className="animate-fade-up inline-block">{t[note]}</span> : null}
      </p>
    </div>
  );
}
