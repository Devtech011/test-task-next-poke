import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/pokemon.json';

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  base_experience: number;
  image: string;
};

type SortOption = 'id' | 'name' | 'height' | 'weight' | 'base_experience';
type SortOrder = 'asc' | 'desc';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = (searchParams.get('search') || '').toLowerCase();
  const type = (searchParams.get('type') || '').toLowerCase();
  const sortBy = (searchParams.get('sortBy') || 'id') as SortOption;
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as SortOrder;

  let list = (data as Pokemon[]).slice();

  // Ensure we have a large enough list (synthesize simple entries up to 151)
  const byId = new Map(list.map((p) => [p.id, p]));
  for (let i = 1; i <= 151; i++) {
    if (!byId.has(i)) {
      byId.set(i, {
        id: i,
        name: `pokemon-${i}`,
        types: ['normal'],
        height: 10,
        weight: 100,
        base_experience: 100,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
      });
    }
  }
  list = Array.from(byId.values());

  if (type) {
    list = list.filter((p) => p.types.map((t) => t.toLowerCase()).includes(type));
  }

  if (search) {
    list = list.filter((p) => p.name.toLowerCase().includes(search));
  }

  list.sort((a, b) => {
    type SortablePokemon = Pick<Pokemon, 'id' | 'name' | 'height' | 'weight' | 'base_experience'>;
    const aVal = (a as SortablePokemon)[sortBy];
    const bVal = (b as SortablePokemon)[sortBy];
    const normalize = (val: string | number) =>
      typeof val === 'string' ? val.toLowerCase() : val;
    const x = normalize(aVal);
    const y = normalize(bVal);
    if (sortOrder === 'asc') return x < y ? -1 : x > y ? 1 : 0;
    return x > y ? -1 : x < y ? 1 : 0;
  });

  const count = list.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const results = list.slice(start, end).map(({ id, name, image }) => ({
    id,
    name,
    url: `/pokemon/${id}`,
    image,
  }));

  return NextResponse.json({ count, results, page, limit });
}


