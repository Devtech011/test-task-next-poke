import { Pokemon, PokemonTypesResponse } from '@/types/pokemon';

const API_BASE_URL = '';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithErrorHandling<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(url, { signal });
    
    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    throw new ApiError('Failed to fetch data');
  }
}

export const pokemonApi = {
  async getPokemonListServer(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    sortBy?: 'id' | 'name' | 'height' | 'weight' | 'base_experience';
    sortOrder?: 'asc' | 'desc';
    signal?: AbortSignal;
  }): Promise<{ count: number; results: Array<{ id: number; name: string; url: string, image: string }>; page: number; limit: number; }> {
    const { page = 1, limit = 20, search = '', type = '', sortBy = 'id', sortOrder = 'asc', signal } = params;
    const url = `${API_BASE_URL}/api/pokemon?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    return fetchWithErrorHandling(url, signal);
  },

  async getPokemon(id: string | number, signal?: AbortSignal): Promise<Pokemon> {
    const url = `${API_BASE_URL}/api/pokemon/${id}`;
    return fetchWithErrorHandling<Pokemon>(url, signal);
  },

  async getPokemonTypes(signal?: AbortSignal): Promise<PokemonTypesResponse> {
    const url = `${API_BASE_URL}/api/pokemon/types`;
    return fetchWithErrorHandling<PokemonTypesResponse>(url, signal);
  },
};
