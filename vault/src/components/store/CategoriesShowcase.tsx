import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  { name: "Ação", count: "120+", accent: "from-[#FF5050]/30" },
  { name: "RPG", count: "85+", accent: "from-[#E8FF47]/30" },
  { name: "FPS", count: "60+", accent: "from-[#A8C4FF]/30" },
  { name: "Aventura", count: "95+", accent: "from-[#3DFFA0]/30" },
  { name: "Estratégia", count: "40+", accent: "from-[#A8C4FF]/30" },
  { name: "Indie", count: "150+", accent: "from-[#E8FF47]/30" },
];

export function CategoriesShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[--white] tracking-tight">
          Navegue por gênero
        </h2>
        <Link
          href="/store"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-[--smoke] hover:text-[--white] transition-colors"
        >
          Catálogo completo <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 border border-[--border]">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.name}
            href={`/store?genre=${encodeURIComponent(cat.name)}`}
            className={`group relative overflow-hidden bg-[--surface] hover:bg-[--panel] transition-colors p-5 sm:p-6 min-h-[120px] flex flex-col justify-between ${
              i % 2 === 1 ? "border-l border-[--border]" : ""
            } ${i >= 2 ? "sm:border-l" : ""} sm:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:border-l ${
              i >= 2 ? "border-t sm:border-t-0" : ""
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cat.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <div className="relative z-10 flex items-start justify-between">
              <span className="font-mono text-[10px] text-[--smoke] tracking-widest">
                {cat.count} JOGOS
              </span>
              <ArrowUpRight
                size={14}
                className="text-[--smoke] opacity-0 group-hover:opacity-100 group-hover:text-[--flare] transition-all duration-300 translate-y-1 group-hover:translate-y-0"
              />
            </div>
            <h3 className="relative z-10 text-xl sm:text-2xl font-extrabold text-[--white] tracking-tight">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
