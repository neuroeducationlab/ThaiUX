# 08 · Decision log (UX decision records)

Each record: the decision, the options considered, why, and the trade-off we accepted. “Asked” means Molly decided; “Default” means the brief or a reversible convention decided.

| # | Decision | Options considered | Why | Trade-off | Source |
| --- | --- | --- | --- | --- | --- |
| UXDR-01 | Languages: **TH, EN, 简体中文, 日本語** | + Hindi; Traditional Chinese | Matches Molly’s audiences; India reads English | 4 languages to maintain | Asked |
| UXDR-02 | Chinese script: **Simplified** | Traditional; both | Largest Chinese-reading audience | Taiwan/HK readers get Simplified | Asked |
| UXDR-03 | ~~Brand: **ThaiUX**; Lab keeps “Molly’s UX Lab”~~ — *superseded by UXDR-19* | “UX in Thai”, others | Short, memorable, says what and for whom | “Thai” may read as Thai-only — mitigated by 4 languages | Asked |
| UXDR-04 | **Thai is the default**; unsupported browser languages → English | Always English; always Thai | Thai learners first; everyone else gets the lingua franca | Detection relies on `Accept-Language` | Default |
| UXDR-05 | **Language in every URL** (`/th/…`), remembered only when chosen | Cookie/IP-only switching | Shareable, cacheable, SEO-friendly (hreflang) | Slightly longer URLs | Default |
| UXDR-06 | **English headwords + local names** | Fully translated terms | Learners need the words used at work | Harder for absolute beginners at first | Default |
| UXDR-07 | **Bottom tab bar** on phones | Hamburger menu | Visible IA, thumb reach, one tap to any section | ~68 px of screen | Default |
| UXDR-08 | **Experience first** (DemoFrame names the felt moment) | Text-first lessons | Understanding from doing sticks | A demo per concept (22) to build and maintain | Brief |
| UXDR-09 | **Inter + Noto Sans Thai + Instrument Serif; CJK system fonts** | Thai: Anuphan, IBM Plex Sans Thai; web fonts for CJK | Rendered comparison; CJK web fonts cost megabytes | CJK looks slightly different per OS | Default |
| UXDR-10 | **Kram indigo** as the only accent | Brand blues, teal, multi-accent | Calm, trustworthy, distinct from feedback colours, ≥ 7:1 on paper | Less “playful” | Default |
| UXDR-11 | **Filters in the URL** (`?category=state`) | Local state | Shareable, back button works | Must handle unknown values | Default |
| UXDR-12 | **Progress on the device only** | Accounts; cloud sync | No sign-up, privacy by default, zero backend | No cross-device sync | Brief (lightweight) |
| UXDR-13 | **No analytics** in the MVP | Google Analytics; cookieless analytics | Privacy promise on the About page; nothing to consent to | No usage data yet | Default — revisit with Molly |
| UXDR-14 | **Lab C has no right answer** | Scored quiz | Teaches reasoning from context | Some learners want a verdict | Brief |
| UXDR-15 | **Mark deliberately bad examples** (`data-intentionally-flawed`) | Exempt whole pages from checks | Keeps automated a11y checks meaningful everywhere else | Attribute must be applied with care | Default |
| UXDR-16 | **Pinned previews / inline callouts on phones** | Desktop-like stacked layout | Feedback must stay visible where you act (heuristic #1) | Pinned area uses ~35% of the screen while tuning | Iteration (07) |
| UXDR-17 | **Pre-rendered share images** per language | Generated at request time (Satori) | Real Thai/CJK shaping, zero runtime cost | Re-run `scripts/generate-og.mjs` when copy changes | Default |
| UXDR-18 | **Static generation** for every page | Server rendering | Fast, cheap, resilient on Vercel | Content changes need a redeploy | Default |
| UXDR-19 | Rename the brand **ThaiUX → UXLab** (Oct 2026) | Keep ThaiUX; other names | Molly’s call, made after the first deploy. Drops “Thai” so the name suits all four audiences; the product is still Thai-first | Collides with the section name “Molly’s UX Lab” (kept for now); generic name — check existing use of the domain and social handles. Storage keys (`thaiux:*`) and the GitHub repo name were left unchanged so no learner loses saved progress | Asked |
