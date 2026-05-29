"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button, Input, Badge, Skeleton } from "@/components/ui";
import type { Game } from "@/types";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchGames = useCallback(async () => {
    try {
      const url = search ? `/api/games?search=${search}` : "/api/games";
      const res = await fetch(url);
      if (res.ok) setGames(await res.json());
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja inativar ${title}?`)) return;
    try {
      await fetch(`/api/games/${id}`, { method: "DELETE" });
      setGames(games.filter((g) => g.id !== id));
    } catch {
      alert("Erro ao inativar jogo");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[--white]">Jogos</h1>
          <p className="text-[--smoke] mt-1">Gerencie o catálogo da loja.</p>
        </div>
        <Link href="/admin/games/new">
          <Button>
            <Plus size={18} /> Novo Jogo
          </Button>
        </Link>
      </div>

      <div className="bg-[--surface] border border-[--border] rounded-md overflow-hidden">
        <div className="p-4 border-b border-[--border] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--smoke]" />
            <Input
              placeholder="Buscar pelo título..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[--smoke]">
            <thead className="text-xs uppercase bg-[--panel] border-b border-[--border]">
              <tr>
                <th className="px-6 py-4 font-medium">Jogo</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Gêneros</th>
                <th className="px-6 py-4 font-medium">Destaque</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 flex gap-3"><Skeleton className="h-12 w-9 rounded-none" /><Skeleton className="h-4 w-32 mt-2" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[--smoke]">
                    Nenhum jogo encontrado.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-[--panel] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0">
                          <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-[--mist]">{game.title}</p>
                          <p className="text-xs">{game.developer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[--flare]">
                      R$ {Number(game.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-1">
                      {game.genres.slice(0, 2).map((g: string) => (
                        <Badge key={g} variant="default">{g}</Badge>
                      ))}
                      {game.genres.length > 2 && <span className="text-xs">+</span>}
                    </td>
                    <td className="px-6 py-4">
                      {game.featured ? <Badge variant="flare">Sim</Badge> : <span className="text-xs">Não</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/games/${game.id}/edit`}>
                          <Button variant="ghost" size="sm" className="px-2">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <button
                          onClick={() => handleDelete(game.id, game.title)}
                          className="p-2 text-[--danger] hover:bg-[--danger]/10 rounded-none transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
