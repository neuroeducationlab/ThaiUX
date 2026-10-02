import type { Localized } from "@/i18n/localized";

/** About page copy (story, principles, process, privacy, sources policy). */
export const about = {
  title: { th: "ทำไมถึงมี UXLab", en: "Why UXLab exists", zh: "为什么会有 UXLab", ja: "UXLab が生まれた理由" },
  lead: {
    th: "UX ไม่ใช่เรื่องของความสวย แต่เป็นเรื่องของการตัดสินใจที่ทำให้ชีวิตคนง่ายขึ้น เว็บนี้สอนเรื่องนั้นด้วยวิธีที่ได้ผลที่สุด: ให้คุณได้ลองเอง",
    en: "UX isn’t about making things pretty. It’s about decisions that make people’s lives easier. This site teaches that in the way that works best: by letting you try it yourself.",
    zh: "UX 不是为了好看，而是做出让人们生活更轻松的决定。这个网站用最有效的方式来教它：让你亲手试一试。",
    ja: "UX は見た目をきれいにすることではなく、人の暮らしを少し楽にする判断のこと。このサイトは、それをいちばん伝わる方法で教えます。自分で試してもらうことです。",
  },

  story: {
    title: { th: "เรื่องราว", en: "The story", zh: "背后的故事", ja: "ストーリー" },
    body: {
      th: [
        "UXLab เริ่มจากคำถามง่าย ๆ ของ Molly: ถ้า UX คือเรื่องของประสบการณ์ ทำไมการเรียน UX ถึงมีแต่การอ่าน?",
        "แหล่งเรียนรู้ที่ดีส่วนใหญ่เป็นภาษาอังกฤษ และอธิบายคำอย่าง Affordance หรือ Feedback ด้วยตัวหนังสือล้วน ๆ สำหรับผู้เริ่มต้นชาวไทย นั่นคือกำแพงสองชั้น คือภาษา และความเป็นนามธรรม",
        "ที่นี่จึงกลับลำดับการเรียน: ลองก่อน แล้วค่อยรู้ชื่อ ทุกแนวคิดมีตัวอย่างให้กด ลาก หรือเลื่อน และทุกบทเรียนเริ่มจากปัญหาจริงที่คุณเคยเจอในชีวิตประจำวัน",
      ],
      en: [
        "UXLab started with a simple question from Molly: if UX is about experience, why is learning it all reading?",
        "Most good resources are in English, and they explain words like Affordance or Feedback with text alone. For a beginner in Thailand that’s two walls at once — the language, and the abstraction.",
        "So this site flips the order: try it first, then learn its name. Every concept has something to press, drag or scroll, and every lesson starts from a real problem you’ve already met in everyday life.",
      ],
      zh: [
        "UXLab 源于 Molly 的一个简单问题：如果 UX 讲的是体验，为什么学习 UX 却只能靠阅读？",
        "大多数优质资源都是英文的，而且只用文字解释 Affordance、Feedback 这样的概念。对泰国的初学者来说，这是两堵墙：语言，以及抽象。",
        "所以这里把顺序反过来：先体验，再认识它的名字。每个概念都有可以按、拖或滚动的示例，每一课都从你在日常生活中遇到过的真实问题开始。",
      ],
      ja: [
        "UXLab は、Molly のシンプルな疑問から始まりました。UX が「体験」のことなら、なぜ UX の学びは読むことばかりなのだろう？",
        "良い教材の多くは英語で、Affordance や Feedback といった言葉を文字だけで説明します。タイの初学者にとっては、言語と抽象という二重の壁です。",
        "だからこのサイトは順番を逆にしました。まず試し、それから名前を知る。どの概念にも押したり、ドラッグしたり、スクロールしたりできる例があり、どのレッスンも日常で出会ったことのある本当の問題から始まります。",
      ],
    } as Localized<string[]>,
  },

  principles: {
    title: { th: "หลักการที่ใช้สร้างเว็บนี้", en: "The principles behind it", zh: "背后的原则", ja: "このサイトを支える原則" },
    items: [
      {
        title: { th: "ลองก่อน แล้วค่อยอธิบาย", en: "Experience before explanation", zh: "先体验，再解释", ja: "説明より先に体験" },
        body: {
          th: "คุณจะรู้สึกถึงแนวคิดก่อนที่จะได้อ่านนิยามของมัน เพราะความเข้าใจที่มาจากการลงมือ จำได้นานกว่า",
          en: "You feel a concept before you read its definition — understanding that comes from doing tends to stick.",
          zh: "你会先感受一个概念，再读它的定义——从动手中获得的理解更容易记住。",
          ja: "定義を読む前に、まず概念を体で感じます。手を動かして得た理解は、記憶に残りやすいからです。",
        },
      },
      {
        title: { th: "หนึ่งแนวคิด หนึ่งนาที", en: "One idea, one minute", zh: "一个概念，一分钟", ja: "ひとつの概念を、1 分で" },
        body: {
          th: "ทุกบทเดินตามลำดับเดียวกัน: ปัญหา → การตัดสินใจ → การโต้ตอบ → ผลลัพธ์ เข้าใจแก่นได้ในเวลาประมาณหนึ่งนาที แล้วค่อยเจาะลึกเมื่อพร้อม",
          en: "Every lesson follows the same path — Problem → Decision → Interaction → Result — so you get the core in about a minute and go deeper when you’re ready.",
          zh: "每一课都遵循同一条路径——问题 → 决定 → 交互 → 结果——大约一分钟抓住核心，准备好了再深入。",
          ja: "どのレッスンも「問題 → 判断 → インタラクション → 結果」の順。約 1 分で核心をつかみ、準備ができたら深く学べます。",
        },
      },
      {
        title: { th: "สงบเป็นค่าเริ่มต้น", en: "Calm by default", zh: "默认保持平静", ja: "穏やかさが基本" },
        body: {
          th: "ไม่มีป๊อปอัป ไม่มีระบบล่าแต้ม ไม่มี Dark pattern การเคลื่อนไหวมีเฉพาะเมื่อช่วยอธิบาย และจะหยุดเมื่ออุปกรณ์ของคุณตั้งค่าลดการเคลื่อนไหวไว้",
          en: "No pop-ups, no streaks, no dark patterns. Motion appears only when it explains something — and stops when your device asks for reduced motion.",
          zh: "没有弹窗，没有连续打卡，没有黑暗模式（dark patterns）。动效只在有助于解释时出现——当你的设备要求减少动态效果时就会停止。",
          ja: "ポップアップも、連続記録も、ダークパターンもありません。動きは説明に役立つときだけ。端末で「視差効果を減らす」を設定していれば止まります。",
        },
      },
      {
        title: { th: "ใช้ได้ทุกคน", en: "Made for everyone", zh: "为每个人而做", ja: "すべての人のために" },
        body: {
          th: "คีย์บอร์ด โปรแกรมอ่านหน้าจอ Contrast และการซูม ถูกออกแบบไว้ตั้งแต่แรก โดยถือว่า WCAG 2.2 ระดับ AA คือพื้นขั้นต่ำ ไม่ใช่เส้นชัย",
          en: "Keyboards, screen readers, contrast and zoom are designed in from the start, with WCAG 2.2 AA treated as the floor, not the finish line.",
          zh: "键盘、读屏软件、对比度和缩放从一开始就被纳入设计，WCAG 2.2 AA 是底线，而不是终点。",
          ja: "キーボード、スクリーンリーダー、コントラスト、拡大表示を最初から設計に組み込み、WCAG 2.2 AA をゴールではなく最低ラインとしています。",
        },
      },
      {
        title: { th: "ภาษาของคุณมาก่อน", en: "Your language first", zh: "你的语言优先", ja: "あなたの言語を第一に" },
        body: {
          th: "ภาษาไทยมาก่อน ตามด้วยอังกฤษ จีน และญี่ปุ่น ศัพท์วิชาชีพยังคงเป็นภาษาอังกฤษ เพราะเป็นคำที่คุณจะได้ยินในที่ทำงานจริง พร้อมชื่อเรียกในภาษาของคุณกำกับไว้",
          en: "Thai first, then English, Chinese and Japanese. Industry terms stay in English — they’re the words you’ll hear at work — with a local name beside them.",
          zh: "泰语优先，其次是英语、中文和日语。行业术语保留英文——那是你在工作中会听到的词——旁边附上本地名称。",
          ja: "まずタイ語、そして英語、中国語、日本語。専門用語は英語のまま残します。現場で耳にするのはその言葉だからです。横には各言語での呼び方を添えています。",
        },
      },
      {
        title: { th: "อ้างอิงอย่างซื่อตรง", en: "Honest about sources", zh: "诚实对待来源", ja: "出典に誠実に" },
        body: {
          th: "ทุกบทเรียนเขียนด้วยคำพูดของเราเอง และลิงก์ไปยังงานวิจัยและแนวปฏิบัติที่เราเรียนรู้มา เพื่อให้คุณตามไปอ่านต้นฉบับได้",
          en: "Every lesson is written in our own words and links to the research and guidelines it learned from, so you can read the originals.",
          zh: "每一课都用我们自己的话写成，并链接到它所参考的研究和指南，方便你阅读原文。",
          ja: "どのレッスンも自分たちの言葉で書き、参考にした研究やガイドラインへリンクしています。原典もぜひ読んでください。",
        },
      },
    ] as { title: Localized; body: Localized }[],
  },

  process: {
    title: { th: "สร้างขึ้นมาอย่างไร", en: "How it was made", zh: "它是如何做出来的", ja: "どうやってつくったか" },
    body: {
      th: "ออกแบบและพัฒนาโดยมี AI เป็นผู้ร่วมงาน ทุกการตัดสินใจสำคัญมาพร้อมทางเลือก ข้อดีข้อเสีย และคำแนะนำ แต่คนเป็นผู้ตัดสินใจเสมอ กระบวนการทั้งหมด ตั้งแต่การค้นคว้าจนถึงการปรับปรุง อยู่ใน Case study",
      en: "Designed and built with AI as a collaborator: every material decision came with options, trade-offs and a recommendation — and a human made the call. The whole process, from research to iteration, is in the case study.",
      zh: "在 AI 的协作下设计和开发：每个重要决定都附有选项、利弊和建议——最终由人来拍板。从研究到迭代的完整过程，都写在案例研究里。",
      ja: "AI を共同作業者として設計・開発しました。重要な判断には必ず選択肢、トレードオフ、推奨案が示され、最終判断は人が行いました。リサーチから改善までの全工程は、ケーススタディにまとめています。",
    },
    steps: [
      { th: "ค้นคว้า", en: "Research", zh: "研究", ja: "リサーチ" },
      { th: "สถาปัตยกรรมข้อมูล", en: "Information architecture", zh: "信息架构", ja: "情報設計" },
      { th: "Design system", en: "Design system", zh: "设计系统", ja: "デザインシステム" },
      { th: "พัฒนา", en: "Build", zh: "开发", ja: "実装" },
      { th: "ทดสอบ", en: "Test", zh: "测试", ja: "テスト" },
      { th: "ปรับปรุง", en: "Iterate", zh: "迭代", ja: "改善" },
    ] as Localized[],
    caseStudy: { th: "อ่าน Case study", en: "Read the case study", zh: "阅读案例研究", ja: "ケーススタディを読む" },
    designSystem: { th: "ดู Design system", en: "See the design system", zh: "查看设计系统", ja: "デザインシステムを見る" },
  },

  languages: {
    title: { th: "ทำไมถึงเป็นสี่ภาษานี้", en: "Why these four languages", zh: "为什么是这四种语言", ja: "なぜこの 4 言語なのか" },
    body: {
      th: "ภาษาไทยคือบ้าน ภาษาอังกฤษเข้าถึงทุกคนที่เหลือ รวมถึงผู้อ่านในอินเดีย ส่วนภาษาจีนตัวย่อและภาษาญี่ปุ่นครอบคลุมผู้เรียนกลุ่มใหญ่ในเอเชีย ทุกภาษาเป็นการตัดสินใจที่มีเหตุผล ซึ่งอธิบายไว้ใน Case study",
      en: "Thai is home. English reaches everyone else, including readers in India. Simplified Chinese and Japanese cover two large communities of learners in Asia. Each language was a deliberate decision — the case study explains the trade-offs.",
      zh: "泰语是家。英语覆盖其他所有人，包括印度的读者。简体中文和日语覆盖了亚洲两大学习者群体。每一种语言都是经过考虑的决定——案例研究中解释了其中的取舍。",
      ja: "タイ語はホーム。英語はそれ以外のすべての人、インドの読者にも届きます。簡体字中国語と日本語は、アジアの大きな学習者コミュニティをカバーします。どの言語も意図した判断で、そのトレードオフはケーススタディで説明しています。",
    },
  },

  privacy: {
    title: { th: "ข้อมูลของคุณอยู่กับคุณ", en: "Your data stays with you", zh: "你的数据只属于你", ja: "データはあなたの手元に" },
    body: {
      th: "ไม่มีบัญชีผู้ใช้และไม่มีระบบวิเคราะห์ผู้ใช้ ความคืบหน้า รายการที่บันทึก และธีม เก็บไว้ใน Local storage ของเบราว์เซอร์คุณเท่านั้น และมีคุกกี้หนึ่งตัวสำหรับจำภาษา เมื่อคุณเลือกภาษาเอง ล้างข้อมูลเบราว์เซอร์เมื่อไร ทุกอย่างก็หายไปด้วย",
      en: "There are no accounts and no analytics. Your progress, saved concepts and theme live only in your browser’s local storage, and a single cookie remembers your language if you choose one. Clear your browser data and it’s all gone.",
      zh: "没有账号，也没有数据分析。你的学习进度、收藏和主题只保存在浏览器的本地存储中；如果你手动选择了语言，会有一个 Cookie 记住它。清除浏览器数据后，一切都会消失。",
      ja: "アカウントもアクセス解析もありません。進捗、保存した概念、テーマはブラウザのローカルストレージにだけ保存され、言語を自分で選んだ場合のみ Cookie がひとつそれを覚えます。ブラウザのデータを消せば、すべて消えます。",
    },
  },

  sources: {
    title: { th: "แหล่งอ้างอิงและลิขสิทธิ์", en: "Sources & copyright", zh: "来源与版权", ja: "出典と著作権" },
    body: {
      th: [
        "เนื้อหาบทเรียน ตัวอย่างแบบโต้ตอบ และโค้ดทั้งหมดใน UXLab เป็นผลงานต้นฉบับ เมื่อแนวคิดใดมาจากงานวิจัย มาตรฐาน หรือแนวปฏิบัติด้านการออกแบบที่เผยแพร่แล้ว เราจะอธิบายด้วยคำพูดของเราเอง และลิงก์ไปยังต้นฉบับ",
        "เราไม่คัดลอกเนื้อหาคอร์ส ภาพประกอบ หรือข้อความยาว ๆ ชื่อองค์กรและผลิตภัณฑ์เป็นของเจ้าของ และใช้เพื่อให้เครดิตเท่านั้น การลิงก์ไปยังแหล่งใดไม่ได้หมายความว่าแหล่งนั้นรับรอง UXLab",
        "หากพบข้อผิดพลาดหรือเครดิตที่ตกหล่น เปิด Issue บน GitHub ได้เลย เรายินดีแก้ไขเสมอ",
      ],
      en: [
        "All lesson text, interactive examples and code on UXLab are original work. When an idea comes from published research, standards or design guidelines, we explain it in our own words and link to the original.",
        "We don’t copy course material, illustrations or long quotations. Names of organisations and products belong to their owners and are used only to give credit; linking to a source doesn’t mean it endorses UXLab.",
        "Spotted a mistake or a missing credit? Please open an issue on GitHub — corrections are always welcome.",
      ],
      zh: [
        "UXLab 上的所有课程文字、互动示例和代码都是原创。当某个观点来自已发表的研究、标准或设计指南时，我们会用自己的话解释，并链接到原文。",
        "我们不复制课程资料、插图或大段引文。组织和产品名称归其所有者所有，仅用于注明出处；链接到某个来源并不代表该来源为 UXLab 背书。",
        "发现错误或遗漏的出处？欢迎在 GitHub 上提交 Issue——我们随时欢迎更正。",
      ],
      ja: [
        "UXLab のレッスン本文、インタラクティブな例、コードはすべてオリジナルです。公開された研究、規格、デザインガイドラインに由来する考え方は、自分たちの言葉で説明し、原典にリンクしています。",
        "講座の教材、イラスト、長い引用はコピーしません。組織名や製品名はそれぞれの所有者に帰属し、出典を示す目的でのみ使用しています。リンク先が UXLab を推奨しているという意味ではありません。",
        "誤りや出典の漏れに気づいたら、GitHub で Issue を作成してください。訂正はいつでも歓迎です。",
      ],
    } as Localized<string[]>,
    readingList: { th: "รายการอ่านเพิ่มเติม", en: "Reading list", zh: "延伸阅读", ja: "参考文献リスト" },
    count: {
      th: "{n} แหล่งอ้างอิง จาก {p} ผู้เผยแพร่",
      en: "{n} sources from {p} publishers",
      zh: "来自 {p} 个发布方的 {n} 个来源",
      ja: "{p} の発行元による {n} 件の出典",
    },
    issue: { th: "แจ้งปัญหาบน GitHub", en: "Report an issue on GitHub", zh: "在 GitHub 上反馈问题", ja: "GitHub で問題を報告" },
  },
};
