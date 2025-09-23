'use client';

import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/lib/api';

export function usePokemonList(page = 1, limit = 20, params?: {
  search?: string;
  type?: string;
  sortBy?: 'id' | 'name' | 'height' | 'weight' | 'base_experience';
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['pokemon', 'server', page, limit, params?.search || '', params?.type || '', params?.sortBy || 'id', params?.sortOrder || 'asc'],
    queryFn: ({ signal }) =>
      pokemonApi.getPokemonListServer({
        page,
        limit,
        search: params?.search,
        type: params?.type,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
        signal,
      }),
    staleTime: 60 * 1000,
  });
}

export function usePokemon(id: string | number) {
  return useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: ({ signal }) => pokemonApi.getPokemon(id, signal),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePokemonTypes() {
  return useQuery({
    queryKey: ['pokemon', 'types-local'],
    queryFn: ({ signal }) => pokemonApi.getPokemonTypes(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes - types don't change often
  });
}

export function usePokemonSearch(query: string) {
  return useQuery({
    queryKey: ['pokemon', 'search', query],
    queryFn: ({ signal }) => pokemonApi.getPokemonListServer({ page: 1, limit: 50, search: query, signal }),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
