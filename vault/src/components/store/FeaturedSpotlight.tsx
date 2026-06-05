"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui";
import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { GameCard } from "./GameCard";

interface SpotlightGame {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  price: number;
  genres: string[];
  developer: string;
}

interface FeaturedSpotlightProps {
  hero: SpotlightGame;
  side: SpotlightGame[];
}

export function FeaturedSpotlight({ hero, side }: FeaturedSpotlightProps) {
  const { addItem, openCart } = useCartStore();

  const handleBuy = () => {
    addItem({
      gameId: hero.id,
      title: hero.title,
      coverUrl: hero.coverUrl,
      price: hero.price,
      quantity: 1,
      slug: hero.slug,
    });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Hero card */}
      <article className="lg:col-span-7 relative group border border-[--border] bg-[--surface] overflow-hidden">
        <Link href={`/game/${hero.slug}`} className="block">
          <div className="relative aspect-[16/10] lg:aspect-[16/11] overflow-hidden">
            <Image
              src={hero.coverUrl}
              alt={hero.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[--void] via-[--void]/40 to-transparent" />
          </div>
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[--flare]">
            <span className="w-6 h-px bg-[--flare]" />
            <span>Destaque da semana</span>
          </div>
          <Link href={`/game/${hero.slug}`}>
            <h3 className="text-3xl sm:text-5xl font-black text-[--white] leading-[0.95] tracking-tight max-w-2xl hover:text-[--flare] transition-colors">
              {hero.title}
            </h3>
          </Link>
          <p className="text-sm text-[--smoke] font-mono tracking-wider uppercase">
            {hero.developer} · {hero.genres.slice(0, 2).join(" · ")}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <p className="font-mono font-bold text-[--flare] text-2xl sm:text-3xl">
              R$ {hero.price.toFixed(2).replace(".", ",")}
            </p>
            <Button onClick={handleBuy} size="md">
              <ShoppingCart size={16} />
              <span>Comprar</span>
            </Button>
            <Link
              href={`/game/${hero.slug}`}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[--mist] hover:text-[--white] transition-colors"
            >
              Detalhes <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </article>

      {/* Side stack */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
        {side.slice(0, 4).map((g) => (
          <GameCard key={g.id} {...g} />
        ))}
      </div>
    </div>
  );
}
