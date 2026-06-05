"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[var(--z-drawer-backdrop)]"
            onClick={closeCart}
            aria-label="Fechar carrinho"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-[--surface] z-[var(--z-drawer)] border-l border-[--border] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[--border]">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-black text-[--white] tracking-tight">
                  Carrinho
                </h2>
                <span className="font-mono text-xs text-[--smoke] tracking-wider">
                  {items.length.toString().padStart(2, "0")} ITEM{items.length === 1 ? "" : "S"}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-[--panel] text-[--smoke] hover:text-[--white] transition-colors cursor-pointer"
                aria-label="Fechar carrinho"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart
                    size={48}
                    className="text-[--border] mb-4"
                  />
                  <p className="text-[--smoke] text-sm">
                    Seu carrinho está vazio
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={closeCart}
                  >
                    Explorar Loja
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.gameId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-3 bg-[--panel] border border-[--border] p-3"
                    >
                      <div className="relative w-14 h-[72px] overflow-hidden flex-shrink-0">
                        <Image
                          src={item.coverUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[--white] truncate">
                          {item.title}
                        </h3>
                        <p className="text-[--flare] font-mono font-bold text-sm mt-1">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.gameId)}
                        className="p-1.5 self-start hover:bg-[--danger]/10 text-[--smoke] hover:text-[--danger] transition-colors cursor-pointer"
                        aria-label={`Remover ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-[--border] p-6 space-y-4 bg-[--surface]">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] text-[--smoke] tracking-widest uppercase">
                    Subtotal
                  </span>
                  <span className="text-2xl font-mono font-black text-[--flare]">
                    R$ {totalPrice().toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button className="w-full" size="lg">
                    Finalizar compra
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-[--smoke] tracking-wider font-mono uppercase">
                  Pagamento seguro · Mercado Pago
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
