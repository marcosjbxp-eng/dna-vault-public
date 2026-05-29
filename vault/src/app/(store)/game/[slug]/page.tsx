import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GameDetailClient } from "./GameDetailClient";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) return { title: "Jogo não encontrado" };
  return {
    title: `${game.title} — VAULT`,
    description: game.description.slice(0, 160),
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let game;
  try {
    game = await prisma.game.findUnique({
      where: { slug, active: true },
      include: {
        _count: { select: { keys: { where: { status: "AVAILABLE" } } } },
      },
    });
  } catch {
    game = null;
  }

  if (!game) notFound();

  return (
    <GameDetailClient
      game={{
        ...game,
        price: Number(game.price),
        releaseDate: game.releaseDate.toISOString(),
      }}
      inStock={game._count.keys > 0}
    />
  );
}
