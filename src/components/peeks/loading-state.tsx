"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/button";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs, useTimers } from "./kit";

type Mode = "blank" | "spinner" | "skeleton";
const WAIT = 1500;

const copy = {
  en: {
    modes: { blank: "Blank", spinner: "Spinner", skeleton: "Skeleton" } as Record<Mode, string>,
    modeLabel: "Loading style",
    load: "Load the feed",
    loading: "Loading…",
    feed: [
      { title: "Night markets reopen", meta: "5 min read" },
      { title: "Why buttons need six states", meta: "3 min read" },
    ],
    same: "Same 1.5 s wait each time. Which felt shortest?",
  },
  th: {
    modes: { blank: "ว่างเปล่า", spinner: "วงหมุน", skeleton: "โครงร่าง" },
    modeLabel: "รูปแบบการโหลด",
    load: "โหลดฟีด",
    loading: "กำลังโหลด…",
    feed: [
      { title: "ตลาดนัดกลางคืนกลับมาแล้ว", meta: "อ่าน 5 นาที" },
      { title: "ทำไมปุ่มต้องมี 6 สถานะ", meta: "อ่าน 3 นาที" },
    ],
    same: "ทุกแบบรอเท่ากัน 1.5 วินาที แบบไหนรู้สึกเร็วสุด?",
  },
  zh: {
    modes: { blank: "空白", spinner: "转圈", skeleton: "骨架屏" },
    modeLabel: "加载样式",
    load: "加载动态",
    loading: "加载中…",
    feed: [
      { title: "夜市重新开张", meta: "阅读 5 分钟" },
      { title: "为什么按钮需要六种状态", meta: "阅读 3 分钟" },
    ],
    same: "每次都等了 1.5 秒。哪种感觉最快？",
  },
  ja: {
    modes: { blank: "空白", spinner: "スピナー", skeleton: "スケルトン" },
    modeLabel: "読み込みスタイル",
    load: "フィードを読み込む",
    loading: "読み込み中…",
    feed: [
      { title: "ナイトマーケットが再開", meta: "5 分で読めます" },
      { title: "ボタンに 6 つの状態が必要な理由", meta: "3 分で読めます" },
    ],
    same: "待ち時間はどれも 1.5 秒。一番短く感じたのは？",
  },
};

export default function LoadingStatePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const later = useTimers();
  const [mode, setMode] = useState<Mode>("blank");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [seen, setSeen] = useState<Mode[]>([]);

  const load = () => {
    setPhase("loading");
    later(() => {
      setPhase("done");
      setSeen((s) => (s.includes(mode) ? s : [...s, mode]));
    }, WAIT);
  };

  useEffect(() => {
    if (seen.length >= 2) experience();
  }, [seen.length, experience]);

  return (
    <div className="flex size-full flex-col items-center gap-2">
      <MiniTabs
        label={t.modeLabel}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setPhase("idle");
        }}
        options={(Object.keys(t.modes) as Mode[]).map((m) => ({ value: m, label: `${t.modes[m]}${seen.includes(m) ? " ✓" : ""}` }))}
      />
      <div className="flex min-h-0 w-full max-w-[18rem] flex-1 flex-col justify-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface p-2" aria-busy={phase === "loading"}>
        {phase === "idle" ? (
          <button type="button" onClick={load} className="mx-auto h-8 rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-on-accent hover:bg-accent-hover">
            {t.load}
          </button>
        ) : phase === "loading" ? (
          mode === "blank" ? (
            <span className="sr-only">{t.loading}</span>
          ) : mode === "spinner" ? (
            <span className="flex items-center justify-center gap-2 text-[0.75rem] text-ink-2">
              <Spinner className="size-5 text-accent" /> {t.loading}
            </span>
          ) : (
            <>
              <span className="sr-only">{t.loading}</span>
              {[0, 1].map((i) => (
                <span key={i} aria-hidden className="flex items-center gap-2">
                  <span className="size-8 shrink-0 animate-pulse rounded-[6px] bg-line-strong" />
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className={cn("h-2.5 animate-pulse rounded-full bg-line-strong", i ? "w-3/5" : "w-4/5")} />
                    <span className="h-2 w-2/5 animate-pulse rounded-full bg-line" />
                  </span>
                </span>
              ))}
            </>
          )
        ) : (
          t.feed.map((item, i) => (
            <span key={i} className="animate-fade-up flex items-center gap-2">
              <span aria-hidden className={cn("size-8 shrink-0 rounded-[6px]", i ? "bg-[linear-gradient(135deg,#9aa6ff,#3343c4)]" : "bg-[linear-gradient(135deg,#f6b13b,#e9876a)]")} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[0.8125rem] font-semibold text-ink">{item.title}</span>
                <span className="block text-[0.6875rem] text-ink-2">{item.meta}</span>
              </span>
            </span>
          ))
        )}
      </div>
      <p className="min-h-4 text-center text-[0.75rem] leading-tight text-ink-2" aria-live="polite">
        {seen.length >= 2 ? <span className="animate-fade-up inline-block">{t.same}</span> : null}
      </p>
    </div>
  );
}
