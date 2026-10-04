# 06 · Low-fidelity wireframes

Sketched before any visual design to fix structure and hierarchy. Fidelity was then raised directly in code, because the questions worth testing were about interaction.

## Home (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▣ UXLab         Learn  Glossary  Lab  About        [Search ⌘K] [TH] │
├──────────────────────────────────────────────────────────────────────┤
│ (NEW · 21 playable effects, with AI prompts →) ┌ This map is a lesson 3/22┐
│ เรียน UX/UI ผ่านการลอง                        │ (Hover✓)─INTERACTION  ┌COMPONENTS
│ ไม่ใช่แค่อ่าน                                    │ (Click)      ╲       ╱ (Modal)│
│ Learn UX by experiencing it.  (serif)         │        [ Press me ] ← drag me  │
│ Lead sentence…                                │ PRINCIPLES ╱   ╲ STATES (Focus)│
│                                               │ hint …  [Other names] [▶ Show]│
│                                               └───────────────────────────────┘
│ [Start exploring →] [Enter the Lab]                                   │
│ 22 concepts · 8 modules · 4 experiments · 4 languages                 │
├──────────────────────────────────────────────────────────────────────┤
│ NEW · Effects  Play first. Then build it with AI.  [See all 21 →]     │
│ Point at a card to stop it, then play.               [‹] [❚❚] [›]     │
│ ◄ [water][parallax][x-ray][wow][badge][holo]…  drifts; hover = play  │
├──────────────────────────────────────────────────────────────────────┤
│ WHAT IS UX?  UX is how it feels…          [UX · experience] [UI · …] │
│ 01 Problem → 02 Decision → 03 Interaction → 04 Result                 │
├──────────────────────────────────────────────────────────────────────┤
│ 22 concepts you can touch                              [See all →]   │
│ [Interaction] [Components] [Principles] [States]                      │
├──────────────────────────────────────────────────────────────────────┤
│ INTERACTIVE PREVIEW   Affordance (serif)      ┌ Try it ─────────────┐ │
│ one sentence · problem · Open lesson →        │   live demo          │ │
├──────────────────────────────────────────────────────────────────────┤
│ Molly’s UX Lab                                   [Enter the Lab →]   │
│ [A Detective] [B Make it better] [C Which?] [D Build a button]        │
├──────────────────────────────────────────────────────────────────────┤
│ Learning path  [Start Module 1]        01 What is UX?   02 Users …   │
├──────────────────────────────────────────────────────────────────────┤
│              Made in Thailand, for anyone starting out               │
│                 [The story] [Case study →]   ไทย English 中文 日本語   │
└──────────────────────────────────────────────────────────────────────┘
```

## Hero map (desktop) — UXDR-29

```
┌ ✦ This map is a lesson ─────────────────────── 5 of 22 experienced ▬▬──┐
│  (Toggle) (Swipe)                         (Button) (Input field)        │
│ (Scroll) (Drag and drop✓)       ┌ Hover ✓ ──────────────┐ (Dropdown)    │
│ (Click✓)   INTERACTION 3/6 ─╮   │ It reacted before you │  COMPONENTS   │
│ (Hover✓) ·····spark·····    ╰── │ clicked…  (callout)   │   0/5 (Modal) │
│                         [ Press me ]   ← drag: the map follows on springs │
│ (Accessibility)  PRINCIPLES ╱        ╲ STATES 2/7   (Active state✓)     │
│ (Usability) (Feedback✓)  ┌ AFFORDANCE ─────────────── ✕ ┐ (Focus ✓)     │
│ (Affordance) ← click ──→ │ The cues that tell people…   │ (Loading)     │
│                          │ [▶ Try it here]              │               │
│                          │ 📖 Full lesson            →  │               │
│                          │ 🎓 Module 1 · What is UX? →  │               │
│                          │ ⚗ Lab A · UX Detective    →  │               │
│                          │ ✦ Effect · Flower cursor  →  │               │
│                          │ Connects to (Button)(Hover)  │               │
├──────────────────────────└──────────────────────────────┘───────────────┤
│ Point at the button, press it, drag it…   Other names (○)  [▶ Show me] │
└─────────────────────────────────────────────────────────────────────────┘
 phones: INTERACTION + COMPONENTS above the button, PRINCIPLES + STATES below
```

## Glossary card peek (desktop) — UXDR-27

```
 rest the pointer ~0.3 s        the mist thickens…          …and clears to a live demo
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ [Interaction]            │  │ ░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░ │  │ Hover    Full lesson →  ×│
│ Hover            (serif) │  │ ░░▒▒▓▓▓▓▓▓▓▓▓▓▓▒▒▒░░░░░░ │  │ ┌ · · · · · · · · · · ┐  │
│ โฮเวอร์ · …              │  │ ░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░░░░ │  │ │ [▣ Mango rice View→] │  │
│ One sentence…   ░▒▓▒░    │  │ ░░▒▒▓▓▓▓▓▓▓▓▓▓▓▒▒▒░░░░░░ │  │ │    state: hover      │  │
│                  ░▒░     │  │ ░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░ │  │ └ · · · · · · · · · · ┘  │
│ ●○○ Beginner  [▶ Try it] │  │                          │  │ ● hint → ✓ You just…     │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
  the term is the link; Try it      face blurs out,               leave or Esc → back;
  opens the same demo on touch      demo condenses in             Try it → focus moves in
```

## Concept page (phone)

```
┌──────────────────────────┐
│ ▣ UXLab         🔍  TH   │
│ Home › Glossary › States │
│ [State] ●●○  3 of 22 [Save]
│ Hover            (serif) │
│ 🔊 /ˈhɒv.ər/  โฮเวอร์      │
│ One sentence in Thai…    │
│ ┌ Try it ──────── Reset ┐│
│ │ instruction           ││
│ │      live demo        ││
│ │ ● You just experienced││
│ └───────────────────────┘│
│ Problem · How · In practice
│ Common mistake · Takeaway│
│ Related · Taught in · Sources
├──────────────────────────┤
│ ⌂   📖   ▤   ⚗   ⓘ       │  ← bottom tab bar
└──────────────────────────┘
```

## Lab experiment (phone) — after usability iteration

```
┌──────────────────────────┐
│ header (sticky)          │
├──────────────────────────┤
│ ┌ preview (sticky) ────┐ │  ← pinned while controls scroll (B, D)
│ │   [ Book a table → ] │ │
│ │ ✓Label ✓Contrast …   │ │
│ └──────────────────────┘ │
│ Label  [___________]     │
│ Style  (Filled|Outline…) │
│ Colour ● ● ● ● ● ●       │
│ Size   (S|M|L)           │
│ …                        │
│ Health check 3 of 4      │
└──────────────────────────┘
```
