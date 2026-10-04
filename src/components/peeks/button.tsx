"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs } from "./kit";

type Version = "a" | "b";

const copy = {
  en: {
    a: "Version A",
    b: "Version B",
    versions: "Choose a version",
    title: "Delete “Summer menu”?",
    body: "Removes 12 screens for your whole team.",
    ok: "OK",
    cancel: "Cancel",
    keep: "Keep",
    del: "Delete project",
    decided: "Decided in {s}s",
    sec: "{s}s",
    compare: "B: one strong button and verbs — no re-reading.",
  },
  th: {
    a: "แบบ A",
    b: "แบบ B",
    versions: "เลือกแบบ",
    title: "ลบ “เมนูหน้าร้อน” ไหม?",
    body: "หน้าจอ 12 หน้าจะหายไปสำหรับทุกคนในทีม",
    ok: "ตกลง",
    cancel: "ยกเลิก",
    keep: "เก็บไว้",
    del: "ลบโปรเจกต์",
    decided: "ตัดสินใจใน {s} วินาที",
    sec: "{s} วิ",
    compare: "แบบ B: ปุ่มหลักเด่นชัด ใช้คำกริยา ไม่ต้องอ่านซ้ำ",
  },
  zh: {
    a: "版本 A",
    b: "版本 B",
    versions: "选择版本",
    title: "删除“夏季菜单”？",
    body: "将为整个团队删除 12 个页面。",
    ok: "确定",
    cancel: "取消",
    keep: "保留",
    del: "删除项目",
    decided: "用时 {s} 秒",
    sec: "{s} 秒",
    compare: "B：主次分明、按钮用动词——不用再读一遍。",
  },
  ja: {
    a: "A 案",
    b: "B 案",
    versions: "案を選ぶ",
    title: "「夏メニュー」を削除しますか？",
    body: "チーム全員の 12 画面が削除されます。",
    ok: "OK",
    cancel: "キャンセル",
    keep: "残す",
    del: "削除する",
    decided: "{s} 秒で決定",
    sec: "{s} 秒",
    compare: "B：強弱のある配置と動詞のラベルで、読み返さずに済む。",
  },
};

export default function ButtonPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [version, setVersion] = useState<Version>("a");
  const [times, setTimes] = useState<Partial<Record<Version, number>>>({});
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = performance.now();
  }, [version]);

  const choose = () => {
    const next = { ...times, [version]: performance.now() - shownAt.current };
    setTimes(next);
    if (next.a !== undefined && next.b !== undefined) experience();
  };

  const time = times[version];
  const sec = (ms?: number) => (ms === undefined ? "" : ` · ${format(t.sec, { s: (ms / 1000).toFixed(1) })}`);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <MiniTabs
        label={t.versions}
        value={version}
        onChange={setVersion}
        options={[
          { value: "a", label: `${t.a}${sec(times.a)}` },
          { value: "b", label: `${t.b}${sec(times.b)}` },
        ]}
      />
      <div role="group" aria-label={t.title} className="w-full max-w-[18rem] rounded-[var(--radius-md)] border border-line-strong bg-surface p-3 shadow-md">
        <p className="text-[0.875rem] font-semibold text-ink">{t.title}</p>
        <p className="mt-0.5 text-[0.75rem] text-ink-2">{t.body}</p>
        {version === "a" ? (
          <div className="mt-3 flex justify-end gap-1.5">
            <button type="button" onClick={choose} className="h-8 rounded-[6px] bg-surface-3 px-3.5 text-[0.8125rem] font-medium text-ink">
              {t.ok}
            </button>
            <button type="button" onClick={choose} className="h-8 rounded-[6px] bg-surface-3 px-3.5 text-[0.8125rem] font-medium text-ink">
              {t.cancel}
            </button>
          </div>
        ) : (
          <div className="mt-3 flex justify-end gap-1.5">
            <button
              type="button"
              onClick={choose}
              className="h-8 rounded-full border border-line-strong bg-surface px-3.5 text-[0.8125rem] font-semibold text-ink hover:bg-surface-2"
            >
              {t.keep}
            </button>
            <button
              type="button"
              onClick={choose}
              className="h-8 rounded-full bg-error px-3.5 text-[0.8125rem] font-semibold text-white shadow-sm hover:brightness-110 dark:text-[#2a0b08]"
            >
              {t.del}
            </button>
          </div>
        )}
      </div>
      <p className="min-h-4 text-center text-[0.75rem] leading-tight text-ink" aria-live="polite">
        {times.a !== undefined && times.b !== undefined ? (
          <span className="animate-fade-up inline-block text-ink-2">{t.compare}</span>
        ) : time !== undefined ? (
          <span className="tabular font-semibold">{format(t.decided, { s: (time / 1000).toFixed(1) })}</span>
        ) : null}
      </p>
    </div>
  );
}
