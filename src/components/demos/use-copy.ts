"use client";

import { useI18n } from "@/i18n/client";
import type { Locale } from "@/i18n/config";

/**
 * Demos keep their own microcopy next to their code (one file = one demo).
 * `copy.en` defines the shape; other locales fall back to English per key.
 */
export type DemoCopy<T extends Record<string, unknown>> = { en: T } & Partial<Record<Exclude<Locale, "en">, Partial<T>>>;

export function useCopy<T extends Record<string, unknown>>(copy: DemoCopy<T>): T {
  const { locale } = useI18n();
  return { ...copy.en, ...(locale === "en" ? {} : copy[locale]) } as T;
}
