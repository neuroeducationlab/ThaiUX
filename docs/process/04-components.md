# 04 · Components and patterns

## Inventory

| Component | File | States / notes |
| --- | --- | --- |
| `Button`, `ButtonLink`, `IconButton` | `src/components/ui/button.tsx` | primary · secondary · ghost · quiet · danger × sm/md/lg; default, hover, active (scale 0.97), focus-visible, disabled, loading (`aria-busy`). md/lg ≥ 44 px. |
| `Switch` | `ui/controls.tsx` | APG switch (`role="switch"`, `aria-checked`); immediate effect, never inside a Save form. |
| `SegmentedControl` | `ui/controls.tsx` | Native radios styled as segments (arrow keys for free), optional `disabled`. |
| `Tabs` | `ui/controls.tsx` | APG tabs, automatic activation, roving `tabindex`, Home/End. |
| `ProgressBar` | `ui/controls.tsx` | `role="progressbar"` with text alternative. |
| `Container`, `Section`, `SectionHeader`, `Card`, `Tag`, `Kbd`, `DifficultyDots` | `ui/layout.tsx` | Layout primitives; difficulty is dots **plus** text, never colour alone. |
| `toast()` / `Toaster` | `ui/toast.tsx` | Polite live region; confirms, never asks. |
| `SiteHeader`, `MobileTabBar`, `LanguageSwitcher`, `ThemeSwitcher`, `Breadcrumbs`, `PageHeader` | `components/layout` | Language switcher is a disclosure of real links (navigation, not an ARIA menu). |
| `SearchPalette` | `components/search` | ⌘K / `/`; combobox + listbox; matches across languages and scripts. |
| `SectionNav` | `components/learn` | Sticky table of contents with scroll-spy. |

## The teaching pattern: `DemoFrame`

```
┌ Try it ───────────────────────────── Reset ┐
│ Instruction: “Point at the card…”          │
├────────────────────────────────────────────┤
│              (the live demo)               │
├────────────────────────────────────────────┤
│ ● You just experienced “Hover”.            │  ← named after the moment happens
└────────────────────────────────────────────┘
```

1. Tell people what to try. 2. Let them do it. 3. **Name what they just felt.** Demos call `experience()` at the key moment; the concept is saved to on-device progress. Each of the 22 demos is code-split (`next/dynamic`) so a page only loads its own.

## The hero map: `components/home/ux-map.tsx`

A mind map that is also the homepage’s first lesson (UXDR-29).

- **Layout** (`ux-map-layout.ts`): measured label sizes in, positions out. Wide stages: hubs on the diagonals, concepts on arcs, a relaxation pass, then a spiral search that guarantees no overlaps. Portrait stages: two branches above the button and two below, in centred rows. Re-runs on resize, when fonts load and when labels switch language. Checked overlap-free at 360–1440 px in Thai, English and Japanese, with and without local names.
- **Motion**: one requestAnimationFrame loop that sleeps when nothing moves. Springs pull every node to its anchor; dragging the button offsets the whole map with per-node lag (the “elastic” feel), dragging a word pulls its related words. Positions are written straight to `transform`, never through React state.
- **Discovering by doing**: hover, active state, click, feedback, focus state, drag and drop, tooltip, toggle and success state are each triggered by using the map itself; the other 13 are discovered in their mini demos. Each discovery marks progress, sends a spark along the branch and queues a one-line callout (announced politely to screen readers).
- **Access**: the button is a normal button; the 22 words are one tab stop (roving `tabindex`, arrow keys move to the nearest word in that direction); a card is a dialog that takes focus and gives it back; Esc closes the innermost thing first. Reduced motion: no burst, drift, springs, sparks or coach pointer.

## The card peek: `ConceptCard` + `components/peeks/`

Every glossary card can turn into a card-sized demo (UXDR-27). The card owns the behaviour; each peek is a small demo file that uses the same `useDemo()` API as the full demos.

| State (`data-peek`) | What you see | How you get there |
| --- | --- | --- |
| `idle` | The card face: term (a link stretched over the card), local name, one sentence, difficulty, **Try it** | — |
| `mist` | A faint mist follows the resting pointer | A real mouse move onto the card |
| `open` | The face blurs out; the demo condenses in: term · *Full lesson →* · ×, the stage, then the hint (→ “You just experienced …”) | Pointer slows for ~0.3 s (hover), or **Try it** (pin: focus moves into the demo) |
| `closing` | A light puff of mist; the face returns; the demo unmounts | Pointer leaves (hover), ×, Esc, a tap or focus outside (pin), or another card opens |

Rules: only one peek at a time (a tiny store); peeks are code-split and start downloading when the pointer arrives; Esc goes to the innermost thing first (a peek’s own dialog, listbox or tooltip calls `preventDefault`); reduced motion keeps the swap but drops the mist. Each peek must fit a stage of about 263 × 170 px (checked at 375, 1024 and 1440 px) and pass axe when opened (44 checks).

## Lab patterns

| Experiment | Pattern | Accessibility notes |
| --- | --- | --- |
| A · UX Detective | Clickable regions on a deliberately flawed checkout; notes per region; hint, reveal, reset | Every region is a real `<button>` with an “Inspect: …” label; findings announced via `aria-live`; flawed UI marked `data-intentionally-flawed`. |
| B · Make It Better | Six segmented controls tune a booking screen; live phone preview; principle checklist | Preview pinned on phones so changes stay visible. |
| C · Which Would You Choose? | Two designs per scenario; choose → trade-offs both ways + “In this context” + principles | No “correct” answer by design; A/B side by side on phones. |
| D · Build a Button | Live `<button>` + six-state strip + health check (label, contrast in every state, target size, feedback) + generated HTML/CSS and React/Tailwind code | Contrast is computed for default, hover and pressed; the focus ring colour is chosen to contrast 3:1 with the page. |

## `data-intentionally-flawed`

Some examples are bad **on purpose** (the Detective checkout, contrast presets, the starting state of Build a Button). They carry `data-intentionally-flawed` so automated accessibility checks skip them — and so anyone reading the code knows the flaw is the lesson, not a bug. Everything around them is still tested.
