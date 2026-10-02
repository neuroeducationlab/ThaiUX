import type { Locale } from "./config";

/**
 * A value written in several languages.
 * Thai and English are required; Chinese and Japanese fall back to
 * English until a translation exists, so new content can ship in
 * TH/EN first without breaking the other locales.
 */
export type Localized<T = string> = {
  th: T;
  en: T;
  zh?: T;
  ja?: T;
};

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en;
}

/** True when a value has a real translation (not an English fallback). */
export function isTranslated<T>(value: Localized<T>, locale: Locale): boolean {
  return value[locale] !== undefined;
}

/** Replace `{name}` placeholders in a UI string. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
