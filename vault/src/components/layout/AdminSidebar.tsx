"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Gamepad2,
  KeyRound,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Jogos", icon: Gamepad2 },
  { href: "/admin/keys", label: "Keys", icon: KeyRound },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[--surface] border-r border-[--border] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[--border]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[--flare] rounded-lg flex items-center justify-center">
            <span className="text-[#0A0C10] font-extrabold text-sm">V</span>
          </div>
          <div>
            <span className="text-[--white] font-extrabold text-lg">VAULT</span>
            <p className="text-[10px] text-[--smoke] uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[--flare]/10 text-[--flare]"
                  : "text-[--smoke] hover:text-[--white] hover:bg-[--panel]"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="p-4 border-t border-[--border]">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[--smoke] hover:text-[--ice] transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar à Loja
        </Link>
      </div>
    </aside>
  );
}
