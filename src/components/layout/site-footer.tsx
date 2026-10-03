import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { format } from "@/i18n/localized";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/layout";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const explore = [
    { href: routes.learn(locale), label: dict.nav.learn },
    { href: routes.glossary(locale), label: dict.nav.glossary },
    { href: routes.lab(locale), label: dict.nav.lab },
    { href: routes.effects(locale), label: dict.nav.effects },
  ];
  const project = [
    { href: routes.about(locale), label: dict.nav.about },
    { href: routes.caseStudy(locale), label: dict.footer.caseStudy },
    { href: routes.designSystem(locale), label: dict.footer.designSystem },
    { href: `${routes.about(locale)}#sources`, label: dict.footer.sources },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-surface-2/60">
      <Container size="wide" className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div className="max-w-sm">
          <Logo href={routes.home(locale)} label={dict.a11y.homeLink} />
          <p className="mt-4 text-[1.0625rem] font-medium text-ink">{dict.footer.tagline}</p>
          <p className="type-caption mt-2">{dict.footer.madeBy}</p>
          <div className="mt-6">
            <ThemeSwitcher />
          </div>
        </div>

        <FooterColumn title={dict.footer.explore} links={explore} />
        <FooterColumn
          title={dict.footer.project}
          links={project}
          external={{ href: site.repo, label: dict.footer.sourceCode, hint: dict.a11y.newTab }}
        />
      </Container>
      <Container size="wide" className="border-t border-line py-6">
        <p className="type-caption">{format(dict.footer.rights, { year: site.year })}</p>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  external,
}: {
  title: string;
  links: { href: string; label: string }[];
  external?: { href: string; label: string; hint: string };
}) {
  return (
    <div>
      <h2 className="type-label mb-4">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center text-ink-2 transition-colors hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
        {external ? (
          <li>
            <a
              href={external.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1 text-ink-2 transition-colors hover:text-ink"
            >
              {external.label}
              <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">{external.hint}</span>
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
