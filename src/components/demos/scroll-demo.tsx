"use client";

import { useRef, useState } from "react";
import { ArrowUp, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    title: "What a street-food stall teaches about UX",
    paras: [
      "A good street-food stall in Bangkok is a masterclass in user experience — and nobody calls it that.",
      "The menu is a row of photos. You don’t need to read or remember anything: you point. That’s recognition over recall.",
      "Everything you need is in reach. The vendor arranges sauces, bowls and bags in the order they’re used, so every move is short. That’s Fitts’s Law with a wok.",
      "The queue tells you how long you’ll wait, and the sizzle tells you your order is in progress. That’s visibility of system status.",
      "When something goes wrong — they’re out of pork — the vendor suggests chicken right away. A good error message offers a way forward.",
      "And when you come back next week, nothing has moved. Consistency means you never have to learn the stall twice.",
      "You reached the end. Notice how the progress bar told you how far you’d come — and the fade at the bottom told you there was more.",
    ],
    progress: "Reading progress",
    end: "You reached the end",
    top: "Back to top",
  },
  th: {
    title: "รถเข็นสตรีทฟู้ดสอนอะไรเราเรื่อง UX",
    paras: [
      "รถเข็นสตรีทฟู้ดดี ๆ ในกรุงเทพฯ คือมาสเตอร์คลาสด้าน UX ที่ไม่มีใครเรียกมันแบบนั้น",
      "เมนูเป็นแถวรูปภาพ คุณไม่ต้องอ่านหรือจำอะไรเลย แค่ชี้ นี่คือ Recognition over recall (จำได้จากการเห็น ดีกว่าต้องนึกเอง)",
      "ทุกอย่างอยู่ในระยะเอื้อม แม่ค้าวางซอส ชาม และถุงตามลำดับที่ใช้ ทุกการขยับจึงสั้นที่สุด นี่คือกฎของ Fitts ฉบับกระทะเหล็ก",
      "คิวบอกว่าต้องรอนานแค่ไหน เสียงฉ่าบอกว่าอาหารของคุณกำลังทำอยู่ นี่คือ Visibility of system status",
      "เมื่อมีปัญหา เช่น หมูหมด แม่ค้าเสนอไก่แทนทันที ข้อความแจ้งข้อผิดพลาดที่ดีต้องพาไปต่อได้",
      "และเมื่อคุณกลับมาสัปดาห์หน้า ทุกอย่างยังอยู่ที่เดิม ความสม่ำเสมอทำให้คุณไม่ต้องเรียนรู้ร้านนี้ใหม่อีกเลย",
      "คุณอ่านถึงท้ายแล้ว สังเกตไหมว่าแถบความคืบหน้าบอกว่าคุณมาไกลแค่ไหน และขอบจาง ๆ ด้านล่างบอกว่ายังมีต่อ",
    ],
    progress: "ความคืบหน้าการอ่าน",
    end: "อ่านจบแล้ว",
    top: "กลับขึ้นด้านบน",
  },
  zh: {
    title: "街边小吃摊教会我们的 UX",
    paras: [
      "曼谷一个好的街边小吃摊，就是一堂用户体验大师课——只是没人这么称呼它。",
      "菜单是一排照片。你不需要读，也不需要记，只要指一指。这就是“识别优于回忆”。",
      "需要的东西都在手边。摊主按使用顺序摆放酱料、碗和袋子，每个动作都很短。这就是炒锅版的费茨定律。",
      "排队的人数告诉你要等多久，锅里的滋滋声告诉你订单正在制作中。这就是系统状态可见。",
      "当出了问题——猪肉卖完了——摊主马上建议换成鸡肉。好的错误提示会给出下一步。",
      "下周你再来，一切都还在原来的位置。一致性意味着你永远不用重新学习这个摊位。",
      "你读到了最后。注意到了吗？进度条告诉你读了多少，而底部的渐隐告诉你下面还有内容。",
    ],
    progress: "阅读进度",
    end: "已读到最后",
    top: "回到顶部",
  },
  ja: {
    title: "屋台が教えてくれる UX",
    paras: [
      "バンコクの良い屋台は、UX のマスタークラスです。誰もそう呼ばないだけで。",
      "メニューは写真の列。読む必要も、覚える必要もありません。指させばいい。これが「再生より再認」です。",
      "必要なものはすべて手の届く範囲に。店主はソース、器、袋を使う順に並べ、どの動きも最短に。中華鍋版のフィッツの法則です。",
      "行列は待ち時間を、ジュージューという音は注文が調理中であることを教えてくれます。これが「システム状態の可視化」。",
      "問題が起きたとき、たとえば豚肉が売り切れたら、店主はすぐに鶏肉を勧めてくれます。良いエラーメッセージは、次の一手を示します。",
      "そして翌週また来ても、何も動いていません。一貫性があるから、この屋台を覚え直す必要はないのです。",
      "最後まで読みましたね。進捗バーがどこまで来たかを、下のフェードがまだ続きがあることを教えてくれていたのに気づきましたか？",
    ],
    progress: "読書の進捗",
    end: "最後まで読みました",
    top: "上に戻る",
  },
};

export default function ScrollDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const boxRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? Math.min(1, el.scrollTop / max) : 1;
    setPct(p);
    if (p > 0.97) experience();
  };

  const atEnd = pct > 0.97;

  return (
    <div className="mx-auto max-w-lg">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface shadow-sm">
        <div
          role="progressbar"
          aria-label={t.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct * 100)}
          className="h-1 bg-surface-3"
        >
          <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${pct * 100}%` }} />
        </div>
        <div className="relative">
          <div
            ref={boxRef}
            onScroll={onScroll}
            tabIndex={0}
            aria-label={t.title}
            className="h-72 overflow-y-auto overscroll-contain px-5 py-5"
          >
            <h3 className="type-title mb-3">{t.title}</h3>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-2">
              {t.paras.map((p, i) => (
                <p key={i} className={i === t.paras.length - 1 ? "font-medium text-ink" : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <div className="h-6" />
          </div>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent transition-opacity duration-300",
              atEnd && "opacity-0",
            )}
          />
        </div>
      </div>
      <div className="mt-3 flex h-9 items-center justify-between text-[0.8125rem]">
        <span className={cn("inline-flex items-center gap-1.5", atEnd ? "font-semibold text-success" : "tabular text-ink-2")}>
          {atEnd ? (
            <>
              <Check className="size-4" aria-hidden /> {t.end}
            </>
          ) : (
            `${Math.round(pct * 100)}%`
          )}
        </span>
        {pct > 0.4 ? (
          <button
            type="button"
            onClick={() => boxRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="animate-fade-up inline-flex h-9 items-center gap-1 rounded-full px-3 font-medium text-accent-ink hover:bg-surface"
          >
            <ArrowUp className="size-4" aria-hidden /> {t.top}
          </button>
        ) : null}
      </div>
    </div>
  );
}
