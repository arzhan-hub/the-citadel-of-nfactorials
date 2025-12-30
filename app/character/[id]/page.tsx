"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Хук чтобы узнать id из URL
import Link from 'next/link';

interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];
}

export default function CharacterPage() {
  const { id } = useParams(); // Берем ID из адреса страницы
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        // Запрос к НАШЕМУ новому API роуту
        const res = await fetch(`/api/characters/${id}`);
        const data = await res.json();
        setCharacter(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (!character) {
    return <div className="min-h-screen bg-gray-900 text-white p-10 text-center">Character not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-10 flex flex-col items-center">
      
      {/* Кнопка Назад */}
      <Link href="/" className="self-start mb-8 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors flex items-center gap-2">
        ← Back to Search
      </Link>

      <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row animate-fade-in border border-gray-700">
        
        {/* Картинка */}
        <div className="md:w-1/2 relative h-96 md:h-auto">
          <img 
            src={character.image} 
            alt={character.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Информация */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2 text-white">{character.name}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
               character.status === 'Alive' ? 'bg-green-500 text-black' : 
               character.status === 'Dead' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
            }`}>
              {character.status}
            </span>
            <span className="text-xl text-gray-300">{character.species}</span>
          </div>

          <div className="space-y-4 text-gray-300">
            <div>
              <span className="block text-xs uppercase text-gray-500 font-bold">Gender</span>
              <span className="text-lg text-white">{character.gender}</span>
            </div>
            
            <div>
              <span className="block text-xs uppercase text-gray-500 font-bold">Origin</span>
              <span className="text-lg text-white">{character.origin.name}</span>
            </div>

            <div>
              <span className="block text-xs uppercase text-gray-500 font-bold">Last Known Location</span>
              <span className="text-lg text-green-400">{character.location.name}</span>
            </div>

             <div>
              <span className="block text-xs uppercase text-gray-500 font-bold">Episodes</span>
              <span className="text-lg text-white">{character.episode.length} episodes</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}