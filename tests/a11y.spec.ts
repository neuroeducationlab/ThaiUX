import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
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
          const summary = results.violations.map(
            (v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`,
          );
          expect(summary).toEqual([]);
        });
      }
    }
  });
}
