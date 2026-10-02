"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, CircleAlert, Copy, Download, Info, Plus, X } from "lucide-react";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { contrastRatio, parseHex, WCAG } from "@/lib/contrast";
import { SegmentedControl, Tabs } from "@/components/ui/controls";
import { Spinner } from "@/components/ui/button";
import { useCopy } from "@/components/demos/use-copy";
import { CompletionCard, useLabComplete } from "./lab-shell";

/* ------------------------------------------------------------------
 * Lab D — Build a Button.
 * One element, every decision: label, style, colour, size, corners,
 * icon. The preview is a real <button>; the states strip shows all six
 * states; the health check scores label, contrast (in every state),
 * target size and feedback; the code is generated from the same data.
 * ---------------------------------------------------------------- */

type Size = "s" | "m" | "l";
type ColourId = "indigo" | "forest" | "rose" | "tangerine" | "sky" | "graphite";
type TextTone = "white" | "dark";
type Variant = "filled" | "outline" | "text";
type Corners = "square" | "rounded" | "pill";
type IconPos = "none" | "before" | "after" | "only";
type Glyph = "arrow" | "plus" | "download";
type Opts = { variant: Variant; colour: ColourId; text: TextTone; size: Size; corners: Corners; icon: IconPos; glyph: Glyph };
type StateId = "default" | "hover" | "active" | "focus" | "disabled" | "loading";
type CheckId = "label" | "contrast" | "target" | "feedback";

const COLOURS: Record<ColourId, string> = {
  indigo: "#3343c4",
  forest: "#1d7348",
  rose: "#d6336c",
  tangerine: "#f08c00",
  sky: "#4cb4e7",
  graphite: "#1a1a1e",
};
const INK = "#1a1a1e";
const WHITE = "#ffffff";
/** The preview canvas is always white, so the maths below can assume it. */
const CANVAS = WHITE;
const DISABLED = { bg: "#e6e6ea", fg: "#8e8e98", border: "#d4d4da" };

