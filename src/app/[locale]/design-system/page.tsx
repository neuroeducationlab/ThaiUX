import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Check, CircleAlert, Minus } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { contrastRatio, WCAG } from "@/lib/contrast";
import { Container, Section } from "@/components/ui/layout";
import { PageHeader } from "@/components/layout/page-header";
import { ComponentGallery } from "@/components/design-system/component-gallery";
import { MotionDemo } from "@/components/design-system/motion-demo";
import { ds } from "@/content/design-system";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return pageMetadata(locale, "/design-system", pick(ds.eyebrow, locale), pick(ds.lead, locale));
}

/**
 * Tokens are parsed from the real stylesheet at build time — one source
 * of truth, so this page can never document a colour the site doesn’t use.
 */
function readTokens() {
  const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  const block = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    return start < 0 ? "" : css.slice(start, css.indexOf("}", start));
  };
  const vars = (b: string) => Object.fromEntries([...b.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [m[1], m[2]]));
  return { light: vars(block(":root")), dark: vars(block(':root[data-theme="dark"]')) };
}

const PAIRS: { token: string; bg: string; kind: "text" | "ui"; decorative?: boolean }[] = [
  { token: "ink", bg: "surface", kind: "text" },
  { token: "ink-2", bg: "surface", kind: "text" },
  { token: "ink-3", bg: "surface", kind: "text", decorative: true },
  { token: "accent", bg: "bg", kind: "ui" },
  { token: "on-accent", bg: "accent", kind: "text" },
  { token: "accent-ink", bg: "surface", kind: "text" },
  { token: "success", bg: "surface", kind: "text" },
  { token: "error", bg: "surface", kind: "text" },
  { token: "warning", bg: "surface", kind: "text" },
  { token: "focus", bg: "bg", kind: "ui" },
  { token: "line-input", bg: "surface", kind: "ui" },
];

const TYPE = [
  { cls: "type-display", name: "Display", spec: "44–92 px · 650" },
  { cls: "type-h1", name: "Heading 1", spec: "36–60 px · 650" },
  { cls: "type-h2", name: "Heading 2", spec: "28–42 px · 650" },
  { cls: "type-h3", name: "Heading 3", spec: "20–24 px · 620" },
  { cls: "type-title", name: "Title", spec: "18 px · 620" },
  { cls: "type-lead", name: "Lead", spec: "18–21 px · 1.6" },
  { cls: "type-body", name: "Body", spec: "17 px · 1.65" },
  { cls: "type-caption", name: "Caption", spec: "14 px · 1.5" },
  { cls: "type-label", name: "Label", spec: "12 px · 600 · caps" },
];

const SPACE = [1, 2, 3, 4, 6, 8, 12, 16, 24];
const RADII = [
  { name: "xs", px: 6 },
  { name: "sm", px: 8 },
  { name: "md", px: 12 },
  { name: "lg", px: 20 },
  { name: "xl", px: 28 },
  { name: "full", px: 999 },
];

