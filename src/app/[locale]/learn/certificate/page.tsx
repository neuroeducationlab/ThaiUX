import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/config";
import { pick } from "@/i18n/localized";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CertificateView, type CertificateLabels } from "@/components/certificate/certificate-view";
import { modules } from "@/content/modules";
import { certificate as c } from "@/content/certificate";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return pageMetadata(locale, "/learn/certificate", pick(c.title, locale), pick(c.subtitle, locale));
}

/** The certificate for finishing all eight modules (UXDR-32). */
export default async function CertificatePage() {
  const { locale, dict } = await getI18n();
  const labels: CertificateLabels = {
    lockedTitle: pick(c.lockedTitle, locale),
    lockedBody: pick(c.lockedBody, locale),
    continue: pick(c.continue, locale),
    unlockedTitle: pick(c.unlockedTitle, locale),
    unlockedBody: pick(c.unlockedBody, locale),
    nameLabel: pick(c.nameLabel, locale),
    nameHint: pick(c.nameHint, locale),
    nameHintLocked: pick(c.nameHintLocked, locale),
    download: pick(c.download, locale),
    print: pick(c.print, locale),
    share: pick(c.share, locale),
    downloaded: pick(c.downloaded, locale),
    previewLabel: pick(c.previewLabel, locale),
    sampleNote: pick(c.sampleNote, locale),
    honest: pick(c.honest, locale),
    modulesTitle: pick(c.modulesTitle, locale),
    progress: dict.progress.modulesCompleted,
    module: dict.learn.module,
    completed: dict.progress.completed,
    notYet: dict.progress.notYet,
    art: {
      kicker: pick(c.art.kicker, locale),
      title: pick(c.art.title, locale),
      presented: pick(c.art.presented, locale),
      name: pick(c.art.name, locale),
      completed: pick(c.art.completed, locale),
      date: pick(c.art.date, locale),
      issuer: pick(c.art.issuer, locale),
      tagline: pick(c.art.tagline, locale),
      sample: pick(c.art.sample, locale),
    },
  };

  return (
    <Container size="wide" className="pt-8 md:pt-12">
      <Breadcrumbs
        label={dict.a11y.breadcrumb}
        items={[
          { href: routes.home(locale), label: dict.common.home },
          { href: routes.learn(locale), label: dict.learn.title },
          { label: pick(c.title, locale) },
        ]}
      />
      <header className="max-w-3xl pb-10 md:pb-12">
        <h1 className="type-h1">{pick(c.title, locale)}</h1>
        <p className="type-lead measure-wide mt-5">{pick(c.subtitle, locale)}</p>
      </header>
      <CertificateView
        locale={locale}
        dateLocale={localeMeta[locale].htmlLang}
        site={new URL(site.url).host}
        modules={modules.map((m) => ({ id: m.id, number: m.number, title: pick(m.title, locale), href: routes.module(locale, m.id) }))}
        labels={labels}
      />
    </Container>
  );
}
