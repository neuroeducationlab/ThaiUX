"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Lightbulb, RotateCcw, Search, Star, Eye } from "lucide-react";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { ProgressBar } from "@/components/ui/controls";
import { useCopy } from "@/components/demos/use-copy";
import { CompletionCard, PhoneFrame, useLabComplete } from "./lab-shell";

type RegionId = "header" | "restaurant" | "address" | "items" | "qty" | "coupon" | "payment" | "phone" | "total" | "cta";
const ISSUES: RegionId[] = ["address", "qty", "coupon", "payment", "phone", "total", "cta"];

type Note = { title: string; principle?: string; text: string; hint?: string };

const copy = {
  en: {
    screen: "Checkout",
    restaurant: "Baan Somtam",
    eta: "25–35 min",
    deliverTo: "Deliver to",
    address: "99/12 Sukhumvit 31, Bangkok 10110",
    items: [
      ["Som tam Thai", "฿60", "1"],
      ["Grilled chicken", "฿120", "1"],
      ["Sticky rice", "฿20", "2"],
    ],
    coupon: "Coupon code",
    apply: "Apply",
    payment: "Payment",
    paymentMethod: "PromptPay",
    change: "change",
    phone: "Phone",
    error: "Error 422",
    total: "Total",
    footnote: "*fees calculated at payment",
    addMore: "ADD MORE ITEMS",
    submit: "submit",
    intro: "Every part of this checkout is clickable. Investigate anything that feels off — 7 real problems are hiding here.",
    found: "Found {n} of {total}",
    hint: "Hint",
    reveal: "Reveal all",
    reset: "Start over",
    fine: "Looks fine",
    issueLabel: "Problem",
    latest: "Your notes",
    empty: "Click a part of the screen to inspect it.",
    doneTitle: "Case closed — you found all 7!",
    doneBody: "You just ran a mini heuristic evaluation: inspecting an interface against known UX principles. Real teams do this before testing with users.",
    regionLabel: "Inspect: {name}",
    notes: {
      header: { title: "Screen title", text: "Fine. People can see they’re on the checkout screen." },
      restaurant: { title: "Restaurant and delivery time", text: "Fine — showing the time estimate up front is good visibility of system status." },
      address: {
        title: "Faint delivery address",
        principle: "Contrast · WCAG 1.4.3",
        text: "Light grey on white is about 1.7:1 — far below 4.5:1. Outdoors, almost nobody can check where the food is going. Fix: use the normal body-text colour.",
        hint: "Can you comfortably read everything you need to confirm before ordering?",
      },
      items: { title: "Items and prices", text: "Fine — names and prices are clear and easy to scan." },
      qty: {
        title: "Tiny − and + buttons",
        principle: "Target size · Fitts’s Law",
        text: "16-pixel buttons squeezed together invite mis-taps — especially on the back of a motorbike taxi. Fix: at least 24×24 px (44 is better) with space between.",
        hint: "Try changing a quantity with your thumb…",
      },
      coupon: {
        title: "A silent coupon button",
        principle: "Feedback · Visibility of system status",
        text: "Press “Apply” and nothing changes. Did the discount work? People retype the code or give up. Fix: show “Code applied: −฿30”, or a clear error.",
        hint: "What happens after you press a button here?",
      },
      payment: {
        title: "“change” doesn’t look tappable",
        principle: "Affordance · signifiers",
        text: "Grey, lowercase and not underlined, it reads as plain text — people who want to switch payment can’t see how. Fix: style it as a link or a small button.",
        hint: "Imagine you want to pay by card instead.",
      },
      phone: {
        title: "“Error 422”",
        principle: "Error messages · Heuristic #9",
        text: "A code means nothing to a hungry customer. Fix: say what’s wrong and how to fix it — “Enter a 10-digit mobile number.”",
        hint: "Something here is trying to tell you what went wrong. Does it?",
      },
      total: {
        title: "Surprise fees",
        principle: "Honesty · no surprises",
        text: "The asterisk hides service and delivery fees until payment. Unexpected extra costs are one of the most common reasons people abandon a checkout. Fix: show the full total before the button.",
        hint: "Is the price you see the price you’ll pay?",
      },
      cta: {
        title: "The main action is the weakest button",
        principle: "Button hierarchy · clear labels",
        text: "“Add more items” shouts in orange while the real goal — placing the order — is a small grey “submit”. Fix: one strong primary button that names the outcome: “Place order · ฿289”.",
        hint: "Where would you tap to finish? How sure are you?",
      },
    } as Record<RegionId, Note>,
  },
  th: {
    screen: "ชำระเงิน",
    restaurant: "บ้านส้มตำ",
    eta: "25–35 นาที",
    deliverTo: "ส่งที่",
    address: "99/12 สุขุมวิท 31 กรุงเทพฯ 10110",
    items: [
      ["ส้มตำไทย", "฿60", "1"],
      ["ไก่ย่าง", "฿120", "1"],
      ["ข้าวเหนียว", "฿20", "2"],
    ],
    coupon: "โค้ดส่วนลด",
    apply: "ใช้โค้ด",
    payment: "ชำระด้วย",
    paymentMethod: "พร้อมเพย์",
    change: "เปลี่ยน",
    phone: "เบอร์โทร",
    error: "Error 422",
    total: "ยอดรวม",
    footnote: "*ค่าธรรมเนียมคำนวณตอนชำระเงิน",
    addMore: "สั่งเพิ่ม",
    submit: "ส่ง",
    intro: "ทุกส่วนของหน้านี้คลิกได้ ลองสืบสวนจุดที่รู้สึกแปลก ๆ มีปัญหาจริงซ่อนอยู่ 7 จุด",
    found: "เจอแล้ว {n} จาก {total}",
    hint: "คำใบ้",
    reveal: "เฉลยทั้งหมด",
    reset: "เริ่มใหม่",
    fine: "ส่วนนี้โอเค",
    issueLabel: "ปัญหา",
    latest: "บันทึกการสืบสวน",
    empty: "คลิกส่วนใดก็ได้ของหน้าจอเพื่อตรวจสอบ",
    doneTitle: "ปิดคดี! คุณเจอครบทั้ง 7 จุด",
    doneBody: "คุณเพิ่งทำ Heuristic evaluation แบบย่อ คือการตรวจอินเทอร์เฟซเทียบกับหลักการ UX ที่รู้จักกันดี ทีมจริงทำแบบนี้ก่อนนำไปทดสอบกับผู้ใช้",
    regionLabel: "ตรวจสอบ: {name}",
    notes: {
      header: { title: "ชื่อหน้าจอ", text: "โอเค ผู้ใช้รู้ว่าตอนนี้อยู่ที่หน้าชำระเงิน" },
      restaurant: { title: "ร้านและเวลาจัดส่ง", text: "โอเค การบอกเวลาจัดส่งโดยประมาณตั้งแต่แรกคือ Visibility of system status ที่ดี" },
      address: {
        title: "ที่อยู่จัดส่งจางเกินไป",
        principle: "คอนทราสต์ · WCAG 1.4.3",
        text: "สีเทาอ่อนบนพื้นขาวมีคอนทราสต์ราว 1.7:1 ต่ำกว่า 4.5:1 มาก ถ้าอยู่กลางแจ้งแทบไม่มีใครตรวจได้ว่าอาหารจะไปส่งที่ไหน วิธีแก้: ใช้สีเดียวกับตัวอักษรเนื้อหาปกติ",
        hint: "คุณอ่านทุกอย่างที่ต้องตรวจก่อนสั่งได้สบายตาไหม?",
      },
      items: { title: "รายการอาหารและราคา", text: "โอเค ชื่อและราคาอ่านง่าย กวาดตาดูได้เร็ว" },
      qty: {
        title: "ปุ่ม − และ + เล็กเกินไป",
        principle: "ขนาดเป้ากด · กฎของ Fitts",
        text: "ปุ่มขนาด 16 พิกเซลที่อยู่ชิดกัน ทำให้กดพลาดง่าย โดยเฉพาะตอนนั่งวินมอเตอร์ไซค์ วิธีแก้: อย่างน้อย 24×24 พิกเซล (44 จะดีกว่า) และเว้นระยะห่าง",
        hint: "ลองนึกภาพว่าเปลี่ยนจำนวนด้วยนิ้วโป้ง…",
      },
      coupon: {
        title: "ปุ่มใช้โค้ดที่เงียบกริบ",
        principle: "Feedback · Visibility of system status",
        text: "กด “ใช้โค้ด” แล้วไม่มีอะไรเปลี่ยน ส่วนลดใช้ได้หรือยัง? คนจะพิมพ์ซ้ำหรือยอมแพ้ วิธีแก้: แสดง “ใช้โค้ดแล้ว −฿30” หรือข้อความแจ้งข้อผิดพลาดที่ชัดเจน",
        hint: "กดปุ่มตรงนี้แล้วเกิดอะไรขึ้น?",
      },
      payment: {
        title: "คำว่า “เปลี่ยน” ดูไม่เหมือนกดได้",
        principle: "Affordance · Signifier",
        text: "เป็นสีเทาและไม่มีขีดเส้นใต้ ดูเหมือนข้อความธรรมดา คนที่อยากเปลี่ยนวิธีจ่ายจะไม่รู้ว่าต้องทำอย่างไร วิธีแก้: ทำให้ดูเป็นลิงก์หรือปุ่มเล็ก ๆ",
        hint: "ลองนึกว่าคุณอยากจ่ายด้วยบัตรแทน",
      },
      phone: {
        title: "“Error 422”",
        principle: "ข้อความแจ้งข้อผิดพลาด · Heuristic ข้อ 9",
        text: "รหัสข้อผิดพลาดไม่มีความหมายสำหรับคนที่หิวอยู่ วิธีแก้: บอกว่าผิดอะไรและแก้อย่างไร เช่น “กรอกเบอร์มือถือ 10 หลัก”",
        hint: "ตรงนี้มีบางอย่างพยายามบอกว่าเกิดอะไรผิดพลาด มันบอกได้ชัดไหม?",
      },
      total: {
        title: "ค่าธรรมเนียมที่โผล่มาทีหลัง",
        principle: "ความโปร่งใส · ไม่มีเซอร์ไพรส์",
        text: "เครื่องหมายดอกจันซ่อนค่าบริการและค่าส่งไว้จนถึงตอนจ่าย ค่าใช้จ่ายที่ไม่คาดคิดคือหนึ่งในเหตุผลที่พบบ่อยที่สุดที่คนทิ้งตะกร้า วิธีแก้: แสดงยอดรวมทั้งหมดก่อนถึงปุ่ม",
        hint: "ราคาที่เห็น คือราคาที่ต้องจ่ายจริงไหม?",
      },
      cta: {
        title: "การกระทำหลักกลายเป็นปุ่มที่อ่อนที่สุด",
        principle: "ลำดับชั้นของปุ่ม · ป้ายที่ชัดเจน",
        text: "“สั่งเพิ่ม” ตะโกนด้วยสีส้ม ขณะที่เป้าหมายจริงคือการสั่งอาหาร กลับเป็นปุ่ม “ส่ง” สีเทาเล็ก ๆ วิธีแก้: ปุ่มหลักที่เด่นหนึ่งปุ่มและบอกผลลัพธ์ เช่น “สั่งอาหาร · ฿289”",
        hint: "ถ้าจะสั่งให้เสร็จ คุณจะกดตรงไหน? มั่นใจแค่ไหน?",
      },
    },
  },
  zh: {
    screen: "结账",
    restaurant: "Baan Somtam 泰式小馆",
    eta: "25–35 分钟",
    deliverTo: "送至",
    address: "曼谷素坤逸 31 巷 99/12 号 10110",
    items: [
      ["泰式青木瓜沙拉", "฿60", "1"],
      ["烤鸡", "฿120", "1"],
      ["糯米饭", "฿20", "2"],
    ],
    coupon: "优惠码",
    apply: "使用",
    payment: "支付方式",
    paymentMethod: "PromptPay",
    change: "更改",
    phone: "电话",
    total: "合计",
    footnote: "*费用在支付时计算",
    addMore: "继续加购",
    submit: "提交",
    intro: "这个结账页面的每个部分都可以点击。调查任何让你觉得不对劲的地方——这里藏着 7 个真实问题。",
    found: "已找到 {n} / {total}",
    hint: "提示",
    reveal: "显示全部",
    reset: "重新开始",
    fine: "这里没问题",
    issueLabel: "问题",
    latest: "调查笔记",
    empty: "点击屏幕上的任意部分进行检查。",
    doneTitle: "结案——7 个问题全部找到！",
    doneBody: "你刚刚完成了一次迷你启发式评估：对照公认的 UX 原则检查界面。真实的团队会在用户测试之前这样做。",
    regionLabel: "检查：{name}",
    notes: {
      header: { title: "页面标题", text: "没问题。人们知道自己在结账页面。" },
      restaurant: { title: "餐厅与送达时间", text: "没问题——一开始就显示预计时间，是很好的系统状态可见性。" },
      address: {
        title: "送餐地址太淡",
        principle: "对比度 · WCAG 1.4.3",
        text: "白底浅灰字的对比度约为 1.7:1，远低于 4.5:1。在户外，几乎没人能核对饭会送到哪里。修改：使用正文文字的颜色。",
        hint: "下单前需要确认的信息，你都能轻松看清吗？",
      },
      items: { title: "菜品与价格", text: "没问题——名称和价格清晰，易于浏览。" },
      qty: {
        title: "极小的 − 和 + 按钮",
        principle: "目标尺寸 · 费茨定律",
        text: "挤在一起的 16 像素按钮很容易点错——尤其是在摩的后座上。修改：至少 24×24 像素（44 更好），并留出间距。",
        hint: "试着想象用拇指修改数量……",
      },
      coupon: {
        title: "毫无反应的优惠码按钮",
        principle: "反馈 · 系统状态可见",
        text: "点了“使用”却什么都没变。优惠生效了吗？人们会重新输入或干脆放弃。修改：显示“已使用优惠码：−฿30”，或明确的错误提示。",
        hint: "点了这里的按钮之后，发生了什么？",
      },
      payment: {
        title: "“更改”看起来不能点",
        principle: "示能 · 意符",
        text: "灰色、没有下划线，看起来像普通文字——想换支付方式的人找不到入口。修改：把它做成链接或小按钮的样子。",
        hint: "想象你想改用银行卡支付。",
      },
      phone: {
        title: "“Error 422”",
        principle: "错误提示 · 第 9 条启发式原则",
        text: "错误代码对饥肠辘辘的顾客毫无意义。修改：说明哪里错了以及如何修正——“请输入 10 位手机号。”",
        hint: "这里有东西想告诉你哪里出了错。它说清楚了吗？",
      },
      total: {
        title: "意外的费用",
        principle: "坦诚 · 不制造意外",
        text: "星号把服务费和配送费藏到了支付时。意外的额外费用是人们放弃结账最常见的原因之一。修改：在按钮之前显示完整的总价。",
        hint: "你看到的价格，就是你要付的价格吗？",
      },
      cta: {
        title: "主要操作成了最弱的按钮",
        principle: "按钮层级 · 清晰的标签",
        text: "“继续加购”用橙色大喊，而真正的目标——下单——却是一个小小的灰色“提交”。修改：一个醒目的主按钮，并写明结果：“下单 · ฿289”。",
        hint: "要完成下单，你会点哪里？有多确定？",
      },
    },
  },
  ja: {
    screen: "購入手続き",
    restaurant: "バーン・ソムタム",
    eta: "25〜35 分",
    deliverTo: "お届け先",
    address: "バンコク スクンビット 31 99/12 10110",
    items: [
      ["ソムタム・タイ", "฿60", "1"],
      ["焼き鳥（ガイヤーン）", "฿120", "1"],
      ["もち米", "฿20", "2"],
    ],
    coupon: "クーポンコード",
    apply: "適用",
    payment: "お支払い",
    paymentMethod: "PromptPay",
    change: "変更",
    phone: "電話番号",
    total: "合計",
    footnote: "*手数料はお支払い時に計算されます",
    addMore: "さらに追加",
    submit: "送信",
    intro: "この購入画面は、どこでもクリックできます。違和感のあるところを調べてみましょう。本当の問題が 7 つ隠れています。",
    found: "{total} 個中 {n} 個発見",
    hint: "ヒント",
    reveal: "すべて表示",
    reset: "最初から",
    fine: "ここは問題なし",
    issueLabel: "問題",
    latest: "調査メモ",
    empty: "画面のどこかをクリックして調べてみましょう。",
    doneTitle: "事件解決！ 7 つすべて見つけました",
    doneBody: "いま、ミニ・ヒューリスティック評価を行いました。知られた UX 原則に照らしてインターフェースを点検する方法です。実際のチームは、ユーザーテストの前にこれを行います。",
    regionLabel: "調べる：{name}",
    notes: {
      header: { title: "画面タイトル", text: "問題なし。購入画面にいることが分かります。" },
      restaurant: { title: "店名とお届け時間", text: "問題なし。最初から目安時間を示すのは、良いシステム状態の可視化です。" },
      address: {
        title: "薄すぎるお届け先",
        principle: "コントラスト · WCAG 1.4.3",
        text: "白地に薄いグレーはコントラスト比が約 1.7:1 で、4.5:1 を大きく下回ります。屋外では、料理がどこに届くのかほとんど確認できません。対策：通常の本文と同じ色を使う。",
        hint: "注文前に確認すべき情報を、楽に読めますか？",
      },
      items: { title: "料理と価格", text: "問題なし。名前と価格がはっきりしていて、ざっと見やすいです。" },
      qty: {
        title: "小さすぎる − と + のボタン",
        principle: "ターゲットサイズ · フィッツの法則",
        text: "16 ピクセルのボタンが隣り合っていると、押し間違いが起きます。バイクタクシーの後ろならなおさら。対策：少なくとも 24×24 px（44 が望ましい）にして、間隔をあける。",
        hint: "親指で数量を変えるところを想像してみて…",
      },
      coupon: {
        title: "何も起きないクーポンボタン",
        principle: "フィードバック · システム状態の可視化",
        text: "「適用」を押しても何も変わりません。割引は効いた？ 人はコードを打ち直すか、あきらめます。対策：「コードを適用しました：−฿30」か、分かりやすいエラーを表示する。",
        hint: "ここのボタンを押したあと、何が起きましたか？",
      },
      payment: {
        title: "「変更」が押せそうに見えない",
        principle: "アフォーダンス · シグニファイア",
        text: "グレーで下線もなく、ただの文字に見えます。支払い方法を変えたい人は、方法が分かりません。対策：リンクか小さなボタンのように見せる。",
        hint: "カードで払いたくなったと想像してみて。",
      },
      phone: {
        title: "「Error 422」",
        principle: "エラーメッセージ · ヒューリスティック第 9 項",
        text: "エラーコードは、お腹をすかせたお客さんには意味がありません。対策：何が問題で、どう直すかを伝える。「10 桁の携帯番号を入力してください」。",
        hint: "ここで何かが、問題を伝えようとしています。伝わりますか？",
      },
      total: {
        title: "あとから出てくる手数料",
        principle: "誠実さ · サプライズをつくらない",
        text: "アスタリスクが、サービス料と配送料を支払い時まで隠しています。予想外の追加費用は、購入をやめる最もよくある理由のひとつです。対策：ボタンの前に合計金額をすべて表示する。",
        hint: "見えている金額は、本当に支払う金額ですか？",
      },
      cta: {
        title: "メインの操作が一番弱いボタン",
        principle: "ボタンの階層 · 明確なラベル",
        text: "「さらに追加」がオレンジで叫ぶ一方、本当の目的である注文は、小さなグレーの「送信」。対策：結果を示す、目立つメインボタンをひとつ。「注文する · ฿289」。",
        hint: "注文を完了するなら、どこを押しますか？ どれくらい自信がありますか？",
      },
    },
  },
};

