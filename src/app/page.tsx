import { Suspense } from "react";
import { PokemonList } from "@/components/pokemon-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { PokemonListLoader } from "@/components/pokemon-list-loader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="pointer-events-none select-none opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
            <div className="h-64 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-950" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <header className="mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              
              <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Pokémon Explorer
              </h1>
              <p className="mt-2 max-w-2xl text-base md:text-lg text-gray-600 dark:text-gray-400">
                Search, filter, and favorite your beloved Pokémon with a clean, fast UI.
              </p>
            </div>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 md:p-6">
          <Suspense fallback={<PokemonListLoader />}>
            <PokemonList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
