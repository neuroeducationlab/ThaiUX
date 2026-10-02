import { cn } from "@/lib/cn";

/** Page width container with a 16px gutter on phones. */
export function Container({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "default" | "narrow" | "wide" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-[72rem]",
        size === "narrow" && "max-w-[46rem]",
        size === "wide" && "max-w-[80rem]",
        className,
      )}
      {...props}
    />
  );
}

export function Section({
  className,
  tone = "plain",
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "plain" | "tinted" }) {
  return (
    <section
      className={cn("py-16 md:py-24", tone === "tinted" && "bg-surface-2", className)}
      {...props}
    />
  );
}

/** Small label above a heading. Kept short; never the only label. */
export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("type-label mb-3 text-accent-ink", className)} {...props} />;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  id,
  action,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between", className)}>
      <div className="measure-wide">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Tag id={id} className={Tag === "h1" ? "type-h1" : "type-h2"}>
          {title}
        </Tag>
        {lead ? <p className="type-lead mt-4">{lead}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "squircle rounded-[var(--radius-lg)] border border-line bg-surface shadow-xs",
        interactive &&
          "transition-[box-shadow,transform,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function Tag({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "accent" | "success" | "warning" | "error";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] leading-none font-semibold",
        tone === "neutral" && "bg-surface-2 text-ink-2",
        tone === "accent" && "bg-accent-soft text-accent-ink",
        tone === "success" && "bg-success-soft text-success",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "error" && "bg-error-soft text-error",
        className,
      )}
      {...props}
    />
  );
}

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong bg-surface px-1 font-mono text-[0.6875rem] leading-none text-ink-2",
        className,
      )}
      {...props}
    />
  );
}

/** Difficulty shown as three dots plus a text label (never colour alone). */
export function DifficultyDots({ level, label }: { level: 1 | 2 | 3; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn("size-1.5 rounded-full", n <= level ? "bg-accent" : "bg-line-strong")} />
        ))}
      </span>
      {label}
    </span>
  );
}
