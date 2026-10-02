"use client";

import { useId, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    hide: "Hide focus ring",
    hideDesc: "What happens when a designer writes outline: none",
    title: "Join the UXLab newsletter",
    name: "Name",
    email: "Email",
    weekly: "Send me one email a week",
    subscribe: "Subscribe",
    cancel: "Not now",
    focused: "Keyboard focus is on:",
    nowhere: "Click inside the card, then press Tab",
    lost: "Lost? That’s every keyboard user’s experience when focus is hidden.",
  },
  th: {
    hide: "ซ่อนกรอบโฟกัส",
    hideDesc: "สิ่งที่เกิดขึ้นเมื่อนักออกแบบเขียน outline: none",
    title: "สมัครรับจดหมายข่าว UXLab",
    name: "ชื่อ",
    email: "อีเมล",
    weekly: "ส่งอีเมลให้ฉันสัปดาห์ละครั้ง",
    subscribe: "สมัคร",
    cancel: "ไว้ทีหลัง",
    focused: "โฟกัสของคีย์บอร์ดอยู่ที่:",
    nowhere: "คลิกในการ์ด แล้วกด Tab",
    lost: "หลงทางใช่ไหม? นี่คือสิ่งที่ผู้ใช้คีย์บอร์ดทุกคนเจอเมื่อโฟกัสถูกซ่อน",
  },
  zh: {
    hide: "隐藏焦点框",
    hideDesc: "设计师写下 outline: none 时会发生什么",
    title: "订阅 UXLab 通讯",
    name: "姓名",
    email: "邮箱",
    weekly: "每周给我发一封邮件",
    subscribe: "订阅",
    cancel: "以后再说",
    focused: "键盘焦点位于：",
    nowhere: "点击卡片内部，然后按 Tab",
    lost: "迷路了？焦点被隐藏时，每个键盘用户都是这种感受。",
  },
  ja: {
    hide: "フォーカス枠を隠す",
    hideDesc: "デザイナーが outline: none と書くと何が起きるか",
    title: "UXLab ニュースレターに登録",
    name: "お名前",
    email: "メールアドレス",
    weekly: "週に 1 回メールを受け取る",
    subscribe: "登録する",
    cancel: "今はしない",
    focused: "キーボードのフォーカス：",
    nowhere: "カードの中をクリックして、Tab を押してください",
    lost: "迷子になりましたか？ フォーカスが隠されると、キーボード利用者はみんなこうなります。",
  },
};

export default function FocusStateDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const moves = useRef(0);
  const id = useId();

  const ring = hidden
    ? "focus-visible:outline-none focus:outline-none"
    : "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 rounded-[var(--radius-md)] bg-surface px-4 py-3">
        <Switch label={t.hide} description={t.hideDesc} checked={hidden} onChange={setHidden} />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        onFocus={(e) => {
          const el = e.target as HTMLElement;
          if (el.matches(":focus-visible")) {
            setCurrent(el.getAttribute("data-name"));
            moves.current += 1;
            if (moves.current >= 2) experience();
          }
        }}
        data-intentionally-flawed={hidden || undefined}
        className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5 shadow-sm"
      >
        <p className="type-title mb-4">{t.title}</p>
        <div className="grid gap-3">
          <label className="text-[0.875rem] font-medium text-ink" htmlFor={`${id}-n`}>{t.name}</label>
          <input id={`${id}-n`} data-name={t.name} autoComplete="off" className={cn("-mt-2 h-11 rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-ink outline-none", ring)} />
          <label className="text-[0.875rem] font-medium text-ink" htmlFor={`${id}-e`}>{t.email}</label>
          <input id={`${id}-e`} data-name={t.email} type="email" autoComplete="off" className={cn("-mt-2 h-11 rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-ink outline-none", ring)} />
          <label className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
            <input type="checkbox" data-name={t.weekly} className={cn("size-5 accent-[var(--accent)]", ring)} />
            {t.weekly}
          </label>
          <div className="mt-2 flex gap-2">
            <button type="submit" data-name={t.subscribe} className={cn("h-11 flex-1 rounded-full bg-accent text-sm font-semibold text-on-accent", ring)}>{t.subscribe}</button>
            <button type="button" data-name={t.cancel} className={cn("h-11 flex-1 rounded-full border border-line-strong text-sm font-semibold text-ink", ring)}>{t.cancel}</button>
          </div>
        </div>
      </form>

      <p className="mt-4 flex min-h-11 items-center justify-center gap-2 text-center text-[0.875rem]" aria-live="polite">
        <Keyboard className="size-4 shrink-0 text-ink-2" aria-hidden />
        {current ? (
          hidden ? (
            <span className="text-warning">{t.lost}</span>
          ) : (
            <span className="text-ink-2">
              {t.focused} <strong className="text-ink">{current}</strong>
            </span>
          )
        ) : (
          <span className="text-ink-2">{t.nowhere}</span>
        )}
      </p>
    </div>
  );
}
