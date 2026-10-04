"use client";

import { useSyncExternalStore } from "react";

/**
 * Learning progress, stored only in this browser (localStorage).
 * No accounts and no server: the brief asks for lightweight Progress/Save,
 * and keeping data on-device is the most privacy-friendly default.
 */
export type ProgressState = {
  experienced: string[]; // concept ids whose demo was completed
  completed: string[]; // module ids marked complete
  labs: string[]; // lab experiment ids finished
  saved: string[]; // bookmarked concept ids
  effects: string[]; // playground effects tried
};

const KEY = "thaiux:progress:v1";
const EMPTY: ProgressState = { experienced: [], completed: [], labs: [], saved: [], effects: [] };

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      state = {
        experienced: parsed.experienced ?? [],
        completed: parsed.completed ?? [],
        labs: parsed.labs ?? [],
        saved: parsed.saved ?? [],
        effects: parsed.effects ?? [],
      };
    }
  } catch {
    state = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be full or blocked — progress just won't persist */
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

function update(fn: (s: ProgressState) => ProgressState) {
  load();
  const next = fn(state);
  if (next === state) return; // nothing changed: skip the write and the re-render
  state = next;
  persist();
  emit();
}

const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);
const remove = (list: string[], id: string) => list.filter((x) => x !== id);

export const progress = {
  markExperienced: (id: string) => update((s) => (s.experienced.includes(id) ? s : { ...s, experienced: add(s.experienced, id) })),
  setCompleted: (id: string, done: boolean) =>
    update((s) => ({ ...s, completed: done ? add(s.completed, id) : remove(s.completed, id) })),
  markLab: (id: string) => update((s) => (s.labs.includes(id) ? s : { ...s, labs: add(s.labs, id) })),
  markEffect: (id: string) => update((s) => (s.effects.includes(id) ? s : { ...s, effects: add(s.effects, id) })),
  toggleSaved: (id: string) => {
    let nowSaved = false;
    update((s) => {
      nowSaved = !s.saved.includes(id);
      return { ...s, saved: nowSaved ? add(s.saved, id) : remove(s.saved, id) };
    });
    return nowSaved;
  },
  reset: () => update(() => EMPTY),
};

/** Subscribe a component to progress. Returns the empty state during SSR. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True after hydration — use to avoid showing "0 of 22" before storage is read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
