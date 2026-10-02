"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Level = "interaction" | "journey" | "relationship" | null;
/** Which sentences are pain points, and at what level (NN/g’s three levels). */
const KEY: Level[] = [null, "journey", "interaction", "interaction", null, "relationship"];

const copy = {
  en: {
    who: "Ploy, 24 · first job in Bangkok · interview about paying bills",
    lines: [
      "I pay my phone and internet bills in the banking app every month.",
      "I never remember when they’re due, so sometimes I pay a late fee.",
      "Bill payment is hidden under ‘Other services’, so I always have to search for it.",
      "When I scan the QR code, it asks for my PIN twice. It’s annoying.",
      "I like that I get a slip I can save afterwards.",
      "If something goes wrong I have to call, and nobody picks up. I don’t feel the bank cares.",
    ],
    instruction: "Tap every sentence you think describes a pain point.",
    check: "Check my highlights",
    retry: "Try again",
    levels: { interaction: "Interaction-level", journey: "Journey-level", relationship: "Relationship-level" },
    notPain: "Not a pain point",
    notes: [
      "A behaviour — useful context, not a problem.",
      "The journey spans weeks: nothing reminds her before the due date.",
      "Findability: the label ‘Other services’ hides a frequent task.",
      "Friction in a single interaction.",
      "A delight — keep it when you redesign!",
      "The deepest level: trust in the whole relationship.",
    ],
    score: "You spotted {n} of 4 pain points{extra}.",
    extra: " (and flagged {m} that weren’t)",
  },
  th: {
    who: "พลอย อายุ 24 · ทำงานปีแรกในกรุงเทพฯ · สัมภาษณ์เรื่องการจ่ายบิล",
    lines: [
      "ฉันจ่ายค่าโทรศัพท์กับค่าเน็ตผ่านแอปธนาคารทุกเดือน",
      "ฉันจำไม่เคยได้ว่าบิลครบกำหนดวันไหน บางทีเลยโดนค่าปรับจ่ายช้า",
      "เมนูจ่ายบิลซ่อนอยู่ใน ‘บริการอื่น ๆ’ ทุกครั้งฉันเลยต้องพิมพ์ค้นหา",
      "ตอนสแกน QR มันถาม PIN สองรอบ น่ารำคาญมาก",
      "ชอบที่ได้สลิปที่เซฟเก็บไว้ได้",
      "ถ้ามีปัญหาต้องโทรไป แล้วก็ไม่มีใครรับสาย รู้สึกว่าธนาคารไม่ได้ใส่ใจ",
    ],
    instruction: "แตะทุกประโยคที่คุณคิดว่าเป็น Pain point",
    check: "ตรวจคำตอบ",
    retry: "ลองใหม่",
    levels: { interaction: "ระดับการโต้ตอบ", journey: "ระดับเส้นทางการใช้งาน", relationship: "ระดับความสัมพันธ์" },
    notPain: "ไม่ใช่ Pain point",
    notes: [
      "เป็นพฤติกรรม เป็นบริบทที่มีประโยชน์ ไม่ใช่ปัญหา",
      "เส้นทางยาวหลายสัปดาห์ และไม่มีอะไรเตือนเธอก่อนวันครบกำหนด",
      "ปัญหาการหาเจอ ป้าย ‘บริการอื่น ๆ’ ซ่อนงานที่ทำบ่อย",
      "ความติดขัดในการโต้ตอบครั้งเดียว",
      "เป็นสิ่งที่ผู้ใช้ชอบ เก็บไว้เมื่อออกแบบใหม่!",
      "ระดับลึกที่สุด: ความไว้ใจต่อความสัมพันธ์ทั้งหมด",
    ],
    score: "คุณเจอ Pain point {n} จาก 4 ข้อ{extra}",
    extra: " (และเลือกข้อที่ไม่ใช่ไป {m} ข้อ)",
  },
  zh: {
    who: "Ploy，24 岁 · 在曼谷的第一份工作 · 关于缴费的访谈",
    lines: [
      "我每个月都用银行 App 缴手机费和网费。",
      "我总记不住什么时候到期，所以有时会被收滞纳金。",
      "缴费功能藏在‘其他服务’里，所以我每次都得搜索。",
      "扫二维码时，它要我输两次 PIN 码，很烦人。",
      "我喜欢付完款能拿到一张可以保存的凭证。",
      "出了问题只能打电话，可是没人接。我觉得银行并不在乎我。",
    ],
    instruction: "点一下你认为描述了痛点的每一句话。",
    check: "检查我的标注",
    retry: "重新尝试",
    levels: { interaction: "交互层面", journey: "旅程层面", relationship: "关系层面" },
    notPain: "不是痛点",
    notes: [
      "这是一种行为——有用的背景信息，不是问题。",
      "旅程跨越数周：到期前没有任何提醒。",
      "可找性问题：‘其他服务’这个标签藏起了高频任务。",
      "单次交互中的摩擦。",
      "这是一个惊喜点——重新设计时要保留！",
      "最深的层面：对整段关系的信任。",
    ],
    score: "你找到了 4 个痛点中的 {n} 个{extra}。",
    extra: "（另外误标了 {m} 个）",
  },
  ja: {
    who: "プロイ（24 歳）· バンコクで社会人 1 年目 · 支払いについてのインタビュー",
    lines: [
      "毎月、携帯とネットの料金を銀行アプリで払っています。",
      "支払期限をいつも覚えていられなくて、ときどき延滞料を払っています。",
      "支払いメニューが「その他のサービス」に隠れていて、毎回検索しないといけません。",
      "QR を読み取ると PIN を 2 回聞かれます。うんざりします。",
      "あとで保存できる明細がもらえるのは好きです。",
      "何かあると電話するしかないのに、誰も出ません。銀行は気にかけてくれていないと感じます。",
    ],
    instruction: "ペインポイントだと思う文をすべてタップしてください。",
    check: "答え合わせ",
    retry: "もう一度",
    levels: { interaction: "操作レベル", journey: "ジャーニーレベル", relationship: "関係性レベル" },
    notPain: "ペインポイントではない",
    notes: [
      "行動です。役立つ背景情報で、問題ではありません。",
      "ジャーニーは数週間に及び、期限前に何も知らせてくれません。",
      "見つけやすさの問題。「その他のサービス」というラベルが、よく使うタスクを隠しています。",
      "1 回の操作の中の摩擦です。",
      "うれしいポイント。リデザインでも残しましょう！",
      "最も深いレベル。関係全体への信頼です。",
    ],
    score: "4 つのペインポイントのうち {n} つを見つけました{extra}。",
    extra: "（ペインポイントでない文を {m} つ選びました）",
  },
};

