import { BookA, BookOpen, FlaskConical, House, Info, type LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

export type NavKey = "home" | "learn" | "glossary" | "lab" | "about";

export const navItems: { key: NavKey; href: (l: Locale) => string; icon: LucideIcon }[] = [
  { key: "home", href: routes.home, icon: House },
  { key: "learn", href: routes.learn, icon: BookOpen },
  { key: "glossary", href: routes.glossary, icon: BookA },
  { key: "lab", href: routes.lab, icon: FlaskConical },
  { key: "about", href: routes.about, icon: Info },
];

/** Which top-level section a pathname belongs to. */
export function sectionOf(pathname: string): NavKey {
  const seg = pathname.split("/")[2] ?? "";
  if (seg === "learn") return "learn";
  if (seg === "glossary") return "glossary";
  if (seg === "lab") return "lab";
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
