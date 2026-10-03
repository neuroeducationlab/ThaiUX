/** Shared route lists for the e2e suites. */
export const locales = ["th", "en", "zh", "ja"] as const;

export const keyPaths = [
  "",
  "/learn",
  "/learn/what-is-ux",
  "/learn/accessible-design",
  "/glossary",
  "/glossary/hover",
  "/glossary/affordance",
  "/glossary/modal",
  "/lab",
  "/lab/ux-detective",
  "/lab/make-it-better",
  "/lab/which-would-you-choose",
  "/lab/build-a-button",
  "/effects",
  "/effects/water-ripple",
  "/effects/xray",
  "/effects/parallax",
  "/effects/lanyard",
  "/about",
  "/about/case-study",
  "/design-system",
];

export const htmlLang: Record<(typeof locales)[number], string> = { th: "th", en: "en-GB", zh: "zh-Hans", ja: "ja" };
