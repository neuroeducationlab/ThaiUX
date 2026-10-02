"use client";

import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Variant = "flat" | "hierarchy";

const copy = {
  en: {
    flat: "Version A",
    hierarchy: "Version B",
    switchLabel: "Choose a version",
    title: "Delete “Summer menu”?",
    body: "This removes the project and its 12 screens for everyone on your team.",
    ok: "OK",
    cancel: "Cancel",
    delete: "Delete project",
    keep: "Keep project",
    decided: "You decided in {s}s",
    pickedDanger: "You chose to delete.",
    pickedSafe: "You kept it safe.",
    compare:
      "In B, the hierarchy (one strong button, one quiet one) and verb labels told you what each button does — no need to re-read the question.",
  },
  th: {
    flat: "แบบ A",
    hierarchy: "แบบ B",
    switchLabel: "เลือกแบบ",
    title: "ลบ “เมนูหน้าร้อน”?",
    body: "การลบจะลบโปรเจกต์นี้และหน้าจอทั้ง 12 หน้า สำหรับทุกคนในทีม",
    ok: "ตกลง",
    cancel: "ยกเลิก",
    delete: "ลบโปรเจกต์",
    keep: "เก็บโปรเจกต์ไว้",
    decided: "คุณตัดสินใจใน {s} วินาที",
    pickedDanger: "คุณเลือกลบ",
    pickedSafe: "คุณเลือกเก็บไว้",
    compare: "ในแบบ B ลำดับชั้นของปุ่ม (ปุ่มเด่นหนึ่ง ปุ่มเบาหนึ่ง) และป้ายที่เป็นคำกริยา บอกคุณว่าแต่ละปุ่มจะทำอะไร โดยไม่ต้องย้อนอ่านคำถามซ้ำ",
  },
  zh: {
    flat: "版本 A",
    hierarchy: "版本 B",
    switchLabel: "选择版本",
    title: "删除“夏季菜单”？",
    body: "这会为团队所有成员删除该项目及其 12 个界面。",
    ok: "确定",
    cancel: "取消",
    delete: "删除项目",
    keep: "保留项目",
    decided: "你用了 {s} 秒做出决定",
    pickedDanger: "你选择了删除。",
    pickedSafe: "你选择了保留。",
    compare: "在 B 中，按钮层级（一个醒目、一个低调）和动词标签告诉了你每个按钮的作用——不必再回头读一遍问题。",
  },
  ja: {
    flat: "バージョン A",
    hierarchy: "バージョン B",
    switchLabel: "バージョンを選ぶ",
    title: "「夏メニュー」を削除しますか？",
    body: "チーム全員から、このプロジェクトと 12 の画面が削除されます。",
    ok: "OK",
    cancel: "キャンセル",
    delete: "プロジェクトを削除",
    keep: "プロジェクトを残す",
    decided: "{s} 秒で決めました",
    pickedDanger: "削除を選びました。",
    pickedSafe: "残すことを選びました。",
    compare: "B では、ボタンの階層（目立つボタンと控えめなボタン）と動詞のラベルが、それぞれ何をするかを教えてくれました。質問を読み返す必要はありません。",
  },
};

export default function ButtonDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [variant, setVariant] = useState<Variant>("flat");
  const [results, setResults] = useState<Partial<Record<Variant, { ms: number; danger: boolean }>>>({});
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = performance.now();
  }, [variant]);

  const choose = (danger: boolean) => {
    const ms = performance.now() - shownAt.current;
    const next = { ...results, [variant]: { ms, danger } };
    setResults(next);
    if (next.flat && next.hierarchy) experience();
  };

  const result = results[variant];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <SegmentedControl<Variant>
        label={t.switchLabel}
        value={variant}
        onChange={setVariant}
        options={[
          { value: "flat", label: `${t.flat}${results.flat ? " ✓" : ""}` },
          { value: "hierarchy", label: `${t.hierarchy}${results.hierarchy ? " ✓" : ""}` },
        ]}
      />

      <div className="w-full rounded-[var(--radius-lg)] border border-line-strong bg-surface p-5 shadow-md" role="group" aria-label={t.title}>
        <p className="type-title">{t.title}</p>
        <p className="mt-1.5 text-[0.9375rem] text-ink-2">{t.body}</p>
        {variant === "flat" ? (
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => choose(true)} className="h-10 rounded-[var(--radius-sm)] bg-surface-3 px-5 text-sm font-medium text-ink">
              {t.ok}
            </button>
            <button type="button" onClick={() => choose(false)} className="h-10 rounded-[var(--radius-sm)] bg-surface-3 px-5 text-sm font-medium text-ink">
              {t.cancel}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => choose(false)}
              className="h-11 rounded-full border border-line-strong bg-surface px-5 text-sm font-semibold text-ink hover:bg-surface-2"
            >
              {t.keep}
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="h-11 rounded-full bg-error px-5 text-sm font-semibold text-white shadow-sm hover:brightness-110 dark:text-[#2a0b08]"
            >
              {t.delete}
            </button>
          </div>
        )}
      </div>

      <div className="min-h-12 text-center text-[0.875rem]" aria-live="polite">
        {result ? (
          <p className="animate-fade-up text-ink">
            <span className="tabular font-semibold">{t.decided.replace("{s}", (result.ms / 1000).toFixed(1))}</span>
            {" · "}
            {result.danger ? t.pickedDanger : t.pickedSafe}
          </p>
        ) : null}
        {results.flat && results.hierarchy ? <p className="animate-fade-up mt-2 text-ink-2">{t.compare}</p> : null}
      </div>
    </div>
  );
}
