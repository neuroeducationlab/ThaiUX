import type { Localized } from "@/i18n/localized";

/**
 * Portfolio case study. Written in Thai and English; Chinese and Japanese
 * readers get the English text with a short note (see the page).
 */
type Block = { id: string; title: Localized; body: Localized<string[]> };

export const caseStudy = {
  eyebrow: { th: "Case study", en: "Case study" } as Localized,
  title: { th: "ออกแบบ UXLab: เรียน UX ด้วยการลงมือ", en: "Designing UXLab: learning UX by doing it" } as Localized,
  question: {
    th: "เราจะช่วยให้ผู้เริ่มต้นชาวไทยเข้าใจแนวคิด UX/UI ด้วยการลองเอง ในภาษาของตัวเอง ภายในเวลาประมาณหนึ่งนาทีต่อหนึ่งแนวคิด ได้อย่างไร?",
    en: "How might we help Thai beginners understand UX/UI concepts by experiencing them — in their own language, in about a minute per idea?",
  } as Localized,
  tldr: [
    {
      label: { th: "โจทย์", en: "Challenge", zh: "挑战", ja: "課題" },
      text: {
        th: "ผู้เริ่มต้นชาวไทยเจอ UX เป็นภาษาอังกฤษล้วนและเจอแต่คำนิยาม ท่องได้แต่มองไม่ออกในแอปจริง",
        en: "Thai beginners meet UX in English only, and in definitions — they can recite but can’t spot the idea in a real app.",
      },
    },
    {
      label: { th: "วิธีการ", en: "Approach", zh: "方法", ja: "アプローチ" },
      text: {
        th: "ลองก่อน เรียกชื่อทีหลัง เดโมสั้นในภาษาผู้เรียน บวกการตัดสินใจออกแบบที่บันทึกไว้ชัดเจน",
        en: "Experience first, name second: short demos in the learner’s language, backed by decisions recorded in the open.",
      },
    },
    {
      label: { th: "ผลลัพธ์", en: "Outcome", zh: "成果", ja: "結果" },
      text: {
        th: "22 แนวคิด · 8 บทเรียน · 4 Lab · 21 เอฟเฟกต์ · 4 ภาษา · WCAG 2.2 AA 0 ปัญหา",
        en: "22 concepts · 8 modules · 4 Lab experiments · 21 effects · 4 languages · 0 WCAG 2.2 AA findings",
      },
    },
  ] as { label: Localized; text: Localized }[],
  notice: {
    th: "",
    en: "",
    zh: "本案例研究目前提供英文和泰文版本，以下为英文内容。",
    ja: "このケーススタディは現在、英語とタイ語で公開しています。以下は英語版です。",
  } as Localized,
  meta: [
    {
      label: { th: "บทบาท", en: "Role", zh: "角色", ja: "役割" },
      value: {
        th: "Molly: ออกแบบผลิตภัณฑ์ กำกับเนื้อหา และพัฒนา โดยมีผู้ช่วย AI เป็นคู่คิด",
        en: "Molly: product design, content direction and build, with an AI pair",
      },
    },
    { label: { th: "แพลตฟอร์ม", en: "Platform", zh: "平台", ja: "プラットフォーム" }, value: { th: "เว็บแบบ Responsive (มือถือก่อน)", en: "Responsive web, mobile-first" } },
    { label: { th: "ภาษา", en: "Languages", zh: "语言", ja: "言語" }, value: { th: "ไทย · English · 简体中文 · 日本語", en: "ไทย · English · 简体中文 · 日本語" } },
    {
      label: { th: "เทคโนโลยี", en: "Stack", zh: "技术栈", ja: "技術" },
      value: { th: "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4", en: "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4" },
    },
  ] as { label: Localized; value: Localized }[],

  sections: [
    {
      id: "problem",
      title: { th: "ปัญหา", en: "Problem" },
      body: {
        th: [
          "ผู้เริ่มต้นชาวไทยเจอกำแพงสองชั้น: ภาษา (แหล่งอ้างอิงเกือบทั้งหมดเป็นภาษาอังกฤษ) และวิธีสอน (แนวคิดอย่าง Affordance หรือ Feedback เป็น “ความรู้สึก” แต่ถูกอธิบายด้วยตัวหนังสือล้วน ๆ) ผลคือท่องนิยามได้แต่มองไม่ออกในแอปจริง",
        ],
        en: [
          "Thai beginners face two walls: language (most trustworthy resources are in English) and teaching style (ideas like affordance or feedback are about how something feels, yet get explained with text alone). People can recite a definition but can’t spot the idea in a real app.",
        ],
      },
    },
    {
      id: "research",
      title: { th: "การค้นคว้า", en: "Research" },
      body: {
        th: [
          "ค้นคว้าเอกสารจากหกแหล่งอ้างอิงหลัก (NNG, Apple HIG, Material Design, WCAG 2.2, GOV.UK Design System, Laws of UX) สังเคราะห์แนวคิดที่ปรากฏซ้ำออกมาเป็น 22 แนวคิด 8 บทเรียน การสำรวจแหล่งเรียนรู้ที่มีอยู่พบสามรูปแบบ — บทความยาว คอร์สวิดีโอ และอภิธานศัพท์ที่ไม่มีอะไรให้ลอง — ช่องว่างคือเนื้อหาสั้น ลองได้จริง อยู่ในภาษาของผู้เรียน",
          "ข้อจำกัดตรงไปตรงมา: เวอร์ชันแรกยังไม่ได้สัมภาษณ์หรือทดสอบกับผู้ใช้จริง แผนทดสอบกับผู้เริ่มต้นห้าคนเตรียมเป็นขั้นต่อไป",
        ],
        en: [
          "Desk research from six primary references (NNG, Apple HIG, Material Design, WCAG 2.2, GOV.UK Design System, Laws of UX) synthesised the recurring ideas into 22 concepts and 8 modules. A scan of existing learning resources showed three formats — long articles, video courses, and glossaries with nothing to try — leaving a clear gap: short, hands-on, in the learner’s own language.",
          "An honest limitation: this first version rests on desk research and the brief, not interviews or tests with real learners. A usability test with five Thai beginners is planned as the next step.",
        ],
      },
    },
    {
      id: "users",
      title: { th: "ผู้ใช้", en: "Users" },
      body: {
        th: [
          "Proto-persona สามแบบด้านล่างคือสมมติฐานที่ต้องพิสูจน์ ไม่ใช่ข้อเท็จจริง",
        ],
        en: [
          "The three proto-personas below are assumptions to validate, not facts.",
        ],
      },
    },
    {
      id: "ia",
      title: { th: "สถาปัตยกรรมข้อมูล", en: "Information architecture" },
      body: {
        th: [
          "หน้าแรกมีปุ่ม call to action เดียว กดแล้วพาทัวร์ 30 วินาทีว่าจะได้อะไร: เอฟเฟกต์ → Copy prompt ไปใช้กับ AI → เรียนผ่านการลอง → เกียรติบัตร ห้าส่วนตอบห้าความต้องการ: เรียนรู้ (เส้นทางมีลำดับ) · คลังศัพท์ (ค้นหาและลอง แค่วางเมาส์บนการ์ดก็เล่นตัวอย่างย่อได้ทันที) · Lab (ฝึกตัดสินใจ) · เอฟเฟกต์ (ได้ไอเดียและสร้างเองด้วย AI) · เกี่ยวกับ (ความน่าเชื่อถือ) ทุก URL มีภาษานำหน้าเช่น /th/glossary/hover และ ⌘K ค้นข้ามภาษาข้ามตัวอักษร พิมพ์ “โฮเวอร์” หรือ “悬停” ก็เจอ Hover บนมือถือใช้แถบแท็บด้านล่างห้าปุ่มให้นิ้วโป้งเอื้อมถึง",
        ],
        en: [
          "The homepage has one call to action: a 30-second tour of what you get — effects → a prompt for your own AI → learning by doing → a certificate. Five sections answer five needs: Learn (a structured path) · Glossary (look up and try — rest the pointer on a card and its mini demo plays right there) · Lab (practise decisions) · Effects (get inspired, then build with AI) · About (trust). Every URL carries its language (/th/glossary/hover), and ⌘K search works across languages and scripts — typing “โฮเวอร์” or “悬停” finds Hover. On phones, a five-item bottom tab bar keeps navigation within thumb reach.",
        ],
      },
    },
    {
      id: "ux",
      title: { th: "การตัดสินใจด้าน UX", en: "UX decisions" },
      body: {
        th: ["ทุกการตัดสินใจสำคัญถูกบันทึกพร้อมทางเลือก เหตุผล และสิ่งที่ต้องแลก ตัวอย่างบางส่วน:"],
        en: ["Every material decision was recorded with its options, reasoning and trade-off. A selection:"],
      },
    },
    {
      id: "ui",
      title: { th: "การตัดสินใจด้าน UI", en: "UI decisions" },
      body: {
        th: [
          "ทิศทางภาพ: ความเรียบแบบ Apple ผสมจังหวะนิตยสาร — พื้นสีกระดาษ สีหลักสีเดียว “คราม” พื้นที่ว่างให้เนื้อหาหายใจ ไม่มี Gradient หรือ Glassmorphism",
          "ฟอนต์เลือกจากการเรนเดอร์เปรียบเทียบจริงในเบราว์เซอร์: Inter (ละติน) · Noto Sans Thai (ไทย) · Instrument Serif (ศัพท์) จีนและญี่ปุ่นใช้ฟอนต์ระบบไม่ต้องโหลดหลายเมกะไบต์ หัวข้อไทยเพิ่มระยะบรรทัดกันวรรณยุกต์ชน สีตัวอักษรทุกสีผ่าน WCAG 2.2 AA (4.5 : 1) ทั้งสองโหมด ปุ่มหลักสูงอย่างน้อย 44 px ทุกองค์ประกอบมีวงแหวนโฟกัสชัด",
        ],
        en: [
          "The visual direction is Apple-like restraint with an editorial rhythm: paper-toned neutrals, a single accent — Kram, a Thai indigo — and generous white space. No gratuitous gradients, no glassmorphism.",
          "Fonts were chosen by rendering real comparisons in the browser: Inter (Latin) · Noto Sans Thai (Thai) · Instrument Serif (headwords). Chinese and Japanese use system fonts to avoid multi-megabyte downloads; Thai headings get extra line height so tone marks never collide. Every reading colour passes WCAG 2.2 AA (4.5 : 1) in light and dark mode, primary actions are at least 44 px tall, and every interactive element has a clearly visible focus ring.",
        ],
      },
    },
    {
      id: "prototype",
      title: { th: "ต้นแบบ", en: "Prototype" },
      body: {
        th: [
          "เริ่มจาก Wireframe ความละเอียดต่ำแล้วสร้างต้นแบบเป็นโค้ดจริงทันที เพราะสิ่งที่ต้องทดสอบคือการโต้ตอบ ซึ่งภาพนิ่งตอบไม่ได้ รูปแบบหลักที่ได้คือ “กรอบเดโม” — บอกว่าให้ลองอะไร ให้ลงมือ แล้วเรียกชื่อสิ่งที่เพิ่งรู้สึก เช่น “คุณเพิ่งได้สัมผัส Hover”",
        ],
        en: [
          "Low-fidelity wireframes came first, then coded prototypes straight away — what needed testing was interaction, which static mock-ups can’t answer. The core pattern that emerged is the demo frame: tell people what to try, let them do it, then name what they just felt — “You just experienced Hover.”",
        ],
      },
    },
    {
      id: "build",
      title: { th: "การพัฒนา", en: "Build" },
      body: {
        th: [
          "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 เนื้อหาทั้งหมดเป็นข้อมูลที่มี Type กำกับ (ไทย/อังกฤษบังคับ จีน/ญี่ปุ่นย้อนไปอังกฤษได้) ทุกหน้าสร้างเป็นไฟล์สถิตตอน build เดโมแยกโหลดเฉพาะหน้าที่ใช้ ความคืบหน้าเก็บในเครื่องของผู้ใช้เท่านั้น ไม่มีบัญชี ไม่มีระบบติดตาม",
        ],
        en: [
          "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4. All content is typed data (Thai and English required, Chinese and Japanese fall back to English). Every page is generated statically at build time, each demo is code-split to its page, and progress lives only on the learner’s device — no accounts, no tracking.",
        ],
      },
    },
    {
      id: "iteration",
      title: { th: "การปรับปรุง", en: "Iteration" },
      body: {
        th: ["การรีวิวด้วย Heuristics และการทดสอบบนมือถือพบปัญหาจริงหลายข้อ และแก้ไขก่อนเปิดตัว:"],
        en: ["A heuristic review and on-device testing found real problems, which were fixed before launch:"],
      },
    },
    {
      id: "outcome",
      title: { th: "ผลลัพธ์", en: "Outcome" },
      body: {
        th: [
          "axe-core ตามเกณฑ์ WCAG 2.2 A/AA ไม่พบปัญหาบน 21 หน้าหลัก ครบทั้งสี่ภาษา ทั้งสองโหมด และในตัวอย่างย่อทั้ง 22 ตัวบนการ์ดคลังศัพท์ (เสริมด้วยการตรวจด้วยคีย์บอร์ด) ตัวชี้วัดจริงจะมาจากการทดสอบกับผู้ใช้: ผู้เริ่มต้นอธิบายแนวคิดด้วยคำของตัวเองได้หลังลองหนึ่งนาทีหรือไม่",
        ],
        en: [
          "Automated axe-core checks against WCAG 2.2 A/AA report no violations on all 21 key pages, in all four languages, in light and dark mode, and in all 22 glossary mini demos opened in place (backed up by keyboard passes). The real success measure comes from testing with learners: can a beginner explain a concept in their own words after one minute of trying it?",
        ],
      },
    },
    {
      id: "reflection",
      title: { th: "สิ่งที่ได้เรียนรู้", en: "Reflection" },
      body: {
        th: [
          "การสอนด้วยประสบการณ์บังคับให้ทุกเดโมต้องมี “ช่วงเวลา” ที่เรียกชื่อได้ชัด ถ้าหาไม่เจอแปลว่ายังเข้าใจแนวคิดไม่ลึกพอ การออกแบบสำหรับสี่ระบบตัวอักษรไม่ใช่แค่การแปล — ไทยต้องการระยะบรรทัดมากกว่า จีนและญี่ปุ่นต้องการจังหวะที่ต่างออกไป และปัญหาบนมือถือส่วนใหญ่เห็นได้เฉพาะตอนทดสอบบนจอเล็กจริง",
          "การทำงานกับ AI ได้ผลดีที่สุดเมื่อการตัดสินใจถูกพูดออกมาอย่างชัดเจน: ทางเลือก สิ่งที่ต้องแลก คำแนะนำ แล้วคนเป็นผู้ตัดสินใจ ขั้นต่อไป: ทดสอบกับผู้เริ่มต้นชาวไทยห้าคน เพิ่มบทวิเคราะห์ Real-World UX และเพิ่มการทดลองใน Lab ตามสิ่งที่ผู้เรียนติดขัดจริง",
        ],
        en: [
          "Teaching through experience forces every demo to have a nameable moment — if I couldn’t find that moment, I didn’t understand the concept deeply enough yet. Designing for four scripts is more than translation: Thai needs more line height, Chinese and Japanese need a different rhythm, and most mobile problems only show up when you test on a real small screen.",
          "Working with AI went best when decisions were made explicit — options, trade-offs, a recommendation — and a human made the call. Next: test with five Thai beginners, add Real-World UX teardowns, and grow the Lab around where learners actually get stuck.",
        ],
      },
    },
  ] as Block[],

  decisions: [
    {
      title: { th: "ลองก่อน แล้วค่อยบอกชื่อ", en: "Experience first, name second" },
      why: {
        th: "ความเข้าใจจากการลงมือติดตัวนานกว่าการอ่านนิยาม เดโมจึงมาก่อนคำอธิบายทุกครั้ง",
        en: "Understanding built by doing outlasts a definition, so the demo always comes before the explanation.",
      },
      tradeoff: { th: "ต้องสร้างเดโมให้ครบ 22 แนวคิด ซึ่งใช้เวลามากกว่าการเขียนบทความ", en: "Every one of the 22 concepts needs a working demo — far more effort than an article." },
    },
    {
      title: { th: "ศัพท์อังกฤษ + ชื่อเรียกท้องถิ่น", en: "English headwords, local names" },
      why: {
        th: "คำที่ได้ยินในที่ทำงานจริงคือคำอังกฤษ เรียนคำนั้นตั้งแต่แรก แต่มีชื่อในภาษาของผู้เรียนกำกับ",
        en: "The words you’ll hear at work are English, so learn those from day one — with your own language beside them.",
      },
      tradeoff: { th: "ช่วงแรกอาจดูยากกว่าการแปลทั้งหมด", en: "Slightly harder at first than translating everything." },
    },
    {
      title: { th: "ภาษาไทยเป็นค่าเริ่มต้น", en: "Thai by default" },
      why: {
        th: "ระบบเลือกภาษาจากเบราว์เซอร์ ถ้าไม่ระบุเลยจะเป็นภาษาไทย ถ้าเป็นภาษาที่ไม่รองรับ เช่น ฮินดี จะเป็นภาษาอังกฤษ",
        en: "Language follows the browser; with no preference it’s Thai, and unsupported languages such as Hindi get English.",
      },
      tradeoff: { th: "ต้องดูแลเนื้อหาสี่ภาษา", en: "Four languages to maintain." },
    },
    {
      title: { th: "ความคืบหน้าเก็บในเครื่อง", en: "Progress stays on the device" },
      why: { th: "ไม่ต้องสมัคร ไม่มีแรงเสียดทาน และเป็นมิตรต่อความเป็นส่วนตัว", en: "No sign-up, no friction and privacy-friendly." },
      tradeoff: { th: "ข้อมูลไม่ซิงก์ข้ามอุปกรณ์", en: "No sync across devices." },
    },
    {
      title: { th: "แถบแท็บด้านล่างบนมือถือ", en: "Bottom tab bar on phones" },
      why: {
        th: "ทุกส่วนมองเห็นตลอดและอยู่ในระยะนิ้วโป้ง ต่างจากเมนูแฮมเบอร์เกอร์ที่ซ่อนตัวเลือกไว้",
        en: "Every section stays visible and within thumb reach, unlike a hamburger menu that hides the options.",
      },
      tradeoff: { th: "ใช้พื้นที่ด้านล่างของจอประมาณ 68 px", en: "Uses about 68 px at the bottom of the screen." },
    },
    {
      title: { th: "Lab สอนการชั่งน้ำหนัก ไม่ใช่คำตอบเดียว", en: "The Lab teaches trade-offs, not answers" },
      why: {
        th: "งานออกแบบจริงแทบไม่มีคำตอบเดียวที่ถูก ทักษะคือการให้เหตุผลตามบริบท",
        en: "Real design rarely has one right answer; the skill is reasoning from context.",
      },
      tradeoff: { th: "ผู้เรียนบางคนอยากได้คำตอบที่ชัดเจน", en: "Some learners would prefer a clear verdict." },
    },
  ] as { title: Localized; why: Localized; tradeoff: Localized }[],

  personas: [
    {
      name: { th: "ผู้อยากเปลี่ยนสายงาน", en: "The curious switcher" },
      note: {
        th: "นักศึกษาหรือคนทำงานที่สนใจ UX มาจากลิงก์โซเชียลบนมือถือ อ่านอังกฤษได้แต่ช้า ต้องการชัยชนะเล็ก ๆ ที่เห็นผลเร็ว",
        en: "A student or professional exploring UX, arriving from a social link on mobile. Reads English, slowly. Needs quick, visible wins.",
      },
    },
    {
      name: { th: "คนทำงานร่วมกับดีไซเนอร์", en: "The collaborator" },
      note: {
        th: "นักพัฒนาหรือนักการตลาดที่อยากได้คำศัพท์ไว้คุยกับทีม ต้องการคำที่แม่นยำและหาเจอเร็ว",
        en: "A developer or marketer who works with designers and wants the vocabulary to talk with them. Needs precise terms, fast.",
      },
    },
    {
      name: { th: "ผู้ติดตามต่างประเทศ", en: "The international follower" },
      note: {
        th: "ผู้ติดตามของ Molly ในจีน ญี่ปุ่น และอินเดีย ที่อยากอ่านในภาษาของตัวเองหรือภาษาอังกฤษ",
        en: "Someone in Molly’s audience in China, Japan or India who wants to read in their own language or in English.",
      },
    },
  ] as { name: Localized; note: Localized }[],

  iterations: [
    {
      finding: {
        th: "บนมือถือ คำอธิบายของ “นักสืบ UX” อยู่ใต้หน้าจอ หลังแตะผู้ใช้จึงไม่เห็น Feedback",
        en: "On phones, UX Detective’s explanations appeared below the fold — after a tap, people saw no feedback.",
      },
      fix: {
        th: "แสดงคำอธิบายใต้จุดที่แตะทันที และเลื่อนหน้าจอให้เห็นอย่างนุ่มนวล",
        en: "Show the explanation right under the tapped part and gently scroll it into view.",
      },
      principle: { th: "การมองเห็นสถานะของระบบ", en: "Visibility of system status" },
    },
    {
      finding: {
        th: "ใน “ทำให้ดีขึ้น” และ “สร้างปุ่ม” ตัวอย่างเลื่อนหายไปขณะปรับตัวเลือก ต้องเลื่อนขึ้นลงตลอด",
        en: "In Make It Better and Build a Button, the preview scrolled away while people adjusted the controls.",
      },
      fix: { th: "ปักหมุดตัวอย่างไว้ด้านบนบนมือถือ ให้เห็นผลทุกครั้งที่ปรับ", en: "Pin the preview on phones so every change is visible as it happens." },
      principle: { th: "Feedback ทันที", en: "Immediate feedback" },
    },
    {
      finding: {
        th: "ใน “คุณจะเลือกแบบไหน?” แบบ A และ B เรียงต่อกันบนมือถือ เปรียบเทียบได้ยาก",
        en: "In Which Would You Choose?, designs A and B were stacked on phones, which made comparing them hard.",
      },
      fix: { th: "วางตัวอย่างคู่กัน แล้วแสดงข้อดีข้อเสียเต็มความกว้างด้านล่าง", en: "Place the mock-ups side by side and show the trade-offs full-width below." },
      principle: { th: "ลดภาระความจำ", en: "Recognition rather than recall" },
    },
    {
      finding: {
        th: "ปุ่มบทเรียนในหน้าแรกขอให้ผู้ใช้ “ชี้” ซึ่งทำไม่ได้บนจอสัมผัส",
        en: "The homepage’s lesson button asked people to hover — impossible on a touch screen.",
      },
      fix: {
        th: "ตรวจว่าอุปกรณ์รองรับ Hover หรือไม่ แล้วปรับคำแนะนำและการนับให้ตรงกับอุปกรณ์",
        en: "Detect whether the device can hover, then adapt the prompt and the count to it.",
      },
      principle: { th: "สอดคล้องกับโลกจริง", en: "Match between system and the real world" },
    },
  ] as { finding: Localized; fix: Localized; principle: Localized }[],

  labels: {
    decision: { th: "การตัดสินใจ", en: "Decision" },
    why: { th: "เหตุผล", en: "Why" },
    tradeoff: { th: "สิ่งที่ต้องแลก", en: "Trade-off" },
    finding: { th: "สิ่งที่พบ", en: "Finding" },
    fix: { th: "การแก้ไข", en: "Fix" },
    stats: {
      concepts: { th: "แนวคิด", en: "concepts" },
      modules: { th: "บทเรียน", en: "modules" },
      experiments: { th: "การทดลองใน Lab", en: "Lab experiments" },
      languages: { th: "ภาษา", en: "languages" },
      pages: { th: "หน้าที่สร้างไว้ล่วงหน้า", en: "pre-rendered pages" },
      sources: { th: "แหล่งอ้างอิงที่ตรวจแล้ว", en: "verified sources" },
    },
    contents: { th: "ในหน้านี้", en: "On this page" },
    process: { th: "เอกสารกระบวนการทั้งหมดอยู่ใน GitHub", en: "The full process documents are on GitHub" },
    tldr: { th: "สรุปสั้น", en: "At a glance", zh: "概览", ja: "一目で" },
  },
};
