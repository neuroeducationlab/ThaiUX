import Link from "next/link";
import { cn } from "@/lib/cn";

/** UXLab mark: a rounded "button" with a pointer — learning by touching. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--accent)" />
      <rect x="7" y="9.5" width="18" height="9" rx="4.5" fill="var(--on-accent)" opacity="0.28" />
      <path
        d="M15.2 12.6v10.6l2.7-2.5 1.9 4.3 2-0.9-1.9-4.2h3.7z"
        fill="var(--on-accent)"
        stroke="var(--accent)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group -ml-1 inline-flex items-center gap-2 rounded-full py-1 pr-2 pl-1"
    >
      <LogoMark className="transition-transform duration-300 ease-out-soft group-hover:-rotate-6 group-active:scale-95" />
      <span lang="en" className="text-[1.1875rem] font-semibold tracking-[-0.02em] text-ink">
        UX<span className="type-serif-accent text-[1.3rem] text-accent-ink">Lab</span>
      </span>
    </Link>
  );
}
