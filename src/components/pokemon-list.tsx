"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { usePokemonList, usePokemonTypes } from "@/hooks/use-pokemon";
import { useURLState } from "@/hooks/use-url-state";
import { useMemo } from "react";
import { ErrorDisplay } from "./error-display";
import { FilterControls } from "./filter-controls";
import { PokemonListSkeleton } from "./loading-skeleton";
import { Pagination } from "./pagination";
import { PokemonListItem } from "./pokemon-list-item";
import { SearchBar } from "./search-bar";
// import { SortOption, SortOrder } from '@/types/pokemon';

const ITEMS_PER_PAGE = 20;

export function PokemonList() {
  const { state, updateState, resetState } = useURLState();
  const { isFavorite, toggleFavoriteOptimistic } = useFavorites();

  // Fetch data from local API with server-side filters/pagination
  const {
    data: pokemonListData,
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList,
  } = usePokemonList(state.page, ITEMS_PER_PAGE, {
    search: state.search,
    type: state.type,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  });
  const { data: typesData, isLoading: isLoadingTypes } = usePokemonTypes();

  // Process and filter data
  const processedPokemon = useMemo(() => {
    const results =
      (pokemonListData?.results as Array<{
        id: number;
        name: string;
        url: string;
        image: string;
      }>) || [];
    let pokemon = results.map(
      (item: { id: number; name: string; url: string; image: string }) => ({
        id: item.id,
        name: item.name,
        url: item.url,
        image: item.image,
      })
    );
    if (state.showFavorites) {
      pokemon = pokemon.filter((p) => isFavorite(p.id));
    }
    return pokemon;
  }, [pokemonListData, state.showFavorites, isFavorite]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    const count = (pokemonListData as { count?: number })?.count || 0;
    return Math.ceil(count / ITEMS_PER_PAGE);
  }, [pokemonListData]);

  if (listError) {
    return <ErrorDisplay error={listError} onRetry={() => refetchList()} />;
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-8 border border-blue-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="search"
            >
              Search
            </label>
            <SearchBar
              value={state.search}
              onChange={(search) => updateState({ search })}
              placeholder="Search Pokémon by name..."
              className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="filters"
            >
              Filters & Sort
            </label>
            <div id="filters">
              {isLoadingTypes ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md h-[190px]"></div>
                </div>
              ) : (
                <FilterControls
                  type={state.type}
                  onTypeChange={(type) => updateState({ type })}
                  sortBy={state.sortBy}
                  onSortByChange={(sortBy) => updateState({ sortBy })}
                  sortOrder={state.sortOrder}
                  onSortOrderChange={(sortOrder) => updateState({ sortOrder })}
                  showFavorites={state.showFavorites}
                  onShowFavoritesChange={(showFavorites) =>
                    updateState({ showFavorites })
                  }
                  types={typesData?.results || []}
                  resetState={resetState}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm p-2 bg-white dark:bg-gray-800"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLoadingList
              ? "Loading..."
              : `Showing ${processedPokemon.length} Pokémon`}
          </p>
        </div>

        {isLoadingList ? (
          <PokemonListSkeleton />
        ) : processedPokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {state.search || state.showFavorites
                ? "No Pokémon found matching your criteria."
                : "No Pokémon available."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {processedPokemon.map((pokemon, i) => (
                <PokemonListItem
                  key={`pokemon-${pokemon.id}-${i}`}
                  pokemon={pokemon}
                  toggleFavoriteOptimistic={toggleFavoriteOptimistic}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
            {!state.showFavorites && totalPages > 1 && (
              <Pagination
                currentPage={state.page}
                totalPages={totalPages}
                onPageChange={(page) => updateState({ page })}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