const SIZES: Record<Size, { h: number; px: number; font: number; icon: number; gap: number; tw: { h: string; px: string; box: string; text: string; gap: string; icon: string } }> = {
  s: { h: 32, px: 12, font: 14, icon: 16, gap: 6, tw: { h: "h-8", px: "px-3", box: "size-8", text: "text-sm", gap: "gap-1.5", icon: "size-4" } },
  m: { h: 44, px: 20, font: 15, icon: 18, gap: 8, tw: { h: "h-11", px: "px-5", box: "size-11", text: "text-[15px]", gap: "gap-2", icon: "size-[18px]" } },
  l: { h: 52, px: 28, font: 16, icon: 20, gap: 8, tw: { h: "h-13", px: "px-7", box: "size-13", text: "text-base", gap: "gap-2", icon: "size-5" } },
};
const RADII: Record<Corners, { px: number; tw: string }> = {
  square: { px: 6, tw: "rounded-md" },
  rounded: { px: 12, tw: "rounded-xl" },
  pill: { px: 999, tw: "rounded-full" },
};
const GLYPHS: Record<Glyph, { Icon: typeof ArrowRight; name: string; svg: string }> = {
  arrow: { Icon: ArrowRight, name: "ArrowRight", svg: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  plus: { Icon: Plus, name: "Plus", svg: '<path d="M5 12h14"/><path d="M12 5v14"/>' },
  download: {
    Icon: Download,
    name: "Download",
    svg: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  },
};

/** Words that name an action without naming its outcome. */
const GENERIC = new Set([
  "click here", "click", "click me", "submit", "ok", "okay", "go", "here", "button", "more", "yes",
  "คลิก", "คลิกที่นี่", "กด", "กดที่นี่", "ส่ง", "ตกลง", "ที่นี่",
  "点击", "点击这里", "提交", "确定", "这里", "按钮",
  "クリック", "ここをクリック", "送信", "ここ", "ボタン",
]);

const START: Opts = { variant: "filled", colour: "tangerine", text: "white", size: "s", corners: "rounded", icon: "none", glyph: "arrow" };

const copy = {
  en: {
    controls: {
      label: "Label",
      variant: "Style",
      colour: "Colour",
      text: "Text colour",
      size: "Size",
      corners: "Corners",
      icon: "Icon",
      glyph: "Which icon",
    },
    defaultLabel: "Click here",
    labelHint: "Start with a verb and name the outcome: “Book a table”, “Download PDF”.",
    options: {
      filled: "Filled",
      outline: "Outline",
      text: "Text",
      white: "White",
      dark: "Dark",
      s: "Small · 32",
      m: "Medium · 44",
      l: "Large · 52",
      square: "Square",
      rounded: "Rounded",
      pill: "Pill",
      none: "None",
      before: "Before",
      after: "After",
      only: "Icon only",
      arrow: "Arrow",
      plus: "Plus",
      download: "Download",
    },
    colours: { indigo: "Indigo", forest: "Forest", rose: "Rose", tangerine: "Tangerine", sky: "Sky", graphite: "Graphite" } as Record<ColourId, string>,
    onlyFilled: "Text colour applies to filled buttons.",
    iconOnlyNote: "Icon-only buttons save space but are easy to misread. Keep them for icons everyone knows (close, search) — your label becomes the aria-label.",
    preview: "Your button",
    pressIt: "Press it — with a mouse, a finger or the keyboard (Tab, then Enter).",
    working: "Working…",
    pressed: "Done! That’s feedback: busy first, then a result.",
    chips: { label: "Label", contrast: "Contrast", target: "Size", feedback: "Feedback" } as Record<CheckId, string>,
    checksTitle: "Button health check",
    applied: "{n} of 4",
    checks: {
      label: ["Clear label", "Names what happens — not “Click here” or “Submit”."],
      contrast: ["Readable in every state", "Text contrast of at least 4.5 : 1 at rest, on hover and when pressed (WCAG 1.4.3)."],
      target: ["Easy to hit", "At least 44 px tall — Apple’s recommended touch target. WCAG 2.2’s AA minimum is 24 px."],
      feedback: ["Responds when pressed", "Press your button once to see its loading state."],
    } as Record<CheckId, string[]>,
    fails: {
      empty: "A button needs a name — even an icon-only one.",
      generic: "“{label}” doesn’t say what will happen.",
      contrast: "Lowest contrast: {ratio} : 1 ({state}).",
      target: "{px} px is below 44 px.",
    },
    stateShort: { default: "at rest", hover: "on hover", active: "when pressed" } as Record<"default" | "hover" | "active", string>,
    statesTitle: "One button, six states",
    statesIntro: "Each state answers a question people silently ask. Design all six, not just the first.",
    states: {
      default: ["Default", "What does this do?"],
      hover: ["Hover", "Can I click this? (mouse only)"],
      active: ["Active", "Did it get my press?"],
      focus: ["Focus", "Where is my keyboard?"],
      disabled: ["Disabled", "Why can’t I use it? Say why nearby."],
      loading: ["Loading", "Is it working? Don’t press twice."],
    } as Record<StateId, string[]>,
    ring: "Ring {ratio} : 1",
    exempt: "No contrast rule",
    codeTitle: "Code you can use",
    codeIntro: "Generated from your choices — every state included.",
    codeTabs: { html: "HTML + CSS", tailwind: "React + Tailwind" },
    copy: "Copy code",
    copied: "Copied",
    doneTitle: "That’s a real button.",
    doneBody: "Clear, readable, easy to hit — and it responds. A button isn’t decoration: it’s a promise about what happens next, kept in every state.",
    reset: "Start again",
  },
  th: {
    controls: {
      label: "ข้อความบนปุ่ม",
      variant: "สไตล์",
      colour: "สี",
      text: "สีตัวอักษร",
      size: "ขนาด",
      corners: "มุม",
      icon: "ไอคอน",
      glyph: "เลือกไอคอน",
    },
    defaultLabel: "คลิกที่นี่",
    labelHint: "ขึ้นต้นด้วยคำกริยาและบอกผลลัพธ์ เช่น “จองโต๊ะ” หรือ “ดาวน์โหลด PDF”",
    options: {
      filled: "ทึบ",
      outline: "เส้นขอบ",
      text: "ข้อความ",
      white: "ขาว",
      dark: "เข้ม",
      s: "เล็ก · 32",
      m: "กลาง · 44",
      l: "ใหญ่ · 52",
      square: "เหลี่ยม",
      rounded: "มน",
      pill: "แคปซูล",
      none: "ไม่มี",
      before: "ด้านหน้า",
      after: "ด้านหลัง",
      only: "ไอคอนอย่างเดียว",
      arrow: "ลูกศร",
      plus: "บวก",
      download: "ดาวน์โหลด",
    },
    colours: { indigo: "คราม", forest: "เขียวป่า", rose: "กุหลาบ", tangerine: "ส้ม", sky: "ฟ้า", graphite: "กราไฟต์" },
    onlyFilled: "สีตัวอักษรใช้กับปุ่มแบบทึบเท่านั้น",
    iconOnlyNote: "ปุ่มไอคอนอย่างเดียวประหยัดพื้นที่ แต่ตีความผิดได้ง่าย ใช้เฉพาะไอคอนที่ทุกคนรู้จัก เช่น ปิด หรือ ค้นหา และข้อความของคุณจะกลายเป็น aria-label",
    preview: "ปุ่มของคุณ",
    pressIt: "ลองกดดู ใช้เมาส์ นิ้ว หรือคีย์บอร์ดก็ได้ (กด Tab แล้ว Enter)",
    working: "กำลังทำงาน…",
    pressed: "เสร็จแล้ว! นี่คือ Feedback: บอกว่ากำลังทำงาน แล้วบอกผลลัพธ์",
    chips: { label: "ข้อความ", contrast: "Contrast", target: "ขนาด", feedback: "Feedback" },
    checksTitle: "ตรวจสุขภาพปุ่ม",
    applied: "ผ่าน {n} จาก 4",
    checks: {
      label: ["ข้อความชัดเจน", "บอกว่ากดแล้วจะเกิดอะไรขึ้น ไม่ใช่แค่ “คลิกที่นี่” หรือ “ส่ง”"],
      contrast: ["อ่านง่ายในทุกสถานะ", "Contrast ของตัวอักษรอย่างน้อย 4.5 : 1 ทั้งตอนปกติ ตอนชี้ และตอนกด (WCAG 1.4.3)"],
      target: ["กดง่าย", "สูงอย่างน้อย 44 px ตามที่ Apple แนะนำสำหรับการแตะ ส่วนขั้นต่ำระดับ AA ของ WCAG 2.2 คือ 24 px"],
      feedback: ["ตอบสนองเมื่อถูกกด", "ลองกดปุ่มของคุณหนึ่งครั้งเพื่อดูสถานะกำลังโหลด"],
    },
    fails: {
      empty: "ปุ่มต้องมีชื่อเสมอ แม้จะเป็นปุ่มไอคอนอย่างเดียว",
      generic: "“{label}” ไม่ได้บอกว่าจะเกิดอะไรขึ้น",
      contrast: "Contrast ต่ำสุด {ratio} : 1 ({state})",
      target: "{px} px ยังต่ำกว่า 44 px",
    },
    stateShort: { default: "ตอนปกติ", hover: "ตอนชี้", active: "ตอนกด" },
    statesTitle: "ปุ่มเดียว หกสถานะ",
    statesIntro: "ทุกสถานะตอบคำถามที่ผู้ใช้ถามอยู่ในใจ ออกแบบให้ครบทั้งหก ไม่ใช่แค่สถานะแรก",
    states: {
      default: ["Default (ปกติ)", "ปุ่มนี้ทำอะไร?"],
      hover: ["Hover (ชี้)", "กดได้ไหม? (เฉพาะเมาส์)"],
      active: ["Active (กด)", "ระบบรับรู้ว่าฉันกดแล้วไหม?"],
      focus: ["Focus (โฟกัส)", "คีย์บอร์ดของฉันอยู่ตรงไหน?"],
      disabled: ["Disabled (ปิดใช้งาน)", "ทำไมกดไม่ได้? บอกเหตุผลไว้ใกล้ ๆ"],
      loading: ["Loading (กำลังโหลด)", "กำลังทำงานอยู่ไหม? ไม่ต้องกดซ้ำ"],
    },
    ring: "วงโฟกัส {ratio} : 1",
    exempt: "ไม่บังคับเรื่อง Contrast",
    codeTitle: "โค้ดที่นำไปใช้ได้",
    codeIntro: "สร้างจากตัวเลือกของคุณ ครบทุกสถานะ",
    copy: "คัดลอกโค้ด",
    copied: "คัดลอกแล้ว",
    doneTitle: "นี่แหละปุ่มที่ดีจริง ๆ",
    doneBody: "ชัดเจน อ่านง่าย กดง่าย และตอบสนอง ปุ่มไม่ใช่ของตกแต่ง แต่คือคำสัญญาว่ากดแล้วจะเกิดอะไรขึ้น และต้องรักษาสัญญานั้นในทุกสถานะ",
    reset: "เริ่มใหม่",
  },
  zh: {
    controls: {
      label: "按钮文字",
      variant: "样式",
      colour: "颜色",
      text: "文字颜色",
      size: "大小",
      corners: "圆角",
      icon: "图标",
      glyph: "选择图标",
    },
    defaultLabel: "点击这里",
    labelHint: "以动词开头，写明结果：“预订座位”“下载 PDF”。",
    options: {
      filled: "填充",
      outline: "描边",
      text: "文字",
      white: "白色",
      dark: "深色",
      s: "小 · 32",
      m: "中 · 44",
      l: "大 · 52",
      square: "方角",
      rounded: "圆角",
      pill: "胶囊",
      none: "无",
      before: "前面",
      after: "后面",
      only: "仅图标",
      arrow: "箭头",
      plus: "加号",
      download: "下载",
    },
    colours: { indigo: "靛蓝", forest: "森绿", rose: "玫红", tangerine: "橘橙", sky: "天蓝", graphite: "石墨" },
    onlyFilled: "文字颜色仅适用于填充按钮。",
    iconOnlyNote: "仅图标的按钮节省空间，但容易被误解。只用于人人都认识的图标（关闭、搜索）——你的按钮文字会变成 aria-label。",
    preview: "你的按钮",
    pressIt: "按一下——用鼠标、手指或键盘（先按 Tab，再按 Enter）。",
    working: "处理中…",
    pressed: "完成！这就是反馈：先告诉你正在处理，再给出结果。",
    chips: { label: "文字", contrast: "对比度", target: "尺寸", feedback: "反馈" },
    checksTitle: "按钮健康检查",
    applied: "{n} / 4",
    checks: {
      label: ["清晰的文字", "写明会发生什么——而不是“点击这里”或“提交”。"],
      contrast: ["每种状态都清晰可读", "默认、悬停和按下时，文字对比度都至少 4.5 : 1（WCAG 1.4.3）。"],
      target: ["容易点中", "高度至少 44 px——Apple 推荐的触控目标。WCAG 2.2 的 AA 最低要求是 24 px。"],
      feedback: ["按下有反馈", "按一次你的按钮，看看加载状态。"],
    },
    fails: {
      empty: "按钮必须有名称——仅图标的按钮也一样。",
      generic: "“{label}”没有说明会发生什么。",
      contrast: "最低对比度：{ratio} : 1（{state}）。",
      target: "{px} px 低于 44 px。",
    },
    stateShort: { default: "默认时", hover: "悬停时", active: "按下时" },
    statesTitle: "一个按钮，六种状态",
    statesIntro: "每一种状态，都在回答用户心里默默提出的问题。六种都要设计，而不只是第一种。",
    states: {
      default: ["默认", "这个按钮是做什么的？"],
      hover: ["悬停", "我能点它吗？（仅限鼠标）"],
      active: ["按下", "它收到我的点击了吗？"],
      focus: ["焦点", "我的键盘现在在哪里？"],
      disabled: ["禁用", "为什么不能用？在旁边说明原因。"],
      loading: ["加载中", "它在处理吗？不要重复点击。"],
    },
    ring: "焦点环 {ratio} : 1",
    exempt: "无对比度要求",
    codeTitle: "可以直接使用的代码",
    codeIntro: "根据你的选择生成——包含所有状态。",
    copy: "复制代码",
    copied: "已复制",
    doneTitle: "这才是真正的按钮。",
    doneBody: "清晰、易读、容易点中，而且有反馈。按钮不是装饰——它是对接下来会发生什么的承诺，并在每一种状态下兑现。",
    reset: "重新开始",
  },
  ja: {
    controls: {
      label: "ラベル",
      variant: "スタイル",
      colour: "色",
      text: "文字の色",
      size: "サイズ",
      corners: "角",
      icon: "アイコン",
      glyph: "アイコンの種類",
    },
    defaultLabel: "ここをクリック",
    labelHint: "動詞で始めて結果を書きましょう：「席を予約する」「PDF をダウンロード」。",
    options: {
      filled: "塗り",
      outline: "枠線",
      text: "テキスト",
      white: "白",
      dark: "濃い色",
      s: "小 · 32",
      m: "中 · 44",
      l: "大 · 52",
      square: "四角",
      rounded: "角丸",
      pill: "ピル",
      none: "なし",
      before: "前",
      after: "後ろ",
      only: "アイコンのみ",
      arrow: "矢印",
      plus: "プラス",
      download: "ダウンロード",
    },
    colours: { indigo: "インディゴ", forest: "フォレスト", rose: "ローズ", tangerine: "タンジェリン", sky: "スカイ", graphite: "グラファイト" },
    onlyFilled: "文字の色は塗りボタンにのみ適用されます。",
    iconOnlyNote: "アイコンのみのボタンは省スペースですが、誤解されやすくなります。閉じる・検索など誰もが分かるアイコンに限りましょう。ラベルは aria-label になります。",
    preview: "あなたのボタン",
    pressIt: "押してみましょう。マウスでも、指でも、キーボード（Tab のあと Enter）でも。",
    working: "処理中…",
    pressed: "完了！これがフィードバック：まず処理中、そして結果。",
    chips: { label: "ラベル", contrast: "コントラスト", target: "サイズ", feedback: "フィードバック" },
    checksTitle: "ボタンの健康診断",
    applied: "{n} / 4",
    checks: {
      label: ["分かりやすいラベル", "何が起きるかを伝える。「ここをクリック」や「送信」ではなく。"],
      contrast: ["どの状態でも読める", "通常時・ホバー時・押下時の文字コントラストが 4.5 : 1 以上（WCAG 1.4.3）。"],
      target: ["押しやすい", "高さ 44 px 以上。Apple が推奨するタッチターゲットです。WCAG 2.2 の AA 最低基準は 24 px。"],
      feedback: ["押すと反応する", "一度押して、読み込み中の状態を見てみましょう。"],
    },
    fails: {
      empty: "ボタンには名前が必要です。アイコンのみのボタンでも。",
      generic: "「{label}」では何が起きるか分かりません。",
      contrast: "最低コントラスト：{ratio} : 1（{state}）。",
      target: "{px} px は 44 px 未満です。",
    },
    stateShort: { default: "通常時", hover: "ホバー時", active: "押下時" },
    statesTitle: "ひとつのボタン、6 つの状態",
    statesIntro: "どの状態も、ユーザーが心の中で問いかけていることに答えます。最初のひとつだけでなく、6 つすべてをデザインしましょう。",
    states: {
      default: ["デフォルト", "これは何をするボタン？"],
      hover: ["ホバー", "クリックできる？（マウスのみ）"],
      active: ["アクティブ", "押したことが伝わった？"],
      focus: ["フォーカス", "キーボードはいまどこ？"],
      disabled: ["無効", "なぜ使えない？近くで理由を伝える。"],
      loading: ["読み込み中", "処理中？もう一度押さなくていい。"],
    },
    ring: "フォーカスリング {ratio} : 1",
    exempt: "コントラスト要件なし",
    codeTitle: "そのまま使えるコード",
    codeIntro: "あなたの選択から生成。すべての状態を含みます。",
    copy: "コードをコピー",
    copied: "コピーしました",
    doneTitle: "これこそ本物のボタン。",
    doneBody: "分かりやすく、読みやすく、押しやすく、ちゃんと反応する。ボタンは装飾ではなく、次に何が起きるかの約束。その約束をすべての状態で守ります。",
    reset: "最初から",
  },
};

/* ---------------------------- colour maths ---------------------------- */

function mix(a: string, b: string, amount: number) {
  const ca = parseHex(a) ?? [0, 0, 0];
  const cb = parseHex(b) ?? [0, 0, 0];
  return "#" + ca.map((v, i) => Math.round(v + (cb[i] - v) * amount).toString(16).padStart(2, "0")).join("");
}

const ratio = (a: string, b: string) => contrastRatio(a, b) ?? 1;

/** Truncate (never round up): 4.48 must not read as “4.5”. */
const fmt = (r: number) => (Math.floor(r * 10) / 10).toFixed(1);

type Look = {
  bg: string;
  fg: string;
  border: string | null;
  hover: string;
  press: string;
  ring: string;
  contrast: Record<"default" | "hover" | "active", number>;
  ringContrast: number;
};

function derive(o: Opts): Look {
  const base = COLOURS[o.colour];
  // The focus ring sits on the page, so it must contrast 3:1 with the page.
  const ring = ratio(base, CANVAS) >= WCAG.nonText ? base : INK;
  const ringContrast = ratio(ring, CANVAS);
  if (o.variant === "filled") {
    const fg = o.text === "white" ? WHITE : INK;
    const hover = mix(base, "#000000", 0.1);
    const press = mix(base, "#000000", 0.18);
    return {
      bg: base, fg, border: null, hover, press, ring, ringContrast,
      contrast: { default: ratio(fg, base), hover: ratio(fg, hover), active: ratio(fg, press) },
    };
  }
  const hover = mix(CANVAS, base, 0.08);
  const press = mix(CANVAS, base, 0.16);
  return {
    bg: "transparent", fg: base, border: o.variant === "outline" ? base : null, hover, press, ring, ringContrast,
    contrast: { default: ratio(base, CANVAS), hover: ratio(base, hover), active: ratio(base, press) },
  };
}

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s.!?…。！？]+$/u, "").replace(/\s+/g, " ");

