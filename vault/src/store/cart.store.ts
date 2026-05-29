"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.gameId === item.gameId);
          if (existing) {
            return state; // Não duplicar — jogo digital, quantidade = 1
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (gameId) =>
        set((state) => ({
          items: state.items.filter((i) => i.gameId !== gameId),
        })),

      updateQuantity: (gameId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.gameId === gameId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "vault_cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
