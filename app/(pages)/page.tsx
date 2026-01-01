'use client';

import { useEffect, useState } from 'react';
import { CharacterList } from '@/components/features/characters/CharacterList';
import { CharacterSearch } from '@/components/features/characters/CharacterSearch';
import { CharacterCardSkeleton } from '@/components/features/characters/CharacterCardSkeleton';
import { TruthTortoise } from '@/components/features/ai/TruthTortoise';
import { Button } from '@/components/ui/Button';
import { useCharacters } from '@/lib/hooks/useCharacters';

export default function CharactersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { characters, totalPages, loading } = useCharacters(search, page);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Citadel database</p>
        <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl">Character search</h1>
        <p className="max-w-2xl text-base text-[var(--muted)]">
          Browse every known character from the multiverse. Use search to filter and pagination for deep dives.
        </p>
      </section>

      <section className="flex flex-col gap-8">
        <CharacterSearch value={search} onChange={setSearch} />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <CharacterCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <CharacterList
            characters={characters}
            emptyMessage={`No characters found for "${search || 'all'}".`}
          />
        )}

        {characters.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-[var(--muted)]">
              Page <span className="font-semibold text-[var(--foreground)]">{page}</span> of {totalPages}
            </span>
            <Button
              variant="ghost"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>
      <TruthTortoise context="General questions about Rick and Morty characters and lore." />
    </main>
  );
}
