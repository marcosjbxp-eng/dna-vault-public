"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            gameId: i.gameId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao processar checkout");
      }

      const data = await res.json();

      // Redirect to Mercado Pago (production)
      if (data.initPoint) {
        clearCart();
        window.location.href = data.initPoint;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido"
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[--smoke] text-lg">
          Nenhum item no carrinho para finalizar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-[--white]">Checkout</h1>
          <p className="text-[--smoke] mt-1">Revise seu pedido e finalize a compra.</p>
        </div>

        {/* Order summary */}
        <div className="bg-[--surface] border border-[--border] rounded-xl divide-y divide-[--border]">
          {items.map((item) => (
            <div key={item.gameId} className="flex items-center gap-4 p-4">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[--white] truncate">
                  {item.title}
                </p>
                <p className="text-xs text-[--smoke]">Qtd: {item.quantity}</p>
              </div>
              <p className="text-[--flare] font-mono font-bold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="p-4 flex justify-between items-center">
            <span className="text-[--white] font-bold">Total</span>
            <span className="text-2xl font-mono font-bold text-[--flare]">
              R$ {totalPrice().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-[--panel] border border-[--border] rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck size={20} className="text-[--success] flex-shrink-0" />
          <p className="text-sm text-[--smoke]">
            Pagamento seguro processado pelo Mercado Pago. PIX, cartão de
            crédito ou boleto.
          </p>
        </div>

        {error && (
          <div className="bg-[--danger]/10 border border-[--danger]/30 text-[--danger] rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Pay button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleCheckout}
          loading={loading}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Pagar R$ {totalPrice().toFixed(2)}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
