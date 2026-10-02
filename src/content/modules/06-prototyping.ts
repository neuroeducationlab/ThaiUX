import type { LearningModule } from "../types";

export const prototyping: LearningModule = {
  id: "prototyping",
  number: 6,
  title: { th: "การทำต้นแบบ (Prototyping)", en: "Prototyping", zh: "原型设计", ja: "プロトタイピング" },
  summary: {
    th: "Wireframe, Low fidelity และ High fidelity ทดสอบไอเดียก่อนที่มันจะแพง",
    en: "Wireframes, low fidelity and high fidelity — testing ideas before they get expensive.",
    zh: "线框图、低保真与高保真——在想法变得昂贵之前先测试它。",
    ja: "ワイヤーフレーム、ローファイ、ハイファイ。アイデアが高くつく前に試す。",
  },
  minutes: 6,
  scenario: {
    th: "ทีมหนึ่งขัดเกลาหน้าชำระเงินแบบ High fidelity อยู่หลายสัปดาห์ แต่ในการทดสอบครั้งแรก ผู้ใช้ไม่เข้าใจตัวเลือกการจัดส่งเลย ซึ่งเป็นปัญหาที่ภาพสเก็ตช์บนกระดาษสิบนาทีก็เผยให้เห็นได้",
    en: "A team polishes a checkout design in high fidelity for weeks. In the first test, users don’t understand the delivery options at all — a problem a ten-minute paper sketch could have revealed.",
    zh: "一个团队花了好几周把结账页面打磨成高保真设计。第一次测试时，用户完全看不懂配送选项——而这个问题，十分钟的纸面草图就能发现。",
    ja: "あるチームは購入画面を何週間もかけてハイファイで磨き上げました。最初のテストで、ユーザーは配送オプションをまったく理解できませんでした。10 分の紙のスケッチでも見つけられた問題です。",
  },
  what: {
    th: [
      "Prototype หรือต้นแบบ คือการจำลองผลิตภัณฑ์เพื่อเรียนรู้บางอย่างก่อนจะสร้างของจริง อาจเป็นภาพสเก็ตช์บนกระดาษ Wireframe ที่คลิกได้ หรือเดโมที่เขียนโค้ดจนเกือบเหมือนจริง",
      "Fidelity (ความเที่ยงตรง) บอกว่าต้นแบบใกล้เคียงผลิตภัณฑ์จริงแค่ไหน ทั้งด้านภาพ เนื้อหา และการโต้ตอบ",
    ],
    en: [
      "A prototype is a simulation of a product, made to learn something before building the real thing. It can be paper sketches, clickable wireframes or a near-real coded demo.",
      "Fidelity describes how close a prototype is to the final product — in visuals, content and interactivity.",
    ],
    zh: [
      "原型是对产品的模拟，用来在真正开发之前学到一些东西。它可以是纸面草图、可点击的线框图，或接近真实的代码演示。",
      "保真度描述原型与最终产品的接近程度——包括视觉、内容和交互。",
    ],
    ja: [
      "プロトタイプとは、本物を作る前に何かを学ぶための製品のシミュレーションです。紙のスケッチ、クリックできるワイヤーフレーム、本物に近いコードのデモまで、さまざまです。",
      "フィデリティ（忠実度）は、プロトタイプが最終製品にどれだけ近いかを表します。見た目、コンテンツ、インタラクションの面で。",
    ],
  },
  why: {
    th: [
      "ยิ่งเจอปัญหาเร็ว ยิ่งแก้ได้ถูก ต้นแบบช่วยให้คุณผิดได้เร็วและปลอดภัย",
      "เลือกระดับ Fidelity ตามคำถามที่อยากได้คำตอบ Low fidelity สำหรับโครงสร้างและลำดับขั้นตอน High fidelity สำหรับรายละเอียดภาพ ข้อความ และการโต้ตอบจริง",
    ],
    en: [
      "The earlier you find a problem, the cheaper it is to fix. Prototypes let you be wrong quickly and safely.",
      "Choose fidelity by the question you want answered: low fidelity for structure and flow, high fidelity for visual details, microcopy and real interactions.",
    ],
    zh: [
      "问题发现得越早，修复成本越低。原型让你可以又快又安全地犯错。",
      "根据想回答的问题选择保真度：低保真用于结构和流程，高保真用于视觉细节、文案和真实交互。",
    ],
    ja: [
      "問題は早く見つけるほど、安く直せます。プロトタイプなら、素早く安全に間違えられます。",
      "答えたい問いに合わせてフィデリティを選びます。構造や流れならローファイ、見た目の細部、マイクロコピー、実際のインタラクションならハイファイ。",
    ],
  },
  topics: [
    {
      title: { th: "Wireframe", en: "Wireframes", zh: "线框图", ja: "ワイヤーフレーム" },
      body: {
        th: "Wireframe คือพิมพ์เขียว กล่องและป้ายชื่อที่แสดงโครงสร้างและลำดับความสำคัญ โดยยังไม่มีสีหรือรายละเอียดสวยงาม ช่วยให้การคุยกันโฟกัสที่ “อะไรอยู่ตรงไหน” ไม่ใช่ “ใช้สีฟ้าเฉดไหน”",
        en: "Wireframes are the blueprint: boxes and labels that show structure and priority without colour or polish. They keep discussions on what goes where, not which blue to use.",
        zh: "线框图是蓝图：用方框和标签展示结构和优先级，没有颜色和修饰。它让讨论聚焦在“什么放在哪里”，而不是“用哪种蓝色”。",
        ja: "ワイヤーフレームは設計図です。色や装飾なしに、箱とラベルで構造と優先順位を示します。議論を「どの青を使うか」ではなく「何をどこに置くか」に集中させます。",
      },
    },
    {
      title: { th: "Low fidelity", en: "Low fidelity", zh: "低保真", ja: "ローファイ" },
      body: {
        th: "เร็ว ถูก และทิ้งได้ เช่น กระดาษหรือภาพสเก็ตช์ดิจิทัลง่าย ๆ คนกล้าวิจารณ์มันตรง ๆ ซึ่งเป็นสิ่งที่คุณต้องการในช่วงแรก",
        en: "Fast, cheap and disposable — paper or simple digital sketches. People feel free to criticise them, which is exactly what you want early on.",
        zh: "快速、便宜、可以随手扔掉——纸面或简单的数字草图。人们会放心地提出批评，而这正是早期最需要的。",
        ja: "速くて安く、使い捨てられる。紙やシンプルなデジタルスケッチ。人は遠慮なく批判してくれます。それこそが初期に欲しいものです。",
      },
    },
    {
      title: { th: "High fidelity", en: "High fidelity", zh: "高保真", ja: "ハイファイ" },
      body: {
        th: "หน้าตาและการทำงานเกือบเหมือนผลิตภัณฑ์จริง มีเนื้อหาและการโต้ตอบจริง ใช้ทดสอบรายละเอียดและสื่อสารกับผู้เกี่ยวข้อง แต่ให้เผื่อไว้ว่าคนจะวิจารณ์ความสวยงามมากกว่าโครงสร้าง",
        en: "Looks and behaves almost like the real product, with real content and interactions. Use it to test details and align stakeholders — but expect people to comment on polish rather than structure.",
        zh: "外观和行为几乎和真实产品一样，有真实的内容和交互。用来测试细节、统一干系人的认识——但要预料到人们会更关注打磨程度，而不是结构。",
        ja: "見た目も動きも本物の製品にほぼ近く、実際のコンテンツとインタラクションを備えています。細部のテストや関係者の合意形成に使いますが、人は構造より仕上がりにコメントしがちだと心得ておきましょう。",
      },
    },
  ],
  example: {
    id: "fidelity",
    caption: {
      th: "ลากแถบเลื่อนดูหน้าจอเดียวกันเติบโตจากภาพสเก็ตช์ไปเป็นต้นแบบ High fidelity",
      en: "Drag the slider to watch one screen grow from sketch to high-fidelity prototype.",
      zh: "拖动滑块，看同一个界面如何从草图成长为高保真原型。",
      ja: "スライダーをドラッグして、ひとつの画面がスケッチからハイファイのプロトタイプへ育っていく様子を見てみましょう。",
    },
  },
  takeaway: {
    th: "ทำต้นแบบเพื่อเรียนรู้ ไม่ใช่เพื่ออวด เลือกระดับให้ตรงกับคำถาม",
    en: "Prototype to learn, not to impress. Match fidelity to the question.",
    zh: "做原型是为了学习，不是为了炫耀。让保真度匹配你的问题。",
    ja: "プロトタイプは学ぶためのもの。見せびらかすためではない。問いに合わせてフィデリティを選ぶ。",
  },
  reflect: {
    th: "สเก็ตช์หน้าแรกของแอปที่คุณใช้บ่อย จากความจำ ภายในสองนาที คุณจำอะไรได้เป็นอย่างแรก และอะไรที่ลืมไปเลย?",
    en: "Sketch the home screen of an app you use — from memory, in two minutes. What did you remember first? What did you forget entirely?",
    zh: "凭记忆在两分钟内画出你常用 App 的首页。你最先想起的是什么？完全忘了什么？",
    ja: "よく使うアプリのホーム画面を、記憶だけで 2 分間でスケッチしてみましょう。最初に思い出したのは何？ すっかり忘れていたのは何？",
  },
  concepts: ["usability", "button", "feedback"],
  lab: ["make-it-better", "build-a-button"],
  sources: ["nng-fidelity", "dschool-bootleg", "mit-6831"],
};
