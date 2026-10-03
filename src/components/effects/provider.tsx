"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { useReducedMotion } from "./engine";

export type Stack = "react" | "html";

/* ------------------------------------------------------------------
 * Two small preferences, kept on this device:
 *  - stack: which tech the prompts are written for (localStorage)
 *  - motion: an explicit choice that overrides the device’s
 *    reduced-motion setting for this visit (sessionStorage)
 * ---------------------------------------------------------------- */
const STACK_KEY = "thaiux:effects:stack";
const MOTION_KEY = "thaiux:effects:motion";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}
function write(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    /* storage blocked — the choice just won't be remembered */
  }
  emit();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type PlaygroundValue = {
  /** Effects may move. */
  motion: boolean;
  /** The device asks for reduced motion. */
  reduced: boolean;
  setMotion: (on: boolean) => void;
  stack: Stack;
  setStack: (s: Stack) => void;
};

const PlaygroundContext = createContext<PlaygroundValue>({
  motion: true,
  reduced: false,
  setMotion: () => {},
  stack: "react",
  setStack: () => {},
});

export const usePlayground = () => useContext(PlaygroundContext);

export function PlaygroundProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const choice = useSyncExternalStore(subscribe, () => read("session", MOTION_KEY), () => null);
  const stackValue = useSyncExternalStore(subscribe, () => read("local", STACK_KEY), () => null);
  const motion = choice === null ? !reduced : choice === "on";
  const stack: Stack = stackValue === "html" ? "html" : "react";

  return (
    <PlaygroundContext.Provider
      value={{
        motion,
        reduced,
        setMotion: (on) => write("session", MOTION_KEY, on ? "on" : "off"),
        stack,
        setStack: (s) => write("local", STACK_KEY, s),
      }}
    >
      {/* data-motion="on" lifts the global reduced-motion clamp inside (see globals.css) */}
      <div data-motion={motion ? "on" : "off"} className={className}>
        {children}
      </div>
    </PlaygroundContext.Provider>
  );
}
