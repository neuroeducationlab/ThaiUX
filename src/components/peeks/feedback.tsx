"use client";

import { useState } from "react";
import { CheckCheck, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { Spinner } from "@/components/ui/button";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs, useTimers } from "./kit";

type Version = "a" | "b";
const DELAY = 1100;

const copy = {
  en: {
    a: "A · Silent",
    b: "B · With feedback",
    versions: "Choose a version",
    message: "See you at 7!",
    send: "Send",
    sending: "Sending…",
    sent: "Sent",
    dupes: "Sent {n} times — oops.",
    wait: "…did it work?",
  },
  th: {
    a: "A · เงียบ",
    b: "B · มีฟีดแบ็ก",
    versions: "เลือกแบบ",
    message: "เจอกันหนึ่งทุ่มนะ!",
    send: "ส่ง",
    sending: "กำลังส่ง…",
    sent: "ส่งแล้ว",
    dupes: "ส่งซ้ำไป {n} ครั้ง แย่แล้ว",
    wait: "…ส่งไปหรือยังนะ?",
  },
  zh: {
    a: "A · 无反馈",
    b: "B · 有反馈",
    versions: "选择版本",
    message: "七点见！",
    send: "发送",
    sending: "发送中…",
    sent: "已发送",
    dupes: "发了 {n} 次——糟糕。",
    wait: "……发出去了吗？",
  },
  ja: {
    a: "A · 反応なし",
    b: "B · フィードバックあり",
    versions: "案を選ぶ",
    message: "7 時に会おう！",
    send: "送信",
    sending: "送信中…",
    sent: "送信済み",
    dupes: "{n} 回も送っちゃった。",
    wait: "…送れた？",
  },
};

export default function FeedbackPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const later = useTimers();
  const [version, setVersion] = useState<Version>("a");
  const [aPresses, setAPresses] = useState(0);
  const [aSent, setASent] = useState(0);
  const [b, setB] = useState<"idle" | "sending" | "sent">("idle");

  const send = () => {
    if (version === "a") {
      setAPresses((n) => n + 1);
      later(() => setASent((n) => n + 1), DELAY);
    } else {
      setB("sending");
      later(() => {
        setB("sent");
        experience();
      }, DELAY);
    }
  };

  const bubbles = version === "a" ? aSent : b === "idle" ? 0 : 1;

  return (
    <div className="flex size-full flex-col items-center gap-2">
      <MiniTabs label={t.versions} value={version} onChange={setVersion} options={[{ value: "a", label: t.a }, { value: "b", label: t.b }]} />
      <div className="flex min-h-0 w-full max-w-[18rem] flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-line-strong bg-surface">
        <div className="flex min-h-0 flex-1 flex-col items-end justify-end gap-1 overflow-hidden px-2.5 py-2" aria-live="polite">
          {Array.from({ length: Math.min(bubbles, 3) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "animate-fade-up rounded-2xl rounded-br-md px-2.5 py-1 text-[0.75rem]",
                version === "a" ? "bg-surface-3 text-ink" : b === "sent" ? "bg-accent text-on-accent" : "bg-accent/60 text-on-accent",
              )}
            >
              {t.message}
            </span>
          ))}
          {version === "b" && b !== "idle" ? (
            <span className="flex items-center gap-1 text-[0.6875rem] text-ink-2">
              {b === "sent" ? (
                <>
                  <CheckCheck className="size-3.5 text-accent" aria-hidden /> {t.sent}
                </>
              ) : (
                <>
                  <Spinner className="size-3" /> {t.sending}
                </>
              )}
            </span>
          ) : null}
          {version === "a" ? (
            <span className="text-[0.6875rem] text-warning">
              {aSent > 1 ? format(t.dupes, { n: aSent }) : aPresses > aSent ? t.wait : ""}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5 border-t border-line p-1.5">
          <span className="min-w-0 flex-1 truncate rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-ink-2">{t.message}</span>
          {version === "a" ? (
            <button
              type="button"
              aria-label={t.send}
              onClick={send}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-ink"
            >
              <Send className="size-3.5" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              aria-label={t.send}
              aria-busy={b === "sending"}
              disabled={b !== "idle"}
              onClick={send}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-on-accent transition-[transform,background-color] active:scale-90",
                b === "sent" ? "bg-success" : "bg-accent hover:bg-accent-hover",
                b === "sending" && "opacity-70",
              )}
            >
              {b === "sending" ? <Spinner className="size-3.5" /> : b === "sent" ? <CheckCheck className="size-3.5" aria-hidden /> : <Send className="size-3.5" aria-hidden />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
