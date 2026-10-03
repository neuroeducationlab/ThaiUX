"use client";

import { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { useCopy } from "@/components/demos/use-copy";
import { format } from "@/i18n/localized";
import { Stage, clamp, useEffectEnv, useStagePointer } from "../engine";

const copy = {
  en: {
    before: "Before",
    after: "After",
    slider: "Compare before and after",
    value: "{n}% before",
    title: "Create account",
    name: "Full name",
    email: "Email",
    button: "Create account",
    help: "We’ll never share your email.",
    oldTitle: "REGISTRATION FORM — PLEASE FILL ALL FIELDS",
    oldButton: "submit",
  },
  th: {
    before: "ก่อน",
    after: "หลัง",
    slider: "เลื่อนเพื่อเทียบก่อนและหลัง",
    value: "เห็นแบบก่อน {n}%",
    title: "สร้างบัญชี",
    name: "ชื่อ–นามสกุล",
    email: "อีเมล",
    button: "สร้างบัญชี",
    help: "เราจะไม่เปิดเผยอีเมลของคุณ",
    oldTitle: "แบบฟอร์มลงทะเบียน — กรุณากรอกทุกช่อง",
    oldButton: "ส่ง",
  },
  zh: {
    before: "修改前",
    after: "修改后",
    slider: "拖动对比修改前后",
    value: "修改前 {n}%",
    title: "创建账户",
    name: "姓名",
    email: "邮箱",
    button: "创建账户",
    help: "我们绝不会分享你的邮箱。",
    oldTitle: "注册表格——请填写所有字段",
    oldButton: "提交",
  },
  ja: {
    before: "改善前",
    after: "改善後",
    slider: "改善前と改善後を比べる",
    value: "改善前 {n}%",
    title: "アカウント作成",
    name: "氏名",
    email: "メール",
    button: "アカウントを作成",
    help: "メールアドレスを共有することはありません。",
    oldTitle: "登録フォーム — すべての項目を入力してください",
    oldButton: "送信",
  },
};

export default function BeforeAfter() {
  const t = useCopy(copy);
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const moves = useRef(0);

  const follow = (x: number, w: number) => {
    setSplit(Math.round(clamp((x / w) * 100, 0, 100)));
    moves.current += 1;
    if (moves.current === 25) env.tried();
  };

  useStagePointer(stageRef, {
    onMove: (p) => {
      if (p.kind === "mouse" || p.kind === "pen" || p.down) follow(p.x, p.w);
    },
    onDown: (p) => follow(p.x, p.w),
  });

  return (
    <Stage ref={stageRef} focusable={false} className="group cursor-ew-resize bg-surface-2">
      {/* BEFORE: deliberately poor form (low contrast, cramped, placeholder labels) */}
      <div aria-hidden data-intentionally-flawed className="absolute inset-0 flex items-center justify-center bg-[#e4e4e4] p-4">
        <div className="w-full max-w-[17rem] bg-[#ededed] p-2 font-[Arial,sans-serif]">
          <p className="text-[0.5625rem] font-bold tracking-tight text-[#9a9a9a]">{t.oldTitle}</p>
          {["Name*", "Surname*", "E-mail*", "Phone*", "Address*"].map((f) => (
            <div key={f} className="mt-1 border border-[#d0d0d0] bg-white px-1 py-0.5 text-[0.5625rem] text-[#c4c4c4]">
              {f}
            </div>
          ))}
          <p className="mt-1 text-[0.5rem] text-[#e57373]">* required * required * required</p>
          <span className="mt-1 inline-block text-[0.5625rem] text-[#9a9a9a] underline">{t.oldButton}</span>
        </div>
      </div>

      {/* AFTER: clear labels, space, one obvious action */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-surface p-4" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
        <div className="w-full max-w-[17rem] rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-md">
          <p className="text-[1rem] font-semibold text-ink">{t.title}</p>
          <p className="mt-2.5 text-[0.75rem] font-medium text-ink">{t.name}</p>
          <div className="mt-1 h-8 rounded-[var(--radius-sm)] border border-line-input bg-surface" />
          <p className="mt-2 text-[0.75rem] font-medium text-ink">{t.email}</p>
          <div className="mt-1 h-8 rounded-[var(--radius-sm)] border border-line-input bg-surface" />
          <p className="mt-1 text-[0.6875rem] text-ink-2">{t.help}</p>
          <div className="mt-3 flex h-9 items-center justify-center rounded-full bg-accent text-[0.8125rem] font-semibold text-on-accent">{t.button}</div>
        </div>
      </div>

      <span aria-hidden className="absolute bottom-3 left-3 z-10 rounded-full bg-[#3a3a3a] px-2.5 py-1 text-[0.75rem] font-semibold text-white">
        {t.before}
      </span>
      <span aria-hidden className="absolute right-3 bottom-3 z-10 rounded-full bg-accent px-2.5 py-1 text-[0.75rem] font-semibold text-on-accent">
        {t.after}
      </span>

      {/* divider + handle */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" style={{ left: `${split}%` }}>
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-[#1a1a1e] shadow-lg transition-transform group-has-[input:focus-visible]:ring-2 group-has-[input:focus-visible]:ring-focus group-has-[input:focus-visible]:ring-offset-2 group-active:scale-110">
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={split}
        onChange={(e) => {
          setSplit(Number(e.target.value));
          env.tried();
        }}
        aria-label={t.slider}
        aria-valuetext={format(t.value, { n: split })}
        className="peer absolute bottom-0 left-0 h-px w-full opacity-0"
      />
    </Stage>
  );
}
