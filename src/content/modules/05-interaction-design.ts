import type { LearningModule } from "../types";

export const interactionDesign: LearningModule = {
  id: "interaction-design",
  number: 5,
  title: { th: "การออกแบบปฏิสัมพันธ์", en: "Interaction design", zh: "交互设计", ja: "インタラクションデザイン" },
  summary: {
    th: "Affordance, Feedback, State และ Microinteraction ออกแบบบทสนทนาระหว่างคนกับหน้าจอ",
    en: "Affordance, feedback, states and microinteractions — designing the conversation between people and interfaces.",
    zh: "示能、反馈、状态与微交互——设计人与界面之间的对话。",
    ja: "アフォーダンス、フィードバック、状態、マイクロインタラクション。人と画面の対話をデザインする。",
  },
  minutes: 8,
  scenario: {
    th: "คุณกด “ชำระเงิน” แต่ไม่มีอะไรขยับ มันทำงานหรือยัง? คุณกดอีกครั้ง แล้วเงินก็ถูกตัดสองรอบ ทุกพิกเซลสวยหมด แต่อินเทอร์เฟซไม่ตอบกลับเลย",
    en: "You tap “Pay”. Nothing moves. Did it work? You tap again. Two payments go through. Every pixel was beautiful — but the interface didn’t talk back.",
    zh: "你点了“支付”，但界面毫无动静。成功了吗？你又点了一次。结果付了两次钱。每个像素都很漂亮——可界面就是不回应你。",
    ja: "「支払う」をタップ。何も動きません。うまくいった？ もう一度タップ。支払いが 2 回行われました。どのピクセルも美しかったのに、画面は何も応えてくれませんでした。",
  },
  what: {
    th: [
      "การออกแบบปฏิสัมพันธ์ (Interaction design: IxD) คือการกำหนดว่าผลิตภัณฑ์จะตอบสนองอย่างไรเมื่อคนกระทำกับมัน อะไรเชิญชวนให้กระทำ ระหว่างนั้นเกิดอะไรขึ้น และผลลัพธ์ถูกสื่อสารอย่างไร",
      "ลองคิดว่าเป็นบทสนทนา อินเทอร์เฟซเสนอ (Affordance) คนกระทำ อินเทอร์เฟซตอบกลับ (Feedback) และทุกองค์ประกอบมีสถานะ (State) ที่บอกว่าบทสนทนาอยู่ตรงไหนแล้ว",
    ],
    en: [
      "Interaction design (IxD) shapes how a product behaves when people act on it: what invites action, what happens during it, and how results are communicated.",
      "Think of it as a conversation. The interface offers (affordance), the person acts, the interface responds (feedback) — and every element has states that show where the conversation is.",
    ],
    zh: [
      "交互设计（IxD）决定了人们操作产品时产品如何表现：什么在邀请操作、操作过程中发生什么、结果如何传达。",
      "把它想成一场对话：界面发出邀请（示能），人做出动作，界面给出回应（反馈）——而每个元素都有状态，表明对话进行到了哪里。",
    ],
    ja: [
      "インタラクションデザイン（IxD）は、人が操作したときに製品がどう振る舞うかを形づくります。何が操作を促し、その最中に何が起き、結果がどう伝わるか。",
      "対話だと考えてみてください。画面が誘い（アフォーダンス）、人が操作し、画面が応える（フィードバック）。そしてすべての要素には、対話がどこまで進んだかを示す状態があります。",
    ],
  },
  why: {
    th: [
      "หน้าจอนิ่ง ๆ อาจดูสมบูรณ์แบบในม็อกอัป แต่พอใช้งานจริงกลับรู้สึกพัง ปฏิสัมพันธ์คือจุดที่ความไว้วางใจถูกสร้างหรือถูกทำลาย",
      "ช่วงเวลาเล็ก ๆ ที่ออกแบบมาอย่างดี หรือ Microinteraction ช่วยป้องกันความผิดพลาด ยืนยันการกระทำ และทำให้ผลิตภัณฑ์มีบุคลิกเป็นของตัวเอง",
    ],
    en: [
      "Static screens can look perfect in a mock-up and still feel broken in the hand. Interaction is where trust is won or lost.",
      "Small, well-designed moments — microinteractions — prevent errors, confirm actions and give a product its personality.",
    ],
    zh: [
      "静态界面在效果图里可能完美无缺，拿到手里却感觉是坏的。交互是赢得或失去信任的地方。",
      "精心设计的小瞬间——微交互——能防止错误、确认操作，并赋予产品个性。",
    ],
    ja: [
      "静止した画面はモックアップでは完璧に見えても、手に取ると壊れているように感じることがあります。信頼が得られるか失われるかは、インタラクション次第です。",
      "よくデザインされた小さな瞬間、つまりマイクロインタラクションは、エラーを防ぎ、操作を確かめ、製品に個性を与えます。",
    ],
  },
  topics: [
    {
      title: { th: "Affordance และ Signifier", en: "Affordance & signifiers", zh: "示能与意符", ja: "アフォーダンスとシグニファイア" },
      body: {
        th: "ทำให้สิ่งที่ทำได้ ดูเหมือนทำได้ ปุ่มต้องดูกดได้ แถบเลื่อนต้องดูลากได้ ลิงก์ต้องดูเป็นลิงก์ ถ้าต้องมีป้ายอธิบายวิธีใช้ แปลว่า Signifier ยังอ่อนเกินไป",
        en: "Make what’s possible look possible: buttons look pressable, sliders look draggable, links look like links. If it needs a label to explain how to use it, the signifier is too weak.",
        zh: "让可以做的事情看起来就能做：按钮看起来能按，滑块看起来能拖，链接看起来像链接。如果需要文字说明怎么用，说明意符太弱了。",
        ja: "できることを、できそうに見せる。ボタンは押せそうに、スライダーはドラッグできそうに、リンクはリンクらしく。使い方を説明するラベルが必要なら、シグニファイアが弱すぎます。",
      },
    },
    {
      title: { th: "Feedback", en: "Feedback", zh: "反馈", ja: "フィードバック" },
      body: {
        th: "ตอบสนองทุกการกระทำภายในหนึ่งในสิบวินาที แสดงความคืบหน้าสำหรับสิ่งที่ช้ากว่านั้น และยืนยันผลลัพธ์ ความเงียบคือบั๊กด้านปฏิสัมพันธ์ที่พบบ่อยที่สุด",
        en: "Respond to every action within a tenth of a second, show progress for anything slower, and confirm the result. Silence is the most common interaction bug.",
        zh: "在十分之一秒内回应每个操作，对更慢的操作显示进度，并确认结果。沉默是最常见的交互缺陷。",
        ja: "すべての操作に 0.1 秒以内で反応し、それより遅いものには進捗を見せ、結果を確かめる。沈黙は、最もよくあるインタラクションのバグです。",
      },
    },
    {
      title: { th: "สถานะ (States)", en: "States", zh: "状态", ja: "状態" },
      body: {
        th: "ออกแบบแต่ละองค์ประกอบตลอดชีวิตของมัน: ปกติ ชี้ กด โฟกัส ปิดใช้งาน กำลังโหลด ผิดพลาด และสำเร็จ ปุ่มที่ออกแบบไว้แค่สถานะเดียว ก็เท่ากับออกแบบไปแค่ส่วนเดียว",
        en: "Design each element through its life: default, hover, pressed, focus, disabled, loading, error, success. A button with only one designed state is only partly designed.",
        zh: "按元素的一生来设计它：默认、悬停、按下、焦点、禁用、加载、错误、成功。只设计了一种状态的按钮，只完成了一部分设计。",
        ja: "要素の一生を通してデザインします。デフォルト、ホバー、押下、フォーカス、無効、読み込み中、エラー、成功。状態をひとつしかデザインしていないボタンは、まだ一部しかデザインされていません。",
      },
    },
    {
      title: { th: "Microinteraction", en: "Microinteractions", zh: "微交互", ja: "マイクロインタラクション" },
      body: {
        th: "Microinteraction คือช่วงเวลาที่มีจุดประสงค์เดียว เช่น กดถูกใจโพสต์ สลับการตั้งค่า หรือดึงเพื่อรีเฟรช มักแบ่งได้เป็น ตัวกระตุ้น (Trigger) กฎ (Rules) การตอบสนอง (Feedback) และ Loops & modes",
        en: "A microinteraction is a single-purpose moment: liking a post, toggling a setting, pulling to refresh. It’s often broken into a trigger, rules, feedback, and loops & modes.",
        zh: "微交互是只有一个目的的小瞬间：给帖子点赞、切换设置、下拉刷新。通常可以拆成触发器、规则、反馈，以及循环与模式。",
        ja: "マイクロインタラクションは、目的がひとつだけの小さな瞬間です。投稿に「いいね」する、設定を切り替える、引っ張って更新する。トリガー、ルール、フィードバック、ループとモードに分けて考えるのが一般的です。",
      },
    },
  ],
  example: {
    id: "microinteraction",
    caption: {
      th: "ผ่าปุ่ม “ถูกใจ” ออกมาดู: Trigger, Rules, Feedback และลองปิดทีละส่วนดูว่ารู้สึกอย่างไร",
      en: "Dissect a “like” button: trigger, rules, feedback — and what it feels like with each part switched off.",
      zh: "拆解一个“点赞”按钮：触发器、规则、反馈——以及关掉每一部分后的感受。",
      ja: "「いいね」ボタンを分解してみましょう。トリガー、ルール、フィードバック。そして、それぞれをオフにしたときの感覚。",
    },
  },
  takeaway: {
    th: "การออกแบบปฏิสัมพันธ์คือบทสนทนา: เชิญชวน ตอบสนอง และยืนยัน",
    en: "Interaction design is a conversation: invite, respond, confirm.",
    zh: "交互设计是一场对话：邀请、回应、确认。",
    ja: "インタラクションデザインは対話。誘い、応え、確かめる。",
  },
  reflect: {
    th: "ลองหาปุ่มหนึ่งปุ่มในแอปที่กดแล้วไม่มี Feedback คุณจะแก้มันอย่างไรด้วยการเปลี่ยนแปลงที่เล็กที่สุด?",
    en: "Find one button in an app that gives no feedback when tapped. How would you fix it with the smallest possible change?",
    zh: "在某个 App 里找一个点击后没有任何反馈的按钮。你会如何用最小的改动修好它？",
    ja: "タップしても何のフィードバックもないボタンを、アプリの中からひとつ探してみましょう。最小限の変更で、どう直しますか？",
  },
  concepts: ["affordance", "feedback", "hover", "active-state", "loading-state", "toggle"],
  lab: ["build-a-button"],
  sources: ["nng-microinteractions", "nng-heuristics", "nng-button-states", "m3-states", "hig-feedback"],
};
