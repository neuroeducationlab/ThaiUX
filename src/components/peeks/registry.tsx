"use client";

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { DemoId } from "@/content/types";

/**
 * One card-sized demo (“peek”) per glossary demo, played inside the
 * glossary card on hover or with its Try button. Each is code-split; the
 * card starts downloading it the moment the pointer arrives, so it is
 * usually ready before the mist clears.
 */
const loaders: Record<DemoId, () => Promise<{ default: ComponentType }>> = {
  hover: () => import("./hover"),
  click: () => import("./click"),
  "drag-and-drop": () => import("./drag-and-drop"),
  scroll: () => import("./scroll"),
  swipe: () => import("./swipe"),
  toggle: () => import("./toggle"),
  button: () => import("./button"),
  dropdown: () => import("./dropdown"),
  modal: () => import("./modal"),
  tooltip: () => import("./tooltip"),
  "input-field": () => import("./input-field"),
  affordance: () => import("./affordance"),
  feedback: () => import("./feedback"),
  usability: () => import("./usability"),
  accessibility: () => import("./accessibility"),
  "default-state": () => import("./default-state"),
  "active-state": () => import("./active-state"),
  "focus-state": () => import("./focus-state"),
  "disabled-state": () => import("./disabled-state"),
  "loading-state": () => import("./loading-state"),
  "error-state": () => import("./error-state"),
  "success-state": () => import("./success-state"),
};

export const peeks = {} as Record<DemoId, LazyExoticComponent<ComponentType>>;
for (const id of Object.keys(loaders) as DemoId[]) peeks[id] = lazy(loaders[id]);

/** Start downloading a peek before it is shown. Safe to call repeatedly. */
export function preloadPeek(id: DemoId) {
  loaders[id]().catch(() => {
    /* offline — the card falls back to its skeleton, then the link still works */
  });
}
