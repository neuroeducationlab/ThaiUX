import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/layout";

/** Top of every index page: where you are (eyebrow), what this is (h1), why it matters (lead). */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("pt-12 pb-10 md:pt-20 md:pb-14", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="type-h1 max-w-4xl">{title}</h1>
      {lead ? <p className="type-lead measure-wide mt-5">{lead}</p> : null}
      {children}
    </header>
  );
}