export function UxDetective() {
  const t = useCopy(copy);
  const [inspected, setInspected] = useState<RegionId[]>([]);
  const [latest, setLatest] = useState<RegionId | null>(null);
  const [hinted, setHinted] = useState<RegionId | null>(null);

  const calloutRef = useRef<HTMLDivElement>(null);
  // On small screens, nudge the page so the explanation under the tapped part is visible.
  useEffect(() => {
    const el = calloutRef.current;
    if (latest && el && getComputedStyle(el).display !== "none") el.scrollIntoView({ block: "nearest" });
  }, [latest]);

  const found = ISSUES.filter((i) => inspected.includes(i));
  const done = found.length === ISSUES.length;
  useLabComplete("ux-detective", done);

  const inspect = (id: RegionId) => {
    setInspected((s) => (s.includes(id) ? s : [...s, id]));
    setLatest(id);
    if (hinted === id) setHinted(null);
  };

  const pin = (id: RegionId) => {
    const n = found.indexOf(id);
    if (n >= 0)
      return (
        <span className="animate-pop absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center rounded-full bg-[#d92d20] text-[0.75rem] font-bold text-white shadow-md">
          {n + 1}
        </span>
      );
    if (inspected.includes(id))
      return (
        <span className="animate-pop absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center rounded-full bg-[#1d7348] text-[0.75rem] font-bold text-white shadow-md" aria-hidden>
          ✓
        </span>
      );
    return null;
  };

  const region = (id: RegionId, children: React.ReactNode, className = "") => {
    const isIssueFound = found.includes(id);
    return (
      <button
        type="button"
        onClick={() => inspect(id)}
        aria-label={format(t.regionLabel, { name: t.notes[id].title })}
        className={cn(
          "relative block w-full cursor-zoom-in rounded-[10px] text-left outline-2 outline-offset-0 outline-transparent transition-[outline-color,background-color]",
          "hover:outline-dashed hover:outline-[#3343c4]/60 focus-visible:outline-solid focus-visible:outline-[#3343c4]",
          isIssueFound && "bg-[#fcecea] outline-solid outline-[#d92d20]/70",
          hinted === id && "animate-pulse outline-solid outline-[#f5a524]",
          className,
        )}
      >
        {pin(id)}
        {children}
      </button>
    );
  };

  /** Below lg the side panel is off-screen, so explain right under the tapped part. */
  const callout = (...ids: RegionId[]) => {
    if (!latest || !ids.includes(latest)) return null;
    const n = t.notes[latest];
    const issue = ISSUES.includes(latest);
    return (
      <div ref={calloutRef} aria-hidden className="animate-fade-up mx-1 scroll-mt-24 scroll-mb-28 rounded-[10px] bg-[#1a1a1e] p-3 text-[0.8125rem] leading-snug text-white lg:hidden">
        <p className="flex items-center gap-1.5 font-semibold">
          <span className={cn("size-2 shrink-0 rounded-full", issue ? "bg-[#ff6b5e]" : "bg-[#5ccb8e]")} />
          {n.title}
        </p>
        {n.principle ? <p className="mt-0.5 text-[#b9c1ff]">{n.principle}</p> : null}
        <p className="mt-1 text-[#d4d4da]">{n.text}</p>
      </div>
    );
  };

  const note = latest ? t.notes[latest] : null;
  const latestIsIssue = latest ? ISSUES.includes(latest) : false;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <div data-intentionally-flawed>
        <PhoneFrame>
          <div className="space-y-1 p-3 text-[0.875rem]">
            {region(
              "header",
              <div className="flex items-center gap-2 px-2 py-2">
                <ChevronLeft className="size-5" aria-hidden />
                <span className="font-semibold">{t.screen}</span>
              </div>,
            )}
            {callout("header")}
            {region(
              "restaurant",
              <div className="px-2 py-2">
                <p className="font-semibold">{t.restaurant}</p>
                <p className="flex items-center gap-1 text-[0.8125rem] text-[#5c5c66]">
                  <Star className="size-3.5 fill-[#f5a524] text-[#f5a524]" aria-hidden /> 4.7 · {t.eta}
                </p>
              </div>,
            )}
            {callout("restaurant")}
            {region(
              "address",
              <div className="px-2 py-2">
                <p className="text-[0.75rem] text-[#c8c8cc]">{t.deliverTo}</p>
                <p className="text-[0.8125rem] text-[#cfcfd4]">{t.address}</p>
              </div>,
            )}
            {callout("address")}
            <div className="grid grid-cols-[1fr_auto] gap-1">
              {region(
                "items",
                <ul className="space-y-2 px-2 py-2">
                  {t.items.map(([name, price]) => (
                    <li key={name} className="flex justify-between gap-2">
                      <span>{name}</span>
                      <span className="tabular text-[#5c5c66]">{price}</span>
                    </li>
                  ))}
                </ul>,
              )}
              {region(
                "qty",
                <ul className="space-y-2 px-1.5 py-2">
                  {t.items.map(([name, , qty]) => (
                    <li key={name} className="flex items-center gap-0.5">
                      <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#eee] text-[0.625rem]">−</span>
                      <span className="tabular w-4 text-center text-[0.75rem]">{qty}</span>
                      <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#eee] text-[0.625rem]">+</span>
                    </li>
                  ))}
                </ul>,
              )}
            </div>
            {callout("items", "qty")}
            {region(
              "coupon",
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="flex h-9 flex-1 items-center rounded-[6px] border border-[#ddd] px-2 text-[0.8125rem] text-[#9a9aa2]">{t.coupon}</span>
                <span className="flex h-9 items-center rounded-[6px] bg-[#f1f1f1] px-3 text-[0.8125rem]">{t.apply}</span>
              </div>,
            )}
            {callout("coupon")}
            {region(
              "payment",
              <div className="flex items-center justify-between px-2 py-2">
                <span>
                  {t.payment}: <strong>{t.paymentMethod}</strong>
                </span>
                <span className="text-[0.8125rem] text-[#a5a5ad]">{t.change}</span>
              </div>,
            )}
            {callout("payment")}
            {region(
              "phone",
              <div className="px-2 py-2">
                <p className="mb-1 text-[0.8125rem]">{t.phone}</p>
                <span className="flex h-9 items-center rounded-[6px] border-2 border-[#d92d20] px-2 text-[0.8125rem]">0812</span>
                <p className="mt-1 text-[0.75rem] font-semibold text-[#d92d20]">{t.error}</p>
              </div>,
            )}
            {callout("phone")}
            {region(
              "total",
              <div className="px-2 py-2">
                <p className="flex justify-between font-semibold">
                  <span>{t.total}</span>
                  <span className="tabular">฿220*</span>
                </p>
                <p className="text-[0.625rem] text-[#b5b5bb]">{t.footnote}</p>
              </div>,
            )}
            {callout("total")}
            {region(
              "cta",
              <div className="space-y-2 px-2 pt-1 pb-3">
                <span className="flex h-12 items-center justify-center rounded-[10px] bg-[#ff7a1a] text-[0.875rem] font-bold tracking-wide text-white">{t.addMore}</span>
                <span className="flex h-8 items-center justify-center rounded-[6px] border border-[#ddd] text-[0.75rem] text-[#9a9aa2]">{t.submit}</span>
              </div>,
            )}
            {callout("cta")}
          </div>
        </PhoneFrame>
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-ink-2">{t.intro}</p>
        <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Search className="size-4 text-accent-ink" aria-hidden />
              {format(t.found, { n: found.length, total: ISSUES.length })}
            </p>
          </div>
          <ProgressBar value={found.length} max={ISSUES.length} label={format(t.found, { n: found.length, total: ISSUES.length })} />

          <div className="mt-5 min-h-28" aria-live="polite">
            {note ? (
              <div className={cn("animate-fade-up rounded-[var(--radius-md)] p-4", latestIsIssue ? "bg-error-soft" : "bg-success-soft")}>
                <p className={cn("text-[0.75rem] font-bold tracking-wide uppercase", latestIsIssue ? "text-error" : "text-success")}>
                  {latestIsIssue ? `${t.issueLabel} ${found.indexOf(latest as RegionId) + 1}` : t.fine}
                </p>
                <p className="mt-1 font-semibold text-ink">{note.title}</p>
                {note.principle ? <p className="text-[0.8125rem] font-medium text-accent-ink">{note.principle}</p> : null}
                <p className="mt-2 text-[0.9375rem] text-ink-2">{note.text}</p>
              </div>
            ) : hinted ? (
              <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-warning-soft p-4 text-[0.9375rem] text-warning">
                <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden /> {t.notes[hinted].hint}
              </p>
            ) : (
              <p className="text-[0.9375rem] text-ink-2">{t.empty}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={done}
              onClick={() => {
                const next = ISSUES.find((i) => !inspected.includes(i));
                if (next) {
                  setHinted(next);
                  setLatest(null);
                }
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-semibold text-ink hover:bg-surface-2 disabled:opacity-40"
            >
              <Lightbulb className="size-4" aria-hidden /> {t.hint}
            </button>
            <button
              type="button"
              disabled={done}
              onClick={() => {
                setInspected((s) => Array.from(new Set([...s, ...ISSUES])));
                setLatest(null);
                setHinted(null);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-semibold text-ink hover:bg-surface-2 disabled:opacity-40"
            >
              <Eye className="size-4" aria-hidden /> {t.reveal}
            </button>
            <button
              type="button"
              onClick={() => {
                setInspected([]);
                setLatest(null);
                setHinted(null);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface-2"
            >
              <RotateCcw className="size-4" aria-hidden /> {t.reset}
            </button>
          </div>
        </div>

        {found.length ? (
          <section aria-label={t.latest}>
            <h3 className="type-label mb-3">{t.latest}</h3>
            <ol className="space-y-2">
              {found.map((id, i) => (
                <li key={id} className="flex gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-error text-[0.75rem] font-bold text-white dark:text-[#2a0b08]">{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-ink">{t.notes[id].title}</span>
                    <span className="block text-[0.8125rem] text-accent-ink">{t.notes[id].principle}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {done ? <CompletionCard title={t.doneTitle}>{t.doneBody}</CompletionCard> : null}
      </div>
    </div>
  );
}
