"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Monitor, Calendar, Building2, Tag } from "lucide-react";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[--border]">
            <Image
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {game.genres.map((genre) => (
              <Badge key={genre} variant="ice">{genre}</Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[--white] leading-tight">
            {game.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-[--smoke]">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} /> {game.developer}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
            </span>
            <span className="flex items-center gap-1.5">
              <Monitor size={14} /> {game.platforms.join(", ")}
            </span>
          </div>

          {/* Price + Buy */}
          <div className="bg-[--surface] border border-[--border] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[--flare] font-mono font-bold text-3xl">
                R$ {game.price.toFixed(2)}
              </p>
              {inStock ? (
                <p className="text-xs text-[--success] mt-1 flex items-center gap-1">
                  <Tag size={12} /> Em estoque
                </p>
              ) : (
                <p className="text-xs text-[--danger] mt-1">Fora de estoque</p>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleBuy}
              disabled={!inStock}
              className="w-full sm:w-auto"
            >
              <ShoppingCart size={18} />
              Comprar Agora
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[--white]">Sobre o jogo</h2>
            <p className="text-[--mist] leading-relaxed whitespace-pre-line">
              {game.description}
            </p>
          </div>

          {/* Gallery */}
          {game.images.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[--white]">Screenshots</h2>
              <div className="grid grid-cols-2 gap-3">
                {game.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-xl overflow-hidden border border-[--border]"
                  >
                    <Image
                      src={img}
                      alt={`Screenshot ${i + 1} de ${game.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailer */}
          {game.trailerUrl && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[--white]">Trailer</h2>
              <div className="aspect-video rounded-xl overflow-hidden border border-[--border]">
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
  );
}
