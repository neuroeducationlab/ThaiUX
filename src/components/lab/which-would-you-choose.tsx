"use client";

import { useState } from "react";
import { ArrowRight, Check, Menu, Minus, Plus, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { pick, type Localized } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { useCopy } from "@/components/demos/use-copy";
import { CompletionCard, useLabComplete } from "./lab-shell";

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
        en: ["Out of sight, out of mind — hidden sections get used less", "Two taps to switch sections"],
        th: ["มองไม่เห็นก็ลืม หมวดที่ซ่อนไว้ถูกใช้น้อยลง", "ต้องแตะสองครั้งเพื่อเปลี่ยนหมวด"],
        zh: ["看不见就会被遗忘——隐藏的栏目用得更少", "切换栏目需要点两下"],
        ja: ["見えないものは忘れられ、隠れたセクションは使われにくい", "セクションの切り替えに 2 タップ必要"],
      },
      when: {
        en: "Many destinations, or ones people rarely need.",
        th: "มีปลายทางจำนวนมาก หรือเป็นหน้าที่คนใช้ไม่บ่อย",
        zh: "目的地很多，或者人们很少需要它们。",
        ja: "行き先が多い、またはあまり使われない場合。",
      },
    },
    b: {
      name: { en: "Bottom tab bar", th: "แถบแท็บด้านล่าง", zh: "底部标签栏", ja: "下部タブバー" },
      mock: "tabbar",
      pros: {
        en: ["Always visible: you see where you are and where you can go", "One tap, right in the thumb zone"],
        th: ["มองเห็นตลอด รู้ว่าอยู่ที่ไหนและไปที่ไหนได้", "แตะครั้งเดียว อยู่ในระยะนิ้วโป้งพอดี"],
        zh: ["始终可见：知道自己在哪、能去哪", "一次点击，就在拇指区"],
        ja: ["常に見える。今どこにいて、どこへ行けるか分かる", "1 タップ、親指の届く範囲"],
      },
      cons: {
        en: ["Fits only about five items", "Takes permanent space at the bottom"],
        th: ["ใส่ได้ราวห้ารายการเท่านั้น", "กินพื้นที่ด้านล่างตลอดเวลา"],
        zh: ["只能放大约五个项目", "永久占用底部空间"],
        ja: ["入るのは 5 項目ほど", "画面下部のスペースを常に使う"],
      },
      when: {
        en: "A handful of top-level destinations people switch between often.",
        th: "ปลายทางหลักไม่กี่แห่งที่คนสลับไปมาบ่อย ๆ",
        zh: "少数几个经常来回切换的顶级目的地。",
        ja: "頻繁に行き来する、少数のトップレベルの行き先。",
      },
    },
    principles: {
      en: ["Visibility", "Recognition over recall", "Fitts’s Law"],
      th: ["Visibility", "Recognition over recall", "กฎของ Fitts"],
      zh: ["可见性", "识别优于回忆", "费茨定律"],
      ja: ["可視性", "再生より再認", "フィッツの法則"],
    },
    note: {
      en: "In this context — five daily sections on a phone — visible navigation usually wins. If the app grew to fifteen sections, a combination (tabs plus “More”) could serve better.",
      th: "ในบริบทนี้ คือห้าหมวดที่ใช้ทุกวันบนมือถือ การนำทางที่มองเห็นได้มักชนะ แต่ถ้าแอปโตจนมีสิบห้าหมวด การผสมกัน (แท็บ + “เพิ่มเติม”) อาจเหมาะกว่า",
      zh: "在这个情境下——手机上每天使用的五个栏目——可见的导航通常更好。如果 App 发展到十五个栏目，组合方式（标签栏 + “更多”）可能更合适。",
      ja: "この状況（スマホで毎日使う 5 つのセクション）では、見えるナビゲーションが有利なことが多いです。セクションが 15 に増えたら、組み合わせ（タブ ＋「その他」）のほうが合うかもしれません。",
    },
  },
  {
    id: "list",
    title: { en: "Browsing 2,000 products", th: "เลือกดูสินค้า 2,000 ชิ้น", zh: "浏览 2000 件商品", ja: "2,000 点の商品を見る" },
    context: {
      en: "A shopping app where people compare items and often go back to one they saw earlier.",
      th: "แอปช้อปปิ้งที่คนเปรียบเทียบสินค้า และมักย้อนกลับไปหาชิ้นที่เคยเห็น",
      zh: "一个购物 App，人们会比较商品，也经常回头找之前看过的那件。",
      ja: "商品を比べたり、前に見た商品へ戻ったりすることが多いショッピングアプリ。",
    },
    a: {
      name: { en: "Infinite scroll", th: "Infinite scroll", zh: "无限滚动", ja: "無限スクロール" },
      mock: "infinite",
      pros: {
        en: ["Effortless browsing — just keep scrolling", "Great for feeds with no specific goal"],
        th: ["ดูได้ไหลลื่น แค่เลื่อนไปเรื่อย ๆ", "เหมาะกับฟีดที่ไม่มีเป้าหมายเฉพาะ"],
        zh: ["浏览毫不费力——一直往下滑就行", "很适合没有明确目标的信息流"],
        ja: ["スクロールするだけで楽に見られる", "目的のないフィードに向いている"],
      },
      cons: {
        en: ["Hard to find an item again", "The footer (help, returns) becomes unreachable"],
        th: ["หาสินค้าที่เคยเห็นได้ยาก", "ส่วนท้ายเว็บ (ช่วยเหลือ การคืนสินค้า) ไปไม่ถึง"],
        zh: ["很难再找到之前的商品", "页脚（帮助、退货）永远到不了"],
        ja: ["前に見た商品を見つけ直しにくい", "フッター（ヘルプ、返品）にたどり着けない"],
      },
      when: {
        en: "Entertainment feeds and open-ended discovery.",
        th: "ฟีดความบันเทิงและการค้นพบแบบไม่มีจุดหมาย",
        zh: "娱乐信息流和漫无目的的发现。",
        ja: "エンタメのフィードや、あてのない発見。",
      },
    },
    b: {
      name: { en: "“Load more” button", th: "ปุ่ม “โหลดเพิ่ม”", zh: "“加载更多”按钮", ja: "「もっと見る」ボタン" },
      mock: "loadmore",
      pros: {
        en: ["You stay in control and keep a sense of position", "Easy to return to where you were"],
        th: ["ผู้ใช้ควบคุมได้และรู้ว่าตัวเองอยู่ตรงไหน", "ย้อนกลับไปที่เดิมได้ง่าย"],
        zh: ["由你掌控，并保有位置感", "很容易回到之前的位置"],
        ja: ["自分で操作でき、位置の感覚を保てる", "元の場所に戻りやすい"],
      },
      cons: {
        en: ["One extra tap per batch", "Can feel slower for casual browsing"],
        th: ["ต้องแตะเพิ่มทุกชุด", "อาจรู้สึกช้ากว่าเมื่อแค่ดูเล่น ๆ"],
        zh: ["每一批都要多点一下", "随便逛逛时可能感觉更慢"],
        ja: ["読み込みごとに 1 タップ増える", "なんとなく見るときは遅く感じることも"],
      },
      when: {
        en: "Goal-oriented tasks: finding, comparing and returning to items.",
        th: "งานที่มีเป้าหมาย เช่น ค้นหา เปรียบเทียบ และย้อนกลับไปดูสินค้า",
        zh: "有目标的任务：查找、比较、回头查看商品。",
        ja: "目的のあるタスク。探す、比べる、戻る。",
      },
    },
    principles: {
      en: ["User control and freedom", "Findability", "Recognition over recall"],
      th: ["User control and freedom", "การหาเจอ (Findability)", "Recognition over recall"],
      zh: ["用户控制与自由", "可找性", "识别优于回忆"],
      ja: ["ユーザーの主導権と自由", "見つけやすさ", "再生より再認"],
    },
    note: {
      en: "People here are hunting and comparing, so a “Load more” button (or pagination) keeps them in control. Infinite scroll shines when there’s no goal beyond browsing.",
      th: "คนในบริบทนี้กำลังค้นหาและเปรียบเทียบ ปุ่ม “โหลดเพิ่ม” (หรือการแบ่งหน้า) ช่วยให้เขาควบคุมได้ ส่วน Infinite scroll เหมาะเมื่อไม่มีเป้าหมายอื่นนอกจากดูไปเรื่อย ๆ",
      zh: "这里的人在搜寻和比较，所以“加载更多”按钮（或分页）让他们保持掌控。无限滚动适合除了闲逛没有其他目标的场景。",
      ja: "ここでの人は探して比べているので、「もっと見る」ボタン（またはページ分け）なら主導権を保てます。無限スクロールが輝くのは、眺める以外に目的がないときです。",
    },
  },
  {
    id: "settings",
    title: { en: "Notification settings", th: "ตั้งค่าการแจ้งเตือน", zh: "通知设置", ja: "通知設定" },
    context: {
      en: "Three independent on/off choices: order updates, promotions and a weekly summary.",
      th: "ตัวเลือกเปิด/ปิดที่เป็นอิสระต่อกันสามข้อ: อัปเดตคำสั่งซื้อ โปรโมชัน และสรุปรายสัปดาห์",
      zh: "三个彼此独立的开/关选项：订单更新、促销信息和每周摘要。",
      ja: "注文の更新、キャンペーン、週間サマリー。互いに独立した 3 つのオン／オフ。",
    },
    a: {
      name: { en: "Toggles (instant)", th: "Toggle (มีผลทันที)", zh: "开关（立即生效）", ja: "トグル（即時反映）" },
      mock: "toggles",
      pros: {
        en: ["Takes effect instantly — no extra step", "Matches phone system settings"],
        th: ["มีผลทันที ไม่มีขั้นตอนเพิ่ม", "ตรงกับการตั้งค่าระบบในมือถือ"],
        zh: ["立即生效——没有额外步骤", "与手机系统设置的习惯一致"],
        ja: ["すぐに反映され、余計な手順がない", "スマホのシステム設定と同じ"],
      },
      cons: {
        en: ["Each flip applies immediately — no batch review", "Confusing inside forms that also need Save"],
        th: ["ทุกครั้งที่สลับมีผลทันที ตรวจทานรวมกันไม่ได้", "สับสนถ้าอยู่ในฟอร์มที่ต้องกดบันทึก"],
        zh: ["每次拨动都立即生效——无法一起检查", "放在需要“保存”的表单里会让人困惑"],
        ja: ["切り替えるたびに即反映され、まとめて見直せない", "保存が必要なフォームの中では混乱を招く"],
      },
      when: {
        en: "Independent settings that should apply immediately.",
        th: "การตั้งค่าที่เป็นอิสระต่อกันและควรมีผลทันที",
        zh: "彼此独立、应该立即生效的设置。",
        ja: "すぐに反映されるべき、独立した設定。",
      },
    },
    b: {
      name: { en: "Checkboxes + Save", th: "Checkbox + ปุ่มบันทึก", zh: "复选框 + 保存", ja: "チェックボックス ＋ 保存" },
      mock: "checkboxes",
      pros: {
        en: ["Review several changes, then commit once", "Fits naturally inside longer forms"],
        th: ["ตรวจทานหลายรายการแล้วยืนยันครั้งเดียว", "เข้ากับฟอร์มยาว ๆ ได้อย่างเป็นธรรมชาติ"],
        zh: ["可以检查多处修改，再一次性提交", "自然地融入较长的表单"],
        ja: ["複数の変更を見直してから、一度に確定できる", "長いフォームに自然になじむ"],
      },
      cons: {
        en: ["People forget to press Save and lose changes", "An extra step for simple on/off choices"],
        th: ["คนลืมกดบันทึกแล้วการเปลี่ยนแปลงหายไป", "เพิ่มขั้นตอนให้กับตัวเลือกเปิด/ปิดง่าย ๆ"],
        zh: ["人们忘了点保存，改动就丢了", "简单的开/关选择多了一步"],
        ja: ["保存を押し忘れて変更が消える", "単純なオン／オフに手順が増える"],
      },
      when: {
        en: "Choices that belong to a form, or that should be reviewed together.",
        th: "ตัวเลือกที่เป็นส่วนหนึ่งของฟอร์ม หรือควรตรวจทานพร้อมกัน",
        zh: "属于某个表单的选项，或应该一起检查的选项。",
        ja: "フォームの一部である選択肢や、まとめて見直すべき選択肢。",
      },
    },
    principles: {
      en: ["Mental models", "Feedback", "Platform conventions"],
      th: ["Mental model", "Feedback", "ความคุ้นเคยของแพลตฟอร์ม"],
      zh: ["心智模型", "反馈", "平台惯例"],
      ja: ["メンタルモデル", "フィードバック", "プラットフォームの慣習"],
    },
    note: {
      en: "These are independent, low-risk switches, so toggles match what people expect from phone settings. If they were part of a sign-up form, checkboxes would be the honest choice.",
      th: "สวิตช์เหล่านี้เป็นอิสระต่อกันและความเสี่ยงต่ำ Toggle จึงตรงกับความคาดหวังจากการตั้งค่ามือถือ แต่ถ้าเป็นส่วนหนึ่งของฟอร์มสมัครสมาชิก Checkbox จะเป็นตัวเลือกที่ตรงไปตรงมากว่า",
      zh: "这些是独立、低风险的开关，所以开关组件符合人们对手机设置的预期。如果它们是注册表单的一部分，复选框才是更诚实的选择。",
      ja: "独立していてリスクの低いスイッチなので、トグルはスマホの設定から人が期待するものと一致します。登録フォームの一部なら、チェックボックスが誠実な選択です。",
    },
  },
  {
    id: "form",
    title: { en: "Opening a bank account", th: "เปิดบัญชีธนาคาร", zh: "开立银行账户", ja: "銀行口座の開設" },
    context: {
      en: "About fifteen questions, some depending on earlier answers, completed on a phone.",
      th: "คำถามราวสิบห้าข้อ บางข้อขึ้นกับคำตอบก่อนหน้า และกรอกบนมือถือ",
      zh: "大约十五个问题，有些取决于之前的回答，在手机上完成。",
      ja: "約 15 の質問。前の回答によって変わるものもあり、スマホで入力します。",
    },
    a: {
      name: { en: "One long page", th: "หน้าเดียวยาว ๆ", zh: "一个长页面", ja: "1 枚の長いページ" },
      mock: "longform",
      pros: {
        en: ["See everything up front", "Easy to scroll back and review"],
        th: ["เห็นทุกอย่างตั้งแต่แรก", "เลื่อนกลับไปตรวจทานได้ง่าย"],
        zh: ["一开始就能看到全部", "方便往回滚动检查"],
        ja: ["最初から全体が見える", "スクロールで戻って見直しやすい"],
      },
      cons: {
        en: ["Feels overwhelming on a small screen", "Errors can be far from where you are"],
        th: ["รู้สึกท่วมท้นบนจอเล็ก", "ข้อผิดพลาดอาจอยู่ไกลจากจุดที่คุณอยู่"],
        zh: ["在小屏幕上让人压力很大", "错误可能离你当前位置很远"],
        ja: ["小さな画面では圧倒される", "エラーが今いる場所から遠いことがある"],
      },
      when: {
        en: "Short forms, or when people need to review everything together.",
        th: "ฟอร์มสั้น ๆ หรือเมื่อต้องตรวจทานทุกอย่างพร้อมกัน",
        zh: "短表单，或需要一起检查所有内容时。",
        ja: "短いフォームや、すべてをまとめて見直す必要があるとき。",
      },
    },
    b: {
      name: { en: "Step by step", th: "ทีละขั้นตอน", zh: "分步填写", ja: "ステップごと" },
      mock: "wizard",
      pros: {
        en: ["One thing at a time — less to think about", "Later questions adapt to earlier answers", "Progress is visible (Step 2 of 4)"],
        th: ["ทีละเรื่อง คิดน้อยลง", "คำถามถัดไปปรับตามคำตอบก่อนหน้าได้", "เห็นความคืบหน้า (ขั้นตอนที่ 2 จาก 4)"],
        zh: ["一次只做一件事——需要思考的更少", "后面的问题可以根据之前的回答调整", "进度清晰可见（第 2 步，共 4 步）"],
        ja: ["一度にひとつ。考えることが少ない", "後の質問が前の回答に合わせて変わる", "進捗が見える（ステップ 2／4）"],
      },
      cons: {
        en: ["You can’t see the whole task up front", "Going back must be easy, or people feel trapped"],
        th: ["มองไม่เห็นงานทั้งหมดตั้งแต่แรก", "ต้องย้อนกลับได้ง่าย ไม่อย่างนั้นคนจะรู้สึกติดกับ"],
        zh: ["一开始看不到整个任务", "返回必须很方便，否则人们会觉得被困住"],
        ja: ["最初に全体が見えない", "戻るのが簡単でないと、閉じ込められた気分になる"],
      },
      when: {
        en: "Long or branching forms, especially on mobile and for first-time users.",
        th: "ฟอร์มยาวหรือแตกแขนง โดยเฉพาะบนมือถือและผู้ใช้ครั้งแรก",
        zh: "长表单或有分支的表单，尤其是在手机上、面向首次使用的人。",
        ja: "長いフォームや分岐のあるフォーム。特にスマホや初めての人に。",
      },
    },
    principles: {
      en: ["Cognitive load", "Visibility of progress", "User control and freedom"],
      th: ["ภาระทางความคิด (Cognitive load)", "เห็นความคืบหน้า", "User control and freedom"],
      zh: ["认知负荷", "进度可见", "用户控制与自由"],
      ja: ["認知負荷", "進捗の可視化", "ユーザーの主導権と自由"],
    },
    note: {
      en: "For a long, branching form on a phone, step by step usually reduces mistakes — as long as there’s a clear progress indicator and an easy way back.",
      th: "สำหรับฟอร์มยาวที่แตกแขนงบนมือถือ การทำทีละขั้นตอนมักช่วยลดความผิดพลาด ตราบใดที่มีตัวบอกความคืบหน้าที่ชัดเจนและย้อนกลับได้ง่าย",
      zh: "对于手机上又长又有分支的表单，分步填写通常能减少错误——前提是有清晰的进度指示，以及方便的返回方式。",
      ja: "スマホでの長く分岐のあるフォームなら、ステップごとのほうがミスを減らせることが多いです。明確な進捗表示と、簡単に戻れる方法があれば。",
    },
  },
];

