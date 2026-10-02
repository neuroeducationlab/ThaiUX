import type { Category, Concept } from "../types";
import { interactionConcepts } from "./interaction";
import { componentConcepts } from "./component";
import { principleConcepts } from "./principle";
import { stateConcepts } from "./state";

/**
 * The glossary. To add a concept:
 *   1. add an object to the right category file (the type checker lists every field),
 *   2. add a demo to src/components/demos/registry.tsx (or reuse one),
 *   3. run `npm run check:content` — it verifies ids, related links and sources.
 */
export const categoryOrder: Category[] = ["interaction", "component", "principle", "state"];

export const glossary: Concept[] = [
  ...interactionConcepts,
  ...componentConcepts,
  ...principleConcepts,
  ...stateConcepts,
];

const byId = new Map(glossary.map((c) => [c.id, c]));

export function getConcept(id: string): Concept | undefined {
  return byId.get(id);
}

export function conceptsIn(category: Category): Concept[] {
  return glossary.filter((c) => c.categories.includes(category));
}

/** Previous/next in reading order, for "continue learning" navigation. */
export function neighbours(id: string): { prev?: Concept; next?: Concept } {
  const i = glossary.findIndex((c) => c.id === id);
  return { prev: glossary[i - 1], next: glossary[i + 1] };
}
