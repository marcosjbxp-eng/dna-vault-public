"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Plus, AlertCircle } from "lucide-react";
import { Button, Modal, Badge, Skeleton } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import Image from "next/image";

interface KeyStats {
  id: string;
  title: string;
  coverUrl: string;
  available: number;
  reserved: number;
  delivered: number;
  refunded: number;
  total: number;
}

export default function AdminKeysPage() {
  const { addToast } = useUIStore();
  const [gamesStats, setGamesStats] = useState<KeyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [keysInput, setKeysInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchKeysStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/keys/stats");
      if (res.ok) {
        const data = await res.json();
        setGamesStats(data);
      }
    } catch {
      addToast("Erro ao carregar estatísticas de chaves.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchKeysStats();
  }, [fetchKeysStats]);

  const handleUpload = async () => {
    if (!selectedGameId || !keysInput.trim()) return;

    const keysArray = keysInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length >= 8);

    if (keysArray.length === 0) {
      addToast("Nenhuma key válida encontrada.", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: selectedGameId, keys: keysArray }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data || "Erro no upload");

      addToast(data.message, "success");
      setModalOpen(false);
      setKeysInput("");
      fetchKeysStats(); // Atualiza a tabela após o upload bem-sucedido!
    } catch {
      addToast("Falha no upload das chaves.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[--white]">Estoque de Keys</h1>
          <p className="text-[--smoke] mt-1">Gerencie a disponibilidade por jogo.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Upload size={18} /> Adicionar Lote
        </Button>
      </div>

      <div className="bg-[--surface] border border-[--border] rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[--smoke]">
            <thead className="text-xs uppercase bg-[--panel] border-b border-[--border]">
              <tr>
                <th className="px-6 py-4 font-medium">Jogo</th>
                <th className="px-6 py-4 font-medium text-center">Disponíveis</th>
                <th className="px-6 py-4 font-medium text-center">Reservadas</th>
                <th className="px-6 py-4 font-medium text-center">Entregues</th>
                <th className="px-6 py-4 font-medium text-center">Total</th>
                <th className="px-6 py-4 font-medium text-right">Status do Estoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 flex gap-3"><Skeleton className="h-12 w-9 rounded-none" /><Skeleton className="h-4 w-32 mt-2" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 flex justify-end"><Skeleton className="h-6 w-20" /></td>
                  </tr>
                ))
              ) : gamesStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[--smoke]">
                    Nenhum jogo cadastrado ou ativo.
                  </td>
                </tr>
              ) : (
                gamesStats.map((game) => (
                  <tr key={game.id} className="hover:bg-[--panel] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 overflow-hidden flex-shrink-0">
                          <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-[--mist]">{game.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-[--white]">
                      {game.available}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[--smoke]">
                      {game.reserved}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[--smoke]">
                      {game.delivered}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[--smoke]">
                      {game.total}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {game.available === 0 ? (
                          <Badge variant="danger">Esgotado</Badge>
                        ) : game.available < 5 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[--danger]">
                            <AlertCircle size={14} /> Estoque Baixo
                          </span>
                        ) : (
                          <Badge variant="success">Ok</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Upload de Keys em Lote">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[--smoke] mb-1.5 block">Jogo *</label>
            <select
              className="w-full bg-[--panel] border border-[--border] rounded-none px-4 py-2.5 text-sm text-[--mist] focus:outline-none focus:border-[--ice-dim]"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              <option value="">Selecione um jogo</option>
              {gamesStats.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[--smoke] mb-1.5 block">
              Cole as Keys (uma por linha) *
            </label>
            <textarea
              value={keysInput}
              onChange={(e) => setKeysInput(e.target.value)}
              className="w-full bg-[--panel] border border-[--border] rounded-none px-4 py-3 text-sm text-[--mist] font-mono min-h-[200px] focus:outline-none focus:border-[--ice-dim]"
              placeholder="XXXX-YYYY-ZZZZ&#10;AAAA-BBBB-CCCC"
            />
            <p className="text-xs text-[--smoke] mt-2">
              Keys com menos de 8 caracteres serão descartadas. Duplicadas são filtradas no banco.
            </p>
          </div>
          <Button className="w-full" onClick={handleUpload} loading={uploading} disabled={!selectedGameId || !keysInput.trim()}>
            <Plus size={18} /> Salvar Keys no Banco
          </Button>
        </div>
      </Modal>
    </div>
  );
}