export default function PainPointsExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [picked, setPicked] = useState<boolean[]>(KEY.map(() => false));
  const [checked, setChecked] = useState(false);

  const found = KEY.filter((k, i) => k && picked[i]).length;
  const wrong = KEY.filter((k, i) => !k && picked[i]).length;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 text-center text-[0.8125rem] font-medium text-ink-2">{t.who}</p>
      <ol className="space-y-2">
        {t.lines.map((line, i) => {
          const isPain = KEY[i] !== null;
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={picked[i]}
                disabled={checked}
                onClick={() => setPicked((p) => p.map((v, j) => (j === i ? !v : v)))}
                className={cn(
                  "w-full rounded-[var(--radius-md)] border px-4 py-3 text-left text-[0.9375rem] leading-relaxed transition-colors",
                  !checked && (picked[i] ? "border-warning/50 bg-warning-soft text-ink" : "border-line bg-surface text-ink hover:border-line-strong"),
                  checked && isPain && "border-warning/50 bg-warning-soft text-ink",
                  checked && !isPain && "border-line bg-surface text-ink-2",
                )}
              >
                <span className="flex items-start gap-3">
                  <span className="tabular mt-0.5 text-[0.75rem] font-semibold text-ink-3">{i + 1}</span>
                  <span className="flex-1">
                    “{line}”
                    {checked ? (
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-[0.8125rem]">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                            isPain ? "bg-warning/15 text-warning" : "bg-surface-2 text-ink-2",
                          )}
                        >
                          {picked[i] === isPain ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
                          {isPain ? t.levels[KEY[i] as "interaction"] : t.notPain}
                        </span>
                        <span className="text-ink-2">{t.notes[i]}</span>
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex flex-col items-center gap-3" aria-live="polite">
        {checked ? (
          <>
            <p className="font-semibold text-ink">
              {t.score.replace("{n}", String(found)).replace("{extra}", wrong ? t.extra.replace("{m}", String(wrong)) : "")}
            </p>
            <button
              type="button"
              onClick={() => {
                setChecked(false);
                setPicked(KEY.map(() => false));
              }}
              className="h-10 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface"
            >
              {t.retry}
            </button>
          </>
        ) : (
          <>
            <p className="text-[0.8125rem] text-ink-2">{t.instruction}</p>
            <button
              type="button"
              onClick={() => {
                setChecked(true);
                experience();
              }}
              className="h-11 rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-90"
            >
              {t.check}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
