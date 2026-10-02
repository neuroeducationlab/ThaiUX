"use client";

import { useId, useRef, useState } from "react";
import { CircleAlert, CircleCheck, OctagonX } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/client";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Version = "bad" | "good";

/** Local mobile-number rules so the example feels real in every language. */
const RULES = {
  th: { digits: 10, example: "081 234 5678" },
  en: { digits: 11, example: "07700 900123" },
  zh: { digits: 11, example: "138 0013 8000" },
  ja: { digits: 11, example: "090 1234 5678" },
} as const;

const copy = {
  en: {
    bad: "A · Vague error",
    good: "B · Helpful error",
    switchLabel: "Choose a version",
    label: "Mobile number",
    submit: "Send code",
    badError: "Error: invalid input.",
    goodError: "Enter an {d}-digit mobile number, like {ex}.",
    ok: "Code sent ✓",
    cleared: "…and it wiped what you typed.",
  },
  th: {
    bad: "A · แจ้งผิดแบบกว้าง ๆ",
    good: "B · แจ้งผิดแบบช่วยแก้",
    switchLabel: "เลือกแบบ",
    label: "เบอร์มือถือ",
    submit: "ส่งรหัส",
    badError: "ข้อผิดพลาด: ข้อมูลไม่ถูกต้อง",
    goodError: "กรอกเบอร์มือถือ {d} หลัก เช่น {ex}",
    ok: "ส่งรหัสแล้ว ✓",
    cleared: "…และยังล้างข้อมูลที่คุณพิมพ์ไปด้วย",
  },
  zh: {
    bad: "A · 含糊的错误",
    good: "B · 有帮助的错误",
    switchLabel: "选择版本",
    label: "手机号",
    submit: "发送验证码",
    badError: "错误：输入无效。",
    goodError: "请输入 {d} 位手机号，例如 {ex}。",
    ok: "验证码已发送 ✓",
    cleared: "……而且还清空了你输入的内容。",
  },
  ja: {
    bad: "A · あいまいなエラー",
    good: "B · 役に立つエラー",
    switchLabel: "バージョンを選ぶ",
    label: "携帯電話番号",
    submit: "コードを送信",
    badError: "エラー：入力が正しくありません。",
    goodError: "{d} 桁の携帯番号を入力してください（例：{ex}）。",
    ok: "コードを送信しました ✓",
    cleared: "…しかも入力した内容が消えてしまいました。",
  },
};

export default function ErrorStateDemo() {
  const t = useCopy(copy);
  const { locale } = useI18n();
  const rule = RULES[locale];
  const { experience } = useDemo();
  const [version, setVersion] = useState<Version>("bad");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "ok">("idle");
  const [wiped, setWiped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const valid = value.replace(/\D/g, "").length === rule.digits;
  const goodMsg = t.goodError.replace("{d}", String(rule.digits)).replace("{ex}", rule.example);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid) {
      setStatus("ok");
      return;
    }
    setStatus("error");
    experience();
    if (version === "bad") {
      setValue("");
      setWiped(true);
    } else {
      inputRef.current?.focus();
    }
  };

  const showGood = version === "good" && status === "error";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <SegmentedControl<Version>
        label={t.switchLabel}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setStatus("idle");
          setWiped(false);
        }}
        options={[
          { value: "bad", label: t.bad },
          { value: "good", label: t.good },
        ]}
      />
      <form
        noValidate
        onSubmit={submit}
        data-intentionally-flawed={version === "bad" || undefined}
        className="w-full rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5 shadow-sm"
      >
        {version === "bad" && status === "error" ? (
          <div className="animate-shake mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[#d92d20] px-3 py-2 text-sm font-semibold text-white">
            <OctagonX className="size-4" aria-hidden /> {t.badError}
          </div>
        ) : null}
        <label htmlFor={`${id}-p`} className="mb-1.5 block text-[0.875rem] font-medium text-ink">
          {t.label}
        </label>
        <input
          ref={inputRef}
          id={`${id}-p`}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          value={value}
          placeholder={version === "good" ? rule.example : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (status === "ok") setStatus("idle");
          }}
          aria-invalid={showGood || undefined}
          aria-describedby={showGood ? `${id}-err` : undefined}
          className={cn(
            "h-11 w-full rounded-[var(--radius-sm)] border bg-surface px-3 text-ink outline-none placeholder:text-ink-2 focus:ring-2",
            showGood ? "border-error focus:ring-error/25" : "border-line-input focus:border-accent focus:ring-accent/25",
          )}
        />
        {showGood ? (
          <p id={`${id}-err`} className="animate-fade-up mt-2 flex items-start gap-1.5 text-[0.875rem] font-medium text-error">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {goodMsg}
          </p>
        ) : null}
        {version === "bad" && wiped && status === "error" ? (
          <p className="mt-2 text-[0.8125rem] text-ink-2">{t.cleared}</p>
        ) : null}
        <button type="submit" className="mt-4 h-11 w-full rounded-full bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover">
          {t.submit}
        </button>
        {status === "ok" ? (
          <p className="animate-fade-up mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-success" role="status">
            <CircleCheck className="size-4" aria-hidden /> {t.ok}
          </p>
        ) : null}
      </form>
    </div>
  );
}
