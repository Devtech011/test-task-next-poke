'use client';

import { Pokemon } from '@/types/pokemon';
import { formatPokemonName, getOfficialArtworkUrl, cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/hooks/use-favorites';

interface PokemonCardProps {
  pokemon: Pokemon;
  className?: string;
}

export function PokemonCard({ pokemon, className }: PokemonCardProps) {
  const { isFavorite, toggleFavoriteOptimistic } = useFavorites();
  const isFav = isFavorite(pokemon.id);

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/70 dark:border-gray-800/60 shadow-sm hover:shadow-lg transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-[1.01] overflow-hidden',
        className
      )}
    >
      <Link href={`/pokemon/${pokemon.id}`} className="block">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatPokemonName(pokemon.name)}
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavoriteOptimistic(pokemon.id);
                }}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  isFav ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                )}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? (
                  <Star className="w-4 h-4 fill-current" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mb-3">
            <Image
              src={getOfficialArtworkUrl(pokemon.id)}
              alt={formatPokemonName(pokemon.name)}
              width={96}
              height={96}
              className="w-24 h-24 object-contain transition-transform duration-200 ease-out group-hover:scale-105"
            />
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getTypeColor(type)
                )}
              >
                {formatPokemonName(type)}
              </span>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Height: {pokemon.height / 10}m</span>
              <span>Weight: {pokemon.weight / 10}kg</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    fire: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    water: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    electric: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    grass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ice: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    fighting: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    poison: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    ground: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    flying: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    psychic: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    bug: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    rock: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200',
    ghost: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    dragon: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    dark: 'bg-gray-800 text-gray-100 dark:bg-gray-600 dark:text-gray-900',
    steel: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
    fairy: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  };
  
  return colors[type] || colors.normal;
}
