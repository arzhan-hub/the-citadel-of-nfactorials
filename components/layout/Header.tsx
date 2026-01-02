'use client';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { CursorToggle } from '@/components/layout/CursorToggle';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { PortalLink } from '@/components/ui/PortalLink';

const navItems = [
  { href: '/', labelKey: 'nav.characters' },
  { href: '/episodes', labelKey: 'nav.episodes' },
  { href: '/locations', labelKey: 'nav.locations' },
  { href: '/truth-tortoise-ai', labelKey: 'nav.truthTortoise' },
];

export function Header() {
  const { t } = useI18n();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-6">
        <PortalLink
          href="/"
          data-portal-pulse="true"
          className="flex items-center gap-3 text-lg font-bold tracking-wide text-[var(--foreground)] sm:gap-4 sm:text-xl"
        >
          <img src="/citadel.svg" alt="Citadel logo" className="h-14 w-14 object-contain sm:h-20 sm:w-20" />
          <span className="flex flex-col leading-[1.1]">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:text-base">
              {t('brand.citadelOf')}
            </span>
            <span className="text-xl sm:text-2xl">{t('brand.nFactorials')}</span>
          </span>
        </PortalLink>
        <nav className="flex w-full flex-nowrap items-center gap-4 overflow-x-auto text-sm font-semibold text-[var(--muted)] sm:w-auto sm:flex-wrap sm:gap-5 sm:text-base">
          {navItems.map((item) => {
            const label = t(item.labelKey);
            const isTortoise = item.labelKey === 'nav.truthTortoise';
            return (
              <PortalLink
                key={item.href}
                href={item.href}
                data-portal-pulse="true"
                className={`whitespace-nowrap transition-colors hover:text-[var(--foreground)] ${
                  isTortoise ? 'text-[var(--accent)]' : ''
                }`}
              >
                {label}
              </PortalLink>
            );
          })}
        </nav>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          <div className="hidden sm:block">
            <CursorToggle />
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
