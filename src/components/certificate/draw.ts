import type { Locale } from "@/i18n/config";

/**
 * The certificate, drawn on a canvas so it downloads as a crisp image in
 * any language. It uses the page’s own web fonts (Inter, Noto Sans Thai,
 * Instrument Serif) and the system’s Chinese and Japanese fonts. The paper
 * is always light, whatever the site theme.
 */
export const CERT_W = 2000;
export const CERT_H = 1414; // A4 landscape (√2)

export type CertArt = {
  locale: Locale;
  kicker: string;
  title: string;
  presented: string;
  name: string;
  /** No name typed yet: draw the placeholder in grey. */
  placeholder: boolean;
  completed: string;
  modules: string[];
  date: string;
  issuer: string;
  tagline: string;
  site: string;
  /** Watermark for a preview that isn’t unlocked yet. */
  sample?: string;
};

export type CertFonts = { sans: string; serif: string };

const CJK: Record<"zh" | "ja", string> = {
  zh: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Noto Sans CJK SC", "Source Han Sans SC"',
  ja: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", Meiryo, "Noto Sans JP", "Noto Sans CJK JP"',
};

/** The font stacks next/font registered on <html>, plus CJK system fonts for this language. */
export function certFonts(locale: Locale): CertFonts {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const cjk = locale === "ja" ? `${CJK.ja}, ${CJK.zh}` : `${CJK.zh}, ${CJK.ja}`;
  return {
    sans: [v("--font-inter"), v("--font-thai"), cjk, "system-ui", "sans-serif"].filter(Boolean).join(", "),
    serif: [v("--font-serif-display"), '"Iowan Old Style"', '"Times New Roman"', "serif"].filter(Boolean).join(", "),
  };
}

/** Make sure every face the drawing needs is downloaded (fonts load lazily, on first use). */
export async function loadCertFonts(f: CertFonts, text: string) {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.allSettled([
    document.fonts.load(`400 40px ${f.sans}`, text),
    document.fonts.load(`600 40px ${f.sans}`, text),
    document.fonts.load(`700 40px ${f.sans}`, text),
    document.fonts.load(`400 40px ${f.serif}`, text),
    document.fonts.load(`italic 400 40px ${f.serif}`, text),
  ]);
}

