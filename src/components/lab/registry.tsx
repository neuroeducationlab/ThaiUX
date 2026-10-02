"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/** Each experiment is code-split: a Lab page downloads only its own. */
const labs: Record<string, ComponentType> = {
  "ux-detective": dynamic(() => import("./ux-detective").then((m) => m.UxDetective)),
  "make-it-better": dynamic(() => import("./make-it-better").then((m) => m.MakeItBetter)),
  "which-would-you-choose": dynamic(() => import("./which-would-you-choose").then((m) => m.WhichWouldYouChoose)),
  "build-a-button": dynamic(() => import("./build-a-button").then((m) => m.BuildAButton)),
};

export function LabExperiment({ id }: { id: string }) {
  const Experiment = labs[id];
  return Experiment ? <Experiment /> : null;
}
