"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/client";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Version = "flash" | "full";

const AMOUNT = { th: "฿500.00", en: "£20.00", zh: "¥100.00", ja: "¥2,000" } as const;

const copy = {
  en: {
    flash: "A · Quick flash",
    full: "B · Full confirmation",
    switchLabel: "Choose a version",
    to: "To",
    recipient: "Ploy S.",
    transfer: "Transfer",
    success: "Success!",
    done: "Transfer complete",
    whenLabel: "Time",
    when: "Today, 14:32",
    ref: "Ref.",
    save: "Save receipt",
    finish: "Done",
    again: "Make another transfer",
    gone: "Did it work? The message vanished before you could check.",
  },
  th: {
    flash: "A · เด้งแล้วหาย",
    full: "B · ยืนยันครบถ้วน",
    switchLabel: "เลือกแบบ",
    to: "ถึง",
    recipient: "พลอย ส.",
    transfer: "โอนเงิน",
    success: "สำเร็จ!",
    done: "โอนเงินสำเร็จ",
    whenLabel: "เวลา",
    when: "วันนี้ 14:32 น.",
    ref: "เลขที่อ้างอิง",
    save: "บันทึกสลิป",
    finish: "เสร็จสิ้น",
    again: "โอนอีกครั้ง",
    gone: "สำเร็จจริงไหม? ข้อความหายไปก่อนที่คุณจะทันดู",
  },
  zh: {
    flash: "A · 一闪而过",
    full: "B · 完整确认",
    switchLabel: "选择版本",
    to: "收款人",
    recipient: "Ploy S.",
    transfer: "转账",
    success: "成功！",
    done: "转账成功",
    whenLabel: "时间",
    when: "今天 14:32",
    ref: "参考编号",
    save: "保存凭证",
    finish: "完成",
    again: "再转一笔",
    gone: "真的成功了吗？你还没来得及看，消息就消失了。",
  },
  ja: {
    flash: "A · 一瞬だけ表示",
    full: "B · しっかり確認",
    switchLabel: "バージョンを選ぶ",
    to: "振込先",
    recipient: "Ploy S.",
    transfer: "振り込む",
    success: "成功！",
    done: "振込が完了しました",
    whenLabel: "日時",
    when: "今日 14:32",
    ref: "参照番号",
    save: "明細を保存",
    finish: "完了",
    again: "もう一度振り込む",
    gone: "本当にできた？ 確認する前にメッセージが消えてしまいました。",
  },
};

export default function SuccessStateDemo() {
  const t = useCopy(copy);
  const { locale } = useI18n();
  const { experience } = useDemo();
  const [version, setVersion] = useState<Version>("flash");
  const [phase, setPhase] = useState<"form" | "flash" | "gone" | "full">("form");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = () => {
    experience();
    if (version === "flash") {
      setPhase("flash");
      timer.current = window.setTimeout(() => setPhase("gone"), 900);
    } else setPhase("full");
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5">
      <SegmentedControl<Version>
        label={t.switchLabel}
        value={version}
        onChange={(v) => {
          setVersion(v);
          setPhase("form");
        }}
        options={[
          { value: "flash", label: t.flash },
          { value: "full", label: t.full },
        ]}
      />

      <div className="relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-line-strong bg-surface p-5 shadow-sm">
        {phase === "full" ? (
          <div className="animate-fade-up text-center" role="status">
            <CircleCheck className="animate-pop mx-auto size-14 text-success" aria-hidden strokeWidth={1.75} />
            <p className="mt-3 text-lg font-semibold text-ink">{t.done}</p>
            <p className="tabular mt-1 text-3xl font-bold tracking-tight text-ink">{AMOUNT[locale]}</p>
            <dl className="mt-5 space-y-2 rounded-[var(--radius-md)] bg-surface-2 p-4 text-left text-[0.875rem]">
              <div className="flex justify-between"><dt className="text-ink-2">{t.to}</dt><dd className="font-medium text-ink">{t.recipient}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-2">{t.whenLabel}</dt><dd className="font-medium text-ink">{t.when}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-2">{t.ref}</dt><dd className="tabular font-medium text-ink">TUX-24-0918-3317</dd></div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-line-strong text-sm font-semibold text-ink hover:bg-surface-2">
                <Download className="size-4" aria-hidden /> {t.save}
              </button>
              <button type="button" onClick={() => setPhase("form")} className="h-11 rounded-full bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover">
                {t.finish}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[0.8125rem] text-ink-2">{t.to}</p>
            <p className="font-semibold text-ink">{t.recipient}</p>
            <p className="tabular mt-4 text-3xl font-bold tracking-tight text-ink">{AMOUNT[locale]}</p>
            <button
              type="button"
              onClick={send}
              disabled={phase === "flash"}
              className="mt-5 h-12 w-full rounded-full bg-accent text-[0.9375rem] font-semibold text-on-accent hover:bg-accent-hover"
            >
              {t.transfer}
            </button>
            {phase === "gone" ? (
              <p className="animate-fade-up mt-3 text-center text-[0.8125rem] text-warning">{t.gone}</p>
            ) : null}
          </div>
        )}

        {phase === "flash" ? (
          <div className={cn("animate-pop absolute inset-x-5 top-5 rounded-full bg-success px-4 py-2 text-center text-sm font-semibold text-white dark:text-[#0b2a18]")}>
            {t.success}
          </div>
        ) : null}
      </div>
    </div>
  );
}
