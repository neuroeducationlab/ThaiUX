"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, CircleCheck, Users, X } from "lucide-react";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/controls";
import { Spinner } from "@/components/ui/button";
import { useCopy } from "@/components/demos/use-copy";
import { CompletionCard, PhoneFrame, useLabComplete } from "./lab-shell";

type Label = "submit" | "click" | "book";
type Size = "s" | "m" | "l";
type Position = "top" | "middle" | "bottom";
type Hierarchy = "equal" | "primary";
type Spacing = "tight" | "comfortable";
type Feedback = "none" | "full";
type Choice = { label: Label; size: Size; position: Position; hierarchy: Hierarchy; spacing: Spacing; feedback: Feedback };

const START: Choice = { label: "submit", size: "s", position: "top", hierarchy: "equal", spacing: "tight", feedback: "none" };

const copy = {
  en: {
    controls: {
      label: "Button label",
      size: "Size",
      position: "Position",
      hierarchy: "Hierarchy",
      spacing: "Spacing",
      feedback: "Feedback",
    },
    options: {
      submit: "“Submit”",
      click: "“Click here”",
      book: "“Book table for 2”",
      s: "Small",
      m: "Medium",
      l: "Large",
      top: "Top",
      middle: "Middle",
      bottom: "Bottom",
      equal: "Two equal",
      primary: "Primary + secondary",
      tight: "Tight",
      comfortable: "Comfortable",
      none: "None",
      full: "Loading + confirm",
    },
    labels: { submit: "Submit", click: "Click here", book: "Book table for 2" } as Record<Label, string>,
    cancel: "Cancel",
    restaurant: "Baan Suan",
    when: "Fri 10 Oct · 19:00",
    people: "2 people",
    note: "Note for the restaurant",
    notePlaceholder: "Window seat, if possible",
    booking: "Booking…",
    booked: "Table booked for 2",
    bookedSub: "Fri 10 Oct · 19:00 · Baan Suan",
    done: "Done",
    checklist: "UX checklist",
    applied: "{n} of 6 principles applied",
    checks: {
      label: ["Clear label (microcopy)", "The button names the outcome, so people know what happens."],
      size: ["Comfortable target (Fitts’s Law)", "At least 44 px tall — easy to hit with a thumb."],
      position: ["Reachable placement", "Bottom of the screen: the thumb zone, after the details are read."],
      hierarchy: ["Clear hierarchy", "One primary action stands out; cancel is visibly secondary."],
      spacing: ["Breathing room", "Space separates groups, so nothing feels cramped or mis-tappable."],
      feedback: ["Visible feedback", "Loading, then a confirmation — no doubt, no double bookings."],
    } as Record<keyof Choice, string[]>,
    tryIt: "Try pressing the button in the preview.",
    doneTitle: "Much better!",
    doneBody: "Six small decisions — label, size, position, hierarchy, spacing and feedback — turned a confusing screen into an obvious one. That’s UX: not decoration, but decisions.",
    reset: "Reset to the original",
  },
  th: {
    controls: {
      label: "ป้ายบนปุ่ม",
      size: "ขนาด",
      position: "ตำแหน่ง",
      hierarchy: "ลำดับชั้น",
      spacing: "ระยะห่าง",
      feedback: "Feedback",
    },
    options: {
      submit: "“ส่ง”",
      click: "“คลิกที่นี่”",
      book: "“จองโต๊ะสำหรับ 2 ท่าน”",
      s: "เล็ก",
      m: "กลาง",
      l: "ใหญ่",
      top: "บน",
      middle: "กลาง",
      bottom: "ล่าง",
      equal: "สองปุ่มเท่ากัน",
      primary: "ปุ่มหลัก + ปุ่มรอง",
      tight: "ชิดกัน",
      comfortable: "พอดีสบายตา",
      none: "ไม่มี",
      full: "โหลด + ยืนยัน",
    },
    labels: { submit: "ส่ง", click: "คลิกที่นี่", book: "จองโต๊ะสำหรับ 2 ท่าน" },
    cancel: "ยกเลิก",
    restaurant: "บ้านสวน",
    when: "ศ. 10 ต.ค. · 19:00 น.",
    people: "2 ท่าน",
    note: "ข้อความถึงร้าน",
    notePlaceholder: "ขอที่นั่งริมหน้าต่าง ถ้าเป็นไปได้",
    booking: "กำลังจอง…",
    booked: "จองโต๊ะสำหรับ 2 ท่านแล้ว",
    bookedSub: "ศ. 10 ต.ค. · 19:00 น. · บ้านสวน",
    done: "เสร็จสิ้น",
    checklist: "เช็กลิสต์ UX",
    applied: "ใช้หลักการแล้ว {n} จาก 6 ข้อ",
    checks: {
      label: ["ป้ายชัดเจน (Microcopy)", "ปุ่มบอกผลลัพธ์ ผู้ใช้รู้ว่ากดแล้วจะเกิดอะไรขึ้น"],
      size: ["เป้ากดพอดีมือ (กฎของ Fitts)", "สูงอย่างน้อย 44 px กดด้วยนิ้วโป้งได้ง่าย"],
      position: ["ตำแหน่งที่เอื้อมถึง", "ด้านล่างของจอ อยู่ในระยะนิ้วโป้ง และอยู่หลังรายละเอียดที่ต้องอ่าน"],
      hierarchy: ["ลำดับชั้นชัดเจน", "ปุ่มหลักโดดเด่นหนึ่งปุ่ม ปุ่มยกเลิกดูเป็นปุ่มรองชัดเจน"],
      spacing: ["มีพื้นที่หายใจ", "ระยะห่างแบ่งกลุ่มเนื้อหา ไม่อึดอัดและไม่กดพลาด"],
      feedback: ["มี Feedback ที่มองเห็นได้", "มีสถานะกำลังโหลดและข้อความยืนยัน ไม่ต้องสงสัย ไม่จองซ้ำ"],
    },
    tryIt: "ลองกดปุ่มในหน้าตัวอย่างดู",
    doneTitle: "ดีขึ้นมาก!",
    doneBody: "การตัดสินใจเล็ก ๆ หกเรื่อง ได้แก่ ป้าย ขนาด ตำแหน่ง ลำดับชั้น ระยะห่าง และ Feedback เปลี่ยนหน้าที่สับสนให้ชัดเจนได้ นี่แหละ UX ไม่ใช่การตกแต่ง แต่เป็นการตัดสินใจ",
    reset: "กลับไปแบบเดิม",
  },
  zh: {
    controls: { label: "按钮文字", size: "大小", position: "位置", hierarchy: "层级", spacing: "间距", feedback: "反馈" },
    options: {
      submit: "“提交”",
      click: "“点这里”",
      book: "“预订 2 人桌”",
      s: "小",
      m: "中",
      l: "大",
      top: "顶部",
      middle: "中间",
      bottom: "底部",
      equal: "两个一样",
      primary: "主要 + 次要",
      tight: "紧凑",
      comfortable: "舒适",
      none: "无",
      full: "加载 + 确认",
    },
    labels: { submit: "提交", click: "点这里", book: "预订 2 人桌" },
    cancel: "取消",
    restaurant: "Baan Suan 花园餐厅",
    when: "10月10日 周五 · 19:00",
    people: "2 人",
    note: "给餐厅的备注",
    notePlaceholder: "如果可以，请安排靠窗的座位",
    booking: "预订中…",
    booked: "已预订 2 人桌",
    bookedSub: "10月10日 周五 · 19:00 · Baan Suan",
    done: "完成",
    checklist: "UX 检查清单",
    applied: "已应用 {n} / 6 条原则",
    checks: {
      label: ["清晰的标签（微文案）", "按钮写明结果，人们知道会发生什么。"],
      size: ["舒适的目标（费茨定律）", "至少 44 px 高——拇指很容易点中。"],
      position: ["易于触及的位置", "屏幕底部：拇指区，而且在看完细节之后。"],
      hierarchy: ["清晰的层级", "一个主要操作很突出，取消明显是次要的。"],
      spacing: ["留出呼吸空间", "间距分隔了不同分组，不拥挤，也不容易点错。"],
      feedback: ["可见的反馈", "先加载，再确认——不用怀疑，也不会重复预订。"],
    },
    tryIt: "试着点一下预览里的按钮。",
    doneTitle: "好多了！",
    doneBody: "六个小决定——文字、大小、位置、层级、间距和反馈——把一个令人困惑的界面变得一目了然。这就是 UX：不是装饰，而是决定。",
    reset: "恢复原样",
  },
  ja: {
    controls: { label: "ボタンのラベル", size: "サイズ", position: "位置", hierarchy: "階層", spacing: "余白", feedback: "フィードバック" },
    options: {
      submit: "「送信」",
      click: "「ここをクリック」",
      book: "「2 名で予約する」",
      s: "小",
      m: "中",
      l: "大",
      top: "上",
      middle: "中央",
      bottom: "下",
      equal: "同じ 2 つ",
      primary: "メイン + サブ",
      tight: "詰める",
      comfortable: "ゆったり",
      none: "なし",
      full: "読み込み + 確認",
    },
    labels: { submit: "送信", click: "ここをクリック", book: "2 名で予約する" },
    cancel: "キャンセル",
    restaurant: "バーン・スアン",
    when: "10/10（金）· 19:00",
    people: "2 名",
    note: "お店へのメモ",
    notePlaceholder: "できれば窓際の席を",
    booking: "予約中…",
    booked: "2 名で予約しました",
    bookedSub: "10/10（金）· 19:00 · バーン・スアン",
    done: "完了",
    checklist: "UX チェックリスト",
    applied: "6 つ中 {n} つの原則を適用",
    checks: {
      label: ["分かりやすいラベル（マイクロコピー）", "ボタンが結果を伝えるので、何が起きるか分かります。"],
      size: ["押しやすいターゲット（フィッツの法則）", "高さ 44 px 以上。親指で簡単に押せます。"],
      position: ["届きやすい位置", "画面の下。親指の届く範囲で、詳細を読んだあとに来ます。"],
      hierarchy: ["明確な階層", "メインの操作がひとつ目立ち、キャンセルは明らかにサブです。"],
      spacing: ["ゆとりのある余白", "余白がグループを分け、窮屈さや押し間違いを防ぎます。"],
      feedback: ["見えるフィードバック", "読み込み中、そして確認。迷いも二重予約もありません。"],
    },
    tryIt: "プレビューのボタンを押してみましょう。",
    doneTitle: "ずっと良くなりました！",
    doneBody: "ラベル、サイズ、位置、階層、余白、フィードバック。6 つの小さな判断で、分かりにくい画面が明快になりました。UX とは装飾ではなく、判断のことです。",
    reset: "元に戻す",
  },
};

