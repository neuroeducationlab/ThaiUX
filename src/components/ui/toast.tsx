"use client";

import { useSyncExternalStore } from "react";
import { Check, Info } from "lucide-react";

/**
 * Tiny toast system for confirming actions (Feedback principle).
 * Messages are announced politely to screen readers and disappear
 * on their own — they confirm, they never ask for a decision.
 */
type Toast = { id: number; message: string; tone: "success" | "info" };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, message, tone }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3200);
}

const EMPTY: Toast[] = [];

function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
}

export function Toaster() {
  const items = useToasts();

  // The live region stays mounted (even when empty) so screen readers
  // register it before the first message arrives.
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg shadow-lg"
        >
          {t.tone === "success" ? (
            <Check className="size-4 text-bg" aria-hidden strokeWidth={2.5} />
          ) : (
            <Info className="size-4 text-bg" aria-hidden />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
