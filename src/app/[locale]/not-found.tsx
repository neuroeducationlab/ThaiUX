import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Home, Info, LibraryBig } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";

/**
 * The 404 is itself a lesson in error states: say what happened,
 * don't blame the person, and offer clear ways forward.
 */
export default async function NotFound() {
  const { locale, dict } = await getI18n();
  const links = [
    { href: routes.home(locale), label: dict.notFound.goHome, Icon: Home },
    { href: routes.learn(locale), label: dict.nav.learn, Icon: BookOpen },
    { href: routes.glossary(locale), label: dict.nav.glossary, Icon: LibraryBig },
    { href: routes.lab(locale), label: dict.lab.title, Icon: FlaskConical },
    { href: routes.about(locale), label: dict.nav.about, Icon: Info },
  ];

  return (
    <Container size="narrow" className="py-20 md:py-28">
      <p lang="en" className="type-serif-accent text-[clamp(4.5rem,3rem+6vw,8rem)] leading-none text-accent-ink" aria-hidden>
        404
      </p>
      <h1 className="type-h1 mt-6">{dict.notFound.title}</h1>
      <p className="type-lead mt-4">{dict.notFound.body}</p>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {links.map(({ href, label, Icon }, i) => (
          <li key={href} className={i === 0 ? "sm:col-span-2" : undefined}>
            <Link
              href={href}
              className={
                i === 0
                  ? "group flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-md)] bg-accent px-5 font-semibold text-on-accent transition-colors hover:bg-accent-hover"
                  : "group flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-5 font-medium text-ink transition-colors hover:bg-surface-2"
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="size-5" aria-hidden /> {label}
              </span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 rounded-[var(--radius-md)] bg-surface-2 p-4 text-[0.9375rem] text-ink-2">{dict.notFound.note}</p>
    </Container>
  );
}
