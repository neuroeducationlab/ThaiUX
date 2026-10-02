"use client";

import { useId, useState } from "react";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { contrastRatio, parseHex, WCAG } from "@/lib/contrast";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const PRESETS = [
  { fg: "#1a1a1e", bg: "#fbfbfa" },
  { fg: "#3343c4", bg: "#ffffff" },
  { fg: "#a3a3a3", bg: "#ffffff" },
  { fg: "#ffffff", bg: "#f5c518" },
  { fg: "#d92d20", bg: "#1d7348" },
];

const copy = {
  en: {
    text: "Text",
    background: "Background",
    swap: "Swap colours",
    presets: "Try a preset",
    presetNames: ["UXLab ink on paper", "Kram indigo on white", "Light grey on white", "White on yellow", "Red on green"],
    ratio: "Contrast ratio",
    normal: "Normal text",
    large: "Large text",
    ui: "UI components",
    sample: "Mango sticky rice ฿120",
    sampleSmall: "Order before 2 pm for delivery today.",
    invalid: "Use a 6-digit hex colour like #3343c4",
    pass: "Pass",
    fail: "Fail",
    advice: {
      great: "Excellent — comfortable for everyone, including in sunlight.",
      ok: "Passes AA for body text. AAA would be even more comfortable.",
      large: "Only safe for large text (24px+, or 19px+ bold) and UI shapes.",
      fail: "Fails — many people won’t be able to read this. Darken the text or lighten the background.",
    },
  },
  th: {
    text: "ตัวอักษร",
    background: "พื้นหลัง",
    swap: "สลับสี",
    presets: "ลองชุดสีสำเร็จรูป",
    presetNames: ["หมึก UXLab บนกระดาษ", "ครามบนขาว", "เทาอ่อนบนขาว", "ขาวบนเหลือง", "แดงบนเขียว"],
    ratio: "ค่าคอนทราสต์",
    normal: "ตัวอักษรทั่วไป",
    large: "ตัวอักษรใหญ่",
    ui: "คอมโพเนนต์ UI",
    sample: "ข้าวเหนียวมะม่วง ฿120",
    sampleSmall: "สั่งก่อนบ่ายสองโมง ส่งถึงภายในวันนี้",
    invalid: "ใช้รหัสสี 6 หลัก เช่น #3343c4",
    pass: "ผ่าน",
    fail: "ไม่ผ่าน",
    advice: {
      great: "ยอดเยี่ยม อ่านสบายสำหรับทุกคน แม้อยู่กลางแดด",
      ok: "ผ่านระดับ AA สำหรับเนื้อหา ถ้าถึง AAA จะอ่านสบายยิ่งขึ้น",
      large: "ใช้ได้เฉพาะตัวอักษรใหญ่ (24px ขึ้นไป หรือ 19px ตัวหนา) และรูปทรงของ UI",
      fail: "ไม่ผ่าน หลายคนจะอ่านไม่ออก ลองทำตัวอักษรให้เข้มขึ้นหรือพื้นหลังให้อ่อนลง",
    },
  },
  zh: {
    text: "文字",
    background: "背景",
    swap: "交换颜色",
    presets: "试试预设",
    presetNames: ["UXLab 墨色配纸色", "靛蓝配白色", "浅灰配白色", "白色配黄色", "红色配绿色"],
    ratio: "对比度",
    normal: "普通文字",
    large: "大号文字",
    ui: "UI 组件",
    sample: "芒果糯米饭 ฿120",
    sampleSmall: "下午 2 点前下单，今天送达。",
    invalid: "请使用 6 位十六进制颜色，例如 #3343c4",
    pass: "通过",
    fail: "未通过",
    advice: {
      great: "非常好——对每个人都很舒适，即使在阳光下也一样。",
      ok: "正文达到 AA 级。达到 AAA 会更舒适。",
      large: "只适合大号文字（24px 以上，或 19px 以上粗体）和 UI 图形。",
      fail: "未通过——很多人会看不清。把文字调深，或把背景调浅。",
    },
  },
  ja: {
    text: "文字",
    background: "背景",
    swap: "色を入れ替える",
    presets: "プリセットを試す",
    presetNames: ["UXLab のインクと紙", "藍色と白", "薄いグレーと白", "白と黄色", "赤と緑"],
    ratio: "コントラスト比",
    normal: "通常の文字",
    large: "大きな文字",
    ui: "UI コンポーネント",
    sample: "マンゴーもち米 ฿120",
    sampleSmall: "午後 2 時までのご注文で本日お届け。",
    invalid: "#3343c4 のような 6 桁の 16 進数カラーを使ってください",
    pass: "合格",
    fail: "不合格",
    advice: {
      great: "すばらしい。直射日光の下でも、誰にとっても読みやすいです。",
      ok: "本文として AA に合格。AAA ならさらに読みやすくなります。",
      large: "大きな文字（24px 以上、または太字 19px 以上）と UI の形にのみ安全です。",
      fail: "不合格。多くの人が読めません。文字を濃くするか、背景を明るくしましょう。",
    },
  },
};

