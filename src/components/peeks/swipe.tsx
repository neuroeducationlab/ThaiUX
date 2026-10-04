"use client";

import { useRef, useState } from "react";
import { Archive, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { useTimers } from "./kit";

const THRESHOLD = 0.4; // share of the row width that counts as a swipe

const copy = {
  en: {
    mails: [
      { from: "Ploy", subject: "Dinner at 7?" },
      { from: "Grab", subject: "Your receipt" },
    ],
    archive: "Archive",
    archiveItem: "Archive “{subject}”",
    archived: "Archived",
    undo: "Undo",
    empty: "Inbox zero!",
    restore: "Bring them back",
    tooShort: "A little further…",
  },
  th: {
    mails: [
      { from: "พลอย", subject: "กินข้าวกันหนึ่งทุ่มไหม" },
      { from: "Grab", subject: "ใบเสร็จของคุณ" },
    ],
    archive: "เก็บ",
    archiveItem: "เก็บ “{subject}”",
    archived: "เก็บแล้ว",
    undo: "เลิกทำ",
    empty: "กล่องข้อความว่างแล้ว!",
    restore: "เอากลับมา",
    tooShort: "ปัดอีกนิด…",
  },
  zh: {
    mails: [
      { from: "Ploy", subject: "七点一起吃饭？" },
      { from: "Grab", subject: "你的收据" },
    ],
    archive: "归档",
    archiveItem: "归档“{subject}”",
    archived: "已归档",
    undo: "撤销",
    empty: "收件箱清空啦！",
    restore: "恢复",
    tooShort: "再滑远一点……",
  },
  ja: {
    mails: [
      { from: "Ploy", subject: "7 時にごはんどう？" },
      { from: "Grab", subject: "領収書" },
    ],
    archive: "アーカイブ",
    archiveItem: "「{subject}」をアーカイブ",
    archived: "アーカイブしました",
    undo: "元に戻す",
    empty: "受信箱が空になりました！",
    restore: "元に戻す",
    tooShort: "もう少し…",
  },
};

function Row({ from, subject, label, archiveLabel, onArchive, onTooShort }: {
  from: string;
  subject: string;
  label: string;
  archiveLabel: string;
  onArchive: () => void;
  onTooShort: () => void;
}) {
  const later = useTimers();
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  const start = useRef<{ x: number; y: number; w: number; locked: boolean | null } | null>(null);

  const commit = () => {
    setAnimating(true);
    setLeaving(true);
    later(onArchive, 200);
  };

  return (
    <li className="relative overflow-hidden rounded-[var(--radius-sm)]">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-end gap-1.5 bg-accent px-4 text-[0.8125rem] font-semibold text-on-accent"
        style={{ opacity: leaving ? 1 : Math.min(1, Math.abs(dx) / 50) }}
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
          "relative flex h-12 cursor-grab items-center gap-2.5 rounded-[var(--radius-sm)] border border-line-strong bg-surface pr-1 pl-2.5 select-none active:cursor-grabbing",
          animating && "transition-transform duration-200 ease-out-soft",
        )}
      >
        <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.75rem] font-bold text-accent-ink">
          {from.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.75rem] font-semibold text-ink">{from}</span>
          <span className="block truncate text-[0.8125rem] text-ink-2">{subject}</span>
        </span>
        <button
          type="button"
          onClick={commit}
          aria-label={label}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
        >
          <Archive className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

export default function SwipePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [visible, setVisible] = useState([0, 1]);
  const [last, setLast] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex size-full flex-col justify-center gap-2">
      {visible.length ? (
        <ul className="flex flex-col gap-1.5">
          {visible.map((i) => (
            <Row
              key={i}
              from={t.mails[i].from}
              subject={t.mails[i].subject}
              label={format(t.archiveItem, { subject: t.mails[i].subject })}
              archiveLabel={t.archive}
              onTooShort={() => setNote(t.tooShort)}
              onArchive={() => {
                setVisible((v) => v.filter((x) => x !== i));
                setLast(i);
                setNote(null);
                experience();
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="flex h-[6.375rem] items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-surface text-[0.875rem] font-semibold text-success">
          {t.empty}
        </p>
      )}
      <div className="flex min-h-7 flex-wrap items-center justify-center gap-2 text-[0.75rem]" aria-live="polite">
        {last !== null && visible.length ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 py-1 text-bg">
            {t.archived}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => {
                setVisible((v) => [...v, last].sort());
                setLast(null);
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
              setVisible([0, 1]);
              setLast(null);
            }}
            className="inline-flex h-7 items-center gap-1 rounded-full px-2 font-semibold text-accent-ink hover:bg-surface"
          >
            <RotateCcw className="size-3.5" aria-hidden /> {t.restore}
          </button>
        ) : null}
      </div>
    </div>
  );
}
