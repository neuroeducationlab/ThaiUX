"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/client";
import { KineticText } from "../kinetic-text";
import { Stage, useEffectEnv, useStagePointer } from "../engine";

/* CJK system fonts have few weights, so Chinese and Japanese pages show the
   effect on a Latin phrase, where Inter’s variable weight axis shines. */
const LINES: Record<string, string[]> = {
  th: ["ออกแบบ", "เพื่อคน"],
  en: ["Design", "for people"],
  zh: ["Design", "for people"],
  ja: ["Design", "for people"],
};

export default function KineticType() {
  const env = useEffectEnv();
  const { locale } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  useStagePointer(stageRef);

  return (
    <Stage ref={stageRef} className="@container bg-surface">
      <div lang={locale === "th" ? undefined : "en"} className="absolute inset-0 flex items-center justify-center">
        <KineticText
          lines={LINES[locale] ?? LINES.en}
          track={stageRef}
          active={env.active}
          sweep
          radius={env.full ? 230 : 150}
          min={250}
          max={900}
          className="text-center text-[clamp(2.25rem,13cqw,5.75rem)] leading-[1.05] tracking-tight text-ink [:lang(th)_&]:leading-[1.3]"
        />
      </div>
    </Stage>
  );
}
