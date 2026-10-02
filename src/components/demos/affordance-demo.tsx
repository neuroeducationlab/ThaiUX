"use client";

import { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Item = { id: string; real: boolean };
const ITEMS: Item[] = [
  { id: "button", real: true },
  { id: "link", real: true },
  { id: "bold", real: false },
  { id: "fakeButton", real: false },
  { id: "ghost", real: true },
  { id: "chip", real: true },
];

const copy = {
  en: {
    labels: {
      button: "Book now",
      link: "Read the terms",
      bold: "Free cancellation",
      fakeButton: "Best price",
      ghost: "edit",
      chip: "Filters",
    } as Record<string, string>,
    notes: {
      button: "Clickable — fill, shape and contrast say “press me”.",
      link: "Clickable — underline and colour are a decades-old signifier.",
      bold: "Not clickable — just emphasis. Bold alone doesn’t signal interaction.",
      fakeButton: "Not clickable — it’s a badge styled like a button. A false signifier.",
      ghost: "Clickable — but it looks like plain text. A hidden affordance.",
      chip: "Clickable — the chevron hints that something opens.",
    } as Record<string, string>,
    pick: "Tap what you think is clickable",
    reveal: "Reveal",
    tryAgain: "Guess again",
    score: "You read {n} of 6 correctly.",
    yes: "Clickable",
    no: "Not clickable",
    yourGuess: "your guess",
    hotel: "Riverside Hotel · Chiang Mai",
    price: "from ฿1,850 / night",
  },
  th: {
    labels: {
      button: "จองเลย",
      link: "อ่านเงื่อนไข",
      bold: "ยกเลิกฟรี",
      fakeButton: "ราคาดีที่สุด",
      ghost: "แก้ไข",
      chip: "ตัวกรอง",
    },
    notes: {
      button: "กดได้ พื้นหลัง รูปทรง และคอนทราสต์บอกว่า “กดฉันสิ”",
      link: "กดได้ เส้นใต้และสีเป็นสัญญาณที่คนคุ้นเคยมาหลายสิบปี",
      bold: "กดไม่ได้ เป็นแค่การเน้นข้อความ ตัวหนาอย่างเดียวไม่ได้บอกว่ากดได้",
      fakeButton: "กดไม่ได้ เป็นป้ายที่ทำหน้าตาเหมือนปุ่ม นี่คือสัญญาณหลอก",
      ghost: "กดได้ แต่ดูเหมือนข้อความธรรมดา นี่คือ Affordance ที่ถูกซ่อน",
      chip: "กดได้ ลูกศรบอกใบ้ว่ากดแล้วจะมีอะไรเปิดออกมา",
    },
    pick: "แตะสิ่งที่คุณคิดว่ากดได้",
    reveal: "เฉลย",
    tryAgain: "ลองเดาใหม่",
    score: "คุณอ่านถูก {n} จาก 6",
    yes: "กดได้",
    no: "กดไม่ได้",
    yourGuess: "ที่คุณเดา",
    hotel: "ริเวอร์ไซด์ โฮเทล · เชียงใหม่",
    price: "เริ่มต้น ฿1,850 / คืน",
  },
  zh: {
    labels: {
      button: "立即预订",
      link: "阅读条款",
      bold: "免费取消",
      fakeButton: "最低价",
      ghost: "编辑",
      chip: "筛选",
    },
    notes: {
      button: "可以点——填充色、形状和对比度都在说“按我”。",
      link: "可以点——下划线和颜色是用了几十年的意符。",
      bold: "不能点——只是强调。光是粗体并不代表可以交互。",
      fakeButton: "不能点——这是长得像按钮的标签。一个虚假的意符。",
      ghost: "可以点——但看起来像普通文字。一个被隐藏的示能。",
      chip: "可以点——箭头暗示会展开一些东西。",
    },
    pick: "点一下你认为可以点击的元素",
    reveal: "揭晓",
    tryAgain: "重新猜",
    score: "你判断对了 6 个中的 {n} 个。",
    yes: "可点击",
    no: "不可点击",
    yourGuess: "你的判断",
    hotel: "河畔酒店 · 清迈",
    price: "฿1,850 起 / 晚",
  },
  ja: {
    labels: {
      button: "今すぐ予約",
      link: "利用規約を読む",
      bold: "無料キャンセル",
      fakeButton: "最安値",
      ghost: "編集",
      chip: "絞り込み",
    },
    notes: {
      button: "押せる。塗り、形、コントラストが「押して」と伝えています。",
      link: "押せる。下線と色は、何十年も使われてきたシグニファイアです。",
      bold: "押せない。ただの強調です。太字だけでは操作できることは伝わりません。",
      fakeButton: "押せない。ボタン風のバッジです。偽のシグニファイア。",
      ghost: "押せる。でも普通のテキストに見えます。隠れたアフォーダンス。",
      chip: "押せる。矢印が、何かが開くことをほのめかしています。",
    },
    pick: "押せると思うものをタップしてください",
    reveal: "答えを見る",
    tryAgain: "もう一度",
    score: "6 つ中 {n} つ正しく読み取れました。",
    yes: "押せる",
    no: "押せない",
    yourGuess: "あなたの予想",
    hotel: "リバーサイドホテル · チェンマイ",
    price: "1 泊 ฿1,850〜",
  },
};

function Visual({ id, label }: { id: string; label: string }) {
  switch (id) {
    case "button":
      return <span className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent shadow-sm">{label}</span>;
    case "link":
      return <span className="text-[0.9375rem] font-medium text-accent-ink underline decoration-2 underline-offset-4">{label}</span>;
    case "bold":
      return <span className="text-[0.9375rem] font-bold text-ink">{label}</span>;
    case "fakeButton":
      return <span className="inline-flex h-8 items-center rounded-[var(--radius-sm)] bg-success-soft px-3 text-[0.8125rem] font-semibold text-success">{label}</span>;
    case "ghost":
      return <span className="text-[0.875rem] text-ink-2">{label}</span>;
    default:
      return (
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line-strong bg-surface px-3.5 text-[0.8125rem] font-medium text-ink">
          {label}
          <ChevronRight className="size-3.5" aria-hidden />
        </span>
      );
  }
}

export default function AffordanceDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [guess, setGuess] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState(false);

  const correct = ITEMS.filter((i) => !!guess[i.id] === i.real).length;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5 shadow-sm">
        <div className="mb-4">
          <p className="font-semibold text-ink">{t.hotel}</p>
          <p className="text-[0.8125rem] text-ink-2">{t.price}</p>
        </div>
        <p className="mb-3 text-[0.8125rem] font-medium text-ink-2">{revealed ? "" : t.pick}</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ITEMS.map((item) => {
            const picked = !!guess[item.id];
            const right = picked === item.real;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={picked}
                  disabled={revealed}
                  onClick={() => setGuess((g) => ({ ...g, [item.id]: !g[item.id] }))}
                  className={cn(
                    "relative flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed p-3 text-center transition-colors",
                    !revealed && (picked ? "border-accent bg-accent-soft/60" : "border-transparent bg-surface-2/70 hover:border-line-strong"),
                    revealed && (right ? "border-success/50 bg-success-soft/60" : "border-error/50 bg-error-soft/60"),
                  )}
                >
                  <Visual id={item.id} label={t.labels[item.id]} />
                  {revealed ? (
                    <span className={cn("inline-flex items-center gap-1 text-[0.75rem] font-semibold", item.real ? "text-success" : "text-ink-2")}>
                      {item.real ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
                      {item.real ? t.yes : t.no}
                    </span>
                  ) : picked ? (
                    <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-on-accent" aria-hidden>
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex flex-col items-center gap-4" aria-live="polite">
        {revealed ? (
          <>
            <p className="font-semibold text-ink">{t.score.replace("{n}", String(correct))}</p>
            <ul className="w-full space-y-2 text-[0.875rem]">
              {ITEMS.map((item) => (
                <li key={item.id} className="flex gap-2 text-ink-2">
                  <span className="font-semibold text-ink">{t.labels[item.id]}:</span>
                  <span>{t.notes[item.id]}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setRevealed(false);
                setGuess({});
              }}
              className="h-10 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface"
            >
              {t.tryAgain}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              experience();
            }}
            className="h-11 rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-90"
          >
            {t.reveal}
          </button>
        )}
      </div>
    </div>
  );
}