const copy = {
  en: {
    scenario: "Scenario {n} of {total}",
    choose: "Which would you choose?",
    pick: "Choose {name}",
    yourChoice: "Your choice",
    pros: "Strengths",
    cons: "Costs",
    when: "Choose it when…",
    principles: "Principles at play",
    inContext: "In this context",
    next: "Next scenario",
    finish: "See summary",
    restart: "Play again",
    doneTitle: "No single right answer — and you reasoned through four.",
    doneBody: "Good designers don’t memorise “the right pattern”. They ask what problem they’re solving, for whom, in what context — and weigh the trade-offs. You just practised exactly that.",
  },
  th: {
    scenario: "สถานการณ์ที่ {n} จาก {total}",
    choose: "คุณจะเลือกแบบไหน?",
    pick: "เลือก{name}",
    yourChoice: "ตัวเลือกของคุณ",
    pros: "จุดแข็ง",
    cons: "สิ่งที่ต้องแลก",
    when: "เลือกแบบนี้เมื่อ…",
    principles: "หลักการที่เกี่ยวข้อง",
    inContext: "ในบริบทนี้",
    next: "สถานการณ์ถัดไป",
    finish: "ดูสรุป",
    restart: "เล่นอีกครั้ง",
    doneTitle: "ไม่มีคำตอบเดียวที่ถูก และคุณใช้เหตุผลผ่านมาแล้วสี่สถานการณ์",
    doneBody: "นักออกแบบที่ดีไม่ได้ท่องจำ “แพทเทิร์นที่ถูก” แต่ถามว่ากำลังแก้ปัญหาอะไร ให้ใคร ในบริบทไหน แล้วชั่งน้ำหนักข้อดีข้อเสีย ซึ่งคุณเพิ่งได้ฝึกมา",
  },
  zh: {
    scenario: "场景 {n} / {total}",
    choose: "你会选哪一个？",
    pick: "选择{name}",
    yourChoice: "你的选择",
    pros: "优势",
    cons: "代价",
    when: "适合选它的时候……",
    principles: "涉及的原则",
    inContext: "在这个情境下",
    next: "下一个场景",
    finish: "查看总结",
    restart: "再玩一次",
    doneTitle: "没有唯一正确的答案——而你推理了四个场景。",
    doneBody: "好的设计师不会死记“正确的模式”。他们会问：在解决什么问题、为谁、在什么情境下——然后权衡利弊。你刚刚练习的正是这一点。",
  },
  ja: {
    scenario: "シナリオ {n}／{total}",
    choose: "あなたならどちらを選ぶ？",
    pick: "{name}を選ぶ",
    yourChoice: "あなたの選択",
    pros: "強み",
    cons: "代償",
    when: "こんなときに選ぶ…",
    principles: "関わる原則",
    inContext: "この状況では",
    next: "次のシナリオ",
    finish: "まとめを見る",
    restart: "もう一度",
    doneTitle: "正解はひとつではない。そしてあなたは 4 つを考え抜きました。",
    doneBody: "良いデザイナーは「正しいパターン」を暗記しません。何の問題を、誰のために、どんな状況で解くのかを問い、トレードオフを比べます。いま練習したのは、まさにそれです。",
  },
};

