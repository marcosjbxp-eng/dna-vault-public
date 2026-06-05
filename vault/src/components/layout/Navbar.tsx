"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Shield,
  Library,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { clsx } from "clsx";

interface NavbarProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/store", label: "Loja" },
  { href: "/library", label: "Biblioteca" },
];

export function Navbar({ user }: NavbarProps) {
  const { openCart, totalItems } = useCartStore();
  const count = totalItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [userMenuOpen]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-300",
        scrolled
          ? "bg-[--void]/85 backdrop-blur-xl border-b border-[--border]/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-[--flare] flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-[--void] font-black text-sm">V</span>
            </div>
            <span className="text-[--white] font-black text-xl tracking-tight">
              VAULT
            </span>
          </Link>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-[--mist] hover:text-[--white] transition-colors relative group"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-px h-px bg-[--flare] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/store"
              className="p-2 text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors"
              aria-label="Buscar jogos"
            >
              <Search size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[--flare] text-[--void] text-[10px] font-black flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
                  aria-label="Menu do usuário"
                  aria-expanded={userMenuOpen}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Usuário"}
                      width={26}
                      height={26}
                      unoptimized
                      className="w-[26px] h-[26px] object-cover border border-[--border]"
                    />
                  ) : (
                    <div className="w-[26px] h-[26px] bg-[--panel] border border-[--border] flex items-center justify-center">
                      <User size={14} />
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {user.name?.split(" ")[0] || "Conta"}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[--surface] border border-[--border] shadow-xl shadow-black/40 z-[var(--z-dropdown)]"
                    >
                      <div className="px-4 py-3 border-b border-[--border]">
                        <p className="font-bold text-[--white] truncate text-sm">
                          {user.name}
                        </p>
                        <p className="text-[--smoke] truncate text-[11px] mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/library"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[--mist] hover:text-[--white] hover:bg-[--panel] transition-colors"
                      >
                        <Library size={14} />
                        <span>Minha biblioteca</span>
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[--mist] hover:text-[--white] hover:bg-[--panel] transition-colors"
                        >
                          <Shield size={14} className="text-[--flare]" />
                          <span>Painel admin</span>
                        </Link>
                      )}

                      <div className="border-t border-[--border]">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[--danger] hover:bg-[--danger]/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sair</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/"
                className="ml-2 inline-flex items-center px-4 py-2 bg-[--flare] text-[--void] text-xs font-black tracking-wider uppercase hover:bg-[--white] transition-colors"
              >
                Entrar
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 ml-1 text-[--smoke] hover:text-[--white] hover:bg-[--surface] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-[--border]/50"
            >
              <div className="py-3 flex flex-col">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-[--mist] hover:text-[--flare] hover:bg-[--surface] px-3 py-3 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
