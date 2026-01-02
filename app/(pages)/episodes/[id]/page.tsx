'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { EpisodeDetail, type EpisodeDetailData } from '@/components/features/episodes/EpisodeDetail';
import { EpisodeDetailSkeleton } from '@/components/features/episodes/EpisodeDetailSkeleton';
import { TruthTortoise } from '@/components/features/ai/TruthTortoise';
import episodeDescriptions from '@/lib/data/episode-descriptions.json';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { PortalLink } from '@/components/ui/PortalLink';

export default function EpisodePage() {
  const { id } = useParams();
  const [episode, setEpisode] = useState<EpisodeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await fetch(`/api/episodes/${id}`);
        const data = await res.json();
        setEpisode(data);
      } catch (error) {
        setEpisode(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEpisode();
  }, [id]);

  const descriptionEntry = episode?.episode
    ? (episodeDescriptions as Record<string, { description?: string; source?: string }>)[episode.episode]
    : undefined;

  const context = episode
    ? `Episode: ${episode.name} (${episode.episode}). Air date: ${episode.air_date}. Characters: ${episode.characters.length}.`
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <PortalLink href="/episodes">
        <Button variant="ghost">{t('episode.back')}</Button>
      </PortalLink>

      {loading ? (
        <EpisodeDetailSkeleton />
      ) : episode ? (
        <EpisodeDetail
          episode={episode}
          description={descriptionEntry?.description}
          source={descriptionEntry?.source}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          {t('episode.notFound')}
        </div>
      )}

      <TruthTortoise context={context} />
    </main>
  );
}
