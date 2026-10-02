"use client";

import { useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    project: "Summer menu",
    screens: "12 screens · edited 2 h ago",
    open: "Delete project",
    title: "Delete “Summer menu”?",
    body: "This permanently deletes the project and its 12 screens. You can’t undo this.",
    cancel: "Cancel",
    confirm: "Delete project",
    hint: "Try Tab — focus stays inside. Esc or the background closes it.",
    closedBy: "Closed with: {how}. Focus went back to the button that opened it.",
    howCancel: "Cancel",
    howConfirm: "Delete (don’t worry — nothing was deleted)",
    howEsc: "Esc / background",
  },
  th: {
    project: "เมนูหน้าร้อน",
    screens: "12 หน้าจอ · แก้ไขเมื่อ 2 ชม. ที่แล้ว",
    open: "ลบโปรเจกต์",
    title: "ลบ “เมนูหน้าร้อน”?",
    body: "การลบจะลบโปรเจกต์และหน้าจอทั้ง 12 หน้าอย่างถาวร ย้อนกลับไม่ได้",
    cancel: "ยกเลิก",
    confirm: "ลบโปรเจกต์",
    hint: "ลองกด Tab โฟกัสจะวนอยู่ข้างใน ปิดได้ด้วย Esc หรือคลิกพื้นหลัง",
    closedBy: "ปิดด้วย: {how} แล้วโฟกัสก็กลับไปที่ปุ่มที่เปิดมันขึ้นมา",
    howCancel: "ยกเลิก",
    howConfirm: "ลบ (ไม่ต้องห่วง ไม่มีอะไรถูกลบจริง)",
    howEsc: "Esc หรือพื้นหลัง",
  },
  zh: {
    project: "夏季菜单",
    screens: "12 个界面 · 2 小时前编辑",
    open: "删除项目",
    title: "删除“夏季菜单”？",
    body: "这将永久删除该项目及其 12 个界面，且无法撤销。",
    cancel: "取消",
    confirm: "删除项目",
    hint: "试试按 Tab——焦点会留在对话框内。按 Esc 或点击背景即可关闭。",
    closedBy: "关闭方式：{how}。焦点回到了打开它的按钮上。",
    howCancel: "取消",
    howConfirm: "删除（别担心——什么都没删）",
    howEsc: "Esc / 背景",
  },
  ja: {
    project: "夏メニュー",
    screens: "12 画面 · 2 時間前に編集",
    open: "プロジェクトを削除",
    title: "「夏メニュー」を削除しますか？",
    body: "このプロジェクトと 12 の画面が完全に削除されます。元に戻せません。",
    cancel: "キャンセル",
    confirm: "プロジェクトを削除",
    hint: "Tab を押してみて。フォーカスは中に留まります。Esc か背景のクリックで閉じます。",
    closedBy: "閉じ方：{how}。フォーカスは、開いたボタンに戻りました。",
    howCancel: "キャンセル",
    howConfirm: "削除（ご安心を。何も削除されていません）",
    howEsc: "Esc ／ 背景",
  },
};

export default function ModalDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const how = useRef<"cancel" | "confirm" | "esc">("esc");
  const [closedWith, setClosedWith] = useState<string | null>(null);

  const close = (reason: "cancel" | "confirm") => {
    how.current = reason;
    dialogRef.current?.close();
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4 shadow-sm">
        <div>
          <p className="font-semibold text-ink">{t.project}</p>
          <p className="text-[0.8125rem] text-ink-2">{t.screens}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            how.current = "esc";
            setClosedWith(null);
            dialogRef.current?.showModal();
          }}
          className="h-10 shrink-0 rounded-full border border-error/40 px-4 text-sm font-semibold text-error hover:bg-error-soft"
        >
          {t.open}
        </button>
      </div>

      <p className="mt-4 min-h-10 text-center text-[0.875rem] text-ink-2" aria-live="polite">
        {closedWith ? t.closedBy.replace("{how}", closedWith) : null}
      </p>

      <dialog
        ref={dialogRef}
        aria-labelledby="modal-demo-title"
        aria-describedby="modal-demo-body"
        onClose={() => {
          const label = how.current === "cancel" ? t.howCancel : how.current === "confirm" ? t.howConfirm : t.howEsc;
          setClosedWith(label);
          experience();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-[var(--radius-lg)] border border-line bg-surface p-0 shadow-lg backdrop:bg-[var(--overlay)]"
      >
        <div className="p-6">
          <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-error-soft text-error" aria-hidden>
            <TriangleAlert className="size-5" />
          </span>
          <h3 id="modal-demo-title" className="type-title">{t.title}</h3>
          <p id="modal-demo-body" className="mt-2 text-[0.9375rem] text-ink-2">{t.body}</p>
          <p className="mt-4 rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2 text-[0.8125rem] text-ink-2">{t.hint}</p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              autoFocus
              onClick={() => close("cancel")}
              className="h-11 rounded-full border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-surface-2"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={() => close("confirm")}
              className="h-11 rounded-full bg-error px-5 text-sm font-semibold text-white hover:brightness-110 dark:text-[#2a0b08]"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
