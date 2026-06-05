"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui";

export default function CartPage() {
  const { items, removeItem, totalPrice, clearCart } = useCartStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] text-[--flare] tracking-[0.3em] mb-3">
          — CARRINHO
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-[--white] mb-12 tracking-tight">
          Confira seu pedido
        </h1>

        {items.length === 0 ? (
          <div className="border border-[--border] bg-[--surface] p-12 text-center flex flex-col items-center">
            <ShoppingCart size={40} className="text-[--border] mb-4" />
            <p className="text-[--mist] text-lg font-semibold">
              Seu carrinho está vazio
            </p>
            <p className="text-[--smoke] text-sm mt-1 mb-6">
              Comece a explorar o catálogo e adicione jogos para sua coleção.
            </p>
            <Link href="/store">
              <Button>Explorar catálogo</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="border border-[--border] bg-[--surface] divide-y divide-[--border]">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.gameId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 p-4 sm:p-5"
                    >
                      <Link
                        href={`/game/${item.slug}`}
                        className="relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden flex-shrink-0 border border-[--border]"
                      >
                        <Image
                          src={item.coverUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/game/${item.slug}`}
                          className="block text-[--white] font-bold hover:text-[--flare] transition-colors truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="font-mono text-[10px] text-[--smoke] tracking-widest uppercase mt-1">
                          Key digital · entrega imediata
                        </p>
                      </div>
                      <p className="font-mono font-black text-[--flare] text-lg sm:text-xl flex-shrink-0">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </p>
                      <button
                        onClick={() => removeItem(item.gameId)}
                        className="p-2 hover:bg-[--danger]/10 text-[--smoke] hover:text-[--danger] transition-colors cursor-pointer"
                        aria-label={`Remover ${item.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between mt-4 px-1">
                <Link
                  href="/store"
                  className="text-sm text-[--smoke] hover:text-[--white] transition-colors"
                >
                  ← Continuar comprando
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[--danger] hover:underline cursor-pointer"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="border border-[--border] bg-[--surface] p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-mono text-[11px] text-[--smoke] tracking-[0.25em] uppercase mb-5">
                Resumo do pedido
              </h2>

              <div className="space-y-3 pb-5 border-b border-[--border]">
                <div className="flex justify-between text-sm">
                  <span className="text-[--smoke]">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </span>
                  <span className="font-mono text-[--mist]">
                    R$ {totalPrice().toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[--smoke]">Taxa de processamento</span>
                  <span className="font-mono text-[--success]">Grátis</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between py-5">
                <span className="text-[--white] font-black text-lg">Total</span>
                <span className="text-3xl font-mono font-black text-[--flare]">
                  R$ {totalPrice().toFixed(2).replace(".", ",")}
                </span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Finalizar compra <ArrowRight size={16} />
                </Button>
              </Link>

              <p className="text-[10px] text-center text-[--smoke] tracking-wider font-mono uppercase mt-4">
                Pagamento seguro · PIX · Cartão
              </p>
            </aside>
          </div>
        )}
      </motion.div>
    </div>
  );
}
