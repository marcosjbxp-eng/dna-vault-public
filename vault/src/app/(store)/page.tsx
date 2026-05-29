import { HeroSection } from "@/components/store/HeroSection";
import { GameGrid } from "@/components/store/GameGrid";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui";

export const revalidate = 3600; // ISR: revalidate every hour

async function getFeaturedGames() {
  try {
    return await prisma.game.findMany({
      where: { active: true, featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch featured games:", error);
    return []; // Return empty array if DB is not ready
  }
}

async function getNewReleases() {
  try {
    return await prisma.game.findMany({
      where: { active: true },
      take: 5,
      orderBy: { releaseDate: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch new releases:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredGames, newReleases] = await Promise.all([
    getFeaturedGames(),
    getNewReleases(),
  ]);

  return (
    <div className="flex flex-col gap-24 pb-24">
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[--white]">
              Destaques
            </h2>
            <p className="text-[--smoke] mt-1">Os jogos mais aclamados do momento.</p>
          </div>
          <Link href="/store?filter=featured">
            <Button variant="ghost">Ver Todos</Button>
          </Link>
        </div>
        
        <GameGrid
          games={featuredGames.map(g => ({
            ...g,
            price: Number(g.price)
          }))}
        />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[--white]">
              Lançamentos
            </h2>
            <p className="text-[--smoke] mt-1">Novidades recém-chegadas na VAULT.</p>
          </div>
          <Link href="/store?filter=new">
            <Button variant="ghost">Ver Todos</Button>
          </Link>
        </div>
        
        <GameGrid
          games={newReleases.map(g => ({
            ...g,
            price: Number(g.price)
          }))}
        />
      </section>
    </div>
  );
}
