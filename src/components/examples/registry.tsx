"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ExampleId } from "@/content/types";
import { DemoFrame } from "@/components/demos/demo-frame";

/** Interactive examples for the learning modules (code-split like the demos). */
const examples: Record<ExampleId, ComponentType> = {
  "five-planes": dynamic(() => import("./five-planes-example")),
  "pain-points": dynamic(() => import("./pain-points-example")),
  "card-sort": dynamic(() => import("./card-sort-example")),
  "visual-hierarchy": dynamic(() => import("./visual-hierarchy-example")),
  microinteraction: dynamic(() => import("./microinteraction-example")),
  fidelity: dynamic(() => import("./fidelity-example")),
  "test-iterate": dynamic(() => import("./test-iterate-example")),
  "contrast-checker": dynamic(() => import("./contrast-checker-example")),
};

export function ModuleExample({ id, title, caption, label }: { id: ExampleId; title: string; caption: string; label: string }) {
  const Example = examples[id];
  return (
    <DemoFrame term={title} instruction={caption} label={label}>
      <Example />
    </DemoFrame>
  );
}
