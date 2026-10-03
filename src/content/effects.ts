import type { Localized } from "@/i18n/localized";

/**
 * Effects library — interaction effects you can play with, each with the
 * UX reasoning behind it and a ready-to-paste prompt for AI coding tools.
 *
 * Prompts are written in English on purpose: AI coding tools follow
 * technical English most reliably, and the terms are the ones learners
 * will meet at work (see UXDR-21). Everything around them is localised.
 */

export type EffectCategory = "cursor" | "reveal" | "physics" | "depth" | "micro";

export type EffectId =
  | "water-ripple"
  | "xray"
  | "flower-cursor"
  | "particles"
  | "image-trail"
  | "magnetic"
  | "tilt"
  | "spotlight"
  | "gooey"
  | "exploded-view"
  | "hover-preview"
  | "glow-cards"
  | "spring-drag"
  | "before-after"
  | "kinetic-type"
  | "text-scramble"
  | "celebrate"
  | "tactile"
  | "hover-styles";

/** The five-part prompt formula: Effect · Trigger · Feel · Purpose · Guardrails. */
export type PromptParts = {
  /** What to build, e.g. "a magnetic button component" — completes “Create …”. */
  build: string;
  effect: string;
  trigger: string;
  feel: string;
  purpose: string;
  guardrails: string;
};

export type Effect = {
  id: EffectId;
  category: EffectCategory;
  level: 1 | 2 | 3;
  tech: string[];
  /** English headword, as used at work. */
  name: string;
  localName: Localized;
  tagline: Localized;
  /** What to try — shown above the live demo. */
  try: Localized;
  why: Localized;
  use: Localized;
  avoid: Localized;
  /** Glossary concepts behind the effect. */
  related: string[];
  prompt: PromptParts;
};

export const effectCategories: { id: EffectCategory; label: Localized }[] = [
  { id: "cursor", label: { th: "เคอร์เซอร์", en: "Cursor", zh: "光标", ja: "カーソル" } },
  { id: "reveal", label: { th: "เผยสิ่งที่ซ่อน", en: "Reveal", zh: "揭示", ja: "リビール" } },
  { id: "physics", label: { th: "ฟิสิกส์และของเหลว", en: "Physics & fluid", zh: "物理与流体", ja: "物理と流体" } },
  { id: "depth", label: { th: "มิติและแสง", en: "Depth & light", zh: "深度与光影", ja: "奥行きと光" } },
  { id: "micro", label: { th: "ไมโครอินเทอร์แอคชัน", en: "Micro-interactions", zh: "微交互", ja: "マイクロインタラクション" } },
];

