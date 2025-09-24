"use client";

import { usePokemon } from "@/hooks/use-pokemon";
import { useFavorites } from "@/hooks/use-favorites";
import { formatPokemonName, getOfficialArtworkUrl, cn } from "@/lib/utils";
import { ArrowLeft, Heart, Star, Weight, Ruler, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "./loading-skeleton";
import { ErrorDisplay } from "./error-display";
import { ThemeToggle } from "./theme-toggle";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface PokemonDetailProps {
  id: string;
}

export function PokemonDetail({ id }: PokemonDetailProps) {
  const { data: pokemon, isLoading, error, refetch } = usePokemon(id);
  const { isFavorite, toggleFavoriteOptimistic } = useFavorites();
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [errorNote, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load note from localStorage for this id
  useEffect(() => {
    const stored = localStorage.getItem("pokemon_notes");
    if (stored) {
      try {
        const arr = JSON.parse(stored) as { id: string; note: string }[];
        const found = arr.find((n) => n.id === id);
        setSavedNote(found ? found.note : null);
        setNote(found ? found.note : "");
        setIsEditing(false);
      } catch {
        setSavedNote(null);
        setNote("");
        setIsEditing(false);
      }
    } else {
      setSavedNote(null);
      setNote("");
      setIsEditing(false);
    }
  }, [id]);

  // Add or update note handler
  function handleAddOrUpdateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) {
      setError("Note cannot be empty.");
      return;
    }
    setError("");
    const stored = localStorage.getItem("pokemon_notes");
    let arr: { id: string; note: string }[] = [];
    if (stored) {
      try {
        arr = JSON.parse(stored);
      } catch {
        arr = [];
      }
    }
    // Remove any existing note for this id
    arr = arr.filter((n) => n.id !== id);
    const newNote = { id, note: note.trim() };
    arr.push(newNote);
    localStorage.setItem("pokemon_notes", JSON.stringify(arr));
    setSavedNote(newNote.note);
    setIsEditing(false);
  }

  // Delete note handler
  function handleDeleteNote() {
    const stored = localStorage.getItem("pokemon_notes");
    let arr: { id: string; note: string }[] = [];
    if (stored) {
      try {
        arr = JSON.parse(stored);
      } catch {
        arr = [];
      }
    }
    arr = arr.filter((n) => n.id !== id);
    localStorage.setItem("pokemon_notes", JSON.stringify(arr));
    setSavedNote(null);
    setNote("");
    setIsEditing(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="w-full h-64" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pokémon List
            </Link>
            <ErrorDisplay error={error} onRetry={() => refetch()} />
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pokémon List
            </Link>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Pokémon not found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(pokemon.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pokémon List
            </Link>
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src={getOfficialArtworkUrl(pokemon.id)}
                    alt={formatPokemonName(pokemon.name)}
                    width={256}
                    height={256}
                    className="w-64 h-64 object-contain"
                  />
                </div>

                {/* Types */}
                <div className="flex justify-center gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-full",
                        getTypeColor(type)
                      )}
                    >
                      {formatPokemonName(type)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPokemonName(pokemon.name)}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleFavoriteOptimistic(pokemon.id)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isFav
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-yellow-500"
                    )}
                    aria-label={
                      isFav ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFav ? (
                      <Star className="w-6 h-6 fill-current" />
                    ) : (
                      <Heart className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Height
                      </p>
                      <p className="font-semibold">{pokemon.height / 10}m</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Weight
                      </p>
                      <p className="font-semibold">{pokemon.weight / 10}kg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Base Experience
                      </p>
                      <p className="font-semibold">{pokemon.base_experience}</p>
                    </div>
                  </div>
                </div>

                {/* Note Form */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Note
                  </h2>
                  {savedNote !== null && !isEditing ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          {savedNote}
                        </span>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => {
                              setIsEditing(true);
                              setNote(savedNote);
                              setError("");
                            }}
                            variant={"secondary"}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={handleDeleteNote}
                            variant={"destructive"}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleAddOrUpdateNote}
                      className="flex flex-col gap-2"
                    >
                      <Textarea
                        className="border rounded p-2"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="Write your note here..."
                      />
                      {errorNote && (
                        <span className="text-red-500 text-sm">{errorNote}</span>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          // className="px-4 py-2"
                        >
                          {savedNote !== null ? "Update Note" : "Add Note"}
                        </Button>
                        {savedNote !== null && (
                          <Button
                            type="button"
                            variant="secondary"
                            // className="px-4 py-2"
                            onClick={() => {
                              setIsEditing(false);
                              setNote(savedNote);
                              setError("");
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
                {/* End Note Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    fire: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    water: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    electric:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    grass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ice: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    fighting:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    poison:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    ground: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    flying: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    psychic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    bug: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    rock: "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
    ghost:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    dragon:
      "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    dark: "bg-gray-800 text-gray-100 dark:bg-gray-600 dark:text-gray-900",
    steel: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
    fairy: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  };

  return colors[type] || colors.normal;
}
