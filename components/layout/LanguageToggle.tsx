'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSelect = (nextLang: typeof lang) => {
    setLang(nextLang);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)] sm:min-w-[130px] sm:px-5 sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {t(`lang.${lang}`)}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs shadow-lg">
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
              lang === 'en' ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'text-[var(--muted)]'
            }`}
            onClick={() => handleSelect('en')}
          >
            {t('lang.en')}
          </button>
          <button
            type="button"
            className={`mt-1 w-full rounded-lg px-3 py-2 text-left transition-colors ${
              lang === 'ru' ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'text-[var(--muted)]'
            }`}
            onClick={() => handleSelect('ru')}
          >
            {t('lang.ru')}
          </button>
          <button
            type="button"
            className={`mt-1 w-full rounded-lg px-3 py-2 text-left transition-colors ${
              lang === 'kk' ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'text-[var(--muted)]'
            }`}
            onClick={() => handleSelect('kk')}
          >
            {t('lang.kk')}
          </button>
        </div>
      )}
    </div>
  );
}
