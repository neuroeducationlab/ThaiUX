# UXLab — Learn UX by experiencing it

**เรียน UX/UI ผ่านการลอง ไม่ใช่แค่อ่าน** · An interactive UX/UI school for beginners, in Thai, English, 简体中文 and 日本語.

UXLab เป็นโปรเจกต์การเรียนรู้ของ Molly ทุกแนวคิดมีตัวอย่างให้ลองจริง อธิบายให้เข้าใจได้ในประมาณหนึ่งนาที และเว็บไซต์นี้เองก็ออกแบบตามหลักการที่สอนทุกข้อ

Every concept on UXLab is something you can touch: you try it first, then learn its name — *“You just experienced Hover.”*

## What’s inside

| Section | What you get |
| --- | --- |
| **Home** | One clear call to action: a 30-second tour that shows what you get — a plain page that effects bring to life, a prompt you copy into your own AI (really copied), a glossary card that opens into a demo, and a certificate with your name — told as one easy journey: pick an effect → copy the prompt → learn by doing → get your certificate |
| **Learn** | 8 short modules — What is UX → Understanding users → Information architecture → Interface design → Interaction design → Prototyping → Usability testing → Accessible design. Finish all eight for a certificate in your name, drawn on your device (PNG, print/PDF, share) |
| **Glossary** | 22 concepts (interactions, components, principles, states), each with a live demo, IPA, local names, common mistakes and sources. Rest the pointer on a card and a faint mist clears into a mini demo you can play right there (or tap **Try it**) |
| **Molly’s UX Lab** | UX Detective · Make It Better · Which Would You Choose? · Build a Button |
| **Effects** | 21 live interaction effects — water ripple, X-ray lens, mouse parallax, lanyard badge, flower cursor, particle text, holographic tilt and more — each with why it works, when to use or avoid it, and a copy-ready AI prompt built on a five-part formula; plus a prompt builder |
| **About** | Story, principles, privacy, and a 114-source reading list with the copyright policy |
| **Case study** | Problem → research → users → IA → decisions → iteration → outcome → reflection |
| **Design system** | Tokens read live from the stylesheet, with WCAG contrast ratios; type, space, motion, components |

Also: ⌘K search across languages and scripts, light/dark themes, on-device progress and saved concepts (no accounts, no tracking), per-language share images, hreflang + sitemap.

## Quality bar

- **0** axe-core WCAG 2.2 A/AA violations across 22 key pages × 4 languages × light/dark (176 checks), plus all 22 glossary mini demos opened in place (44 checks), the hero tour part by part and the unlocked certificate (4 checks)
- Keyboard-complete: every focus stop shows a visible ring (scripted Tab pass, 10 pages)
- 256 statically generated pages; each interactive demo is code-split, and effects load just before they scroll into view and pause off-screen
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
    peeks/                 22 card-sized mini demos that play inside the glossary cards
    glossary/              Concept card (hover-intent peek, mist), explorer, save button
    examples/              Module examples
    lab/                   The four Lab experiments
    effects/               Effects library: stage engine, cards, prompt block & builder, home rail, 21 demos
    home/                  Hero call to action + 30-second tour (engine, four scenes, ghost pointer)
    certificate/           Canvas-drawn certificate: fonts, layout, download / print / share
    design-system/         Design system page components
  content/                 Typed content: glossary, modules, lab, sources, page copy
  i18n/                    Locale config, dictionaries (EN defines the shape), helpers
  lib/                     Routes, SEO, contrast maths
docs/process/              Analysis, IA, design system, components, content plan,
                           wireframes, review & testing, decision log
scripts/generate-og.mjs    Renders the per-language share images into public/og/
tests/                     Playwright suites (smoke, a11y, flows, content)
```

## Adding content

- **Concept:** add it to `src/content/glossary/<category>.ts` (including a short `peek` hint), add or reuse a demo in `src/components/demos/registry.tsx` and a card-sized peek in `src/components/peeks/registry.tsx`, then `npm run check:content`.
- **Module:** add a file to `src/content/modules/` and list it in `index.ts`.
- **Lab experiment:** metadata in `src/content/lab/index.ts`, component in `src/components/lab/`, register in `lab/registry.tsx`.
- **Effect:** add it to `src/content/effects.ts` (the prompt follows the five-part formula), add a demo in `src/components/effects/demos/` built on `Stage` and `useStagePointer`, register it in `effects/registry.tsx`, then `npm run check:content`.
- **Language:** add it to `src/i18n/config.ts` and a dictionary in `src/i18n/dictionaries/`; content falls back to English until translated.

Thai and English are required for every piece of content; Chinese and Japanese fall back to English. Details: [docs/process/05-content-plan.md](docs/process/05-content-plan.md).

## Deploying (Vercel)

1. Import the GitHub repository in Vercel (framework preset: Next.js; no extra settings needed).
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin (e.g. `https://uxlab.example`) so canonical URLs, the sitemap and share images use it. Without it, Vercel’s production URL is used.
3. After changing hero copy, re-render share images: `node scripts/generate-og.mjs`.

## Process documents

1. [Brief analysis](docs/process/01-analysis.md) · 2. [Information architecture](docs/process/02-information-architecture.md) · 3. [Design system](docs/process/03-design-system.md) · 4. [Components](docs/process/04-components.md) · 5. [Content plan](docs/process/05-content-plan.md) · 6. [Wireframes](docs/process/06-wireframes.md) · 7. [Review & testing](docs/process/07-review-and-testing.md) · 8. [Decision log](docs/process/08-decision-log.md)

## Credits and copyright

All lesson text, demos and code are original work by UXLab. Ideas drawn from published research and guidelines are summarised in our own words and linked to their sources (see `/about#sources`). Organisation and product names belong to their owners. A licence for reuse has not been chosen yet — until then, all rights are reserved.
