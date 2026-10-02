import type { LearningModule } from "../types";

export const interfaceDesign: LearningModule = {
  id: "interface-design",
  number: 4,
  title: { th: "การออกแบบอินเทอร์เฟซ", en: "Interface design", zh: "界面设计", ja: "インターフェースデザイン" },
  summary: {
    th: "ตัวอักษร ระยะห่าง สี และลำดับชั้นทางสายตา นำสายตาไปยังสิ่งที่สำคัญ",
    en: "Typography, spacing, colour and visual hierarchy — guiding the eye to what matters.",
    zh: "字体排版、间距、色彩与视觉层级——把目光引向重要的内容。",
    ja: "タイポグラフィ、余白、色、視覚的階層。大切なものへ視線を導く。",
  },
  minutes: 8,
  scenario: {
    th: "หน้าโปรโมชันหนึ่งใช้ตัวอักษรหกขนาด สี่สี และตัวหนาทุกที่ สายตาของคุณกระโดดไปมา แล้วคุณก็ปิดหน้าไปโดยไม่ทันเห็นโปรที่ช่วยประหยัดเงินได้จริง",
    en: "A promotion page uses six font sizes, four colours and bold text everywhere. Your eyes bounce around, and you leave without noticing the one offer that would have saved you money.",
    zh: "一个促销页用了六种字号、四种颜色，到处都是粗体。你的视线来回乱跳，最终离开，却没注意到那个本可以帮你省钱的优惠。",
    ja: "あるキャンペーンページは、6 種類の文字サイズ、4 色、そしてあちこちに太字。視線があちこち飛び回り、本当にお得なオファーに気づかないまま離れてしまいます。",
  },
  what: {
    th: [
      "การออกแบบอินเทอร์เฟซคือชั้นภาพและโครงสร้างของผลิตภัณฑ์ ได้แก่ ตัวอักษร ระยะห่าง สี รูปภาพ และคอมโพเนนต์ที่จัดวางบนเลย์เอาต์",
      "หน้าที่หลักของมันคือการสื่อสาร ลำดับชั้นทางสายตา (Visual hierarchy) หรือลำดับที่สายตาอ่านหน้าจอ เกิดจากขนาด คอนทราสต์ สี และการจัดกลุ่ม",
    ],
    en: [
      "Interface design is the visual and structural layer of a product: typography, spacing, colour, imagery and components arranged on a layout.",
      "Its main job is communication. Visual hierarchy — the order in which the eye reads a screen — is created with scale, contrast, colour and grouping.",
    ],
    zh: [
      "界面设计是产品的视觉与结构层：字体排版、间距、色彩、图像，以及排布在版面中的组件。",
      "它的主要任务是沟通。视觉层级——眼睛阅读屏幕的顺序——由大小、对比、色彩和分组共同营造。",
    ],
    ja: [
      "インターフェースデザインとは、製品の視覚と構造の層です。タイポグラフィ、余白、色、画像、そしてレイアウト上に配置されたコンポーネント。",
      "その主な役割はコミュニケーションです。視覚的階層、つまり目が画面を読む順番は、大きさ、コントラスト、色、グループ化によって生まれます。",
    ],
  },
  why: {
    th: [
      "คนกวาดตาก่อนอ่าน ลำดับชั้นที่ชัดเจนช่วยให้เข้าใจหน้าได้ในไม่กี่วินาที และเจอสิ่งที่ตั้งใจมาหา",
      "กฎทางภาพที่สม่ำเสมอ (สเกลตัวอักษร สเกลระยะห่าง ระบบสี) ทำให้ผลิตภัณฑ์ดูสงบและน่าเชื่อถือ และยังช่วยให้สร้างได้เร็วขึ้นด้วย",
    ],
    en: [
      "People scan before they read. A clear hierarchy lets them grasp the page in seconds and find the one thing they came for.",
      "Consistent visual rules (a type scale, a spacing scale, a colour system) make products feel calm and trustworthy — and make them faster to build.",
    ],
    zh: [
      "人们先扫视再阅读。清晰的层级让人几秒钟就能理解页面，并找到自己要找的东西。",
      "一致的视觉规则（字号体系、间距体系、色彩体系）让产品显得沉稳可信——也让开发更快。",
    ],
    ja: [
      "人は読む前に、ざっと見渡します。明確な階層があれば、数秒でページを把握し、目的のものを見つけられます。",
      "一貫した視覚ルール（文字サイズの体系、余白の体系、色の体系）は、製品を落ち着いた信頼できるものに見せ、作るスピードも上げます。",
    ],
  },
  topics: [
    {
      title: { th: "ตัวอักษร (Typography)", en: "Typography", zh: "字体排版", ja: "タイポグラフィ" },
      body: {
        th: "ใช้สเกลตัวอักษรไม่กี่ขนาดที่ต่างกันชัดเจน และความยาวกับความสูงบรรทัดที่อ่านสบาย ภาษาไทย จีน และญี่ปุ่นต้องการความสูงบรรทัดมากกว่าภาษาอังกฤษ เพราะตัวอักษรและวรรณยุกต์สูงกว่า",
        en: "Use a small type scale — a few sizes with clear jumps — and comfortable line length and height. Thai, Chinese and Japanese need more line height than English because of their taller characters and marks.",
        zh: "使用精简的字号体系——几个差距明显的字号——以及舒适的行长和行高。泰文、中文和日文比英文需要更大的行高，因为它们的字形和符号更高。",
        ja: "文字サイズは少数に絞り、段階をはっきりさせ、読みやすい行の長さと行間に。タイ語・中国語・日本語は、文字や記号が高いぶん、英語より広い行間が必要です。",
      },
    },
    {
      title: { th: "ระยะห่าง", en: "Spacing", zh: "间距", ja: "余白" },
      body: {
        th: "ระยะห่างคือวิธีจัดกลุ่ม สิ่งที่เกี่ยวข้องกันควรอยู่ใกล้กัน สิ่งที่ไม่เกี่ยวกันให้เว้นห่างมากขึ้น สเกลระยะห่างที่สม่ำเสมอ (4, 8, 16, 24, 32…) ช่วยให้เลย์เอาต์เป็นระเบียบ",
        en: "Space is how you group. Things that belong together sit close; unrelated things get more room. A consistent spacing scale (4, 8, 16, 24, 32…) keeps layouts tidy.",
        zh: "间距就是分组的方式。相关的东西靠近，不相关的东西留出更多空间。一致的间距体系（4、8、16、24、32……）让版面整洁有序。",
        ja: "余白はグループ化の手段です。関係するものは近くに、関係ないものは離して。一貫した余白の体系（4、8、16、24、32…）がレイアウトを整えます。",
      },
    },
    {
      title: { th: "สี", en: "Colour", zh: "色彩", ja: "色" },
      body: {
        th: "ใช้สีอย่างมีจุดประสงค์ สีเน้นหนึ่งสีสำหรับการกระทำ สีที่มีความหมายสำหรับความสำเร็จและข้อผิดพลาด และคอนทราสต์ที่อ่านได้ชัด อย่าใช้สีเป็นสิ่งเดียวที่สื่อความหมาย",
        en: "Use colour with purpose: one accent for actions, semantic colours for success and errors, and enough contrast to read. Never rely on colour alone to carry meaning.",
        zh: "有目的地使用色彩：一种强调色用于操作，语义色用于成功和错误，并保证足够的对比度。永远不要只靠颜色传达含义。",
        ja: "色は目的を持って使います。アクションにはアクセントカラーを 1 色、成功やエラーには意味のある色、そして読みやすいコントラスト。意味を色だけで伝えないこと。",
      },
    },
    {
      title: { th: "ลำดับชั้นทางสายตา", en: "Visual hierarchy", zh: "视觉层级", ja: "視覚的階層" },
      body: {
        th: "ตัดสินใจว่าแต่ละหน้าจอต้องสื่อเรื่องอะไรมากที่สุดหนึ่งเรื่อง แล้วทำให้มันใหญ่ที่สุด หนาที่สุด หรือมีคอนทราสต์มากที่สุด ลอง Squint test: หรี่ตาดู อะไรที่ยังเด่นอยู่?",
        en: "Decide the one thing each screen must communicate, then make it the biggest, boldest or most contrasting element. Try the squint test: blur your eyes — what still stands out?",
        zh: "先决定每个界面最需要传达的一件事，然后让它成为最大、最粗或对比最强的元素。试试“眯眼测试”：眯起眼睛看——什么依然最突出？",
        ja: "各画面で最も伝えるべきことをひとつ決め、それをいちばん大きく、太く、コントラストの強い要素にします。目を細めて見る「スクイントテスト」で、まだ目立つものを確かめましょう。",
      },
    },
  ],
  example: {
    id: "visual-hierarchy",
    caption: {
      th: "สลับระหว่างเลย์เอาต์ที่ทุกอย่างเท่ากัน กับเลย์เอาต์ที่มีลำดับชั้น แล้วลอง Squint test",
      en: "Flip between a flat layout and a hierarchical one — then run the squint test.",
      zh: "在“平铺”版面和“有层级”的版面之间切换——然后做一次眯眼测试。",
      ja: "平坦なレイアウトと階層のあるレイアウトを切り替えて、スクイントテストをしてみましょう。",
    },
  },
  takeaway: {
    th: "ถ้าทุกอย่างตะโกนพร้อมกัน ก็จะไม่มีใครได้ยินอะไร ลำดับชั้นเป็นตัวตัดสินว่าอะไรพูดก่อน",
    en: "If everything shouts, nothing is heard. Hierarchy decides what speaks first.",
    zh: "如果一切都在大喊，就什么也听不见。层级决定了谁先开口。",
    ja: "すべてが叫べば、何も聞こえない。階層が、何から語るかを決める。",
  },
  reflect: {
    th: "แคปหน้าจอแอปที่คุณชอบแล้วลองหรี่ตาดู สามอย่างแรกที่คุณเห็นคืออะไร? เป็นลำดับที่นักออกแบบตั้งใจไว้หรือเปล่า?",
    en: "Screenshot your favourite app and squint at it. What are the first three things you notice? Is that the order the designers intended?",
    zh: "截一张你最喜欢的 App 的屏幕，眯起眼睛看。你最先注意到的三样东西是什么？这是设计师有意安排的顺序吗？",
    ja: "お気に入りのアプリのスクリーンショットを撮って、目を細めて見てみましょう。最初に気づく 3 つは何ですか？ それはデザイナーが意図した順番でしょうか？",
  },
  concepts: ["button", "default-state", "accessibility"],
  lab: ["make-it-better"],
  sources: ["nng-visual-hierarchy", "nng-visual-principles", "hig-typography", "wcag-contrast", "laws-aesthetic"],
};
