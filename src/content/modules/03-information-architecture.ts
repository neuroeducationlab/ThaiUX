import type { LearningModule } from "../types";

export const informationArchitecture: LearningModule = {
  id: "information-architecture",
  number: 3,
  title: { th: "สถาปัตยกรรมข้อมูล", en: "Information architecture", zh: "信息架构", ja: "情報アーキテクチャ" },
  summary: {
    th: "ลำดับชั้น การนำทาง และ User flow จัดระเบียบเนื้อหาให้คนหาทางได้เอง",
    en: "Hierarchy, navigation and user flows — organising content so people can find their way.",
    zh: "层级、导航与用户流程——组织内容，让人们找得到路。",
    ja: "階層、ナビゲーション、ユーザーフロー。人が迷わず進めるように情報を整理する。",
  },
  minutes: 7,
  scenario: {
    th: "คุณต้องการเปลี่ยนเบอร์โทรที่ลงทะเบียนไว้ในแอปธนาคาร มันอยู่ใน “โปรไฟล์” “ความปลอดภัย” “ตั้งค่า” หรือ “บริการ”? คุณเปิดไปสี่เมนู ยอมแพ้ แล้วโทรหาธนาคาร",
    en: "You need to change your registered phone number in a banking app. Is it under Profile? Security? Settings? Services? You open four menus, give up, and call the bank.",
    zh: "你需要在银行 App 里修改绑定的手机号。它在“个人资料”里？“安全”？“设置”？还是“服务”？你打开了四个菜单，最后放弃，打电话给银行。",
    ja: "銀行アプリで登録電話番号を変更したい。「プロフィール」？「セキュリティ」？「設定」？「サービス」？ 4 つのメニューを開いてあきらめ、銀行に電話します。",
  },
  what: {
    th: [
      "สถาปัตยกรรมข้อมูล (Information architecture: IA) คือวิธีจัดกลุ่ม ตั้งชื่อ และเชื่อมโยงเนื้อหา เป็นโครงสร้างที่มองไม่เห็นซึ่งอยู่เบื้องหลังเมนู หน้า และการค้นหา",
      "การนำทาง (Navigation) คือส่วนที่มองเห็นได้ของ IA เช่น เมนู แท็บ ลิงก์ และ Breadcrumb ที่คนใช้เดินทางไปในโครงสร้างนั้น",
    ],
    en: [
      "Information architecture (IA) is how content is organised, labelled and connected — the invisible structure behind menus, pages and search.",
      "Navigation is the visible part of IA: the menus, tabs, links and breadcrumbs people use to move through that structure.",
    ],
    zh: [
      "信息架构（IA）是内容如何被组织、命名和连接——它是菜单、页面和搜索背后看不见的结构。",
      "导航是 IA 看得见的部分：人们用来在这个结构中移动的菜单、标签页、链接和面包屑。",
    ],
    ja: [
      "情報アーキテクチャ（IA）とは、コンテンツをどう整理し、名前をつけ、つなげるか。メニューやページ、検索の裏にある目に見えない構造です。",
      "ナビゲーションは IA の目に見える部分。人がその構造の中を移動するために使うメニュー、タブ、リンク、パンくずリストです。",
    ],
  },
  why: {
    th: [
      "ถ้าคนหาไม่เจอ ก็เหมือนสิ่งนั้นไม่มีอยู่จริง ปัญหาการหาไม่เจอทำให้คอลเซ็นเตอร์ล้น และทำให้ฟีเจอร์ดี ๆ ถูกซ่อน",
      "IA ที่ดีสะท้อนวิธีที่ผู้ใช้คิดเกี่ยวกับเนื้อหา (Mental model) ไม่ใช่โครงสร้างแผนกภายในองค์กรของคุณ",
    ],
    en: [
      "If people can’t find something, it might as well not exist. Findability problems flood support lines and hide good features.",
      "Good IA mirrors how people think about the content — their mental model — not how your organisation is structured internally.",
    ],
    zh: [
      "如果人们找不到某样东西，那它就等于不存在。可找性问题会让客服电话爆满，也会埋没好功能。",
      "好的 IA 反映的是人们对内容的理解方式（心智模型），而不是你们公司内部的组织架构。",
    ],
    ja: [
      "見つけられないものは、存在しないのと同じです。見つけにくさの問題は問い合わせ窓口をあふれさせ、良い機能を埋もれさせます。",
      "良い IA は、組織内部の構造ではなく、人がコンテンツについてどう考えるか（メンタルモデル）を映し出します。",
    ],
  },
  topics: [
    {
      title: { th: "ลำดับชั้น", en: "Hierarchy", zh: "层级", ja: "階層" },
      body: {
        th: "จัดกลุ่มสิ่งที่เกี่ยวข้องกัน แล้วเรียงกลุ่มจากกว้างไปเฉพาะเจาะจง ทำให้ตื้นเท่าที่ทำได้ ระดับที่ชัดเจนไม่กี่ระดับดีกว่าระดับที่คลุมเครือหลายระดับ",
        en: "Group related things, then order groups from broad to specific. Keep it shallow where you can: a few clear levels beat many vague ones.",
        zh: "把相关的东西分组，再把组从宽泛到具体排列。尽量保持浅层级：少数清晰的层级胜过许多模糊的层级。",
        ja: "関連するものをまとめ、グループを大まかなものから具体的なものへ並べます。できるだけ浅く。少数の明確な階層は、多くのあいまいな階層に勝ります。",
      },
    },
    {
      title: { th: "การนำทางและป้ายชื่อ", en: "Navigation & labels", zh: "导航与标签", ja: "ナビゲーションとラベル" },
      body: {
        th: "ป้ายชื่อควรใช้คำของผู้ใช้ ไม่ใช่ศัพท์ภายในองค์กร บอกผู้ใช้ว่าเขาอยู่ตรงไหน (แท็บที่ไฮไลต์ หรือ Breadcrumb) และไปที่ไหนต่อได้ บนมือถือ การนำทางที่มองเห็นได้ช่วยให้ค้นพบง่ายกว่าเมนูที่ซ่อนไว้",
        en: "Labels should use people’s words, not internal jargon. Show people where they are (highlighted tab, breadcrumb) and where they can go next. On mobile, visible navigation beats hidden menus for discoverability.",
        zh: "标签应使用用户的语言，而不是内部术语。告诉人们自己在哪里（高亮的标签页、面包屑）以及下一步能去哪里。在手机上，可见的导航比隐藏菜单更容易被发现。",
        ja: "ラベルは社内用語ではなく、使う人の言葉で。いまどこにいるか（ハイライトされたタブ、パンくずリスト）と、次にどこへ行けるかを示します。スマホでは、隠れたメニューより見えるナビゲーションのほうが見つけてもらいやすくなります。",
      },
    },
    {
      title: { th: "User flow", en: "User flows", zh: "用户流程", ja: "ユーザーフロー" },
      body: {
        th: "User flow คือแผนผังขั้นตอนที่คนใช้ทำงานหนึ่งอย่างให้สำเร็จ เช่น “เติมเงินบัตรรถไฟฟ้า” การวาดออกมาช่วยให้เห็นทางตัน ขั้นตอนที่ไม่จำเป็น และกรณีผิดพลาดที่ยังไม่ได้คิด ก่อนจะลงมือสร้างจริง",
        en: "A user flow maps the steps someone takes to complete one task — e.g. “top up a transit card”. Drawing it reveals dead ends, unnecessary steps and missing error paths before anything is built.",
        zh: "用户流程描绘一个人完成某项任务的步骤——比如“给交通卡充值”。把它画出来，可以在动手开发之前就发现死胡同、多余步骤和缺失的出错路径。",
        ja: "ユーザーフローは、ひとつのタスク（例：交通系 IC カードのチャージ）を終えるまでの手順を描いたものです。描いてみると、行き止まり、不要なステップ、考えていなかったエラーの道筋が、作る前に見えてきます。",
      },
    },
  ],
  example: {
    id: "card-sort",
    caption: {
      th: "ลองทำ Card sorting แบบย่อ: จัดกลุ่มฟีเจอร์ของแอปธนาคารตามที่คุณคิดว่าควรจะเจอ",
      en: "Try a mini card sort: group banking features the way you’d expect to find them.",
      zh: "试试迷你卡片分类：按照你期望找到它们的方式，给银行功能分组。",
      ja: "ミニ・カードソーティングに挑戦。銀行アプリの機能を、あなたが見つけたいと思う形でグループ分けしましょう。",
    },
  },
  takeaway: {
    th: "จัดระเบียบตามวิธีคิดของผู้ใช้ ไม่ใช่ตามผังองค์กร",
    en: "Organise for the way people think, not the way your company is built.",
    zh: "按照人们的思考方式来组织，而不是按照公司的组织结构。",
    ja: "会社の組織図ではなく、人の考え方に合わせて整理する。",
  },
  reflect: {
    th: "เปิดแอปที่ใช้ทุกวัน แล้วลองหาการตั้งค่าที่ไม่เคยใช้มาก่อน คุณมองหาที่ไหนเป็นที่แรก และทำไมถึงคิดว่ามันอยู่ตรงนั้น?",
    en: "Open an app you use daily and try to find a setting you’ve never used. Where did you look first — and why there?",
    zh: "打开一个你每天都用的 App，试着找一个从没用过的设置。你最先去哪里找？为什么是那里？",
    ja: "毎日使うアプリを開いて、使ったことのない設定を探してみましょう。最初にどこを見ましたか？ なぜそこだと思いましたか？",
  },
  concepts: ["usability", "scroll", "dropdown"],
  lab: ["which-would-you-choose", "ux-detective"],
  sources: ["nng-ia-study-guide", "nng-card-sorting", "nng-journeys-flows", "nng-mobile-nav", "nng-hamburger", "nng-ia-vs-sitemaps"],
};