function Badge({ ok, label, need, passText, failText }: { ok: boolean; label: string; need: number; passText: string; failText: string }) {
  return (
    <div className={cn("flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-[0.8125rem]", ok ? "bg-success-soft" : "bg-error-soft")}>
      <span className="text-ink">
        {label} <span className="tabular text-ink-2">≥ {need}:1</span>
      </span>
      <span className={cn("inline-flex items-center gap-1 font-semibold", ok ? "text-success" : "text-error")}>
        {ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
        {ok ? passText : failText}
      </span>
    </div>
  );
}

export default function ContrastCheckerExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [fg, setFg] = useState("#a3a3a3");
  const [bg, setBg] = useState("#ffffff");
  const id = useId();
  const ratio = contrastRatio(fg, bg);

  const set = (which: "fg" | "bg", v: string) => {
    (which === "fg" ? setFg : setBg)(v);
    experience();
  };

  const advice =
    ratio === null ? null : ratio >= WCAG.aaaNormal ? t.advice.great : ratio >= WCAG.aaNormal ? t.advice.ok : ratio >= WCAG.aaLarge ? t.advice.large : t.advice.fail;

  const field = (which: "fg" | "bg", label: string, value: string) => (
    <div>
      <label htmlFor={`${id}-${which}`} className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={parseHex(value) ? value : "#000000"}
          onChange={(e) => set(which, e.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-[var(--radius-sm)] border border-line-input bg-surface p-1"
        />
        <input
          id={`${id}-${which}`}
          value={value}
          onChange={(e) => set(which, e.target.value)}
          spellCheck={false}
          aria-invalid={!parseHex(value) || undefined}
          className="h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 font-mono text-[0.875rem] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            {field("fg", t.text, fg)}
            <button
              type="button"
              onClick={() => {
                setFg(bg);
                setBg(fg);
                experience();
              }}
              aria-label={t.swap}
              title={t.swap}
              className="mb-0.5 flex size-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
            >
              <ArrowLeftRight className="size-4" aria-hidden />
            </button>
            {field("bg", t.background, bg)}
          </div>
          <div>
            <p className="mb-2 text-[0.8125rem] font-medium text-ink-2">{t.presets}</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFg(p.fg);
                    setBg(p.bg);
                    experience();
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-surface pr-3 pl-1.5 text-[0.75rem] font-medium text-ink hover:border-ink/30"
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-full border border-line text-[0.6875rem] font-bold"
                    style={{ background: p.bg, color: p.fg }}
                    aria-hidden
                    data-intentionally-flawed
                  >
                    Aa
                  </span>
                  {t.presetNames[i]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[var(--radius-lg)] border border-line p-5" style={{ background: parseHex(bg) ? bg : undefined, color: parseHex(fg) ? fg : undefined }} data-intentionally-flawed>
            <p className="text-[1.5rem] font-bold">{t.sample}</p>
            <p className="mt-1 text-[0.875rem]">{t.sampleSmall}</p>
          </div>
          <div className="flex items-baseline justify-between" aria-live="polite">
            <span className="text-[0.8125rem] font-medium text-ink-2">{t.ratio}</span>
            <span className="tabular text-3xl font-bold tracking-tight text-ink">{ratio ? `${ratio.toFixed(2)}:1` : "—"}</span>
          </div>
          {ratio ? (
            <div className="grid gap-1.5">
              <Badge ok={ratio >= WCAG.aaNormal} label={`AA · ${t.normal}`} need={WCAG.aaNormal} passText={t.pass} failText={t.fail} />
              <Badge ok={ratio >= WCAG.aaLarge} label={`AA · ${t.large}`} need={WCAG.aaLarge} passText={t.pass} failText={t.fail} />
              <Badge ok={ratio >= WCAG.aaaNormal} label={`AAA · ${t.normal}`} need={WCAG.aaaNormal} passText={t.pass} failText={t.fail} />
              <Badge ok={ratio >= WCAG.nonText} label={t.ui} need={WCAG.nonText} passText={t.pass} failText={t.fail} />
              <p className="pt-1 text-[0.875rem] text-ink">{advice}</p>
            </div>
          ) : (
            <p className="text-[0.875rem] text-error">{t.invalid}</p>
          )}
        </div>
      </div>
    </div>
  );
}
