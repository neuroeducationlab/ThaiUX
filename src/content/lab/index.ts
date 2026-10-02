import type { Localized } from "@/i18n/localized";
import type { LabExperimentMeta } from "../types";

/** Molly’s UX Lab — the four experiments from the brief (A–D). */
export const experiments: LabExperimentMeta[] = [
  {
    id: "ux-detective",
    letter: "A",
    title: { th: "นักสืบ UX", en: "UX Detective", zh: "UX 侦探", ja: "UX 探偵" },
    question: {
      th: "คุณหาเจอไหมว่าอะไรผิด?",
      en: "Can you find what’s wrong?",
      zh: "你能找出哪里有问题吗？",
      ja: "どこが問題か見つけられますか？",
    },
    summary: {
      th: "หน้าชำระเงินของแอปสั่งอาหารที่มีปัญหา UX ซ่อนอยู่ 7 จุด คลิกส่วนที่น่าสงสัยเพื่อสืบสวน",
      en: "A food-delivery checkout hides seven UX problems. Click anything suspicious to investigate.",
      zh: "一个外卖结账页面里藏着 7 个 UX 问题。点击任何可疑之处进行调查。",
      ja: "フードデリバリーの購入画面に、UX の問題が 7 つ隠れています。怪しいところをクリックして調べましょう。",
    },
    minutes: 6,
    skills: {
      th: ["การประเมินด้วย Heuristics", "การหาปัญหา Usability", "การเรียกชื่อหลักการ UX"],
      en: ["Heuristic evaluation", "Spotting usability problems", "Naming UX principles"],
      zh: ["启发式评估", "发现可用性问题", "说出 UX 原则"],
      ja: ["ヒューリスティック評価", "ユーザビリティの問題発見", "UX 原則の言語化"],
    },
    concepts: ["usability", "affordance", "feedback", "error-state", "accessibility"],
  },
  {
    id: "make-it-better",
    letter: "B",
    title: { th: "ทำให้ดีขึ้น", en: "Make It Better", zh: "让它更好", ja: "もっと良くしよう" },
    question: {
      th: "คุณจะปรับปรุงหน้านี้อย่างไร?",
      en: "How would you improve this?",
      zh: "你会如何改进它？",
      ja: "あなたならどう改善しますか？",
    },
    summary: {
      th: "หน้าจองโต๊ะร้านอาหารที่ยังไม่ดี ลองปรับป้ายปุ่ม ขนาด ตำแหน่ง ลำดับชั้น ระยะห่าง และ Feedback แล้วดูผลทันที",
      en: "A weak table-booking screen. Tune the button label, size, position, hierarchy, spacing and feedback — and see the result instantly.",
      zh: "一个不太好的餐厅订座页面。调整按钮文字、大小、位置、层级、间距和反馈——立即看到效果。",
      ja: "いまひとつのレストラン予約画面。ボタンのラベル、サイズ、位置、階層、余白、フィードバックを調整して、結果をすぐに確かめましょう。",
    },
    minutes: 5,
    skills: {
      th: ["Microcopy", "ลำดับชั้นทางสายตา", "กฎของ Fitts", "Feedback"],
      en: ["Microcopy", "Visual hierarchy", "Fitts’s Law", "Feedback"],
      zh: ["微文案", "视觉层级", "费茨定律", "反馈"],
      ja: ["マイクロコピー", "視覚的階層", "フィッツの法則", "フィードバック"],
    },
    concepts: ["button", "feedback", "click", "default-state"],
  },
  {
    id: "which-would-you-choose",
    letter: "C",
    title: { th: "คุณจะเลือกแบบไหน?", en: "Which Would You Choose?", zh: "你会选哪个？", ja: "どちらを選ぶ？" },
    question: {
      th: "แบบไหนใช้ง่ายกว่ากัน?",
      en: "Which feels easier to use?",
      zh: "哪一个用起来更顺手？",
      ja: "どちらが使いやすいと感じますか？",
    },
    summary: {
      th: "สี่สถานการณ์ สองดีไซน์ ไม่มีคำตอบเดียวที่ถูก เลือกแล้วดูข้อดีข้อเสียและหลักการเบื้องหลัง",
      en: "Four scenarios, two designs each. There’s no single right answer — choose, then explore the trade-offs and principles behind them.",
      zh: "四个场景，每个两种设计。没有唯一正确的答案——做出选择，然后探索背后的利弊和原则。",
      ja: "4 つのシナリオに、それぞれ 2 つのデザイン。正解はひとつではありません。選んでから、トレードオフと背後にある原則を見てみましょう。",
    },
    minutes: 6,
    skills: {
      th: ["การชั่งน้ำหนักข้อดีข้อเสีย", "บริบทการใช้งาน", "Design pattern"],
      en: ["Reasoning about trade-offs", "Context of use", "Design patterns"],
      zh: ["权衡利弊", "使用情境", "设计模式"],
      ja: ["トレードオフの判断", "利用状況", "デザインパターン"],
    },
    concepts: ["usability", "scroll", "toggle", "modal"],
  },
  {
    id: "build-a-button",
    letter: "D",
    title: { th: "สร้างปุ่มของคุณเอง", en: "Build a Button", zh: "做一个按钮", ja: "ボタンをつくろう" },
    question: {
      th: "ปุ่มหนึ่งปุ่มต้องออกแบบกี่สถานะ?",
      en: "How many states does one button need?",
      zh: "一个按钮需要设计多少种状态？",
      ja: "ひとつのボタンに、いくつの状態が必要？",
    },
    summary: {
      th: "ปรับป้าย ขนาด ไอคอน และสไตล์ แล้วดูปุ่มของคุณในทุกสถานะ ตั้งแต่ Default ถึง Loading พร้อมโค้ดที่ใช้ได้จริง",
      en: "Set the label, size, icon and style, then see your button in every state — Default to Loading — with code you can use.",
      zh: "设置文字、大小、图标和样式，然后查看你的按钮在每一种状态下的样子——从默认到加载——并附上可用的代码。",
      ja: "ラベル、サイズ、アイコン、スタイルを決めて、デフォルトから読み込み中まで、すべての状態のボタンを確認。使えるコード付き。",
    },
    minutes: 5,
    skills: {
      th: ["UI States", "Affordance", "Design token"],
      en: ["UI states", "Affordance", "Design tokens"],
      zh: ["UI 状态", "示能", "设计令牌"],
      ja: ["UI の状態", "アフォーダンス", "デザイントークン"],
    },
    concepts: ["button", "hover", "active-state", "focus-state", "disabled-state", "loading-state"],
  },
];

