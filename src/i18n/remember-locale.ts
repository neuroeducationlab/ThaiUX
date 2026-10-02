import { LOCALE_COOKIE, type Locale } from "./config";

/** Remember an explicit language choice for a year (read by proxy.ts). */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
