import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { glossary } from "@/content/glossary";
import { modules } from "@/content/modules";
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

    // The hero tour, part by part, paused, and at its end (UXDR-31)
    test(`axe hero tour (${colorScheme})`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.goto("/en", { waitUntil: "networkidle" });
      const name = "30-second tour: what you get from UXLab";
      const tour = page.getByRole("region", { name });
      const scan = async () => summarise((await new AxeBuilder({ page }).withTags(tags).include(`[aria-label="${name}"]`).analyze()).violations);
      expect(await scan()).toEqual([]);
      await expect(async () => {
        const cta = tour.getByRole("button", { name: "Take the 30-second tour" });
        if (await cta.isVisible()) await cta.click();
        await expect(tour.getByRole("button", { name: "Pause the tour" })).toBeVisible({ timeout: 1000 });
      }).toPass();
      await page.waitForTimeout(4000);
      expect(await scan()).toEqual([]);
      await tour.getByRole("button", { name: "Pause the tour" }).click();
      expect(await scan()).toEqual([]);
      for (const [part, wait] of [["Go to part 2: Copy the prompt", 6500], ["Go to part 3: Learn + practise", 6500], ["Go to part 4: Get your certificate", 4000]] as const) {
        await tour.getByRole("button", { name: part }).click();
        await page.waitForTimeout(wait);
        expect(await scan()).toEqual([]);
      }
      await expect(tour.getByRole("heading", { name: "It’s that easy." })).toBeVisible({ timeout: 8000 });
      expect(await scan()).toEqual([]);
    });

    // The certificate, unlocked with a name typed (UXDR-32)
    test(`axe certificate unlocked (${colorScheme})`, async ({ page }) => {
      await page.goto("/en");
      await page.evaluate((completed) => localStorage.setItem("thaiux:progress:v1", JSON.stringify({ experienced: [], completed, labs: [], saved: [], effects: [] })), modules.map((m) => m.id));
      await page.goto("/en/learn/certificate", { waitUntil: "networkidle" });
      await page.getByLabel("Name on the certificate").fill("Ada Lovelace");
      await expect(page.getByRole("button", { name: "Download image (PNG)" })).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(summarise(results.violations)).toEqual([]);
    });

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