export function getExperiment(id: string) {
  return experiments.find((e) => e.id === id);
}

export function experimentNeighbours(id: string) {
  const i = experiments.findIndex((e) => e.id === id);
  return { prev: i > 0 ? experiments[i - 1] : undefined, next: i >= 0 && i < experiments.length - 1 ? experiments[i + 1] : undefined };
}

/**
 * Real-World UX — the future-ready section from the brief. Each entry will
 * become a short teardown of an everyday interface type. Kept generic on
 * purpose: no real brands are critiqued without research and permission.
 */
export const realWorld: { id: string; title: Localized; question: Localized }[] = [
  {
    id: "food-checkout",
    title: { th: "หน้าชำระเงินแอปสั่งอาหาร", en: "Food-delivery checkout", zh: "外卖结账页", ja: "フードデリバリーの購入画面" },
    question: {
      th: "ทำไมค่าส่งถึงโผล่มาตอนท้ายสุด?",
      en: "Why does the delivery fee only appear at the very end?",
      zh: "为什么配送费到最后才出现？",
      ja: "なぜ配送料は最後になって表示されるの？",
    },
  },
  {
    id: "bank-transfer",
    title: { th: "การโอนเงินในแอปธนาคาร", en: "Mobile-banking transfer", zh: "手机银行转账", ja: "モバイルバンキングの送金" },
    question: {
      th: "หน้ายืนยันช่วยป้องกันความผิดพลาดราคาแพงได้อย่างไร?",
      en: "How does a confirmation screen prevent expensive mistakes?",
      zh: "确认页面如何防止代价高昂的错误？",
      ja: "確認画面は、どうやって高くつくミスを防ぐ？",
    },
  },
  {
    id: "gov-form",
    title: { th: "แบบฟอร์มบริการภาครัฐออนไลน์", en: "Government e-service form", zh: "政务服务在线表单", ja: "行政サービスのオンライン申請" },
    question: {
      th: "จะทำให้ฟอร์มยาว ๆ ดูไม่น่ากลัวได้อย่างไร?",
      en: "How do you make a long form feel manageable?",
      zh: "如何让长表单不再令人生畏？",
      ja: "長いフォームを、負担に感じさせないには？",
    },
  },
];
