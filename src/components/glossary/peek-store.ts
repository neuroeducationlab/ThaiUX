"use client";

import { useSyncExternalStore } from "react";

/**
 * Which glossary card is showing its live mini demo (“peek”), if any.
 * Only one peek is open at a time: opening another closes the first, so
 * the page never runs more than one demo.
 *   - "hover": opened by a resting mouse; closes when the pointer leaves.
 *   - "pin":   opened with the Try button (touch, keyboard or click);
 *              closes with ×, Esc, or a tap/focus outside the card.
 */
export type PeekVia = "hover" | "pin";
export type OpenPeek = { id: string; via: PeekVia } | null;

let current: OpenPeek = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const peekStore = {
  open(id: string, via: PeekVia) {
    if (current?.id === id && current.via === via) return;
    current = { id, via };
    emit();
  },
  close(id: string) {
    if (current?.id !== id) return;
    current = null;
    emit();
  },
  get: () => current,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useOpenPeek(): OpenPeek {
  return useSyncExternalStore(peekStore.subscribe, peekStore.get, () => null);
}

/* A wheel scroll slides cards under a still pointer; that isn’t intent. */
let lastScroll = 0;
let watching = false;

export function msSinceScroll(): number {
  if (!watching && typeof window !== "undefined") {
    watching = true;
    window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true, capture: true });
  }
  return performance.now() - lastScroll;
}
