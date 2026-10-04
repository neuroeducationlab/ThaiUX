# 07 · Review, testing and iteration

## 1. Automated checks

| Suite | Command | What it covers | Result |
| --- | --- | --- | --- |
| Lint | `npm run lint` | ESLint (Next + React hooks rules) | ✅ clean |
| Types | `npm run typecheck` | `next typegen` + `tsc --noEmit` (typed routes, content types) | ✅ clean |
| Content | `npm run check:content` | ids, cross-links, sources, HTTPS, empty translations, effect prompts complete with reduced-motion guardrails (8 checks) | ✅ 8/8 |
| Smoke | `npm run test:e2e` | 21 key pages × 4 languages: status 200, correct `html[lang]`, one `h1`, no console errors; localized 404 | ✅ 85/85 |
| Accessibility | `npm run test:e2e` | axe-core, WCAG 2.2 A/AA tags, 21 pages × 4 languages × light/dark = 168 page checks, plus every glossary mini demo opened in place × light/dark = 44 checks | ✅ 0 violations |
| User flows | `npm run test:e2e` | language detection (5 cases) + remembered choice, skip link, hero lesson, URL filter state, Build a Button completion, Detective, mobile tab bar; Effects: URL filter, copy prompt to clipboard (stack switch), tried progress, reduced-motion pause + opt-in; Home: Effects pill, drifting rail that stops on hover and reveals prompt actions, pause button; Glossary peeks: a quick sweep opens nothing while a resting pointer opens a playable demo that counts as experienced and closes on leave, Esc goes to the demo’s own dialog first and then returns focus to Try it, the Try button opens it on touch and a tap outside closes it | ✅ 22/22 |

The e2e suites run against a production build (`npm run build && npm run test:e2e`).

**Axe findings that were fixed** (first run: 7 distinct issues, all colour contrast): thumbnail and step-number text using the decorative `--ink-3`, glossary filter counts, a mock placeholder at 3.2:1, and three examples that are *deliberately* inaccessible (now marked `data-intentionally-flawed`, see [04](./04-components.md)).

**Glossary peeks** (UXDR-27) were also checked by script at 375, 1024 and 1440 px in Thai, English and Japanese: all 22 mini demos fit their stage with no overflow; a wheel scroll under a still mouse opens nothing; keyboard opens move focus into the demo and Esc returns it; reduced motion swaps the demo in without the mist. Two pointer tests that relied on timing were rewritten to wait for the smooth page scroll to settle.

**Keyboard pass** (scripted Tab walk through 10 pages, 429 focus stops): every stop shows a visible focus indicator; no traps; skip link moves focus to `<main>`. Automated tools find only part of the picture — a manual screen-reader pass (VoiceOver iOS/macOS, TalkBack) is part of the usability round below.

## 2. Heuristic review (Nielsen’s 10) — findings and fixes

| # | Heuristic | Finding | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | Visibility of system status | Phones: UX Detective’s explanation appeared below the fold after a tap — no visible feedback. | 3 | ✅ Inline callout under the tapped part + gentle scroll |
| 2 | Visibility of system status | Make It Better / Build a Button: preview scrolled away while adjusting controls. | 3 | ✅ Preview pinned on phones (sticky, scaled phone in B) |
| 3 | Recognition rather than recall | Which Would You Choose?: A and B stacked on phones; comparing meant remembering. | 2 | ✅ Side-by-side mock-ups, trade-offs below |
| 4 | Match with the real world | Home lesson button asked touch users to hover. | 2 | ✅ Detect `(hover: none)`; adapt prompt and count |
| 5 | Aesthetic and minimalist design | Mobile home ran ~10,000 px. | 2 | ✅ 2-column Lab cards, compact categories, 2×2 lesson path, side-by-side UX/UI cards |
| 6 | Aesthetic and minimalist design | About: 114-item reading list opened by default. | 1 | ✅ Grouped by publisher, collapsed |
| 7 | Consistency and standards | Share links lost the preview image on pages with their own metadata. | 2 | ✅ `pageMetadata()` gives every page its own title + per-language image |

Severity: 0 none · 1 cosmetic · 2 minor · 3 major · 4 catastrophe.

## 3. Usability test plan (next step)

**Participants:** 5 Thai beginners — 2 students, 2 career switchers, 1 developer; recruited from Molly’s audience; phones first (most traffic will come from social links).

**Format:** 30-minute remote moderated sessions, think-aloud, screen + face recording with consent.

| Task | Scenario | Success |
| --- | --- | --- |
| T1 | “A friend sent you this link” → `/th/glossary/affordance`. After one minute, explain *affordance* in your own words. | Correct explanation (rubric 0–2, success = 2) |
| T2 | Find what a “focus state” is. | Reaches the concept in < 60 s, any route |
| T3 | Lab A: find three problems and say why they’re problems. | ≥ 3 issues named with a reason |
| T4 | Lab D: make a button that passes all checks. | Completion card reached |
| T5 | Read this page in English, then switch back. | Language changed and restored without help |
| T6 | Where is your progress saved? | Mentions “this device” (privacy understood) |

**Measures:** task success, time on task, Single Ease Question (1–7) after each task, SUS at the end, explain-back quality.
**Targets:** T1 ≥ 4/5 participants; mean SEQ ≥ 5.5; SUS ≥ 75.

## 4. Iteration proposals (backlog)

| Priority | Proposal | Why |
| --- | --- | --- |
| P1 | Run the test above; fix the top 3 issues | Validates the core promise (“understand in a minute”) |
| P1 | Manual screen-reader pass on the 4 Lab experiments | Most complex interactions on the site |
| P2 | Real-World UX teardowns (food checkout, bank transfer, e-service form) | Future-ready section is in place; needs research and permission for any real brand |
| P2 | Per-concept share images | Social links to a concept would preview that concept |
| P2 | Translate the case study into 中文 and 日本語 | Currently English with a notice |
| P3 | Optional cross-device sync | Only if learners ask; keep on-device by default |
| P3 | Privacy-friendly, cookieless analytics | Only with an explicit decision from Molly; today there is none |
