import type { Localized } from "@/i18n/localized";

/**
 * Homepage copy. Editorial text lives here (not in the UI dictionaries)
 * so it can be rewritten without touching components.
 */
export const home = {
  hero: {
    eyebrow: {
      th: "โรงเรียน UX/UI แบบลงมือทำ · 4 ภาษา",
      en: "A hands-on UX/UI school · 4 languages",
      zh: "动手学的 UX/UI 课堂 · 4 种语言",
      ja: "手を動かして学ぶ UX/UI · 4 言語",
    },
    /** In `en` the serif line *is* the headline, so it isn’t repeated. */
    title: {
      th: "เรียน UX/UI ผ่านการลอง ไม่ใช่แค่อ่าน",
      en: "Learn UX by experiencing it.",
      zh: "亲手体验 UX/UI，而不只是阅读。",
      ja: "読むだけじゃない。体験して学ぶ UX/UI。",
    },
    serifLine: "Learn UX by experiencing it.",
    lead: {
      th: "ศัพท์ หลักการ และแนวคิด UX/UI ที่อธิบายให้เข้าใจง่าย พร้อมตัวอย่างที่คุณลองได้จริง",
      en: "UX/UI terms, principles and ideas explained simply — each with an example you can actually try.",
      zh: "用简单的方式讲解 UX/UI 的术语、原则和概念——每一个都配有你可以真正动手尝试的示例。",
      ja: "UX/UI の用語・原則・考え方をやさしく解説。どれも実際に試せる例つきです。",
    },
    primary: { th: "เริ่มสำรวจ", en: "Start exploring", zh: "开始探索", ja: "探索をはじめる" },
    secondary: { th: "เข้าสู่ Lab", en: "Enter the Lab", zh: "进入实验室", ja: "ラボに入る" },
    stats: {
      concepts: { th: "แนวคิด", en: "concepts", zh: "个概念", ja: "の概念" },
      modules: { th: "บทเรียน", en: "modules", zh: "个单元", ja: "のモジュール" },
      experiments: { th: "การทดลอง", en: "experiments", zh: "个实验", ja: "の実験" },
      languages: { th: "ภาษา", en: "languages", zh: "种语言", ja: "言語" },
    },
  },

  stage: {
    label: { th: "ปุ่มนี้คือบทเรียน", en: "This button is a lesson", zh: "这个按钮就是一堂课", ja: "このボタンが教材です" },
    button: { th: "กดฉันสิ", en: "Press me", zh: "按我试试", ja: "押してみて" },
    done: { th: "เรียบร้อย", en: "Done", zh: "完成", ja: "完了" },
    prompt: {
      th: "ลองชี้ ลองกด หรือกด Tab เพื่อไปที่ปุ่มด้วยคีย์บอร์ด",
      en: "Point at it, press it — or press Tab to reach it with a keyboard.",
      zh: "指向它、按下它——或者按 Tab 键用键盘找到它。",
      ja: "ポインターを乗せる、押す、または Tab キーでボタンまで移動してみましょう。",
    },
    explain: {
      hover: {
        th: "ปุ่มตอบสนองก่อนคุณคลิก คุณจึงรู้ว่ามันกดได้",
        en: "It reacted before you clicked, so you knew it was clickable.",
        zh: "你还没点击它就有了反应，所以你知道它可以点。",
        ja: "クリックする前に反応したので、押せると分かりました。",
      },
      active: {
        th: "ปุ่มยุบลงตอนกด ยืนยันว่าระบบรับรู้การสัมผัสแล้ว",
        en: "It pressed in under your finger, confirming the touch.",
        zh: "按下时它会微微下沉，确认收到了你的操作。",
        ja: "押した瞬間にへこみ、操作が伝わったことを確認できます。",
      },
      focus: {
        th: "วงแหวนบอกผู้ใช้คีย์บอร์ดว่ากำลังอยู่ตรงไหน",
        en: "The ring shows keyboard users exactly where they are.",
        zh: "这个外框告诉键盘用户现在的位置。",
        ja: "リングが、キーボード利用者にいまの位置を示します。",
      },
      feedback: {
        th: "ระบบบอกผลลัพธ์ให้รู้ทันที ไม่ต้องเดา",
        en: "It told you the result straight away. No guessing.",
        zh: "它立刻告诉你结果，不用猜。",
        ja: "結果をすぐに伝えてくれるので、迷いません。",
      },
    } as Record<"hover" | "active" | "focus" | "feedback", Localized>,
    progress: { th: "สัมผัสแล้ว {n} จาก {total}", en: "{n} of {total} experienced", zh: "已体验 {n} / {total}", ja: "{total} 個中 {n} 個を体験" },
    complete: {
      th: "นี่คือศัพท์ UX ที่คุณเรียนรู้ด้วยการสัมผัส ไม่ใช่การท่องจำ",
      en: "UX terms learnt by feeling them, not by memorising them.",
      zh: "这些 UX 术语，你是靠亲身感受学会的，而不是死记硬背。",
      ja: "暗記ではなく、体験で覚えた UX 用語です。",
    },
    touchPrompt: {
      th: "ลองแตะปุ่ม แล้วสังเกตว่ามันตอบสนองอย่างไร",
      en: "Tap it and watch how it responds.",
      zh: "点一下按钮，看看它如何回应。",
      ja: "タップして、どう反応するか見てみましょう。",
    },
    touch: {
      th: "บนจอสัมผัสไม่มี Hover และวงแหวน Focus จะปรากฏเมื่อใช้คีย์บอร์ดเท่านั้น อีกสองเรื่องที่นักออกแบบต้องคิดเผื่อ",
      en: "Touch screens have no hover, and focus rings appear only with a keyboard — two more things designers plan for.",
      zh: "触摸屏没有悬停，焦点环也只在使用键盘时出现——这又是设计师需要考虑的两件事。",
      ja: "タッチ画面にはホバーがなく、フォーカスリングはキーボード操作のときだけ表示されます。どちらもデザイナーが考慮すること。",
    },
  },

  what: {
    eyebrow: { th: "UX คืออะไร?", en: "What is UX?", zh: "什么是 UX？", ja: "UX とは？" },
    title: {
      th: "UX คือความรู้สึกตอนใช้งาน UI คือสิ่งที่คุณเห็นและแตะได้",
      en: "UX is how it feels to use something. UI is what you see and touch.",
      zh: "UX 是使用时的感受，UI 是你看到和触碰的部分。",
      ja: "UX は使ったときの体験。UI は目に見えて、触れる部分。",
    },
    body: {
      th: "ทุกครั้งที่คุณสั่งอาหาร โอนเงิน หรือจองตั๋ว มีคนตัดสินใจแทนคุณไว้แล้วว่าปุ่มอยู่ตรงไหน เขียนว่าอะไร และถ้ามีอะไรผิดพลาดจะเกิดอะไรขึ้น การออกแบบ UX คือการตัดสินใจเหล่านั้นอย่างตั้งใจ เพื่อคนที่ใช้งานจริง",
      en: "Every time you order food, transfer money or book a ticket, someone has already decided where the button goes, what it says and what happens when something goes wrong. UX design is making those decisions on purpose — for real people.",
      zh: "每次你点外卖、转账或订票时，早就有人替你决定好了：按钮放在哪里、上面写什么、出错时会发生什么。UX 设计，就是为真实的人有意识地做出这些决定。",
      ja: "フードを注文するとき、送金するとき、チケットを予約するとき。ボタンをどこに置き、何と書き、うまくいかないときに何が起きるかは、すでに誰かが決めています。UX デザインとは、そうした判断を、実際に使う人のために意図して行うことです。",
    },
    cta: { th: "เริ่มจากบทที่ 1: UX คืออะไร?", en: "Start with Module 1: What is UX?", zh: "从第 1 单元开始：什么是 UX？", ja: "モジュール 1「UX とは？」からはじめる" },
    uxLabel: { th: "UX · ประสบการณ์", en: "UX · the experience", zh: "UX · 体验", ja: "UX · 体験" },
    uiLabel: { th: "UI · หน้าตา", en: "UI · the interface", zh: "UI · 界面", ja: "UI · インターフェース" },
    ux: {
      th: ["หาสิ่งที่ต้องการเจอไหม?", "ใช้แล้วง่ายและเร็วไหม?", "รู้สึกมั่นใจไหมว่าทำถูก?"],
      en: ["Can I find what I need?", "Is it quick and easy?", "Do I feel sure I did it right?"],
      zh: ["我能找到需要的东西吗？", "用起来快速、简单吗？", "我确定自己做对了吗？"],
      ja: ["必要なものが見つかる？", "速くて簡単？", "ちゃんとできたと安心できる？"],
    } as Localized<string[]>,
    ui: {
      th: ["ปุ่ม ไอคอน และฟอร์ม", "สี ตัวอักษร และระยะห่าง", "เลย์เอาต์และลำดับชั้น"],
      en: ["Buttons, icons and forms", "Colour, type and spacing", "Layout and hierarchy"],
      zh: ["按钮、图标和表单", "颜色、字体和间距", "布局和层级"],
      ja: ["ボタン、アイコン、フォーム", "色、文字、余白", "レイアウトと階層"],
    } as Localized<string[]>,
    pathTitle: {
      th: "ทุกบทเรียนเดินตามเส้นทางเดียวกัน",
      en: "Every lesson follows one path",
      zh: "每一课都遵循同一条路径",
      ja: "すべてのレッスンは、同じ道筋で進みます",
    },
    path: [
      {
        title: { th: "ปัญหา", en: "Problem", zh: "问题", ja: "問題" },
        desc: { th: "อะไรที่ยากสำหรับผู้ใช้?", en: "What’s hard for people?", zh: "人们觉得哪里难？", ja: "人にとって何が難しい？" },
      },
      {
        title: { th: "การตัดสินใจ", en: "Decision", zh: "决定", ja: "判断" },
        desc: { th: "นักออกแบบเลือกทางไหน?", en: "What did the designer choose?", zh: "设计师做了什么选择？", ja: "デザイナーは何を選んだ？" },
      },
      {
        title: { th: "การโต้ตอบ", en: "Interaction", zh: "交互", ja: "インタラクション" },
        desc: { th: "ลองด้วยตัวเอง", en: "Try it yourself.", zh: "亲手试一试。", ja: "自分で試す。" },
      },
      {
        title: { th: "ผลลัพธ์", en: "Result", zh: "结果", ja: "結果" },
        desc: { th: "ทำไมถึงได้ผล?", en: "Why does it work?", zh: "为什么有效？", ja: "なぜうまくいく？" },
      },
    ] as { title: Localized; desc: Localized }[],
  },

  explore: {
    eyebrow: { th: "คลังศัพท์", en: "Glossary", zh: "术语库", ja: "用語集" },
    title: {
      th: "{n} แนวคิด ที่คุณลองได้จริง",
      en: "{n} concepts you can touch",
      zh: "{n} 个可以亲手体验的概念",
      ja: "触って分かる {n} の概念",
    },
    lead: {
      th: "แบ่งเป็นสี่กลุ่ม เริ่มจากกลุ่มไหนก็ได้ ทุกคำใช้เวลาเข้าใจประมาณหนึ่งนาที",
      en: "Four groups — start anywhere. Each one takes about a minute to understand.",
      zh: "分为四组——从哪里开始都可以。每一个大约一分钟就能理解。",
      ja: "4 つのグループに分かれています。どこから始めても大丈夫。どれも約 1 分で理解できます。",
    },
    all: { th: "ดูทั้งหมด", en: "See all concepts", zh: "查看全部概念", ja: "すべての概念を見る" },
  },

  preview: {
    eyebrow: { th: "ลองดูตัวอย่าง", en: "Interactive preview", zh: "互动预览", ja: "インタラクティブ・プレビュー" },
    title: {
      th: "เข้าใจในหนึ่งนาที แล้วลองด้วยมือคุณเอง",
      en: "Understand it in a minute. Then try it with your own hands.",
      zh: "一分钟理解，然后亲手试一试。",
      ja: "1 分で理解して、自分の手で試す。",
    },
    open: { th: "เปิดบทเรียนเต็ม", en: "Open the full lesson", zh: "打开完整课程", ja: "レッスン全体を見る" },
  },

  lab: {
    eyebrow: { th: "ห้องทดลอง", en: "The Lab", zh: "实验室", ja: "ラボ" },
  },

  path: {
    eyebrow: { th: "เส้นทางการเรียน", en: "Learning path", zh: "学习路径", ja: "学習パス" },
    title: {
      th: "จากศูนย์ สู่การคิดแบบนักออกแบบ",
      en: "From zero to thinking like a designer",
      zh: "从零开始，学会像设计师一样思考",
      ja: "ゼロから、デザイナーのように考えるまで",
    },
    lead: {
      th: "แปดบทสั้น ๆ เรียงจากพื้นฐานไปถึงการออกแบบที่ทุกคนใช้ได้ เรียนบทละ 5–8 นาที",
      en: "Eight short modules, from the basics to designing for everyone. Five to eight minutes each.",
      zh: "八个简短的单元，从基础到为所有人设计。每个 5–8 分钟。",
      ja: "基礎から、誰もが使えるデザインまで。1 つ 5〜8 分の短いモジュールが 8 つ。",
    },
    start: { th: "เริ่มบทที่ 1", en: "Start Module 1", zh: "开始第 1 单元", ja: "モジュール 1 をはじめる" },
  },

  about: {
    eyebrow: { th: "เกี่ยวกับโปรเจกต์", en: "About the project", zh: "关于这个项目", ja: "このプロジェクトについて" },
    title: {
      th: "ทำในประเทศไทย เพื่อคนที่อยากเริ่มต้น",
      en: "Made in Thailand, for anyone starting out",
      zh: "在泰国制作，献给每一位初学者",
      ja: "タイで生まれた、はじめる人のためのサイト",
    },
    body: {
      th: "ThaiUX เป็นโปรเจกต์การเรียนรู้ของ Molly แหล่งเรียน UX ส่วนใหญ่เป็นภาษาอังกฤษ และอธิบายด้วยตัวหนังสือเป็นหลัก ที่นี่จึงตั้งใจทำให้ต่างออกไป: เรียนด้วยการลอง ในภาษาของคุณเอง และเว็บไซต์นี้เองก็ถูกออกแบบตามหลักการที่สอนทุกข้อ",
      en: "ThaiUX is Molly’s learning project. Most UX resources are in English and explain ideas with words alone. This one is different on purpose: you learn by trying, in your own language — and the site itself follows every principle it teaches.",
      zh: "ThaiUX 是 Molly 的学习项目。大多数 UX 学习资源都是英文的，而且主要靠文字讲解。这里有意做得不同：通过动手尝试来学习，用你自己的语言——而且这个网站本身也遵循它所教的每一条原则。",
      ja: "ThaiUX は Molly の学習プロジェクトです。UX の教材の多くは英語で、言葉だけで説明しています。ここはあえて違うやり方を選びました。自分の言語で、試しながら学ぶ。そしてこのサイト自体が、教えている原則をすべて守っています。",
    },
    more: { th: "เรื่องราวและวิธีคิด", en: "The story and the thinking", zh: "背后的故事与思考", ja: "ストーリーと考え方" },
    caseStudy: { th: "อ่าน Case study", en: "Read the case study", zh: "阅读案例研究", ja: "ケーススタディを読む" },
    languages: { th: "อ่านได้ใน", en: "Read it in", zh: "支持语言", ja: "対応言語" },
  },
};
