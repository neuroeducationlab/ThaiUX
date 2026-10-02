"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/button";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    a: "A · No feedback",
    b: "B · With feedback",
    message: "See you at 7 at the night market!",
    send: "Send",
    sending: "Sending…",
    sent: "Sent",
    pressedA: "You pressed {n}× — and sent the message {n} times.",
    calm: "One press. Pressed → sending → sent ✓. No doubt, no duplicates.",
  },
  th: {
    a: "A · ไม่มี Feedback",
    b: "B · มี Feedback",
    message: "เจอกันหนึ่งทุ่มที่ตลาดนัดนะ!",
    send: "ส่ง",
    sending: "กำลังส่ง…",
    sent: "ส่งแล้ว",
    pressedA: "คุณกดไป {n} ครั้ง และข้อความถูกส่งซ้ำ {n} ครั้ง",
    calm: "กดครั้งเดียว: กด → กำลังส่ง → ส่งแล้ว ✓ ไม่ต้องสงสัย ไม่มีข้อความซ้ำ",
  },
  zh: {
    a: "A · 没有反馈",
    b: "B · 有反馈",
    message: "晚上 7 点夜市见！",
    send: "发送",
    sending: "发送中…",
    sent: "已发送",
    pressedA: "你按了 {n} 次——消息也被发送了 {n} 次。",
    calm: "只按一次。按下 → 发送中 → 已发送 ✓。没有疑虑，没有重复。",
  },
  ja: {
    a: "A · フィードバックなし",
    b: "B · フィードバックあり",
    message: "7 時にナイトマーケットで会おうね！",
    send: "送信",
    sending: "送信中…",
    sent: "送信済み",
    pressedA: "{n} 回押して、メッセージが {n} 回送られました。",
    calm: "押すのは 1 回だけ。押す → 送信中 → 送信済み ✓。迷いも重複もありません。",
  },
};

const DELAY = 1600;

export default function FeedbackDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [aPresses, setAPresses] = useState(0);
  const [aSent, setASent] = useState(0);
  const [bState, setBState] = useState<"idle" | "sending" | "sent">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const doneA = aSent > 0;
  const doneB = bState === "sent";

  useEffect(() => {
    if (doneA && doneB) experience();
  }, [doneA, doneB, experience]);

  return (
    <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
      {/* A — silent */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
        <p className="type-label mb-3">{t.a}</p>
        <div className="flex min-h-28 flex-1 flex-col items-end gap-1.5">
          {Array.from({ length: aSent }).map((_, i) => (
            <span key={i} className="rounded-2xl rounded-br-md bg-surface-3 px-3 py-2 text-[0.8125rem] text-ink">
              {t.message}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex-1 truncate rounded-full border border-line px-3 py-2 text-[0.8125rem] text-ink-2">{t.message}</span>
          <button
            type="button"
            aria-label={t.send}
            onClick={() => {
              setAPresses((n) => n + 1);
              later(() => setASent((n) => n + 1), DELAY);
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-ink"
            style={{ transform: "none" }}
          >
            <Send className="size-4" aria-hidden />
          </button>
        </div>
        <p className="mt-3 min-h-10 text-[0.8125rem] text-warning" aria-live="polite">
          {aSent > 1 ? t.pressedA.replaceAll("{n}", String(aSent)) : aPresses > 1 ? "…?" : ""}
        </p>
      </div>

      {/* B — clear feedback */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4">
        <p className="type-label mb-3">{t.b}</p>
        <div className="flex min-h-28 flex-1 flex-col items-end gap-1">
          {bState !== "idle" ? (
            <>
              <span
                className={cn(
                  "animate-fade-up rounded-2xl rounded-br-md px-3 py-2 text-[0.8125rem] transition-colors",
                  bState === "sent" ? "bg-accent text-on-accent" : "bg-accent/60 text-on-accent",
                )}
              >
                {t.message}
              </span>
              <span className="flex items-center gap-1 text-[0.6875rem] text-ink-2">
                {bState === "sent" ? (
                  <>
                    <CheckCheck className="size-3.5 text-accent" aria-hidden /> {t.sent}
                  </>
                ) : (
                  <>
                    <Spinner className="size-3" /> {t.sending}
                  </>
                )}
              </span>
            </>
          ) : null}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex-1 truncate rounded-full border border-line px-3 py-2 text-[0.8125rem] text-ink-2">{t.message}</span>
          <button
            type="button"
            aria-label={t.send}
            disabled={bState !== "idle"}
            aria-busy={bState === "sending"}
            onClick={() => {
              setBState("sending");
              later(() => setBState("sent"), DELAY);
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-sm transition-transform hover:bg-accent-hover active:scale-90 disabled:opacity-100"
          >
            {bState === "sending" ? <Spinner /> : bState === "sent" ? <Check className="animate-pop size-4" aria-hidden /> : <Send className="size-4" aria-hidden />}
          </button>
        </div>
        <p className="mt-3 min-h-10 text-[0.8125rem] text-success" aria-live="polite">
          {bState === "sent" ? t.calm : ""}
        </p>
      </div>
    </div>
  );
}
