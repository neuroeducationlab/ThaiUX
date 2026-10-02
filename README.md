# ThaiUX — Learn UX by experiencing it

**เรียน UX/UI ผ่านการลอง ไม่ใช่แค่อ่าน** · An interactive UX/UI school for beginners, in Thai, English, 简体中文 and 日本語.

ThaiUX เป็นโปรเจกต์การเรียนรู้ของ Molly ทุกแนวคิดมีตัวอย่างให้ลองจริง อธิบายให้เข้าใจได้ในประมาณหนึ่งนาที และเว็บไซต์นี้เองก็ออกแบบตามหลักการที่สอนทุกข้อ

Every concept on ThaiUX is something you can touch: you try it first, then learn its name — *“You just experienced Hover.”*

## What’s inside

| Section | What you get |
| --- | --- |
| **Learn** | 8 short modules — What is UX → Understanding users → Information architecture → Interface design → Interaction design → Prototyping → Usability testing → Accessible design |
| **Glossary** | 22 concepts (interactions, components, principles, states), each with a live demo, IPA, local names, common mistakes and sources |
| **Molly’s UX Lab** | UX Detective · Make It Better · Which Would You Choose? · Build a Button |
| **About** | Story, principles, privacy, and a 114-source reading list with the copyright policy |
| **Case study** | Problem → research → users → IA → decisions → iteration → outcome → reflection |
| **Design system** | Tokens read live from the stylesheet, with WCAG contrast ratios; type, space, motion, components |

Also: ⌘K search across languages and scripts, light/dark themes, on-device progress and saved concepts (no accounts, no tracking), per-language share images, hreflang + sitemap.

## Quality bar

- **0** axe-core WCAG 2.2 A/AA violations across 16 key pages × 4 languages × light/dark (128 checks)
- Keyboard-complete: every focus stop shows a visible ring (scripted Tab pass, 10 pages)
- 164 statically generated pages; each interactive demo is code-split
- Respects `prefers-reduced-motion` and forced-colours mode

## Tech

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react · Playwright + axe-core

> This project uses **Next.js 16**, which differs from older versions (e.g. `src/proxy.ts` replaces middleware, `next/root-params`, async `params`). See `AGENTS.md` and the docs bundled in `node_modules/next/dist/docs/`.

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000 → redirects to your language
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route types + `tsc --noEmit` |
| `npm run check:content` | Content integrity (links, sources, translations) — no browser needed |
| `npm run check` | lint + typecheck + content |
| `npm run test:e2e` | Playwright smoke, axe accessibility and user-flow tests (run `npm run build` first) |

First Playwright run: `npx playwright install chromium`. To test a deployed site: `BASE_URL=https://your-site npm run test:e2e`.

## Project structure

```
src/
  app/[locale]/            Pages (home, learn, glossary, lab, about, case study, design system, 404)
  app/sitemap.ts           All pages × languages with hreflang
  proxy.ts                 Language detection → /th · /en · /zh · /ja
  components/
    ui/                    Button, Switch, SegmentedControl, Tabs, ProgressBar, layout primitives, toast
    layout/                Header, mobile tab bar, footer, language & theme switchers
    demos/                 22 concept demos + DemoFrame (the “experience → name it” pattern)
    examples/              Module examples
    lab/                   The four Lab experiments
    home/ design-system/   Page-specific components
  content/                 Typed content: glossary, modules, lab, sources, page copy
  i18n/                    Locale config, dictionaries (EN defines the shape), helpers
  lib/                     Routes, SEO, contrast maths
docs/process/              Analysis, IA, design system, components, content plan,
                           wireframes, review & testing, decision log
scripts/generate-og.mjs    Renders the per-language share images into public/og/
tests/                     Playwright suites (smoke, a11y, flows, content)
```

## Adding content

- **Concept:** add it to `src/content/glossary/<category>.ts`, add or reuse a demo in `src/components/demos/registry.tsx`, then `npm run check:content`.
- **Module:** add a file to `src/content/modules/` and list it in `index.ts`.
- **Lab experiment:** metadata in `src/content/lab/index.ts`, component in `src/components/lab/`, register in `lab/registry.tsx`.
- **Language:** add it to `src/i18n/config.ts` and a dictionary in `src/i18n/dictionaries/`; content falls back to English until translated.

Thai and English are required for every piece of content; Chinese and Japanese fall back to English. Details: [docs/process/05-content-plan.md](docs/process/05-content-plan.md).

## Deploying (Vercel)

1. Import the GitHub repository in Vercel (framework preset: Next.js; no extra settings needed).
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin (e.g. `https://thaiux.example`) so canonical URLs, the sitemap and share images use it. Without it, Vercel’s production URL is used.
3. After changing hero copy, re-render share images: `node scripts/generate-og.mjs`.

## Process documents

1. [Brief analysis](docs/process/01-analysis.md) · 2. [Information architecture](docs/process/02-information-architecture.md) · 3. [Design system](docs/process/03-design-system.md) · 4. [Components](docs/process/04-components.md) · 5. [Content plan](docs/process/05-content-plan.md) · 6. [Wireframes](docs/process/06-wireframes.md) · 7. [Review & testing](docs/process/07-review-and-testing.md) · 8. [Decision log](docs/process/08-decision-log.md)

## Credits and copyright

All lesson text, demos and code are original work by ThaiUX. Ideas drawn from published research and guidelines are summarised in our own words and linked to their sources (see `/about#sources`). Organisation and product names belong to their owners. A licence for reuse has not been chosen yet — until then, all rights are reserved.
