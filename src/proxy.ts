import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, matchLocale } from "@/i18n/config";

/**
 * Every page lives under a locale prefix (/th, /en, /zh, /ja).
 * Requests without one are redirected to:
 *   1. the language the visitor chose before (cookie), else
 *   2. the best match from the browser's Accept-Language, else
 *   3. English when the browser asks for a language we don't have
 *      (a Korean visitor can read English more easily than Thai), else
 *   4. Thai — the primary audience (e.g. crawlers with no preference).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const accept = request.headers.get("accept-language");
  const locale = isLocale(cookie) ? cookie : (matchLocale(accept) ?? (accept ? "en" : defaultLocale));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (icons, sitemap.xml…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