const PASS: { [K in keyof Choice]: (v: Choice[K]) => boolean } = {
  label: (v) => v === "book",
  size: (v) => v !== "s",
  position: (v) => v === "bottom",
  hierarchy: (v) => v === "primary",
  spacing: (v) => v === "comfortable",
  feedback: (v) => v === "full",
};

export function MakeItBetter() {
  const t = useCopy(copy);
  const [c, setC] = useState<Choice>(START);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const keys = Object.keys(PASS) as (keyof Choice)[];
  const passed = keys.filter((k) => (PASS[k] as (v: unknown) => boolean)(c[k]));
  const allDone = passed.length === keys.length;
  useLabComplete("make-it-better", allDone);

  const set = <K extends keyof Choice>(k: K, v: Choice[K]) => {
    setC((prev) => ({ ...prev, [k]: v }));
    setPhase("idle");
  };

  const press = () => {
    if (c.feedback === "none") return; // silent on purpose
    setPhase("loading");
    timer.current = window.setTimeout(() => setPhase("done"), 1200);
  };

  const height = c.size === "s" ? "h-8 text-[0.75rem]" : c.size === "m" ? "h-11 text-[0.875rem]" : "h-[3.25rem] text-[0.9375rem]";
  const gap = c.spacing === "tight" ? "gap-1" : "gap-3";
  const pad = c.spacing === "tight" ? "p-2 space-y-1" : "p-4 space-y-4";

  const ctas = (
    <div className={cn("flex", c.hierarchy === "primary" ? "flex-col-reverse" : "flex-row", gap, c.spacing === "tight" ? "px-2" : "px-4")}>
      <button
        type="button"
        className={cn(
          "flex-1 rounded-[10px] font-semibold",
          height,
          c.hierarchy === "primary" ? "text-[#5c5c66]" : "bg-[#e6e6ea] text-[#1a1a1e]",
        )}
      >
        {t.cancel}
      </button>
      <button
        type="button"
        onClick={press}
        disabled={phase === "loading"}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-[10px] font-semibold",
          height,
          c.hierarchy === "primary" ? "bg-[#3343c4] text-white shadow-md active:scale-[0.98]" : "bg-[#e6e6ea] text-[#1a1a1e]",
        )}
      >
        {phase === "loading" ? (
          <>
            <Spinner className="size-4" /> {t.booking}
          </>
        ) : (
          t.labels[c.label]
        )}
      </button>
    </div>
  );

  const details = (
    <div className={cn(pad)}>
      <p className="text-lg font-bold">{t.restaurant}</p>
      <p className="flex items-center gap-2 text-[0.875rem] text-[#5c5c66]">
        <CalendarDays className="size-4" aria-hidden /> {t.when}
      </p>
      <p className="flex items-center gap-2 text-[0.875rem] text-[#5c5c66]">
        <Users className="size-4" aria-hidden /> {t.people}
      </p>
    </div>
  );

  const note = (
    <div className={cn(pad)}>
      <p className="text-[0.8125rem] font-medium">{t.note}</p>
      <div className="h-16 rounded-[8px] border border-[#d4d4da] p-2 text-[0.8125rem] text-[#6b6b75]">{t.notePlaceholder}</div>
    </div>
  );

  const options = {
    label: (["submit", "click", "book"] as Label[]).map((v) => ({ value: v, label: t.options[v] })),
    size: (["s", "m", "l"] as Size[]).map((v) => ({ value: v, label: t.options[v] })),
    position: (["top", "middle", "bottom"] as Position[]).map((v) => ({ value: v, label: t.options[v] })),
    hierarchy: (["equal", "primary"] as Hierarchy[]).map((v) => ({ value: v, label: t.options[v] })),
    spacing: (["tight", "comfortable"] as Spacing[]).map((v) => ({ value: v, label: t.options[v] })),
    feedback: (["none", "full"] as Feedback[]).map((v) => ({ value: v, label: t.options[v] })),
  };

  return (
    // Flex column below lg so the (scaled) phone can stay pinned while the
    // controls scroll underneath — you see every change as you make it.
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
      <div className="sticky top-16 z-10 -mx-4 bg-bg px-4 pt-2 pb-2 sm:-mx-6 sm:px-6 lg:top-24 lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="h-[17.5rem] lg:h-auto">
          <PhoneFrame className="origin-top scale-[0.62] lg:scale-100">
            <div className="flex min-h-[26rem] flex-col lg:min-h-[30rem]">
              {phase === "done" ? (
                <div className="animate-fade-up flex flex-1 flex-col items-center justify-center p-6 text-center" role="status">
                  <CircleCheck className="animate-pop size-14 text-[#1d7348]" aria-hidden strokeWidth={1.75} />
                  <p className="mt-3 text-lg font-bold">{t.booked}</p>
                  <p className="mt-1 text-[0.875rem] text-[#5c5c66]">{t.bookedSub}</p>
                  <button type="button" onClick={() => setPhase("idle")} className="mt-6 h-11 w-full rounded-[10px] bg-[#3343c4] font-semibold text-white">
                    {t.done}
                  </button>
                </div>
              ) : (
                <>
                  {c.position === "top" ? <div className="pt-3">{ctas}</div> : null}
                  {details}
                  {c.position === "middle" ? ctas : null}
                  {note}
                  <div className="flex-1" />
                  {c.position === "bottom" ? <div className="border-t border-[#ececf0] pt-3 pb-4">{ctas}</div> : null}
                </>
              )}
            </div>
          </PhoneFrame>
        </div>
        <p className="mt-1 text-center text-[0.8125rem] text-ink-2 lg:mt-3">{t.tryIt}</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {(keys as (keyof Choice)[]).map((k) => (
            <div key={k}>
              <p className="mb-1.5 text-[0.8125rem] font-semibold text-ink-2">{t.controls[k]}</p>
              <SegmentedControl
                label={t.controls[k]}
                size="sm"
                value={c[k] as string}
                onChange={(v) => set(k, v as Choice[typeof k])}
                options={options[k] as { value: string; label: string }[]}
                className="flex-wrap"
              />
            </div>
          ))}
        </div>

        <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="type-label">{t.checklist}</p>
            <p className="tabular text-[0.875rem] font-semibold text-ink">{format(t.applied, { n: passed.length })}</p>
          </div>
          <ul className="space-y-2.5" aria-live="polite">
            {keys.map((k) => {
              const ok = passed.includes(k);
              return (
                <li key={k} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", ok ? "bg-success text-white dark:text-[#0b2a18]" : "bg-surface-3 text-ink-3")}>
                    {ok ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <X className="size-3" aria-hidden />}
                  </span>
                  <span>
                    <span className={cn("block text-[0.9375rem] font-medium", ok ? "text-ink" : "text-ink-2")}>{t.checks[k][0]}</span>
                    {ok ? <span className="block text-[0.8125rem] text-ink-2">{t.checks[k][1]}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => { setC(START); setPhase("idle"); }} className="mt-4 h-10 rounded-full px-3 text-sm font-semibold text-accent-ink hover:bg-surface-2">
            {t.reset}
          </button>
        </div>

        {allDone ? <CompletionCard title={t.doneTitle}>{t.doneBody}</CompletionCard> : null}
      </div>
    </div>
  );
}
