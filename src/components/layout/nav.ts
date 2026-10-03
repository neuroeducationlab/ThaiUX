import { BookA, BookOpen, FlaskConical, House, Info, Sparkles, type LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

export type NavKey = "home" | "learn" | "glossary" | "lab" | "effects" | "about";

/**
 * `mobile: false` keeps a destination out of the five-tab bar on phones
 * (it stays in the header on larger screens and in the footer everywhere).
 */
export const navItems: { key: NavKey; href: (l: Locale) => string; icon: LucideIcon; mobile: boolean }[] = [
  { key: "home", href: routes.home, icon: House, mobile: true },
  { key: "learn", href: routes.learn, icon: BookOpen, mobile: true },
  { key: "glossary", href: routes.glossary, icon: BookA, mobile: true },
  { key: "lab", href: routes.lab, icon: FlaskConical, mobile: true },
  { key: "effects", href: routes.effects, icon: Sparkles, mobile: true },
  { key: "about", href: routes.about, icon: Info, mobile: false },
];

/** Which top-level section a pathname belongs to. */
export function sectionOf(pathname: string): NavKey {
  const seg = pathname.split("/")[2] ?? "";
  if (seg === "learn") return "learn";
  if (seg === "glossary") return "glossary";
  if (seg === "lab") return "lab";
  if (seg === "effects") return "effects";
  if (seg === "about" || seg === "design-system") return "about";
  return "home";
}

/** aria-current: "page" on the section root itself, "true" anywhere inside it. */
export function ariaCurrent(pathname: string, key: NavKey, locale: Locale): "page" | "true" | undefined {
  const href = navItems.find((n) => n.key === key)!.href(locale);
  if (pathname === href || pathname === `${href}/`) return "page";
  if (key !== "home" && sectionOf(pathname) === key) return "true";
  return undefined;
}
