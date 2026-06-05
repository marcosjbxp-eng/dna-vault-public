"use client";

import { useState, useEffect, useMemo } from "react";
import { GameGrid } from "@/components/store/GameGrid";
import { Input } from "@/components/ui";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

const GENRES = [
  "Todos",
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
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedGenre && selectedGenre !== "Todos")
          params.set("genre", selectedGenre);

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

  const resultCount = useMemo(() => games.length, [games]);
  const hasActiveFilter = search.length > 0 || selectedGenre !== "Todos";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <p className="font-mono text-[10px] text-[--flare] tracking-[0.3em] mb-3">
          — CATÁLOGO
        </p>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="text-4xl sm:text-5xl font-black text-[--white] tracking-tight">
            Todos os jogos
          </h1>
          {!loading && (
            <span className="font-mono text-xs text-[--smoke] tracking-wider">
              {resultCount.toString().padStart(3, "0")} RESULTADO
              {resultCount === 1 ? "" : "S"}
            </span>
          )}
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[--smoke] pointer-events-none"
        />
        <Input
          placeholder="Buscar por título, desenvolvedor ou gênero…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 pr-10 h-12 text-sm"
          aria-label="Buscar jogos"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[--smoke] hover:text-[--white] transition-colors cursor-pointer"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Genre filter — horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        {GENRES.map((genre) => {
          const active = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors flex-shrink-0 cursor-pointer border ${
                active
                  ? "bg-[--flare] text-[--void] border-[--flare]"
                  : "bg-transparent text-[--smoke] border-[--border] hover:text-[--white] hover:border-[--mist]"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="border border-[--border] bg-[--surface] p-16 text-center">
          <p className="text-[--mist] text-lg font-bold">
            Nenhum jogo encontrado
          </p>
          <p className="text-[--smoke] text-sm mt-2">
            Tente outra busca ou ajuste os filtros.
          </p>
          {hasActiveFilter && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedGenre("Todos");
              }}
              className="mt-5 text-xs font-bold uppercase tracking-wider text-[--flare] hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
}
