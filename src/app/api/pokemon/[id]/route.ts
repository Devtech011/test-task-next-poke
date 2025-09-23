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

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);
  const list = data as Pokemon[];
  let found = list.find((p) => p.id === id);
  if (!found && id >= 1 && id <= 151) {
    // Synthesize a simple record if not present in local JSON
    found = {
      id,
      name: `pokemon-${id}`,
      types: ['normal'],
      height: 10,
      weight: 100,
      base_experience: 100,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  }
  if (!found) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...found,
  });
}


