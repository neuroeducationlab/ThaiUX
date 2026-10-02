import type { Localized } from "@/i18n/localized";

/** Copy for the design-system page. Token values are read from globals.css. */
export const ds = {
  eyebrow: { th: "Design system", en: "Design system", zh: "设计系统", ja: "デザインシステム" },
  title: {
    th: "ระบบเดียวกับที่บทเรียนสอน",
    en: "The same system the lessons teach",
    zh: "与课程所教一致的设计系统",
    ja: "レッスンで教えているのと同じシステム",
  },
  lead: {
    th: "Token สี ตัวอักษร ระยะห่าง และคอมโพเนนต์ ที่อยู่เบื้องหลังทุกหน้า ค่าทั้งหมดในหน้านี้อ่านมาจากโค้ดจริงตอน build จึงไม่มีวันไม่ตรงกัน",
    en: "The colour, type, spacing and component tokens behind every page. Every value here is read from the real stylesheet at build time, so the documentation can’t drift from the product.",
    zh: "每个页面背后的颜色、字体、间距和组件令牌。这里的所有数值都在构建时从真实的样式表中读取，因此文档永远不会与产品脱节。",
    ja: "すべてのページを支える色、文字、余白、コンポーネントのトークン。ここにある値はすべてビルド時に実際のスタイルシートから読み込むので、ドキュメントと実装がずれることはありません。",
  },
  nav: {
    colour: { th: "สี", en: "Colour", zh: "颜色", ja: "色" },
    type: { th: "ตัวอักษร", en: "Typography", zh: "字体", ja: "タイポグラフィ" },
    space: { th: "ระยะห่างและรูปทรง", en: "Space & shape", zh: "间距与形状", ja: "余白と形" },
    motion: { th: "การเคลื่อนไหว", en: "Motion", zh: "动效", ja: "モーション" },
    components: { th: "คอมโพเนนต์", en: "Components", zh: "组件", ja: "コンポーネント" },
    a11y: { th: "การเข้าถึง", en: "Accessibility", zh: "无障碍", ja: "アクセシビリティ" },
  },
  colour: {
    intro: {
      th: "สีกลางโทนกระดาษ กับสีหลักหนึ่งสีคือ “คราม” ทุกคู่สีตัวอักษรกับพื้นหลังผ่านเกณฑ์ WCAG 2.2 ทั้งโหมดสว่างและมืด อัตราส่วนด้านล่างคำนวณสด ๆ จากค่าจริง",
      en: "Paper-like neutrals and a single accent — Kram, a Thai indigo. Every text pair passes WCAG 2.2 in both light and dark mode; the ratios below are computed live from the real values.",
      zh: "纸张般的中性色，加上一种强调色——Kram（泰国靛蓝）。所有文字配色在浅色和深色模式下都通过 WCAG 2.2；下方的对比度根据真实数值实时计算。",
      ja: "紙のようなニュートラルカラーと、ひとつのアクセント「クラーム（タイの藍）」。すべての文字色の組み合わせがライト・ダーク両モードで WCAG 2.2 を満たします。下の比率は実際の値から計算しています。",
    },
    token: { th: "Token", en: "Token", zh: "令牌", ja: "トークン" },
    light: { th: "สว่าง", en: "Light", zh: "浅色", ja: "ライト" },
    dark: { th: "มืด", en: "Dark", zh: "深色", ja: "ダーク" },
    use: { th: "ใช้สำหรับ", en: "Used for", zh: "用途", ja: "用途" },
    on: { th: "บน", en: "on", zh: "于", ja: "背景" },
    decorative: { th: "ตกแต่งเท่านั้น", en: "decorative only", zh: "仅用于装饰", ja: "装飾のみ" },
    roles: {
      ink: { th: "ข้อความหลัก", en: "Body text", zh: "正文", ja: "本文" },
      "ink-2": { th: "ข้อความรอง", en: "Secondary text", zh: "次要文字", ja: "補足テキスト" },
      "ink-3": { th: "ไอคอนตกแต่ง สถานะปิดใช้งาน", en: "Decorative icons, disabled", zh: "装饰图标、禁用状态", ja: "装飾アイコン、無効状態" },
      accent: { th: "ปุ่มหลัก องค์ประกอบที่โต้ตอบได้", en: "Primary buttons, interactive UI", zh: "主要按钮、可交互元素", ja: "メインボタン、操作できる要素" },
      "on-accent": { th: "ตัวอักษรบนปุ่มหลัก", en: "Text on primary buttons", zh: "主要按钮上的文字", ja: "メインボタン上の文字" },
      "accent-ink": { th: "ลิงก์ ป้ายกำกับสีหลัก", en: "Links, accent labels", zh: "链接、强调标签", ja: "リンク、アクセントラベル" },
      success: { th: "สำเร็จ ยืนยัน", en: "Success, confirmation", zh: "成功、确认", ja: "成功、確認" },
      error: { th: "ข้อผิดพลาด", en: "Errors", zh: "错误", ja: "エラー" },
      warning: { th: "คำเตือน", en: "Warnings", zh: "警告", ja: "警告" },
      focus: { th: "วงแหวนโฟกัส (ไม่ใช่ตัวอักษร ≥ 3:1)", en: "Focus ring (non-text, ≥ 3:1)", zh: "焦点环（非文字，≥ 3:1）", ja: "フォーカスリング（非テキスト、3:1 以上）" },
      "line-input": { th: "ขอบช่องกรอก (ไม่ใช่ตัวอักษร ≥ 3:1)", en: "Input borders (non-text, ≥ 3:1)", zh: "输入框边框（非文字，≥ 3:1）", ja: "入力欄の枠線（非テキスト、3:1 以上）" },
    } as Record<string, Localized>,
  },
  type: {
    intro: {
      th: "Inter สำหรับตัวอักษรละติน Noto Sans Thai สำหรับภาษาไทย และ Instrument Serif สำหรับศัพท์และจังหวะเน้น ภาษาจีนและญี่ปุ่นใช้ฟอนต์คุณภาพสูงของระบบ เพื่อไม่ต้องดาวน์โหลดไฟล์หลายเมกะไบต์ หัวข้อภาษาไทยมีระยะบรรทัดที่กว้างขึ้นเพื่อรองรับวรรณยุกต์",
      en: "Inter for Latin, Noto Sans Thai for Thai, and Instrument Serif for headwords and accents. Chinese and Japanese use high-quality system fonts to avoid multi-megabyte downloads. Thai headings get extra line height for tone marks.",
      zh: "拉丁文使用 Inter，泰文使用 Noto Sans Thai，术语和强调使用 Instrument Serif。中文和日文使用高质量的系统字体，避免下载数 MB 的字体文件。泰文标题增加了行高，为声调符号留出空间。",
      ja: "ラテン文字には Inter、タイ語には Noto Sans Thai、見出し語とアクセントには Instrument Serif。中国語と日本語は、数 MB のダウンロードを避けるため高品質なシステムフォントを使います。タイ語の見出しは声調記号のために行間を広げています。",
    },
    sample: {
      th: "ออกแบบเพื่อคน Design for people",
      en: "Design for people ออกแบบเพื่อคน",
      zh: "为人而设计 Design for people",
      ja: "人のためのデザイン Design for people",
    },
  },
  space: {
    intro: {
      th: "ระยะห่างใช้สเกลฐาน 4 px มุมโค้งมีห้าขนาด ยิ่งองค์ประกอบใหญ่ มุมยิ่งโค้งมาก และใช้เงาแบบนุ่มนวลเพื่อบอกระดับชั้น ไม่ใช่เพื่อตกแต่ง",
      en: "Spacing follows a 4 px base scale. There are five corner radii — larger elements get rounder corners — and soft shadows that signal elevation, never decoration.",
      zh: "间距采用 4 px 基础刻度。圆角有五种尺寸——元素越大，圆角越大；柔和的阴影用来表示层级，而不是装饰。",
      ja: "余白は 4 px を基準にしたスケール。角丸は 5 段階で、大きな要素ほど丸くなります。やわらかな影は装飾ではなく、高さを示すために使います。",
    },
    spacing: { th: "ระยะห่าง", en: "Spacing", zh: "间距", ja: "余白" },
    radius: { th: "มุมโค้ง", en: "Corner radius", zh: "圆角", ja: "角丸" },
    shadow: { th: "เงา", en: "Elevation", zh: "阴影层级", ja: "影" },
  },
  motion: {
    intro: {
      th: "การเคลื่อนไหวมีหน้าที่อธิบาย ไม่ใช่ตกแต่ง ใช้เวลาสั้น 150–360 มิลลิวินาที และจะถูกปิดทั้งหมดเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว",
      en: "Motion explains; it never decorates. Durations stay short (150–360 ms), and everything stops when someone asks their device to reduce motion.",
      zh: "动效用于解释，而不是装饰。时长保持简短（150–360 毫秒），当用户在设备上开启“减少动态效果”时，一切都会停止。",
      ja: "モーションは説明のためにあり、装飾ではありません。時間は短く（150〜360 ms）、端末で「視差効果を減らす」が設定されていればすべて止まります。",
    },
    replay: { th: "เล่นอีกครั้ง", en: "Replay", zh: "重新播放", ja: "もう一度再生" },
  },
  components: {
    intro: {
      th: "ทุกคอมโพเนนต์ออกแบบครบทุกสถานะ ใช้คีย์บอร์ดได้ และใช้ HTML ที่ถูกความหมาย ลองกด ลองใช้ Tab ได้เลย",
      en: "Every component has all its states designed, works with a keyboard and uses semantic HTML. Go ahead — click and Tab through them.",
      zh: "每个组件都设计了完整的状态，支持键盘操作，并使用语义化 HTML。来试试点击和 Tab 键吧。",
      ja: "どのコンポーネントもすべての状態がデザインされ、キーボードで操作でき、意味のある HTML を使っています。クリックや Tab で試してみてください。",
    },
    buttons: { th: "ปุ่ม", en: "Buttons", zh: "按钮", ja: "ボタン" },
    controls: { th: "ตัวควบคุม", en: "Controls", zh: "控件", ja: "コントロール" },
    feedback: { th: "Feedback และสถานะ", en: "Feedback & status", zh: "反馈与状态", ja: "フィードバックと状態" },
  },
  a11y: {
    items: [
      { th: "Contrast ของตัวอักษรอย่างน้อย 4.5 : 1 และองค์ประกอบ UI อย่างน้อย 3 : 1", en: "Text contrast of at least 4.5 : 1; UI components and focus rings at least 3 : 1", zh: "文字对比度至少 4.5 : 1；界面组件和焦点环至少 3 : 1", ja: "文字のコントラスト 4.5 : 1 以上、UI 部品とフォーカスリングは 3 : 1 以上" },
      { th: "เป้าการแตะสูงอย่างน้อย 44 px สำหรับการกระทำหลัก", en: "Touch targets at least 44 px tall for primary actions", zh: "主要操作的触控目标高度至少 44 px", ja: "主要な操作のタッチターゲットは高さ 44 px 以上" },
      { th: "วงแหวนโฟกัสที่มองเห็นชัดบนทุกองค์ประกอบที่โต้ตอบได้", en: "A clearly visible focus ring on every interactive element", zh: "每个可交互元素都有清晰可见的焦点环", ja: "操作できるすべての要素に、はっきり見えるフォーカスリング" },
      { th: "รองรับการตั้งค่าลดการเคลื่อนไหวและโหมดคอนทราสต์สูงของระบบ", en: "Respects reduced-motion and forced-colours (high contrast) settings", zh: "遵循“减少动态效果”和强制颜色（高对比度）设置", ja: "「視差効果を減らす」と強制カラー（ハイコントラスト）設定に対応" },
      { th: "ใช้ HTML ที่ถูกความหมาย ลำดับหัวข้อถูกต้อง และมีป้ายกำกับทุกช่องกรอก", en: "Semantic HTML, a correct heading order and a label for every field", zh: "语义化 HTML、正确的标题层级，每个输入框都有标签", ja: "意味のある HTML、正しい見出し階層、すべての入力欄にラベル" },
      { th: "สีไม่เคยเป็นสัญญาณเดียว ใช้ไอคอนและข้อความประกอบเสมอ", en: "Colour is never the only signal — icons and text always back it up", zh: "颜色从来不是唯一的提示——总有图标和文字辅助", ja: "色だけで情報を伝えない。必ずアイコンや文字を添えます" },
    ] as Localized[],
  },
};
