"use client";

import { useState, useEffect } from "react";
import { GameGrid } from "@/components/store/GameGrid";
import { Input } from "@/components/ui";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const GENRES = [
  "Ação",
  "Aventura",
  "RPG",
  "FPS",
  "Estratégia",
  "Esporte",
  "Corrida",
  "Indie",
  "Terror",
  "Simulação",
];

interface GameData {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  price: number;
  genres: string[];
  developer: string;
}

export default function StorePage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedGenre) params.set("genre", selectedGenre);

        const res = await fetch(`/api/games?${params.toString()}`);
        const data = await res.json();
        setGames(
          data.map((g: Record<string, unknown>) => ({
            ...g,
            price: Number(g.price),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchGames, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-[--white]">Loja</h1>
        <p className="text-[--smoke] mt-2">
          Explore nosso catálogo completo de jogos digitais.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--smoke]"
          />
          <Input
            placeholder="Buscar jogos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Buscar jogos"
          />
        </div>

        {/* Genre filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <SlidersHorizontal size={16} className="text-[--smoke] flex-shrink-0" />
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-none border transition-colors flex-shrink-0 cursor-pointer ${
              !selectedGenre
                ? "bg-[--flare]/10 text-[--flare] border-[--flare]/20"
                : "bg-[--panel] text-[--smoke] border-[--border] hover:text-[--white]"
            }`}
          >
            Todos
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() =>
                setSelectedGenre(selectedGenre === genre ? null : genre)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-none border transition-colors flex-shrink-0 cursor-pointer ${
                selectedGenre === genre
                  ? "bg-[--ice]/10 text-[--ice] border-[--ice]/20"
                  : "bg-[--panel] text-[--smoke] border-[--border] hover:text-[--white]"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}
