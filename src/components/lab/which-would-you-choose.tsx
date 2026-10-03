"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Menu, Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format, pick, type Localized } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { useCopy } from "@/components/demos/use-copy";
import { CompletionCard, useLabComplete } from "./lab-shell";

/**
 * Lab C — Which would you choose?
 * All four scenarios on one page: no "Next" button, no slider. Mocks and
 * trade-offs are visible without any tap; tapping A or B marks your pick,
 * reveals the "in this context" note, and counts toward completion.
 */

type MockId = "hamburger" | "tabbar" | "infinite" | "loadmore" | "toggles" | "checkboxes" | "longform" | "wizard";
type Side = { name: Localized; mock: MockId; pros: Localized<string[]>; cons: Localized<string[]>; when: Localized };
type Scenario = { id: string; title: Localized; context: Localized; a: Side; b: Side; principles: Localized<string[]>; note: Localized };

const SCENARIOS: Scenario[] = [
  {
    id: "nav",
    title: { en: "Navigation for a news app", th: "เมนูนำทางของแอปข่าว", zh: "新闻 App 的导航", ja: "ニュースアプリのナビゲーション" },
    context: {
      en: "Five main sections — Top, Local, World, Sport, Saved — used every day on a phone.",
      th: "ห้าหมวดหลัก ได้แก่ ข่าวเด่น ในประเทศ ต่างประเทศ กีฬา และที่บันทึกไว้ ใช้ทุกวันบนมือถือ",
      zh: "五个主要栏目——头条、本地、国际、体育、收藏——每天在手机上使用。",
      ja: "トップ、国内、海外、スポーツ、保存済みの 5 つのセクション。毎日スマホで使われます。",
    },
    a: {
      name: { en: "Hamburger menu", th: "เมนูแฮมเบอร์เกอร์", zh: "汉堡菜单", ja: "ハンバーガーメニュー" },
      mock: "hamburger",
      pros: {
        en: ["Saves screen space", "Scales to many sections"],
        th: ["ประหยัดพื้นที่หน้าจอ", "รองรับหมวดจำนวนมากได้"],
        zh: ["节省屏幕空间", "能容纳很多栏目"],
        ja: ["画面のスペースを節約できる", "セクションが増えても対応できる"],
      },
      cons: {
        en: ["Out of sight — hidden sections get used less", "Two taps to switch sections"],
        th: ["มองไม่เห็นก็ลืม หมวดที่ซ่อนไว้ถูกใช้น้อยลง", "ต้องแตะสองครั้งเพื่อเปลี่ยนหมวด"],
        zh: ["看不见就被遗忘——隐藏的栏目用得更少", "切换栏目需要点两下"],
        ja: ["見えないものは忘れられる", "セクションの切り替えに 2 タップ必要"],
      },
      when: {
        en: "Many destinations, or ones people rarely need.",
        th: "ปลายทางจำนวนมาก หรือเป็นหน้าที่คนใช้ไม่บ่อย",
        zh: "目的地很多，或者人们很少需要它们。",
        ja: "行き先が多い、またはあまり使われない場合。",
      },
    },
    b: {
      name: { en: "Bottom tab bar", th: "แถบแท็บด้านล่าง", zh: "底部标签栏", ja: "下部タブバー" },
      mock: "tabbar",
      pros: {
        en: ["Sections always visible", "One tap, thumb reach"],
        th: ["เห็นหมวดตลอดเวลา", "แตะครั้งเดียว อยู่ในระยะนิ้วโป้ง"],
        zh: ["栏目一直可见", "一次点击，拇指可及"],
        ja: ["セクションが常に見える", "親指で 1 タップ"],
      },
      cons: {
        en: ["Uses ~68 px at the bottom", "Doesn’t scale past 5 items"],
        th: ["กินพื้นที่ด้านล่าง ~68 px", "เกิน 5 รายการไม่เหมาะ"],
        zh: ["占用底部约 68 px", "超过 5 个项目就不合适"],
        ja: ["画面下に約 68 px 使う", "5 項目を超えると不向き"],
      },
      when: {
        en: "Five or fewer destinations that people use often.",
        th: "ปลายทางไม่เกินห้าที่ ที่คนใช้บ่อย",
        zh: "五个以内、人们经常使用的目的地。",
        ja: "よく使う行き先が 5 つ以下のとき。",
      },
    },
    principles: {
      en: ["Recognition over recall", "Thumb-zone reach"],
      th: ["เห็นดีกว่าจำ (Recognition over recall)", "ระยะนิ้วโป้ง"],
      zh: ["识别优于记忆", "拇指区域可达"],
      ja: ["思い出すより認識", "親指ゾーン"],
    },
    note: {
      en: "Only five sections, used daily → a tab bar wins. If sections ever grow past six, revisit this.",
      th: "ห้าหมวดและใช้ทุกวัน → แถบแท็บเหมาะกว่า ถ้าหมวดเกินหกค่อยกลับมาคิดใหม่",
      zh: "只有五个栏目，每天都用 → 标签栏更合适。将来超过六个再重新考虑。",
      ja: "セクションは 5 つで毎日使う → タブバーが有利。6 を超えたら見直す。",
    },
  },
  {
    id: "list",
    title: {
      en: "A list of 2,000 products",
      th: "รายการสินค้า 2,000 รายการ",
      zh: "2,000 件商品的列表",
      ja: "2,000 件の商品リスト",
    },
    context: {
      en: "People browse to discover, but also come back to find a specific item.",
      th: "ผู้คนเลื่อนดูเพื่อค้นพบของใหม่ แต่ก็กลับมาเพื่อหาของเดิมด้วย",
      zh: "人们一边浏览发现，也会回来找特定的商品。",
      ja: "眺めて発見する人もいれば、特定の商品を探しに戻ってくる人もいる。",
    },
    a: {
      name: { en: "Infinite scroll", th: "เลื่อนไม่สิ้นสุด", zh: "无限滚动", ja: "無限スクロール" },
      mock: "infinite",
      pros: {
        en: ["Feels effortless to browse", "No pagination to think about"],
        th: ["เลื่อนดูเพลิน ไม่ต้องคิด", "ไม่ต้องสนใจเลขหน้า"],
        zh: ["浏览时感觉毫不费力", "无需考虑分页"],
        ja: ["眺めるのがラク", "ページ番号を気にしなくていい"],
      },
      cons: {
        en: ["Hard to come back to a specific spot", "The footer disappears forever"],
        th: ["กลับมาที่จุดเดิมยาก", "เห็น Footer ไม่ได้"],
        zh: ["很难回到特定位置", "再也看不到页脚"],
        ja: ["特定の場所に戻るのが難しい", "フッターにたどり着けない"],
      },
      when: {
        en: "Discovery-first feeds (social, images) where the order doesn’t matter.",
        th: "ฟีดที่เน้นค้นพบ (โซเชียล รูปภาพ) ที่ลำดับไม่สำคัญ",
        zh: "以发现为主的信息流（社交、图片），顺序无关紧要。",
        ja: "発見が主役のフィード（SNS、画像）で順序が重要でない場合。",
      },
    },
    b: {
      name: { en: "Load more + search", th: "ปุ่ม “โหลดเพิ่ม” + ค้นหา", zh: "“加载更多” + 搜索", ja: "「もっと見る」＋検索" },
      mock: "loadmore",
      pros: {
        en: ["Natural pause points", "URL remembers your place"],
        th: ["มีจุดพักเป็นธรรมชาติ", "URL จำตำแหน่งได้"],
        zh: ["有自然的停顿点", "URL 能记住你的位置"],
        ja: ["自然な区切りがある", "URL に居場所が残る"],
      },
      cons: {
        en: ["One more tap to see more"],
        th: ["ต้องแตะเพิ่มเพื่อดูมากขึ้น"],
        zh: ["多点一下才看到更多"],
        ja: ["続きを見るのに 1 タップ必要"],
      },
      when: {
        en: "Catalogues people return to — commerce, documentation, search results.",
        th: "แค็ตตาล็อกที่คนกลับมาใช้ซ้ำ เช่น ร้านค้า เอกสาร ผลค้นหา",
        zh: "人们会回来查看的目录——电商、文档、搜索结果。",
        ja: "何度も戻ってくるカタログ系（EC、ドキュメント、検索結果）。",
      },
    },
    principles: {
      en: ["Findability", "User control", "Jakob’s Law"],
      th: ["ความสามารถในการค้นหา (Findability)", "ผู้ใช้ควบคุมได้", "กฎของ Jakob"],
      zh: ["可发现性", "用户控制", "雅各布定律"],
      ja: ["見つけやすさ", "ユーザー主導", "ジェイコブの法則"],
    },
    note: {
      en: "People return to find things, so load-more wins. Keep a prominent search for direct access.",
      th: "คนกลับมาค้นของเดิม → “โหลดเพิ่ม” เหมาะกว่า และต้องมีช่องค้นหาที่โดดเด่น",
      zh: "人们会回来找特定商品 → “加载更多”更合适，并保留显眼的搜索框。",
      ja: "特定の商品を探しに戻る人が多い → 「もっと見る」が有利。目立つ検索を残す。",
    },
  },
  {
    id: "settings",
    title: {
      en: "Notification settings",
      th: "ตั้งค่าการแจ้งเตือน",
      zh: "通知设置",
      ja: "通知の設定",
    },
    context: {
      en: "A list of 6 notification types people may want to turn on or off.",
      th: "รายการประเภทการแจ้งเตือน 6 แบบที่ผู้ใช้อาจเปิดหรือปิด",
      zh: "6 种通知类型，用户可能想开或关。",
      ja: "6 種類の通知を、オン・オフしたい。",
    },
    a: {
      name: { en: "Toggles (apply immediately)", th: "สวิตช์ (มีผลทันที)", zh: "开关（立即生效）", ja: "トグル（即時反映）" },
      mock: "toggles",
      pros: {
        en: ["No Save button to miss", "Each change is confirmed"],
        th: ["ไม่มีปุ่ม Save ให้ลืม", "ยืนยันทุกการเปลี่ยนแปลง"],
        zh: ["不会漏点保存按钮", "每次修改都会确认"],
        ja: ["保存を押し忘れない", "変更がその場で確定"],
      },
      cons: {
        en: ["Undoing a mistake takes a second tap"],
        th: ["แก้ความผิดพลาดต้องแตะอีกครั้ง"],
        zh: ["撤销错误需要再点一下"],
        ja: ["間違いを戻すにはもう 1 タップ"],
      },
      when: {
        en: "Independent, immediate preferences (notifications, dark mode).",
        th: "ค่าที่เป็นอิสระต่อกันและมีผลทันที (การแจ้งเตือน โหมดมืด)",
        zh: "彼此独立、立即生效的偏好设置（通知、暗色模式）。",
        ja: "それぞれ独立し、すぐ反映する設定（通知、ダークモード）。",
      },
    },
    b: {
      name: { en: "Checkboxes + Save", th: "ช่องติ๊ก + ปุ่มบันทึก", zh: "复选框 + 保存", ja: "チェックボックス＋保存" },
      mock: "checkboxes",
      pros: {
        en: ["Review everything before committing", "Easy to try combinations"],
        th: ["ตรวจทานทั้งหมดก่อนยืนยัน", "ลองสลับการตั้งค่าได้ง่าย"],
        zh: ["提交前可以通盘检查", "方便尝试不同组合"],
        ja: ["確定前に全体を確認できる", "組み合わせを試しやすい"],
      },
      cons: {
        en: ["Easy to forget the Save button", "Nothing happens until you press it"],
        th: ["ลืมกด Save ได้ง่าย", "ไม่มีอะไรเกิดขึ้นจนกว่าจะกด"],
        zh: ["容易忘记点保存", "不点就什么都没发生"],
        ja: ["保存ボタンを忘れがち", "押すまで何も起こらない"],
      },
      when: {
        en: "Form fields that must be submitted as a set.",
        th: "ช่องกรอกฟอร์มที่ต้องส่งพร้อมกัน",
        zh: "必须整组提交的表单字段。",
        ja: "まとめて送信するフォーム項目。",
      },
    },
    principles: {
      en: ["Immediate feedback", "Error prevention"],
      th: ["Feedback ทันที", "ป้องกันความผิดพลาด"],
      zh: ["即时反馈", "错误预防"],
      ja: ["即時フィードバック", "エラー予防"],
    },
    note: {
      en: "Each notification is independent → toggles win. Save buttons are for data you’re submitting together.",
      th: "แต่ละการแจ้งเตือนเป็นอิสระต่อกัน → สวิตช์เหมาะกว่า Save เอาไว้ใช้กับข้อมูลที่ต้องส่งพร้อมกัน",
      zh: "每种通知彼此独立 → 开关更合适。保存按钮用于一起提交的数据。",
      ja: "通知は独立しているので → トグルが有利。保存はまとめて送るデータに。",
    },
  },
  {
    id: "form",
    title: {
      en: "Open a bank account",
      th: "เปิดบัญชีธนาคาร",
      zh: "开立银行账户",
      ja: "銀行口座を開く",
    },
    context: {
      en: "A long form with 20+ fields — identity, address, employment, consents.",
      th: "ฟอร์มยาวมีช่องกรอกกว่า 20 ช่อง เช่น ตัวตน ที่อยู่ อาชีพ ความยินยอม",
      zh: "一个超过 20 个字段的长表单——身份、地址、职业、同意条款。",
      ja: "20 以上の項目がある長いフォーム。本人情報、住所、職業、同意事項。",
    },
    a: {
      name: { en: "One long page", th: "หน้ายาวหน้าเดียว", zh: "一个长页面", ja: "長い 1 ページ" },
      mock: "longform",
      pros: {
        en: ["You see the whole scope upfront", "Edit anything without navigating"],
        th: ["เห็นภาพรวมทั้งหมดตั้งแต่แรก", "แก้ช่องไหนก็ได้ โดยไม่ต้องเลื่อนหน้า"],
        zh: ["一开始就看到整体", "编辑任何字段都不用切换"],
        ja: ["最初に全体像が見える", "どの項目でもすぐ編集できる"],
      },
      cons: {
        en: ["Overwhelming on a phone", "No clear sense of progress"],
        th: ["น่าหวาดเสียวบนมือถือ", "ไม่เห็นความคืบหน้าชัด"],
        zh: ["手机上让人望而生畏", "没有明确的进度感"],
        ja: ["スマホでは圧倒される", "進捗が見えにくい"],
      },
      when: {
        en: "Short forms, or when people need to review everything together.",
        th: "ฟอร์มสั้น ๆ หรือเมื่อต้องตรวจทานทุกอย่างพร้อมกัน",
        zh: "短表单，或需要一起检查所有内容时。",
        ja: "短いフォームや、まとめて見直す必要があるとき。",
      },
    },
    b: {
      name: { en: "Step by step", th: "ทีละขั้นตอน", zh: "分步填写", ja: "ステップごと" },
      mock: "wizard",
      pros: {
        en: ["One thing at a time — less to think about", "Progress is visible (Step 2 of 4)"],
        th: ["ทีละเรื่อง คิดน้อยลง", "เห็นความคืบหน้า (ขั้นตอน 2 จาก 4)"],
        zh: ["一次只做一件事，更省心", "进度清晰（第 2 步，共 4 步）"],
        ja: ["一度にひとつ、考えることが少ない", "進捗が見える（ステップ 2／4）"],
      },
      cons: {
        en: ["Can’t see the whole task upfront", "Going back must be easy"],
        th: ["มองไม่เห็นงานทั้งหมดตั้งแต่แรก", "ต้องย้อนกลับได้ง่าย"],
        zh: ["开始看不到整个任务", "必须方便返回"],
        ja: ["最初に全体が見えない", "戻るのが簡単である必要がある"],
      },
      when: {
        en: "Long or branching forms, especially on mobile.",
        th: "ฟอร์มยาวหรือแตกแขนง โดยเฉพาะบนมือถือ",
        zh: "长表单或有分支的表单，尤其在手机上。",
        ja: "長いフォームや分岐フォーム、特にスマホで。",
      },
    },
    principles: {
      en: ["Cognitive load", "Visibility of progress"],
      th: ["ภาระทางความคิด", "เห็นความคืบหน้า"],
      zh: ["认知负荷", "进度可见"],
      ja: ["認知負荷", "進捗の可視化"],
    },
    note: {
      en: "20+ fields on a phone → step by step wins, with a progress bar and an easy Back.",
      th: "ช่องกรอกกว่า 20 ช่องบนมือถือ → ทีละขั้นตอนเหมาะกว่า พร้อมแถบความคืบหน้าและปุ่มย้อนกลับที่ง่าย",
      zh: "手机上 20+ 字段 → 分步填写更合适，配进度条和方便的返回。",
      ja: "スマホで 20+ 項目 → ステップごとが有利。進捗バーと戻るボタンを忘れずに。",
    },
  },
];

