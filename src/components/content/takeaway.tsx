import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";

/** The one sentence worth remembering — styled as an editorial pull quote. */
export function Takeaway({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={cn("squircle relative overflow-hidden rounded-[var(--radius-xl)] bg-ink px-6 py-8 text-bg sm:px-10 sm:py-10", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-accent opacity-40 blur-3xl"
      />
      <figcaption className="relative mb-4 flex items-center gap-2 text-[0.8125rem] font-semibold tracking-wide text-bg/70 uppercase">
        <Lightbulb className="size-4" aria-hidden />
        {label}
      </figcaption>
      <blockquote className="relative text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] leading-snug font-semibold tracking-[-0.01em] text-balance">
        {children}
      </blockquote>
    </figure>
  );
}
