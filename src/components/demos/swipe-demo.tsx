"use client";

import { useRef, useState } from "react";
import { Archive, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    mails: [
      { from: "FoodGo", subject: "Your order is on its way 🛵" },
      { from: "Design Weekly", subject: "10 small details that make apps feel premium" },
      { from: "Dr. Somchai Clinic", subject: "Reminder: appointment tomorrow at 10:00" },
    ],
    archive: "Archive",
    archiveItem: "Archive “{subject}”",
    archived: "Archived",
    undo: "Undo",
    tooShort: "Too short — it sprang back. That’s the commit threshold protecting you from accidents.",
    empty: "Inbox zero! Swipes are fast — once you know they exist.",
    restore: "Restore emails",
    hint: "← Swipe left to archive",
  },
  th: {
    mails: [
      { from: "FoodGo", subject: "อาหารของคุณกำลังไปส่ง 🛵" },
      { from: "Design Weekly", subject: "10 รายละเอียดเล็ก ๆ ที่ทำให้แอปดูพรีเมียม" },
      { from: "คลินิกหมอสมชาย", subject: "แจ้งเตือน: นัดพรุ่งนี้ 10:00 น." },
    ],
    archive: "เก็บถาวร",
    archiveItem: "เก็บถาวร “{subject}”",
    archived: "เก็บถาวรแล้ว",
    undo: "เลิกทำ",
    tooShort: "ปัดสั้นไป เลยเด้งกลับ นี่คือระยะยืนยันที่ช่วยกันไม่ให้ทำพลาดโดยไม่ตั้งใจ",
    empty: "กล่องจดหมายว่างแล้ว! Swipe เร็วมาก ถ้ารู้ว่ามันมีอยู่",
    restore: "กู้คืนอีเมล",
    hint: "← ปัดซ้ายเพื่อเก็บถาวร",
  },
  zh: {
    mails: [
      { from: "FoodGo", subject: "你的外卖正在配送中 🛵" },
      { from: "Design Weekly", subject: "让 App 显得高级的 10 个小细节" },
      { from: "颂猜诊所", subject: "提醒：明天 10:00 的预约" },
    ],
    archive: "归档",
    archiveItem: "归档“{subject}”",
    archived: "已归档",
    undo: "撤销",
    tooShort: "滑得太短——它弹回去了。这就是保护你免于误操作的确认阈值。",
    empty: "收件箱清空了！滑动很快——前提是你知道它存在。",
    restore: "恢复邮件",
    hint: "← 向左滑动归档",
  },
  ja: {
    mails: [
      { from: "FoodGo", subject: "ご注文の品を配達中です 🛵" },
      { from: "Design Weekly", subject: "アプリを上質に見せる 10 の小さなディテール" },
      { from: "ソムチャイ・クリニック", subject: "リマインダー：明日 10:00 のご予約" },
    ],
    archive: "アーカイブ",
    archiveItem: "「{subject}」をアーカイブ",
    archived: "アーカイブしました",
    undo: "元に戻す",
    tooShort: "短すぎて元に戻りました。これが誤操作を防ぐ「確定のしきい値」です。",
    empty: "受信トレイが空に！ スワイプは速い。存在を知っていれば、ですが。",
    restore: "メールを戻す",
    hint: "← 左にスワイプしてアーカイブ",
  },
};

const THRESHOLD = 0.4; // fraction of the row width needed to commit

function Row({
  subject,
  from,
  label,
  archiveLabel,
  onArchive,
  onTooShort,
}: {
  subject: string;
  from: string;
  label: string;
  archiveLabel: string;
  onArchive: () => void;
  onTooShort: () => void;
}) {
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  const start = useRef<{ x: number; y: number; w: number; locked: boolean | null } | null>(null);

  const commit = () => {
    setAnimating(true);
    setLeaving(true);
    window.setTimeout(onArchive, 220);
  };

  return (
    <li className="relative overflow-hidden rounded-[var(--radius-md)]">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-end gap-2 bg-accent px-5 text-sm font-semibold text-on-accent"
        style={{ opacity: Math.min(1, Math.abs(dx) / 60) }}
      >
        <Archive className="size-4" /> {archiveLabel}
      </div>
      <div
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY, w: e.currentTarget.offsetWidth, locked: null };
          setAnimating(false);
        }}
        onPointerMove={(e) => {
          const s = start.current;
          if (!s) return;
          const mx = e.clientX - s.x;
          const my = e.clientY - s.y;
          if (s.locked === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) {
            s.locked = Math.abs(mx) > Math.abs(my);
            if (s.locked) e.currentTarget.setPointerCapture(e.pointerId);
          }
          if (s.locked) setDx(Math.min(0, mx));
        }}
        onPointerUp={() => {
          const s = start.current;
          start.current = null;
          if (!s || !s.locked) return;
          if (Math.abs(dx) > s.w * THRESHOLD) commit();
          else {
            setAnimating(true);
            setDx(0);
            if (Math.abs(dx) > 12) onTooShort();
          }
        }}
        onPointerCancel={() => {
          start.current = null;
          setAnimating(true);
          setDx(0);
        }}
        style={{ transform: `translateX(${leaving ? "-105%" : `${dx}px`})`, touchAction: "pan-y" }}
        className={cn(
          "relative flex cursor-grab items-center gap-3 border border-line-strong bg-surface px-4 py-3 select-none active:cursor-grabbing",
          "rounded-[var(--radius-md)]",
          animating && "transition-transform duration-200 ease-out-soft",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.8125rem] font-bold text-accent-ink" aria-hidden>
          {from.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.8125rem] font-semibold text-ink">{from}</span>
          <span className="block truncate text-[0.875rem] text-ink-2">{subject}</span>
        </span>
        <button
          type="button"
          onClick={commit}
          aria-label={label}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
        >
          <Archive className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

export default function SwipeDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [visible, setVisible] = useState([0, 1, 2]);
  const [note, setNote] = useState<string | null>(null);
  const [lastArchived, setLastArchived] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-center text-[0.8125rem] font-medium text-ink-2" aria-hidden>
        {t.hint}
      </p>
      {visible.length ? (
        <ul className="flex flex-col gap-2">
          {visible.map((i) => (
            <Row
              key={i}
              from={t.mails[i].from}
              subject={t.mails[i].subject}
              archiveLabel={t.archive}
              label={t.archiveItem.replace("{subject}", t.mails[i].subject)}
              onTooShort={() => setNote(t.tooShort)}
              onArchive={() => {
                setVisible((v) => v.filter((x) => x !== i));
                setLastArchived(i);
                setNote(null);
                experience();
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-[var(--radius-md)] border border-dashed border-line-strong bg-surface px-4 py-8 text-center text-[0.9375rem] text-ink-2">
          {t.empty}
        </div>
      )}

      <div className="mt-4 flex min-h-10 flex-wrap items-center justify-center gap-3 text-[0.875rem]" aria-live="polite">
        {lastArchived !== null ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-bg">
            {t.archived}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => {
                setVisible((v) => [...v, lastArchived].sort());
                setLastArchived(null);
              }}
            >
              {t.undo}
            </button>
          </span>
        ) : null}
        {note ? <span className="text-warning">{note}</span> : null}
        {!visible.length ? (
          <button
            type="button"
            onClick={() => {
              setVisible([0, 1, 2]);
              setLastArchived(null);
            }}
            className="inline-flex items-center gap-1.5 font-medium text-accent-ink"
          >
            <RotateCcw className="size-4" aria-hidden /> {t.restore}
          </button>
        ) : null}
      </div>
    </div>
  );
}
