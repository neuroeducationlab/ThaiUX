"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { ariaCurrent, navItems } from "./nav";

/**
 * Mobile navigation: a persistent bottom tab bar instead of a hamburger.
 * Five top-level destinations, always visible, in the thumb zone —
 * people always know where they are and where they can go.
 * (See docs/process/07-decisions.md, UXDR-04.)
 */
export function MobileTabBar() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <nav
      aria-label={dict.a11y.mobileNav}
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[var(--header-bg)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1">
        {navItems.filter((item) => item.mobile).map((item) => {
          const current = ariaCurrent(pathname, item.key, locale);
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <Link
                href={item.href(locale)}
                aria-current={current}
                className={cn(
                  "flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] text-[0.6875rem] font-medium transition-colors duration-200",
                  current ? "text-accent-ink" : "text-ink-2 active:bg-surface-2",
                )}
              >
                <Icon className="size-[1.375rem]" aria-hidden strokeWidth={current ? 2.25 : 1.75} />
                <span className="leading-tight">{dict.nav[item.key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
