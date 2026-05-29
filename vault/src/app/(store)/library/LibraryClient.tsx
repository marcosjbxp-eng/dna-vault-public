"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { KeyRound, Package } from "lucide-react";
import { Badge } from "@/components/ui";
import { useState } from "react";

interface LibraryOrder {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: Array<{
    game: { title: string; coverUrl: string; slug: string };
    price: number;
  }>;
  keys: Array<{ code: string; status: string; game: { title: string } }>;
}

export function LibraryClient({ orders }: { orders: LibraryOrder[] }) {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const toggleKey = (code: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-[--white] mb-2">Minha Biblioteca</h1>
        <p className="text-[--smoke] mb-8">Seus jogos comprados e keys entregues.</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Package size={48} className="mx-auto text-[--border]" />
            <p className="text-[--smoke]">Nenhuma compra realizada ainda.</p>
            <Link href="/store" className="text-[--ice] hover:underline text-sm">
              Explorar Loja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[--surface] border border-[--border] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[--border] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Entregue</Badge>
                    <span className="text-xs text-[--smoke]">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[--flare]">
                    R$ {order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="divide-y divide-[--border]">
                  {order.items.map((item, i) => {
                    const key = order.keys.find((k) => k.game.title === item.game.title);
                    return (
                      <div key={i} className="flex items-center gap-4 p-4">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.game.coverUrl} alt={item.game.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/game/${item.game.slug}`} className="text-sm font-semibold text-[--white] hover:text-[--ice]">
                            {item.game.title}
                          </Link>
                        </div>
                        {key && (
                          <button onClick={() => toggleKey(key.code)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[--panel] rounded-lg text-xs cursor-pointer" aria-label="Revelar key">
                            <KeyRound size={14} className="text-[--success]" />
                            <span className="font-mono text-[--success]">
                              {revealedKeys.has(key.code) ? key.code : "••••-••••-••••"}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
