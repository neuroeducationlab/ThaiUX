"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs, useTimers } from "./kit";

type Version = "a" | "b";

const copy = {
  en: {
    a: "A · Quick flash",
    b: "B · Full confirmation",
    versions: "Choose a version",
    to: "To Ploy S.",
    amount: "฿500",
    transfer: "Transfer",
    flash: "Success!",
    unsure: "Did it go through? Hard to tell.",
    done: "Transfer complete",
    when: "Today, 14:32 · Ref. 8K24",
    finish: "Done",
  },
  th: {
    a: "A · แวบเดียว",
    b: "B · ยืนยันครบ",
    versions: "เลือกแบบ",
    to: "ถึง พลอย ส.",
    amount: "฿500",
    transfer: "โอนเงิน",
    flash: "สำเร็จ!",
    unsure: "โอนไปแล้วจริงไหม? ไม่แน่ใจเลย",
    done: "โอนเงินสำเร็จ",
    when: "วันนี้ 14:32 · เลขอ้างอิง 8K24",
    finish: "เสร็จสิ้น",
  },
  zh: {
    a: "A · 一闪而过",
    b: "B · 完整确认",
    versions: "选择版本",
    to: "收款人 Ploy S.",
    amount: "฿500",
    transfer: "转账",
    flash: "成功！",
    unsure: "真的转过去了吗？说不准。",
    done: "转账成功",
    when: "今天 14:32 · 参考号 8K24",
    finish: "完成",
  },
  ja: {
    a: "A · 一瞬だけ",
    b: "B · しっかり確認",
    versions: "案を選ぶ",
    to: "Ploy S. さんへ",
    amount: "฿500",
    transfer: "送金する",
    flash: "成功！",
    unsure: "ちゃんと送れた？ よくわからない。",
    done: "送金が完了しました",
    when: "今日 14:32 · 参照番号 8K24",
    finish: "完了",
  },
};

export default function SuccessStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const later = useTimers();
  const [version, setVersion] = useState<Version>("a");
  const [flash, setFlash] = useState<"none" | "on" | "gone">("none");
  const [done, setDone] = useState(false);

  const transfer = () => {
    if (version === "a") {
      setFlash("on");
      later(() => setFlash("gone"), 900);
    } else {
      setDone(true);
      experience();
    }
  };

  return (
    <div className="flex size-full flex-col items-center gap-2">
      <MiniTabs
        label={t.versions}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setFlash("none");
          setDone(false);
        }}
        options={[
          { value: "a", label: t.a },
          { value: "b", label: t.b },
        ]}
      />
      <div className="relative flex min-h-0 w-full max-w-[18rem] flex-1 flex-col justify-center rounded-[var(--radius-md)] border border-line-strong bg-surface p-3" aria-live="polite">
        {version === "b" && done ? (
          <div className="animate-fade-up flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <span className="animate-pop flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white dark:text-[#06210f]">
                <Check className="size-4" strokeWidth={3} aria-hidden />
              </span>
              <div className="min-w-0 leading-snug">
                <p className="text-[0.875rem] font-semibold text-ink">{t.done}</p>
                <p className="text-[0.75rem] text-ink-2">
                  {t.amount} · {t.to}
                </p>
                <p className="tabular text-[0.6875rem] text-ink-2">{t.when}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="h-7 self-end rounded-full border border-line-strong px-3 text-[0.75rem] font-semibold text-ink hover:bg-surface-2"
            >
              {t.finish}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[0.75rem] text-ink-2">{t.to}</p>
                <p className="tabular text-[1.375rem] leading-tight font-semibold text-ink">{t.amount}</p>
              </div>
              <button type="button" onClick={transfer} className="h-9 shrink-0 rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-on-accent hover:bg-accent-hover">
                {t.transfer}
              </button>
            </div>
            <p className="mt-2 min-h-4 text-[0.75rem] text-warning">{flash === "gone" ? t.unsure : null}</p>
            {flash === "on" ? (
              <span className="animate-pop absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[0.75rem] font-semibold text-bg shadow-md">
                {t.flash}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
