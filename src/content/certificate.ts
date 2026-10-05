import type { Localized } from "@/i18n/localized";

/**
 * The certificate (UXDR-32): finish all eight modules and the site draws a
 * certificate in your name, on this device. No accounts, nothing sent
 * anywhere — so it is a personal record, and the page says so plainly.
 */
export const certificate = {
  title: { th: "เกียรติบัตร", en: "Certificate", zh: "结业证书", ja: "修了証" },
  subtitle: {
    th: "เรียนครบทั้ง 8 บท แล้ว UXLab จะออกเกียรติบัตรในชื่อคุณให้ สร้างบนอุปกรณ์นี้ ดาวน์โหลดได้ทันที",
    en: "Finish all eight modules and UXLab makes you a certificate in your name — right here on this device, ready to download.",
    zh: "学完全部 8 个单元，UXLab 就会为你生成一张写有你名字的证书——就在这台设备上生成，可以直接下载。",
    ja: "8 つのモジュールをすべて終えると、UXLab があなたの名前入りの修了証をこの端末で作成します。すぐにダウンロードできます。",
  },
  lockedTitle: {
    th: "เกียรติบัตรของคุณรออยู่",
    en: "Your certificate is waiting",
    zh: "你的证书在等你",
    ja: "修了証があなたを待っています",
  },
  lockedBody: {
    th: "เรียนให้ครบ {total} บทเพื่อปลดล็อก ตอนนี้เรียนไปแล้ว {done} บท",
    en: "Complete all {total} modules to unlock it. You’ve finished {done} so far.",
    zh: "完成全部 {total} 个单元即可解锁。你已经完成了 {done} 个。",
    ja: "全 {total} モジュールを終えると受け取れます。いまは {done} 個が完了。",
  },
  continue: { th: "เรียนต่อบทที่ {n}", en: "Continue with Module {n}", zh: "继续第 {n} 单元", ja: "モジュール {n} へ進む" },
  unlockedTitle: {
    th: "ยินดีด้วย! คุณเรียนครบทั้ง {total} บทแล้ว",
    en: "Congratulations — you’ve finished all {total} modules!",
    zh: "恭喜！你已完成全部 {total} 个单元",
    ja: "おめでとうございます！全 {total} モジュールを修了しました",
  },
  unlockedBody: {
    th: "พิมพ์ชื่อที่อยากให้แสดงบนเกียรติบัตร แล้วดาวน์โหลดได้เลย",
    en: "Type your name the way you’d like it to appear, then download your certificate.",
    zh: "输入你希望显示在证书上的名字，然后下载。",
    ja: "修了証に載せたい名前を入力して、ダウンロードしましょう。",
  },
  nameLabel: { th: "ชื่อบนเกียรติบัตร", en: "Name on the certificate", zh: "证书上的名字", ja: "修了証に載せる名前" },
  nameHint: {
    th: "เก็บไว้บนอุปกรณ์นี้เท่านั้น ไม่มีการส่งไปที่ไหน",
    en: "Kept on this device only. Nothing is sent anywhere.",
    zh: "只保存在这台设备上，不会发送到任何地方。",
    ja: "この端末にだけ保存され、どこにも送信されません。",
  },
  nameHintLocked: {
    th: "ลองพิมพ์ชื่อ เพื่อดูว่าเกียรติบัตรของคุณจะออกมาเป็นแบบไหน",
    en: "Try typing your name to see how your certificate will look.",
    zh: "输入你的名字，预览证书的样子。",
    ja: "名前を入力すると、仕上がりをプレビューできます。",
  },
  download: { th: "ดาวน์โหลดรูป (PNG)", en: "Download image (PNG)", zh: "下载图片（PNG）", ja: "画像をダウンロード（PNG）" },
  print: { th: "พิมพ์ หรือบันทึกเป็น PDF", en: "Print or save as PDF", zh: "打印或保存为 PDF", ja: "印刷 / PDF で保存" },
  share: { th: "แชร์", en: "Share", zh: "分享", ja: "共有" },
  downloaded: { th: "บันทึกเกียรติบัตรแล้ว", en: "Certificate saved", zh: "证书已保存", ja: "修了証を保存しました" },
  previewLabel: { th: "ตัวอย่างเกียรติบัตร", en: "Certificate preview", zh: "证书预览", ja: "修了証のプレビュー" },
  sampleNote: {
    th: "นี่คือตัวอย่าง จะดาวน์โหลดได้เมื่อเรียนครบทุกบท",
    en: "This is a preview — you can download it once every module is done.",
    zh: "这是预览——学完所有单元后即可下载。",
    ja: "これはプレビューです。すべてのモジュールを終えるとダウンロードできます。",
  },
  honest: {
    th: "เกียรติบัตรนี้บันทึกว่าคุณเรียนจบหลักสูตรของ UXLab บนอุปกรณ์นี้ ไม่ใช่วุฒิการศึกษาที่สถาบันรับรอง",
    en: "This certificate records that you completed UXLab’s course on this device. It isn’t an accredited qualification.",
    zh: "这张证书记录你在这台设备上完成了 UXLab 的课程，并非经认证的学历或资格证书。",
    ja: "この修了証は、この端末で UXLab のコースを修了したことを記録するものです。公的な資格ではありません。",
  },
  modulesTitle: { th: "บทเรียนของคุณ", en: "Your modules", zh: "你的单元", ja: "あなたのモジュール" },
  /** Nudges on the module page and the Learn hub. */
  remaining: {
    th: "อีก {n} บท รับเกียรติบัตร",
    en: "{n} more to your certificate",
    zh: "再学 {n} 个单元就能获得证书",
    ja: "あと {n} モジュールで修了証",
  },
  ready: {
    th: "เรียนครบแล้ว! รับเกียรติบัตรของคุณ",
    en: "All done — get your certificate",
    zh: "全部完成——领取你的证书",
    ja: "全部完了！修了証を受け取る",
  },
  learnHub: {
    th: "เรียนครบ 8 บท รับเกียรติบัตรในชื่อคุณ",
    en: "Finish all 8 modules for a certificate in your name",
    zh: "学完 8 个单元，获得写有你名字的证书",
    ja: "8 モジュールを終えて、名前入りの修了証を",
  },

  /** Text drawn on the certificate itself. */
  art: {
    kicker: { th: "Certificate of Completion", en: "UX/UI Foundations", zh: "Certificate of Completion", ja: "Certificate of Completion" },
    title: { th: "เกียรติบัตร", en: "Certificate of Completion", zh: "结业证书", ja: "修了証" },
    presented: { th: "มอบให้ไว้เพื่อแสดงว่า", en: "This certifies that", zh: "兹证明", ja: "以下の者は" },
    name: { th: "ชื่อของคุณ", en: "Your Name", zh: "你的名字", ja: "あなたの名前" },
    completed: {
      th: "ได้เรียนจบหลักสูตร UX/UI พื้นฐานของ UXLab ครบทั้ง 8 บท",
      en: "has completed all eight modules of UXLab’s UX/UI foundations course",
      zh: "已完成 UXLab UX/UI 基础课程的全部 8 个单元",
      ja: "UXLab の UX/UI 基礎コース全 8 モジュールを修了したことを証します",
    },
    date: { th: "ให้ไว้ ณ วันที่ {date}", en: "Awarded {date}", zh: "颁发日期：{date}", ja: "{date} 授与" },
    issuer: { th: "ออกโดย UXLab", en: "Issued by UXLab", zh: "UXLab 颁发", ja: "UXLab 発行" },
    tagline: { th: "เรียน UX/UI ผ่านการลอง", en: "Learn UX by experiencing it", zh: "亲手体验 UX/UI", ja: "体験して学ぶ UX/UI" },
    sample: { th: "ตัวอย่าง", en: "Sample", zh: "示例", ja: "見本" },
    download: { th: "ดาวน์โหลด", en: "Download", zh: "下载", ja: "ダウンロード" },
    saved: { th: "บันทึกแล้ว", en: "Saved", zh: "已保存", ja: "保存済み" },
  },
} satisfies Record<string, Localized | Record<string, Localized>>;
