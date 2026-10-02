"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Mode = "blank" | "spinner" | "skeleton";
const LOAD_MS = 2400;

const copy = {
  en: {
    modes: { blank: "Blank", spinner: "Spinner", skeleton: "Skeleton" } as Record<Mode, string>,
    modeLabel: "Loading style",
    load: "Load the feed",
    reload: "Load again",
    loading: "Loading…",
    feed: [
      { title: "Night markets reopen along the river", meta: "Bangkok · 5 min read" },
      { title: "Why every button needs six states", meta: "Design · 3 min read" },
      { title: "A beginner’s guide to colour contrast", meta: "Accessibility · 4 min read" },
    ],
    same: "Every style waited exactly {s} seconds.",
    ask: "Which wait felt shortest? Skeletons usually feel fastest because they show what’s coming.",
  },
  th: {
    modes: { blank: "หน้าว่าง", spinner: "Spinner", skeleton: "Skeleton" },
    modeLabel: "รูปแบบการโหลด",
    load: "โหลดฟีด",
    reload: "โหลดอีกครั้ง",
    loading: "กำลังโหลด…",
    feed: [
      { title: "ตลาดนัดริมแม่น้ำกลับมาเปิดอีกครั้ง", meta: "กรุงเทพฯ · อ่าน 5 นาที" },
      { title: "ทำไมทุกปุ่มต้องมีหกสถานะ", meta: "ดีไซน์ · อ่าน 3 นาที" },
      { title: "คู่มือคอนทราสต์สีสำหรับมือใหม่", meta: "Accessibility · อ่าน 4 นาที" },
    ],
    same: "ทุกรูปแบบรอเท่ากัน {s} วินาทีพอดี",
    ask: "แบบไหนรู้สึกว่ารอสั้นที่สุด? Skeleton มักรู้สึกเร็วที่สุด เพราะมันบอกล่วงหน้าว่ากำลังจะได้เห็นอะไร",
  },
  zh: {
    modes: { blank: "空白", spinner: "加载动画", skeleton: "骨架屏" },
    modeLabel: "加载方式",
    load: "加载信息流",
    reload: "再加载一次",
    loading: "加载中…",
    feed: [
      { title: "河畔夜市重新开放", meta: "曼谷 · 阅读 5 分钟" },
      { title: "为什么每个按钮都需要六种状态", meta: "设计 · 阅读 3 分钟" },
      { title: "色彩对比度入门指南", meta: "无障碍 · 阅读 4 分钟" },
    ],
    same: "每种方式都正好等待了 {s} 秒。",
    ask: "哪一次等待感觉最短？骨架屏通常感觉最快，因为它预告了即将出现的内容。",
  },
  ja: {
    modes: { blank: "空白", spinner: "スピナー", skeleton: "スケルトン" },
    modeLabel: "読み込みの表示",
    load: "フィードを読み込む",
    reload: "もう一度読み込む",
    loading: "読み込み中…",
    feed: [
      { title: "川沿いのナイトマーケットが再開", meta: "バンコク · 5 分で読めます" },
      { title: "どのボタンにも 6 つの状態が必要な理由", meta: "デザイン · 3 分で読めます" },
      { title: "初心者のための色のコントラスト入門", meta: "アクセシビリティ · 4 分で読めます" },
    ],
    same: "どの表示も、ちょうど {s} 秒待ちました。",
    ask: "いちばん短く感じたのはどれ？ スケルトンは、次に何が出るかを見せるので、たいてい最も速く感じられます。",
  },
};

export default function LoadingStateDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [mode, setMode] = useState<Mode>("spinner");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [tried, setTried] = useState<Mode[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const load = () => {
    setPhase("loading");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase("done");
      setTried((t) => (t.includes(mode) ? t : [...t, mode]));
      experience();
    }, LOAD_MS);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <SegmentedControl<Mode>
        label={t.modeLabel}
        value={mode}
        onChange={(m) => {
          setMode(m);
          setPhase("idle");
        }}
        options={(["blank", "spinner", "skeleton"] as Mode[]).map((m) => ({
          value: m,
          label: `${t.modes[m]}${tried.includes(m) ? " ✓" : ""}`,
        }))}
      />

      <div className="w-full overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface" aria-busy={phase === "loading"}>
        <div className="flex h-11 items-center justify-between border-b border-line px-4 text-sm font-semibold text-ink">
          <span>ThaiUX News</span>
          {phase === "loading" && mode !== "blank" ? <span className="sr-only">{t.loading}</span> : null}
        </div>
        <div className="relative min-h-60 p-4">
          {phase === "done" ? (
            <ul className="animate-fade-up space-y-4">
              {t.feed.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="size-14 shrink-0 rounded-[var(--radius-sm)] bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-3))]" aria-hidden />
                  <span>
                    <span className="block font-medium text-ink">{item.title}</span>
                    <span className="block text-[0.8125rem] text-ink-2">{item.meta}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : phase === "loading" ? (
            mode === "spinner" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-2">
                <Spinner className="size-7 text-accent" />
                <span className="text-[0.8125rem]">{t.loading}</span>
              </div>
            ) : mode === "skeleton" ? (
              <ul className="space-y-4" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex animate-pulse gap-3">
                    <span className="size-14 shrink-0 rounded-[var(--radius-sm)] bg-surface-3" />
                    <span className="flex flex-1 flex-col justify-center gap-2">
                      <span className={cn("h-3 rounded bg-surface-3", i === 1 ? "w-4/5" : "w-11/12")} />
                      <span className="h-2.5 w-2/5 rounded bg-surface-3" />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={load}
                className="h-11 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-hover"
              >
                {t.load}
              </button>
            </div>
          )}
        </div>
      </div>

      {phase === "done" ? (
        <button type="button" onClick={load} className="h-10 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface">
          {t.reload}
        </button>
      ) : null}

      <p className="min-h-10 text-center text-[0.875rem] text-ink-2" aria-live="polite">
        {tried.length >= 2 ? (
          <>
            {t.same.replace("{s}", String(LOAD_MS / 1000))} {t.ask}
          </>
        ) : null}
      </p>
    </div>
  );
}
