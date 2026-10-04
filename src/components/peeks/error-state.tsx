"use client";

import { useId, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs } from "./kit";

type Version = "a" | "b";

const copy = {
  en: {
    a: "A · Vague",
    b: "B · Helpful",
    versions: "Choose a version",
    label: "Mobile number",
    send: "Send code",
    bad: "Error: invalid input.",
    wiped: "…and it wiped what you typed.",
    good: "Enter a 10-digit number, like 081 234 5678.",
    ok: "Code sent ✓",
  },
  th: {
    a: "A · กำกวม",
    b: "B · ช่วยได้จริง",
    versions: "เลือกแบบ",
    label: "เบอร์มือถือ",
    send: "ส่งรหัส",
    bad: "ข้อผิดพลาด: ข้อมูลไม่ถูกต้อง",
    wiped: "…แถมลบที่พิมพ์ไปหมดเลย",
    good: "ใส่เบอร์ 10 หลัก เช่น 081 234 5678",
    ok: "ส่งรหัสแล้ว ✓",
  },
  zh: {
    a: "A · 含糊",
    b: "B · 有帮助",
    versions: "选择版本",
    label: "手机号码",
    send: "发送验证码",
    bad: "错误：输入无效。",
    wiped: "……还把你输入的全清空了。",
    good: "请输入 10 位号码，例如 081 234 5678。",
    ok: "验证码已发送 ✓",
  },
  ja: {
    a: "A · あいまい",
    b: "B · 親切",
    versions: "案を選ぶ",
    label: "携帯電話番号",
    send: "コードを送信",
    bad: "エラー：入力が無効です。",
    wiped: "…しかも入力が消えた。",
    good: "10 桁の番号を入力してください（例：081 234 5678）。",
    ok: "コードを送信しました ✓",
  },
};

type Result = "bad" | "good" | "ok" | null;

export default function ErrorStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState<Version>("a");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [wiped, setWiped] = useState(false);
  const [errored, setErrored] = useState<Partial<Record<Version, boolean>>>({});
  const showError = result === "bad" || result === "good";

  const submit = () => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 10) {
      setResult("ok");
      setWiped(false);
      if (version === "b") experience();
      return;
    }
    const next = { ...errored, [version]: true };
    setErrored(next);
    if (next.a && next.b) experience();
    if (version === "a") {
      setResult("bad");
      setWiped(value.length > 0);
      setValue("");
    } else {
      setResult("good");
      setWiped(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <MiniTabs
        label={t.versions}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setResult(null);
          setWiped(false);
        }}
        options={[
          { value: "a", label: t.a },
          { value: "b", label: t.b },
        ]}
      />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex w-full max-w-[18rem] flex-col gap-1 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-2.5"
      >
        <label htmlFor={`${id}-tel`} className="text-[0.75rem] font-medium text-ink">
          {t.label}
        </label>
        <div className="flex gap-1.5">
          <input
            ref={inputRef}
            id={`${id}-tel`}
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            aria-invalid={showError || undefined}
            aria-describedby={showError ? `${id}-err` : undefined}
            onChange={(e) => setValue(e.target.value)}
            placeholder="081 234 5678"
            className={cn(
              "h-8 min-w-0 flex-1 rounded-[6px] border bg-surface px-2.5 text-[0.8125rem] text-ink outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-accent/25",
              result === "good" ? "border-error" : "border-line-input focus:border-accent",
            )}
          />
          <button type="submit" className="h-8 shrink-0 rounded-full bg-accent px-3 text-[0.75rem] font-semibold text-on-accent hover:bg-accent-hover">
            {t.send}
          </button>
        </div>
        <p
          id={`${id}-err`}
          aria-live="polite"
          data-intentionally-flawed={result === "bad" || undefined}
          className={cn(
            "min-h-8 text-[0.6875rem] leading-snug",
            result === "ok" ? "font-semibold text-success" : result === "good" ? "text-error" : "text-[#e0675e]",
          )}
        >
          {result === "good" ? (
            <span className="flex items-start gap-1">
              <CircleAlert className="mt-px size-3 shrink-0" aria-hidden /> {t.good}
            </span>
          ) : result === "bad" ? (
            <>
              {t.bad} {wiped ? <span className="text-ink-2">{t.wiped}</span> : null}
            </>
          ) : result === "ok" ? (
            t.ok
          ) : null}
        </p>
      </form>
    </div>
  );
}
