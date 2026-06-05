"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Monitor,
  Calendar,
  Building2,
  Check,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";

interface GameDetailProps {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    coverUrl: string;
    images: string[];
    trailerUrl: string | null;
    price: number;
    genres: string[];
    platforms: string[];
    developer: string;
    publisher: string | null;
    releaseDate: string;
  };
  inStock: boolean;
}

export function GameDetailClient({ game, inStock }: GameDetailProps) {
  const { addItem, openCart } = useCartStore();

  const handleBuy = () => {
    addItem({
      gameId: game.id,
      title: game.title,
      coverUrl: game.coverUrl,
      price: game.price,
      quantity: 1,
      slug: game.slug,
    });
    openCart();
  };

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="relative">
      {/* Header banner — uses first image if available, otherwise cover */}
      <div className="relative aspect-[16/7] sm:aspect-[16/6] w-full overflow-hidden border-b border-[--border]">
        <Image
          src={game.images[0] ?? game.coverUrl}
          alt=""
          fill
          priority
          className="object-cover scale-110 blur-sm opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[--void]/40 via-[--void]/60 to-[--void]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cover + buy block (sticky on desktop) */}
          <motion.aside
            {...fadeUp}
            transition={{ duration: 0.5, ease }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden border border-[--border] bg-[--surface]">
                <Image
                  src={game.coverUrl}
                  alt={`Capa de ${game.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="bg-[--surface] border border-[--border] p-5 space-y-4">
                <div>
                  <p className="font-mono text-[10px] text-[--smoke] tracking-widest uppercase mb-1">
                    Preço
                  </p>
                  <p className="font-mono font-black text-[--flare] text-3xl leading-none">
                    R$ {game.price.toFixed(2).replace(".", ",")}
                  </p>
                  {inStock ? (
                    <p className="text-xs text-[--success] mt-2 flex items-center gap-1.5 font-semibold">
                      <Check size={12} strokeWidth={3} /> Em estoque
                    </p>
                  ) : (
                    <p className="text-xs text-[--danger] mt-2 font-semibold">
                      Fora de estoque
                    </p>
                  )}
                </div>

                <Button
                  size="lg"
                  onClick={handleBuy}
                  disabled={!inStock}
                  className="w-full"
                >
                  <ShoppingCart size={16} />
                  Comprar agora
                </Button>

                <ul className="space-y-2 pt-3 border-t border-[--border]">
                  <li className="flex items-center gap-2 text-xs text-[--mist]">
                    <Zap size={12} className="text-[--flare]" />
                    <span>Entrega imediata por e-mail</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[--mist]">
                    <ShieldCheck size={12} className="text-[--flare]" />
                    <span>Key 100% original e licenciada</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>

          {/* Detail content */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="lg:col-span-8 xl:col-span-9 space-y-10"
          >
            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="ice">
                    {genre}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[--white] leading-[0.95] tracking-tight">
                {game.title}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono tracking-wider uppercase text-[--smoke] mt-5">
                <span className="flex items-center gap-1.5">
                  <Building2 size={12} /> {game.developer}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Monitor size={12} /> {game.platforms.join(" · ")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-mono text-[11px] text-[--smoke] tracking-[0.25em] uppercase">
                — Sobre o jogo
              </h2>
              <p className="text-[--mist] text-base leading-relaxed whitespace-pre-line max-w-prose">
                {game.description}
              </p>
            </div>

            {game.images.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-mono text-[11px] text-[--smoke] tracking-[0.25em] uppercase">
                  — Screenshots
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-video overflow-hidden border border-[--border] bg-[--surface]"
                    >
                      <Image
                        src={img}
                        alt={`Screenshot ${i + 1} de ${game.title}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {game.trailerUrl && (
              <div className="space-y-4">
                <h2 className="font-mono text-[11px] text-[--smoke] tracking-[0.25em] uppercase">
                  — Trailer
                </h2>
                <div className="aspect-video overflow-hidden border border-[--border]">
                  <iframe
                    src={game.trailerUrl}
                    title={`Trailer de ${game.title}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
