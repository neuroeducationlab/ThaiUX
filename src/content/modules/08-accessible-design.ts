import type { LearningModule } from "../types";

export const accessibleDesign: LearningModule = {
  id: "accessible-design",
  number: 8,
  title: { th: "Accessibility · ออกแบบเพื่อทุกคน", en: "Accessibility", zh: "无障碍设计", ja: "アクセシビリティ" },
  summary: {
    th: "Inclusive design คอนทราสต์ การใช้งานด้วยคีย์บอร์ด และปฏิสัมพันธ์ที่ทุกคนเข้าถึงได้",
    en: "Inclusive design, contrast, keyboard access and accessible interactions — design that works for everyone.",
    zh: "包容性设计、对比度、键盘可访问性与无障碍交互——让设计适合每一个人。",
    ja: "インクルーシブデザイン、コントラスト、キーボード操作、アクセシブルなインタラクション。誰にとっても使えるデザイン。",
  },
  minutes: 8,
  scenario: {
    th: "คุณยายพยายามจองคิวหมอออนไลน์ ตัวอักษรสีเทาบนพื้นขาวจางเกินไป ปฏิทินเลือกวันต้องลากอย่างแม่นยำ และระบบหมดเวลาระหว่างที่ท่านยังอ่านไม่จบ สุดท้ายท่านต้องขอให้คุณช่วยทำให้ อีกครั้ง",
    en: "Your grandmother tries to book a doctor’s appointment online. The grey-on-white text is too faint, the date picker only works with a precise drag, and the session times out while she reads. She asks you to do it for her — again.",
    zh: "你的奶奶想在网上预约看医生。白底灰字太浅，日期选择器只能靠精确拖动，而她还没读完页面就超时了。最后她又一次请你帮忙。",
    ja: "おばあちゃんがオンラインで病院の予約をしようとしています。白地にグレーの文字は薄すぎ、日付の選択は正確なドラッグが必要で、読んでいる間にセッションが切れてしまいます。結局、またあなたに頼むことになりました。",
  },
  what: {
    th: [
      "Accessibility หมายถึงการที่ผู้พิการสามารถรับรู้ เข้าใจ นำทาง และโต้ตอบกับผลิตภัณฑ์ได้อย่างเท่าเทียม รวมถึงมีส่วนร่วมกับมันได้ด้วย",
      "Inclusive design คือแนวคิดเบื้องหลัง: มองให้เห็นว่าใครถูกกีดกัน เรียนรู้จากความหลากหลาย และแก้ปัญหาให้คนหนึ่งคนในแบบที่ขยายไปช่วยคนจำนวนมาก",
    ],
    en: [
      "Accessibility means people with disabilities can perceive, understand, navigate and interact with a product — and contribute to it — equally.",
      "Inclusive design is the mindset behind it: recognise exclusion, learn from diversity, and solve for one person in a way that extends to many.",
    ],
    zh: [
      "无障碍意味着残障人士能够平等地感知、理解、浏览和使用产品——并为它做出贡献。",
      "包容性设计是背后的思维方式：识别谁被排斥，从多样性中学习，用能惠及许多人的方式为一个人解决问题。",
    ],
    ja: [
      "アクセシビリティとは、障害のある人も、製品を同じように知覚し、理解し、移動し、操作し、さらに貢献できることを意味します。",
      "インクルーシブデザインはその背後にある考え方です。排除に気づき、多様性から学び、ひとりのための解決を、多くの人に広がる形で行います。",
    ],
  },
  why: {
    th: [
      "เรื่องนี้เกี่ยวกับคนเป็นอันดับแรก มีผู้คนกว่าพันล้านคนที่มีความพิการ และเราทุกคนต่างแก่ลงหรือบาดเจ็บได้ หลายประเทศยังมีกฎหมายกำหนดเรื่อง Accessibility ซึ่งมักอ้างอิง WCAG",
      "ดีไซน์ที่เข้าถึงได้มักเป็นดีไซน์ที่ดีกว่าสำหรับทุกคน ตัวอักษรที่ชัดขึ้น เป้ากดที่ใหญ่ขึ้น ขั้นตอนที่ง่ายขึ้น และการรองรับคีย์บอร์ดที่ดีขึ้น ช่วยผู้ใช้ทุกคน",
    ],
    en: [
      "It’s about people first: over a billion people live with a disability, and all of us age or get injured. Many countries also require accessibility by law, often referencing WCAG.",
      "Accessible design is usually better design for everyone — clearer text, bigger targets, simpler flows and better keyboard support help all users.",
    ],
    zh: [
      "这首先关乎人：全球有超过十亿人身患残障，而我们每个人都会变老、也可能受伤。许多国家还通过法律要求无障碍，通常以 WCAG 为参照。",
      "无障碍设计通常对所有人都是更好的设计——更清晰的文字、更大的点击目标、更简单的流程和更好的键盘支持，惠及每一位用户。",
    ],
    ja: [
      "何よりも人のためです。世界で 10 億人以上が障害とともに暮らし、私たちは誰もが年を取り、けがをすることもあります。多くの国では法律でもアクセシビリティが求められ、その多くが WCAG を参照しています。",
      "アクセシブルなデザインは、たいてい誰にとっても良いデザインです。読みやすい文字、大きなターゲット、シンプルな流れ、優れたキーボード対応は、すべての人を助けます。",
    ],
  },
  topics: [
    {
      title: { th: "Inclusive design", en: "Inclusive design", zh: "包容性设计", ja: "インクルーシブデザイン" },
      body: {
        th: "ความพิการไม่ได้มีแค่แบบถาวร Persona spectrum ของ Microsoft จับคู่ข้อจำกัดแบบถาวร (มีแขนข้างเดียว) ชั่วคราว (แขนเจ็บ) และตามสถานการณ์ (อุ้มลูกอยู่) ทางแก้เดียวช่วยได้ทั้งสามแบบ",
        en: "Disability isn’t only permanent. Microsoft’s persona spectrum pairs permanent (one arm), temporary (arm injury) and situational (holding a baby) limitations — one solution helps all three.",
        zh: "残障不只是永久性的。微软的“人物光谱”把永久性（只有一只手臂）、暂时性（手臂受伤）和情境性（抱着婴儿）限制放在一起——一个方案能同时帮助这三种人。",
        ja: "障害は永続的なものだけではありません。マイクロソフトのペルソナ・スペクトラムは、永続的（片腕）、一時的（腕のけが）、状況的（赤ちゃんを抱いている）な制約を並べて示します。ひとつの解決策が、3 つすべてを助けます。",
      },
    },
    {
      title: { th: "คอนทราสต์", en: "Contrast", zh: "对比度", ja: "コントラスト" },
      body: {
        th: "WCAG ระดับ AA กำหนดให้คอนทราสต์อย่างน้อย 4.5:1 สำหรับตัวอักษรทั่วไป และ 3:1 สำหรับตัวอักษรขนาดใหญ่และขอบของคอนโทรล เช่น ช่องกรอกและปุ่ม",
        en: "WCAG AA asks for a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text and for the edges of controls such as inputs and buttons.",
        zh: "WCAG AA 级要求普通文字的对比度至少为 4.5:1，大号文字以及输入框、按钮等控件边缘的对比度至少为 3:1。",
        ja: "WCAG の AA レベルでは、通常の文字はコントラスト比 4.5:1 以上、大きな文字や入力欄・ボタンなどのコントロールの境界は 3:1 以上が求められます。",
      },
    },
    {
      title: { th: "การใช้งานด้วยคีย์บอร์ด", en: "Keyboard accessibility", zh: "键盘可访问性", ja: "キーボードでの操作" },
      body: {
        th: "ทุกอย่างต้องใช้ได้ด้วย Tab, Enter, Space, ปุ่มลูกศร และ Esc เรียงตามลำดับที่สมเหตุสมผล มองเห็นโฟกัสชัด และไม่มีจุดที่คีย์บอร์ดติดอยู่แล้วออกไม่ได้",
        en: "Everything must work with Tab, Enter, Space, the arrow keys and Esc — in a logical order, with a visible focus, and with no keyboard traps.",
        zh: "一切都必须能用 Tab、Enter、空格、方向键和 Esc 操作——顺序合乎逻辑，焦点清晰可见，并且没有让键盘“出不去”的陷阱。",
        ja: "すべてを Tab、Enter、Space、矢印キー、Esc で操作できること。順序は論理的に、フォーカスは見えるように、そしてキーボードが抜け出せなくなる罠をつくらないこと。",
      },
    },
    {
      title: { th: "ปฏิสัมพันธ์ที่เข้าถึงได้", en: "Accessible interactions", zh: "无障碍交互", ja: "アクセシブルなインタラクション" },
      body: {
        th: "ให้ทางเลือกที่ง่ายกว่าแทนท่าทางและการลาก เป้ากดอย่างน้อย 24×24 พิกเซล ประกาศการเปลี่ยนสถานะให้โปรแกรมอ่านหน้าจอรับรู้ เคารพการตั้งค่าลดการเคลื่อนไหว และอย่าสื่อความหมายด้วยสีอย่างเดียว",
        en: "Give gestures and drags a simple alternative, keep targets at least 24×24 px, announce status changes to screen readers, respect reduced-motion settings, and never convey meaning by colour alone.",
        zh: "为手势和拖动提供简单的替代方式，点击目标至少 24×24 像素，向读屏软件播报状态变化，尊重“减少动态效果”的设置，并且绝不只用颜色传达含义。",
        ja: "ジェスチャーやドラッグには簡単な代替手段を用意し、ターゲットは 24×24 px 以上に。状態の変化はスクリーンリーダーに知らせ、動きを減らす設定を尊重し、意味を色だけで伝えないこと。",
      },
    },
  ],
  example: {
    id: "contrast-checker",
    caption: {
      th: "เลือกสีตัวอักษรและพื้นหลัง แล้วดูค่าคอนทราสต์ตาม WCAG ว่าผ่านหรือไม่ แบบเรียลไทม์",
      en: "Pick text and background colours and see the WCAG contrast ratio — and whether it passes — live.",
      zh: "选择文字和背景颜色，实时查看 WCAG 对比度——以及是否达标。",
      ja: "文字と背景の色を選んで、WCAG のコントラスト比と合否をリアルタイムで確認しましょう。",
    },
  },
  takeaway: {
    th: "Accessibility ไม่ใช่ฟีเจอร์ แต่เป็นคุณภาพที่ทำให้ทุกคนใช้ได้ทุกฟีเจอร์",
    en: "Accessibility isn’t a feature. It’s the quality that lets everyone use every feature.",
    zh: "无障碍不是一项功能，而是让每个人都能使用每项功能的品质。",
    ja: "アクセシビリティは機能ではない。誰もが、すべての機能を使えるようにする品質だ。",
  },
  reflect: {
    th: "เก็บเมาส์ไว้ แล้วใช้เว็บไซต์หนึ่งด้วยคีย์บอร์ดอย่างเดียวห้านาที คุณติดอยู่ตรงไหนบ้าง?",
    en: "Put your mouse away and use a website for five minutes with only the keyboard. Where did you get stuck?",
    zh: "把鼠标收起来，只用键盘浏览一个网站五分钟。你在哪里卡住了？",
    ja: "マウスをしまって、キーボードだけで 5 分間ウェブサイトを使ってみましょう。どこで行き詰まりましたか？",
  },
  concepts: ["accessibility", "focus-state", "drag-and-drop", "error-state"],
  lab: ["ux-detective"],
  sources: ["wai-intro", "wai-principles", "wcag22", "wcag-contrast", "wcag-non-text-contrast", "wcag-keyboard", "ms-inclusive", "govuk-inclusive", "webdev-learn-a11y", "wai-designing", "wai-inclusion", "mdn-reduced-motion"],
};
