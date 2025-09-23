import React from 'react';

export function PokemonListLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
      <span className="text-gray-600 dark:text-gray-400">Loading Pokémon list...</span>
    </div>
  );
}
