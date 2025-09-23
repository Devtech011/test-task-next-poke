'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { SortOption, SortOrder } from '@/types/pokemon';

export interface URLState {
  search: string;
  type: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
  page: number;
  showFavorites: boolean;
}

const DEFAULT_STATE: URLState = {
  search: '',
  type: '',
  sortBy: 'id',
  sortOrder: 'asc',
  page: 1,
  showFavorites: false,
};

export function useURLState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useMemo((): URLState => {
    return {
      search: searchParams.get('q') || DEFAULT_STATE.search,
      type: searchParams.get('type') || DEFAULT_STATE.type,
      sortBy: (searchParams.get('sortBy') as SortOption) || DEFAULT_STATE.sortBy,
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || DEFAULT_STATE.sortOrder,
      page: parseInt(searchParams.get('page') || '1', 10),
      showFavorites: searchParams.get('favorites') === 'true',
    };
  }, [searchParams]);

  const updateState = useCallback((updates: Partial<URLState>) => {
    const newState = { ...state, ...updates };
    console.log(newState)
    // Reset page to 1 when search, type, or sort changes
    if (updates.search !== undefined || updates.type !== undefined || 
        updates.sortBy !== undefined || updates.sortOrder !== undefined) {
      newState.page = 1;
    }

    const params = new URLSearchParams();
    
    if (newState.search) params.set('q', newState.search);
    if (searchParams.get('q') && !newState.search) {
      params.delete('q');
    }
    if (newState.type) params.set('type', newState.type);
    if (searchParams.get('type') && !newState.type) {
      params.delete('type');
    }
    if (newState.sortBy !== DEFAULT_STATE.sortBy) params.set('sortBy', newState.sortBy);
    if (newState.sortOrder !== DEFAULT_STATE.sortOrder) params.set('sortOrder', newState.sortOrder);
    if (newState.page > 1) params.set('page', newState.page.toString());
    if (newState.showFavorites) params.set('favorites', 'true');
    if (searchParams.get('favorites') === 'true' && !newState.showFavorites) {
      params.delete('favorites');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    router.push(window.location.pathname + newUrl, { scroll: false });
  }, [state, router, searchParams]);

  const resetState = useCallback(() => {
    router.push(window.location.pathname, { scroll: false });
  }, [router]);

  return {
    state,
    updateState,
    resetState,
  };
}
