"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Group = "money" | "cards" | "account";
type CardId = "transfer" | "bills" | "topup" | "pin" | "freeze" | "statements" | "phone" | "notifications";
const CARDS: CardId[] = ["transfer", "statements", "pin", "bills", "notifications", "freeze", "topup", "phone"];
const GROUPS: Group[] = ["money", "cards", "account"];
const SUGGESTED: Record<CardId, Group> = {
  transfer: "money", bills: "money", topup: "money", statements: "money",
  pin: "cards", freeze: "cards",
  phone: "account", notifications: "account",
};

const copy = {
  en: {
    cards: {
      transfer: "Transfer money", bills: "Pay bills", topup: "Top up mobile", pin: "Change card PIN",
      freeze: "Freeze card", statements: "Monthly statements", phone: "Update phone number", notifications: "Notification settings",
    } as Record<CardId, string>,
    groups: { money: "Money", cards: "Cards & security", account: "Account & settings" } as Record<Group, string>,
    pickCard: "1. Pick a card",
    pickGroup: "2. Put “{card}” into a group",
    unsorted: "Unsorted",
    compare: "Compare with a suggested structure",
    yours: "You placed {n} of 8 like the suggestion.",
    note: "There’s no single right answer. “Monthly statements” could live in Money or Account — real card sorts with 15+ people show where people disagree, and that tells you which labels need work.",
    reset: "Start over",
    moveTo: "Move to {group}",
  },
  th: {
    cards: {
      transfer: "โอนเงิน", bills: "จ่ายบิล", topup: "เติมเงินมือถือ", pin: "เปลี่ยน PIN บัตร",
      freeze: "อายัดบัตร", statements: "สเตตเมนต์รายเดือน", phone: "เปลี่ยนเบอร์โทร", notifications: "ตั้งค่าการแจ้งเตือน",
    },
    groups: { money: "เรื่องเงิน", cards: "บัตรและความปลอดภัย", account: "บัญชีและการตั้งค่า" },
    pickCard: "1. เลือกการ์ด",
    pickGroup: "2. ใส่ “{card}” ลงในกลุ่ม",
    unsorted: "ยังไม่ได้จัด",
    compare: "เทียบกับโครงสร้างที่แนะนำ",
    yours: "คุณจัดตรงกับที่แนะนำ {n} จาก 8 ใบ",
    note: "ไม่มีคำตอบเดียวที่ถูก “สเตตเมนต์รายเดือน” อาจอยู่ในเรื่องเงินหรือบัญชีก็ได้ Card sorting จริงที่ทำกับคน 15 คนขึ้นไป จะเผยว่าคนเห็นต่างกันตรงไหน ซึ่งบอกว่าป้ายไหนยังต้องปรับ",
    reset: "เริ่มใหม่",
    moveTo: "ย้ายไป {group}",
  },
  zh: {
    cards: {
      transfer: "转账", bills: "缴费", topup: "手机充值", pin: "修改银行卡密码",
      freeze: "冻结银行卡", statements: "月度账单", phone: "修改手机号", notifications: "通知设置",
    },
    groups: { money: "资金", cards: "银行卡与安全", account: "账户与设置" },
    pickCard: "1. 选择一张卡片",
    pickGroup: "2. 把“{card}”放进一个分组",
    unsorted: "未分类",
    compare: "与建议的结构进行比较",
    yours: "你有 {n} 张（共 8 张）与建议一致。",
    note: "没有唯一正确的答案。“月度账单”可以放在资金下，也可以放在账户下——与 15 人以上进行的真实卡片分类会显示人们在哪里意见不同，从而告诉你哪些标签需要改进。",
    reset: "重新开始",
    moveTo: "移到{group}",
  },
  ja: {
    cards: {
      transfer: "振込", bills: "公共料金の支払い", topup: "携帯のチャージ", pin: "カードの暗証番号変更",
      freeze: "カードの利用停止", statements: "月次明細", phone: "電話番号の変更", notifications: "通知設定",
    },
    groups: { money: "お金", cards: "カードとセキュリティ", account: "アカウントと設定" },
    pickCard: "1. カードを選ぶ",
    pickGroup: "2. 「{card}」をグループに入れる",
    unsorted: "未分類",
    compare: "おすすめの構造と比べる",
    yours: "8 枚中 {n} 枚がおすすめと同じでした。",
    note: "正解はひとつではありません。「月次明細」は「お金」にも「アカウント」にも入りえます。15 人以上で行う本物のカードソーティングでは、意見が分かれる場所が見え、どのラベルを改善すべきかが分かります。",
    reset: "最初から",
    moveTo: "{group}に移動",
  },
};

