"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { ArrowRight, Circle, CircleCheck, Download, Lock, PartyPopper, Printer, Share2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { format } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/controls";
import { toast } from "@/components/ui/toast";
import { useHydrated, useProgress } from "@/components/progress/store";
import { CERT_H, CERT_W, certFonts, drawCertificate, loadCertFonts, type CertArt } from "./draw";

export type CertificateLabels = {
  lockedTitle: string;
  lockedBody: string;
  continue: string;
  unlockedTitle: string;
  unlockedBody: string;
  nameLabel: string;
  nameHint: string;
  nameHintLocked: string;
  download: string;
  print: string;
  share: string;
  downloaded: string;
  previewLabel: string;
  sampleNote: string;
  honest: string;
  modulesTitle: string;
  progress: string;
  module: string;
  completed: string;
  notYet: string;
  art: { kicker: string; title: string; presented: string; name: string; completed: string; date: string; issuer: string; tagline: string; sample: string };
};

export type CertificateModule = { id: string; number: number; title: string; href: string };

/* The name and the date it was earned, kept on this device (UXDR-32) */
const KEY = "thaiux:certificate:v1";
const listeners = new Set<() => void>();
type CertRecord = { name: string; issued: string | null };

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function save(record: CertRecord) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* storage blocked — the name just won't be remembered */
  }
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
function parse(raw: string | null): CertRecord {
  try {
    const p = raw ? (JSON.parse(raw) as Partial<CertRecord>) : null;
    return { name: typeof p?.name === "string" ? p.name : "", issued: typeof p?.issued === "string" ? p.issued : null };
  } catch {
    return { name: "", issued: null };
  }
}
const noSubscribe = () => () => {};
const today = () => new Date().toISOString().slice(0, 10);
/** Noon, so the day never shifts with the time zone. */
const formatDay = (iso: string, dateLocale: string) => new Intl.DateTimeFormat(dateLocale, { dateStyle: "long" }).format(new Date(`${iso}T12:00:00`));

/**
 * Finish every module and the certificate unlocks: type a name, download
 * it as an image, or print it / save it as a PDF. Before that it is a
 * preview — marked as a sample — so people can see what they’re working
 * towards, and which module comes next.
 */