const copy = {
  en: {
    intro: "Four everyday decisions, no single right answer. Weigh each A against B — the trade-offs are the lesson.",
    pros: "Strengths",
    cons: "Costs",
    pickA: "I’d pick A",
    pickB: "I’d pick B",
    yourChoice: "Your pick",
    inContext: "In this context",
    principles: "Principles",
    progress: "{n} of {total} reflected",
    doneTitle: "You weighed four trade-offs.",
    doneBody: "Good designers don’t memorise the “right” pattern — they weigh the context. You just did.",
  },
  th: {
    intro: "สี่การตัดสินใจในชีวิตประจำวัน ไม่มีคำตอบเดียว ลองชั่งน้ำหนัก A กับ B สิ่งที่ต้องแลกคือบทเรียน",
    pros: "จุดแข็ง",
    cons: "สิ่งที่ต้องแลก",
    pickA: "ฉันเลือก A",
    pickB: "ฉันเลือก B",
    yourChoice: "เลือก",
    inContext: "ในบริบทนี้",
    principles: "หลักการ",
    progress: "คิดแล้ว {n} จาก {total}",
    doneTitle: "คุณชั่งน้ำหนักสี่สถานการณ์แล้ว",
    doneBody: "นักออกแบบที่ดีไม่ท่องจำ “แพทเทิร์นที่ถูก” แต่ชั่งน้ำหนักตามบริบท ซึ่งคุณเพิ่งทำ",
  },
  zh: {
    intro: "四个日常决定，没有唯一答案。权衡每一组 A 和 B——取舍本身就是课程。",
    pros: "优势",
    cons: "代价",
    pickA: "我选 A",
    pickB: "我选 B",
    yourChoice: "你的选择",
    inContext: "在这个情境下",
    principles: "原则",
    progress: "已思考 {n} / {total}",
    doneTitle: "你权衡了四个取舍。",
    doneBody: "好的设计师不会死记“正确”的模式——他们根据情境权衡。你刚刚做到了。",
  },
  ja: {
    intro: "4 つの日常の判断に正解はひとつじゃない。A と B を比べてみよう——トレードオフこそが学び。",
    pros: "強み",
    cons: "代償",
    pickA: "A を選ぶ",
    pickB: "B を選ぶ",
    yourChoice: "あなたの選択",
    inContext: "この文脈では",
    principles: "原則",
    progress: "{n} / {total} 考えた",
    doneTitle: "4 つのトレードオフを比べました。",
    doneBody: "良いデザイナーは「正解のパターン」を暗記しない。文脈に合わせて判断します。いま、まさにそれ。",
  },
};

