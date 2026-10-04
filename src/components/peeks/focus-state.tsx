"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    email: "Email",
    subscribe: "Subscribe",
    later: "Not now",
    hide: "Hide focus ring",
    focus: "Focus is on",
    none: "nothing yet",
    lost: "Can’t see where you are? That’s a missing focus state.",
  },
  th: {
    email: "อีเมล",
    subscribe: "สมัครรับข่าว",
    later: "ไว้ก่อน",
    hide: "ซ่อนวงโฟกัส",
    focus: "โฟกัสอยู่ที่",
    none: "ยังไม่มี",
    lost: "มองไม่เห็นว่าอยู่ตรงไหน? นี่แหละผลของการไม่มี Focus state",
  },
  zh: {
    email: "邮箱",
    subscribe: "订阅",
    later: "以后再说",
    hide: "隐藏焦点框",
    focus: "焦点在",
    none: "还没有",
    lost: "看不出自己在哪？这就是缺少焦点状态。",
  },
  ja: {
    email: "メール",
    subscribe: "登録する",
    later: "あとで",
    hide: "フォーカスリングを隠す",
    focus: "フォーカス",
    none: "まだなし",
    lost: "今どこにいるか見えない？ それがフォーカス状態のない世界。",
  },
};

export default function FocusStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [hidden, setHidden] = useState(false);
  const [where, setWhere] = useState<string | null>(null);

  return (
    <div
      className="flex size-full flex-col justify-center gap-2"
      onFocus={(e) => {
        const name = (e.target as HTMLElement).dataset.name;
        setWhere(name ?? null);
        if (name && (e.target as HTMLElement).matches(":focus-visible")) experience();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setWhere(null);
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        data-intentionally-flawed={hidden || undefined}
        className={cn(
          "flex flex-col gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-2",
          hidden && "[&_*]:!outline-none [&_*]:!ring-0",
        )}
      >
        <input
          type="email"
          data-name={t.email}
          aria-label={t.email}
          placeholder={t.email}
          autoComplete="off"
          className="h-8 w-full rounded-[6px] border border-line-input bg-surface px-2.5 text-[0.8125rem] text-ink placeholder:text-ink-2 focus:border-accent"
        />
        <div className="flex gap-1.5">
          <button type="submit" data-name={t.subscribe} className="h-8 flex-1 rounded-full bg-accent text-[0.8125rem] font-semibold text-on-accent">
            {t.subscribe}
          </button>
          <button type="button" data-name={t.later} className="h-8 flex-1 rounded-full border border-line-strong text-[0.8125rem] font-semibold text-ink">
            {t.later}
          </button>
        </div>
      </form>
      <div className="rounded-[var(--radius-sm)] bg-surface px-2.5 py-1 text-[0.8125rem]">
        <Switch label={t.hide} checked={hidden} onChange={setHidden} />
      </div>
      <p aria-hidden className={cn("min-h-4 text-center font-mono text-[0.6875rem]", hidden && where ? "text-warning" : "text-ink-2")}>
        {hidden && where ? (
          t.lost
        ) : (
          <>
            {t.focus}: <span className="font-semibold text-ink">{where ?? t.none}</span>
          </>
        )}
      </p>
    </div>
  );
}
