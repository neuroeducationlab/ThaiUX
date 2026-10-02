import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocale, locales } from "@/i18n/config";

/**
 * Social share image per language. The PNGs are pre-rendered with real
 * Thai/CJK fonts by scripts/generate-og.mjs (Satori can't shape Thai well).
 */
export const alt = "UXLab — Learn UX by experiencing it";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const file = path.join(process.cwd(), "public/og", `${isLocale(locale) ? locale : "en"}.png`);
  return new Response(new Uint8Array(await readFile(file)), { headers: { "Content-Type": contentType } });
}
