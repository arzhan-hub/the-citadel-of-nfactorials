'use client';

import { useEffect, useState } from 'react';
import { LocationList } from '@/components/features/locations/LocationList';
import { LocationSearch } from '@/components/features/locations/LocationSearch';
import { LocationCardSkeleton } from '@/components/features/locations/LocationCardSkeleton';
import { Button } from '@/components/ui/Button';
import { TruthTortoise } from '@/components/features/ai/TruthTortoise';
import { useLocations } from '@/lib/hooks/useLocations';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function LocationsPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [dimension, setDimension] = useState('');
  const [page, setPage] = useState(1);
  const { locations, totalPages, loading } = useLocations(name, type, dimension, page);
  const { t } = useI18n();

  useEffect(() => {
    setPage(1);
  }, [name, type, dimension]);

  const context = `Locations page. Filters: name="${name || 'any'}", type="${type || 'any'}", dimension="${dimension || 'any'}". Page ${page} of ${totalPages}.`;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{t('locations.subtitle')}</p>
        <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl">{t('locations.title')}</h1>
        <p className="max-w-2xl text-base text-[var(--muted)]">{t('locations.description')}</p>
      </section>

      <section className="flex flex-col gap-8">
        <LocationSearch
          name={name}
          type={type}
          dimension={dimension}
          onNameChange={setName}
          onTypeChange={setType}
          onDimensionChange={setDimension}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LocationCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <LocationList
            locations={locations}
            emptyMessage={t('locations.empty', { query: name || type || dimension || t('common.all') })}
          />
        )}

        {locations.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
              {t('pagination.prev')}
            </Button>
            <span className="text-sm text-[var(--muted)]">
              {t('pagination.pageOf', { page, total: totalPages })}
            </span>
            <Button
              variant="ghost"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              {t('pagination.next')}
            </Button>
          </div>
        ) : null}
      </section>

      <TruthTortoise context={context} />
    </main>
  );
}
