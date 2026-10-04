import type { Localized } from "@/i18n/localized";
import type { SourceId } from "./sources";

export type Category = "interaction" | "component" | "principle" | "state";

/** 1 = beginner, 2 = intermediate, 3 = advanced */
export type Difficulty = 1 | 2 | 3;

/** Keys of the interactive demos in src/components/demos/registry.tsx */
export type DemoId =
  | "hover"
  | "click"
  | "drag-and-drop"
  | "scroll"
  | "swipe"
  | "toggle"
  | "button"
  | "dropdown"
  | "modal"
  | "tooltip"
  | "input-field"
  | "affordance"
  | "feedback"
  | "usability"
  | "accessibility"
  | "default-state"
  | "active-state"
  | "focus-state"
  | "disabled-state"
  | "loading-state"
  | "error-state"
  | "success-state";

/** Keys of the module examples in src/components/examples/registry.tsx */
export type ExampleId =
  | "five-planes"
  | "pain-points"
  | "card-sort"
  | "visual-hierarchy"
  | "microinteraction"
  | "fidelity"
  | "test-iterate"
  | "contrast-checker";

/**
 * One glossary concept.
 * Written to be understood in about a minute (term → short → demo → takeaway),
 * with optional depth below (problem → how → in practice → mistake).
 */
export interface Concept {
  /** URL slug, also the stable id used by progress and related links. */
  id: string;
  /** The English term — shown as the headword in every locale. */
  term: string;
  /** UK pronunciation in IPA. */
  ipa?: string;
  /** What people call it locally (or alternative English names in `en`). */
  localTerm: Localized;
  /** First item is the primary category. */
  categories: Category[];
  difficulty: Difficulty;
  /** One plain-language sentence. */
  short: Localized;
  /** What the user should do in the demo. */
  instruction: Localized;
  /** A few words on what to try in the card-sized demo on the glossary page. */
  peek: Localized;
  demo: DemoId;
  /** The real-world problem this concept exists to solve. */
  problem: Localized;
  /** How it works: decision → interaction → result. Short paragraphs. */
  how: Localized<string[]>;
  /** Places learners already meet it. */
  inPractice: Localized<string[]>;
  mistake: Localized;
  /** One memorable principle. */
  takeaway: Localized;
  related: string[];
  sources: SourceId[];
  /** Extra search terms (transliterations, synonyms). */
  aliases?: string[];
}

export interface ModuleTopic {
  title: Localized;
  body: Localized;
}

/** One learning module in the Learning Hub. */
export interface LearningModule {
  id: string;
  number: number;
  title: Localized;
  /** One-line promise of the module. */
  summary: Localized;
  minutes: number;
  /** Opening scenario — teach through a problem first. */
  scenario: Localized;
  what: Localized<string[]>;
  why: Localized<string[]>;
  topics: ModuleTopic[];
  example: { id: ExampleId; caption: Localized };
  takeaway: Localized;
  reflect: Localized;
  concepts: string[];
  lab: string[];
  sources: SourceId[];
}

export interface LabExperimentMeta {
  id: string;
  letter: "A" | "B" | "C" | "D";
  title: Localized;
  question: Localized;
  summary: Localized;
  minutes: number;
  skills: Localized<string[]>;
  concepts: string[];
}
