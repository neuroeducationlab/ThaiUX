"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    project: "Summer menu",
    screens: "12 screens",
    open: "Delete",
    title: "Delete this project?",
    body: "This can’t be undone.",
    cancel: "Cancel",
    confirm: "Delete",
    closedBy: "Closed with {how}. The page behind was blocked until then.",
    esc: "Esc",
    backdrop: "a click outside",
    howCancel: "Cancel",
    howConfirm: "Delete",
  },
  th: {
    project: "เมนูหน้าร้อน",
    screens: "12 หน้าจอ",
    open: "ลบ",
    title: "ลบโปรเจกต์นี้ไหม?",
    body: "ลบแล้วย้อนกลับไม่ได้",
    cancel: "ยกเลิก",
    confirm: "ลบ",
    closedBy: "ปิดด้วย{how} ระหว่างนั้นหน้าข้างหลังถูกบังไว้",
    esc: "ปุ่ม Esc",
    backdrop: "การคลิกด้านนอก",
    howCancel: "ปุ่มยกเลิก",
    howConfirm: "ปุ่มลบ",
  },
  zh: {
    project: "夏季菜单",
    screens: "12 个页面",
    open: "删除",
    title: "删除这个项目？",
    body: "此操作无法撤销。",
    cancel: "取消",
    confirm: "删除",
    closedBy: "通过{how}关闭。在此之前，后面的页面都被挡住了。",
    esc: " Esc 键",
    backdrop: "点击外部",
    howCancel: "“取消”",
    howConfirm: "“删除”",
  },
  ja: {
    project: "夏メニュー",
    screens: "12 画面",
    open: "削除",
    title: "このプロジェクトを削除しますか？",
    body: "元に戻せません。",
    cancel: "キャンセル",
    confirm: "削除",
    closedBy: "{how}で閉じました。それまで後ろの画面は操作できませんでした。",
    esc: "Esc キー",
    backdrop: "外側のクリック",
    howCancel: "キャンセル",
    howConfirm: "削除ボタン",
  },
};

export default function ModalPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [open, setOpen] = useState(false);
  const [closedWith, setClosedWith] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const restore = useRef(false);
  const id = useId();

  // Focus moves into the dialog, and back to the button that opened it
  useEffect(() => {
    if (open) cancelRef.current?.focus();
    else if (restore.current) {
      restore.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  const close = (how: string) => {
    restore.current = true;
    setOpen(false);
    setClosedWith(how);
    experience();
  };

  return (
    <div className="relative size-full">
      <div inert={open} className="flex size-full flex-col items-center justify-center gap-2.5">
        <div className="flex w-full max-w-[17rem] items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line-strong bg-surface p-3 shadow-sm">
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-semibold text-ink">{t.project}</p>
            <p className="text-[0.75rem] text-ink-2">{t.screens}</p>
          </div>
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setClosedWith(null);
              setOpen(true);
            }}
            className="h-8 shrink-0 rounded-full border border-error/40 px-3.5 text-[0.8125rem] font-semibold text-error hover:bg-error-soft"
          >
            {t.open}
          </button>
        </div>
        <p aria-live="polite" className="min-h-8 max-w-[17rem] text-center text-[0.75rem] leading-snug text-ink-2">
          {closedWith ? <span className="animate-fade-up inline-block">{format(t.closedBy, { how: closedWith })}</span> : null}
        </p>
      </div>

      {open ? (
        <div
          className="absolute -inset-2.5 z-10 flex items-center justify-center bg-[var(--overlay)] p-3"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close(t.backdrop);
          }}
        >
          <div
            role="dialog"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-body`}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault(); // close the dialog, not the whole card
                close(t.esc);
              }
              if (e.key === "Tab") {
                // keep focus inside the dialog while it is open
                e.preventDefault();
                (document.activeElement === cancelRef.current ? confirmRef : cancelRef).current?.focus();
              }
            }}
            className="animate-pop w-full max-w-[15.5rem] rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-lg"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-error-soft text-error" aria-hidden>
                <TriangleAlert className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p id={`${id}-title`} className="text-[0.875rem] font-semibold text-ink">
                  {t.title}
                </p>
                <p id={`${id}-body`} className="text-[0.75rem] text-ink-2">
                  {t.body}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-1.5">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => close(t.howCancel)}
                className="h-8 rounded-full border border-line-strong px-3.5 text-[0.8125rem] font-semibold text-ink hover:bg-surface-2"
              >
                {t.cancel}
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={() => close(t.howConfirm)}
                className="h-8 rounded-full bg-error px-3.5 text-[0.8125rem] font-semibold text-white hover:brightness-110 dark:text-[#2a0b08]"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
