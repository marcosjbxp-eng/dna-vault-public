"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart } from "lucide-react";

interface GameCardProps {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  price: number;
  genres: string[];
  developer: string;
}

export function GameCard({
  id,
  slug,
  title,
  coverUrl,
  price,
  genres,
  developer,
}: GameCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      gameId: id,
      title,
      coverUrl,
      price,
      quantity: 1,
      slug,
    });
  };

  return (
    <Link href={`/game/${slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        className="group bg-[--surface] border border-[--border] rounded-xl overflow-hidden transition-all duration-300 hover:border-[--ice-dim] hover:shadow-[0_0_0_1px_var(--ice-dim)]"
      >
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={coverUrl}
            alt={`Capa do jogo ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[--void] via-transparent to-transparent opacity-60" />

          {/* Quick add to cart */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 bg-[--flare] text-[#0A0C10] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            aria-label={`Adicionar ${title} ao carrinho`}
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="ice">
                {genre}
              </Badge>
            ))}
          </div>

          <h3 className="text-[--white] font-bold text-sm leading-tight truncate group-hover:text-[--flare] transition-colors">
            {title}
          </h3>

          <p className="text-xs text-[--smoke] truncate">{developer}</p>

          <p className="text-[--flare] font-mono font-bold text-lg">
            R$ {price.toFixed(2)}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
