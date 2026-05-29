"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[--border]/40 bg-[--void]">
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col items-center">
        {/* Badge estático premium */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="will-change-[transform,opacity] mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[--surface] border border-[--border] text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[--smoke] hover:text-[--white] transition-colors duration-300 rounded-none">
            <span>Sua coleção começa aqui</span>
          </div>
        </motion.div>

        {/* Hero Title & Description */}
        <div className="text-center space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="will-change-[transform,opacity] text-4xl sm:text-6xl md:text-7xl font-black text-[--white] leading-[1.05] tracking-tight"
          >
            Jogos digitais.
            <br />
            <span className="text-[--flare]">
              Entrega instantânea.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="will-change-[transform,opacity] text-sm sm:text-base md:text-lg text-[--smoke] max-w-2xl mx-auto leading-relaxed"
          >
            Keys originais e licenciadas com os melhores valores do mercado. 
            Pague com PIX ou Cartão e comece a jogar imediatamente no Steam, Epic ou Playstation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="will-change-[transform,opacity] pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/store" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs sm:text-sm px-8 rounded-none uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold">
                <span>Explorar Loja</span>
                <ArrowUpRight size={16} />
              </Button>
            </Link>
            <Link href="/store?filter=promo" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-xs sm:text-sm px-8 rounded-none uppercase tracking-wider font-bold">
                Ver Promoções
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Info panel below hero - Refatorado de forma minimalista sem caixas pesadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="will-change-[transform,opacity] mt-20 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[--border]/40 text-center"
        >
          {[
            { value: "500+", label: "Títulos Ativos" },
            { value: "100%", label: "Keys Originais", icon: Shield },
            { value: "PIX", label: "Envio Imediato" },
          ].map(({ value, label, icon: Icon }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center pt-6 sm:pt-0 sm:px-4 group"
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon size={18} className="text-[--smoke] group-hover:text-[--flare] transition-colors" />}
                <p className="text-2xl sm:text-3xl font-extrabold text-[--white] tracking-tight">
                  {value}
                </p>
              </div>
              <p className="text-[10px] text-[--smoke] uppercase tracking-widest mt-2 font-bold">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
