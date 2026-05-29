"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input, Badge, Skeleton } from "@/components/ui";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reutilizando endpoint de stats p/ mock, o ideal é ter /api/admin/orders
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.recentOrders || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[--white]">Pedidos</h1>
        <p className="text-[--smoke] mt-1">Histórico completo de transações.</p>
      </div>

      <div className="bg-[--surface] border border-[--border] rounded-md overflow-hidden">
        <div className="p-4 border-b border-[--border] flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--smoke]" />
            <Input placeholder="Buscar por ID ou Email..." className="pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[--smoke]">
            <thead className="text-xs uppercase bg-[--panel] border-b border-[--border]">
              <tr>
                <th className="px-6 py-4 font-medium">Data/ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Itens</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[--smoke]">
                    Nenhum pedido registrado.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[--panel] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[--mist]">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                      <p className="text-[10px] font-mono text-[--smoke] mt-1">{order.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[--mist]">{order.user.name || "N/A"}</p>
                      <p className="text-xs">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {order.items.length} {order.items.length > 1 ? "itens" : "item"}
                    </td>
                    <td className="px-6 py-4">
                      {order.status === "DELIVERED" && <Badge variant="success">Entregue</Badge>}
                      {order.status === "PENDING" && <Badge variant="flare">Pendente</Badge>}
                      {order.status === "FAILED" && <Badge variant="danger">Falhou</Badge>}
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
      </div>
    </div>
  );
}