/* ---------------------------- code output ----------------------------- */

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsxText = (s: string) => (/[{}<>&"'`\\]/.test(s) ? `{${JSON.stringify(s)}}` : s);

function htmlCode(o: Opts, look: Look, label: string) {
  const s = SIZES[o.size];
  const iconOnly = o.icon === "only";
  const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[o.glyph].svg}</svg>`;
  const inner = [
    o.icon === "before" || iconOnly ? svg : null,
    iconOnly ? null : escHtml(label),
    o.icon === "after" ? svg : null,
  ].filter(Boolean) as string[];
  const aria = iconOnly ? ` aria-label="${escHtml(label)}"` : "";
  const filled = o.variant === "filled";
  const disabledRule = filled
    ? `background: ${DISABLED.bg}; color: ${DISABLED.fg};`
    : o.variant === "outline"
      ? `border-color: ${DISABLED.border}; color: ${DISABLED.fg}; background: transparent;`
      : `color: ${DISABLED.fg}; background: transparent;`;

  return `<button class="btn" type="button"${aria}>
${inner.map((l) => `  ${l}`).join("\n")}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${s.gap}px;
    ${iconOnly ? `width: ${s.h}px;\n    height: ${s.h}px;\n    padding: 0;` : `height: ${s.h}px; /* ${s.h >= 44 ? "comfortable touch target" : "below the 44px touch target"} */\n    padding: 0 ${s.px}px;`}
    border: ${look.border ? `1.5px solid ${look.border}` : "0"};
    border-radius: ${RADII[o.corners].px}px;
    background: ${look.bg};
    color: ${look.fg}; /* ${fmt(look.contrast.default)}:1 */
    font: inherit;
    font-size: ${s.font}px;
    font-weight: 600;
    line-height: 1;
    transition: background-color 150ms ease, transform 150ms ease;
  }
  .btn svg { width: ${s.icon}px; height: ${s.icon}px; flex: none; }
  .btn:hover:not(:disabled) { background: ${look.hover}; }
  .btn:active:not(:disabled) { background: ${look.press}; transform: scale(0.97); }
  .btn:focus-visible { outline: 2px solid ${look.ring}; outline-offset: 2px; } /* ring ${fmt(look.ringContrast)}:1 on the page */
  .btn:disabled { ${disabledRule} }
  .btn[aria-busy="true"] { cursor: progress; }

  @media (prefers-reduced-motion: reduce) {
    .btn { transition: none; }
    .btn:active:not(:disabled) { transform: none; }
  }
</style>`;
}

function tailwindCode(o: Opts, look: Look, label: string) {
  const s = SIZES[o.size].tw;
  const iconOnly = o.icon === "only";
  const g = GLYPHS[o.glyph].name;
  const filled = o.variant === "filled";
  const classes = [
    "inline-flex items-center justify-center font-semibold",
    iconOnly ? s.box : `${s.h} ${s.px}`,
    s.gap,
    s.text,
    RADII[o.corners].tw,
    filled
      ? `bg-[${look.bg}] ${look.fg === WHITE ? "text-white" : `text-[${look.fg}]`}`
      : `${o.variant === "outline" ? `border-[1.5px] border-[${look.border}] ` : ""}text-[${look.fg}]`,
    `hover:bg-[${look.hover}] active:bg-[${look.press}]`,
    "transition active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
    `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[${look.ring}]`,
    filled
      ? `disabled:bg-[${DISABLED.bg}] disabled:text-[${DISABLED.fg}]`
      : `${o.variant === "outline" ? `disabled:border-[${DISABLED.border}] ` : ""}disabled:bg-transparent disabled:text-[${DISABLED.fg}]`,
    "aria-busy:cursor-progress",
  ].join(" ");
  const icon = `<${g} className="${s.icon}" aria-hidden />`;
  const inner = [
    o.icon === "before" || iconOnly ? icon : null,
    iconOnly ? null : jsxText(label),
    o.icon === "after" ? icon : null,
  ].filter(Boolean) as string[];
  const imports = o.icon === "none" ? "" : `import { ${g} } from "lucide-react";\n\n`;
  const aria = iconOnly ? `\n      aria-label=${JSON.stringify(label)}` : "";

  return `${imports}export function MyButton() {
  return (
    <button
      type="button"${aria}
      className="${classes}"
    >
${inner.map((l) => `      ${l}`).join("\n")}
    </button>
  );
}`;
}

/* ----------------------------- rendering ------------------------------ */

function ButtonBody({ o, label, busy }: { o: Opts; label: string; busy: boolean }) {
  const s = SIZES[o.size];
  const { Icon } = GLYPHS[o.glyph];
  const icon = busy ? (
    <Spinner className="shrink-0" />
  ) : (
    <Icon className="shrink-0" style={{ width: s.icon, height: s.icon }} aria-hidden strokeWidth={2.25} />
  );
  if (o.icon === "only") return icon;
  return (
    <>
      {o.icon === "before" || (busy && o.icon !== "after") ? icon : null}
      <span className="min-w-0 truncate">{label}</span>
      {o.icon === "after" ? icon : null}
    </>
  );
}

function boxStyle(o: Opts): React.CSSProperties {
  const s = SIZES[o.size];
  const iconOnly = o.icon === "only";
  return {
    height: s.h,
    width: iconOnly ? s.h : undefined,
    paddingInline: iconOnly ? 0 : s.px,
    gap: s.gap,
    fontSize: s.font,
    borderRadius: RADII[o.corners].px,
  };
}

/** A static, non-interactive rendering of one state (for the states strip). */
function StateVisual({ o, look, label, state }: { o: Opts; look: Look; label: string; state: StateId }) {
  const disabled = state === "disabled";
  const bg = disabled
    ? o.variant === "filled" ? DISABLED.bg : "transparent"
    : state === "hover" ? look.hover : state === "active" ? look.press : look.bg;
  return (
    <span
      aria-hidden
      className="inline-flex max-w-full items-center justify-center font-semibold whitespace-nowrap"
      style={{
        ...boxStyle(o),
        background: bg,
        color: disabled ? DISABLED.fg : look.fg,
        border: look.border ? `1.5px solid ${disabled ? DISABLED.border : look.border}` : 0,
        transform: state === "active" ? "scale(0.97)" : undefined,
        outline: state === "focus" ? `2px solid ${look.ring}` : undefined,
        outlineOffset: state === "focus" ? 2 : undefined,
      }}
    >
      <ButtonBody o={o} label={label} busy={state === "loading"} />
    </span>
  );
}

export function BuildAButton() {
  const t = useCopy(copy);
  const uid = useId();
  const [o, setO] = useState<Opts>(START);
  const [label, setLabel] = useState<string | null>(null); // null = untouched → localized default
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [pressed, setPressed] = useState(false);
  const [tab, setTab] = useState<"html" | "tailwind">("html");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const preRef = useRef<HTMLPreElement>(null);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const name = label ?? t.defaultLabel;
  const look = derive(o);
  const s = SIZES[o.size];
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((prev) => ({ ...prev, [k]: v }));
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  // Health check
  const labelIssue = !name.trim() ? "empty" : GENERIC.has(norm(name)) ? "generic" : null;
  const worst = (Object.entries(look.contrast) as ["default" | "hover" | "active", number][]).reduce((a, b) => (b[1] < a[1] ? b : a));
  const pass: Record<CheckId, boolean> = {
    label: !labelIssue,
    contrast: worst[1] >= WCAG.aaNormal,
    target: s.h >= 44,
    feedback: pressed,
  };
  const failText: Record<CheckId, string | null> = {
    label: labelIssue === "empty" ? t.fails.empty : labelIssue === "generic" ? format(t.fails.generic, { label: name.trim() }) : null,
    contrast: pass.contrast ? null : format(t.fails.contrast, { ratio: fmt(worst[1]), state: t.stateShort[worst[0]] }),
    target: pass.target ? null : format(t.fails.target, { px: s.h }),
    feedback: null,
  };
  const checkIds = Object.keys(pass) as CheckId[];
  const passed = checkIds.filter((k) => pass[k]).length;
  const done = passed === checkIds.length;
  useLabComplete("build-a-button", done);

  const press = () => {
    if (phase === "loading") return; // busy: a second press must not do anything
    setPhase("loading");
    later(() => {
      setPhase("done");
      setPressed(true);
    }, 1200);
  };

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setO(START);
    setLabel(null);
    setPhase("idle");
    setPressed(false);
  };

  const code = tab === "html" ? htmlCode(o, look, name) : tailwindCode(o, look, name);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      later(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: select the code so it can be copied by hand.
      const el = preRef.current;
      const sel = window.getSelection();
      if (!el || !sel) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const status = phase === "loading" ? t.working : pressed ? t.pressed : t.pressIt;

  const seg = <K extends keyof Opts>(k: K, values: Opts[K][], disabled = false) => (
    <div>
      <p className="mb-1.5 text-[0.8125rem] font-semibold text-ink-2">{t.controls[k]}</p>
      <SegmentedControl
        label={t.controls[k]}
        size="sm"
        disabled={disabled}
        value={o[k] as string}
        onChange={(v) => set(k, v as Opts[K])}
        options={values.map((v) => ({ value: v as string, label: t.options[v as keyof typeof t.options] }))}
        className="flex-wrap"
      />
    </div>
  );

  return (
    <div className="space-y-14">
      {/* Preview + controls. A flex column on mobile lets the preview stay
          pinned while the controls scroll; a grid on large screens. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-10">
        <div className="sticky top-16 z-10 -mx-4 bg-bg px-4 pt-2 pb-2 sm:-mx-6 sm:px-6 lg:top-24 lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-white shadow-sm">
            <div className="relative flex h-40 flex-col items-center justify-center gap-3 bg-[radial-gradient(#e6e6ea_1px,transparent_1px)] [background-size:16px_16px] px-4 sm:h-56 lg:h-80">
              <p className="absolute top-3 left-4 text-[0.6875rem] font-semibold tracking-wider text-[#5c5c66] uppercase">{t.preview}</p>
              <button
                type="button"
                onClick={press}
                aria-busy={phase === "loading" || undefined}
                aria-label={o.icon === "only" ? name : undefined}
                className={cn(
                  "inline-flex max-w-full shrink-0 items-center justify-center font-semibold whitespace-nowrap",
                  "bg-[color:var(--b-bg)] text-[color:var(--b-fg)] hover:bg-[color:var(--b-hover)] active:bg-[color:var(--b-press)]",
                  "transition-[background-color,transform] duration-150 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--b-ring)]",
                  phase === "loading" && "cursor-progress",
                )}
                style={{
                  ...boxStyle(o),
                  border: look.border ? `1.5px solid ${look.border}` : 0,
                  ["--b-bg" as string]: look.bg,
                  ["--b-fg" as string]: look.fg,
                  ["--b-hover" as string]: look.hover,
                  ["--b-press" as string]: look.press,
                  ["--b-ring" as string]: look.ring,
                }}
              >
                <ButtonBody o={o} label={name} busy={phase === "loading"} />
              </button>
              <p role="status" className="max-w-[26rem] text-center text-[0.8125rem] leading-snug text-[#5c5c66]">
                {status}
              </p>
            </div>
            <ul className="flex flex-wrap gap-1.5 border-t border-[#ececf0] bg-white px-3 py-2.5" aria-hidden>
              {checkIds.map((k) => (
                <li
                  key={k}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.75rem] font-semibold",
                    pass[k] ? "bg-[#e7f4ec] text-[#1d7348]" : "bg-[#f3f3f1] text-[#5c5c66]",
                  )}
                >
                  {pass[k] ? <Check className="size-3.5" strokeWidth={2.75} /> : <X className="size-3.5" strokeWidth={2.75} />}
                  {t.chips[k]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor={`${uid}-label`} className="mb-1.5 block text-[0.8125rem] font-semibold text-ink-2">
              {t.controls.label}
            </label>
            <input
              id={`${uid}-label`}
              type="text"
              value={name}
              maxLength={28}
              autoComplete="off"
              onChange={(e) => setLabel(e.target.value)}
              aria-describedby={`${uid}-hint`}
              className="h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3 text-[0.9375rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
            <p id={`${uid}-hint`} className="mt-1.5 text-[0.8125rem] text-ink-2">
              {t.labelHint}
            </p>
          </div>

          {seg("variant", ["filled", "outline", "text"])}

          <div>
            <p className="mb-1.5 text-[0.8125rem] font-semibold text-ink-2" id={`${uid}-colour`}>
              {t.controls.colour} <span className="font-normal">· {t.colours[o.colour]}</span>
            </p>
            <div role="radiogroup" aria-labelledby={`${uid}-colour`} className="flex flex-wrap gap-2">
              {(Object.keys(COLOURS) as ColourId[]).map((id) => {
                const active = o.colour === id;
                return (
                  <label
                    key={id}
                    title={t.colours[id]}
                    className={cn(
                      "relative flex size-10 cursor-pointer items-center justify-center rounded-full border-2 transition-transform duration-150",
                      active ? "border-ink" : "border-transparent hover:scale-105 motion-reduce:hover:scale-100",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${uid}-colour`}
                      value={id}
                      checked={active}
                      onChange={() => set("colour", id)}
                      className="sr-only"
                    />
                    <span className="sr-only">{t.colours[id]}</span>
                    <span aria-hidden className="flex size-8 items-center justify-center rounded-full" style={{ background: COLOURS[id] }}>
                      {active ? <Check className="size-4" strokeWidth={3} style={{ color: ratio(WHITE, COLOURS[id]) >= 3 ? WHITE : INK }} /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            {seg("text", ["white", "dark"], o.variant !== "filled")}
            {o.variant !== "filled" ? <p className="mt-1.5 text-[0.8125rem] text-ink-2">{t.onlyFilled}</p> : null}
          </div>

          {seg("size", ["s", "m", "l"])}
          {seg("corners", ["square", "rounded", "pill"])}

          <div className="space-y-4">
            {seg("icon", ["none", "before", "after", "only"])}
            {seg("glyph", ["arrow", "plus", "download"], o.icon === "none")}
            {o.icon === "only" ? (
              <p className="flex gap-2 rounded-[var(--radius-md)] bg-accent-soft p-3 text-[0.8125rem] leading-relaxed text-ink">
                <Info className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
                {t.iconOnlyNote}
              </p>
            ) : null}
          </div>

          <section aria-labelledby={`${uid}-checks`} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id={`${uid}-checks`} className="type-label">
                {t.checksTitle}
              </h2>
              <p className="tabular text-[0.875rem] font-semibold text-ink">{format(t.applied, { n: passed })}</p>
            </div>
            <ul className="space-y-3">
              {checkIds.map((k) => (
                <li key={k} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      pass[k] ? "bg-success text-white dark:text-[#0b1f14]" : "border-2 border-line-input",
                    )}
                    aria-hidden
                  >
                    {pass[k] ? <Check className="size-3" strokeWidth={3.5} /> : null}
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink">
                      {t.checks[k][0]}
                      <span className="sr-only">{pass[k] ? " ✓" : " ✗"}</span>
                    </span>
                    <span className="block text-[0.8125rem] leading-relaxed text-ink-2">{t.checks[k][1]}</span>
                    {failText[k] ? (
                      <span className="mt-1 flex items-start gap-1.5 text-[0.8125rem] font-medium text-warning">
                        <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        {failText[k]}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={reset} className="mt-4 h-10 rounded-full px-3 text-sm font-semibold text-accent-ink hover:bg-surface-2">
              {t.reset}
            </button>
          </section>

          {done ? <CompletionCard title={t.doneTitle}>{t.doneBody}</CompletionCard> : null}
        </div>
      </div>

      {/* States strip */}
      <section aria-labelledby={`${uid}-states`}>
        <h2 id={`${uid}-states`} className="type-h3 text-ink">
          {t.statesTitle}
        </h2>
        <p className="type-caption mt-2 max-w-[40rem]">{t.statesIntro}</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {(["default", "hover", "active", "focus", "disabled", "loading"] as StateId[]).map((st) => {
            const metric =
              st === "disabled"
                ? { text: t.exempt, ok: true }
                : st === "loading"
                  ? { text: "aria-busy", ok: true }
                  : st === "focus"
                    ? { text: format(t.ring, { ratio: fmt(look.ringContrast) }), ok: look.ringContrast >= WCAG.nonText }
                    : { text: `${fmt(look.contrast[st])} : 1`, ok: look.contrast[st] >= WCAG.aaNormal };
            return (
              <li key={st} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
                <div className="flex h-24 items-center justify-center overflow-hidden bg-white px-3">
                  <StateVisual o={o} look={look} label={name} state={st} />
                </div>
                <div className="space-y-1 border-t border-line p-3.5">
                  <p className="text-[0.9375rem] font-semibold text-ink">{t.states[st][0]}</p>
                  <p className="text-[0.8125rem] leading-snug text-ink-2">{t.states[st][1]}</p>
                  <p className={cn("tabular pt-1 text-[0.75rem] font-semibold", metric.ok ? "text-success" : "text-warning")}>{metric.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Code */}
      <section aria-labelledby={`${uid}-code`}>
        <h2 id={`${uid}-code`} className="type-h3 text-ink">
          {t.codeTitle}
        </h2>
        <p className="type-caption mt-2">{t.codeIntro}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "html", label: t.codeTabs.html },
              { value: "tailwind", label: t.codeTabs.tailwind },
            ]}
            label={t.codeTitle}
            idBase={`${uid}-code`}
          />
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
          >
            {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? t.copied : t.copy}
          </button>
          <span role="status" className="sr-only">
            {copied ? t.copied : ""}
          </span>
        </div>
        <div id={`${uid}-code-panel`} role="tabpanel" aria-labelledby={`${uid}-code-tab-${tab}`} className="mt-3">
          <pre
            ref={preRef}
            tabIndex={0}
            className="max-h-[28rem] overflow-auto rounded-[var(--radius-lg)] bg-[#16161a] p-5 font-mono text-[0.8125rem] leading-relaxed text-[#e8e8ee]"
          >
            <code>{code}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
