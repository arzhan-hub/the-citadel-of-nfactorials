'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CharacterDetail, type CharacterDetailData } from '@/components/features/characters/CharacterDetail';
import { CharacterDetailSkeleton } from '@/components/features/characters/CharacterDetailSkeleton';
import { TruthTortoise } from '@/components/features/ai/TruthTortoise';

export default function CharacterPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState<CharacterDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`/api/characters/${id}`);
        const data = await res.json();
        setCharacter(data);
      } catch (error) {
        setCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCharacter();
  }, [id]);

  const context = character
    ? `Character: ${character.name}. Species: ${character.species}. Status: ${character.status}. Gender: ${character.gender}. Origin: ${character.origin.name}. Location: ${character.location.name}. Episodes: ${character.episode.length}.`
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <Link href="/">
        <Button variant="ghost">← Back to search</Button>
      </Link>

      {loading ? (
        <CharacterDetailSkeleton />
      ) : character ? (
        <CharacterDetail character={character} />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          Character not found.
        </div>
      )}
      <TruthTortoise context={context} />
    </main>
  );
}
