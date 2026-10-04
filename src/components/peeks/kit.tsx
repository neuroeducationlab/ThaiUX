"use client";

import { Component, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Small shared pieces for the card-sized demos (“peeks”) in the glossary.
 * A peek is a three-second taste of a concept; the concept page holds the
 * full demo and the explanation.
 */

/** A/B version picker sized for a card: a radio group styled as segments. */
export function MiniTabs<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: React.ReactNode }[];
  label: string;
  className?: string;
}) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex shrink-0 rounded-full border border-line bg-surface p-0.5", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <label
            key={o.value}
            className={cn(
              "flex h-6 cursor-pointer items-center rounded-full px-2.5 text-[0.75rem] font-semibold whitespace-nowrap transition-colors duration-200",
              active ? "bg-ink text-bg" : "text-ink-2 hover:text-ink",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-focus",
            )}
          >
            <input type="radio" name={name} value={o.value} checked={active} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

/** A monospace “state: hover” readout that names what is happening. */
export function Readout({ label, value, active, className }: { label: string; value: string; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.75rem] text-ink-2",
        className,
      )}
    >
      {label}:<span className={cn("font-semibold", active ? "text-accent-ink" : "text-ink")}>{value}</span>
    </span>
  );
}

/** setTimeout that is cleared when the demo unmounts (the peek closes). */
export function useTimers() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  return (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

/** Shown for the moment a peek’s code is still downloading. */
export function PeekSkeleton() {
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-2.5 px-4">
      <span className="h-3 w-1/2 animate-pulse rounded-full bg-line-strong" />
      <span className="h-9 w-full animate-pulse rounded-[var(--radius-sm)] bg-line" />
      <span className="h-9 w-4/5 animate-pulse rounded-[var(--radius-sm)] bg-line" />
    </div>
  );
}

/** If a peek’s code fails to load (offline, a deploy in between), show a note instead of breaking the page. */
export class PeekBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
