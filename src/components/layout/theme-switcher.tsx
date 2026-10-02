"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { SegmentedControl } from "@/components/ui/controls";
import { THEME_KEY as KEY } from "./theme-script";

type Theme = "light" | "dark" | "system";
const listeners = new Set<() => void>();

function read(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

function apply(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  listeners.forEach((l) => l());
}

export function ThemeSwitcher() {
  const { dict } = useI18n();
  const theme = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "system" as Theme,
  );

  return (
    <SegmentedControl<Theme>
      label={dict.theme.label}
      size="sm"
      value={theme}
      onChange={apply}
      options={[
        { value: "light", label: <span className="flex items-center gap-1.5"><Sun className="size-3.5" aria-hidden />{dict.theme.light}</span> },
        { value: "dark", label: <span className="flex items-center gap-1.5"><Moon className="size-3.5" aria-hidden />{dict.theme.dark}</span> },
        { value: "system", label: <span className="flex items-center gap-1.5"><Monitor className="size-3.5" aria-hidden />{dict.theme.system}</span> },
      ]}
    />
  );
}
