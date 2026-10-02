"use client";

import { useId, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Version = "silent" | "explained";

const copy = {
  en: {
    silent: "A · Disabled, silent",
    explained: "B · Enabled, explains",
    switchLabel: "Choose a version",
    title: "Book a cooking class",
    name: "Your name",
    date: "Date",
    pickDate: "Choose a date",
    dates: ["Sat 11 Oct", "Sun 12 Oct", "Sat 18 Oct"],
    confirm: "Confirm booking",
    requirement: "Add your name and a date to book.",
    missing: "To book, add: {fields}.",
    and: " and ",
    nothing: "You pressed — nothing happened. Why? There’s no clue.",
    booked: "Booked ✓",
  },
  th: {
    silent: "A · ปิดใช้งานแบบเงียบ",
    explained: "B · กดได้และอธิบาย",
    switchLabel: "เลือกแบบ",
    title: "จองคลาสสอนทำอาหาร",
    name: "ชื่อของคุณ",
    date: "วันที่",
    pickDate: "เลือกวันที่",
    dates: ["ส. 11 ต.ค.", "อา. 12 ต.ค.", "ส. 18 ต.ค."],
    confirm: "ยืนยันการจอง",
    requirement: "กรอกชื่อและเลือกวันที่เพื่อจอง",
    missing: "เพื่อจองคลาส กรุณาเพิ่ม: {fields}",
    and: " และ ",
    nothing: "คุณกดแล้ว แต่ไม่มีอะไรเกิดขึ้น ทำไมล่ะ? ไม่มีคำใบ้อะไรเลย",
    booked: "จองแล้ว ✓",
  },
  zh: {
    silent: "A · 禁用且无提示",
    explained: "B · 可点击并说明",
    switchLabel: "选择版本",
    title: "预约烹饪课",
    name: "你的姓名",
    date: "日期",
    pickDate: "选择日期",
    dates: ["10月11日 周六", "10月12日 周日", "10月18日 周六"],
    confirm: "确认预约",
    requirement: "填写姓名并选择日期即可预约。",
    missing: "预约前请补充：{fields}。",
    and: "和",
    nothing: "你按了——什么都没发生。为什么？没有任何线索。",
    booked: "已预约 ✓",
  },
  ja: {
    silent: "A · 無効で説明なし",
    explained: "B · 押せて、説明あり",
    switchLabel: "バージョンを選ぶ",
    title: "料理教室を予約",
    name: "お名前",
    date: "日付",
    pickDate: "日付を選択",
    dates: ["10/11（土）", "10/12（日）", "10/18（土）"],
    confirm: "予約を確定",
    requirement: "予約するには、お名前と日付を入力してください。",
    missing: "予約するには {fields} を入力してください。",
    and: "と",
    nothing: "押しましたが、何も起きません。なぜ？ 手がかりはありません。",
    booked: "予約しました ✓",
  },
};

export default function DisabledStateDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [version, setVersion] = useState<Version>("silent");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState<{ tone: "warn" | "ok"; text: string } | null>(null);
  const tried = useRef<Set<Version>>(new Set());
  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLSelectElement>(null);
  const id = useId();

  const complete = name.trim().length > 0 && date !== "";

  const markTried = () => {
    tried.current.add(version);
    if (tried.current.size >= 2) experience();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <SegmentedControl<Version>
        label={t.switchLabel}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setMsg(null);
        }}
        options={[
          { value: "silent", label: t.silent },
          { value: "explained", label: t.explained },
        ]}
      />
      <div className="w-full rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5 shadow-sm">
        <p className="type-title mb-4">{t.title}</p>
        <label htmlFor={`${id}-n`} className="mb-1.5 block text-[0.875rem] font-medium text-ink">{t.name}</label>
        <input
          ref={nameRef}
          id={`${id}-n`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          className="mb-3 h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <label htmlFor={`${id}-d`} className="mb-1.5 block text-[0.875rem] font-medium text-ink">{t.date}</label>
        <select
          ref={dateRef}
          id={`${id}-d`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        >
          <option value="">{t.pickDate}</option>
          {t.dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {version === "explained" ? (
          <p className="mt-3 text-[0.8125rem] text-ink-2">{t.requirement}</p>
        ) : null}

        {/* In version A the wrapper catches presses on the disabled button, so we can show the silence */}
        <div
          className="mt-4"
          onPointerDown={() => {
            if (version === "silent" && !complete) {
              setMsg({ tone: "warn", text: t.nothing });
              markTried();
            }
          }}
        >
          <button
            type="button"
            disabled={version === "silent" && !complete}
            onClick={() => {
              if (complete) {
                setMsg({ tone: "ok", text: t.booked });
                return;
              }
              const missing = [!name.trim() && t.name, !date && t.date].filter(Boolean).join(t.and);
              setMsg({ tone: "warn", text: t.missing.replace("{fields}", missing) });
              (!name.trim() ? nameRef : dateRef).current?.focus();
              markTried();
            }}
            className={cn(
              "h-12 w-full rounded-full text-[0.9375rem] font-semibold transition-colors",
              "bg-accent text-on-accent hover:bg-accent-hover disabled:pointer-events-none disabled:bg-surface-3 disabled:text-ink-3",
            )}
          >
            {t.confirm}
          </button>
        </div>
      </div>
      <p
        className={cn(
          "flex min-h-11 items-start gap-2 text-center text-[0.875rem]",
          msg?.tone === "ok" ? "font-semibold text-success" : "text-warning",
        )}
        aria-live="polite"
      >
        {msg && msg.tone === "warn" ? <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> : null}
        {msg?.text}
      </p>
    </div>
  );
}
