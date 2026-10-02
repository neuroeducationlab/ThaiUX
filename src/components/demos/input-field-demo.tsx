"use client";

import { useEffect, useId, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    a: "A · Placeholder as label",
    b: "B · Visible label + helper text",
    placeholderA: "Email address",
    label: "Email address",
    placeholderB: "name@example.com",
    helper: "We’ll send your receipt here.",
    review: "Now review: what did field A ask for? The hint vanished the moment you typed. Field B still tells you — and screen readers announce its label.",
  },
  th: {
    a: "A · ใช้ Placeholder เป็นป้าย",
    b: "B · ป้ายที่มองเห็น + ข้อความช่วยเหลือ",
    placeholderA: "อีเมล",
    label: "อีเมล",
    placeholderB: "name@example.com",
    helper: "เราจะส่งใบเสร็จไปที่อีเมลนี้",
    review: "ลองตรวจทาน: ช่อง A ถามอะไร? คำใบ้หายไปทันทีที่คุณเริ่มพิมพ์ ส่วนช่อง B ยังบอกอยู่ และโปรแกรมอ่านหน้าจอก็อ่านป้ายนั้นได้",
  },
  zh: {
    a: "A · 用占位文字当标签",
    b: "B · 可见标签 + 辅助说明",
    placeholderA: "电子邮箱",
    label: "电子邮箱",
    placeholderB: "name@example.com",
    helper: "我们会把收据发到这里。",
    review: "现在核对一下：A 框问的是什么？你一开始输入，提示就消失了。B 框依然告诉你答案——读屏软件也会读出它的标签。",
  },
  ja: {
    a: "A · プレースホルダーをラベル代わりに",
    b: "B · 見えるラベル ＋ 補足テキスト",
    placeholderA: "メールアドレス",
    label: "メールアドレス",
    placeholderB: "name@example.com",
    helper: "領収書をこちらにお送りします。",
    review: "見直してみましょう。A の欄は何を聞いていましたか？ 入力した瞬間にヒントは消えました。B は今も教えてくれます。スクリーンリーダーもラベルを読み上げます。",
  },
};

export default function InputFieldDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [blurred, setBlurred] = useState({ a: false, b: false });
  const id = useId();
  const done = a.length > 2 && b.length > 2 && blurred.a && blurred.b;

  useEffect(() => {
    if (done) experience();
  }, [done, experience]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
          <p className="type-label mb-4">{t.a}</p>
          <input
            type="email"
            inputMode="email"
            autoComplete="off"
            aria-label={t.placeholderA}
            placeholder={t.placeholderA}
            value={a}
            onChange={(e) => setA(e.target.value)}
            onBlur={() => setBlurred((s) => ({ ...s, a: true }))}
            className="h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-[0.9375rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          <p className={cn("mt-2 min-h-5 text-[0.8125rem] text-ink-3", done && "text-warning")} aria-hidden>
            {done ? "?" : ""}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
          <p className="type-label mb-4">{t.b}</p>
          <label htmlFor={`${id}-b`} className="mb-1.5 block text-[0.875rem] font-medium text-ink">
            {t.label}
          </label>
          <input
            id={`${id}-b`}
            type="email"
            inputMode="email"
            autoComplete="off"
            aria-describedby={`${id}-help`}
            placeholder={t.placeholderB}
            value={b}
            onChange={(e) => setB(e.target.value)}
            onBlur={() => setBlurred((s) => ({ ...s, b: true }))}
            className="h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-[0.9375rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          <p id={`${id}-help`} className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
            <Info className="size-3.5" aria-hidden /> {t.helper}
          </p>
        </div>
      </div>
      {done ? <p className="animate-fade-up mt-5 text-center text-[0.875rem] text-ink-2">{t.review}</p> : null}
    </div>
  );
}
