import { PokemonDetail } from '@/components/pokemon-detail';

interface PokemonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = await params;
  return <PokemonDetail id={id} />;
}
