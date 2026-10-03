import type { PromptParts } from "@/content/effects";
import type { Stack } from "./provider";

export const stackLabels: Record<Stack, string> = {
  react: "React + Tailwind",
  html: "HTML + CSS + JS",
};

const stackLines: Record<Stack, string> = {
  react: "in React (TypeScript) with Tailwind CSS, as one self-contained component with no extra animation library",
  html: "as a single HTML file with plain CSS and JavaScript (no libraries, no build step)",
};

export const PROMPT_KEYS = ["Effect", "Trigger", "Feel", "Purpose", "Guardrails"] as const;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function promptIntro(build: string, stack: Stack) {
  return `Create ${build.trim() || "an interactive effect"} ${stackLines[stack]}.`;
}

export function promptLines(p: Omit<PromptParts, "build">): [string, string][] {
  return [
    ["Effect", p.effect],
    ["Trigger", p.trigger],
    ["Feel", p.feel],
    ["Purpose", p.purpose],
    ["Guardrails", p.guardrails],
  ];
}

/** The plain-text prompt that gets copied. */
export function buildPrompt(p: PromptParts, stack: Stack): string {
  const lines = promptLines(p)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${cap(v.trim())}`);
  return [promptIntro(p.build, stack), "", ...lines].join("\n");
}