export function WhichWouldYouChoose() {
  const t = useCopy(copy);
  const { locale } = useI18n();
  const [choices, setChoices] = useState<Record<string, "a" | "b">>({});
  const doneRef = useRef<HTMLDivElement>(null);
  const n = Object.keys(choices).length;
  const done = n === SCENARIOS.length;
  useLabComplete("which-would-you-choose", done);
  useEffect(() => {
    if (done && doneRef.current) doneRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [done]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-2">{t.intro}</p>
        <p className="tabular shrink-0 rounded-full border border-line-strong bg-surface px-3 py-1 text-[0.8125rem] font-semibold text-ink">
          {format(t.progress, { n, total: SCENARIOS.length })}
        </p>
      </div>

      <ol className="space-y-10">
        {SCENARIOS.map((s, i) => {
          const chosen = choices[s.id];
          return (
            <li key={s.id} className="border-t border-line pt-8 first:border-t-0 first:pt-0">
              <div className="mb-5">
                <p className="tabular text-[0.8125rem] font-semibold text-accent-ink">0{i + 1}</p>
                <h2 className="type-h3 mt-1">{pick(s.title, locale)}</h2>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{pick(s.context, locale)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {(["a", "b"] as const).map((key) => {
                  const d = s[key];
                  const isChosen = chosen === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setChoices((c) => ({ ...c, [s.id]: key }))}
                      aria-pressed={isChosen}
                      className={cn(
                        "flex flex-col rounded-[var(--radius-xl)] border-2 bg-surface p-3 text-left transition-colors sm:p-5",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                        isChosen ? "border-accent" : "border-line hover:border-line-strong",
                      )}
                    >
                      <div className="mb-3 flex min-h-7 items-center justify-between gap-1 sm:mb-4">
                        <span className="flex size-7 items-center justify-center rounded-full bg-ink text-[0.8125rem] font-bold text-bg sm:size-8 sm:text-sm">{key.toUpperCase()}</span>
                        {isChosen ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-[0.6875rem] font-semibold text-accent-ink sm:text-[0.75rem]">
                            <Check className="size-3" aria-hidden /> {t.yourChoice}
                          </span>
                        ) : null}
                      </div>
                      <Mock id={d.mock} />
                      <p className="mt-3 text-center text-[0.9375rem] leading-snug font-semibold text-ink sm:mt-4 sm:text-[1.0625rem]">{pick(d.name, locale)}</p>

                      <dl className="mt-4 space-y-2 text-[0.8125rem] sm:text-[0.875rem]">
                        <div>
                          <dt className="sr-only">{t.pros}</dt>
                          <dd>
                            <ul className="space-y-1 text-ink-2">
                              {pick(d.pros, locale).map((p) => (
                                <li key={p} className="flex gap-1.5">
                                  <Plus className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden /> {p}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        <div>
                          <dt className="sr-only">{t.cons}</dt>
                          <dd>
                            <ul className="space-y-1 text-ink-2">
                              {pick(d.cons, locale).map((p) => (
                                <li key={p} className="flex gap-1.5">
                                  <Minus className="mt-0.5 size-3.5 shrink-0 text-error" aria-hidden /> {p}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                    </button>
                  );
                })}
              </div>

              <div className={cn("mt-4 rounded-[var(--radius-lg)] p-4 text-[0.9375rem] transition-colors", chosen ? "bg-accent-soft text-ink" : "bg-surface-2 text-ink-2")}>
                <p className="type-label mb-1 text-accent-ink">{t.inContext}</p>
                <p>{pick(s.note, locale)}</p>
                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.75rem]">
                  <span className="font-semibold text-ink-2">{t.principles}:</span>
                  {pick(s.principles, locale).map((p) => (
                    <span key={p} className="rounded-full bg-surface px-2 py-0.5 font-semibold text-ink">
                      {p}
                    </span>
                  ))}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div ref={doneRef} className="mt-10">
        {done ? <CompletionCard title={t.doneTitle}>{t.doneBody}</CompletionCard> : null}
      </div>
    </div>
  );
}

/* -------------------------- Mocks (phone silhouettes) -------------------------- */

function Mock({ id }: { id: MockId }) {
  const line = (w: string, extra = "") => <span className={cn("block h-1.5 rounded bg-[#d9d9de]", w, extra)} />;
  const shell = (children: React.ReactNode) => (
    <div className="mx-auto h-40 w-[6.5rem] overflow-hidden rounded-[0.9rem] border-[3px] border-[#1c1c22] bg-white text-[#1a1a1e] sm:h-48 sm:w-[7.5rem]" aria-hidden>
      {children}
    </div>
  );
  switch (id) {
    case "hamburger":
      return shell(
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1.5 border-b border-[#eee] px-2 py-2">
            <Menu className="size-3" />
            {line("w-8")}
          </div>
          <div className="space-y-1.5 p-2">
            <span className="block h-10 rounded bg-[#ececf0]" />
            {line("w-full")}
            {line("w-4/5")}
            <span className="block h-6 rounded bg-[#ececf0]" />
            {line("w-3/5")}
          </div>
        </div>,
      );
    case "tabbar":
      return shell(
        <div className="flex h-full flex-col">
          <div className="border-b border-[#eee] px-2 py-2">{line("w-10")}</div>
          <div className="flex-1 space-y-1.5 p-2">
            <span className="block h-10 rounded bg-[#ececf0]" />
            {line("w-full")}
            {line("w-3/4")}
          </div>
          <div className="flex items-center justify-around border-t border-[#eee] py-1.5">
            {[0, 1, 2, 3, 4].map((n) => (
              <span key={n} className={cn("size-1.5 rounded-full", n === 0 ? "bg-[#3343c4]" : "bg-[#ddd]")} />
            ))}
          </div>
        </div>,
      );
    case "infinite":
      return shell(
        <div className="space-y-1.5 p-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="block h-3.5 rounded bg-[#ececf0]" style={{ opacity: 1 - i * 0.09 }} />
          ))}
        </div>,
      );
    case "loadmore":
      return shell(
        <div className="flex h-full flex-col gap-1.5 p-2">
          <span className="block h-3.5 rounded bg-[#ececf0]" />
          <span className="block h-3.5 rounded bg-[#ececf0]" />
          <span className="block h-3.5 rounded bg-[#ececf0]" />
          <span className="block h-3.5 rounded bg-[#ececf0]" />
          <span className="mt-auto flex h-7 items-center justify-center rounded-full border border-[#1a1a1e] text-[0.6rem] font-semibold">+ more</span>
        </div>,
      );
    case "toggles":
      return shell(
        <div className="space-y-2 p-2">
          {[true, false, true, false].map((on, i) => (
            <div key={i} className="flex items-center justify-between">
              {line("w-10")}
              <span className={cn("block h-3 w-5 rounded-full", on ? "bg-[#1d7348]" : "bg-[#ddd]")}>
                <span className={cn("block size-2.5 translate-y-[1px] rounded-full bg-white shadow-sm", on && "translate-x-[9px]")} />
              </span>
            </div>
          ))}
        </div>,
      );
    case "checkboxes":
      return shell(
        <div className="flex h-full flex-col">
          <div className="space-y-2 p-2">
            {[true, true, false, true].map((on, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className={cn("block size-2.5 rounded-sm border", on ? "border-[#1a1a1e] bg-[#1a1a1e]" : "border-[#9a9aa2]")} />
                {line("w-full")}
              </div>
            ))}
          </div>
          <span className="mx-2 mt-auto mb-2 flex h-6 items-center justify-center rounded bg-[#3343c4] text-[0.55rem] font-semibold text-white">Save</span>
        </div>,
      );
    case "longform":
      return shell(
        <div className="space-y-1.5 p-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className="block h-3 rounded border border-[#ddd]" />
          ))}
        </div>,
      );
    case "wizard":
      return shell(
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1 px-2 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full", i === 0 ? "bg-[#3343c4]" : "bg-[#ddd]")} />
            ))}
          </div>
          <p className="px-2 pt-1 text-[0.5rem] text-[#5c5c66]">Step 1 / 4</p>
          <div className="space-y-1.5 p-2 pt-1">
            <span className="block h-3 rounded border border-[#ddd]" />
            <span className="block h-3 rounded border border-[#ddd]" />
          </div>
          <span className="mx-2 mt-auto mb-2 flex h-6 items-center justify-center rounded bg-[#3343c4] text-[0.55rem] font-semibold text-white">Next →</span>
        </div>,
      );
  }
}
