import type { LearningModule } from "../types";

export const understandingUsers: LearningModule = {
  id: "understanding-users",
  number: 2,
  title: { th: "เข้าใจผู้ใช้", en: "Understanding users", zh: "理解用户", ja: "ユーザーを理解する" },
  summary: {
    th: "การวิจัยผู้ใช้ Pain point และความต้องการ รู้ให้ได้ว่าคนติดขัดเรื่องอะไรจริง ๆ",
    en: "Research, pain points and needs — how to learn what people actually struggle with.",
    zh: "用户研究、痛点与需求——如何了解人们真正的困扰。",
    ja: "リサーチ、ペインポイント、ニーズ。人が本当に困っていることを知る方法。",
  },
  minutes: 7,
  scenario: {
    th: "ทีมหนึ่งใช้เวลาสามเดือนสร้างฟีเจอร์วางแผนงบประมาณที่หัวหน้าชอบมาก แต่หลังเปิดตัวแทบไม่มีใครใช้ พอได้สัมภาษณ์ผู้ใช้ ทุกคนบอกว่าไม่ได้อยากได้ “งบประมาณ” แต่อยากเลิกกังวลเรื่องเงินตอนปลายเดือน",
    en: "A team spends three months building a budgeting feature their manager loved. After launch, almost nobody uses it. In interviews, people explain they don’t want budgets — they want to stop feeling anxious at the end of the month.",
    zh: "一个团队花了三个月开发了一个领导很喜欢的预算功能。上线后，几乎没人用。访谈中，人们解释说他们并不想要预算——他们只是不想在月底感到焦虑。",
    ja: "あるチームが、上司お気に入りの予算管理機能を 3 か月かけて作りました。リリース後、ほとんど誰も使いません。インタビューすると、人々は予算が欲しいのではなく、月末の不安から解放されたいのだと語りました。",
  },
  what: {
    th: [
      "การวิจัยผู้ใช้ (User research) คือการเรียนรู้เป้าหมาย พฤติกรรม และบริบทของผู้คน ผ่านการสัมภาษณ์ การสังเกต แบบสอบถาม และการทดสอบ ทั้งก่อนและระหว่างการออกแบบ",
      "Pain point คือปัญหาที่ผู้ใช้เจอ ส่วน Need คือสิ่งที่เขาพยายามทำให้สำเร็จจริง ๆ งานวิจัยที่ดีแยก “สิ่งที่คนพูด” ออกจาก “สิ่งที่คนทำ”",
    ],
    en: [
      "User research is the practice of learning about people’s goals, behaviours and contexts — through interviews, observation, surveys and testing — before and during design.",
      "A pain point is a problem people experience. A need is what they’re really trying to achieve. Good research separates what people say from what they do.",
    ],
    zh: [
      "用户研究是在设计之前和设计过程中，通过访谈、观察、问卷和测试，了解人们的目标、行为和情境的实践。",
      "痛点是人们遇到的问题；需求是他们真正想达成的事。好的研究会把人们“说的”和“做的”区分开。",
    ],
    ja: [
      "ユーザーリサーチとは、インタビュー、観察、アンケート、テストを通じて、人の目標、行動、状況を、デザインの前と最中に学ぶことです。",
      "ペインポイントは人が経験する問題。ニーズは、本当に達成したいこと。良いリサーチは、人が「言うこと」と「すること」を区別します。",
    ],
  },
  why: {
    th: [
      "การสร้างสิ่งที่ผิดอย่างประณีต คือความผิดพลาดที่แพงที่สุดในงานออกแบบผลิตภัณฑ์ การวิจัยถูกกว่าการรื้อทำใหม่",
      "การวิจัยยังช่วยไม่ให้ทีมออกแบบเพื่อตัวเอง คุณไม่ใช่ผู้ใช้ของคุณ นิสัย ทักษะ และอุปกรณ์ของคุณอาจต่างจากเขามาก",
    ],
    en: [
      "Building the wrong thing well is the most expensive mistake in product design. Research is cheaper than rework.",
      "Research also protects teams from designing for themselves. You are not your user — your habits, skills and devices are probably different.",
    ],
    zh: [
      "把错误的东西做得很好，是产品设计中代价最高的错误。研究比返工便宜得多。",
      "研究还能防止团队为自己而设计。你不是你的用户——你的习惯、技能和设备很可能都不一样。",
    ],
    ja: [
      "間違ったものを上手に作ることは、プロダクトデザインで最も高くつく失敗です。リサーチは作り直しより安く済みます。",
      "リサーチは、チームが自分たちのためにデザインしてしまうのも防ぎます。あなたはユーザーではありません。習慣も、スキルも、使っている端末も、おそらく違います。",
    ],
  },
  topics: [
    {
      title: { th: "การวิจัยผู้ใช้", en: "User research", zh: "用户研究", ja: "ユーザーリサーチ" },
      body: {
        th: "เลือกวิธีให้ตรงกับคำถาม การสัมภาษณ์ช่วยหาคำตอบว่า “ทำไม” การสังเกตแสดงว่าคน “ทำอะไรจริง ๆ” การทดสอบ Usability ชี้ว่าดีไซน์พังตรงไหน ส่วนแบบสอบถามวัดว่า “มีกี่คน”",
        en: "Match the method to the question. Interviews explore why; observation shows what people really do; usability tests reveal where a design breaks; surveys measure how many.",
        zh: "让方法匹配问题。访谈探究“为什么”；观察揭示人们“实际怎么做”；可用性测试暴露设计在哪里失效；问卷衡量“有多少人”。",
        ja: "問いに合わせて手法を選びます。インタビューは「なぜ」を探り、観察は人が実際に「何をするか」を示し、ユーザビリティテストはデザインが壊れる場所を明らかにし、アンケートは「どれくらいの人か」を測ります。",
      },
    },
    {
      title: { th: "Pain point", en: "Pain points", zh: "痛点", ja: "ペインポイント" },
      body: {
        th: "Pain point มีสามระดับ: ระดับการโต้ตอบ (ปุ่มที่สับสน) ระดับเส้นทางการใช้งาน (สมัครสินเชื่อผ่านสามช่องทาง) และระดับความสัมพันธ์ (รู้สึกว่าธนาคารไม่ใส่ใจ)",
        en: "Pain points exist at three levels: a single interaction (a confusing button), a whole journey (applying for a loan across three channels) and the relationship (feeling the bank doesn’t care).",
        zh: "痛点存在于三个层面：单次交互（一个令人困惑的按钮）、整段旅程（跨三个渠道申请贷款）和关系层面（觉得银行并不在乎自己）。",
        ja: "ペインポイントには 3 つのレベルがあります。ひとつの操作（分かりにくいボタン）、旅全体（3 つの窓口にまたがるローン申請）、そして関係性（銀行が気にかけてくれないと感じること）。",
      },
    },
    {
      title: { th: "ความต้องการของผู้ใช้", en: "User needs", zh: "用户需求", ja: "ユーザーニーズ" },
      body: {
        th: "เขียนความต้องการในมุมของคน ไม่ใช่ฟีเจอร์ เช่น “คนทำงานปีแรกต้องการรู้ว่ายังใช้เงินได้อีกเท่าไรอย่างปลอดภัยก่อนเงินเดือนออก เพราะเงินหมดก่อนทำให้เครียด” สังเกตว่าในประโยคไม่มีแอป ปุ่ม หรือกราฟเลย",
        en: "Write needs as people, not features: “A first-jobber needs to know how much they can safely spend before payday, because running out causes stress.” Notice there’s no app, button or chart in that sentence.",
        zh: "用“人”而不是“功能”来写需求：“刚工作的年轻人需要知道发薪日前还能安全地花多少钱，因为钱不够用会让他们焦虑。”注意，这句话里没有 App、按钮或图表。",
        ja: "ニーズは機能ではなく人の言葉で書きます。「社会人 1 年目の人は、給料日までに安心して使える金額を知る必要がある。お金が足りなくなるとストレスになるから」。この文には、アプリもボタンもグラフも出てきません。",
      },
    },
  ],
  example: {
    id: "pain-points",
    caption: {
      th: "อ่านบทสัมภาษณ์สั้น ๆ แล้วไฮไลต์ Pain point ที่คุณเจอ",
      en: "Read a short interview and highlight the pain points you find.",
      zh: "阅读一段简短的访谈，标出你发现的痛点。",
      ja: "短いインタビューを読んで、見つけたペインポイントをハイライトしましょう。",
    },
  },
  takeaway: {
    th: "หลงรักปัญหา อย่าหลงรักทางแก้ของตัวเอง",
    en: "Fall in love with the problem, not your solution.",
    zh: "爱上问题，而不是你的解决方案。",
    ja: "解決策ではなく、問題を好きになろう。",
  },
  reflect: {
    th: "ลองถามเพื่อนว่าครั้งล่าสุดจ่ายบิลอย่างไร อย่าเพิ่งเสนออะไร แค่ฟัง ขั้นตอนไหนน่าหงุดหงิดที่สุดในคำพูดของเขาเอง?",
    en: "Ask a friend how they last paid a bill. Don’t suggest anything — just listen. What was the most annoying step, in their words?",
    zh: "问问朋友上次是怎么缴账单的。别提建议，只是倾听。用他们自己的话说，最烦人的是哪一步？",
    ja: "友だちに、最後に請求書をどう支払ったか聞いてみましょう。何も提案せず、ただ聞くこと。本人の言葉で、いちばん面倒だったのはどのステップでしたか？",
  },
  concepts: ["usability", "feedback"],
  lab: ["ux-detective"],
  sources: ["nng-research-methods", "nng-pain-points", "nng-need-statements", "govuk-research", "dschool-bootleg", "govuk-designing-services"],
};