function Mock({ id }: { id: MockId }) {
  const line = (w: string, extra = "") => <span className={cn("block h-1.5 rounded bg-[#d9d9de]", w, extra)} />;
  const shell = (children: React.ReactNode) => (
    <div className="mx-auto h-48 w-[7.5rem] overflow-hidden rounded-[1.1rem] border-4 border-[#1c1c22] bg-white text-[#1a1a1e] sm:h-56 sm:w-36" aria-hidden>
      {children}
    </div>
  );
  switch (id) {
    case "hamburger":
      return shell(
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1.5 border-b border-[#eee] px-2 py-2">
            <Menu className="size-3.5" />
            {line("w-10")}
          </div>
          <div className="space-y-2 p-2">
            <span className="block h-14 rounded bg-[#ececf0]" />
            {line("w-full")}
            {line("w-4/5")}
            <span className="block h-10 rounded bg-[#ececf0]" />
            {line("w-3/5")}
          </div>
        </div>,
      );
    case "tabbar":
      return shell(
        <div className="flex h-full flex-col">
          <div className="border-b border-[#eee] px-2 py-2">{line("w-12")}</div>
          <div className="flex-1 space-y-2 p-2">
            <span className="block h-14 rounded bg-[#ececf0]" />
            {line("w-full")}
            {line("w-4/5")}
          </div>
          <div className="grid grid-cols-5 border-t border-[#eee] px-1 py-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="flex flex-col items-center gap-0.5">
                <span className={cn("size-2.5 rounded-full", i === 0 ? "bg-[#3343c4]" : "bg-[#c4c4cc]")} />
                <span className={cn("h-1 w-4 rounded", i === 0 ? "bg-[#3343c4]" : "bg-[#d9d9de]")} />
              </span>
            ))}
          </div>
        </div>,
      );
    case "infinite":
      return shell(
        <div className="relative h-full p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="block h-10 rounded bg-[#ececf0]" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-14 items-end justify-center bg-gradient-to-t from-white to-transparent pb-2">
            <span className="size-3 animate-spin rounded-full border-2 border-[#c4c4cc] border-t-[#3343c4]" />
          </div>
        </div>,
      );
    case "loadmore":
      return shell(
        <div className="flex h-full flex-col p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="block h-10 rounded bg-[#ececf0]" />
            ))}
          </div>
          <span className="mt-2 flex h-6 items-center justify-center rounded-full border border-[#3343c4] text-[0.5rem] font-bold text-[#3343c4]">+ 20</span>
          <span className="mt-auto block rounded bg-[#f3f3f1] p-1.5">
            {line("w-3/5")}
            {line("w-2/5", "mt-1")}
          </span>
        </div>,
      );
    case "toggles":
      return shell(
        <div className="space-y-3 p-3">
          {[true, false, true].map((on, i) => (
            <span key={i} className="flex items-center justify-between">
              {line("w-14")}
              <span className={cn("flex h-3.5 w-6 items-center rounded-full px-0.5", on ? "justify-end bg-[#1d7348]" : "bg-[#d4d4da]")}>
                <span className="size-2.5 rounded-full bg-white" />
              </span>
            </span>
          ))}
        </div>,
      );
    case "checkboxes":
      return shell(
        <div className="flex h-full flex-col p-3">
          <div className="space-y-3">
            {[true, false, true].map((on, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className={cn("flex size-3 items-center justify-center rounded-[3px] border", on ? "border-[#3343c4] bg-[#3343c4]" : "border-[#8e8e98]")}>
                  {on ? <Check className="size-2 text-white" strokeWidth={4} /> : null}
                </span>
                {line("w-14")}
              </span>
            ))}
          </div>
          <span className="mt-auto flex h-6 items-center justify-center rounded-md bg-[#3343c4] text-[0.5rem] font-bold text-white">Save</span>
        </div>,
      );
    case "longform":
      return shell(
        <div className="relative h-full space-y-1.5 p-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block">
              {line("w-8")}
              <span className="mt-0.5 block h-3 rounded-[3px] border border-[#d4d4da]" />
            </span>
          ))}
          <span className="absolute top-2 right-0.5 h-12 w-1 rounded bg-[#c4c4cc]" />
        </div>,
      );
    case "wizard":
      return shell(
        <div className="flex h-full flex-col p-2">
          <span className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-1 flex-1 rounded", i <= 1 ? "bg-[#3343c4]" : "bg-[#e1e1e6]")} />
            ))}
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold text-[#5c5c66]">2 / 4</span>
          <span className="mt-3 block space-y-2">
            {[0, 1].map((i) => (
              <span key={i} className="block">
                {line("w-10")}
                <span className="mt-1 block h-4 rounded-[3px] border border-[#d4d4da]" />
              </span>
            ))}
          </span>
          <span className="mt-auto flex gap-1">
            <span className="flex h-6 flex-1 items-center justify-center rounded-md border border-[#d4d4da] text-[0.5rem]">‹</span>
            <span className="flex h-6 flex-[2] items-center justify-center rounded-md bg-[#3343c4] text-[0.5rem] font-bold text-white">›</span>
          </span>
        </div>,
      );
  }
}

