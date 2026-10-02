# 05 · Content plan and source verification

## What exists

| Content | Count | Where |
| --- | --- | --- |
| Glossary concepts | 22 (interaction 6 · components 6 · principles 4 · states 8, some in two groups) | `src/content/glossary/*.ts` |
| Learning modules | 8 (What is UX → Accessible design), 6–8 min each | `src/content/modules/*.ts` |
| Lab experiments | 4 (A–D) | `src/content/lab/index.ts`, components in `src/components/lab` |
| Sources | 114 from 18 publishers, every one cited by at least one lesson | `src/content/sources.ts` |
| Languages | Thai and English complete; Chinese (Simplified) and Japanese complete for the glossary, modules, Lab and UI; the case study falls back to English | `Localized<T>` |

## Writing rules

1. **Problem → Decision → Interaction → Result.** Every concept and module is understandable in about a minute; depth comes after.
2. **Original synthesis.** Lessons are written in UXLab’s own words from recurring ideas across several sources. No course text, illustrations or long quotes are copied. The difference is stated on every page (“Original summary written by UXLab…”).
3. **Always cite, always link out.** Each concept and module ends with “Explore further” (title, publisher, author) linking to the original.
4. **English headwords, local names.** The term stays in English (what learners hear at work), with IPA and a local name: *Hover* · โฮเวอร์ · 悬停 · ホバー.
5. **Thai first, natural Thai.** Thai copy is written, not machine-translated word-for-word; technical words stay English where Thai designers use them (Feedback, Contrast, Focus).
6. **Examples from everyday life in Thailand** — food delivery, PromptPay, booking a table, bank transfers — kept generic (no real brands critiqued).

## Source verification

- Every URL was checked on **2 Oct 2026** against the publisher’s own index (search restricted to the publisher’s domain), because several publisher sites block automated fetching from the build environment.
- Unverifiable references were removed rather than guessed (e.g. a book chapter without a stable URL).
- `npm run check:content` enforces: unique URL-safe ids; every `related`, `concepts`, `lab` and `sources` reference resolves; every registered source is cited somewhere; HTTPS everywhere (one documented HTTP-only exception, jjg.net); no empty translations.

## How to add content

**A concept**

1. Add an object to the right file in `src/content/glossary/` — the `Concept` type lists every field.
2. Reuse a demo or add one in `src/components/demos/` and register it in `demos/registry.tsx` (the `DemoId` type keeps the two in sync).
3. Add sources to `src/content/sources.ts` if new.
4. Run `npm run check:content` and `npm run build`.

**A module** — add a file in `src/content/modules/`, append it to `modules` in `index.ts`, and (optionally) an example component in `src/components/examples/` registered in `examples/registry.tsx`.

**A Lab experiment** — add metadata to `src/content/lab/index.ts`, a component in `src/components/lab/`, and register it in `lab/registry.tsx`. Call `useLabComplete(id, done)` when the learner finishes.

**A language** — add the locale to `src/i18n/config.ts`, a dictionary in `src/i18n/dictionaries/` (the English file defines the required shape), and translations to content as you go (English is the fallback).