const LATIN_NAME = /^[\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+$/u;

export function drawCertificate(canvas: HTMLCanvasElement, a: CertArt, f: CertFonts) {
  if (canvas.width !== CERT_W) canvas.width = CERT_W;
  if (canvas.height !== CERT_H) canvas.height = CERT_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = CERT_W;
  const H = CERT_H;
  const cx = W / 2;

  // Paper, with a faint wash of the accent behind the name
  ctx.fillStyle = "#fbf8f1";
  ctx.fillRect(0, 0, W, H);
  const wash = ctx.createRadialGradient(cx, H * 0.45, 40, cx, H * 0.45, W * 0.6);
  wash.addColorStop(0, "rgba(51, 67, 196, 0.07)");
  wash.addColorStop(1, "rgba(51, 67, 196, 0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  // Two frames: accent outside, gold inside, with gold diamonds at the corners
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#3343c4";
  ctx.lineWidth = 8;
  rounded(ctx, 56, 56, W - 112, H - 112, 24);
  ctx.stroke();
  ctx.strokeStyle = "#b8862b";
  ctx.lineWidth = 2.5;
  rounded(ctx, 88, 88, W - 176, H - 176, 12);
  ctx.stroke();
  for (const [x, y] of [
    [88, 88],
    [W - 88, 88],
    [88, H - 88],
    [W - 88, H - 88],
  ]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#b8862b";
    ctx.fillRect(-11, -11, 22, 22);
    ctx.fillStyle = "#fbf8f1";
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  }

  ctx.textBaseline = "alphabetic";

  // Brand (top left) and address (top right)
  ctx.textAlign = "left";
  ctx.fillStyle = "#1a1a1e";
  ctx.font = `700 46px ${f.sans}`;
  ctx.fillText("UXLab", 168, 214);
  ctx.fillStyle = "#5c5c66";
  ctx.font = `400 26px ${f.sans}`;
  ctx.fillText(a.tagline, 168, 254);
  ctx.textAlign = "right";
  ctx.fillStyle = "#6e6e78";
  ctx.font = `400 24px ${f.sans}`;
  ctx.fillText(a.site, W - 168, 214);

  // Kicker, title, “this certifies that”
  ctx.textAlign = "center";
  ctx.fillStyle = "#2b379f";
  ctx.font = `600 30px ${f.sans}`;
  spaced(ctx, a.kicker.toUpperCase(), cx, 380, 7);
  ctx.fillStyle = "#1a1a1e";
  fitFont(ctx, a.title, cx, 510, 1500, (px) => (a.locale === "en" ? `400 ${px}px ${f.serif}` : `700 ${px}px ${f.sans}`), a.locale === "en" ? 116 : 104, 56);
  ctx.fillStyle = "#5c5c66";
  ctx.font = `400 36px ${f.sans}`;
  ctx.fillText(a.presented, cx, 612);

  // The name: serif italic for Latin names, the sans for Thai, Chinese and Japanese
  ctx.fillStyle = a.placeholder ? "#a2a2ab" : "#1f2a8a";
  const latin = LATIN_NAME.test(a.name);
  fitFont(ctx, a.name, cx, 780, 1400, (px) => (latin ? `italic 400 ${px}px ${f.serif}` : `600 ${Math.round(px * 0.8)}px ${f.sans}`), 138, 56);
  ctx.strokeStyle = "#b8862b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 560, 822);
  ctx.lineTo(cx + 560, 822);
  ctx.stroke();

  // What they completed, then the eight modules
  ctx.fillStyle = "#33333b";
  ctx.font = `400 38px ${f.sans}`;
  const done = wrap(ctx, a.completed, 1360, a.locale).slice(0, 2);
  done.forEach((line, i) => ctx.fillText(line, cx, 898 + i * 56));
  ctx.fillStyle = "#5c5c66";
  ctx.font = `400 25px ${f.sans}`;
  const list = rows(ctx, a.modules.map((m, i) => `${i + 1} ${m}`), "   ·   ", 1420).slice(0, 2);
  const top = 898 + done.length * 56 + 30;
  list.forEach((line, i) => ctx.fillText(line, cx, top + i * 38));

  // Date (left), seal (centre), issuer (right)
  const base = 1262;
  ctx.strokeStyle = "rgba(26, 26, 30, 0.22)";
  ctx.lineWidth = 2;
  for (const x of [480, W - 480]) {
    ctx.beginPath();
    ctx.moveTo(x - 230, base - 46);
    ctx.lineTo(x + 230, base - 46);
    ctx.stroke();
  }
  ctx.fillStyle = "#33333b";
  ctx.font = `500 29px ${f.sans}`;
  fitFont(ctx, a.date, 480, base, 460, (px) => `500 ${px}px ${f.sans}`, 29, 18);
  fitFont(ctx, a.issuer, W - 480, base, 460, (px) => `500 ${px}px ${f.sans}`, 29, 18);
  seal(ctx, cx, base - 52, f);

  if (a.sample) {
    ctx.save();
    ctx.translate(cx, H / 2);
    ctx.rotate(-0.3);
    ctx.fillStyle = "rgba(190, 50, 41, 0.12)";
    fitFont(ctx, a.sample.toUpperCase(), 0, 90, 1500, (px) => `800 ${px}px ${f.sans}`, 300, 120);
    ctx.restore();
  }
}

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Letter-spaced text where the browser supports it (plain text elsewhere). */
function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, px: number) {
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  const can = "letterSpacing" in c;
  if (can) c.letterSpacing = `${px}px`;
  // letter spacing adds a gap after the last letter too: nudge so it stays centred
  ctx.fillText(text, can ? x + px / 2 : x, y);
  if (can) c.letterSpacing = "0px";
}

/** Draw one line, shrinking the font until it fits; very long text is cut with an ellipsis. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, font: (px: number) => string, start: number, min: number) {
  let px = start;
  ctx.font = font(px);
  while (px > min && ctx.measureText(text).width > max) {
    px -= 2;
    ctx.font = font(px);
  }
  let t = text;
  if (ctx.measureText(t).width > max) {
    const chars = [...t];
    while (chars.length > 1 && ctx.measureText(chars.join("") + "…").width > max) chars.pop();
    t = chars.join("") + "…";
  }
  ctx.fillText(t, x, y);
}

/** Break text into lines that fit, on word boundaries — Intl.Segmenter knows where Thai, Chinese and Japanese words end. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, locale: Locale): string[] {
  const parts =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? Array.from(new Intl.Segmenter(locale, { granularity: "word" }).segment(text), (s) => s.segment)
      : text.split(/(\s+)/);
  const lines: string[] = [];
  let line = "";
  for (const part of parts) {
    const next = line + part;
    if (line.trim() && ctx.measureText(next).width > max) {
      lines.push(line.trim());
      line = part.trimStart();
    } else {
      line = next;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/** Lay whole items out in rows (never breaking inside one), joined by a separator. */
function rows(ctx: CanvasRenderingContext2D, items: string[], sep: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const item of items) {
    const next = line ? line + sep + item : item;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = item;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** A round seal with two ribbon tails. */
function seal(ctx: CanvasRenderingContext2D, x: number, y: number, f: CertFonts) {
  ctx.fillStyle = "#2b379f";
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + dir * 22, y + 40);
    ctx.lineTo(x + dir * 68, y + 40);
    ctx.lineTo(x + dir * 80, y + 112);
    ctx.lineTo(x + dir * 58, y + 98);
    ctx.lineTo(x + dir * 40, y + 116);
    ctx.closePath();
    ctx.fill();
  }
  // a scalloped gold rim
  ctx.fillStyle = "#b8862b";
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * Math.PI * 2;
    const r = i % 2 ? 90 : 96;
    ctx.lineTo(x + Math.cos(t) * r, y + Math.sin(t) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3343c4";
  ctx.beginPath();
  ctx.arc(x, y, 82, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 70, 0, Math.PI * 2);
  ctx.stroke();
  // a small star, the name, and “completed”
  ctx.fillStyle = "#ffc95c";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const t = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 6 : 14;
    ctx.lineTo(x + Math.cos(t) * r, y - 34 + Math.sin(t) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `700 34px ${f.sans}`;
  ctx.fillText("UXLab", x, y + 12);
  ctx.font = `600 15px ${f.sans}`;
  spaced(ctx, "COMPLETED", x, y + 40, 3);
}