export function CertificateView({
  locale,
  dateLocale,
  site,
  modules,
  labels,
}: {
  locale: Locale;
  dateLocale: string;
  site: string;
  modules: CertificateModule[];
  labels: CertificateLabels;
}) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const record = useMemo(() => parse(raw), [raw]);
  const shareable = useSyncExternalStore(noSubscribe, () => typeof navigator.canShare === "function", () => false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const total = modules.length;
  const done = modules.filter((m) => progress.completed.includes(m.id)).length;
  const unlocked = hydrated && done === total;
  const next = modules.find((m) => !progress.completed.includes(m.id)) ?? modules[0];
  const name = record.name.trim();

  // The day it was earned is stamped the first time it unlocks
  useEffect(() => {
    if (unlocked && !record.issued) save({ ...record, issued: today() });
  }, [unlocked, record]);

  // Draw (again once the fonts have arrived)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hydrated) return;
    let alive = true;
    const art: CertArt = {
      locale,
      kicker: labels.art.kicker,
      title: labels.art.title,
      presented: labels.art.presented,
      name: name || labels.art.name,
      placeholder: !name,
      completed: labels.art.completed,
      modules: modules.map((m) => m.title),
      date: format(labels.art.date, { date: formatDay(record.issued ?? today(), dateLocale) }),
      issuer: labels.art.issuer,
      tagline: labels.art.tagline,
      site,
      sample: unlocked ? undefined : labels.art.sample,
    };
    const fonts = certFonts(locale);
    const paint = () => alive && drawCertificate(canvas, art, fonts);
    paint();
    loadCertFonts(fonts, Object.values(art).flat().join(" ")).then(paint);
    return () => {
      alive = false;
    };
  }, [hydrated, unlocked, name, record.issued, locale, dateLocale, site, labels, modules]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob(resolve, "image/png");
    });
  const fileName = "UXLab-certificate.png";

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast(labels.downloaded);
  };

  // Print just the certificate, one A4 landscape page (see .cert-print in globals.css)
  const print = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.className = "cert-print";
    img.alt = "";
    img.src = canvas.toDataURL("image/png");
    document.body.append(img);
    await img.decode().catch(() => {});
    const cleanup = () => {
      img.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  const share = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (!navigator.canShare?.({ files: [file] })) return download();
    await navigator.share({ files: [file], title: labels.art.title }).catch(() => {});
  };

  const progressText = format(labels.progress, { done, total });
  const alt = `${labels.previewLabel}: ${labels.art.title} — ${name || labels.art.name}, ${labels.art.completed}.${
    unlocked && record.issued ? ` ${format(labels.art.date, { date: formatDay(record.issued, dateLocale) })}.` : ` (${labels.art.sample})`
  }`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-start lg:gap-12">
      <figure className="lg:sticky lg:top-24">
        <canvas
          ref={canvasRef}
          width={CERT_W}
          height={CERT_H}
          role="img"
          aria-label={alt}
          className="block aspect-[2000/1414] h-auto w-full rounded-[var(--radius-lg)] bg-[#fbf8f1] shadow-lg ring-1 ring-line"
        />
        {hydrated && !unlocked ? <figcaption className="mt-3 text-[0.875rem] text-ink-2">{labels.sampleNote}</figcaption> : null}
      </figure>

      <div className={cn("transition-opacity duration-300", hydrated ? "opacity-100" : "opacity-0")}>
        {unlocked ? (
          <div className="rounded-[var(--radius-lg)] border border-success/30 bg-success-soft p-5">
            <p className="flex items-center gap-2 text-[1.125rem] leading-snug font-semibold text-success">
              <PartyPopper className="size-5 shrink-0" aria-hidden /> {format(labels.unlockedTitle, { total })}
            </p>
            <p className="mt-1.5 text-[0.9375rem] text-ink">{labels.unlockedBody}</p>
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-xs">
            <p className="flex items-center gap-2 text-[1.125rem] leading-snug font-semibold text-ink">
              <Lock className="size-5 shrink-0 text-accent-ink" aria-hidden /> {labels.lockedTitle}
            </p>
            <p className="mt-1.5 text-[0.9375rem] text-ink-2">{format(labels.lockedBody, { total, done })}</p>
            <ProgressBar value={done} max={total} label={progressText} className="mt-4" />
            <ButtonLink href={next.href} className="mt-5">
              {format(labels.continue, { n: next.number })} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="cert-name" className="font-medium text-ink">
            {labels.nameLabel}
          </label>
          <input
            id="cert-name"
            type="text"
            value={record.name}
            maxLength={60}
            autoComplete="name"
            placeholder={labels.art.name}
            aria-describedby="cert-name-hint"
            onChange={(e) => save({ ...record, name: e.target.value })}
            className="mt-2 block h-12 w-full rounded-[var(--radius-md)] border border-line-input bg-surface px-4 text-[1.0625rem] text-ink placeholder:text-ink-3 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <p id="cert-name-hint" className="type-caption mt-2">
            {unlocked ? labels.nameHint : labels.nameHintLocked}
          </p>
        </div>

        {unlocked ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={download}>
              <Download className="size-4" aria-hidden /> {labels.download}
            </Button>
            <Button variant="secondary" onClick={print}>
              <Printer className="size-4" aria-hidden /> {labels.print}
            </Button>
            {shareable ? (
              <Button variant="ghost" onClick={share}>
                <Share2 className="size-4" aria-hidden /> {labels.share}
              </Button>
            ) : null}
          </div>
        ) : null}

        <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-2">{labels.honest}</p>

        <section aria-labelledby="cert-modules" className="mt-8">
          <h2 id="cert-modules" className="type-label mb-3">
            {labels.modulesTitle}
          </h2>
          <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
            {modules.map((m, i) => {
              const ok = progress.completed.includes(m.id);
              return (
                <li key={m.id} className={cn(i > 0 && "border-t border-line")}>
                  <Link href={m.href} className="flex min-h-12 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2">
                    {ok ? <CircleCheck className="size-5 shrink-0 text-success" aria-hidden /> : <Circle className="size-5 shrink-0 text-ink-3" aria-hidden />}
                    <span className="tabular w-16 shrink-0 text-[0.8125rem] text-ink-2">{format(labels.module, { n: m.number })}</span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] text-ink">{m.title}</span>
                    <span className="sr-only">— {ok ? labels.completed : labels.notYet}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* one A4 landscape page when printing */}
      <style>{"@media print { @page { size: A4 landscape; margin: 0; } }"}</style>
    </div>
  );
}
