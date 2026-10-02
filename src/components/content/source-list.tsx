import { ArrowUpRight } from "lucide-react";
import { getSource, type SourceId } from "@/content/sources";

/** “Explore further” — always cite, always link out, never copy. */
export function SourceList({ ids, note, newTab }: { ids: SourceId[]; note: string; newTab: string }) {
  return (
    <div>
      <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
        {ids.map((id) => {
          const s = getSource(id);
          return (
            <li key={id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                lang="en"
                className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ink group-hover:underline group-hover:underline-offset-4">{s.title}</span>
                  <span className="mt-0.5 block text-[0.8125rem] text-ink-2">
                    {s.publisher}
                    {s.author ? ` · ${s.author}` : ""}
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" aria-hidden />
                <span className="sr-only">{newTab}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="type-caption mt-3">{note}</p>
    </div>
  );
}
