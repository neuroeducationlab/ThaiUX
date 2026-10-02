import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — the most used interactive element on UXLab.
 * Every variant has all five states designed: default, hover, active
 * (pressed), focus-visible and disabled; `loading` adds a sixth.
 * Minimum height is 44px for md/lg (Apple HIG / WCAG 2.5.8 friendly).
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out-soft " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:active:scale-100 aria-disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent shadow-sm hover:bg-accent-hover active:bg-accent-press " +
    "disabled:bg-surface-3 disabled:text-ink-3 disabled:shadow-none",
  secondary:
    "bg-surface text-ink border border-line-strong shadow-xs hover:bg-surface-2 hover:border-ink/25 active:bg-surface-3 " +
    "disabled:text-ink-3 disabled:bg-surface-2",
  ghost: "bg-transparent text-ink hover:bg-surface-2 active:bg-surface-3 disabled:text-ink-3",
  quiet:
    "bg-transparent text-accent-ink px-0! h-auto! rounded-sm hover:underline underline-offset-4 decoration-2 active:opacity-70 disabled:text-ink-3",
  danger:
    "bg-error text-white shadow-sm hover:brightness-110 active:brightness-95 dark:text-[#2a0b08] disabled:bg-surface-3 disabled:text-ink-3",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, loadingLabel, className, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, className })}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 animate-spin-slow", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors duration-200",
        "hover:bg-surface-2 hover:text-ink active:bg-surface-3",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
