# 06 · Low-fidelity wireframes

Sketched before any visual design to fix structure and hierarchy. Fidelity was then raised directly in code, because the questions worth testing were about interaction.

## Home (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▣ UXLab    Home  Learn  Glossary  Lab  Effects  About  [Search ⌘K] [TH] │
├──────────────────────────────────────────────────────────────────────┤
│ (NEW · 21 playable effects, with AI prompts →) ┌ [effect]       [prompt] ┐
│ เรียน UX/UI ผ่านการลอง                        │  Not sure how to make   │
│ ไม่ใช่แค่อ่าน                                    │  your UI stand out?     │
│ Learn UX by experiencing it.  (serif)         │  UXLab is the answer.   │
│ Lead sentence…                                │ [▶ Take the 30-second tour]│
│                                               │ [concept]  [certificate] │
│                                               ├─────────────────────────┤
│                                               │ 1 Pick  2 Copy  3 Learn  4 Cert│
│                                               └─────────────────────────┘
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

## Hero tour — UXDR-31

One button, then four quick parts. The journey row at the bottom is also the progress bar (one segment per part, tap to jump); a ghost pointer shows every move.

```
Poster                                 Part 1 · Pick an effect (10 s)
┌ [effect]              [prompt] ┐     ┌ Part 1/4 · Pick an effect ──────────┐
│   Not sure how to make your UI  │     │ Does your page feel a bit flat?      │
│   stand out?                    │     │ ┌ your-site.com ─────────────────┐  │
│   UXLab is the answer.          │     │ │ ░░░░  plain page  [Sign up] ↖   │  │ “Click… nothing happens”
│   [▶ Take the 30-second tour]   │     │ └────────────────────────────────┘  │
│   Everything you’ll get · pause │     │ [✓Gooey blobs][✓Glow border][Magnetic][Celebration]
│ [concept]         [certificate] │     │ → blobs wipe in, cards glow, button pulls, confetti
├─────────────────────────────────┤     ├──────────────────────────────────────┤
│ 1 Pick  2 Copy  3 Learn  4 Cert │     │ ▬▬▬▬ ──── ──── ────        [❚❚] [✕] │
└─────────────────────────────────┘     └──────────────────────────────────────┘

Part 2 · Copy the prompt (8 s)         Part 3 · Learn by doing (7 s)
┌ Magnetic button  React+Tailwind ┐    [Hover] [Tooltip] [Feedback ← mist → ♥ Liked +1]
│ Create a magnetic button…       │    ✓ You just experienced “Feedback”.
│                 [✓ Copy prompt] │ ←  (22 concepts) (8 modules) (4 experiments)
└──┌ Your AI coding tool ────────┐┘    the Copy button is real: pressing it copies
   │        [Create a magnetic…] │     the prompt and pauses the tour
   │ Added a magnetic button. [⦿]│
   │ [ Paste a prompt…        ➤ ]│
   └─────────────────────────────┘

Part 4 · Get your certificate (7 s)    Finale
 ✓✓✓✓✓✓✓✓ 8/8                          ✦ That’s the tour
┌ UXLab ─── 🔒 → unlocked ────────┐     It’s that easy.
│  CERTIFICATE OF COMPLETION      │     ✓ Pick an effect you love — 21 to choose from  →
│  Your Name   (types in)         │     ✓ Copy its prompt into the AI you vibe-code with →
│  [⬇ Download → ✓ Saved]   (seal)│     ✓ Understand UX/UI terms by playing with them  →
└─────────────────────────────────┘     ✓ Finish 8 modules, get a certificate         →
                                        [Start Module 1 →] [See all 21 effects] ↺ Watch again
```

## Certificate — UXDR-32

```
Home › Learn › Certificate
Certificate
Finish all eight modules and UXLab makes you a certificate in your name…

┌──────────────────────────────────┐   ┌ 🔒 Your certificate is waiting ─┐
│ UXLab                  site.url  │   │ You’ve finished 3 of 8.        │
│   CERTIFICATE OF COMPLETION      │   │ ▬▬▬▬▬▬──────────               │
│        เกียรติบัตร                  │   │ [Continue with Module 4 →]     │
│   Your Name   (SAMPLE watermark) │   └────────────────────────────────┘
│   has completed all eight…       │   Name on the certificate [________]
│   1 What is UX? · 2 … · 8 …      │   (unlocked: [⬇ PNG] [🖨 Print / PDF] [Share])
│ date ────   (seal)   ──── issuer │   Records completion on this device; not accredited.
└──────────────────────────────────┘   Your modules: ✓1 ✓2 ✓3 ○4 ○5 ○6 ○7 ○8
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
