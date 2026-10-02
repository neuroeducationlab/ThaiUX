"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
 * Switch — APG switch pattern (role="switch", aria-checked).
 * Takes effect immediately; never inside a form that needs "Save".
 * ---------------------------------------------------------------- */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <span className="flex flex-col">
        <span id={`${id}-label`} className="font-medium text-ink">
          {label}
        </span>
        {description ? (
          <span id={`${id}-desc`} className="type-caption">
            {description}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border transition-colors duration-200",
          checked ? "border-transparent bg-success" : "border-line-input bg-surface-3",
          "disabled:opacity-50",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out-soft",
            checked ? "translate-x-[1.375rem]" : "translate-x-[0.1875rem]",
          )}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * SegmentedControl — a radio group styled as Apple-like segments.
 * Arrow keys move the selection (native radio behaviour).
 * ---------------------------------------------------------------- */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  disabled = false,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: React.ReactNode }[];
  label: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}) {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cn("inline-flex rounded-full border border-line bg-surface-2 p-1", disabled && "opacity-50", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <label
            key={o.value}
            className={cn(
              "relative rounded-full font-medium transition-colors duration-200",
              size === "sm" ? "px-3 py-1.5 text-[0.8125rem]" : "px-4 py-2 text-sm",
              active ? "bg-surface text-ink shadow-sm" : "text-ink-2",
              disabled ? "cursor-not-allowed" : cn("cursor-pointer", !active && "hover:text-ink"),
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-focus",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={active}
              disabled={disabled}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Tabs — APG tabs pattern with automatic activation and roving tabindex.
 * ---------------------------------------------------------------- */
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  label,
  idBase,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  tabs: { value: T; label: React.ReactNode }[];
  label: string;
  idBase: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = tabs.findIndex((t) => t.value === value);

  const focusTab = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex gap-1 overflow-x-auto rounded-full border border-line bg-surface-2 p-1 rail", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); focusTab(index + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); focusTab(index - 1); }
        if (e.key === "Home") { e.preventDefault(); focusTab(0); }
        if (e.key === "End") { e.preventDefault(); focusTab(tabs.length - 1); }
      }}
    >
      {tabs.map((t, i) => {
        const selected = t.value === value;
        return (
          <button
            key={t.value}
            ref={(el) => { refs.current[i] = el; }}
            id={`${idBase}-tab-${t.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
              selected ? "bg-surface text-ink shadow-sm" : "text-ink-2 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
 * ProgressBar — determinate progress with a text alternative.
 * ---------------------------------------------------------------- */
export function ProgressBar({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out-soft"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