export const effects: Effect[] = [
  {
    id: "water-ripple",
    category: "physics",
    level: 3,
    tech: ["Canvas", "JS"],
    name: "Water ripple",
    localName: { th: "ระลอกน้ำ", en: "Water ripple", zh: "水波纹", ja: "水面の波紋" },
    tagline: {
      th: "ลากเมาส์บนผิวน้ำ แล้วภาพใต้น้ำจะบิดตามคลื่นจริง",
      en: "Drag across the pond and the picture underneath bends with real waves.",
      zh: "在水面上划过，水下的画面会随真实的波浪扭曲。",
      ja: "水面をなぞると、波に合わせて水の中の景色がゆがみます。",
    },
    try: {
      th: "ลากเมาส์ช้า ๆ แล้วคลิกเพื่อโยนหิน",
      en: "Drag slowly, then click to drop a stone.",
      zh: "慢慢拖动，再点击投下一颗石子。",
      ja: "ゆっくりなぞってから、クリックで石を落としてみて。",
    },
    why: {
      th: "สิ่งที่ทำตัวเหมือนโลกจริง (คลื่นกระจาย สะท้อน แล้วค่อย ๆ จาง) สมองเข้าใจได้ทันทีโดยไม่ต้องเรียนรู้อะไรใหม่ ยิ่งตอบสนองต่อมือเราเอง ยิ่งอยากเล่นต่อ",
      en: "Things that behave like the real world — waves spread, bounce and fade — make sense instantly; there’s nothing new to learn. When they respond to your own hand, you want to keep playing.",
    },
    use: {
      th: "แบรนด์ที่เกี่ยวกับน้ำ สปา ธรรมชาติ หรือช่วงเวลาที่อยากให้คนหยุดเล่นสักพัก",
      en: "Brands about water, wellness or nature, or moments meant for pausing and playing.",
    },
    avoid: {
      th: "มือถือสเปกต่ำ หรือวางไว้หลังข้อความที่ต้องอ่าน เพราะใช้พลังเครื่องสูง",
      en: "Low-end phones, or behind text that must be read — it’s hungry for processing power.",
    },
    related: ["feedback", "drag-and-drop"],
    prompt: {
      build: "an interactive water ripple effect on a canvas",
      effect:
        "draw a pond scene (water gradient, lily pads, a lotus, two koi) to an offscreen canvas, then render it through a 2D wave simulation so the picture refracts where waves pass, with lighter and darker shading on the wave slopes.",
      trigger:
        "moving the pointer disturbs the water continuously; a click drops a bigger stone; when nobody is interacting, an occasional raindrop keeps the surface alive.",
      feel: "classic two-buffer height-map ripple: each cell becomes the average of its four neighbours × 2 minus its previous value, damped by 1/32 per frame, so waves fade in about two seconds.",
      purpose: "create a calm, tactile moment that makes people stop and play.",
      guardrails:
        "simulate at half resolution and scale up; use typed arrays; run only while visible (IntersectionObserver) and pause in background tabs; show a still image when prefers-reduced-motion is set; stay under 4 ms per frame on a mid-range phone.",
    },
  },
  {
    id: "xray",
    category: "reveal",
    level: 2,
    tech: ["SVG", "CSS", "JS"],
    name: "X-ray lens",
    localName: { th: "เลนส์เอกซเรย์", en: "X-ray lens", zh: "X 光透镜", ja: "X 線レンズ" },
    tagline: {
      th: "ส่องผ่านผิวลงไปเห็นกระดูกและอวัยวะ พร้อมชื่อเรียกตรงจุดที่ส่อง",
      en: "Look through the skin to the bones and organs inside, with names as you go.",
      zh: "透过皮肤看到里面的骨骼和器官，名称随之出现。",
      ja: "皮膚の下の骨や臓器が見え、その名前も表示されます。",
    },
    try: {
      th: "พาเลนส์ไปที่หัว หน้าอก และขา",
      en: "Move the lens over the head, chest and legs.",
      zh: "把透镜移到头部、胸部和腿部。",
      ja: "レンズを頭、胸、脚へ動かしてみましょう。",
    },
    why: {
      th: "การเปิดเผยทีละส่วน (Progressive disclosure) ไม่ทำให้สมองรับข้อมูลล้น เห็นภาพรวมก่อน แล้วค่อยส่องรายละเอียดตรงที่สนใจ ป้ายชื่อที่โผล่ตรงจุดนั้นจำได้ดีกว่าการอ่านจากตาราง",
      en: "Progressive disclosure keeps the brain from overloading: see the whole first, then inspect the part you care about. A label that appears in place is remembered better than one in a separate table.",
    },
    use: {
      th: "สื่อการเรียนรู้ และหน้าสินค้าที่อยากโชว์ “ข้างใน” เช่น รองเท้า หูฟัง หรือแปลนบ้าน",
      en: "Learning tools, and product pages that show what’s inside — shoes, headphones, floor plans.",
    },
    avoid: {
      th: "ข้อมูลที่ต้องเห็นพร้อมกันทั้งหมด หรือเมื่อไม่มีทางอื่นให้คนที่ไม่ใช้เมาส์ได้ดูข้อมูลเดียวกัน",
      en: "Information people must see all at once, or when there’s no other way for people without a mouse to get the same information.",
    },
    related: ["feedback", "usability", "accessibility"],
    prompt: {
      build: "an X-ray lens viewer for an anatomy illustration",
      effect:
        "two stacked SVG layers of the same body: skin on top, skeleton and organs underneath; a circular lens (about 110 px) around the cursor cuts through the top layer to show the inside, with a thin ring outline.",
      trigger:
        "the pointer moves over the figure; when the lens centre is over a named region (skull, heart, lungs, ribcage, pelvis, femur…), show that name in a label next to the lens.",
      feel: "the lens follows the pointer directly, with no lag, so it feels like a physical magnifying glass; labels fade in within 120 ms.",
      purpose: "let learners see the whole picture first, then explore details where they’re curious (progressive disclosure).",
      guardrails:
        "cut the hole with a CSS radial-gradient mask on the top layer instead of re-rendering; arrow keys move the lens for keyboard users; announce the current part in an aria-live region; dragging works on touch screens; nothing animates on its own, so it stays comfortable with prefers-reduced-motion.",
    },
  },
  {
    id: "flower-cursor",
    category: "cursor",
    level: 2,
    tech: ["CSS", "JS"],
    name: "Flower cursor",
    localName: { th: "เคอร์เซอร์ดอกไม้", en: "Flower cursor", zh: "花朵光标", ja: "花のカーソル" },
    tagline: {
      th: "เมาส์กลายเป็นดอกไม้ ทิ้งกลีบไว้ตามทาง และบานเมื่อชี้ไปที่ปุ่ม",
      en: "Your cursor becomes a flower, drops petals as it moves, and blooms over a button.",
      zh: "光标变成一朵花，移动时洒落花瓣，指向按钮时绽放。",
      ja: "カーソルが花に変わり、動くと花びらが舞い、ボタンの上で咲きます。",
    },
    try: {
      th: "ขยับเมาส์ไปรอบ ๆ แล้วชี้ปุ่มตรงกลาง",
      en: "Move around, then point at the button in the middle.",
      zh: "四处移动鼠标，然后指向中间的按钮。",
      ja: "ぐるっと動かしてから、真ん中のボタンを指してみましょう。",
    },
    why: {
      th: "เคอร์เซอร์ที่เปลี่ยนตามบริบทบอกว่า “ตรงนี้กดได้” โดยไม่ต้องอ่าน (Affordance) ส่วนกลีบดอกที่ร่วงตามทางคือ Feedback ของทุกการเคลื่อนไหว สมองชอบสิ่งที่ตอบสนองต่อเราทันที",
      en: "A cursor that changes with context says “this is clickable” without words (affordance), and the falling petals give feedback for every movement. Brains love things that respond to them instantly.",
    },
    use: {
      th: "หน้าแบรนด์ แคมเปญ หรือพอร์ตโฟลิโอที่ต้องการบุคลิก",
      en: "Brand pages, campaigns and portfolios that need personality.",
    },
    avoid: {
      th: "แอปที่ต้องทำงานเร็ว ฟอร์ม หรือหน้าที่ต้องเล็งแม่น ๆ และอย่าซ่อนเคอร์เซอร์จริงทั้งหน้า",
      en: "Productivity apps, forms, or anywhere precise pointing matters — and never hide the real cursor across a whole page.",
    },
    related: ["affordance", "feedback", "hover"],
    prompt: {
      build: "a custom flower cursor for one section of a page",
      effect:
        "inside the section, replace the cursor with a small five-petal flower (inline SVG) that follows the pointer with a slight lag and drops petals that drift down, rotate and fade out.",
      trigger:
        "the pointer moves inside the section; over buttons and links the flower grows 1.6× and spins its petals open; a click bursts petals outward.",
      feel: "follow with easing (lerp 0.2 per frame); each petal lives about 900 ms; the bloom springs with a slight overshoot over 300 ms.",
      purpose: "add personality and make interactive elements obvious — the cursor itself signals what can be clicked.",
      guardrails:
        "keep the native cursor everywhere else and on touch devices; skip the petal trail when prefers-reduced-motion is set; cap petals at about 30 and reuse their elements; animate transform and opacity only; pointer-events: none on the flower; buttons still show a visible focus ring.",
    },
  },
  {
    id: "particles",
    category: "physics",
    level: 3,
    tech: ["Canvas", "JS"],
    name: "Particle text",
    localName: { th: "ตัวอักษรอนุภาค", en: "Particle text", zh: "粒子文字", ja: "パーティクル文字" },
    tagline: {
      th: "คำว่า “ว้าว” ที่ทำจากจุดนับพัน แตกกระจายเมื่อเมาส์ผ่าน แล้วกลับมาเรียงตัวใหม่",
      en: "A word made of over a thousand dots scatters as your cursor passes, then pulls itself back together.",
      zh: "由上千个点组成的文字，光标拂过时四散，然后重新聚合。",
      ja: "千以上の点でできた文字が、カーソルで散らばり、また集まります。",
    },
    try: {
      th: "กวาดเมาส์ผ่านตัวอักษร แล้วคลิกให้ระเบิด",
      en: "Sweep through the letters, then click to explode them.",
      zh: "划过文字，再点击让它们爆开。",
      ja: "文字の上をなぞってから、クリックで弾けさせて。",
    },
    why: {
      th: "สมองชอบเห็นระเบียบเกิดขึ้นจากความวุ่นวาย กฎ Gestalt ทำให้เราเห็นจุดที่แยกกันเป็นคำเดียว พอจุดกลับมาเรียงตัว เราจึงรู้สึกพอใจ",
      en: "We love watching order emerge from chaos. Gestalt grouping makes scattered dots read as one word, so watching them return feels satisfying.",
    },
    use: {
      th: "พาดหัวของหน้าแรก การเปิดตัวโลโก้ หรือช่วงประกาศเปิดตัว",
      en: "Hero headlines, logo reveals and launch moments.",
    },
    avoid: {
      th: "ข้อความที่ต้องอ่านได้ตลอดเวลา และต้องมีข้อความจริงไว้ให้ Screen reader อ่านเสมอ",
      en: "Text that must stay readable — and always keep the real text for screen readers.",
    },
    related: ["feedback", "accessibility"],
    prompt: {
      build: "an interactive particle text hero",
      effect:
        "render a word to an offscreen canvas, sample every 5th pixel to get target points, and draw a small dot for each one; dots are pushed away by the cursor and spring back home.",
      trigger: "the pointer repels dots within an 80 px radius; a click explodes every dot outward, then they reassemble.",
      feel: "spring toward home (stiffness about 0.05) with damping 0.86; the push fades with distance, so it feels like brushing sand.",
      purpose: "a memorable brand moment in the hero that rewards playing.",
      guardrails:
        "keep the real word in the DOM (visually hidden) for screen readers and SEO; cap at about 2,000 particles; scale the canvas by devicePixelRatio but no more than 2; pause when off-screen; show the static word for prefers-reduced-motion; rebuild the points on resize.",
    },
  },
  {
    id: "image-trail",
    category: "cursor",
    level: 2,
    tech: ["JS"],
    name: "Image trail",
    localName: { th: "รูปภาพตามเมาส์", en: "Image trail", zh: "图片拖尾", ja: "画像トレイル" },
    tagline: {
      th: "ขยับเมาส์แล้วรูปภาพผุดขึ้นตามทาง เหมือนกำลังวาดด้วยรูป",
      en: "Move and pictures pop up along your path, like painting with images.",
      zh: "移动鼠标，图片沿着路径接连出现，像在用图片作画。",
      ja: "動かすと軌跡に沿って画像が現れ、写真で描いているよう。",
    },
    try: {
      th: "ลากเมาส์เร็ว ๆ แล้วลองช้า ๆ ดูความต่าง",
      en: "Sweep fast, then slow, and compare.",
      zh: "先快速划过，再慢慢移动，比较一下。",
      ja: "速く、そしてゆっくり動かして比べてみましょう。",
    },
    why: {
      th: "การเคลื่อนไหวที่เกิดจากมือเราเองให้ความรู้สึกว่าควบคุมได้ (Sense of agency) ยิ่งรูปออกมาตามความเร็วมือ สมองยิ่งผูกตัวเองเข้ากับหน้าจอ",
      en: "Motion caused by your own hand creates a sense of agency. When the pictures keep pace with your speed, your brain ties itself to the screen.",
    },
    use: {
      th: "หน้าแรกของพอร์ตโฟลิโอ แกลเลอรี หรือแคมเปญที่อยากให้คนเล่นก่อนอ่าน",
      en: "Portfolio landing pages, galleries, and campaigns that invite play before reading.",
    },
    avoid: {
      th: "หน้าที่มีเนื้อหาสำคัญต้องอ่าน รูปที่ไปบังข้อความ หรือไฟล์รูปใหญ่ที่ทำให้หน้าช้า",
      en: "Pages where reading matters, pictures that cover text, or heavy files that slow the page down.",
    },
    related: ["feedback", "hover"],
    prompt: {
      build: "an image trail effect for a hero section",
      effect:
        "as the pointer moves, spawn picture cards at the pointer position that scale in, then shrink and fade out; the newest card always sits on top.",
      trigger: "spawn a new card every 80 px of pointer travel (not on a timer), so speed controls the density; on touch, follow the finger while dragging.",
      feel: "cards pop in over 150 ms with a slight overshoot, live about one second, and drift a few pixels in the direction of travel as they fade.",
      purpose: "invite people to play with the hero before reading — the page answers them immediately.",
      guardrails:
        "reuse a pool of 10–12 card elements instead of creating new ones; preload small, compressed images; disable for prefers-reduced-motion; keep the headline readable above the trail; animate transform and opacity only.",
    },
  },
  {
    id: "magnetic",
    category: "cursor",
    level: 2,
    tech: ["CSS", "JS"],
    name: "Magnetic button",
    localName: { th: "ปุ่มแม่เหล็ก", en: "Magnetic button", zh: "磁吸按钮", ja: "マグネットボタン" },
    tagline: {
      th: "ปุ่มถูกดูดเข้าหาเมาส์เหมือนแม่เหล็ก แล้วเด้งกลับอย่างนุ่มนวล",
      en: "The button pulls toward your cursor like a magnet, then springs back.",
      zh: "按钮像磁铁一样被光标吸过去，然后柔和地弹回。",
      ja: "ボタンが磁石のようにカーソルに引き寄せられ、ふわっと戻ります。",
    },
    try: {
      th: "พาเมาส์เข้าใกล้ปุ่มช้า ๆ ไม่ต้องชี้ตรงปุ่ม",
      en: "Bring your cursor near the button — you don’t have to touch it.",
      zh: "把光标慢慢靠近按钮，不必正好指到它。",
      ja: "ボタンにゆっくり近づけて。ぴったり指さなくても大丈夫。",
    },
    why: {
      th: "ปุ่มที่ขยับเข้าหาเราดูเหมือน “สังเกตเห็นเรา” และพื้นที่ที่กดได้จริงก็ขยายขึ้น ตามกฎของ Fitts เป้าที่ใหญ่และอยู่ใกล้กดได้เร็วกว่า",
      en: "A button that moves toward you seems to notice you, and its effective target grows — Fitts’s law says bigger, closer targets are faster to hit.",
    },
    use: {
      th: "ปุ่ม Call to action หลักเพียงปุ่มเดียวต่อหน้า",
      en: "One main call to action per page.",
    },
    avoid: {
      th: "ใส่ทุกปุ่มบนหน้า (จะดูวุ่นวาย) หรือปุ่มในเมนูที่อยู่ติดกัน เพราะจะแย่งกันดูด",
      en: "Every button on the page (it gets chaotic), or menu items next to each other that would fight over the cursor.",
    },
    related: ["button", "hover", "affordance"],
    prompt: {
      build: "a magnetic button component",
      effect: "the button and its label drift toward the cursor, as if pulled by a magnet; the label moves a little further than the button, for depth.",
      trigger: "starts when the pointer comes within 100 px of the button’s centre and ends when it leaves that radius.",
      feel: "move up to 30% of the pointer offset (the label 45%); follow smoothly; on leave, spring back with a slight overshoot over about 400 ms.",
      purpose: "make the main call to action feel inviting and easier to hit, because the effective target grows.",
      guardrails:
        "no movement on touch devices or with prefers-reduced-motion; keep the layout and the real hit area stable (transform only); visible focus ring; the button still works with Enter and Space.",
    },
  },
  {
    id: "tilt",
    category: "depth",
    level: 2,
    tech: ["CSS", "JS"],
    name: "Holographic tilt",
    localName: { th: "การ์ดโฮโลแกรม", en: "Holographic tilt card", zh: "全息倾斜卡片", ja: "ホログラムカード" },
    tagline: {
      th: "การ์ดเอียงตามเมาส์ แสงและสีรุ้งเคลื่อนไหวเหมือนบัตรโฮโลแกรมของจริง",
      en: "The card tilts toward your cursor and its rainbow foil shifts like a real holographic card.",
      zh: "卡片随光标倾斜，彩虹光泽像真正的全息卡一样流动。",
      ja: "カードがカーソルに合わせて傾き、虹色の箔が本物のように動きます。",
    },
    try: {
      th: "เลื่อนเมาส์ไปที่มุมต่าง ๆ ของการ์ด",
      en: "Move to each corner of the card.",
      zh: "把光标移到卡片的各个角落。",
      ja: "カードの四隅へマウスを動かしてみましょう。",
    },
    why: {
      th: "แสงสะท้อนที่ขยับตามมุมมองคือสัญญาณความลึกที่สมองใช้ตัดสินว่าเป็นวัตถุจริง ยิ่งตอบสนองเร็ว ยิ่งรู้สึกเหมือนถือการ์ดไว้ในมือ",
      en: "Reflections that shift with the viewing angle are the depth cue our brains use to judge real objects. The faster it responds, the more it feels like a card in your hand.",
    },
    use: {
      th: "บัตรสมาชิก ตั๋ว สินค้าพรีเมียม หรือรางวัลหลังทำภารกิจสำเร็จ",
      en: "Membership cards, tickets, premium products, or a reward after an achievement.",
    },
    avoid: {
      th: "ทุกการ์ดในรายการยาว ๆ (จะเวียนหัว) และตัวหนังสือเล็ก ๆ บนการ์ดที่เอียง",
      en: "Every card in a long list (it gets dizzying), and small text on a tilting card.",
    },
    related: ["hover", "feedback"],
    prompt: {
      build: "a holographic 3D tilt card",
      effect:
        "a card in perspective that rotates toward the cursor (up to 14°), a soft white glare that follows the pointer, and a rainbow foil layer (conic-gradient with mix-blend-mode: color-dodge) that shifts with the tilt; inner layers use translateZ for parallax.",
      trigger: "the pointer moves over the card; on leave it eases back to flat.",
      feel: "rotation follows quickly (about 100 ms); the return eases out over 500 ms.",
      purpose: "make a reward or premium item feel special and real, like a collectible card.",
      guardrails:
        "drive everything with CSS variables updated in requestAnimationFrame; no tilt on touch devices or with prefers-reduced-motion; keep text large and high-contrast; add will-change only while the card is being hovered.",
    },
  },
  {
    id: "spotlight",
    category: "reveal",
    level: 1,
    tech: ["CSS", "JS"],
    name: "Spotlight reveal",
    localName: { th: "ไฟฉายส่องหา", en: "Spotlight reveal", zh: "聚光灯", ja: "スポットライト" },
    tagline: {
      th: "ห้องมืดที่เมาส์คือไฟฉาย ส่องหาของที่ซ่อนอยู่ให้เจอ",
      en: "A dark room where your cursor is the torch. Find what’s hidden.",
      zh: "一间暗室，光标就是手电筒，找出藏起来的东西。",
      ja: "暗い部屋で、カーソルが懐中電灯。隠れたものを探そう。",
    },
    try: {
      th: "ส่องหาไอคอนที่ซ่อนอยู่ 3 ชิ้น",
      en: "Find the 3 hidden icons.",
      zh: "找到 3 个隐藏的图标。",
      ja: "隠れたアイコンを 3 つ探しましょう。",
    },
    why: {
      th: "ช่องว่างของความอยากรู้ (Curiosity gap) ดึงให้คนสำรวจ และสมองให้รางวัลกับการ “ค้นพบเอง” มากกว่าการถูกบอก",
      en: "A curiosity gap pulls people to explore, and the brain rewards discovering something more than being told it.",
    },
    use: {
      th: "Easter egg หน้าแคมเปญ เกม หรือการเล่าเรื่องที่ค่อย ๆ เปิดเผย",
      en: "Easter eggs, campaigns, games, and stories that unfold step by step.",
    },
    avoid: {
      th: "เนื้อหาหรือปุ่มที่คนจำเป็นต้องเห็น ห้ามซ่อนสิ่งสำคัญไว้ในความมืด",
      en: "Any content or control people need — never hide the essentials in the dark.",
    },
    related: ["feedback", "usability"],
    prompt: {
      build: "a spotlight reveal section",
      effect:
        "the section is almost black; a soft circle of light (about 120 px) follows the cursor and reveals the content underneath; three small icons are hidden in the dark.",
      trigger:
        "the pointer moves inside the section; an icon counts as found when the centre of the light passes within 40 px of it, and a counter updates (Found 2 of 3).",
      feel: "the light follows with gentle easing; a found icon glows for a moment and then stays visible.",
      purpose: "turn exploring into a small game that rewards curiosity.",
      guardrails:
        "use a CSS radial-gradient overlay driven by CSS variables (no canvas needed); arrow keys move the light for keyboard users; announce the counter in an aria-live region; the light follows a finger on touch screens; move without easing for prefers-reduced-motion.",
    },
  },
  {
    id: "gooey",
    category: "cursor",
    level: 2,
    tech: ["SVG", "CSS", "JS"],
    name: "Gooey blobs",
    localName: { th: "หยดของเหลว", en: "Gooey blobs", zh: "粘稠液滴", ja: "とろける液体" },
    tagline: {
      th: "เมาส์ลากหยดของเหลวที่ไหลรวมและแยกตัวเหมือนเยลลี่",
      en: "Your cursor pulls liquid blobs that merge and split like jelly.",
      zh: "光标牵引着液滴，像果冻一样融合又分开。",
      ja: "カーソルが液体を引っぱり、ゼリーのようにくっついたり離れたり。",
    },
    try: {
      th: "ลากเมาส์ผ่านหยดที่อยู่นิ่ง ๆ แล้วดูมันรวมตัวกัน",
      en: "Drag through the resting blobs and watch them merge.",
      zh: "划过静止的液滴，看它们融合在一起。",
      ja: "止まっているしずくの上を通って、合体するのを見てみましょう。",
    },
    why: {
      th: "รูปทรงที่ยืดหยุ่นเหมือนสิ่งมีชีวิต (Organic motion) ดูเป็นมิตรกว่าเส้นแข็ง ๆ และตาของเราจะมองตามการเคลื่อนไหวแบบนี้โดยอัตโนมัติ",
      en: "Organic, stretchy shapes feel friendlier than rigid ones, and our eyes follow this kind of motion automatically.",
    },
    use: {
      th: "แบรนด์ที่สนุกสนาน หน้าแรก หรือช่วงโหลดที่อยากให้ดูมีชีวิต",
      en: "Playful brands, landing pages, or loading moments that should feel alive.",
    },
    avoid: {
      th: "วางไว้หลังข้อความยาว ๆ เพราะจะดึงความสนใจตลอดเวลา",
      en: "Behind long text — it pulls attention constantly.",
    },
    related: ["feedback"],
    prompt: {
      build: "a gooey blob cursor effect",
      effect:
        "a chain of six circles follows the cursor, each lagging a little more than the one before; an SVG “goo” filter (Gaussian blur plus a high-contrast alpha colour matrix) melts them together, and a few resting blobs in the scene merge when the chain passes.",
      trigger: "the pointer moves inside the area; pressing makes the lead blob grow 1.4×.",
      feel: "each circle eases toward the one in front of it (0.35, 0.31, 0.27…), so merging looks like surface tension.",
      purpose: "add a playful, organic feel to a hero or brand moment.",
      guardrails:
        "apply the filter to the blob layer only, never to text; keep the area small for performance; pause when off-screen; disable for prefers-reduced-motion; pointer-events: none on the blobs.",
    },
  },
  {
    id: "exploded-view",
    category: "depth",
    level: 2,
    tech: ["CSS", "JS"],
    name: "Exploded layers",
    localName: { th: "แยกเลเยอร์ 3 มิติ", en: "Exploded layers", zh: "图层爆炸视图", ja: "レイヤー分解ビュー" },
    tagline: {
      th: "หน้าจอแอปแยกออกเป็นชั้น ๆ แบบ 3 มิติ ให้เห็นว่า UI ซ้อนกันอย่างไร",
      en: "An app screen pulls apart into 3D layers, showing how an interface is stacked.",
      zh: "应用界面分离成 3D 图层，展示界面是如何叠起来的。",
      ja: "アプリ画面が立体的なレイヤーに分かれ、UI の重なり方が見えます。",
    },
    try: {
      th: "เลื่อนเมาส์ไปทางขวาเพื่อแยกชั้น",
      en: "Move to the right to pull the layers apart.",
      zh: "向右移动，把图层拉开。",
      ja: "右へ動かしてレイヤーを引き離しましょう。",
    },
    why: {
      th: "การได้เห็นโครงสร้างที่ซ่อนอยู่ช่วยสร้าง Mental model ว่าอะไรอยู่บนอะไร คนที่เข้าใจลำดับชั้น (Elevation) จะใช้เงาและลำดับความสำคัญได้ถูก",
      en: "Seeing the hidden structure builds a mental model of what sits on what. Understanding elevation is how you get shadows and visual hierarchy right.",
    },
    use: {
      th: "อธิบายโครงสร้างของผลิตภัณฑ์ หน้าแนะนำฟีเจอร์ หรือสอนเรื่อง z-index",
      en: "Explaining product structure, feature pages, or teaching z-index.",
    },
    avoid: {
      th: "ใช้แทนภาพหน้าจอธรรมดา ในตอนที่คนแค่อยากรู้ว่าหน้าตาเป็นอย่างไร",
      en: "Replacing a plain screenshot when people just want to see what it looks like.",
    },
    related: ["modal", "usability"],
    prompt: {
      build: "an exploded-view illustration of an app screen",
      effect:
        "a phone mock-up made of four stacked layers (background, content cards, navigation bars, a toast); in 3D (perspective: 1000px, transform-style: preserve-3d) the layers separate along the Z axis, and a legend names each layer with its elevation.",
      trigger: "the pointer’s horizontal position controls how far apart the layers are (flat on the left, fully exploded on the right); keyboard arrows do the same.",
      feel: "follow the pointer smoothly (lerp 0.12) so the stack seems to breathe; the legend highlights layers once they’re more than 30% apart.",
      purpose: "help people understand how interfaces are built from layers (elevation and hierarchy).",
      guardrails:
        "keep labels as flat, readable text outside the 3D stack; show a still, labelled exploded diagram for prefers-reduced-motion; animate transforms only; dragging sideways works on touch screens.",
    },
  },
  {
    id: "hover-preview",
    category: "reveal",
    level: 2,
    tech: ["JS"],
    name: "Hover preview",
    localName: { th: "พรีวิวตอนชี้", en: "Hover preview", zh: "悬停预览", ja: "ホバープレビュー" },
    tagline: {
      th: "ชี้ชื่อคอมโพเนนต์ แล้วภาพตัวอย่างจะลอยตามเมาส์ไป",
      en: "Point at a component’s name and a preview floats along with your cursor.",
      zh: "指向组件名称，预览图会跟着光标浮动。",
      ja: "コンポーネント名を指すと、プレビューがカーソルについてきます。",
    },
    try: {
      th: "เลื่อนเมาส์ขึ้นลงผ่านรายการ",
      en: "Move up and down the list.",
      zh: "在列表上上下移动。",
      ja: "リストの上で上下に動かしてみましょう。",
    },
    why: {
      th: "ได้เห็นก่อนตัดสินใจคลิก (Information scent) ช่วยลดการเปิดผิดหน้า และการเอียงตามความเร็วเมาส์ทำให้ภาพดูมีน้ำหนักเหมือนของจริง",
      en: "Seeing before clicking (information scent) cuts down wrong turns, and the tilt that follows your speed gives the preview weight, like a real object.",
    },
    use: {
      th: "รายการโปรเจกต์ในพอร์ต เมนูอาหาร หรือรายการไหนก็ได้ที่ภาพช่วยให้ตัดสินใจ",
      en: "Project lists in portfolios, menus, or any list where a picture helps people choose.",
    },
    avoid: {
      th: "จอสัมผัสที่ไม่มี Hover ต้องมีวิธีอื่นให้เห็นภาพเดียวกันเสมอ",
      en: "Touch screens, which have no hover — always offer the picture another way too.",
    },
    related: ["hover", "tooltip"],
    prompt: {
      build: "a hover preview list",
      effect:
        "a list of large text items; hovering an item shows a floating preview card (an image or a mini mock-up) near the cursor, which follows the pointer and tilts slightly in the direction of movement.",
      trigger: "the pointer enters a list item; the preview switches when moving to another item and hides when leaving the list.",
      feel: "the card follows with easing (lerp about 0.15); the tilt is proportional to horizontal speed, capped at 12°; it fades and scales in over 200 ms.",
      purpose: "give people a glimpse before they commit to a click (information scent).",
      guardrails:
        "pointer-events: none on the preview; on touch devices show thumbnails inline instead; items work with the keyboard and show the preview on focus; no tilt for prefers-reduced-motion.",
    },
  },
  {
    id: "glow-cards",
    category: "depth",
    level: 1,
    tech: ["CSS", "JS"],
    name: "Glow border",
    localName: { th: "ขอบเรืองแสงตามเมาส์", en: "Glow border", zh: "光晕边框", ja: "光るボーダー" },
    tagline: {
      th: "แสงไหลตามเมาส์ไปตามขอบการ์ดทั้งแผง เหมือนไฟฉายส่องกระจก",
      en: "A glow follows your cursor along the edges of every card, like light on glass.",
      zh: "光芒随光标沿着每张卡片的边缘流动，像光照在玻璃上。",
      ja: "カーソルを追って光がカードの縁を流れます。ガラスに当たる光のように。",
    },
    try: {
      th: "ลากเมาส์ผ่านช่องว่างระหว่างการ์ด",
      en: "Move through the gaps between the cards.",
      zh: "在卡片之间的空隙中移动。",
      ja: "カードとカードの隙間をなぞってみましょう。",
    },
    why: {
      th: "แสงที่ไหลต่อเนื่องข้ามการ์ดทำให้หลายชิ้นดูเป็นกลุ่มเดียวกัน (Gestalt: Common fate) และบอกล่วงหน้าว่ากำลังจะเลือกอันไหน",
      en: "Light that flows across the cards makes them read as one group (Gestalt: common fate) and previews which one you’re about to choose.",
    },
    use: {
      th: "แผงฟีเจอร์ ตารางราคา หรือแดชบอร์ดบนพื้นหลังสีเข้ม",
      en: "Feature grids, pricing plans and dashboards on dark backgrounds.",
    },
    avoid: {
      th: "พื้นหลังสีสว่าง (แสงจะจางหาย) หรือใช้แทนสถานะ Focus ที่ต้องเห็นชัด",
      en: "Light backgrounds (the glow disappears), or as a replacement for a clear focus state.",
    },
    related: ["hover", "focus-state"],
    prompt: {
      build: "a grid of cards with a cursor-following glow border",
      effect: "each card has a 1 px border; a radial gradient (about 220 px) centred on the cursor lights up the border near it, and a fainter glow lights the card surface.",
      trigger: "one pointermove listener on the grid sets --x and --y on every card (relative to that card), so the light flows continuously across the gaps.",
      feel: "instant tracking with no easing — it should feel like a torch on glass; fade out over 300 ms when the pointer leaves the grid.",
      purpose: "tie related options together and preview which one you’re about to pick.",
      guardrails:
        "draw the border glow with a pseudo-element and mask-composite, not extra elements; keep a normal visible focus ring for keyboard users; text contrast must not depend on the glow; no effect on touch screens; with prefers-reduced-motion, show the glow without the fade.",
    },
  },
  {
    id: "spring-drag",
    category: "physics",
    level: 2,
    tech: ["JS"],
    name: "Spring drag",
    localName: { th: "ลากแล้วเด้ง", en: "Spring drag", zh: "弹簧拖拽", ja: "バネのドラッグ" },
    tagline: {
      th: "ดึงการ์ดออกไปแล้วปล่อย มันจะเด้งกลับเหมือนยางยืด",
      en: "Pull the card away and let go — it snaps back like a rubber band.",
      zh: "把卡片拉开再松手，它会像橡皮筋一样弹回来。",
      ja: "カードを引っぱって離すと、ゴムのように戻ります。",
    },
    try: {
      th: "ลากการ์ดไปไกล ๆ แล้วปล่อย ลองเหวี่ยงแรง ๆ ด้วย",
      en: "Drag the card far away and let go. Try flinging it too.",
      zh: "把卡片拖远再松开，也试试用力甩出去。",
      ja: "カードを遠くまでドラッグして離して。勢いよく投げてもみて。",
    },
    why: {
      th: "การเคลื่อนที่แบบสปริงมีทั้งความเร่งและการเลยจุดหมายเล็กน้อยเหมือนของจริง ต่างจากเส้นตรงแบบเครื่องจักร หน้าจอจึงรู้สึกเหมือนจับต้องได้ (Direct manipulation)",
      en: "Spring motion speeds up and overshoots a little, like real objects — unlike linear, mechanical motion — so the screen feels touchable (direct manipulation).",
    },
    use: {
      th: "การ์ดที่ปัดทิ้งได้ Bottom sheet การดึงเพื่อรีเฟรช และขอบของรายการที่เลื่อนสุดแล้ว (Rubber banding)",
      en: "Swipeable cards, bottom sheets, pull-to-refresh, and the ends of scrolling lists (rubber banding).",
    },
    avoid: {
      th: "สปริงที่เด้งนานหรือแรงเกินไป จะดูเหมือนของเล่นและทำให้ต้องรอ",
      en: "Springs that bounce too long or too hard — they feel toy-like and make people wait.",
    },
    related: ["drag-and-drop", "swipe", "feedback"],
    prompt: {
      build: "a draggable card with spring physics",
      effect:
        "a card you can drag anywhere in its area; a thin elastic band connects it to its home position; while moving it tilts in the direction of travel; when released it springs home.",
      trigger: "pressing the card starts the drag (with pointer capture); releasing starts the spring, using the speed of the throw.",
      feel: "a damped spring with stiffness 170 and damping 18 (a slight overshoot, settling in about 600 ms); beyond 110 px from home, add rubber-band resistance.",
      purpose: "make the interface feel physical and responsive — direct manipulation.",
      guardrails:
        "use Pointer Events so mouse, pen and touch all work; touch-action: none on the card only; arrow keys nudge the card and it springs back; with prefers-reduced-motion return home without overshoot; animate transform only.",
    },
  },
  {
    id: "before-after",
    category: "reveal",
    level: 1,
    tech: ["CSS", "JS"],
    name: "Before / after slider",
    localName: { th: "สไลด์เทียบก่อน–หลัง", en: "Before / after slider", zh: "前后对比滑块", ja: "ビフォー・アフター" },
    tagline: {
      th: "เลื่อนเส้นแบ่งเพื่อเทียบงานออกแบบก่อนและหลังแก้",
      en: "Slide the divider to compare a design before and after the fix.",
      zh: "拖动分隔线，对比修改前后的设计。",
      ja: "仕切りを動かして、改善前と改善後のデザインを比べます。",
    },
    try: {
      th: "เลื่อนเมาส์ซ้าย–ขวา หรือลากเส้นตรงกลาง",
      en: "Move left and right, or drag the handle.",
      zh: "左右移动，或拖动中间的手柄。",
      ja: "左右に動かすか、中央のハンドルをドラッグ。",
    },
    why: {
      th: "การเทียบในตำแหน่งเดียวกันใช้การจดจำแทนการนึก (Recognition rather than recall) ตาเห็นความต่างทันทีโดยไม่ต้องจำภาพแรกไว้",
      en: "Comparing in the same spot relies on recognition rather than recall: your eyes catch the difference without remembering the first picture.",
    },
    use: {
      th: "โชว์งาน Redesign ในพอร์ต งานรีทัชรูป หรือเทียบแพ็กเกจ",
      en: "Redesigns in a portfolio, photo retouching, and plan comparisons.",
    },
    avoid: {
      th: "ภาพที่ขนาดหรือมุมไม่ตรงกัน เพราะจะมองไม่เห็นความต่าง",
      en: "Pictures that don’t line up in size or angle — the difference gets lost.",
    },
    related: ["usability", "drag-and-drop"],
    prompt: {
      build: "a before/after comparison slider",
      effect:
        "two images (or two UI mock-ups) of identical size stacked on top of each other; the “after” layer is clipped at the divider with clip-path, a round handle with arrows sits on the divider, and “Before” and “After” labels mark the corners.",
      trigger: "on desktop the divider follows the pointer horizontally; on touch screens you drag it; arrow keys move it in 5% steps.",
      feel: "the divider tracks the pointer instantly; the handle grows slightly while it’s being dragged.",
      purpose: "show the impact of a redesign at a glance — recognition rather than recall.",
      guardrails:
        "build the control on a native <input type=\"range\"> so it’s accessible; both images share exact dimensions; reserve space with aspect-ratio to avoid layout shift; labels keep enough contrast over both images; the divider never moves on its own, so it stays comfortable with prefers-reduced-motion.",
    },
  },
  {
    id: "kinetic-type",
    category: "micro",
    level: 2,
    tech: ["CSS", "JS"],
    name: "Kinetic type",
    localName: { th: "ตัวอักษรเคลื่อนไหว", en: "Kinetic type", zh: "动态文字", ja: "キネティック・タイポ" },
    tagline: {
      th: "ตัวอักษรหนาขึ้นเมื่อเมาส์เข้าใกล้ ด้วยพลังของ Variable font",
      en: "Letters grow bolder as your cursor comes close, thanks to a variable font.",
      zh: "光标靠近时字母会变粗，这就是可变字体的魔力。",
      ja: "カーソルが近づくと文字が太くなる。可変フォントの力です。",
    },
    try: {
      th: "ลากเมาส์ผ่านคำช้า ๆ จากซ้ายไปขวา",
      en: "Sweep slowly across the words, left to right.",
      zh: "从左到右，慢慢划过文字。",
      ja: "左から右へ、ゆっくり文字の上をなぞってみましょう。",
    },
    why: {
      th: "ความต่างของน้ำหนักและการเคลื่อนไหวเป็นสิ่งที่ตาเห็นก่อนสมองจะอ่าน (Pre-attentive attributes) จึงดึงความสนใจไปที่พาดหัวได้ในเสี้ยววินาที",
      en: "Weight contrast and motion are pre-attentive: our eyes notice them before we read, so they pull attention to a headline in a fraction of a second.",
    },
    use: {
      th: "พาดหัวหน้าแรก โปสเตอร์ดิจิทัล หรือชื่อแบรนด์",
      en: "Hero headlines, digital posters and brand names.",
    },
    avoid: {
      th: "เนื้อความยาว ๆ ปุ่ม หรือเมนู ที่ตัวอักษรขยับแล้วอ่านยากขึ้น",
      en: "Body copy, buttons or menus, where moving letters make reading harder.",
    },
    related: ["hover", "accessibility"],
    prompt: {
      build: "a kinetic headline using a variable font",
      effect:
        "split the headline into letters (grapheme clusters, so Thai vowels and tone marks stay attached); each letter’s font weight goes from 250 to 900 depending on how close the cursor is, and the closest letters lift slightly and take the accent colour.",
      trigger: "the pointer moves over the headline; when nobody is interacting, a gentle wave sweeps across once to invite people in.",
      feel: "weight follows distance with a smooth falloff (radius about 160 px), eased in requestAnimationFrame so letters breathe rather than jump.",
      purpose: "make the first headline people see feel alive and draw the eye.",
      guardrails:
        "keep the full text in a visually hidden span and mark the letters aria-hidden; keep each line on one line (white-space: nowrap) so changing weights never re-wraps the text; use Intl.Segmenter for graphemes; disable for prefers-reduced-motion.",
    },
  },
  {
    id: "text-scramble",
    category: "micro",
    level: 2,
    tech: ["JS"],
    name: "Text scramble",
    localName: { th: "ตัวอักษรถอดรหัส", en: "Text scramble", zh: "文字解码", ja: "テキストスクランブル" },
    tagline: {
      th: "ชี้เมนูแล้วตัวอักษรจะสลับไปมาเหมือนถอดรหัส ก่อนกลับเป็นคำเดิม",
      en: "Point at a menu item and its letters shuffle like a code being cracked.",
      zh: "指向菜单项，字母会像破解密码一样随机变换，再还原。",
      ja: "メニューを指すと、暗号を解くように文字が入れ替わり、元に戻ります。",
    },
    try: {
      th: "ชี้ หรือกด Tab ไปที่แต่ละเมนู",
      en: "Point at, or Tab to, each menu item.",
      zh: "用光标指向，或按 Tab 键移到每个菜单项。",
      ja: "各メニューを指すか、Tab キーで移動してみましょう。",
    },
    why: {
      th: "การเปลี่ยนแปลงที่คาดเดาไม่ได้ดึงความสนใจทันที (Novelty) และการเผยตัวอักษรจากซ้ายไปขวาตรงกับทิศทางการอ่าน จึงยังอ่านรู้เรื่อง",
      en: "Unpredictable change grabs attention (novelty), and resolving the letters left to right follows the reading direction, so it stays legible.",
    },
    use: {
      th: "เมนูของเว็บสายเทค เกม หรือพอร์ตโฟลิโอที่มีบุคลิกแบบแฮกเกอร์",
      en: "Menus on tech, gaming or portfolio sites with a hacker personality.",
    },
    avoid: {
      th: "ข้อความยาว ข้อความสำคัญ และต้องให้ Screen reader อ่านข้อความจริงเสมอ",
      en: "Long or critical text — and screen readers must always get the real text.",
    },
    related: ["hover", "focus-state", "accessibility"],
    prompt: {
      build: "a text scramble effect for navigation links",
      effect: "on hover, each letter of the link cycles through random characters and settles on the real letter, from left to right.",
      trigger: "hover and keyboard focus both start it; leaving midway finishes the reveal immediately.",
      feel: "about 30 ms per frame; each letter settles two or three frames after the one before; the whole word resolves in under 500 ms.",
      purpose: "give navigation a distinctive, techy personality while it stays readable.",
      guardrails:
        "the link’s accessible name is always the real text (the scrambled letters are aria-hidden); give each letter a fixed-width box so the layout never jitters; segment Thai by grapheme; no scramble for prefers-reduced-motion.",
    },
  },
  {
    id: "celebrate",
    category: "micro",
    level: 2,
    tech: ["Canvas", "JS"],
    name: "Celebration",
    localName: { th: "ฉลองให้พอดีกับโมเมนต์", en: "Celebration", zh: "恰到好处的庆祝", ja: "ちょうどいいお祝い" },
    tagline: {
      th: "กดใจได้การระเบิดเล็ก ๆ เรียนจบได้คอนเฟตตีเต็มจอ ความยินดีต้องพอดีกับความสำคัญ",
      en: "A like gets a tiny burst; finishing a course gets confetti. Delight should match the moment.",
      zh: "点赞得到小小的绽放，完成课程得到满屏彩带。惊喜要与时刻相称。",
      ja: "いいねには小さなはじけ、修了には紙吹雪。喜びは瞬間の大きさに合わせて。",
    },
    try: {
      th: "กดหัวใจหลาย ๆ ครั้ง แล้วกดปุ่มเรียนจบ",
      en: "Tap the heart a few times, then finish the course.",
      zh: "多点几下爱心，然后点击完成课程。",
      ja: "ハートを何度か押してから、修了ボタンを押してみましょう。",
    },
    why: {
      th: "กฎ Peak-end: คนจำประสบการณ์จากจุดพีคกับตอนจบ การฉลองตอนทำสำเร็จสร้างความทรงจำที่ดี แต่ถ้าฉลองทุกคลิก มันจะกลายเป็นเสียงรบกวน",
      en: "The peak-end rule: people remember the peak and the ending. Celebrating a finish creates a good memory — celebrating every click turns into noise.",
    },
    use: {
      th: "ระเบิดเล็ก: ไลก์ บันทึก ติ๊กงานเสร็จ · คอนเฟตตี: เรียนจบ จ่ายเงินครั้งแรก เป้าหมายใหญ่",
      en: "Small bursts: likes, saves, ticked tasks. Confetti: a finished course, a first payment, big milestones.",
    },
    avoid: {
      th: "คอนเฟตตีกับเรื่องเล็ก ๆ หรือในช่วงที่เครียด เช่น การชำระเงินที่ไม่สำเร็จ",
      en: "Confetti for small things, or near stressful moments like a failed payment.",
    },
    related: ["feedback", "success-state"],
    prompt: {
      build: "two celebration micro-interactions: a like button with a small burst and a “complete” button with confetti",
      effect:
        "Like: the heart pops (scale 0.8 → 1.2 → 1) and fills red, a ring expands and eight small dots burst outward, and the count goes up. Complete: about 120 confetti pieces (rectangles and circles in brand colours) shoot up from the button, fall with gravity and flutter, and the button turns into a success state.",
      trigger: "a click, Enter or Space on each button; the like toggles; the confetti fires on completion.",
      feel: "the like burst is over in under 400 ms; the confetti lasts about two seconds (gravity 0.25, air drag 0.98).",
      purpose: "match the size of the celebration to the importance of the moment (the peak-end rule).",
      guardrails:
        "draw the confetti on a single canvas that’s removed afterwards; pointer-events: none on the canvas; announce “Course complete” in an aria-live region; skip the particles for prefers-reduced-motion but keep the state change; aria-pressed on the like button.",
    },
  },
  {
    id: "tactile",
    category: "micro",
    level: 1,
    tech: ["CSS", "JS"],
    name: "Tactile controls",
    localName: { th: "ปุ่มที่กดแล้วรู้สึก", en: "Tactile controls", zh: "有触感的控件", ja: "手ざわりのある部品" },
    tagline: {
      th: "สวิตช์ที่ยืดตอนกด ปุ่มที่ยุบพร้อมระลอก และช่องติ๊กที่วาดเครื่องหมายถูกเอง",
      en: "A switch that stretches as you press it, a button that squishes with a ripple, a checkbox that draws its own tick.",
      zh: "按下时会拉伸的开关、带波纹回弹的按钮、会自己画出对勾的复选框。",
      ja: "押すと伸びるスイッチ、波紋とともにへこむボタン、自分でチェックを描くチェックボックス。",
    },
    try: {
      th: "กดค้างที่สวิตช์ แล้วลองปุ่มกับช่องติ๊ก",
      en: "Press and hold the switch, then try the button and the checkbox.",
      zh: "按住开关不放，再试试按钮和复选框。",
      ja: "スイッチを長押ししてから、ボタンとチェックボックスも試して。",
    },
    why: {
      th: "ไมโครอินเทอร์แอคชันคือ Feedback ชิ้นเล็กที่บอกว่า “ระบบได้ยินแล้ว” ทันทีที่แตะ ก่อนผลลัพธ์จริงจะมาถึง ความรู้สึกนี้ทำให้คนไว้ใจหน้าจอ",
      en: "Micro-interactions are tiny pieces of feedback that say “got it” the instant you touch, before the real result arrives — that’s what makes people trust an interface.",
    },
    use: {
      th: "หน้าตั้งค่า ฟอร์ม และปุ่มหลัก เป็นเอฟเฟกต์ที่แอปทุกตัวควรมี",
      en: "Settings, forms and primary buttons — the effects every app should have.",
    },
    avoid: {
      th: "แอนิเมชันที่ทำให้ช้าลง ผลลัพธ์ต้องเกิดทันที แอนิเมชันเป็นแค่ส่วนเสริม",
      en: "Animation that slows things down: the result must be instant, and motion only decorates it.",
    },
    related: ["toggle", "feedback", "active-state", "button"],
    prompt: {
      build: "three tactile form controls: a switch, a button and a checkbox",
      effect:
        "Switch: the knob stretches wider while pressed and slides across with a spring. Button: scales to 0.96 on press while a circular ripple spreads from the exact press point. Checkbox: the tick draws itself with a stroke-dashoffset animation.",
      trigger: "pointer down and the keyboard (Space or Enter) both show the pressed state; the change applies on release, like native controls.",
      feel: "the press responds within 50 ms; the release springs back in about 250 ms with a slight overshoot; the tick draws in 200 ms.",
      purpose: "confirm every touch instantly so the interface feels responsive and trustworthy.",
      guardrails:
        "build on native elements (a button with role=\"switch\" and aria-checked, a real checkbox input); visible focus rings; with prefers-reduced-motion the state still changes, just without movement; touch targets at least 44 px.",
    },
  },
  {
    id: "hover-styles",
    category: "micro",
    level: 1,
    tech: ["CSS"],
    name: "Hover styles",
    localName: { th: "4 สไตล์ Hover", en: "Hover styles", zh: "四种悬停样式", ja: "4 つのホバー" },
    tagline: {
      th: "4 วิธีบอกว่า “กดได้นะ” ด้วย CSS ล้วน: ยกขึ้น เติมสี ขีดเส้นใต้ ขยับลูกศร",
      en: "Four CSS-only ways to say “you can click this”: lift, fill, underline and nudge.",
      zh: "四种纯 CSS 的方式告诉用户“可以点”：浮起、填充、下划线、箭头移动。",
      ja: "CSS だけで「押せます」を伝える 4 つの方法：浮く、塗る、線を引く、矢印が動く。",
    },
    try: {
      th: "ชี้ทีละปุ่ม แล้วกดเลือกสไตล์ที่ชอบ",
      en: "Point at each one, then click your favourite.",
      zh: "逐个指向，再点选你最喜欢的一个。",
      ja: "ひとつずつ指してから、好きなものをクリック。",
    },
    why: {
      th: "Hover คือการ “ถามก่อนกด” ถ้าระบบตอบภายใน 100 มิลลิวินาทีว่ากดได้ เราจะมั่นใจขึ้น แต่ละสไตล์ให้อารมณ์ต่างกัน: ยกขึ้น = พรีเมียม เติมสี = ชัดเจน ขีดเส้นใต้ = ลิงก์ ลูกศร = ไปต่อ",
      en: "Hover is asking before clicking, and an answer within 100 ms builds confidence. Each style has its own tone: lift feels premium, fill feels decisive, underline says link, the arrow says go.",
    },
    use: {
      th: "ปุ่ม ลิงก์ และการ์ดบนเดสก์ท็อป เลือกหนึ่งสไตล์ต่อประเภทแล้วใช้ให้เหมือนกันทั้งเว็บ",
      en: "Buttons, links and cards on desktop — pick one style per element type and use it everywhere.",
    },
    avoid: {
      th: "ใช้ Hover เป็นทางเดียวที่บอกว่ากดได้ เพราะจอสัมผัสไม่มี Hover",
      en: "Using hover as the only sign that something is clickable — touch screens have no hover.",
    },
    related: ["hover", "button", "affordance"],
    prompt: {
      build: "four button hover styles",
      effect:
        "1) Lift: rises 2 px with a larger soft shadow. 2) Fill sweep: an accent background slides in from the left behind the text. 3) Underline grow: an underline grows out from the centre. 4) Nudge: a trailing arrow moves 4 px to the right.",
      trigger: "hover and keyboard focus (:hover and :focus-visible) both trigger the effect; pressing scales the button to 0.97.",
      feel: "150–200 ms ease-out on the way in, slightly slower on the way out.",
      purpose: "signal clearly and consistently that something is clickable, each style with its own tone.",
      guardrails:
        "CSS only (transitions on transform, opacity and background-position); text contrast stays at 4.5:1 in every state; don’t rely on hover alone — the resting state must already look clickable; keep focus rings visible; with prefers-reduced-motion keep the colour changes but drop the movement.",
    },
  },
];

export function getEffect(id: string): Effect | undefined {
  return effects.find((e) => e.id === id);
}

export function effectNeighbours(id: string): { prev?: Effect; next?: Effect } {
  const i = effects.findIndex((e) => e.id === id);
  return { prev: effects[i - 1], next: effects[i + 1] };
}
