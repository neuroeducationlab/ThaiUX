"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { Container, Kbd } from "@/components/ui/layout";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { ariaCurrent, navItems } from "./nav";
import { openSearch } from "@/components/search/events";

export function SiteHeader() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-xl backdrop-saturate-150">
      <Container size="wide" className="flex h-16 items-center justify-between gap-3">
        <Logo href={`/${locale}`} label={dict.a11y.homeLink} />

        <nav aria-label={dict.a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems
              .filter((n) => n.key !== "home")
              .map((item) => {
                const current = ariaCurrent(pathname, item.key, locale);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href(locale)}
                      aria-current={current}
                      className={cn(
                        "inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200",
                        current ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2/70 hover:text-ink",
                      )}
                    >
                      {dict.nav[item.key]}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            aria-label={dict.search.label}
            aria-keyshortcuts="Control+K Meta+K /"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full text-ink-2 transition-colors duration-200 hover:text-ink",
              "w-10 justify-center hover:bg-surface-2 lg:w-auto lg:justify-start lg:border lg:border-line lg:bg-surface lg:pr-2 lg:pl-3.5 lg:hover:border-line-strong lg:hover:bg-surface",
            )}
          >
            <Search className="size-[1.125rem]" aria-hidden strokeWidth={2} />
            <span className="hidden text-sm lg:inline">{dict.search.button}</span>
            <span className="ml-6 hidden items-center gap-0.5 lg:flex" aria-hidden>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  );
}
