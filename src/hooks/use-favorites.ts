'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'pokemon-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  const toggleFavoriteOptimistic = useCallback((id: number) => {
    // Optimistically update the UI immediately
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });

    // Save to localStorage with a small delay to simulate network request
    setTimeout(() => {
      try {
        const currentFavorites = Array.from(favorites);
        const isCurrentlyFavorite = currentFavorites.includes(id);
        const newFavorites = isCurrentlyFavorite 
          ? currentFavorites.filter(favId => favId !== id)
          : [...currentFavorites, id];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
        // Revert optimistic update on error
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (newFavorites.has(id)) {
            newFavorites.delete(id);
          } else {
            newFavorites.add(id);
          }
          return newFavorites;
        });
      }
    }, 100);
  }, [favorites]);

  const isFavorite = useCallback((id: number) => {
    return favorites.has(id);
  }, [favorites]);

  const addFavorite = useCallback((id: number) => {
    setFavorites(prev => new Set(prev).add(id));
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(id);
      return newFavorites;
    });
  }, []);

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    toggleFavoriteOptimistic,
    addFavorite,
    removeFavorite,
    isLoaded
  };
}
