export const site = {
  name: "UXLab",
  /** Canonical origin. Set NEXT_PUBLIC_SITE_URL in production; Vercel's URL is the fallback. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  repo: "https://github.com/neuroeducationlab/ThaiUX",
  author: "Molly",
  year: 2026,
};
