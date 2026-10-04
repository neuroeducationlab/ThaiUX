import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { glossary } from "@/content/glossary";
import { keyPaths, locales } from "./routes";

/**
 * Automated WCAG 2.2 A/AA checks with axe-core, in light and dark mode.
 * Lab examples marked data-intentionally-flawed are bad on purpose
 * (learners are asked to find their problems), so they're excluded.
 * Automated checks catch roughly a third of issues — keyboard and
 * screen-reader passes are in docs/process/07-review-and-testing.md.
 */
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({ colorScheme, contextOptions: { reducedMotion: "reduce" } });
    for (const locale of locales) {
      for (const path of keyPaths) {
        test(`axe /${locale}${path} (${colorScheme})`, async ({ page }) => {
          await page.goto(`/${locale}${path}`, { waitUntil: "networkidle" });
          const results = await new AxeBuilder({ page }).withTags(tags).exclude("[data-intentionally-flawed]").analyze();
          expect(summarise(results.violations)).toEqual([]);
        });
      }
    }

    // Each glossary card’s mini demo, opened in place (UXDR-27)
    for (const c of glossary) {
      test(`axe glossary peek: ${c.id} (${colorScheme})`, async ({ page }) => {
        await page.goto("/en/glossary", { waitUntil: "networkidle" });
        const card = page.locator("article").filter({ has: page.getByRole("link", { name: c.term, exact: true }) });
        await card.getByRole("button", { name: `Try it: ${c.term}` }).click();
        await card.locator(".demo-canvas > :not([aria-hidden])").first().waitFor();
        const results = await new AxeBuilder({ page })
          .withTags(tags)
          .include('article[data-peek="open"]')
          .exclude("[data-intentionally-flawed]")
          .analyze();
        expect(results.passes.length).toBeGreaterThan(0);
        expect(summarise(results.violations)).toEqual([]);
      });
    }
  });
}

function summarise(violations: { id: string; impact?: string | null; nodes: { target: unknown[] }[] }[]) {
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}
