import { expect, test } from "@playwright/test";
import { htmlLang, keyPaths, locales } from "./routes";

/** Every key page renders in every language, with one h1 and no runtime errors. */
for (const locale of locales) {
  for (const path of keyPaths) {
    test(`renders /${locale}${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const res = await page.goto(`/${locale}${path}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", htmlLang[locale]);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}

test("unknown pages return a localized 404", async ({ page }) => {
  const res = await page.goto("/ja/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /ホーム|トップ/ }).first()).toBeVisible();
});
