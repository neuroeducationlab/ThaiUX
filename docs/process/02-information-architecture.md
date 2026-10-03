# 02 · Information architecture

## Sitemap

```
/{locale}                         Home
├── /learn                        Learning path (8 modules)
│   └── /learn/{module}           Module: scenario → what → why → topics → example → takeaway → reflect → sources
├── /glossary                     22 concepts, filter by category (?category=…), search
│   └── /glossary/{term}          Concept: one-minute summary → demo → problem → how → in practice → mistake → takeaway
├── /lab                          Molly’s UX Lab (4 experiments) + Real-World UX (coming soon)
│   └── /lab/{experiment}         ux-detective · make-it-better · which-would-you-choose · build-a-button
├── /effects                      Effects library: 19 live effects, filter by category (?category=…), prompt formula, prompt builder
│   └── /effects/{effect}         Effect: live stage → why it works / use it for / avoid it for → five-part AI prompt → related concepts
├── /about                        Story, principles, process, privacy, #sources (reading list + copyright)
│   └── /about/case-study         Portfolio case study
├── /design-system                Tokens (read from globals.css), type, space, motion, components, a11y rules
└── (anything else)               Localized 404
```

`{locale}` ∈ `th` (default) · `en` · `zh` (Simplified) · `ja`. **61 pages per language, 244 pre-rendered.**

## Navigation model

| Context | Pattern | Why |
| --- | --- | --- |
| Desktop | Top bar: Learn · Glossary · Lab · Effects · About + Search (⌘K) + Language | Five sections fit; search is always one key away. |
| Phone | Bottom tab bar: Home · Learn · Glossary · Lab · Effects | Thumb reach and permanent visibility; a hamburger hides the IA (UXDR-07). About lives in the footer on phones (UXDR-20). |
| In-page | Breadcrumbs on detail pages; sticky “In this module” table of contents on desktop | Orientation (“where am I?”) and quick jumps. |
| Between lessons | Previous / next module, next experiment, related concepts | Keeps momentum without a dead end. |

`aria-current="page"` marks the current tab; sections stay highlighted on their child pages.

## URL and language rules

- Every URL carries its language, so a shared link opens in the language it was shared in.
- `/` and un-prefixed paths are redirected by `src/proxy.ts`:
  1. a remembered choice (`NEXT_LOCALE` cookie, set only when someone picks a language);
  2. otherwise the best match from `Accept-Language`;
  3. a browser language we don’t offer (e.g. Hindi) → **English**; no header at all → **Thai**.
- `hreflang` alternates on every page, `x-default` → English; `sitemap.xml` lists all four versions of every page.

## Content model

All content is typed data in `src/content` (see [05](./05-content-plan.md)):

```
Concept      id, term (EN headword), ipa, localTerm, categories, difficulty,
             short, instruction, demo, problem, how[], inPractice[], mistake,
             takeaway, related[], sources[]
Module       id, number, title, summary, minutes, scenario, what[], why[],
             topics[], example, takeaway, reflect, concepts[], lab[], sources[]
Experiment   id, letter, title, question, summary, minutes, skills[], concepts[]
Source       title, publisher, author?, url, kind
```

`Localized<T>` requires `th` and `en`; `zh`/`ja` fall back to English until translated.

## Key user flows

1. **Social link → concept → “aha”**: lands on `/th/glossary/hover` → reads one sentence → tries the demo → “You just experienced Hover” → related concept.
2. **Beginner path**: Home → Start Module 1 → example → takeaway → reflect → next module → progress saved on device.
3. **Practice**: Lab → Experiment → interact → completion card → related concepts → next experiment.
4. **Look-up**: ⌘K → type in any language/script (“โฮเวอร์”, “悬停”) → concept.
5. **Inspire → build**: Effects → play with a card → *Copy prompt* → paste into an AI coding tool; or *How to build* → read why it works → tune the prompt → write your own in the prompt builder.
