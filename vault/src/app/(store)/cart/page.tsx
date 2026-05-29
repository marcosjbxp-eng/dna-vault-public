"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui";

export default function CartPage() {
  const { items, removeItem, totalPrice, clearCart } = useCartStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-[--white] mb-8">
          Carrinho
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-[--smoke] text-lg">Seu carrinho está vazio.</p>
            <Link href="/store">
              <Button variant="secondary">Explorar Loja</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.gameId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 bg-[--surface] border border-[--border] rounded-xl p-4"
                >
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/game/${item.slug}`}
                      className="text-[--white] font-semibold text-sm hover:text-[--ice] transition-colors"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <p className="text-[--flare] font-mono font-bold text-lg flex-shrink-0">
                    R$ {item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.gameId)}
                    className="p-2 rounded-lg hover:bg-[--danger]/10 text-[--smoke] hover:text-[--danger] transition-colors cursor-pointer"
                    aria-label={`Remover ${item.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-[--surface] border border-[--border] rounded-xl p-6 space-y-4">
              <div className="flex justify-between text-sm text-[--smoke]">
                <span>{items.length} item(s)</span>
                <button
                  onClick={clearCart}
                  className="text-[--danger] hover:underline text-xs cursor-pointer"
                >
                  Limpar carrinho
                </button>
              </div>
              <div className="border-t border-[--border] pt-4 flex items-center justify-between">
                <span className="text-[--white] font-bold">Total</span>
                <span className="text-2xl font-mono font-bold text-[--flare]">
                  R$ {totalPrice().toFixed(2)}
                </span>
              </div>
              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
