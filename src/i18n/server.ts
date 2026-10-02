import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import th from "./dictionaries/th";
import zh from "./dictionaries/zh";
import ja from "./dictionaries/ja";

const dictionaries: Record<Locale, Dictionary> = { th, en, zh, ja };

/** Current locale from the `[locale]` root segment (Server Components only). */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!isLocale(value)) notFound();
  return value;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Locale + dictionary in one call for pages and server components. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}
