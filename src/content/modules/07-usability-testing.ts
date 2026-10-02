import type { LearningModule } from "../types";

export const usabilityTesting: LearningModule = {
  id: "usability-testing",
  number: 7,
  title: { th: "Usability และการทดสอบ", en: "Usability", zh: "可用性", ja: "ユーザビリティ" },
  summary: {
    th: "การทดสอบ Usability ปัญหาที่พบบ่อย และการปรับปรุงซ้ำ ดูคนจริงใช้งานดีไซน์ของคุณ",
    en: "Usability testing, common problems and iteration — watching real people use your design.",
    zh: "可用性测试、常见问题与迭代——观察真实的人如何使用你的设计。",
    ja: "ユーザビリティテスト、よくある問題、そして反復。実際の人があなたのデザインを使う様子を観察する。",
  },
  minutes: 7,
  scenario: {
    th: "นักออกแบบมั่นใจว่าฟอร์มสมัครสมาชิกเข้าใจง่ายแน่นอน จนได้ดูคนห้าคนลองใช้ สามคนพลาดเงื่อนไขรหัสผ่าน สองคนหาปุ่ม “ดำเนินการต่อ” ที่อยู่ใต้คีย์บอร์ดไม่เจอ และอีกหนึ่งคนยอมแพ้",
    en: "The designer is sure the sign-up form is obvious. Then they watch five people try it. Three miss the password rules, two can’t find the “Continue” button below the keyboard, and one gives up.",
    zh: "设计师确信注册表单一目了然。直到他们看着五个人去尝试：三个人没注意到密码规则，两个人找不到被键盘挡住的“继续”按钮，还有一个人直接放弃了。",
    ja: "デザイナーは、登録フォームは分かりやすいと確信していました。5 人が試すのを見るまでは。3 人はパスワードの条件を見落とし、2 人はキーボードの下に隠れた「続ける」ボタンを見つけられず、1 人はあきらめました。",
  },
  what: {
    th: [
      "การทดสอบ Usability คือการให้คนที่เป็นตัวแทนผู้ใช้จริง ทำภารกิจที่สมจริงกับดีไซน์ของคุณ ขณะที่คุณสังเกตอย่างเงียบ ๆ ว่าเขาลังเล ทำผิด หรือทำสำเร็จตรงไหน",
      "เป็นการวิจัยเชิงคุณภาพ คุณมองหาปัญหาและสาเหตุ ไม่ใช่ตัวเลขสถิติ การทดสอบเล็ก ๆ บ่อย ๆ ดีกว่าการวิจัยใหญ่ราคาแพงครั้งเดียว",
    ],
    en: [
      "Usability testing means asking representative people to complete realistic tasks with your design while you observe — silently — where they hesitate, err or succeed.",
      "It’s qualitative: you look for problems and their causes, not statistics. Small, frequent tests beat one big expensive study.",
    ],
    zh: [
      "可用性测试是请具有代表性的人用你的设计完成真实的任务，而你在一旁安静地观察他们在哪里犹豫、出错或成功。",
      "它是定性研究：你寻找的是问题及其原因，而不是统计数字。小而频繁的测试胜过一次昂贵的大型研究。",
    ],
    ja: [
      "ユーザビリティテストとは、代表的な人に、あなたのデザインで現実的なタスクをしてもらい、どこで迷い、間違え、成功するかを、黙って観察することです。",
      "これは定性的な調査です。統計ではなく、問題とその原因を探します。大きく高価な調査を 1 回するより、小さなテストを何度もするほうが効果的です。",
    ],
  },
  why: {
    th: [
      "นักออกแบบไม่สามารถลืมสิ่งที่ตัวเองรู้เกี่ยวกับดีไซน์ได้ การดูคนอื่นใช้คือวิธีที่เร็วที่สุดในการมองมันด้วยสายตาใหม่",
      "การทดสอบกับคนประมาณห้าคนมักเผยปัญหาใหญ่ส่วนมากได้แล้ว ดังนั้นทดสอบ แก้ไข แล้วทดสอบอีกครั้งกับกลุ่มเล็ก ๆ กลุ่มใหม่",
    ],
    en: [
      "Designers can’t un-know their own design. Watching others is the fastest way to see it with fresh eyes.",
      "Testing with about five people typically uncovers most of the major problems — so test, fix, and test again with another small group.",
    ],
    zh: [
      "设计师无法“忘掉”自己对设计的了解。观察别人使用，是用全新视角看待它的最快方式。",
      "与大约五个人一起测试，通常就能发现大部分主要问题——所以测试、修复，再找一小组人测试。",
    ],
    ja: [
      "デザイナーは自分のデザインについて知っていることを忘れられません。他人が使うのを見ることが、新鮮な目で見る最速の方法です。",
      "5 人ほどでテストすれば、主要な問題の多くが見つかるのが一般的です。だから、テストして、直して、また別の少人数でテストしましょう。",
    ],
  },
  topics: [
    {
      title: { th: "การทดสอบ Usability", en: "Usability testing", zh: "可用性测试", ja: "ユーザビリティテスト" },
      body: {
        th: "เขียนภารกิจเป็นเป้าหมาย ไม่ใช่คำสั่ง (“คุณอยากโอนเงิน 500 บาทให้เพื่อน” ไม่ใช่ “กดปุ่มโอนเงิน”) ให้ผู้ทดสอบพูดสิ่งที่คิดออกมาดัง ๆ และห้ามช่วย ความยากลำบากของเขาคือข้อมูลของคุณ",
        en: "Write tasks as goals, not instructions (“You want to send £20 to a friend” — not “Tap Transfer”). Ask people to think aloud, and resist helping. Their struggle is your data.",
        zh: "把任务写成目标，而不是指令（“你想给朋友转 100 元”——而不是“点击转账”）。请人们边做边说出想法，并忍住不要帮忙。他们的挣扎，就是你的数据。",
        ja: "タスクは指示ではなく目的として書きます（「友だちに 2,000 円送りたい」であって「振込をタップして」ではない）。考えていることを声に出してもらい、助けたくなってもぐっとこらえること。相手の苦労こそが、あなたのデータです。",
      },
    },
    {
      title: { th: "ปัญหาที่พบบ่อย", en: "Common usability problems", zh: "常见的可用性问题", ja: "よくあるユーザビリティの問題" },
      body: {
        th: "ป้ายชื่อไม่ชัด ไม่มี Feedback การกระทำที่ถูกซ่อน รูปแบบที่ไม่สม่ำเสมอ ข้อความผิดพลาดที่ไม่ช่วยอะไร และขั้นตอนที่เยอะเกินไป 10 Heuristics ของ Nielsen เป็นเช็กลิสต์ที่มีประโยชน์ในการหาปัญหาเหล่านี้",
        en: "Unclear labels, missing feedback, hidden actions, inconsistent patterns, poor error messages and too many steps. Nielsen’s 10 heuristics are a useful checklist for spotting them.",
        zh: "标签不清、缺少反馈、操作被隐藏、模式不一致、错误提示糟糕、步骤太多。尼尔森的 10 条启发式原则是发现这些问题的实用清单。",
        ja: "分かりにくいラベル、フィードバックの欠如、隠れた操作、一貫しないパターン、役に立たないエラーメッセージ、多すぎるステップ。ニールセンの 10 原則は、これらを見つけるための便利なチェックリストです。",
      },
    },
    {
      title: { th: "การปรับปรุงซ้ำ (Iteration)", en: "Iteration", zh: "迭代", ja: "イテレーション" },
      body: {
        th: "ออกแบบ → ทดสอบ → เรียนรู้ → แก้ไข → ทดสอบอีกครั้ง แต่ละรอบควรแก้ปัญหาที่รุนแรงที่สุดก่อน จดบันทึกง่าย ๆ ว่าเปลี่ยนอะไรและเพราะอะไร มันจะกลายเป็น Case study ของคุณ",
        en: "Design → test → learn → change → test again. Each round should fix the most severe problems first. Keep a simple log of what changed and why — it becomes your case study.",
        zh: "设计 → 测试 → 学习 → 修改 → 再测试。每一轮都应先解决最严重的问题。简单记录改了什么、为什么改——它会变成你的案例研究。",
        ja: "デザイン → テスト → 学ぶ → 変える → もう一度テスト。各ラウンドでは、最も深刻な問題から直します。何をなぜ変えたかを簡単に記録しておけば、それがそのままケーススタディになります。",
      },
    },
  ],
  example: {
    id: "test-iterate",
    caption: {
      th: "จำลองการทดสอบฟอร์มสมัครสมาชิก อ่านผลที่พบ แก้ไข แล้วทดสอบอีกครั้ง",
      en: "Run a simulated test on a sign-up form, read the findings, apply fixes — and test again.",
      zh: "对注册表单进行一次模拟测试，阅读发现的问题，进行修改——然后再测一次。",
      ja: "登録フォームで模擬テストを行い、結果を読み、修正して、もう一度テストしましょう。",
    },
  },
  takeaway: {
    th: "คุณไม่ใช่ผู้ใช้ของคุณ จงสังเกต อย่าแค่ถาม แล้วปรับปรุงซ้ำ",
    en: "You are not your user. Watch, don’t just ask — then iterate.",
    zh: "你不是你的用户。去观察，而不只是问——然后迭代。",
    ja: "あなたはユーザーではない。聞くだけでなく観察し、そして改善を繰り返す。",
  },
  reflect: {
    th: "ขอให้ใครสักคนทำภารกิจหนึ่งอย่างบนมือถือของคุณ เช่น ตั้งปลุกในแอปที่เขาไม่เคยใช้ แล้วคุณนิ่งเงียบไว้ อะไรที่ทำให้คุณประหลาดใจ?",
    en: "Ask someone to do one task on your phone — like setting an alarm in an app they’ve never used — and stay silent. What surprised you?",
    zh: "请某人在你的手机上完成一个任务——比如在一个他从没用过的 App 里设置闹钟——你保持沉默。有什么让你感到意外？",
    ja: "誰かに、あなたのスマホでひとつのタスクをしてもらいましょう。たとえば、使ったことのないアプリでアラームを設定する。あなたは黙ったまま。何に驚きましたか？",
  },
  concepts: ["usability", "feedback", "error-state"],
  lab: ["ux-detective", "make-it-better"],
  sources: ["nng-usability-testing", "nng-five-users", "nng-heuristics", "nng-heuristic-evaluation", "iso-9241-11"],
};
