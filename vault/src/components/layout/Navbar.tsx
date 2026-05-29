"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, User, Search, Menu, X, LogOut, Shield } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const { openCart, totalItems } = useCartStore();
  const count = totalItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[--void]/80 backdrop-blur-xl border-b border-[--border]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[--flare] rounded-sm flex items-center justify-center">
              <span className="text-[#0A0C10] font-extrabold text-sm">V</span>
            </div>
            <span className="text-[--white] font-extrabold text-xl tracking-tight group-hover:text-[--flare] transition-colors">
              VAULT
            </span>
          </Link>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-[--smoke] hover:text-[--white] transition-colors"
            >
              Início
            </Link>
            <Link
              href="/store"
              className="text-sm text-[--smoke] hover:text-[--white] transition-colors"
            >
              Loja
            </Link>
            <Link
              href="/library"
              className="text-sm text-[--smoke] hover:text-[--white] transition-colors"
            >
              Biblioteca
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="p-2 rounded-none text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors"
              aria-label="Buscar jogos"
            >
              <Search size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-none text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[--flare] text-[#0A0C10] text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-none text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
                  aria-label="Menu do usuário"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Usuário"}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 rounded-full object-cover border border-[--border]"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {user.name?.split(" ")[0] || "Conta"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[--surface] border border-[--border] rounded-none shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-[--border] text-xs">
                      <p className="font-bold text-[--white] truncate">{user.name}</p>
                      <p className="text-[--smoke] truncate text-[10px]">{user.email}</p>
                    </div>
                    
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-[--smoke] hover:text-[--white] hover:bg-[--panel] transition-colors"
                      >
                        <Shield size={14} className="text-[--flare]" />
                        <span>Painel Admin</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: "/store" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[--danger] hover:bg-[--panel]/50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/store"
                className="p-2 rounded-none text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors"
                aria-label="Login"
              >
                <User size={20} />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-none text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-[--border]/50 mt-2 pt-4 flex flex-col gap-3"
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[--smoke] hover:text-[--white] px-2 py-1"
            >
              Início
            </Link>
            <Link
              href="/store"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[--smoke] hover:text-[--white] px-2 py-1"
            >
              Loja
            </Link>
            <Link
              href="/library"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[--smoke] hover:text-[--white] px-2 py-1"
            >
              Biblioteca
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
