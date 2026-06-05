"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PLATFORMS = ["Steam", "Epic Games", "PlayStation", "Xbox", "Ubisoft", "EA"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[--border]/50">
      {/* Signature vault-grid backdrop */}
      <div className="absolute inset-0 vault-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[--void] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid grid-cols-12 gap-6 items-end">
          {/* Left rail — eyebrow stack */}
          <div className="hidden lg:flex col-span-1 flex-col gap-3 pb-2">
            <span className="w-px h-12 bg-[--flare]" />
            <span className="font-mono text-[10px] text-[--smoke] [writing-mode:vertical-rl] rotate-180 tracking-widest">
              VAULT.STORE / 2026
            </span>
          </div>

          {/* Heading column */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[11px] text-[--flare] tracking-[0.3em] mb-5">
                — LOJA DE KEYS DIGITAIS
              </p>
              <h1 className="text-[clamp(2.75rem,8.5vw,6rem)] font-black text-[--white] leading-[0.95] tracking-[-0.04em]">
                O cofre dos
                <br />
                seus jogos<span className="text-[--flare]">.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[--mist] max-w-xl leading-relaxed"
            >
              Keys originais para Steam, Epic e PlayStation. Pague com PIX,
              receba na hora, jogue em segundos. Sem cadastros longos,
              sem espera, sem letras miúdas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link href="/store">
                <Button size="lg" className="w-full sm:w-auto group/cta">
                  <span>Explorar catálogo</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/cta:translate-x-1"
                  />
                </Button>
              </Link>
              <Link
                href="/store?filter=promo"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[--smoke] hover:text-[--white] transition-colors px-5 py-3 underline underline-offset-4 decoration-[--border] hover:decoration-[--flare]"
              >
                Ver promoções da semana
              </Link>
            </motion.div>
          </div>

          {/* Numeric right rail — vault keypad nod */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex col-span-3 flex-col items-end gap-3 pb-2"
          >
            <div className="font-mono text-[10px] text-[--smoke] tracking-widest">
              CATÁLOGO ATIVO
            </div>
            <div className="grid grid-cols-3 gap-1.5 w-fit">
              {["5", "0", "0", "+", "T", "I", "T", "U", "L"].map((c, i) => (
                <div
                  key={i}
                  className="w-9 h-9 border border-[--border] flex items-center justify-center font-mono text-xs text-[--mist] bg-[--surface]/40"
                >
                  {c}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform strip — concrete trust, no stat-grid trope */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-[--border]/60 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
        >
          <span className="font-mono text-[10px] text-[--smoke] tracking-[0.25em] uppercase shrink-0">
            Compatível com
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {PLATFORMS.map((p) => (
              <span
                key={p}
                className="text-sm font-semibold text-[--mist] hover:text-[--white] transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
