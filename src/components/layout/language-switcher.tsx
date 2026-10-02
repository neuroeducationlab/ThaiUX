"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember-locale";
import { format } from "@/i18n/localized";
import { switchLocalePath } from "@/lib/routes";
import { cn } from "@/lib/cn";

/**
 * Disclosure pattern (button + list of links), not an ARIA menu:
 * changing language is navigation, so real links are the honest element.
 */
export function LanguageSwitcher({ placement = "down" }: { placement?: "down" | "up" }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const remember = (l: Locale) => {
    rememberLocale(l);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        title={format(dict.a11y.currentLanguage, { language: localeMeta[locale].label })}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-2 transition-colors duration-200",
          "hover:bg-surface-2 hover:text-ink aria-expanded:bg-surface-2 aria-expanded:text-ink",
        )}
      >
        <Globe className="size-[1.125rem]" aria-hidden strokeWidth={2} />
        <span className="sr-only">{dict.a11y.changeLanguage}: </span>
        <span lang={localeMeta[locale].htmlLang}>{localeMeta[locale].short}</span>
      </button>

      <div
        id={listId}
        hidden={!open}
        className={cn(
          "animate-pop absolute right-0 z-50 w-56 origin-top-right rounded-[var(--radius-md)] border border-line bg-surface p-1.5 shadow-lg",
          placement === "down" ? "top-12" : "bottom-12",
        )}
      >
        <ul>
          {locales.map((l) => {
            const current = l === locale;
            return (
              <li key={l}>
                <Link
                  href={switchLocalePath(pathname, l)}
                  hrefLang={localeMeta[l].hreflang}
                  lang={localeMeta[l].htmlLang}
                  aria-current={current ? "true" : undefined}
                  onClick={() => remember(l)}
                  className={cn(
                    "flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 text-[0.9375rem] transition-colors",
                    current ? "font-semibold text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <span className="flex flex-col leading-tight">
                    <span>{localeMeta[l].label}</span>
                    <span className="text-[0.75rem] font-normal text-ink-2" lang="en">
                      {localeMeta[l].english}
                    </span>
                  </span>
                  {current ? <Check className="size-4 text-accent" aria-hidden strokeWidth={2.5} /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
