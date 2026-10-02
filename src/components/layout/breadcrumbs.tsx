import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** “You are here” — part of the IA promise that people always know where they are. */
export function Breadcrumbs({ items, label }: { items: { href?: string; label: string; lang?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="mb-8">
      <ol className="flex flex-wrap items-center gap-1 text-[0.8125rem] text-ink-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="rounded-sm transition-colors hover:text-ink hover:underline underline-offset-4" lang={item.lang}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-ink" : undefined} lang={item.lang}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight className="size-3.5 text-ink-3" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