export default function CardSortExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [placed, setPlaced] = useState<Partial<Record<CardId, Group>>>({});
  const [selected, setSelected] = useState<CardId | null>(null);
  const [compared, setCompared] = useState(false);

  const unsorted = CARDS.filter((c) => !placed[c]);
  const allPlaced = unsorted.length === 0;
  const matches = CARDS.filter((c) => placed[c] === SUGGESTED[c]).length;

  const place = (g: Group) => {
    if (!selected) return;
    setPlaced((p) => ({ ...p, [selected]: g }));
    setSelected(null);
  };

  const renderCard = (id: CardId, inGroup = false) => (
    <button
      key={id}
      type="button"
      aria-pressed={selected === id}
      onClick={() => setSelected((s) => (s === id ? null : id))}
      className={cn(
        "rounded-[var(--radius-sm)] border px-3 py-2 text-left text-[0.875rem] font-medium shadow-xs transition-colors",
        selected === id ? "border-accent bg-accent text-on-accent" : "border-line-strong bg-surface text-ink hover:border-accent/50",
        inGroup && compared && placed[id] !== SUGGESTED[id] && "border-dashed border-warning",
      )}
    >
      {t.cards[id]}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface/60 p-4">
        <p className="type-label mb-3">{selected ? t.pickGroup.replace("{card}", t.cards[selected]) : `${t.pickCard} · ${t.unsorted} (${unsorted.length})`}</p>
        <div className="flex min-h-10 flex-wrap gap-2">
          {unsorted.map((c) => renderCard(c))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {GROUPS.map((g) => (
          <div
            key={g}
            className={cn(
              "flex min-h-40 flex-col rounded-[var(--radius-lg)] border-2 bg-surface p-3 transition-colors",
              selected ? "border-accent/50 border-dashed" : "border-line",
            )}
          >
            <button
              type="button"
              onClick={() => place(g)}
              disabled={!selected}
              aria-label={selected ? t.moveTo.replace("{group}", t.groups[g]) : t.groups[g]}
              className={cn(
                "mb-3 flex h-11 items-center justify-between rounded-[var(--radius-sm)] px-3 text-left font-semibold transition-colors",
                selected ? "bg-accent-soft text-accent-ink hover:bg-accent hover:text-on-accent" : "text-ink",
              )}
            >
              {t.groups[g]}
              {selected ? <span aria-hidden>＋</span> : null}
            </button>
            <div className="flex flex-col gap-2">
              {CARDS.filter((c) => placed[c] === g).map((c) => renderCard(c, true))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 text-center" aria-live="polite">
        {allPlaced && !compared ? (
          <button
            type="button"
            onClick={() => {
              setCompared(true);
              experience();
            }}
            className="h-11 rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-90"
          >
            {t.compare}
          </button>
        ) : null}
        {compared ? (
          <>
            <p className="font-semibold text-ink">{t.yours.replace("{n}", String(matches))}</p>
            <p className="max-w-xl text-[0.875rem] text-ink-2">{t.note}</p>
            <button
              type="button"
              onClick={() => {
                setPlaced({});
                setCompared(false);
                setSelected(null);
              }}
              className="h-10 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface"
            >
              {t.reset}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
