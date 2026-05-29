"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, KeyRound, DollarSign, TrendingUp } from "lucide-react";
import { Skeleton, Badge } from "@/components/ui";

interface StatsData {
  totalGames: number;
  totalKeysAvailable: number;
  keysDeliveredToday: number;
  totalRevenue: number;
  monthRevenue: number;
  recentOrders: Array<{
    id: string;
    createdAt: string;
    totalAmount: string;
    status: string;
    user: { name: string | null; email: string };
    items: Array<{ game: { title: string } }>;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Jogos Ativos",
      value: stats?.totalGames ?? 0,
      icon: Gamepad2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Keys Disponíveis",
      value: stats?.totalKeysAvailable ?? 0,
      icon: KeyRound,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      title: "Keys Entregues (Hoje)",
      value: stats?.keysDeliveredToday ?? 0,
      icon: TrendingUp,
      color: "text-[--success]",
      bg: "bg-[--success]/10",
    },
    {
      title: "Receita do Mês",
      value: `R$ ${(stats?.monthRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-[--flare]",
      bg: "bg-[--flare]/10",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[--white]">Dashboard</h1>
        <p className="text-[--smoke] mt-1">Visão geral do negócio VAULT.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[--surface] border border-[--border] rounded-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-none ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[--smoke]">{card.title}</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-[--white] font-mono">
                    {card.value}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[--surface] border border-[--border] rounded-md overflow-hidden"
      >
        <div className="p-6 border-b border-[--border]">
          <h2 className="text-xl font-bold text-[--white]">Últimos Pedidos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[--smoke]">
            <thead className="text-xs uppercase bg-[--panel] border-b border-[--border]">
              <tr>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Jogo(s)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : stats?.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[--smoke]">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                stats?.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[--panel] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[--mist]">{order.user.name || "Sem nome"}</p>
                      <p className="text-xs">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {order.items.map(i => i.game.title).join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      {order.status === "DELIVERED" && <Badge variant="success">Entregue</Badge>}
                      {order.status === "PENDING" && <Badge variant="flare">Pendente</Badge>}
                      {order.status !== "DELIVERED" && order.status !== "PENDING" && <Badge variant="danger">Falhou</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[--flare]">
                      R$ {Number(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
