import { HeroSection } from "@/components/store/HeroSection";
import { GameGrid } from "@/components/store/GameGrid";
import { FeaturedSpotlight } from "@/components/store/FeaturedSpotlight";
import { TrustStrip } from "@/components/store/TrustStrip";
import { CategoriesShowcase } from "@/components/store/CategoriesShowcase";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

async function getFeaturedGames() {
  try {
    return await prisma.game.findMany({
      where: { active: true, featured: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch featured games:", error);
    return [];
  }
}

async function getNewReleases() {
  try {
    return await prisma.game.findMany({
      where: { active: true },
      take: 10,
      orderBy: { releaseDate: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch new releases:", error);
    return [];
  }
}

function SectionHeader({
  kicker,
  title,
  href,
  hrefLabel = "Ver todos",
}: {
  kicker: string;
  title: string;
  href: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8">
      <div>
        <p className="font-mono text-[10px] text-[--flare] tracking-[0.3em] mb-3">
          — {kicker}
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[--white] tracking-tight">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[--smoke] hover:text-[--flare] transition-colors group/link shrink-0"
      >
        {hrefLabel}
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [featuredGames, newReleases] = await Promise.all([
    getFeaturedGames(),
    getNewReleases(),
  ]);

  const normalize = (g: { price: unknown } & Record<string, unknown>) => ({
    ...g,
    price: Number(g.price),
  });

  const featured = featuredGames.map(normalize);
  const releases = newReleases.map(normalize);

  // Spotlight uses first featured (or first release) + next 4
  const heroPick = featured[0] ?? releases[0];
  const sidePicks = (featured.length > 0 ? featured : releases).slice(1, 5);

  return (
    <div className="flex flex-col">
      <HeroSection />

      <TrustStrip />

      {/* Featured spotlight — only when we have a hero candidate */}
      {heroPick && sidePicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
          <SectionHeader
            kicker="EM DESTAQUE"
            title="Selecionados pelo time"
            href="/store?filter=featured"
          />
          <FeaturedSpotlight
            // @ts-expect-error normalized
            hero={heroPick}
            // @ts-expect-error normalized
            side={sidePicks}
          />
        </section>
      )}

      {/* Categories */}
      <div className="mt-24">
        <CategoriesShowcase />
      </div>

      {/* New releases */}
      {releases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
          <SectionHeader
            kicker="RECÉM-CHEGADOS"
            title="Lançamentos da semana"
            href="/store?filter=new"
          />
          {/* @ts-expect-error normalized */}
          <GameGrid games={releases.slice(0, 10)} />
        </section>
      )}

      {/* All featured — fallback grid for browsing */}
      {featured.length > 5 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
          <SectionHeader
            kicker="MAIS QUERIDOS"
            title="Top da casa"
            href="/store"
          />
          {/* @ts-expect-error normalized */}
          <GameGrid games={featured.slice(0, 10)} />
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-28 mb-28">
        <div className="relative border border-[--border] bg-[--surface] overflow-hidden">
          <div className="absolute inset-0 vault-grid opacity-50 pointer-events-none" />
          <div className="relative p-8 sm:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-mono text-[10px] text-[--flare] tracking-[0.3em] mb-4">
                — COMECE AGORA
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-[--white] leading-[0.95] tracking-tight">
                Encontre seu próximo jogo
                <span className="text-[--flare]">.</span>
              </h2>
              <p className="text-[--smoke] mt-5 max-w-md leading-relaxed">
                Mais de 500 títulos catalogados, com filtro por plataforma,
                gênero e faixa de preço. Sem rolagem infinita de promessas vazias.
              </p>
            </div>
            <div className="md:justify-self-end flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/store"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[--flare] text-[--void] font-bold text-sm uppercase tracking-wider hover:bg-[--white] transition-colors"
              >
                Ver catálogo <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/store?filter=promo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[--border] text-[--mist] font-semibold text-sm uppercase tracking-wider hover:border-[--flare] hover:text-[--white] transition-colors"
              >
                Promoções
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
