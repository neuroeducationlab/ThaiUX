export const locales = ["th", "en", "zh", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";

/** Cookie set by the language switcher so `/` remembers the choice. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

type LocaleMeta = {
  /** Native name shown in the language switcher. */
  label: string;
  /** English name, used for screen readers and docs. */
  english: string;
  /** Value for <html lang>. */
  htmlLang: string;
  /** hreflang value for alternates. */
  hreflang: string;
  /** Open Graph locale. */
  og: string;
  /** Short code shown in compact UI. */
  short: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  th: { label: "ไทย", english: "Thai", htmlLang: "th", hreflang: "th", og: "th_TH", short: "TH" },
  en: { label: "English", english: "English", htmlLang: "en-GB", hreflang: "en", og: "en_GB", short: "EN" },
  zh: { label: "简体中文", english: "Chinese (Simplified)", htmlLang: "zh-Hans", hreflang: "zh-Hans", og: "zh_CN", short: "中文" },
  ja: { label: "日本語", english: "Japanese", htmlLang: "ja", hreflang: "ja", og: "ja_JP", short: "日本語" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Pick the best supported locale from an Accept-Language header.
 * Any Chinese variant maps to Simplified Chinese (the only Chinese we ship).
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale | null {
  if (!acceptLanguage) return null;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
