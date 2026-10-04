"use client";

import { useEffect, useId, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    a: "A · Placeholder only",
    b: "B · Label + helper text",
    placeholderA: "Email address",
    label: "Email address",
    placeholderB: "name@example.com",
    helper: "We’ll send your receipt here.",
    gone: "A · The hint vanished. What was this for?",
  },
  th: {
    a: "A · ใช้ placeholder อย่างเดียว",
    b: "B · มีป้ายกำกับ + คำอธิบาย",
    placeholderA: "อีเมล",
    label: "อีเมล",
    placeholderB: "name@example.com",
    helper: "เราจะส่งใบเสร็จไปที่นี่",
    gone: "A · คำใบ้หายไปแล้ว ช่องนี้ให้กรอกอะไรนะ?",
  },
  zh: {
    a: "A · 只有占位文字",
    b: "B · 标签 + 说明文字",
    placeholderA: "电子邮箱",
    label: "电子邮箱",
    placeholderB: "name@example.com",
    helper: "收据会发到这里。",
    gone: "A · 提示消失了。这一栏要填什么？",
  },
  ja: {
    a: "A · プレースホルダーのみ",
    b: "B · ラベル + 補足テキスト",
    placeholderA: "メールアドレス",
    label: "メールアドレス",
    placeholderB: "name@example.com",
    helper: "領収書をこちらに送ります。",
    gone: "A · ヒントが消えた。何を入れる欄だっけ？",
  },
};

const field =
  "h-9 w-full rounded-[6px] border border-line-input bg-surface px-2.5 text-[0.875rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25";

export default function InputFieldPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const id = useId();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const both = a.length > 1 && b.length > 1;

  useEffect(() => {
    if (both) experience();
  }, [both, experience]);

  return (
    <div className="flex size-full flex-col justify-center gap-2">
      <div>
        <p className={cn("mb-0.5 truncate text-[0.6875rem] font-semibold", a ? "text-warning" : "text-ink-2")} aria-hidden>
          {a ? t.gone : t.a}
        </p>
        <input
          type="email"
          inputMode="email"
          autoComplete="off"
          aria-label={t.placeholderA}
          placeholder={t.placeholderA}
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <p className="mb-0.5 truncate text-[0.6875rem] font-semibold text-ink-2" aria-hidden>
          {t.b}
        </p>
        <label htmlFor={`${id}-b`} className="mb-0.5 block text-[0.75rem] font-medium text-ink">
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
          className={field}
        />
        <p id={`${id}-help`} className="mt-1 flex items-center gap-1 text-[0.6875rem] text-ink-2">
          <Info className="size-3" aria-hidden /> {t.helper}
        </p>
      </div>
    </div>
  );
}
