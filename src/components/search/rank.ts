export type SearchKind = "concept" | "module" | "lab" | "effect" | "page";

export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  /** Language of the title, e.g. "en" for English headwords inside a Thai page. */
  titleLang?: string;
  subtitle?: string;
  href: string;
  /** Everything else worth matching: local names, aliases, summaries. */
  keywords: string;
};

const normalize = (s: string) => s.normalize("NFC").toLowerCase().replace(/[\s\-_.’']+/g, "");

/**
 * Small, predictable ranking — exact > prefix > contains, title before keywords.
 * Works for Thai/CJK because it matches substrings, not word boundaries.
 */
export function rankResults(items: SearchItem[], query: string): SearchItem[] {
  const q = normalize(query);
  if (!q) return [];
  return items
    .map((item) => {
      const title = normalize(item.title);
      const sub = normalize(item.subtitle ?? "");
      const kw = normalize(item.keywords);
      let score = 0;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (sub.startsWith(q)) score = 50;
      else if (sub.includes(q)) score = 40;
      else if (kw.includes(q)) score = 20;
      if (score && item.kind === "concept") score += 5; // concepts are the most common intent
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
