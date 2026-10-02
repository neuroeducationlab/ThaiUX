/**
 * Renders one 1200×630 share image per language into public/og/.
 * Run after changing the copy:  node scripts/generate-og.mjs
 * (Needs network access for Google Fonts; images are committed.)
 */
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const template = "file://" + path.join(root, "scripts/og-template.html");
const out = path.join(root, "public/og");
fs.mkdirSync(out, { recursive: true });

const copy = {
  th: {
    title: "เรียน UX/UI ผ่านการลอง<br/>ไม่ใช่แค่อ่าน",
    label: "ปุ่มนี้คือบทเรียน",
    button: "กดฉันสิ",
    said: "คุณเพิ่งได้สัมผัส “Focus”",
    meta: ["<b>22</b> แนวคิด", "<b>8</b> บทเรียน", "<b>4</b> การทดลอง", "ไทย · EN · 中文 · 日本語"],
  },
  en: {
    title: "Learn UX by <i>experiencing</i> it.",
    label: "This button is a lesson",
    button: "Press me",
    said: "You just experienced “Focus”.",
    meta: ["<b>22</b> concepts", "<b>8</b> modules", "<b>4</b> experiments", "ไทย · EN · 中文 · 日本語"],
    noSerif: true,
  },
  zh: {
    title: "亲手体验 UX/UI，<br/>而不只是阅读。",
    label: "这个按钮就是一堂课",
    button: "按我试试",
    said: "你刚刚体验了“Focus”。",
    meta: ["<b>22</b> 个概念", "<b>8</b> 个单元", "<b>4</b> 个实验", "ไทย · EN · 中文 · 日本語"],
  },
  ja: {
    title: "読むだけじゃない。<br/>体験して学ぶ UX/UI。",
    label: "このボタンが教材です",
    button: "押してみて",
    said: "いま「Focus」を体験しました。",
    meta: ["<b>22</b> の概念", "<b>8</b> モジュール", "<b>4</b> つの実験", "ไทย · EN · 中文 · 日本語"],
  },
};

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(template, { waitUntil: "networkidle" });
for (const [locale, c] of Object.entries(copy)) {
  await page.evaluate(
    ({ locale, c }) => {
      document.body.className = locale;
      document.documentElement.lang = locale;
      document.getElementById("title").innerHTML = c.title;
      document.getElementById("serif").style.display = c.noSerif ? "none" : "";
      document.getElementById("label").textContent = c.label;
      document.getElementById("btn").textContent = c.button;
      document.getElementById("said").textContent = c.said;
      document.getElementById("meta").innerHTML = c.meta.map((m) => `<span class="chip">${m}</span>`).join("");
    },
    { locale, c },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${locale}.png`) });
  console.log(`public/og/${locale}.png`);
}
await browser.close();
