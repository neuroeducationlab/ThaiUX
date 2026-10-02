import type { LearningModule } from "../types";

export const whatIsUx: LearningModule = {
  id: "what-is-ux",
  number: 1,
  title: { th: "UX คืออะไร?", en: "What is UX?", zh: "什么是 UX？", ja: "UX とは？" },
  summary: {
    th: "ความต่างระหว่าง UX กับ UI และทำไมงานออกแบบที่ดีจึงเริ่มจากคน ไม่ใช่จากพิกเซล",
    en: "The difference between UX and UI — and why good design starts with people, not pixels.",
    zh: "UX 与 UI 的区别——以及为什么好的设计从人出发，而不是从像素出发。",
    ja: "UX と UI の違い。そして、良いデザインがピクセルではなく人から始まる理由。",
  },
  minutes: 6,
  scenario: {
    th: "คุณสั่งอาหารผ่านแอปเดลิเวอรี หน้าจอสวยมาก แต่ปุ่ม “สั่งซื้อ” ซ่อนอยู่ล่างสุด ค่าส่งเพิ่งโผล่มาในขั้นตอนสุดท้าย และไรเดอร์ต้องโทรหาเพราะหมุดตำแหน่งผิด UI สวย แต่ประสบการณ์แย่",
    en: "You order dinner on a delivery app. The screens are gorgeous — but the “Order” button hides below the fold, the fee appears only at the last step, and the rider calls because the pin was wrong. Beautiful UI. Painful experience.",
    zh: "你在外卖 App 上点晚餐。界面很漂亮——但“下单”按钮藏在页面最下方，配送费到最后一步才出现，骑手还因为定位错误打来电话。界面很美，体验很痛苦。",
    ja: "デリバリーアプリで夕食を注文します。画面はとてもきれい。でも「注文」ボタンは画面の下に隠れ、配送料は最後のステップでやっと表示され、ピンの位置がずれていて配達員から電話がかかってきます。美しい UI、つらい体験。",
  },
  what: {
    th: [
      "UX (User Experience) คือทุกอย่างที่คนคนหนึ่งได้สัมผัสเมื่อใช้ผลิตภัณฑ์หรือบริการ ตั้งแต่การค้นพบ การเรียนรู้ การใช้งาน การขอความช่วยเหลือ ไปจนถึงความรู้สึกหลังใช้",
      "UI (User Interface) คือส่วนที่มองเห็นและสัมผัสได้ เช่น หน้าจอ ปุ่ม ข้อความ สี และเลย์เอาต์ UI เป็นวัตถุดิบสำคัญอย่างหนึ่งของ UX แต่ไม่ใช่ทั้งจาน",
    ],
    en: [
      "UX (user experience) is everything a person experiences when using a product or service: finding it, learning it, using it, getting help, and how they feel afterwards.",
      "UI (user interface) is the part you see and touch — screens, buttons, text, colour, layout. UI is one important ingredient of UX, not the whole meal.",
    ],
    zh: [
      "UX（用户体验）是一个人在使用产品或服务时所经历的一切：发现它、学会它、使用它、寻求帮助，以及用完之后的感受。",
      "UI（用户界面）是你能看到、能触碰的部分——屏幕、按钮、文字、颜色、布局。UI 是 UX 的重要原料之一，但不是整道菜。",
    ],
    ja: [
      "UX（ユーザーエクスペリエンス）とは、人が製品やサービスを使うときに体験するすべてのこと。見つける、覚える、使う、助けを求める、そして使い終わった後の気持ちまで。",
      "UI（ユーザーインターフェース）とは、目で見て触れる部分。画面、ボタン、文字、色、レイアウト。UI は UX の大切な材料のひとつですが、料理全体ではありません。",
    ],
  },
  why: {
    th: [
      "คนตัดสินผลิตภัณฑ์จากว่ามันช่วยให้ทำสิ่งที่ต้องการได้สำเร็จหรือไม่ ไม่ใช่จากความสวยในภาพหน้าจอ อินเทอร์เฟซที่สวยแต่ขั้นตอนสับสนก็ยังล้มเหลวอยู่ดี",
      "การออกแบบที่ยึดผู้ใช้เป็นศูนย์กลาง (User-centred design ตามมาตรฐาน ISO 9241-210) ช่วยให้ทีมไม่หลงทาง: เข้าใจคนและบริบทก่อน ให้ผู้ใช้มีส่วนร่วมตลอดทาง ทดสอบกับเขา แล้วปรับปรุงซ้ำ",
    ],
    en: [
      "People judge a product by whether it helps them get things done — not by how it looks in a screenshot. A stunning interface on top of a confusing flow still fails.",
      "User-centred design (ISO 9241-210) keeps teams honest: understand people and their context first, involve them throughout, test with them, and iterate.",
    ],
    zh: [
      "人们评判一个产品，看的是它能否帮自己把事情办成——而不是截图有多好看。漂亮的界面配上混乱的流程，依然是失败的。",
      "以用户为中心的设计（ISO 9241-210）让团队保持清醒：先理解人和他们的情境，全程让用户参与，与他们一起测试，并不断迭代。",
    ],
    ja: [
      "人が製品を評価する基準は、スクリーンショットの美しさではなく、やりたいことを達成できるかどうかです。美しいインターフェースでも、流れが分かりにくければ失敗です。",
      "人間中心設計（ISO 9241-210）はチームを正しい方向に保ちます。まず人とその状況を理解し、最初から最後まで関わってもらい、一緒にテストし、改善を繰り返すこと。",
    ],
  },
  topics: [
    {
      title: { th: "UX ต่างจาก UI อย่างไร", en: "UX vs UI", zh: "UX 和 UI 的区别", ja: "UX と UI の違い" },
      body: {
        th: "ลองนึกถึงร้านอาหาร UI คือดีไซน์เมนู จาน และการตกแต่งร้าน ส่วน UX คือประสบการณ์ทั้งหมด ตั้งแต่หาร้านเจอ สั่งอาหารได้ไม่สับสน อาหารมาตามที่คาด ไปจนถึงอยากกลับมาอีก",
        en: "Think of a restaurant. UI is the menu design, the plates and the décor. UX is the whole visit: finding the place, ordering without confusion, food arriving as expected — and wanting to come back.",
        zh: "想象一家餐厅。UI 是菜单设计、餐具和装潢；UX 是整个用餐经历：找到餐厅、点餐不迷糊、上菜符合预期——以及想再来一次。",
        ja: "レストランを思い浮かべてください。UI はメニューのデザイン、お皿、内装。UX は訪問全体です。お店を見つけ、迷わず注文し、期待どおりの料理が届き、また来たいと思えること。",
      },
    },
    {
      title: { th: "การออกแบบที่ยึดผู้ใช้เป็นศูนย์กลาง", en: "User-centred design", zh: "以用户为中心的设计", ja: "人間中心設計" },
      body: {
        th: "เป็นวงจร ไม่ใช่เส้นตรง: เข้าใจบริบท → ระบุสิ่งที่ผู้ใช้ต้องการ → ออกแบบทางแก้ → ประเมินกับผู้ใช้จริง → ทำซ้ำ ทุกรอบทำให้ผลิตภัณฑ์เข้ากับคนได้ดีขึ้น",
        en: "A loop, not a straight line: understand the context → define what people need → design solutions → evaluate with real users → repeat. Each turn of the loop makes the product fit people better.",
        zh: "这是一个循环，而不是一条直线：理解情境 → 明确需求 → 设计方案 → 与真实用户一起评估 → 重复。每转一圈，产品就更贴合人。",
        ja: "直線ではなくループです。状況を理解する → 必要なことを定義する → 解決策をデザインする → 実際のユーザーと評価する → 繰り返す。1 周ごとに、製品は人によりフィットしていきます。",
      },
    },
    {
      title: { th: "UX ห้าชั้น", en: "Five layers of UX", zh: "UX 的五个层面", ja: "UX の 5 つの段階" },
      body: {
        th: "Jesse James Garrett อธิบาย UX เป็นห้าชั้น จากนามธรรมไปถึงรูปธรรม: Strategy, Scope, Structure, Skeleton และ Surface โดย UI อยู่ในสองชั้นบนเป็นหลัก แต่การตัดสินใจในชั้นล่างกำหนดทุกอย่างที่คุณเห็น",
        en: "Jesse James Garrett described UX as five planes, from abstract to concrete: strategy, scope, structure, skeleton and surface. UI lives mostly on the top two — the decisions underneath shape everything you see.",
        zh: "杰西·詹姆斯·加勒特把 UX 描述为从抽象到具体的五个层面：战略层、范围层、结构层、框架层和表现层。UI 主要位于最上面两层——而底下的决定塑造了你看到的一切。",
        ja: "ジェシー・ジェームズ・ギャレットは UX を、抽象から具体へと向かう 5 つの段階で説明しました。戦略、要件、構造、骨格、表層。UI は主に上の 2 つにあり、その下での判断が、目に見えるすべてを形づくります。",
      },
    },
  ],
  example: {
    id: "five-planes",
    caption: {
      th: "ลองแกะชั้นของแอปสั่งอาหาร จากพื้นผิวที่มองเห็น ลงไปถึงกลยุทธ์ที่อยู่ข้างใต้",
      en: "Peel back the layers of a delivery app — from the surface you see to the strategy underneath.",
      zh: "一层层剥开外卖 App——从你看到的表面，一直到底层的战略。",
      ja: "デリバリーアプリの層を 1 枚ずつめくってみましょう。目に見える表層から、その下の戦略まで。",
    },
  },
  takeaway: {
    th: "UI คือสิ่งที่คนเห็น UX คือสิ่งที่คนทำได้สำเร็จ และความรู้สึกระหว่างทาง",
    en: "UI is what people see. UX is what people get done — and how it feels.",
    zh: "UI 是人们看到的；UX 是人们完成了什么——以及过程中的感受。",
    ja: "UI は人が見るもの。UX は人が成し遂げること、そしてその間の気持ち。",
  },
  reflect: {
    th: "นึกถึงแอปที่คุณใช้วันนี้ บอกมาหนึ่งช่วงที่รู้สึกลื่นไหล และหนึ่งช่วงที่หงุดหงิด สาเหตุมาจาก UI (หน้าตา) หรือ UX (การทำงาน)?",
    en: "Think of an app you used today. Name one moment that felt effortless and one that annoyed you. Was the cause UI (how it looked) or UX (how it worked)?",
    zh: "想想你今天用过的一个 App。说出一个觉得毫不费力的时刻，和一个让你烦躁的时刻。原因是 UI（看起来怎样）还是 UX（用起来怎样）？",
    ja: "今日使ったアプリをひとつ思い浮かべてください。スムーズだった瞬間と、イライラした瞬間をひとつずつ。原因は UI（見た目）でしたか、それとも UX（使い勝手）でしたか？",
  },
  concepts: ["usability", "affordance", "feedback"],
  lab: ["which-would-you-choose"],
  sources: ["nng-ux-definition", "nng-what-is-ux", "nng-ux-vs-ui", "iso-9241-210", "garrett-elements", "dschool-bootleg"],
};
