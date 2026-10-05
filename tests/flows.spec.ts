import { expect, test, type Locator, type Page } from "@playwright/test";
import { modules } from "@/content/modules";

/**
 * Scroll a pointer target so it sits BELOW the sticky header + filter bar (not just "in view"),
 * so Playwright's own scrollIntoViewIfNeeded on a later child click can't tuck that child under
 * the sticky header — which intercepts pointer events and makes the click flaky.
 */
async function settle(page: Page, target: Locator) {
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
  await target.evaluate((el) => {
    let stickyBottom = 0;
    for (const n of document.querySelectorAll<HTMLElement>("header, .sticky")) {
      if (getComputedStyle(n).position === "sticky" || n.tagName === "HEADER") {
        stickyBottom = Math.max(stickyBottom, n.getBoundingClientRect().bottom);
      }
    }
    const offset = el.getBoundingClientRect().top - (stickyBottom + 24);
    if (offset !== 0) window.scrollBy(0, offset);
  });
  await page.waitForTimeout(300);
  return (await target.boundingBox())!;
}

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
  await tabs.getByRole("link", { name: "Effects" }).click();
  await expect(page).toHaveURL(/\/en\/effects$/);
  await expect(tabs.getByRole("link", { name: "Effects" })).toHaveAttribute("aria-current", "page");
});

test.describe("Effects library", () => {
  test("category filter lives in the URL", async ({ page }) => {
    await page.goto("/en/effects?category=cursor");
    await expect(page.locator("#effects article")).toHaveCount(4);
    await page.getByRole("group", { name: "Category" }).getByRole("button", { name: /^All/ }).click();
    await expect(page).toHaveURL(/\/en\/effects$/);
    await expect(page.locator("#effects article")).toHaveCount(21);
  });

  test("copying a prompt puts the five-part formula on the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en/effects/magnetic");
    await page.getByRole("radio", { name: "HTML + CSS + JS" }).check({ force: true });
    await expect(page.getByText(/as a single HTML file/)).toBeVisible();
    await page.locator("#prompt").getByRole("button", { name: "Copy prompt" }).click();
    await expect(page.getByText("Copied — paste it into your AI coding tool")).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toMatch(/^Create a magnetic button component as a single HTML file/);
    for (const part of ["Effect:", "Trigger:", "Feel:", "Purpose:", "Guardrails:"]) expect(text).toContain(part);
  });

  test("playing an effect counts as tried", async ({ page }) => {
    await page.goto("/en/effects/celebrate");
    const stage = page.getByRole("region", { name: "Celebration" });
    await stage.getByRole("button", { name: /Like/ }).click();
    await stage.getByRole("button", { name: "Finish course" }).click();
    await expect(stage.getByText("Course complete!")).toBeVisible();
    await expect(stage.getByText("Tried")).toBeVisible();
  });

  test("reduced motion starts effects paused, with a way to play them", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/en/effects/water-ripple");
    const play = page.getByRole("button", { name: "Play effects" }).last();
    await expect(page.getByText("Paused")).toBeVisible();
    await play.click();
    await expect(page.getByText("Paused")).toHaveCount(0);
    await context.close();
  });
});

test.describe("Home promotes the Effects library", () => {
  test("the hero pill leads to the Effects library", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: /21 playable effects, with AI prompts/ }).click();
    await expect(page).toHaveURL(/\/en\/effects$/);
  });

  test("the rail drifts, stops under the pointer and reveals the prompt actions", async ({ page }) => {
    await page.goto("/en");
    const rail = page.getByRole("list", { name: "Featured effects" });
    const area = await settle(page, rail);
    await page.mouse.move(2, 2);
    const start = await rail.evaluate((el) => el.scrollLeft);
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft), { timeout: 8000 }).toBeGreaterThan(start + 10);

    // pointing into the rail stops the drift…
    await page.mouse.move(area.x + area.width / 2, area.y + 60, { steps: 4 });
    const stopped = await rail.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(900);
    expect(await rail.evaluate((el) => el.scrollLeft)).toBe(stopped);

    // …and the tile under the pointer wakes up and shows its prompt actions
    const index = await rail.evaluate((el) => {
      const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
      const tiles = [...el.querySelectorAll(":scope > li")].map((li) => li.getBoundingClientRect());
      return tiles.reduce((best, r, i) => (Math.abs(r.left + r.width / 2 - mid) < Math.abs(tiles[best].left + tiles[best].width / 2 - mid) ? i : best), 0);
    });
    const tile = rail.getByRole("listitem").nth(index);
    const t = (await tile.boundingBox())!;
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 3 });
    await expect(tile).toHaveAttribute("data-current", "true");
    await expect(tile.getByRole("button", { name: "Copy prompt" }).locator("..")).toHaveCSS("opacity", "1");
  });

  test("the drift has a pause button", async ({ page }) => {
    await page.goto("/en");
    const rail = page.getByRole("list", { name: "Featured effects" });
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
    await page.mouse.move(2, 2);
    const stopped = await rail.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1200);
    expect(await rail.evaluate((el) => el.scrollLeft)).toBe(stopped);
  });
});

