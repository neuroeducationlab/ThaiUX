import type { LearningModule } from "../types";
import { whatIsUx } from "./01-what-is-ux";
import { understandingUsers } from "./02-understanding-users";
import { informationArchitecture } from "./03-information-architecture";
import { interfaceDesign } from "./04-interface-design";
import { interactionDesign } from "./05-interaction-design";
import { prototyping } from "./06-prototyping";
import { usabilityTesting } from "./07-usability-testing";
import { accessibleDesign } from "./08-accessible-design";

/** The learning path, in the order learners should take it. */
export const modules: LearningModule[] = [
  whatIsUx,
  understandingUsers,
  informationArchitecture,
  interfaceDesign,
  interactionDesign,
  prototyping,
  usabilityTesting,
  accessibleDesign,
];

export function getModule(id: string): LearningModule | undefined {
  return modules.find((m) => m.id === id);
}

export function moduleNeighbours(id: string) {
  const i = modules.findIndex((m) => m.id === id);
  return { prev: modules[i - 1], next: modules[i + 1] };
}

/** Modules that teach a given glossary concept. */
export function modulesForConcept(conceptId: string): LearningModule[] {
  return modules.filter((m) => m.concepts.includes(conceptId));
}
