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

## Lab patterns

| Experiment | Pattern | Accessibility notes |
| --- | --- | --- |
| A · UX Detective | Clickable regions on a deliberately flawed checkout; notes per region; hint, reveal, reset | Every region is a real `<button>` with an “Inspect: …” label; findings announced via `aria-live`; flawed UI marked `data-intentionally-flawed`. |
| B · Make It Better | Six segmented controls tune a booking screen; live phone preview; principle checklist | Preview pinned on phones so changes stay visible. |
| C · Which Would You Choose? | Two designs per scenario; choose → trade-offs both ways + “In this context” + principles | No “correct” answer by design; A/B side by side on phones. |
| D · Build a Button | Live `<button>` + six-state strip + health check (label, contrast in every state, target size, feedback) + generated HTML/CSS and React/Tailwind code | Contrast is computed for default, hover and pressed; the focus ring colour is chosen to contrast 3:1 with the page. |

## `data-intentionally-flawed`

Some examples are bad **on purpose** (the Detective checkout, contrast presets, the starting state of Build a Button). They carry `data-intentionally-flawed` so automated accessibility checks skip them — and so anyone reading the code knows the flaw is the lesson, not a bug. Everything around them is still tested.
