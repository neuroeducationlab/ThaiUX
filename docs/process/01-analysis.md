# 01 · Brief analysis

> Step 1 of the workflow: understand the problem before designing anything.

## The brief in one sentence

Build **ThaiUX** — a premium, interactive UX/UI school for beginners, Thai first, where every concept is *experienced* rather than only read, and which doubles as a portfolio piece for Molly and her social audience (Thailand, China, Japan, India).

## Problem

| Barrier | What it looks like | Consequence |
| --- | --- | --- |
| Language | Most trustworthy UX resources are English-only. | Thai beginners read slowly, lose nuance, give up. |
| Abstraction | Interaction concepts (affordance, feedback, focus…) are explained with text alone. | People can recite a definition but can’t spot the idea in a real app. |
| Format | Long articles, hour-long videos, or glossaries with nothing to try. | High effort before the first “aha”. |

**How might we** help Thai beginners understand UX/UI concepts by experiencing them — in their own language, in about a minute per idea?

## Goals and success criteria

| Goal | Measure (MVP) | Measure (after launch) |
| --- | --- | --- |
| Understand a concept in ~1 minute | Every concept page follows Problem → Decision → Interaction → Result and opens with a demo | In testing, 4 of 5 beginners explain the concept in their own words after one minute |
| Learn by doing | 22 concepts, each with a working demo; 4 Lab experiments | Demo completion rate (on-device only; no analytics yet) |
| Premium, calm, trustworthy | Apple-inspired editorial direction; no gratuitous motion; cited sources | Qualitative feedback (“feels professional”, “easy to read”) |
| Accessible to everyone | 0 axe WCAG 2.2 A/AA violations; keyboard-complete; reduced motion respected | Screen-reader pass with VoiceOver/TalkBack by a real user |
| Reach Molly’s audience | TH, EN, 简体中文, 日本語; share images per language | Social click-through by language |

## Audience

Proto-personas (assumptions to validate — see [07](./07-review-and-testing.md)):

1. **The curious switcher** — student or professional exploring UX, arrives from a social link on a phone, reads English slowly. Needs quick wins.
2. **The collaborator** — developer or marketer working with designers. Needs precise vocabulary, fast.
3. **The international follower** — in China, Japan or India; reads in their own language or English.

## Constraints

- Stack set by the brief: Next.js, React, TypeScript, Tailwind CSS, GitHub, Vercel.
- Next.js **16** (App Router, Turbopack, `proxy.ts` instead of middleware) — APIs checked against the bundled docs in `node_modules/next/dist/docs/`.
- No backend and no accounts in the MVP; progress must stay on the device.
- Content must be **original synthesis**, never copied from courses; every idea links to its source.

## Questions asked before building (material decisions)

| Question | Options offered | Molly’s decision |
| --- | --- | --- |
| Which language for the Indian audience? | English only · Hindi · English + Hindi | **English only** |
| Which Chinese script? | Simplified (Recommended) · Traditional · Both | **Simplified 简体** |
| Brand name? | ThaiUX (Recommended) · UX in Thai · others | **ThaiUX** (Lab stays “Molly’s UX Lab”) |

Everything else followed the brief or a recorded default — see the decision log in [08](./08-decision-log.md).

## Scope of the MVP

**In:** Home (8 sections), Learn (8 modules), Glossary (22 concepts with demos), Molly’s UX Lab (4 experiments), About, Case study, Design system, 404, search, progress/save, light/dark, 4 languages, SEO (hreflang, sitemap, share images).

**Out (future-ready):** Real-World UX teardowns (placeholders on the Lab page), accounts/sync, analytics, CMS, more experiments.
