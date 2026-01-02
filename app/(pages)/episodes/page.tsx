'use client';

import { useEffect, useState } from 'react';
import { EpisodeList } from '@/components/features/episodes/EpisodeList';
import { EpisodeSearch } from '@/components/features/episodes/EpisodeSearch';
import { EpisodeCardSkeleton } from '@/components/features/episodes/EpisodeCardSkeleton';
import { Button } from '@/components/ui/Button';
import { TruthTortoise } from '@/components/features/ai/TruthTortoise';
import { useEpisodes } from '@/lib/hooks/useEpisodes';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function EpisodesPage() {
  const [name, setName] = useState('');
  const [episodeCode, setEpisodeCode] = useState('');
  const [page, setPage] = useState(1);
  const { episodes, totalPages, loading } = useEpisodes(name, episodeCode, page);
  const { t } = useI18n();

  useEffect(() => {
    setPage(1);
  }, [name, episodeCode]);

  const context = `Episodes page. Filters: name="${name || 'any'}", code="${episodeCode || 'any'}". Page ${page} of ${totalPages}.`;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{t('episodes.subtitle')}</p>
        <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl">{t('episodes.title')}</h1>
        <p className="max-w-2xl text-base text-[var(--muted)]">{t('episodes.description')}</p>
      </section>

      <section className="flex flex-col gap-8">
        <EpisodeSearch
          name={name}
          episodeCode={episodeCode}
          onNameChange={setName}
          onEpisodeChange={setEpisodeCode}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <EpisodeCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <EpisodeList
            episodes={episodes}
            emptyMessage={t('episodes.empty', { query: name || episodeCode || t('common.all') })}
          />
        )}

        {episodes.length > 0 ? (
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
