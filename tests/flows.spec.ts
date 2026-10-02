import { expect, test } from "@playwright/test";

test.describe("language detection (proxy)", () => {
  for (const [accept, expected] of [
    ["th-TH,th;q=0.9", "/th"],
    ["ja-JP,ja;q=0.9,en;q=0.5", "/ja"],
    ["zh-CN,zh;q=0.9", "/zh"],
    ["hi-IN,hi;q=0.9", "/en"], // unsupported language → English
    ["", "/th"], // no preference → Thai (home audience)
  ] as const) {
    test(`Accept-Language "${accept || "none"}" → ${expected}`, async ({ playwright, baseURL }) => {
      const api = await playwright.request.newContext({ baseURL, extraHTTPHeaders: accept ? { "accept-language": accept } : {} });
      const res = await api.get("/glossary", { maxRedirects: 0 });
      expect([307, 308]).toContain(res.status());
      expect(new URL(res.headers().location, baseURL).pathname).toBe(`${expected}/glossary`);
      await api.dispose();
    });
  }

  test("a chosen language is remembered", async ({ page, context, baseURL }) => {
    await page.goto("/th/glossary/hover");
    await page.getByRole("button", { name: /เปลี่ยนภาษา/ }).click();
    await page.getByRole("link", { name: /English/ }).click();
    await expect(page).toHaveURL(/\/en\/glossary\/hover$/);
    const cookies = await context.cookies(baseURL);
    expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("en");
  });
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("hero button names what you just experienced", async ({ page }) => {
  await page.goto("/en");
  const button = page.getByRole("button", { name: "Press me" });
  await button.hover();
  await expect(page.getByText("You just experienced “Hover”.")).toBeVisible();
  await button.click();
  await expect(page.getByText("You just experienced “Feedback”.")).toBeVisible();
});

test("glossary filter lives in the URL", async ({ page }) => {
  await page.goto("/en/glossary?category=state");
  await expect(page.getByText(/Showing 8 of 22/)).toBeVisible();
  await page.getByRole("button", { name: /^All/ }).click();
  await expect(page).toHaveURL(/\/en\/glossary$/);
  await expect(page.getByText(/Showing 22 of 22/)).toBeVisible();
});

test("Build a Button can be completed", async ({ page }) => {
  await page.goto("/en/lab/build-a-button");
  await page.getByLabel("Label").fill("Book a table");
  await page.getByRole("radio", { name: "Indigo" }).check({ force: true });
  await page.getByRole("radiogroup", { name: "Size" }).getByText("Medium · 44").click();
  await expect(page.getByText("3 of 4")).toBeVisible();
  await page.locator('button[style*="--b-bg"]').click();
  await expect(page.getByText("That’s a real button.")).toBeVisible({ timeout: 5000 });
});

test("UX Detective counts found problems", async ({ page }) => {
  await page.goto("/en/lab/ux-detective");
  await page.getByRole("button", { name: /Reveal all/ }).click();
  await expect(page.getByText("Found 7 of 7")).toBeVisible();
});

test("mobile tab bar reaches every section @mobile", async ({ page }) => {
  await page.goto("/en");
  const tabs = page.getByRole("navigation", { name: "Sections" });
  await expect(tabs).toBeVisible();
  await tabs.getByRole("link", { name: "Lab" }).click();
  await expect(page).toHaveURL(/\/en\/lab$/);
  await expect(tabs.getByRole("link", { name: "Lab" })).toHaveAttribute("aria-current", "page");
});
