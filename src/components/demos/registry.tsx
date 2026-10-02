"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DemoId } from "@/content/types";
import { DemoFrame } from "./demo-frame";

/**
 * One interactive demo per glossary concept. Each is code-split, so a
 * concept page only downloads the demo it shows. To add a concept, add a
 * demo here (or reuse an existing one) and reference its id in the content.
 */
const demos: Record<DemoId, ComponentType> = {
  hover: dynamic(() => import("./hover-demo")),
  click: dynamic(() => import("./click-demo")),
  "drag-and-drop": dynamic(() => import("./drag-drop-demo")),
  scroll: dynamic(() => import("./scroll-demo")),
  swipe: dynamic(() => import("./swipe-demo")),
  toggle: dynamic(() => import("./toggle-demo")),
  button: dynamic(() => import("./button-demo")),
  dropdown: dynamic(() => import("./dropdown-demo")),
  modal: dynamic(() => import("./modal-demo")),
  tooltip: dynamic(() => import("./tooltip-demo")),
  "input-field": dynamic(() => import("./input-field-demo")),
  affordance: dynamic(() => import("./affordance-demo")),
  feedback: dynamic(() => import("./feedback-demo")),
  usability: dynamic(() => import("./usability-demo")),
  accessibility: dynamic(() => import("./accessibility-demo")),
  "default-state": dynamic(() => import("./default-state-demo")),
  "active-state": dynamic(() => import("./active-state-demo")),
  "focus-state": dynamic(() => import("./focus-state-demo")),
  "disabled-state": dynamic(() => import("./disabled-state-demo")),
  "loading-state": dynamic(() => import("./loading-state-demo")),
  "error-state": dynamic(() => import("./error-state-demo")),
  "success-state": dynamic(() => import("./success-state-demo")),
};

export function ConceptDemo({
  demo,
  conceptId,
  term,
  instruction,
  label,
  className,
}: {
  demo: DemoId;
  conceptId?: string;
  term: string;
  instruction: string;
  label?: string;
  className?: string;
}) {
  const Demo = demos[demo];
  return (
    <DemoFrame conceptId={conceptId} term={term} instruction={instruction} label={label} className={className}>
      <Demo />
    </DemoFrame>
  );
}