export function WhichWouldYouChoose() {
  const t = useCopy(copy);
  const { locale } = useI18n();
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Record<string, "a" | "b">>({});
  const [finished, setFinished] = useState(false);
  useLabComplete("which-would-you-choose", finished);

  const s = SCENARIOS[index];
  const chosen = choices[s.id];
  const fill = (str: string, v: Record<string, string | number>) => str.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <CompletionCard title={t.doneTitle}>{t.doneBody}</CompletionCard>
        <ul className="divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
          {SCENARIOS.map((sc) => (
            <li key={sc.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-ink">{pick(sc.title, locale)}</span>
              <span className="text-[0.875rem] font-semibold text-accent-ink">{pick(choices[sc.id] === "a" ? sc.a.name : sc.b.name, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setChoices({});
              setIndex(0);
              setFinished(false);
            }}
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-accent-ink hover:bg-surface"
          >
            <RotateCcw className="size-4" aria-hidden /> {t.restart}
          </button>
        </div>
      </div>
    );
  }

  // Phones keep A and B side by side (comparison needs both in view);
  // the trade-offs open underneath in full width, aligned to each side.
  const card = (key: "a" | "b") => {
    const d = s[key];
    const isChosen = chosen === key;
    return (
      <div
        className={cn(
          "flex flex-col rounded-[var(--radius-xl)] border-2 bg-surface p-3 transition-colors sm:p-5",
          isChosen ? "border-accent" : chosen ? "border-line opacity-90" : "border-line",
        )}
      >
        <div className="mb-3 flex min-h-8 flex-wrap items-center justify-between gap-1 sm:mb-4">
          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-[0.8125rem] font-bold text-bg sm:size-8 sm:text-sm">{key.toUpperCase()}</span>
          {isChosen ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-[0.6875rem] font-semibold text-accent-ink sm:px-2.5 sm:text-[0.75rem]">
              <Check className="size-3" aria-hidden /> {t.yourChoice}
            </span>
          ) : null}
        </div>
        <Mock id={d.mock} />
        <p className="mt-3 text-center text-[0.9375rem] leading-snug font-semibold text-ink sm:mt-4 sm:text-[1.125rem]">{pick(d.name, locale)}</p>
        {!chosen ? (
          <button
            type="button"
            onClick={() => setChoices((c) => ({ ...c, [s.id]: key }))}
            className="mt-4 min-h-11 rounded-full bg-ink px-3 py-2 text-[0.8125rem] leading-tight font-semibold text-bg hover:opacity-90 sm:mt-5 sm:text-sm"
          >
            {fill(t.pick, { name: pick(d.name, locale) })}
          </button>
        ) : null}
      </div>
    );
  };

  const details = (key: "a" | "b") => {
    const d = s[key];
    return (
      <div className={cn("rounded-[var(--radius-lg)] border bg-surface p-4 text-[0.875rem] sm:p-5", chosen === key ? "border-accent/40" : "border-line")}>
        <p className="mb-3 font-semibold text-ink">
          {key.toUpperCase()} · {pick(d.name, locale)}
        </p>
        <div className="space-y-3">
          <div>
            <p className="mb-1 font-semibold text-success">{t.pros}</p>
            <ul className="space-y-1 text-ink-2">
              {pick(d.pros, locale).map((p) => (
                <li key={p} className="flex gap-1.5">
                  <Plus className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-error">{t.cons}</p>
            <ul className="space-y-1 text-ink-2">
              {pick(d.cons, locale).map((p) => (
                <li key={p} className="flex gap-1.5">
                  <Minus className="mt-0.5 size-3.5 shrink-0 text-error" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-[var(--radius-sm)] bg-surface-2 p-3 text-ink">
            <span className="font-semibold">{t.when}</span> {pick(d.when, locale)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 text-center">
        <p className="type-label">{fill(t.scenario, { n: index + 1, total: SCENARIOS.length })}</p>
        <h2 className="type-h2 mt-2">{pick(s.title, locale)}</h2>
        <p className="measure mx-auto mt-3 text-ink-2">{pick(s.context, locale)}</p>
        {!chosen ? <p className="mt-4 font-semibold text-ink">{t.choose}</p> : null}
      </div>

      <div aria-live="polite">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {card("a")}
          {card("b")}
        </div>
        {chosen ? (
          <div className="animate-fade-up mt-3 grid gap-3 md:mt-4 md:grid-cols-2 md:gap-4">
            {details("a")}
            {details("b")}
          </div>
        ) : null}
      </div>

      {chosen ? (
        <div className="animate-fade-up mt-6 rounded-[var(--radius-xl)] border border-accent/25 bg-accent-soft p-6">
          <p className="type-label mb-2 text-accent-ink">{t.inContext}</p>
          <p className="text-ink">{pick(s.note, locale)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] font-semibold text-ink-2">{t.principles}:</span>
            {pick(s.principles, locale).map((p) => (
              <span key={p} className="rounded-full bg-surface px-2.5 py-1 text-[0.75rem] font-semibold text-ink">
                {p}
              </span>
            ))}
          </div>
          <div className="mt-5 text-right">
            <button
              type="button"
              onClick={() => {
                if (index < SCENARIOS.length - 1) {
                  setIndex(index + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else setFinished(true);
              }}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
            >
              {index < SCENARIOS.length - 1 ? t.next : t.finish} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
