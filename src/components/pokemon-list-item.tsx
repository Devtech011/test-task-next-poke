'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatPokemonName } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PokemonListItemProps {
  pokemon: {
    id: number;
    name: string;
    url: string;
    image: string;
  };
  className?: string;
  toggleFavoriteOptimistic: (id: number) => void;
  isFavorite: (id: number) => boolean
}

export function PokemonListItem({ pokemon, className, toggleFavoriteOptimistic, isFavorite }: PokemonListItemProps) {
  const isFav = isFavorite(pokemon.id);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border border-gray-200/70 dark:border-gray-800/60 shadow-sm hover:shadow-lg transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-[1.01] bg-white dark:bg-gray-900',
        className
      )}
    >
      <Link href={`/pokemon/${pokemon.id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-gray-900 dark:text-white">{formatPokemonName(pokemon.name)}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavoriteOptimistic(pokemon.id);
                }}
                variant="ghost"
                size="icon"
                className={cn(
                  'transition-colors',
                  isFav ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                )}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? <Star className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-3">
            <Image
              src={pokemon.image}
              alt={formatPokemonName(pokemon.name)}
              width={96}
              height={96}
              className="w-24 h-24 object-contain transition-transform duration-200 ease-out group-hover:scale-105"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Click to view details</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
