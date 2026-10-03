import { expect, test } from "@playwright/test";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
import { experiments } from "@/content/lab";
import { effectCategories, effects } from "@/content/effects";
import { sources } from "@/content/sources";
import type { Localized } from "@/i18n/localized";

/**
 * Content integrity — runs without a browser or server:
 *   npm run check:content
 * Catches broken cross-links, unknown sources and empty translations
 * before they reach a page.
 */
const conceptIds = new Set(glossary.map((c) => c.id));
const moduleIds = new Set(modules.map((m) => m.id));
const labIds = new Set(experiments.map((e) => e.id));
const sourceIds = new Set(Object.keys(sources));

/** Every required (th/en) string must be non-empty; zh/ja may fall back. */
function emptyFields(value: unknown, path: string, out: string[] = []): string[] {
  if (value && typeof value === "object" && "th" in value && "en" in value) {
    const v = value as Localized<unknown>;
    for (const lang of ["th", "en", "zh", "ja"] as const) {
      const x = v[lang];
      if (x === undefined) continue;
      if (typeof x === "string" && !x.trim()) out.push(`${path}.${lang}`);
      if (Array.isArray(x) && x.some((s) => typeof s === "string" && !s.trim())) out.push(`${path}.${lang}[]`);
    }
    return out;
  }
  if (Array.isArray(value)) value.forEach((v, i) => emptyFields(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) emptyFields(v, `${path}.${k}`, out);
  return out;
}

test.describe("content integrity", () => {
  test("ids are unique and URL-safe", () => {
    for (const ids of [glossary.map((c) => c.id), modules.map((m) => m.id), experiments.map((e) => e.id), effects.map((e) => e.id)]) {
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  test("glossary cross-links resolve", () => {
    for (const c of glossary) {
      for (const r of c.related) expect(conceptIds.has(r), `${c.id} → related "${r}"`).toBe(true);
      expect(c.related, `${c.id} links to itself`).not.toContain(c.id);
      for (const s of c.sources) expect(sourceIds.has(s), `${c.id} → source "${s}"`).toBe(true);
      expect(c.sources.length, `${c.id} needs at least one source`).toBeGreaterThan(0);
    }
  });

  test("modules link to real concepts, experiments and sources", () => {
    modules.forEach((m, i) => {
      expect(m.number, `${m.id} is numbered in order`).toBe(i + 1);
      for (const c of m.concepts) expect(conceptIds.has(c), `${m.id} → concept "${c}"`).toBe(true);
      for (const l of m.lab) expect(labIds.has(l), `${m.id} → lab "${l}"`).toBe(true);
      for (const s of m.sources) expect(sourceIds.has(s), `${m.id} → source "${s}"`).toBe(true);
    });
    expect(moduleIds.size).toBe(modules.length);
  });

  test("experiments link to real concepts", () => {
    for (const e of experiments) for (const c of e.concepts) expect(conceptIds.has(c), `${e.id} → concept "${c}"`).toBe(true);
  });

  test("effects link to real concepts and have complete prompts", () => {
    const categories = new Set(effectCategories.map((c) => c.id));
    for (const e of effects) {
      expect(categories.has(e.category), `${e.id} → category "${e.category}"`).toBe(true);
      expect(e.related.length, `${e.id} needs related concepts`).toBeGreaterThan(0);
      for (const c of e.related) expect(conceptIds.has(c), `${e.id} → concept "${c}"`).toBe(true);
      for (const [part, text] of Object.entries(e.prompt)) expect(text.trim().length, `${e.id} prompt.${part}`).toBeGreaterThan(10);
      expect(e.prompt.guardrails, `${e.id} guardrails mention reduced motion`).toMatch(/reduced-motion|reduced motion/);
    }
  });

  test("every source is cited somewhere", () => {
    const cited = new Set<string>([...glossary.flatMap((c) => c.sources), ...modules.flatMap((m) => m.sources)]);
    const unused = [...sourceIds].filter((s) => !cited.has(s));
    expect(unused, "sources registered but never cited").toEqual([]);
  });

  test("source URLs use https", () => {
    // jjg.net (Garrett’s original “Elements of User Experience” diagram) is served over HTTP only.
    const httpOnly = new Set(["garrett-elements"]);
    for (const [id, s] of Object.entries(sources)) expect(s.url, id).toMatch(httpOnly.has(id) ? /^https?:\/\// : /^https:\/\//);
  });

  test("no empty translations", () => {
    expect(emptyFields({ glossary, modules, experiments, effects }, "content")).toEqual([]);
  });
});
