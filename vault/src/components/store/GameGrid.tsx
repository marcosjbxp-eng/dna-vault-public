"use client";

import { motion, type Variants } from "framer-motion";
import { GameCard } from "./GameCard";

interface GameGridProps {
  games: {
    id: string;
    slug: string;
    title: string;
    coverUrl: string;
    price: number;
    genres: string[];
    developer: string;
  }[];
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[--smoke] text-lg">Nenhum jogo encontrado.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
    >
      {games.map((game) => (
        <motion.div variants={item} key={game.id}>
          <GameCard {...game} />
        </motion.div>
      ))}
    </motion.div>
  );
}
