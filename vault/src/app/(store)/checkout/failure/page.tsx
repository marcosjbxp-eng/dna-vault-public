"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function FailureContent() {
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
          className="mx-auto w-20 h-20 rounded-full bg-[--danger]/10 flex items-center justify-center"
        >
          <XCircle size={40} className="text-[--danger]" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[--white]">
            Pagamento não Aprovado
          </h1>
          <p className="text-[--smoke]">
            O pagamento foi recusado ou cancelado. Nenhuma cobrança foi
            realizada. Suas keys reservadas foram liberadas.
          </p>
        </div>

        {orderId && (
          <p className="text-xs text-[--smoke] font-mono bg-[--surface] border border-[--border] rounded-lg px-3 py-2 inline-block">
            Pedido: {orderId}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 bg-[--flare] text-[--void] font-bold py-3 px-6 rounded-none hover:bg-[--flare-dim] transition-colors"
          >
            <RefreshCw size={18} />
            Tentar Novamente
          </Link>
          <Link
            href="/store"
            className="flex items-center justify-center gap-2 text-sm text-[--ice] hover:text-[--ice-dim] transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar à Loja
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="text-[--smoke]">Carregando...</span></div>}>
      <FailureContent />
    </Suspense>
  );
}
