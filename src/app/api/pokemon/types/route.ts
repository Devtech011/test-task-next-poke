import data from '@/data/pokemon.json';
import { NextResponse } from 'next/server';

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  base_experience: number;
};

export async function GET() {
  const list = data as Pokemon[];
  const uniqueTypes = Array.from(new Set(list.flatMap((p) => p.types))).sort();
  const results = uniqueTypes.map((t) => ({ name: t, url: `/api/pokemon/types/${t}` }));
  return NextResponse.json({ results });
}


