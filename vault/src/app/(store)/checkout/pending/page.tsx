"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PendingContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 rounded-full bg-[--flare]/10 flex items-center justify-center"
        >
          <Clock size={40} className="text-[--flare]" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[--white]">
            Pagamento Pendente
          </h1>
          <p className="text-[--smoke]">
            Seu pagamento está sendo processado. Assim que for confirmado,
            suas keys serão liberadas automaticamente na sua biblioteca.
          </p>
        </div>

        {orderId && (
          <p className="text-xs text-[--smoke] font-mono bg-[--surface] border border-[--border] rounded-lg px-3 py-2 inline-block">
            Pedido: {orderId}
          </p>
        )}

        <div className="bg-[--surface] border border-[--border] rounded-xl p-4 flex items-start gap-3 text-left">
          <Mail size={18} className="text-[--ice] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[--smoke]">
            Você receberá uma notificação por e-mail assim que o pagamento
            for confirmado. Pagamentos via PIX ou boleto podem levar alguns
            minutos.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/library"
            className="flex items-center justify-center gap-2 bg-[--flare] text-[--void] font-bold py-3 px-6 rounded-none hover:bg-[--flare-dim] transition-colors"
          >
            Ir para Minha Biblioteca
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/store"
            className="text-sm text-[--ice] hover:text-[--ice-dim] transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="text-[--smoke]">Carregando...</span></div>}>
      <PendingContent />
    </Suspense>
  );
}
