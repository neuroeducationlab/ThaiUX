import { BookOpen, FlaskConical, MousePointerClick, Sparkles } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/cn";

/** Learn → Experience → Experiment → Reflect — the loop from the brief, visualised. */
export function LearningLoop({ dict, className }: { dict: Dictionary; className?: string }) {
  const steps = [
    { icon: BookOpen, title: dict.learn.loopLearn, desc: dict.learn.loopLearnDesc },
    { icon: MousePointerClick, title: dict.learn.loopExperience, desc: dict.learn.loopExperienceDesc },
    { icon: FlaskConical, title: dict.learn.loopExperiment, desc: dict.learn.loopExperimentDesc },
    { icon: Sparkles, title: dict.learn.loopReflect, desc: dict.learn.loopReflectDesc },
  ];
  return (
    <ol className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-[var(--radius-lg)] border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent-ink" aria-hidden>
              <s.icon className="size-[1.125rem]" />
            </span>
            <span className="tabular text-[0.8125rem] font-semibold text-ink-3" aria-hidden>
              0{i + 1}
            </span>
          </div>
          <p className="type-title">{s.title}</p>
          <p className="mt-1 text-[0.9375rem] text-ink-2">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}
