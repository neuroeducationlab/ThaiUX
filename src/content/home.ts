import type { Localized } from "@/i18n/localized";

/**
 * Homepage copy. Editorial text lives here (not in the UI dictionaries)
 * so it can be rewritten without touching components.
 */
export const home = {
  hero: {
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

  /**
   * The hero’s right side (UXDR-31): one clear call to action that plays a
   * fast, pausable tour of what people get — effects, copy-ready prompts,
   * learning by doing, and a certificate — told as one easy journey.
   */
  tour: {
    region: {
      th: "ทัวร์ 30 วินาที: สิ่งที่คุณจะได้จาก UXLab",
      en: "30-second tour: what you get from UXLab",
      zh: "30 秒导览：你能从 UXLab 得到什么",
      ja: "30 秒ツアー：UXLab で得られるもの",
    },
    kicker: {
      th: "ไม่รู้จะทำหน้าเว็บให้ว้าวยังไง?",
      en: "Not sure how to make your UI stand out?",
      zh: "不知道怎样让界面更出彩？",
      ja: "UI を魅力的にする方法、迷っていませんか？",
    },
    title: { th: "UXLab คือคำตอบ", en: "UXLab is the answer.", zh: "答案就在 UXLab。", ja: "答えは UXLab に。" },
    cta: { th: "ดูทัวร์ 30 วินาที", en: "Take the 30-second tour", zh: "看 30 秒导览", ja: "30 秒ツアーを見る" },
    ctaAgain: { th: "ดูทัวร์อีกครั้ง", en: "Watch the tour again", zh: "再看一次导览", ja: "もう一度ツアーを見る" },
    ctaSub: {
      th: "เห็นทุกอย่างที่คุณจะได้ · หยุดได้ทุกเมื่อ",
      en: "Everything you’ll get · pause any time",
      zh: "看看你能得到什么 · 随时可以暂停",
      ja: "得られるものをひと目で · いつでも一時停止",
    },
    /** The journey: four steps, which are also the tour’s four parts. */
    steps: [
      { th: "เลือกเอฟเฟกต์", en: "Pick an effect", zh: "挑选特效", ja: "エフェクトを選ぶ" },
      { th: "Copy prompt", en: "Copy the prompt", zh: "复制提示词", ja: "プロンプトをコピー" },
      { th: "เรียน + ฝึก", en: "Learn + practise", zh: "边学边练", ja: "学ぶ + 試す" },
      { th: "รับเกียรติ\u2060บัตร", en: "Get your certificate", zh: "获得证书", ja: "修了証をもらう" }, // word joiner: keep “เกียรติบัตร” on one line
    ] as Localized[],
    stepsLong: [
      { th: "เลือกเอฟเฟกต์ที่ชอบ จาก {n} แบบ", en: "Pick an effect you love — {n} to choose from", zh: "从 {n} 种特效中挑一个喜欢的", ja: "{n} 種類から好きなエフェクトを選ぶ" },
      {
        th: "Copy prompt ไปวางใน AI ที่คุณใช้ vibe code",
        en: "Copy its prompt into the AI you vibe-code with",
        zh: "把提示词复制到你用来 vibe coding 的 AI",
        ja: "プロンプトを、バイブコーディングに使う AI に貼る",
      },
      { th: "เรียนศัพท์จากการลองเล่น แล้วฝึกต่อใน Lab", en: "Learn by playing — then practise in the Lab", zh: "动手玩着学，再去实验室练手", ja: "遊んで学び、Lab で練習する" },
      { th: "เรียนครบ 8 บท รับเกียรติบัตรในชื่อคุณ", en: "Finish 8 modules, get a certificate in your name", zh: "学完 8 个单元，获得写有你名字的证书", ja: "8 モジュールを終えて、名前入りの修了証を受け取る" },
    ] as Localized[],
    /** Two lines per part: the problem, then the answer. */
    captions: [
      [
        { th: "หน้าเว็บของคุณดูเรียบไปไหม?", en: "Does your page feel a bit flat?", zh: "你的页面是不是有点平淡？", ja: "あなたのページ、ちょっと地味じゃないですか？" },
        {
          th: "ใส่เอฟเฟกต์ไม่กี่อัน หน้าเดิมก็มีชีวิตทันที",
          en: "Add a few effects and the same page comes alive.",
          zh: "加几个特效，同一个页面立刻活了起来。",
          ja: "エフェクトを足すだけで、同じページが見違えます。",
        },
      ],
      [
        { th: "ชอบอันไหน มี Prompt ให้ก๊อปทุกอัน", en: "Like one? Every effect comes with a prompt.", zh: "喜欢哪个？每个特效都附有提示词。", ja: "気に入ったら？どのエフェクトにもプロンプト付き。" },
        { th: "วางใน AI ที่คุณใช้ vibe code แล้วได้เลย", en: "Paste it into your AI coding tool — done.", zh: "粘贴到你的 AI 编程工具里——搞定。", ja: "AI コーディングツールに貼るだけ。完成！" },
      ],
      [
        {
          th: "งงศัพท์ UX/UI? ชี้ที่คำ แล้วลองเล่นได้ทันที",
          en: "UX/UI jargon? Point at a word and play with it.",
          zh: "看不懂 UX/UI 术语？指向一个词，马上动手玩。",
          ja: "UX/UI 用語が難しい？言葉に乗せれば、すぐ試せます。",
        },
        { th: "เข้าใจทีละคำ แล้วไปฝึกต่อใน Lab", en: "Grasp each one — then practise in the Lab.", zh: "一个个弄懂，然后进实验室练手。", ja: "ひとつずつ理解したら、Lab で練習。" },
      ],
      [
        { th: "เรียนครบ 8 บทสั้น ๆ…", en: "Finish eight short modules…", zh: "学完 8 个简短的单元……", ja: "8 つの短いモジュールを終えたら…" },
        { th: "…รับเกียรติบัตรในชื่อคุณ", en: "…and get a certificate in your name.", zh: "……获得写有你名字的证书。", ja: "…あなたの名前入りの修了証を。" },
      ],
    ] as [Localized, Localized][],
    chapter: { th: "ตอนที่ {n}/{total}", en: "Part {n} of {total}", zh: "第 {n} 部分，共 {total} 部分", ja: "パート {n} / {total}" },
    pause: { th: "หยุดทัวร์ชั่วคราว", en: "Pause the tour", zh: "暂停导览", ja: "ツアーを一時停止" },
    play: { th: "เล่นทัวร์ต่อ", en: "Resume the tour", zh: "继续导览", ja: "ツアーを再開" },
    close: { th: "ปิดทัวร์", en: "Close the tour", zh: "关闭导览", ja: "ツアーを閉じる" },
    replay: { th: "ดูอีกครั้ง", en: "Watch again", zh: "再看一次", ja: "もう一度見る" },
    paused: { th: "หยุดไว้ก่อน กดเพื่อดูต่อ", en: "Paused — press to carry on", zh: "已暂停，按一下继续", ja: "一時停止中。押すと続きます" },
    copiedPaused: {
      th: "ก๊อปแล้ว! หยุดทัวร์ไว้ให้ ไปวางใน AI ของคุณได้เลย",
      en: "Copied! The tour is paused — go and paste it into your AI.",
      zh: "已复制！导览已暂停——去粘贴到你的 AI 吧。",
      ja: "コピーしました！ツアーは止めておくので、AI に貼ってみて。",
    },
    goTo: { th: "ไปที่ตอน {n}: {name}", en: "Go to part {n}: {name}", zh: "跳到第 {n} 部分：{name}", ja: "パート {n} へ：{name}" },
    mockCta: { th: "สมัครเลย", en: "Sign up", zh: "立即注册", ja: "登録する" },
    nothing: { th: "กดแล้ว… ไม่มีอะไรเกิดขึ้น", en: "Click… nothing happens", zh: "点了……什么也没发生", ja: "押しても…何も起きない" },
    effectsBadge: { th: "{n} เอฟเฟกต์ ลองเล่นได้ทุกอัน", en: "{n} effects, all playable", zh: "{n} 种特效，全部可以玩", ja: "{n} 種のエフェクト、全部遊べる" },
    copied: { th: "คัดลอกแล้ว", en: "Copied", zh: "已复制", ja: "コピー済み" },
    aiTitle: { th: "AI ที่คุณใช้ vibe code", en: "Your AI coding tool", zh: "你的 AI 编程工具", ja: "あなたの AI コーディングツール" },
    aiPlaceholder: { th: "วาง Prompt ที่นี่…", en: "Paste a prompt…", zh: "粘贴提示词……", ja: "プロンプトを貼り付け…" },
    aiReply: {
      th: "เพิ่มปุ่มแม่เหล็กให้แล้ว ลองชี้ดูสิ",
      en: "Added a magnetic button. Try pointing at it!",
      zh: "已添加磁吸按钮，指向它试试！",
      ja: "マグネットボタンを追加しました。近づけてみて！",
    },
    like: { th: "ถูกใจ", en: "Like", zh: "点赞", ja: "いいね" },
    liked: { th: "ถูกใจแล้ว", en: "Liked", zh: "已点赞", ja: "いいね済み" },
    doneKicker: { th: "ทัวร์จบแล้ว", en: "That’s the tour", zh: "导览结束", ja: "ツアーはここまで" },
    doneTitle: { th: "ง่ายแค่นี้เอง", en: "It’s that easy.", zh: "就这么简单。", ja: "こんなにかんたん。" },
    /** Effects the first part switches on, in order (names stay in English). */
    chips: ["gooey", "glow-cards", "magnetic", "celebrate"] as const,
    /** The effect whose prompt the second part copies. */
    promptEffect: "magnetic" as const,
    /** Glossary cards in the third part; the last one opens. */
    concepts: ["hover", "tooltip", "feedback"] as const,
    /** Lab experiment shown at the end of part 3. */
    lab: {
      experiment: "build-a-button" as const,
      badge: { th: "Lab · ฝึกจริง", en: "Lab · hands-on", zh: "Lab · 动手练", ja: "Lab · 実践" },
      prompt: { th: "ลองประกอบปุ่มที่ใช้งานได้จริง", en: "Try building a working button", zh: "试着搭一个真能用的按钮", ja: "本物のボタンを組み立てる" },
      done: { th: "ครบ 5/5 — เก่งมาก!", en: "5/5 complete — nice work!", zh: "5/5 完成——太棒了！", ja: "5/5 完了！" },
    },
  },

  /** Promotion for the Effects library: the hero pill and the moving rail. */
  effects: {
    badge: { th: "ใหม่", en: "New", zh: "新", ja: "NEW" },
    announce: {
      th: "คลังเอฟเฟกต์ {n} แบบ พร้อม Prompt",
      en: "{n} playable effects, with AI prompts",
      zh: "{n} 种可玩特效，附 AI 提示词",
      ja: "遊べるエフェクト {n} 種・プロンプト付き",
    },
    eyebrow: { th: "ใหม่ · คลังเอฟเฟกต์", en: "New · Effects library", zh: "新 · 特效库", ja: "NEW · エフェクト集" },
    title: {
      th: "เล่นก่อน แล้วสร้างเองด้วย AI",
      en: "Play first. Then build it with AI.",
      zh: "先玩，再用 AI 做出来。",
      ja: "まず遊んで、AI で作ろう。",
    },
    lead: {
      th: "{n} เอฟเฟกต์ที่ตอบสนองต่อเมาส์จริง ทุกอันมี Prompt ให้ก๊อปไปสร้างเองได้ทันที",
      en: "{n} effects that answer your mouse — each with a prompt you can copy and build yourself.",
      zh: "{n} 种会回应鼠标的特效——每一种都附有可以复制、自己动手做的提示词。",
      ja: "マウスに反応する {n} のエフェクト。どれも、コピーして自分で作れるプロンプト付き。",
    },
    cta: { th: "ดูทั้ง {n} เอฟเฟกต์", en: "See all {n} effects", zh: "查看全部 {n} 种特效", ja: "{n} 種類すべて見る" },
    hintMouse: {
      th: "ชี้การ์ดเพื่อหยุด แล้วลองเล่นได้เลย",
      en: "Point at a card to stop it, then play.",
      zh: "把光标移到卡片上就会停下，然后开始玩。",
      ja: "カードを指すと止まります。そのまま遊んでみて。",
    },
    hintTouch: {
      th: "แตะการ์ดเพื่อเล่น ปัดเพื่อดูเพิ่ม",
      en: "Tap a card to play, swipe for more.",
      zh: "点按卡片开始玩，左右滑动查看更多。",
      ja: "タップで遊べます。スワイプでもっと見る。",
    },
    pause: { th: "หยุดการเลื่อน", en: "Pause", zh: "暂停", ja: "一時停止" },
    play: { th: "เลื่อนต่อ", en: "Play", zh: "继续", ja: "再生" },
    prev: { th: "ดูการ์ดก่อนหน้า", en: "Previous cards", zh: "上一组卡片", ja: "前のカード" },
    next: { th: "ดูการ์ดถัดไป", en: "Next cards", zh: "下一组卡片", ja: "次のカード" },
    region: { th: "เอฟเฟกต์แนะนำ", en: "Featured effects", zh: "精选特效", ja: "おすすめのエフェクト" },
    /** Shown in this order; the most striking first. */
    featured: ["water-ripple", "parallax", "xray", "particles", "lanyard", "tilt", "flower-cursor", "gooey"] as const,
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
    /** Prompt below the particle headline on fine pointers (reads differently on touch). */
    particleHint: {
      th: "ลากเมาส์ผ่านข้อความ แล้วดูมันแตกเป็นจุด",
      en: "Drag your mouse across the words — watch them scatter",
      zh: "拖动鼠标掠过文字——看它们散成小点",
      ja: "文字の上をドラッグ。粒になって散ります",
    },
    particleHintTouch: {
      th: "แตะเพื่อให้ตัวหนังสือแตกเป็นจุด",
      en: "Tap to scatter the letters",
      zh: "点一下让文字散开",
      ja: "タップで文字を散らす",
    },
    /** For the theme switcher placed next to the language picker. */
    appearance: { th: "โหมดสี", en: "Appearance", zh: "外观", ja: "表示モード" },
    title: {
      th: "ทำในประเทศไทย เพื่อคนที่อยากเริ่มต้น",
      en: "Made in Thailand, for anyone starting out",
      zh: "在泰国制作，献给每一位初学者",
      ja: "タイで生まれた、はじめる人のためのサイト",
    },
    body: {
      th: "UXLab เป็นโปรเจกต์การเรียนรู้ของ Molly แหล่งเรียน UX ส่วนใหญ่เป็นภาษาอังกฤษ และอธิบายด้วยตัวหนังสือเป็นหลัก ที่นี่จึงตั้งใจทำให้ต่างออกไป: เรียนด้วยการลอง ในภาษาของคุณเอง และเว็บไซต์นี้เองก็ถูกออกแบบตามหลักการที่สอนทุกข้อ",
      en: "UXLab is Molly’s learning project. Most UX resources are in English and explain ideas with words alone. This one is different on purpose: you learn by trying, in your own language — and the site itself follows every principle it teaches.",
      zh: "UXLab 是 Molly 的学习项目。大多数 UX 学习资源都是英文的，而且主要靠文字讲解。这里有意做得不同：通过动手尝试来学习，用你自己的语言——而且这个网站本身也遵循它所教的每一条原则。",
      ja: "UXLab は Molly の学習プロジェクトです。UX の教材の多くは英語で、言葉だけで説明しています。ここはあえて違うやり方を選びました。自分の言語で、試しながら学ぶ。そしてこのサイト自体が、教えている原則をすべて守っています。",
    },
    more: { th: "เรื่องราวและวิธีคิด", en: "The story and the thinking", zh: "背后的故事与思考", ja: "ストーリーと考え方" },
    caseStudy: { th: "อ่าน Case study", en: "Read the case study", zh: "阅读案例研究", ja: "ケーススタディを読む" },
    languages: { th: "อ่านได้ใน", en: "Read it in", zh: "支持语言", ja: "対応言語" },
  },
};
