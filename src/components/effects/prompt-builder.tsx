"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import type { PromptParts } from "@/content/effects";
import { effectsCopy as C } from "@/content/effects-copy";
import { useI18n } from "@/i18n/client";
import { pick } from "@/i18n/localized";
import { cn } from "@/lib/cn";
import { CopyPromptButton, StackPicker } from "./prompt-block";
import { buildPrompt } from "./prompt";
import { usePlayground } from "./provider";

const B = C.builder;
const PARTS = C.formula.parts;

function Field({
  index,
  label,
  hint,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  index?: number;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const { locale } = useI18n();
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-2">
        {index ? (
          <span className="tabular flex size-6 shrink-0 items-center justify-center self-center rounded-full bg-accent-soft text-[0.75rem] font-bold text-accent-ink" aria-hidden>
            {index}
          </span>
        ) : null}
        <span className="font-semibold text-ink">{label}</span>
        {hint ? <span className="text-[0.8125rem] text-ink-2">{hint}</span> : null}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        lang="en"
        className="mt-2 h-11 w-full rounded-[var(--radius-sm)] border border-line-input bg-surface px-3.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-2 focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
      {suggestions ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[0.75rem] text-ink-2">{pick(B.suggestions, locale)}:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              lang="en"
              onClick={() => onChange(s)}
              aria-pressed={value === s}
              className={cn(
                "inline-flex min-h-8 items-center rounded-full border px-3 text-[0.8125rem] transition-colors",
                value === s ? "border-accent bg-accent-soft text-accent-ink" : "border-line-strong bg-surface text-ink-2 hover:text-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Fill in the five-part formula and watch the prompt assemble itself. */
export function PromptBuilder() {
  const { locale } = useI18n();
  const { stack } = usePlayground();
  const [build, setBuild] = useState("");
  const [effect, setEffect] = useState("");
  const [trigger, setTrigger] = useState("");
  const [feel, setFeel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [guards, setGuards] = useState<string[]>(B.guardrails.map((g) => g.id));

  const parts: PromptParts = {
    build: build.trim() && /^[a-z]/i.test(build.trim()) && !/^(a|an|the)\s/i.test(build.trim()) ? `${/^[aeiou]/i.test(build.trim()) ? "an" : "a"} ${build.trim()}` : build.trim(),
    effect,
    trigger,
    feel,
    purpose,
    guardrails: B.guardrails
      .filter((g) => guards.includes(g.id))
      .map((g) => g.text)
      .join("; "),
  };
  const started = [build, effect, trigger, feel, purpose].some((v) => v.trim());
  const desc = (i: number) => `${PARTS[i].key} · ${pick(PARTS[i].label, locale)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Field label={pick(B.build, locale)} value={build} onChange={setBuild} placeholder={B.buildPlaceholder} />
        <Field index={1} label={desc(0)} value={effect} onChange={setEffect} placeholder={B.effectPlaceholder} />
        <Field index={2} label={desc(1)} value={trigger} onChange={setTrigger} placeholder={B.triggerPlaceholder} suggestions={B.triggers} />
        <Field index={3} label={desc(2)} value={feel} onChange={setFeel} placeholder={B.feelPlaceholder} suggestions={B.feels} />
        <Field index={4} label={desc(3)} value={purpose} onChange={setPurpose} placeholder={B.purposePlaceholder} />
        <fieldset>
          <legend className="flex items-center gap-2">
            <span className="tabular flex size-6 items-center justify-center rounded-full bg-accent-soft text-[0.75rem] font-bold text-accent-ink" aria-hidden>
              5
            </span>
            <span className="font-semibold text-ink">{pick(B.guardrailsLabel, locale)}</span>
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {B.guardrails.map((g) => {
              const on = guards.includes(g.id);
              return (
                <label
                  key={g.id}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] border px-3 py-2 text-[0.875rem] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus",
                    on ? "border-accent/40 bg-accent-soft text-ink" : "border-line-strong bg-surface text-ink-2",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => setGuards((list) => (e.target.checked ? [...list, g.id] : list.filter((x) => x !== g.id)))}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn("flex size-5 shrink-0 items-center justify-center rounded-[6px] border", on ? "border-accent bg-accent text-on-accent" : "border-line-input bg-surface")}
                  >
                    {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  {pick(g.label, locale)}
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div className="self-start lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h3 className="type-label">{pick(B.output, locale)}</h3>
            <StackPicker />
          </div>
          {started ? (
            <pre lang="en" className="max-h-[26rem] overflow-auto px-4 py-4 font-sans text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink">
              {buildPrompt(parts, stack)}
            </pre>
          ) : (
            <p className="px-4 py-10 text-center text-[0.9375rem] text-ink-2">{pick(B.empty, locale)}</p>
          )}
          <div className="border-t border-line px-4 py-3">
            <CopyPromptButton parts={parts} className="w-full justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