test.describe("Glossary cards play their own demo", () => {
  const card = (page: Page, term: string) =>
    page.locator("article").filter({ has: page.getByRole("link", { name: term, exact: true }) });

  test("resting the mouse on a card opens a playable demo; leaving closes it", async ({ page }) => {
    await page.goto("/en/glossary");
    const toggle = card(page, "Toggle");
    const box = await settle(page, toggle);
    // a quick sweep across the card is not intent
    await page.mouse.move(box.x - 40, box.y + 60);
    await page.mouse.move(box.x + box.width + 40, box.y + 60, { steps: 8 });
    await page.waitForTimeout(700);
    await expect(toggle).toHaveAttribute("data-peek", "idle");
    // resting is
    await page.mouse.move(box.x + 90, box.y + 150, { steps: 5 });
    await expect(toggle).toHaveAttribute("data-peek", "open");
    await toggle.getByRole("switch", { name: /Airplane mode/ }).click();
    await expect(toggle.getByText("You just experienced “Toggle”.")).toBeVisible();
    await page.mouse.move(box.x + box.width + 200, box.y - 100, { steps: 3 });
    await expect(toggle).toHaveAttribute("data-peek", "idle");
    await expect(toggle.getByText("Experienced", { exact: true })).toBeVisible();
  });

  test("Esc closes the demo, but a demo’s own dialog claims Esc first", async ({ page }) => {
    await page.goto("/en/glossary");
    const modal = card(page, "Modal");
    await modal.getByRole("button", { name: "Try it: Modal" }).click();
    await expect(page.getByRole("group", { name: "Modal — mini demo" })).toBeFocused();
    await modal.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(modal.getByRole("dialog", { name: "Delete this project?" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal.getByRole("dialog")).toHaveCount(0);
    await expect(modal).toHaveAttribute("data-peek", "open");
    await page.keyboard.press("Escape");
    await expect(modal).toHaveAttribute("data-peek", "idle");
    await expect(modal.getByRole("button", { name: "Try it: Modal" })).toBeFocused();
  });

  test("the Try button opens the demo on touch, and a tap outside closes it @mobile", async ({ page }) => {
    await page.goto("/en/glossary");
    const swipe = card(page, "Swipe");
    await swipe.getByRole("button", { name: "Try it: Swipe" }).tap();
    await expect(swipe).toHaveAttribute("data-peek", "open");
    await swipe.getByRole("button", { name: "Archive “Dinner at 7?”" }).tap();
    await expect(swipe.getByText("You just experienced “Swipe”.")).toBeVisible();
    await page.getByRole("heading", { level: 1 }).tap();
    await expect(swipe).toHaveAttribute("data-peek", "idle");
  });
});

test.describe("Hero tour", () => {
  const tourOf = (page: Page) => page.getByRole("region", { name: "30-second tour: what you get from UXLab" });
  /** Press the call to action (again, if it landed before the page hydrated) until the tour is running. */
  const start = async (page: Page, how: "click" | "tap" = "click") => {
    const tour = tourOf(page);
    await expect(async () => {
      const cta = tour.getByRole("button", { name: "Take the 30-second tour" });
      if (await cta.isVisible()) await cta[how]();
      await expect(tour.getByRole("button", { name: "Pause the tour" })).toBeVisible({ timeout: 1000 });
    }).toPass();
    return tour;
  };

  test("one button starts the tour; it can be paused, skipped through and closed", async ({ page }) => {
    await page.goto("/en");
    const tour = await start(page);
    await expect(tour.getByRole("button", { name: "Pause the tour" })).toBeFocused();
    await expect(tour.locator("[aria-live]")).toHaveText("Part 1 of 4 · Pick an effect: Does your page feel a bit flat?");
    await tour.getByRole("button", { name: "Pause the tour" }).click();
    await expect(tour.getByText("Paused — press to carry on")).toBeVisible();
    await tour.getByRole("button", { name: "Resume the tour" }).click();
    await page.keyboard.press("ArrowRight");
    await expect(tour.getByRole("button", { name: "Go to part 2: Copy the prompt" })).toHaveAttribute("aria-current", "step");
    await page.keyboard.press("Escape");
    await expect(tour.getByRole("button", { name: "Take the 30-second tour" })).toBeFocused();
  });

  test("the prompt in the tour is real: copying it pauses the tour", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en");
    const tour = await start(page);
    await tour.getByRole("button", { name: "Go to part 2: Copy the prompt" }).click();
    await tour.getByRole("button", { name: "Copy prompt" }).click();
    await expect(tour.getByText(/Copied! The tour is paused/)).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toMatch(/^Create a magnetic button component/);
    expect(text).toContain("Guardrails:");
  });

  test("it ends on the journey and where to start, and never counts as progress", async ({ page }) => {
    await page.goto("/en");
    const tour = await start(page);
    await tour.getByRole("button", { name: "Go to part 4: Get your certificate" }).click();
    await expect(tour.getByRole("heading", { name: "It’s that easy." })).toBeFocused({ timeout: 10_000 });
    await expect(tour.getByRole("link", { name: /^Finish 8 modules, get a certificate/ })).toHaveAttribute("href", "/en/learn/certificate");
    await expect(tour.getByRole("link", { name: "Start Module 1" })).toHaveAttribute("href", "/en/learn/what-is-ux");
    expect(await page.evaluate(() => localStorage.getItem("thaiux:progress:v1"))).toBeNull();
  });

  test("on a phone, a tap on the picture pauses it and another carries on @mobile", async ({ page }) => {
    await page.goto("/en");
    const tour = await start(page, "tap");
    const stage = tour.locator(".tour-stage");
    await expect(stage).toHaveAttribute("data-mode", "playing");
    await stage.tap({ position: { x: 24, y: 220 } });
    await expect(stage).toHaveAttribute("data-mode", "paused");
    await stage.tap({ position: { x: 24, y: 220 } });
    await expect(stage).toHaveAttribute("data-mode", "playing");
  });
});

test.describe("Certificate", () => {
  const seed = (page: Page, done: string[]) =>
    page.evaluate((completed) => localStorage.setItem("thaiux:progress:v1", JSON.stringify({ experienced: [], completed, labs: [], saved: [], effects: [] })), done);

  test("locked until every module is done: a sample, the progress and the next module", async ({ page }) => {
    await page.goto("/en");
    await seed(page, modules.slice(0, 3).map((m) => m.id));
    await page.goto("/en/learn/certificate");
    await expect(page.getByText("Your certificate is waiting")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "3 of 8 modules completed" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue with Module 4" })).toHaveAttribute("href", `/en/learn/${modules[3].id}`);
    await expect(page.getByRole("img", { name: /^Certificate preview/ })).toHaveAttribute("aria-label", /\(Sample\)$/);
    await expect(page.getByRole("button", { name: /Download/ })).toHaveCount(0);
  });

  test("the last module unlocks it; the name goes on it and it downloads as a PNG", async ({ page }) => {
    await page.goto("/en");
    await seed(page, modules.slice(0, 7).map((m) => m.id));
    await page.goto(`/en/learn/${modules[7].id}`);
    await page.getByRole("button", { name: "Mark module as complete" }).click();
    await page.getByRole("link", { name: "All done — get your certificate" }).click();
    await expect(page).toHaveURL(/\/en\/learn\/certificate$/);
    await expect(page.getByText("Congratulations — you’ve finished all 8 modules!")).toBeVisible();
    await page.getByLabel("Name on the certificate").fill("Ada Lovelace");
    await expect(page.getByRole("img", { name: /Ada Lovelace/ })).toBeVisible();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download image (PNG)" }).click();
    expect((await download).suggestedFilename()).toBe("UXLab-certificate.png");
    await page.reload();
    await expect(page.getByLabel("Name on the certificate")).toHaveValue("Ada Lovelace");
  });
});
