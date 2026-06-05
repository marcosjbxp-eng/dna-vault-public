"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Plus } from "lucide-react";
import { clsx } from "clsx";

interface GameCardProps {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  price: number;
  genres: string[];
  developer: string;
  variant?: "default" | "wide";
}

export function GameCard({
  id,
  slug,
  title,
  coverUrl,
  price,
  genres,
  developer,
  variant = "default",
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
    <Link href={`/game/${slug}`} className="group block relative">
      <article
        className={clsx(
          "relative bg-[--surface] border border-[--border]",
          "transition-colors duration-300 group-hover:border-[--flare]/60",
          "h-full flex flex-col"
        )}
      >
        {/* Cover */}
        <div
          className={clsx(
            "relative overflow-hidden",
            variant === "wide" ? "aspect-[16/9]" : "aspect-[3/4]"
          )}
        >
          <Image
            src={coverUrl}
            alt={`Capa do jogo ${title}`}
            fill
            sizes={
              variant === "wide"
                ? "(max-width: 1024px) 100vw, 50vw"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            }
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />

          {/* Bottom gradient for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[--void] via-[--void]/60 to-transparent" />

          {/* Price tag — bottom-left, sits on cover */}
          <div className="absolute bottom-3 left-3 right-14">
            <p className="font-mono font-bold text-[--flare] text-lg sm:text-xl leading-none">
              R$ {price.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Quick add to cart */}
          <button
            onClick={handleAddToCart}
            className={clsx(
              "absolute bottom-3 right-3 w-10 h-10",
              "flex items-center justify-center",
              "bg-[--flare] text-[--void]",
              "translate-y-1 opacity-0",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "transition-all duration-300 ease-out",
              "hover:bg-[--white]",
              "focus-visible:translate-y-0 focus-visible:opacity-100"
            )}
            aria-label={`Adicionar ${title} ao carrinho`}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          {/* Corner ticks — brand signature on hover */}
          <span className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l border-[--flare] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r border-[--flare] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[--smoke]">
            <span>{genres[0] ?? "Game"}</span>
            <span className="text-[--border]">/</span>
            <span className="truncate">{developer}</span>
          </div>

          <h3 className="text-[--white] font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[--flare] transition-colors">
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