export default async function DesignSystemPage() {
  const { locale } = await getI18n();
  const tokens = readTokens();
  const sections = [
    { id: "colour", label: pick(ds.nav.colour, locale) },
    { id: "type", label: pick(ds.nav.type, locale) },
    { id: "space", label: pick(ds.nav.space, locale) },
    { id: "motion", label: pick(ds.nav.motion, locale) },
    { id: "components", label: pick(ds.nav.components, locale) },
    { id: "a11y", label: pick(ds.nav.a11y, locale) },
  ];

  const swatch = (theme: "light" | "dark", p: (typeof PAIRS)[number]) => {
    const t = tokens[theme];
    const fg = t[p.token];
    const bg = t[p.bg];
    const r = fg && bg ? (contrastRatio(fg, bg) ?? 0) : 0;
    const min = p.kind === "text" ? WCAG.aaNormal : WCAG.nonText;
    const ok = r >= min;
    return (
      <span className="flex items-center gap-3">
        <span
          className="flex h-10 w-14 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line text-[0.9375rem] font-semibold"
          style={{ background: bg, color: fg }}
          aria-hidden
        >
          {p.kind === "text" && !p.decorative ? "Aa" : <span className="block h-1.5 w-8 rounded-full" style={{ background: fg }} />}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[0.75rem] text-ink-2">{fg}</span>
          <span className={cn("tabular flex items-center gap-1 text-[0.8125rem] font-semibold", p.decorative ? "text-ink-2" : ok ? "text-success" : "text-error")}>
            {p.decorative ? <Minus className="size-3.5" aria-hidden /> : ok ? <Check className="size-3.5" aria-hidden /> : <CircleAlert className="size-3.5" aria-hidden />}
            {(Math.floor(r * 10) / 10).toFixed(1)} : 1
          </span>
        </span>
      </span>
    );
  };
  const cell = (theme: "light" | "dark", p: (typeof PAIRS)[number]) => (
    <td className="px-4 py-3 align-middle">{swatch(theme, p)}</td>
  );

  return (
    <>
      <Container size="wide">
        <PageHeader eyebrow={pick(ds.eyebrow, locale)} title={pick(ds.title, locale)} lead={pick(ds.lead, locale)}>
          <nav aria-label={pick(ds.eyebrow, locale)} className="mt-8 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[0.875rem] font-medium text-ink-2 transition-colors hover:text-ink">
                {s.label}
              </a>
            ))}
          </nav>
        </PageHeader>
      </Container>

      <Section id="colour" aria-labelledby="colour-h" className="scroll-mt-20 pt-4 md:pt-6">
        <Container size="wide">
          <h2 id="colour-h" className="type-h2">{pick(ds.nav.colour, locale)}</h2>
          <p className="type-lead measure-wide mt-4">{pick(ds.colour.intro, locale)}</p>
          <ul className="mt-8 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface lg:hidden">
            {PAIRS.map((p) => (
              <li key={p.token} className="px-4 py-3">
                <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-mono text-[0.8125rem] font-semibold text-ink">--{p.token}</span>
                  <span className="text-[0.75rem] text-ink-2">
                    {pick(ds.colour.roles[p.token], locale)}
                    {p.decorative ? ` · ${pick(ds.colour.decorative, locale)}` : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3">
                  {(["light", "dark"] as const).map((theme) => (
                    <div key={theme} className="min-w-0">
                      <p className="type-label mb-1 text-ink-2">{pick(ds.colour[theme], locale)}</p>
                      {swatch(theme, p)}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface lg:block">
            <table className="w-full text-left text-[0.9375rem]">
              <thead className="border-b border-line text-[0.8125rem] text-ink-2">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{pick(ds.colour.token, locale)}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{pick(ds.colour.light, locale)}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{pick(ds.colour.dark, locale)}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{pick(ds.colour.use, locale)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PAIRS.map((p) => (
                  <tr key={p.token}>
                    <th scope="row" className="px-4 py-3 align-middle font-normal">
                      <span className="block font-mono text-[0.8125rem] font-semibold text-ink">--{p.token}</span>
                      <span className="block text-[0.75rem] text-ink-2">
                        {pick(ds.colour.on, locale)} --{p.bg}
                      </span>
                    </th>
                    {cell("light", p)}
                    {cell("dark", p)}
                    <td className="px-4 py-3 align-middle text-ink-2">
                      {pick(ds.colour.roles[p.token], locale)}
                      {p.decorative ? <span className="block text-[0.75rem]">({pick(ds.colour.decorative, locale)})</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section id="type" aria-labelledby="type-h" className="scroll-mt-20" tone="tinted">
        <Container size="wide">
          <h2 id="type-h" className="type-h2">{pick(ds.nav.type, locale)}</h2>
          <p className="type-lead measure-wide mt-4">{pick(ds.type.intro, locale)}</p>
          <ul className="mt-8 divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
            {TYPE.map((t) => (
              <li key={t.cls} className="grid gap-1 px-5 py-3.5 md:grid-cols-[10rem_minmax(0,1fr)] md:items-baseline md:gap-6 md:py-4">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[0.875rem] font-semibold text-ink">{t.name}</span>
                  <span className="font-mono text-[0.75rem] text-ink-2">{t.spec}</span>
                </span>
                <span className={cn(t.cls, "block min-w-0 truncate", t.cls === "type-display" && "text-[clamp(2rem,1.4rem+2.6vw,3.5rem)]")} aria-hidden>
                  {pick(ds.type.sample, locale)}
                </span>
              </li>
            ))}
            <li className="grid gap-1 px-5 py-3.5 md:grid-cols-[10rem_minmax(0,1fr)] md:items-baseline md:gap-6 md:py-4">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[0.875rem] font-semibold text-ink">Serif accent</span>
                <span className="font-mono text-[0.75rem] text-ink-2">Instrument Serif</span>
              </span>
              <span lang="en" className="type-serif-accent block text-[2.5rem] leading-none text-accent-ink" aria-hidden>
                Affordance, Feedback
              </span>
            </li>
          </ul>
        </Container>
      </Section>

      <Section id="space" aria-labelledby="space-h" className="scroll-mt-20">
        <Container size="wide">
          <h2 id="space-h" className="type-h2">{pick(ds.nav.space, locale)}</h2>
          <p className="type-lead measure-wide mt-4">{pick(ds.space.intro, locale)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <h3 className="type-title mb-4">{pick(ds.space.spacing, locale)}</h3>
              <ul className="space-y-2">
                {SPACE.map((n) => (
                  <li key={n} className="flex items-center gap-3">
                    <span className="tabular w-12 font-mono text-[0.75rem] text-ink-2">{n * 4}px</span>
                    <span className="h-3 rounded-sm bg-accent/70" style={{ width: n * 4 }} aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <h3 className="type-title mb-4">{pick(ds.space.radius, locale)}</h3>
              <ul className="grid grid-cols-3 gap-4">
                {RADII.map((r) => (
                  <li key={r.name} className="text-center">
                    <span className="mx-auto block size-14 border-2 border-accent bg-accent-soft" style={{ borderRadius: r.px }} aria-hidden />
                    <span className="mt-2 block font-mono text-[0.75rem] text-ink-2">
                      {r.name} · {r.px === 999 ? "∞" : `${r.px}px`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <h3 className="type-title mb-4">{pick(ds.space.shadow, locale)}</h3>
              <ul className="grid grid-cols-2 gap-4">
                {(["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"] as const).map((s) => (
                  <li key={s} className="text-center">
                    <span className={cn("mx-auto block h-14 rounded-[var(--radius-md)] bg-surface", s)} aria-hidden />
                    <span className="mt-2 block font-mono text-[0.75rem] text-ink-2">{s.replace("shadow-", "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="motion" aria-labelledby="motion-h" className="scroll-mt-20" tone="tinted">
        <Container size="wide">
          <h2 id="motion-h" className="type-h2">{pick(ds.nav.motion, locale)}</h2>
          <p className="type-lead measure-wide mt-4 mb-8">{pick(ds.motion.intro, locale)}</p>
          <MotionDemo replay={pick(ds.motion.replay, locale)} />
        </Container>
      </Section>

      <Section id="components" aria-labelledby="components-h" className="scroll-mt-20">
        <Container size="wide">
          <h2 id="components-h" className="type-h2">{pick(ds.nav.components, locale)}</h2>
          <p className="type-lead measure-wide mt-4 mb-8">{pick(ds.components.intro, locale)}</p>
          <ComponentGallery
            labels={{
              buttons: pick(ds.components.buttons, locale),
              controls: pick(ds.components.controls, locale),
              feedback: pick(ds.components.feedback, locale),
            }}
          />
        </Container>
      </Section>

      <Section id="a11y" aria-labelledby="a11y-h" className="scroll-mt-20 border-t border-line">
        <Container size="wide">
          <h2 id="a11y-h" className="type-h2">{pick(ds.nav.a11y, locale)}</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {ds.a11y.items.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success" aria-hidden>
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-ink">{pick(item, locale)}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
