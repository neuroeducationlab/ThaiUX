"use client";

import { useState } from "react";
import { SegmentedControl, Switch } from "@/components/ui/controls";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Mode = "flat" | "hierarchy";

const copy = {
  en: {
    flat: "Flat",
    hierarchy: "Hierarchy",
    modeLabel: "Layout",
    squint: "Squint test",
    squintDesc: "Blur the card — what still stands out?",
    eyebrow: "Payday deal",
    title: "40% off every coffee",
    body: "Valid at all branches until Sunday. One drink per person per day. Not valid with other offers.",
    cta: "Get the code",
    flatVerdict: "Everything is the same size and weight, so with the blur nothing stands out — not even the button.",
    hierVerdict: "Even blurred, you can see the offer and find the button. Scale, weight, colour and spacing did that.",
  },
  th: {
    flat: "เท่ากันหมด",
    hierarchy: "มีลำดับชั้น",
    modeLabel: "เลย์เอาต์",
    squint: "Squint test",
    squintDesc: "ทำให้การ์ดเบลอ อะไรที่ยังเด่นอยู่?",
    eyebrow: "โปรวันเงินเดือนออก",
    title: "ลด 40% ทุกแก้ว",
    body: "ใช้ได้ทุกสาขาถึงวันอาทิตย์ จำกัดคนละ 1 แก้วต่อวัน ไม่ร่วมกับโปรโมชันอื่น",
    cta: "รับโค้ด",
    flatVerdict: "ทุกอย่างขนาดและน้ำหนักเท่ากัน พอเบลอแล้วไม่มีอะไรเด่นเลย แม้แต่ปุ่ม",
    hierVerdict: "แม้จะเบลอ คุณยังเห็นโปรและหาปุ่มเจอ นั่นคือผลของขนาด น้ำหนัก สี และระยะห่าง",
  },
  zh: {
    flat: "平铺",
    hierarchy: "有层级",
    modeLabel: "版面",
    squint: "眯眼测试",
    squintDesc: "把卡片模糊处理——什么依然突出？",
    eyebrow: "发薪日优惠",
    title: "所有咖啡 6 折",
    body: "周日前所有门店有效。每人每天限一杯。不与其他优惠同享。",
    cta: "领取优惠码",
    flatVerdict: "所有内容的大小和字重都一样，所以模糊之后什么都不突出——连按钮也不。",
    hierVerdict: "即使模糊了，你依然看得到优惠，也找得到按钮。这是大小、字重、颜色和间距的功劳。",
  },
  ja: {
    flat: "フラット",
    hierarchy: "階層あり",
    modeLabel: "レイアウト",
    squint: "スクイントテスト",
    squintDesc: "カードをぼかすと、何が目立ちますか？",
    eyebrow: "給料日キャンペーン",
    title: "コーヒー全品 40% オフ",
    body: "日曜日まで全店舗で有効。お一人様 1 日 1 杯まで。他の割引との併用不可。",
    cta: "コードを受け取る",
    flatVerdict: "すべてが同じ大きさと太さなので、ぼかすと何も目立ちません。ボタンさえも。",
    hierVerdict: "ぼかしても、オファーが見えてボタンも見つかります。大きさ、太さ、色、余白のおかげです。",
  },
};

export default function VisualHierarchyExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [mode, setMode] = useState<Mode>("flat");
  const [squint, setSquint] = useState(false);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <SegmentedControl<Mode>
        label={t.modeLabel}
        value={mode}
        onChange={setMode}
        options={[
          { value: "flat", label: t.flat },
          { value: "hierarchy", label: t.hierarchy },
        ]}
      />

      <div
        className="w-full transition-[filter] duration-300"
        style={{ filter: squint ? "blur(5px)" : undefined }}
        aria-hidden={squint || undefined}
        data-intentionally-flawed={mode === "flat" || undefined}
      >
        {mode === "flat" ? (
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 text-[0.9375rem] text-ink-2">
            <p>{t.eyebrow}</p>
            <p>{t.title}</p>
            <p>{t.body}</p>
            <p>{t.cta}</p>
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-sm">
            <p className="type-label text-accent-ink">{t.eyebrow}</p>
            <p className="mt-2 text-[2rem] leading-tight font-bold tracking-tight text-ink">{t.title}</p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-2">{t.body}</p>
            <span className="mt-6 flex h-12 items-center justify-center rounded-full bg-accent text-[0.9375rem] font-semibold text-on-accent shadow-sm">
              {t.cta}
            </span>
          </div>
        )}
      </div>

      <div className="w-full rounded-[var(--radius-md)] bg-surface px-4 py-3">
        <Switch
          label={t.squint}
          description={t.squintDesc}
          checked={squint}
          onChange={(v) => {
            setSquint(v);
            if (v) experience();
          }}
        />
      </div>
      {squint ? (
        <p className="animate-fade-up text-center text-[0.875rem] text-ink-2" aria-live="polite">
          {mode === "flat" ? t.flatVerdict : t.hierVerdict}
        </p>
      ) : null}
    </div>
  );
}
